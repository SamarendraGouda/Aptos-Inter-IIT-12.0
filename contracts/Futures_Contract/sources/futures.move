module futures_addr::Futures_Contract_gen {

 use std::timestamp;
 use std::signer;
 use std::account;  
 use std::hash;
 use std::aptos_hash;
 use std::vector;
 use std::bcs;
 use std::Coin;

 struct Futures_contract has key, drop{
  positions: Table<u64, Position>,
  futures_data: Table<u64, Futures>
 }
 

 struct Futures has drop, store{
   future_id : u64,
   futures_coin1_price : u64,
   futures_coin2_price : u64,
   expiry_time : u64,
   
 }

 struct Position has store , drop{
    id : u128,
    amt: u64,
    leverage : u8,
    liquidation_price : u64,
    no_of_assets : u64,
    user_addr : address
 }


 // function to create a future contract with specific prediction
  public entry fun create_Future (sender : &signer , days : u64 , coin1_price :u64 , coin2_price : u64) {

    let expiry_time : u64 = timestamp::now_seconds() + 86400*days;

    let x:vector<u8> = bcs::to_bytes<u64>(coin1_price);
    let y:vector<u8> = bcs::to_bytes<u64>(coin2_price);
    let z:vector<u8> = bcs::to_bytes<u64>(expiry_time);
    
    let future_id : u64 = aptos_hash::keccak256(x,y,z);
    
    move_to( sender ,
    let futures : Futures = Futures{
      future_id : future_id,
      futures_coin1_price : coin1_price,
      futures_coin2_price : coin2_price,
      expiry_time : expiry_time
    };
    );

  }

 // function to create position in  a future contract
  public entry fun create_Position (sender : &signer , amt : u64 , leverage : u8 , id : u128 , no_of_assets : u64) {
    
     let margin : u64 = amt/leverage;
     let num : u64 = amt - amt/leverage;
     let den : u64 = no_of_assets;
     let liquidation_price : u64 = (num/den) ; 

      move_to(sender,
      let pos : Position = Position{
        id : id,
        amt : amt,
        leverage : leverage,
        liquidation_price : liquidation_price,
        no_of_assets : no_of_assets,
        user_addr : sender
      };
      ):
  } 
 
   // function - to liquidare a position in a future contract . triggered by the event of liquidation
   fun Auto_Liquidate () {
      
      let pos : Position = positions.read(id); // check for correctness , this is to fetch the particular position from the table
      
      assert!(pos.liquidation_price >= get_market_price() , "Liquidation price is not reached yet"); // get_market_price or similar function in amm
      
      let margin_given : u64 = pos.amt / pos.leverage;

      // transfer margin to some global variable that will hold the money , per particular future contract (not in amm addr)
      // transfer(margin_given , amm_addr); 
      
      drop pos;

   }
   

   fun Close_Future () {
      
      assert!(timestamp::now_seconds() >= expiry_time , "Future contract is not expired yet");

      let funds : u128 = 0;
      let len : u64 =  positions.len();

      let i : u64 = 0;

      while(i<len){
        let pos : Position = positions.read(i);
        funds += pos.amt / pos.leverage; // this is the margin amount
        i += 1;
      }

      //funds += liquidated_money from the particular future contract called from auto liquidate function
      
      let j : u64 = 0;

      while(j<len){
        let pos : Position = positions.read(j);
        let margin_given : u64 = pos.amt / pos.leverage;
        let curr_price : u64 = get_market_price(); // tbc
        let total_value : u64 = pos.no_of_assets * curr_price;
         
        let amt_to_be_given : u64 ;

        if(total_val > pos.amt){
          amt_to_be_given = margin_given + (total_val - pos.amt);
        }
        else{
          amt_to_be_given = margin_given - (pos.amt - total_val);
        };
         
       // transfer(amt_to_be_given , pos.user_addr);
       Coin::transfer(amm_addr,pos.user_addr,amt_to_be_given);
       funds -= amt_to_be_given;

        j += 1;

        drop pos;
      }

      // transfer(funds, amm.addr); if we are separately storing the funds
   }  
  
   
}