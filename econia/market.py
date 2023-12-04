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

U64_MAX = (2**64) - 1
COIN_TYPE_APT = "0x1::aptos_coin::AptosCoin"
MIN_SIZE = 500
ECONIA_ADDR = (AccountAddress.from_hex("0x1bacdb8e2c4bfe3b915d1bfe1c20f5c1dae2a49828804b3d55248b744c8bc5ae"))
ECONIA_ACCT = Account.load_key("0xABE315150D3A39884788EC47F8CC11DB1729C6D4F30557F6DA169F5208E7B2DD")
FAUCET_ADDR = AccountAddress.from_hex("0x1bacdb8e2c4bfe3b915d1bfe1c20f5c1dae2a49828804b3d55248b744c8bc5ae")
COIN_TYPE_EAPT = f"{FAUCET_ADDR}::example_apt::ExampleAPT"
COIN_TYPE_EUSDC = f"{FAUCET_ADDR}::example_usdc::ExampleUSDC"
NODE_URL = "http://0.0.0.0:8080/v1"
FAUCET_URL = "http://0.0.0.0:8081"

txn_hash_buffer = []

def create_market(BASE_COIN: str, QUOTE_COIN: str, DEF_COIN: str, lot_size: int, tick_size: int, min_size: int,  account: Account) ->int:
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
    market_id = get_market_id_base_coin(viewer, BASE_COIN, QUOTE_COIN, lot_size, tick_size, min_size)
    if market_id ==None:
        print("Market does not exist. Creating a new one...")
        calldata = register_market_base_coin_from_coinstore(ECONIA_ADDR,
            TypeTag(StructTag.from_str(BASE_COIN)),
            TypeTag(StructTag.from_str(QUOTE_COIN)),
            TypeTag(StructTag.from_str(DEF_COIN)),
            lot_size,
            tick_size,
            min_size,
        )
    exec_txn(
        EconiaClient(NODE_URL, ECONIA_ADDR, account),
        calldata,
        "Create a new market",
    )
    market_id = get_market_id_base_coin(
        viewer, BASE_COIN, QUOTE_COIN, lot_size, tick_size, min_size
    )
    events = get_market_registration_events(viewer)
    report_market_creation_event(
        next(filter(lambda e: e["data"]["market_id"] == market_id, events))
    )
    if market_id == None:
        exit()
    print(f"Market ID: {market_id}")
 
    return market_id

def place_limit_order(
    direction: Side,
    account: Account,
    market_id: int,
    size_lots_of_base: int,
    price_ticks_per_lot: int,
    BASE_COIN: str, QUOTE_COIN: str,
):
    calldata = place_limit_order_user_entry(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(BASE_COIN)),
        TypeTag(StructTag.from_str(QUOTE_COIN)),
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
        EconiaClient(NODE_URL, ECONIA_ADDR, account),
        calldata,
        f"Place limit {note} order ({size_lots_of_base} lots) ({price_ticks_per_lot} ticks/lot)",
    )

def report_market_creation_event(event: dict):
    print("EVENT SUMMARY: MarketRegistrationEvent")
    base_mod_name = event["data"]["base_type"]["module_name"]
    base_str_name = event["data"]["base_type"]["struct_name"]
    print(f"  * Base Type (unit of lots): 0x...::{base_mod_name}::{base_str_name}")
    quote_mod_name = event["data"]["quote_type"]["module_name"]
    quote_str_name = event["data"]["quote_type"]["struct_name"]
    print(f"  * Quote Type (unit of ticks): 0x...::{quote_mod_name}::{quote_str_name}")

def exec_txn(client: EconiaClient, calldata: EntryFunction, reason: str):
    global txn_hash_buffer
    txn_hash = client.submit_tx_wait(calldata)
    txn_hash_buffer.append((txn_hash, reason))
    return txn_hash

def get_best_prices(
    market_id: int
) -> Tuple[Optional[int], Optional[int]]:
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
    price_levels = get_price_levels(viewer, market_id)

    price_bid = None
    if len(price_levels["bids"]) != 0:
        price_bid = price_levels["bids"][0]["price"]

    price_ask = None
    if len(price_levels["asks"]) != 0:
        price_ask = price_levels["asks"][0]["price"]

    return price_bid, price_ask


def report_best_price_levels(market_id: int):
    print("CURRENT BEST PRICE LEVELS:")
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
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

def dump_txns():
    global txn_hash_buffer
    print("TRANSACTIONS EXECUTED (first-to-last):")
    if len(txn_hash_buffer) != 0:
        for (txn_hash, reason) in txn_hash_buffer:
            print(f"  * {reason}: {txn_hash}")
        txn_hash_buffer = []
    else:
        print("  * No transactions were executed.")

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
        last_events = find_all_fill_events_with_last_taker_order_id(fill_events)
        last_events_maker_side = last_events[0]["data"]["maker_side"]  # type: ignore
        n_last_events = len(last_events)
        if last_events_maker_side == Side.ASK:
            print(
                f"  * There were {n_last_events} ASK orders filled by the BID order placement."
            )
        else:
            print(
                f"  * There were {n_last_events} BID orders filled by the ASK order placement."
            )

        last_events_prices = list(map(lambda ev: ev["data"]["price"], last_events))
        price_render = " -> ".join(str(price) for price in last_events_prices)
        print(f"  * Execution prices (ticks/lot): {price_render}")

        last_events_sizes = list(map(lambda ev: ev["data"]["size"], last_events))
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
    open_order = list(filter(lambda ev: ev["order_id"] == order_id, open_orders))
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
        last_fill_order_id = events[-1]["data"]["taker_order_id"]  # type: ignore
        ev = events[index]  # type: ignore
        if ev["data"]["taker_order_id"] == last_fill_order_id:
            returns.append(ev)
        index = index - 1
    returns.reverse()
    return returns

def setup_new_account(
    market_id: int,
    account: Account,
    BASE_COIN: str,
    QUOTE_COIN: str

):
    client = EconiaClient(NODE_URL, ECONIA_ADDR, account)

    # Register market account
    calldata = register_market_account(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(BASE_COIN)),
        TypeTag(StructTag.from_str(QUOTE_COIN)),
        market_id,
        0,
    )
    exec_txn(client, calldata, f"Register a new account in market {market_id}")

def deposit_into_market_account(market_id: int, amount: int, account: Account, COIN_TYPE: str):
    calldata = deposit_from_coinstore(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(COIN_TYPE)),
        market_id,
        0,
        amount
    )
    exec_txn(
        EconiaClient(NODE_URL, ECONIA_ADDR, account),
        calldata,
        f"Deposited {amount} of specified coins into market {market_id}",
    )

def get_market_account_balance(market_id: int, account: Account)-> Tuple[int, int]:
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
    mkt_account = get_market_account(viewer, account.account_address, market_id, 0)
    balance_base = mkt_account["base_available"] // 10**8
    balance_quote = mkt_account["quote_available"] // 10**6
    return balance_base, balance_quote

def place_limit_orders_best_limit_order(
    account: Account,
    market_id: int,
    size_lots_of_base: int,
    min_bid_price_ticks_of_quote: int,
    max_ask_price_ticks_of_quote: int,
    narrowing_tick_count: int = 1,
) -> Tuple[Optional[int], Optional[int]]:
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
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

def place_market_order(
    BASE_COIN: str,
    QUOTE_COIN: str,
    direction: Side,
    account: Account,
    market_id: int,
    size_lots_of_base: int,
):
    calldata = place_market_order_user_entry(
        ECONIA_ADDR,
        TypeTag(StructTag.from_str(BASE_COIN)),
        TypeTag(StructTag.from_str(QUOTE_COIN)),
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

def get_order_ids(account_address: AccountAddress, market_id: int) -> Tuple[set, set]:
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
    market_account = get_market_account(viewer, account_address, market_id, 0)
    return (market_account["bids"], market_account["asks"])

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

def get_market_account_balance(account: Account, market_id: int)-> Tuple[int, int]:
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
    market_account = get_market_account(viewer, account.account_address, market_id, 0)
    balance_base = market_account["base_available"] // 10**8
    balance_quote = market_account["quote_available"] // 10**6
    print(f"  * Base Balance: {balance_base}")
    print(f"  * Quote Balane: {balance_quote}")
    return balance_base, balance_quote

def get_filled_orders(account: Account, market_id: int) -> 'list[dict]':
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
    fill_events = get_fill_events(viewer, account.account_address, market_id, 0)
    n_fills = len(fill_events)
    if n_fills == 0:
        print("  * There were no limit orders filled by any orders placed.")
    else:
        print(f"  * There were {n_fills} limit orders filled by the orders placed.")
    return fill_events

def change_order_size(market_id: int, order_id: int, new_size: int, account: Account, side: Side):
    econia_client = EconiaClient(NODE_URL, ECONIA_ADDR, account)
    call_data = change_order_size_user(ECONIA_ADDR, market_id, side, order_id, new_size)
    exec_txn(econia_client, call_data, f"Order size changed to {new_size}")

def cancel_order(market_id: int, order_id: int, account: Account, side: Side):
    econia_client = EconiaClient(NODE_URL, ECONIA_ADDR, account)
    call_data = cancel_all_orders_user(ECONIA_ADDR, market_id, side)
    exec_txn(econia_client, call_data, f"All {side} orders cancelled for {account.address}")

def get_open_orders(account: Account, market_id: int) -> 'list[dict]':
    viewer = EconiaViewer(NODE_URL, ECONIA_ADDR)
    open_orders = get_open_orders_all(viewer, market_id)
    n_open_orders = len(open_orders)
    if n_open_orders == 0:
        print("  * There are no open orders for the queried account")
    else:
        print(f"  * There are {n_open_orders} open orders for the queried account")
    return open_orders
