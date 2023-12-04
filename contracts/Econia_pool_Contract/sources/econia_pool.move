module econia_pool_addr::econia_pool{
   
    use 0x1::vector;
    use aptos_framework::coin::{Self, Coin};
    use 0x1::event;
    use 0x1::signer;

    const ERROR: u64 = 101;
    const ERROR_NOT_POOL_ADMIN: u64 = 1;
    //const ADDRESS : address = 0x5988e8ab6ade6bc3006c7e57992078db2caf981c5a16d53c26cb1071a91b1b26;
  
     #[event] 
     struct Settlement_done has drop ,store {
      
     }
     
     #[event]
     struct Price_changed has drop ,store {
      
     }
      
     #[event] 
     struct Fee_collected has drop ,store {
    
     }
    
    struct Pool_deposits<phantom CoinType> has key {
     coin : Coin<CoinType>
    }
    
    //init for all coin types
    public entry fun init_fund<CoinType>(sender: &signer,amt: u64){
      assert!(signer::address_of(sender) == @econia_pool_addr,ERROR_NOT_POOL_ADMIN); 
      let coin = coin::withdraw<CoinType>(sender,amt);
      move_to(sender,Pool_deposits<CoinType>{coin});
    }

    //settlement part of the module
    public entry fun settlement_after_deadline<CoinType>(_sender: &signer , to: vector<address> , margins: vector<u64> , leverages : vector<u64> , no_of_assets : vector<u64>,market_price_of_asset : u64) acquires Pool_deposits{
      
      let array_size = vector::length(&to);
      
      let i=0;

      while(i < array_size){
        let person_to_pay = *vector::borrow(&to,(i as u64));
        let margin_of_person = *vector::borrow(&margins,(i as u64));
        let leverage_of_person = *vector::borrow(&leverages,(i as u64));
        
        let amt = margin_of_person * leverage_of_person;

        let amount_gained = *vector::borrow(&no_of_assets,(i as u64)) * market_price_of_asset;

        let amt_to_pay = if (amount_gained > amt) {amount_gained - amt} else {amt-amount_gained};
        
        if(amount_gained > amt){
           amt = amt+amt_to_pay;
        }else{
           amt = amt-amt_to_pay;
        };

         let pool_bal = borrow_global_mut<Pool_deposits<CoinType>>(@econia_pool_addr);
         let to_send = coin::extract(&mut pool_bal.coin,amt);
         coin::deposit(person_to_pay,to_send);

         i=i+1;
      };
      
        event::emit(Settlement_done{});

    }  

   // send this when trader changes his position status 
   
    public entry fun changed_price_transfer<CoinType>(_sender :&signer , to : address , margin_removed : u64) acquires Pool_deposits{
       
       
        let pool_bal = borrow_global_mut<Pool_deposits<CoinType>>(@econia_pool_addr);
        let to_send = coin::extract(&mut pool_bal.coin,margin_removed);
        coin::deposit(to,to_send);


        
        event::emit(Price_changed{});
    }   
    

    // changed_price_transfer with profit and loss cut

    public entry fun changed_price_transfer_with_profit_loss_cut<CoinType>(_sender :&signer , to : address , margin : u64 , assets_sold : u64 , total_assets : u64 , market_price_of_asset : u64, leverage : u64)acquires Pool_deposits{
        let num = margin*assets_sold;
        let den = total_assets;
        let amt_to_return = num/den;
        
        let calc = (margin*leverage)*assets_sold/total_assets;

        let profit_loss_cut = if (market_price_of_asset > calc) {(market_price_of_asset - calc)*assets_sold} else {(calc-market_price_of_asset)*assets_sold};

        
        
        let amt_to_pay = if (market_price_of_asset >calc) {amt_to_return + profit_loss_cut} else {amt_to_return - profit_loss_cut};

        let pool_bal = borrow_global_mut<Pool_deposits<CoinType>>(@econia_pool_addr);
        let to_send = coin::extract(&mut pool_bal.coin,amt_to_pay);
        coin::deposit(to,to_send);
        
    
        event::emit(Price_changed{});
    }


    public entry fun take_fee<CoinType>(sender :&signer  , fee : u64)acquires Pool_deposits{

       //here sender will  be trader and from will be pool 

        let coin = coin::withdraw<CoinType>(sender,fee);
        let pool_bal = borrow_global_mut<Pool_deposits<CoinType>>(@econia_pool_addr);
        coin::merge(&mut pool_bal.coin,coin);
       

        event::emit(Fee_collected{});
    }
    
}