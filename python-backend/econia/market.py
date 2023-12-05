from os import environ
from typing import Optional, Tuple

from aptos_sdk.account import Account
from aptos_sdk.account_address import AccountAddress
from aptos_sdk.bcs import Serializer, encoder
from aptos_sdk.client import FaucetClient, RestClient
from aptos_sdk.transactions import EntryFunction, ModuleId
from aptos_sdk.type_tag import StructTag, TypeTag

from econia_sdk.entry.market import (
    cancel_all_orders_user,
    change_order_size_user,
    place_limit_order_user_entry,
    place_market_order_user_entry,
    register_market_base_coin_from_coinstore,
    swap_between_coinstores_entry,
)
from econia_sdk.entry.registry import set_recognized_market
from econia_sdk.entry.user import deposit_from_coinstore, register_market_account
from econia_sdk.lib import EconiaClient, EconiaViewer
from econia_sdk.types import Restriction, SelfMatchBehavior, Side
from econia_sdk.view.market import get_open_orders_all, get_price_levels
from econia_sdk.view.registry import (
    get_market_id_base_coin,
    get_market_registration_events,
)
from econia_sdk.view.user import (
    get_cancel_order_events,
    get_fill_events,
    get_market_account,
    get_place_limit_order_events,
)

"""
HOW TO RUN THIS SCRIPT: poetry install && poetry run trade in /econia/src/python/sdk

See instructions in /econia/src/docker/README.md to see how to run this script against
a local deployment of Econia, including the data service stack.

There are several prompts; entering nothing for all of them will result in:
- Running against a local deployment of the data service stack.
- No market will be listed as recognized.
"""

U64_MAX = (2**64) - 1
COIN_TYPE_APT = "0x1::aptos_coin::AptosCoin"
MIN_SIZE = 500
ECONIA_ADDR = (AccountAddress.from_hex(
    "0x1bacdb8e2c4bfe3b915d1bfe1c20f5c1dae2a49828804b3d55248b744c8bc5ae"))
ECONIA_ACCT = Account.load_key(
    "0xABE315150D3A39884788EC47F8CC11DB1729C6D4F30557F6DA169F5208E7B2DD")
FAUCET_ADDR = AccountAddress.from_hex(
    "0x1bacdb8e2c4bfe3b915d1bfe1c20f5c1dae2a49828804b3d55248b744c8bc5ae")
COIN_TYPE_EAPT = f"{FAUCET_ADDR}::example_apt::ExampleAPT"
COIN_TYPE_EUSDC = f"{FAUCET_ADDR}::example_usdc::ExampleUSDC"
NODE_URL = "http://0.0.0.0:8080/v1"
FAUCET_URL = "http://0.0.0.0:8081"
MARKET_CREATOR = Account.generate()

rest_client = RestClient(NODE_URL)
faucet_client = FaucetClient(FAUCET_URL, rest_client)
viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)

txn_hash_buffer = []


def start():
    print("NODE_URL:", NODE_URL)
    rest_client = RestClient(NODE_URL)
    faucet_client = FaucetClient(FAUCET_URL, rest_client)
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)

    input("\nPress enter to initialize (or obtain) the market.")
    market_id = setup_market(faucet_client, viewer)
    dump_txns()

    bids_price, asks_price = get_best_prices(viewer, market_id)
    if bids_price is not None or asks_price is not None:
        input("\n\nPress enter to clean-up open orders on the market.")
        account_ = setup_new_account(
            viewer, faucet_client, market_id, 1000000, 1000000)
        if bids_price is not None:
            place_market_order(Side.ASK, account_, market_id, 1000000)
        if asks_price is not None:
            place_market_order(Side.BID, account_, market_id, 1000000)

        dump_txns()
        n_clears = len(get_fill_events(
            viewer, account_.account_address, market_id, 0))
        print(f"Cleared {n_clears} orders off of the market!")
        report_best_price_levels(viewer, market_id)
    else:
        print("There are no open orders on this market right now.")

    input("\n\nPress enter to setup an Account A with funds.")
    account_A = setup_new_account(viewer, faucet_client, market_id)
    print(f"Account A was setup: {account_A.account_address}")
    dump_txns()

    input("\n\nPress enter to place limit orders with Account A.")
    # Bid to purchase 1 whole eAPT
    buy_base_lots = 1 * (10**3)
    buy_ticks_per_lot = 1 * (10**3)
    place_limit_order(Side.BID, account_A, market_id,
                      buy_base_lots, buy_ticks_per_lot)
    events = get_place_limit_order_events(
        viewer, account_A.account_address, market_id, 0
    )
    report_place_limit_order_event(
        next(filter(lambda ev: ev["data"]["side"] == Side.BID, events))
    )
    # Ask to sell 1 whole eAPT
    sell_base_lots = 1 * (10**3)
    sell_ticks_per_lot = 2 * (10**3)
    place_limit_order(
        Side.ASK, account_A, market_id, sell_base_lots, sell_ticks_per_lot
    )
    events = get_place_limit_order_events(
        viewer, account_A.account_address, market_id, 0
    )
    report_place_limit_order_event(
        next(filter(lambda ev: ev["data"]["side"] == Side.ASK, events))
    )
    print(f"Account A has finished placing limit orders.")
    fills = get_fill_events(viewer, account_A.account_address, market_id, 0)
    n_fills = len(fills)
    if n_fills == 0:
        print("  * There were no limit orders filled by any orders placed.")
    else:
        print(
            f"  * There were {n_fills} limit orders filled by the orders placed.")
    dump_txns()
    report_best_price_levels(viewer, market_id)

    input("\n\nPress enter to change Account A's order sizes.")
    (bids, asks) = get_order_ids(account_A.account_address, market_id)
    bid_size = 0
    for (i, bid) in enumerate(bids):
        bid_size_new = bid["size"] * (i + 2)
        bid_size = (bid_size + bid_size_new,)
        exec_txn(
            EconiaClient(NODE_URL, ECONIA_ADDR, account_A),
            change_order_size_user(
                ECONIA_ADDR,
                market_id,
                Side.BID,
                bid["market_order_id"],
                bid_size_new,
            ),
            f"Increase bid order size (#{i + 1})",
        )
    ask_size = 0
    for (i, ask) in enumerate(asks):
        ask_size_new = ask["size"] // (i + 2)
        ask_size = (ask_size + ask_size_new,)
        exec_txn(
            EconiaClient(NODE_URL, ECONIA_ADDR, account_A),
            change_order_size_user(
                ECONIA_ADDR,
                market_id,
                Side.ASK,
                ask["market_order_id"],
                ask_size_new,
            ),
            f"Decrease ask order size (#{i + 1})",
        )
    dump_txns()

    input("\n\nPress enter to swap with Account A.")
    calldata = swap_between_coinstores_entry(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(COIN_TYPE_EAPT)),
        TypeTag(StructTag.from_str(COIN_TYPE_EUSDC)),
        market_id,
        ECONIA_ADDR,
        Side.BID,
        0,
        U64_MAX,
        0,
        U64_MAX,
        U64_MAX >> 32,
    )
    exec_txn(
        EconiaClient(NODE_URL, ECONIA_ADDR, account_A),
        calldata,
        "Execute BID swap order for Account A",
    )
    calldata = swap_between_coinstores_entry(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(COIN_TYPE_EAPT)),
        TypeTag(StructTag.from_str(COIN_TYPE_EUSDC)),
        market_id,
        ECONIA_ADDR,
        Side.ASK,
        0,
        U64_MAX,
        0,
        U64_MAX,
        0,
    )
    exec_txn(
        EconiaClient(NODE_URL, ECONIA_ADDR, account_A),
        calldata,
        "Execute ASK swap order for Account A",
    )
    dump_txns()

    input("\n\nPress enter to place limit orders with Account A (again).")
    place_limit_order(Side.BID, account_A, market_id,
                      buy_base_lots, buy_ticks_per_lot)
    place_limit_order(
        Side.ASK, account_A, market_id, sell_base_lots, sell_ticks_per_lot
    )
    dump_txns()

    input("\n\nPress enter to setup an Account B with funds.")
    account_B = setup_new_account(viewer, faucet_client, market_id)
    print(f"Account B was setup: {account_B.account_address}")
    dump_txns()

    input("\n\nPress enter to place market orders (buy and sell) with Account B.")
    place_market_order(Side.BID, account_B, market_id, 500)  # Buy 0.5 eAPT
    place_market_order(Side.ASK, account_B, market_id, 500)  # Sell 0.5 eAPT
    fill_size = len(get_fill_events(
        viewer, account_B.account_address, market_id, 0))
    print(f"Account B has finished placing 2 market orders.")
    print(f"  * This resulted in {fill_size} limit orders getting filled.")
    dump_txns()
    report_best_price_levels(viewer, market_id)

    input("\n\nPress enter to cancel all of Account A's outstanding orders")
    client_A = EconiaClient(NODE_URL, ECONIA_ADDR, account_A)
    calldata1 = cancel_all_orders_user(ECONIA_ADDR, market_id, Side.ASK)
    exec_txn(client_A, calldata1, "Cancel all ASKS for Account A")
    calldata2 = cancel_all_orders_user(ECONIA_ADDR, market_id, Side.BID)
    exec_txn(client_A, calldata2, "Cancel all BIDS for Account A:")
    cancel_size = len(
        get_cancel_order_events(
            viewer, account_A.account_address, market_id, 0)
    )
    print(f"Account A has cancelled all {cancel_size} of their orders.")
    dump_txns()
    report_best_price_levels(viewer, market_id)

    input(
        "\n\nPress enter to place competitive limit orders (top-of-book) with Account A."
    )
    _, start_ask_price = place_limit_orders_at_market(
        viewer, account_A, market_id, 500, buy_ticks_per_lot, sell_ticks_per_lot
    )
    place_limit_orders_at_market(
        viewer, account_A, market_id, 600, buy_ticks_per_lot, sell_ticks_per_lot
    )
    place_limit_orders_at_market(
        viewer, account_A, market_id, 700, buy_ticks_per_lot, sell_ticks_per_lot
    )
    place_limit_orders_at_market(
        viewer, account_A, market_id, 800, buy_ticks_per_lot, sell_ticks_per_lot
    )
    place_limit_orders_at_market(
        viewer, account_A, market_id, 900, buy_ticks_per_lot, sell_ticks_per_lot
    )
    print("Account A has created multiple competitive limit orders!")
    dump_txns()
    report_best_price_levels(viewer, market_id)

    if start_ask_price == None:
        exit()

    input(
        "\n\nPress enter to place spread-crossing limit order with Account B (no remainder)."
    )
    equal_volume = 500 + 600 + 700 + 800 + 900
    place_limit_order(Side.ASK, account_B, market_id,
                      equal_volume, buy_ticks_per_lot)
    fills = get_fill_events(viewer, account_B.account_address, market_id, 0)
    report_fill_events(fills)
    opens = get_open_orders_all(viewer, market_id)
    open_orders = opens["asks"]
    open_orders.extend(opens["bids"])
    report_order_for_last_fill(fills, open_orders)

    input(
        "\n\nPress enter to place spread-crossing limit order with Account B (w/ remainder)."
    )
    greater_volume = equal_volume * 2
    place_limit_order(Side.BID, account_B, market_id,
                      greater_volume, start_ask_price)
    fills = get_fill_events(viewer, account_B.account_address, market_id, 0)
    report_fill_events(fills)
    opens = get_open_orders_all(viewer, market_id)
    open_orders = opens["asks"]
    open_orders.extend(opens["bids"])
    report_order_for_last_fill(fills, open_orders)

    print("\n\nTHE END!")


def get_order_ids(account_address: AccountAddress, market_id: int) -> Tuple[set, set]:
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
    market_account = get_market_account(viewer, account_address, market_id, 0)
    return (market_account["bids"], market_account["asks"])


def place_market_order(
    direction: Side,
    account: Account,
    market_id: int,
    size_lots_of_base: int,
):
    print("Placing Market Order")
    calldata = place_market_order_user_entry(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(COIN_TYPE_EAPT)),
        TypeTag(StructTag.from_str(COIN_TYPE_EUSDC)),
        market_id,
        ECONIA_ADDR,
        direction,
        size_lots_of_base,
        SelfMatchBehavior.CancelMaker,
    )
    note = "ASK/SELL" if direction == Side.ASK else "BID/BUY"
    exec_txn(
        EconiaClient(NODE_URL, ECONIA_ADDR, account),
        calldata,
        f"Place market {note} order ({size_lots_of_base} lots)",
    )
    print("Market order placed")


def place_limit_order(
    direction: Side,
    market_id: int,
    size_lots_of_base: int,
    price_ticks_per_lot: int,
    trader_account: Account,
):
    print("place limit order starting")
    calldata = place_limit_order_user_entry(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(COIN_TYPE_EAPT)),
        TypeTag(StructTag.from_str(COIN_TYPE_EUSDC)),
        market_id,
        ECONIA_ADDR,
        direction,
        size_lots_of_base,
        price_ticks_per_lot,
        Restriction.NoRestriction,
        SelfMatchBehavior.CancelMaker,
    )
    note = "ASK/SELL" if direction == Side.ASK else "BID/BUY"
    exec_txn(
        EconiaClient(NODE_URL, ECONIA_ADDR, trader_account),
        calldata,
        f"Place limit {note} order ({size_lots_of_base} lots) ({price_ticks_per_lot} ticks/lot)",
    )
    print("limit order placed")


def place_limit_orders_at_market(
    viewer: EconiaViewer,
    account: Account,
    market_id: int,
    size_lots_of_base: int,
    min_bid_price_ticks_of_quote: int,
    max_ask_price_ticks_of_quote: int,
    narrowing_tick_count: int = 1,
) -> Tuple[Optional[int], Optional[int]]:
    best_bid_price, best_ask_price = get_best_prices(viewer, market_id)

    if best_bid_price is None:
        place_limit_order(
            Side.BID,
            account,
            market_id,
            size_lots_of_base,
            min_bid_price_ticks_of_quote,
        )
    else:
        place_limit_order(
            Side.BID,
            account,
            market_id,
            size_lots_of_base,
            best_bid_price + narrowing_tick_count,
        )

    if best_ask_price is None:
        place_limit_order(
            Side.ASK,
            account,
            market_id,
            size_lots_of_base,
            max_ask_price_ticks_of_quote,
        )
    else:
        place_limit_order(
            Side.ASK,
            account,
            market_id,
            size_lots_of_base,
            best_ask_price - narrowing_tick_count,
        )

    return get_best_prices(viewer, market_id)


def setup_new_account(
    viewer: EconiaViewer,
    faucet: FaucetClient,
    market_id: int,
    base_wholes: int = 10,
    quote_wholes: int = 10_000,
):
    account = Account.generate()
    client = EconiaClient(NODE_URL, ECONIA_ADDR, account)

    # Fund with APT, "eAPT" and "eUSDC"
    faucet.fund_account(account.address().hex(), 1 * (10**8))
    fund_APT(account, base_wholes * 2)
    fund_USDC(account, quote_wholes * 2)

    # Register market account
    calldata = register_market_account(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(COIN_TYPE_EAPT)),
        TypeTag(StructTag.from_str(COIN_TYPE_EUSDC)),
        market_id,
        0,
    )
    exec_txn(client, calldata, f"Register a new account in market {market_id}")

    mkt_account = get_market_account(
        viewer, account.account_address, market_id, 0)
    account_apt_pre = mkt_account["base_available"] // 10**8
    account_usdc_pre = mkt_account["quote_available"] // 10**6

    # Deposit "eAPT"
    eapt_subunits = base_wholes * (10**8)
    calldata = deposit_from_coinstore(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(COIN_TYPE_EAPT)),
        market_id,
        0,
        eapt_subunits,
    )
    exec_txn(
        client,
        calldata,
        f"Deposit {eapt_subunits/(10**8)} eAPT to market account",
    )

    # Deposit "eUSDC"
    eusdc_subunits = quote_wholes * (10**6)
    calldata = deposit_from_coinstore(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(COIN_TYPE_EUSDC)),
        market_id,
        0,
        eusdc_subunits,
    )
    exec_txn(
        client,
        calldata,
        f"Deposit {eusdc_subunits/(10**6)} eUSDC to market account",
    )

    mkt_account = get_market_account(
        viewer, account.account_address, market_id, 0)
    print("New market account after deposit:")
    account_apt = mkt_account["base_available"] / 10**8
    account_usdc = mkt_account["quote_available"] / 10**6
    print(f"  * eAPT: {account_apt_pre} -> {account_apt}")
    print(f"  * eUSDC: {account_usdc_pre} -> {account_usdc}")
    return account


def fund_APT(account: Account, wholes: int):
    calldata = EntryFunction(
        ModuleId.from_str(f"{FAUCET_ADDR}::faucet"),  # module
        "mint",  # funcname
        [TypeTag(StructTag.from_str(COIN_TYPE_EAPT))],  # generics
        [encoder(wholes * (10**8), Serializer.u64)],  # arguments
    )

    return exec_txn(
        EconiaClient(NODE_URL, ECONIA_ADDR, account),
        calldata,
        f"Mint {wholes/1.0} eAPT (yet to be deposited)",
    )


def fund_USDC(account: Account, wholes: int):
    calldata = EntryFunction(
        ModuleId.from_str(f"{FAUCET_ADDR}::faucet"),  # module
        "mint",  # funcname
        [TypeTag(StructTag.from_str(COIN_TYPE_EUSDC))],  # generics
        [encoder(wholes * (10**6), Serializer.u64)],  # arguments
    )
    return exec_txn(
        EconiaClient(NODE_URL, ECONIA_ADDR, account),
        calldata,
        f"Mint {wholes/1.0} eUSDC (yet to be deposited)",
    )


def setup_market(faucet_client: FaucetClient, viewer: EconiaViewer) -> int:
    # Use econia_sdk.utils.decimals.get_market_parameters_integer for these settings.
    # The settings here give a size precision of 0.001 eAPT and a price precision of
    # 0.001 eUSDC given eAPT 8 decimals / eUSDC 6 decimals. The minimum order size is
    # 0.5 eAPT.
    lot_size = 100000
    tick_size = 1
    min_size = MIN_SIZE
    market_id = get_market_id_base_coin(
        viewer, COIN_TYPE_EAPT, COIN_TYPE_EUSDC, lot_size, tick_size, min_size
    )
    if market_id == None:
        account_XCH = Account.generate()
        # The faucet only gives out 1 APT at a time, have to go multiple times
        faucet_client.fund_account(account_XCH.address().hex(), 1 * (10**8))
        faucet_client.fund_account(account_XCH.address().hex(), 1 * (10**8))
        faucet_client.fund_account(account_XCH.address().hex(), 1 * (10**8))
        faucet_client.fund_account(account_XCH.address().hex(), 1 * (10**8))
        faucet_client.fund_account(account_XCH.address().hex(), 1 * (10**8))
        print("Market does not exist yet, creating one...")
        calldata = register_market_base_coin_from_coinstore(
            ECONIA_ADDR,
            TypeTag(StructTag.from_str(COIN_TYPE_EAPT)),
            TypeTag(StructTag.from_str(COIN_TYPE_EUSDC)),
            TypeTag(StructTag.from_str(COIN_TYPE_APT)),
            lot_size,
            tick_size,
            min_size,
        )
        exec_txn(
            EconiaClient(NODE_URL, ECONIA_ADDR, account_XCH),
            calldata,
            "Create a new market",
        )
        market_id = get_market_id_base_coin(
            viewer, COIN_TYPE_EAPT, COIN_TYPE_EUSDC, lot_size, tick_size, min_size
        )
        events = get_market_registration_events(viewer)
        report_market_creation_event(
            next(filter(lambda e: e["data"]["market_id"] == market_id, events))
        )
    if market_id == None:
        exit()
    print(f"Market ID: {market_id}")

    if ECONIA_ACCT is None:
        return market_id

    fund_APT(ECONIA_ACCT, 1)
    exec_txn(
        EconiaClient(NODE_URL, ECONIA_ADDR, ECONIA_ACCT),
        set_recognized_market(ECONIA_ADDR, market_id),
        f"Recognize the market (id {market_id}, min size {MIN_SIZE})",
    )
    return market_id


def get_best_prices(
    viewer: EconiaViewer, market_id: int
) -> Tuple[Optional[int], Optional[int]]:
    price_levels = get_price_levels(viewer, market_id)

    price_bid = None
    if len(price_levels["bids"]) != 0:
        price_bid = price_levels["bids"][0]["price"]

    price_ask = None
    if len(price_levels["asks"]) != 0:
        price_ask = price_levels["asks"][0]["price"]

    return price_bid, price_ask


def report_best_price_levels(viewer: EconiaViewer, market_id: int):
    print("CURRENT BEST PRICE LEVELS:")
    price_levels = get_price_levels(viewer, market_id)
    if len(price_levels["bids"]) == 0 and len(price_levels["asks"]) == 0:
        print("There is no eAPT being bought or sold right now!")
        return

    if len(price_levels["bids"]) != 0:
        best_bid_level = price_levels["bids"][0]
        best_bid_level_price = best_bid_level["price"]  # in ticks
        best_bid_level_volume = best_bid_level["size"]  # in lots
        print(
            f"  * Highest BID/BUY @ {best_bid_level_price} ticks/lot, {best_bid_level_volume} lots"
        )
    else:
        print("  * No open bids")

    if len(price_levels["asks"]) != 0:
        best_ask_level = price_levels["asks"][0]
        best_ask_level_price = best_ask_level["price"]  # in ticks
        best_ask_level_volume = best_ask_level["size"]  # in lots
        print(
            f"  * Lowest ASK/SELL @ {best_ask_level_price} ticks/lot, {best_ask_level_volume} lots"
        )
    else:
        print("  * No open asks")


def report_market_creation_event(event: dict):
    print("EVENT SUMMARY: MarketRegistrationEvent")
    base_mod_name = event["data"]["base_type"]["module_name"]
    base_str_name = event["data"]["base_type"]["struct_name"]
    print(
        f"  * Base Type (unit of lots): 0x...::{base_mod_name}::{base_str_name}")
    quote_mod_name = event["data"]["quote_type"]["module_name"]
    quote_str_name = event["data"]["quote_type"]["struct_name"]
    print(
        f"  * Quote Type (unit of ticks): 0x...::{quote_mod_name}::{quote_str_name}")


def report_place_limit_order_event(event: dict):
    print("EVENT SUMMARY: PlaceLimitOrderEvent")
    order_id = event["data"]["order_id"]
    user_addr = event["data"]["user"].hex()
    ticks_price = event["data"]["price"]
    positioning = "ASK" if event["data"]["side"] == Side.ASK else "BID"
    positioning_tip = "(Selling)" if event["data"]["side"] else "(Buying)"
    size_available = event["data"]["remaining_size"]
    size_original = event["data"]["size"]

    print(f"  * User address: {user_addr}")
    print(f"  * Order ID: {order_id}")
    print(f"  * Side: {positioning} {positioning_tip}")
    print(f"  * Price: {ticks_price} eUSDC ticks per eAPT lot")
    print(f"  * Size: {size_available} available eAPT lots / {size_original}")


def report_fill_events(fill_events: 'list[dict]'):
    print("LAST ORDER EXECUTION BREAKDOWN: FillEvent(s)")
    if len(fill_events) != 0:
        last_events = find_all_fill_events_with_last_taker_order_id(
            fill_events)
        # type: ignore
        last_events_maker_side = last_events[0]["data"]["maker_side"]
        n_last_events = len(last_events)
        if last_events_maker_side == Side.ASK:
            print(
                f"  * There were {n_last_events} ASK orders filled by the BID order placement."
            )
        else:
            print(
                f"  * There were {n_last_events} BID orders filled by the ASK order placement."
            )

        last_events_prices = list(
            map(lambda ev: ev["data"]["price"], last_events))
        price_render = " -> ".join(str(price) for price in last_events_prices)
        print(f"  * Execution prices (ticks/lot): {price_render}")

        last_events_sizes = list(
            map(lambda ev: ev["data"]["size"], last_events))
        sizes_render = " +> ".join(str(price) for price in last_events_sizes)
        print(f"  * Execution sizes (lots): {sizes_render}")

        last_events_fees = list(
            map(lambda ev: ev["data"]["taker_quote_fees_paid"], last_events)
        )
        fees_render = " +> ".join(str(price) for price in last_events_fees)
        print(f"  * Execution fees (quote subunits): {fees_render}")
    else:
        print("  * There were no order fills for the queried account")


def report_order_for_last_fill(fill_events: 'list[dict]', open_orders: 'list[dict]'):
    order_id = fill_events[-1]["data"]["taker_order_id"]  # type: ignore
    open_order = list(
        filter(lambda ev: ev["order_id"] == order_id, open_orders))
    if len(open_order) == 1:
        print("  * The order WAS NOT fully satisfied by initial execution")
    elif len(open_order) == 0:
        print("  * The order WAS fully satisfied by initial execution")
    else:
        raise SystemError("This is not possible")


def find_all_fill_events_with_last_taker_order_id(
    events: 'list[dict]',
) -> 'list[dict]':
    index = len(events) - 1
    returns = []
    while index > 0:
        # type: ignore
        last_fill_order_id = events[-1]["data"]["taker_order_id"]
        ev = events[index]  # type: ignore
        if ev["data"]["taker_order_id"] == last_fill_order_id:
            returns.append(ev)
        index = index - 1
    returns.reverse()
    return returns


def exec_txn(client: EconiaClient, calldata: EntryFunction, reason: str):
    global txn_hash_buffer
    txn_hash = client.submit_tx_wait(calldata)
    txn_hash_buffer.append((txn_hash, reason))
    return txn_hash


def dump_txns():
    global txn_hash_buffer
    print("TRANSACTIONS EXECUTED (first-to-last):")
    if len(txn_hash_buffer) != 0:
        for (txn_hash, reason) in txn_hash_buffer:
            print(f"  * {reason}: {txn_hash}")
        txn_hash_buffer = []
    else:
        print("  * No transactions were executed.")
