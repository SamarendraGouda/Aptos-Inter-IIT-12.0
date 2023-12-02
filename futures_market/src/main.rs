// use std::str::FromStr;

// use aptos_sdk::{
//     bcs,
//     // signer,
//     move_types::{
//         ident_str,
//         language_storage::{ModuleId, StructTag, TypeTag},
//     },
//     rest_client::{aptos_api_types::MoveModuleId, FaucetClient},
//     types::{
//         account_address::AccountAddress, transaction::EntryFunction, LocalAccount, APTOS_COIN_TYPE,
//     },
// };
// use clap::Parser;
// use econia_sdk::{
//     entry::*,
//     errors::EconiaError,
//     types::order::{Restriction, SelfMatchBehavior, Side},
//     view::{EconiaViewClient, MarketInfoView, PriceLevel},
//     EconiaClient, EconiaResult,
// };

// #[derive(Parser, Debug)]
// // pub struct Args {
// //     /// The URL of the Aptos node
// //     pub node_url: String,

// //     /// The address of the Econia contract (e.g. 0x1234...)
// //     pub econia_address: String,
// // }

// // pub struct Init {
// //     econia_address: AccountAddress,
// //     econia_client_integrator: EconiaClient,
// // }

// pub struct Args {
//     /// The URL of the Aptos node
//     pub node_url: String,

//     /// The URL of the faucet
//     pub faucet_url: String,

//     /// The address of the Econia contract (e.g. 0x1234...)
//     pub econia_address: String,

//     /// The address of the Aptos faucet (e.g. 0x1234...)
//     pub faucet_address: String,
// }

// pub struct Init {
//     faucet_address: AccountAddress,
//     faucet_client: FaucetClient,
//     econia_address: AccountAddress,
//     econia_client: EconiaClient,
// }

// /// Creates the initial variables needed
// // async fn init(args: &Args, integrator: LocalAccount) -> Init {
// //     // Transform the Econia address from `String` to `AccountAddress`
// //     let econia_address =
// //         AccountAddress::from_hex_literal(&args.econia_address).expect("Could not parse address.");

// //     let (_, econia_client_integrator) =
// //         account(&args.node_url, econia_address.clone(), integrator).await;

// //     Init {
// //         econia_address,
// //         econia_client_integrator,
// //     }
// // }
// /// Creates the initial variables needed
// async fn init(args: &Args) -> Init {
//     // Create eAPT and eUSDC `TypeTag`s
//     let faucet_address = AccountAddress::from_hex_literal(&args.faucet_address).unwrap();
//     let e_apt = TypeTag::Struct(Box::new(
//         StructTag::from_str(&format!("0x{faucet_address}::example_apt::ExampleAPT")).unwrap(),
//     ));
//     let e_usdc = TypeTag::Struct(Box::new(
//         StructTag::from_str(&format!("0x{faucet_address}::example_usdc::ExampleUSDC")).unwrap(),
//     ));

//     // Create a `FaucetClient`
//     let faucet_client = FaucetClient::new(
//         reqwest::Url::parse(&args.faucet_url).unwrap(),
//         reqwest::Url::parse(&args.node_url).unwrap(),
//     );

//     // Transform the Econia address from `String` to `AccountAddress`
//     let econia_address =
//         AccountAddress::from_hex_literal(&args.econia_address).expect("Could not parse address.");

//     let (_, econia_client) = account1(&faucet_client, &args.node_url, econia_address.clone()).await;

//     Init {
//         faucet_address,
//         faucet_client,
//         econia_address,
//         econia_client,
//     }
// }

// pub async fn account1(
//     faucet_client: &FaucetClient,
//     node_url: &str,
//     econia_address: AccountAddress,
// ) -> (AccountAddress, EconiaClient) {
//     let account = LocalAccount::generate(&mut rand::thread_rng());
//     let account_address = account.address();
//     faucet_client.create_account(account_address).await.unwrap();
//     faucet_client
//         .fund(account_address, 100_000_000_000)
//         .await
//         .unwrap();

//     let econia_client = EconiaClient::connect(
//         reqwest::Url::parse(&node_url).unwrap(),
//         econia_address.clone(),
//         account,
//         None,
//     )
//     .await
//     .unwrap();

//     (account_address, econia_client)
// }
// /// Creates an account (locally and on the chain) and funds it with APT
// pub async fn account(
//     node_url: &str,
//     econia_address: AccountAddress,
//     user: LocalAccount,
// ) -> (AccountAddress, EconiaClient) {
//     let user_address = user.address();
//     let econia_client = EconiaClient::connect(
//         reqwest::Url::parse(&node_url).unwrap(),
//         econia_address.clone(),
//         user,
//         None,
//     )
//     .await
//     .unwrap();

//     (user_address, econia_client)
// }
// //Entry functions
// /// Creates market for the given base_coin and quote_coin pair and returns the market id
// pub async fn create_custom_market(
//     econia_address: AccountAddress,
//     base_coin: TypeTag,
//     quote_coin: TypeTag,
//     lot_size: u64,
//     tick_size: u64,
//     min_size: u64,
//     creator: LocalAccount,
//     node_url: &str,
// ) -> EconiaResult<Option<u64>> {
//     let entry = register_market_base_coin_from_coinstore(
//         econia_address,
//         &base_coin,
//         &quote_coin,
//         &APTOS_COIN_TYPE,
//         lot_size,
//         tick_size,
//         min_size,
//     )
//     .unwrap();

//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
//     econia_client.submit_tx(entry).await;

//     let market_id = econia_client
//         .view_client()
//         .get_market_id_base_coin(
//             base_coin.clone().into(),
//             quote_coin.clone().into(),
//             lot_size,
//             tick_size,
//             min_size,
//         )
//         .await;
//     market_id
// }

// pub async fn get_recongnized_market_info(
//     econia_address: AccountAddress,
//     base_coin: TypeTag,
//     quote_coin: TypeTag,
//     creator: LocalAccount,
//     node_url: &str,
// ) -> EconiaResult<MarketInfoView> {
//     let (_, econia_client) = account(&node_url, econia_address.clone(), creator).await;

//     let recongnized_market_id = econia_client
//         .view_client()
//         .get_recognized_market_id_base_coin(base_coin.clone().into(), quote_coin.clone().into())
//         .await?;

//     let recongnized_market_info = econia_client
//         .view_client()
//         .get_market_info(recongnized_market_id)
//         .await?;
//     Ok(recongnized_market_info)
// }

// pub async fn register_user_market_account(
//     econia_address: AccountAddress,
//     base_coin: TypeTag,
//     quote_coin: TypeTag,
//     custodian_id: u64,
//     market_id: u64,
//     creator: LocalAccount,
//     node_url: &str,
// ) {
//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
//     let entry = register_market_account(
//         econia_address,
//         &base_coin,
//         &quote_coin,
//         market_id,
//         custodian_id,
//     )
//     .unwrap();
//     econia_client.submit_tx(entry).await;
// }

// /// Deposits the given amount of specified coin into the user's market account from user's coinstore
// pub async fn deposit_into_market_account(
//     econia_address: AccountAddress,
//     coin: TypeTag,
//     custodian_id: u64,
//     market_id: u64,
//     amount: u64,
//     creator: LocalAccount,
//     node_url: &str,
// ) {
//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
//     let entry =
//         deposit_from_coinstore(econia_address, &coin, market_id, custodian_id, amount).unwrap();
//     econia_client.submit_tx(entry).await;
// }

// /// Withdraws the given amount of specified coin from the user's market account to user's coinstore
// pub async fn withdraw_from_market_account(
//     econia_address: AccountAddress,
//     coin: TypeTag,
//     market_id: u64,
//     amount: u64,
//     creator: LocalAccount,
//     node_url: &str,
// ) {
//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
//     let entry = withdraw_to_coinstore(econia_address, &coin, market_id, amount).unwrap();
//     econia_client.submit_tx(entry).await;
// }

// /// Places a market order for the given market
// pub async fn create_market_order(
//     econia_address: AccountAddress,
//     base_coin: TypeTag,
//     quote_coin: TypeTag,
//     market_id: u64,
//     trader: LocalAccount,
//     node_url: &str,
//     side: Side,
//     sell_base_lots: u64,
// ) -> EconiaResult<()> {
//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), trader).await;
//     let entry = place_market_order_user_entry(
//         econia_address,
//         &base_coin,
//         &quote_coin,
//         market_id,
//         &econia_address,
//         side,
//         sell_base_lots,
//         SelfMatchBehavior::CancelMaker,
//     )?;
//     econia_client.submit_tx(entry).await?;
//     Ok(())
// }

// pub async fn cancel_order(
//     econia_address: AccountAddress,
//     side: Side,
//     market_id: u64,
//     market_order_id: u128,
//     creator: LocalAccount,
//     node_url: &str,
// ) {
//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
//     let entry = cancel_order_user(econia_address, market_id, side, market_order_id).unwrap();
//     econia_client.submit_tx(entry).await;
// }

// pub async fn cancel_all_orders(
//     econia_address: AccountAddress,
//     side: Side,
//     market_id: u64,
//     creator: LocalAccount,
//     node_url: &str,
// ) {
//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
//     let entry = cancel_all_orders_user(econia_address, market_id, side).unwrap();
//     econia_client.submit_tx(entry).await;
// }

// /// Returns (best bid level, best ask level)
// pub async fn get_best_levels(
//     view_client: EconiaViewClient<'_>,
//     market_id: u64,
// ) -> EconiaResult<(Option<PriceLevel>, Option<PriceLevel>)> {
//     let levels = view_client.get_price_levels_all(market_id).await?;

//     let best_bid_level = if !levels.bids.is_empty() {
//         Some(levels.bids.get(0).unwrap().clone())
//     } else {
//         None
//     };

//     let best_ask_level = if !levels.asks.is_empty() {
//         Some(levels.asks.get(0).unwrap().clone())
//     } else {
//         None
//     };

//     Ok((best_bid_level, best_ask_level))
// }

// ///Places best buy limt order to the given market
// pub async fn place_best_buy_limit_order_at_market(
//     econia_address: AccountAddress,
//     base_coin: TypeTag,
//     quote_coin: TypeTag,
//     market_id: u64,
//     trader: LocalAccount,
//     node_url: &str,
//     size_lots_of_base: u64,
//     min_bid_price_ticks_of_quote: u64,
// ) -> EconiaResult<()> {
//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), trader).await;
//     let (best_bid_level, _) = get_best_levels(econia_client.view_client(), market_id).await?;

//     let bid_entry = if let Some(best_bid_level) = best_bid_level {
//         let best_bid_price = best_bid_level.price;
//         place_limit_order_user_entry(
//             econia_address,
//             &base_coin,
//             &quote_coin,
//             market_id,
//             &econia_address,
//             Side::Bid,
//             size_lots_of_base,
//             best_bid_price + 1,
//             Restriction::NoRestriction,
//             SelfMatchBehavior::CancelMaker,
//         )?
//     } else {
//         place_limit_order_user_entry(
//             econia_address,
//             &base_coin,
//             &quote_coin,
//             market_id,
//             &econia_address,
//             Side::Bid,
//             size_lots_of_base,
//             min_bid_price_ticks_of_quote,
//             Restriction::NoRestriction,
//             SelfMatchBehavior::CancelMaker,
//         )?
//     };
//     econia_client.submit_tx(bid_entry).await;
//     Ok(())
// }

// ///Places best sell limt order to the given market
// pub async fn place_best_sell_limit_order_at_market(
//     econia_address: AccountAddress,
//     base_coin: TypeTag,
//     quote_coin: TypeTag,
//     market_id: u64,
//     trader: LocalAccount,
//     node_url: &str,
//     size_lots_of_base: u64,
//     max_bid_price_ticks_of_quote: u64,
// ) -> EconiaResult<()> {
//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), trader).await;
//     let (_, best_ask_level) = get_best_levels(econia_client.view_client(), market_id).await?;
//     let ask_entry = if let Some(best_ask_level) = best_ask_level {
//         let best_ask_price = best_ask_level.price;
//         place_limit_order_user_entry(
//             econia_address,
//             &base_coin,
//             &quote_coin,
//             market_id,
//             &econia_address,
//             Side::Ask,
//             size_lots_of_base,
//             best_ask_price - 1,
//             Restriction::NoRestriction,
//             SelfMatchBehavior::CancelMaker,
//         )?
//     } else {
//         place_limit_order_user_entry(
//             econia_address,
//             &base_coin,
//             &quote_coin,
//             market_id,
//             &econia_address,
//             Side::Ask,
//             size_lots_of_base,
//             max_bid_price_ticks_of_quote,
//             Restriction::NoRestriction,
//             SelfMatchBehavior::CancelMaker,
//         )?
//     };
//     econia_client.submit_tx(ask_entry).await;
//     Ok(())
// }

// pub async fn report_best_price_levels(
//     view_client: EconiaViewClient<'_>,
//     market_id: u64,
// ) -> EconiaResult<()> {
//     let (best_bid_level, best_ask_level) = get_best_levels(view_client, market_id).await?;

//     if best_bid_level.is_none() && best_ask_level.is_none() {
//         println!("There is no eAPT being bought or sold right now");
//         return Ok(());
//     }

//     println!("Best price levels:");

//     if let Some(best_bid_level) = best_bid_level {
//         let best_bid_volume = best_bid_level.size;
//         let best_bid_price = best_bid_level.price;
//         println!("  Highest BID/BUY @ {best_bid_price} ticks/lot, {best_bid_volume} lots");
//     } else {
//         println!("  No open bids");
//     }

//     if let Some(best_ask_level) = best_ask_level {
//         let best_ask_volume = best_ask_level.size;
//         let best_ask_price = best_ask_level.price;
//         println!("  Lowest ASK/SELL @ {best_ask_price} ticks/lot, {best_ask_volume} lots");
//     } else {
//         println!("  No open asks");
//     }

//     Ok(())
// }

// /// Updates the size of existing orders
// pub async fn update_order_size(
//     econia_address: AccountAddress,
//     side: Side,
//     market_id: u64,
//     creator: LocalAccount,
//     node_url: &str,
//     market_order_id: u128,
//     new_size: u64,
// ) {
//     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
//     let entry =
//         change_order_size_user(econia_address, market_id, side, market_order_id, new_size).unwrap();
//     econia_client.submit_tx(entry).await;
// }
// //View functions

// // pub async fn get_(econia_address: AccountAddress, creator: LocalAccount, node_url: &str)->EconiaResult<Option<MarketEventHandleCreationInfo>> {
// //     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
// //     let view_client = econia_client.view_client();
// //     let x = view_client.func();
// // }
// // pub async fn get_(econia_address: AccountAddress, creator: LocalAccount, node_url: &str)-> {
// //     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
// //     let view_client = econia_client.view_client();
// //     let x = view_client.func();
// // }
// // pub async fn get_(econia_address: AccountAddress, creator: LocalAccount, node_url: &str)-> {
// //     let (_, mut econia_client) = account(&node_url, econia_address.clone(), creator).await;
// //     let view_client = econia_client.view_client();
// //     let x = view_client.func();
// // }
// #[tokio::main]
// async fn main() -> EconiaResult<()> {
//     let args = Args::parse();

//     let Init {
//         faucet_address,
//         faucet_client,
//         econia_address,
//         mut econia_client,
//     } = init(&args).await;
//     println!("Starting Market Registration");
//     let lot_size = 10u64.pow(8 - 3);
//     let tick_size = 10u64.pow(6 - 3);
//     let min_size = 1;
//     let creator = LocalAccount::generate(&mut rand::thread_rng());
//     let creator_address = creator.address();
//     faucet_client.create_account(creator_address).await.unwrap();
//     faucet_client
//         .fund(creator_address, 100_000_000_000)
//         .await
//         .unwrap();

//     // let c_addr = "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa".to_string();
//     // let coin_address = AccountAddress::from_hex_literal(&c_addr).unwrap();
//     // println!("*");
//     // let base_coin = TypeTag::Struct(Box::new(
//     //     StructTag::from_str(&format!("0x{coin_address}::asset::WETH")).unwrap(),
//     // ));
//     // let quote_coin = TypeTag::Struct(Box::new(
//     //     StructTag::from_str(&format!("0x{coin_address}::asset::USDC")).unwrap(),
//     // ));
//     let faucet_address = AccountAddress::from_hex_literal(&args.faucet_address).unwrap();
//     let base_coin = TypeTag::Struct(Box::new(
//         StructTag::from_str(&format!("0x{faucet_address}::example_apt::ExampleAPT")).unwrap(),
//     ));
//     let quote_coin = TypeTag::Struct(Box::new(
//         StructTag::from_str(&format!("0x{faucet_address}::example_usdc::ExampleUSDC")).unwrap(),
//     ));
//     println!("**");
//     let market_id = create_custom_market(
//         econia_address,
//         base_coin,
//         quote_coin,
//         lot_size,
//         tick_size,
//         min_size,
//         creator,
//         &args.node_url,
//     )
//     .await?;
//     println!("7");
//     let market_id = if let Some(market_id) = market_id {
//         println!("Market created with ID: {market_id}");
//     } else {
//         println!("Could not create market."); // Should not happen
//     };
//     println!("Market Registration Complete");

//     Ok(())
// }
mod api;
use api::routes;

#[tokio::main]
async fn main() {
    println!("Starting Server on {}", port);
    let port = 3030;

    warp::serve(routes()).run(([127, 0, 0, 1], port)).await;
}