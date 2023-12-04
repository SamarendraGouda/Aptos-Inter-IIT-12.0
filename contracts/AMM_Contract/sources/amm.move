module amm_addr::amm{
  //use 0x1::fungible_asset;
  use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability};
  use std::string;
  use std::string::String;
  use std::option;
//   use amm_addr::Math::{sqrt, min};
  use std::signer::address_of;
  const PAIR_EXISTS: u64 = 1;
  const PAIR_DOES_NOT_EXISTS: u64 = 2;
  
  //value of K 
 const K : u64 = 1000;

struct LP<phantom X , phantom Y> {}

struct Pair<X: copy + store, Y: copy + store> has key, store {
  x_coin: Coin<X>,
  y_coin: Coin<Y>,
  lp_locked: Coin<LP<X, Y>>,
  lp_mint: MintCapability<LP<X, Y>>,
  lp_burn: BurnCapability<LP<X, Y>>,
}
 
// Function to generate LP token name symbol for a given token pair X-Y
// used in generation to token pair in create pool function

public fun generate_lp_name_symbol<X: copy + store, Y: copy + store>(): String {
    let lp_name_symbol = string::utf8(b"");
    string::append_utf8(&mut lp_name_symbol, b"LP");
    string::append_utf8(&mut lp_name_symbol, b"-");
    string::append(&mut lp_name_symbol, coin::symbol<X>());
    string::append_utf8(&mut lp_name_symbol, b"-");
    string::append(&mut lp_name_symbol, coin::symbol<Y>());
    lp_name_symbol
}

// function to create pool for the token pair X-Y
public entry fun create_pool<X: copy + store, Y: copy + store>(sender : &signer ) {
   assert!(!pair_exist<X, Y>(@amm_addr), PAIR_EXISTS);

   let lp_name_symbol = generate_lp_name_symbol<X, Y>();

   let (lp_burn, lp_freeze, lp_mint) = coin::initialize<LP<X, Y>>(
        sender,
        lp_name_symbol,
        lp_name_symbol,
        6, // 6 decimal places
        true, // fungibility 
    );

    coin::destroy_freeze_cap(lp_freeze); // in standard to freeze LP token , destroy this property to safeguard the coins
    
    // Create a new Pair for token pair X-Y and store it in the global storage
    move_to(
        sender,
        Pair<X, Y> {
            x_coin: coin::zero<X>(),
            y_coin: coin::zero<Y>(),
            lp_locked: coin::zero<LP<X, Y>>(),
            lp_mint,
            lp_burn,
        }
    );
}

// Function to add liquidity for a given token pair X-Y
public entry fun add_liquidity<X: copy + store, Y: copy + store>(sender: &signer, x_amount: u64, y_amount: u64)
    acquires Pair
{
    // Make sure the pair exists
    assert!(exists<Pair<X, Y>>(@amm_addr), PAIR_DOES_NOT_EXISTS);

    // Borrow the Pair data from global storage
    let pair = borrow_global_mut<Pair<X, Y>>(@amm_addr);

    // Convert the amounts to u128 to prevent overflow during calculations
    let x_amount = (x_amount as u128);
    let y_amount = (y_amount as u128);

    // Get the current reserves for token X and Y
    let x_reserve = (coin::value(&pair.x_coin) as u128);
    let y_reserve = (coin::value(&pair.y_coin) as u128);

    // Calculate the optimal amount of Y to be added given the amount of X
    let y_amount_optimal = quote(x_amount, x_reserve, y_reserve);

    // Choose the smaller of the actual Y amount and the optimal Y amount
    if (y_amount_optimal <= y_amount) {
        y_amount = y_amount_optimal;
    }else{
        let x_amount_optimal = quote(y_amount,y_reserve,x_reserve);
        x_amount = x_amount_optimal;
    };

    // Withdraw X and Y tokens from the sender's account
    let x_amount_coin = coin::withdraw<X>(sender, (x_amount as u64));
    let y_amount_coin = coin::withdraw<Y>(sender, (y_amount as u64));

    // Deposit the withdrawn tokens into the Pair
    coin::merge(&mut pair.x_coin, x_amount_coin);
    coin::merge(&mut pair.y_coin, y_amount_coin);

    // Calculate the liquidity to be minted and mint LP tokens accordingly
    let liquidity;
    let total_supply = *option::borrow(&coin::supply<LP<X, Y>>());
    if (total_supply == 0){
        liquidity = sqrt(((x_amount * y_amount) as u128)) - K;
        let lp_locked = coin::mint(K, &pair.lp_mint);
        coin::merge(&mut pair.lp_locked, lp_locked);
    } else {
        liquidity = (min(
            Math::mul_div(x_amount, total_supply, x_reserve),
            Math::mul_div(y_amount, total_supply, y_reserve),
        ) as u64);
    };

    // Mint the liquidity and deposit it into the sender's account
    let lp_coin = coin::mint<LP<X, Y>>(liquidity, &pair.lp_mint);
    let addr = address_of(sender);
    if (!coin::is_account_registered<LP<X, Y>>(addr)) {
        coin::register<LP<X, Y>>(sender);
    };
    coin::deposit(addr, lp_coin);
}

// Function to remove liquidity for a given token pair X-Y
public entry fun remove_liquidity<X: copy + store, Y: copy + store>(sender: &signer, liquidity: u64) acquires Pair {
    // Make sure the pair exists
    assert!(exists<Pair<X, Y>>(@amm_addr), PAIR_DOES_NOT_EXISTS);

    // Borrow the Pair data from global storage
    let pair = borrow_global_mut<Pair<X, Y>>(@amm_addr);

    // Withdraw LP tokens from the sender's account
    let liquidity_coin = coin::withdraw<LP<X, Y>>(sender, liquidity);
    coin::burn(liquidity_coin, &pair.lp_burn);

    // Get the total supply of LP tokens, and the current reserves for token X and Y
    let total_supply = *option::borrow(&coin::supply<LP<X,Y>>());
    let x_reserve = (coin::value(&pair.x_coin) as u128);
    let y_reserve = (coin::value(&pair.y_coin) as u128);

    // Calculate the amounts of X and Y to be removed based on the liquidity
    let x_amount = Math::mul_div((liquidity as u128), x_reserve, total_supply);
    let y_amount = Math::mul_div((liquidity as u128), y_reserve, total_supply);

    // Extract the amounts of X and Y tokens from the Pair
    let x_amount_coin = coin::extract<X>(&mut pair.x_coin,( x_amount as u64));
    let y_amount_coin = coin::extract<Y>(&mut pair.y_coin,( y_amount as u64));

    // Deposit the extracted tokens into the sender's account
    coin::deposit(address_of(sender), x_amount_coin);
    coin::deposit(address_of(sender), y_amount_coin);
}


// Function to check if a Pair exists for the token pair X-Y or Y-X
public fun pair_exist<X: copy + store, Y: copy + store>(addr: address): bool {
    exists<Pair<X, Y>>(addr) || exists<Pair<Y, X>>(addr)
}

public fun quote(x_amount:u128,x_reserve:u128,y_reserve:u128):u128{
    Math::mul_div(x_amount,y_reserve,x_reserve)
}

// function to get the amount to be received by the person who is swapping
public fun get_amount_out (input_value : u128 , input_token_reserve : u128 , output_token_reserve : u128 ) : u128 {
    let num = output_token_reserve*(input_value);
    let den = input_token_reserve + (input_value);
    num/den

}

// function to get the reserves of the token for the followinf token pair X-Y 
 public fun get_coin<X: copy + store, Y: copy + store>() : (u64,u64) acquires Pair {
  let pair = borrow_global<Pair<X,Y>>(@amm_addr);
  (coin::value(&pair.x_coin),coin::value(&pair.y_coin))
   
 } 

}