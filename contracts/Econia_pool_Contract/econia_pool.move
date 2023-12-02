module econia_pool_addr::econia_pool{
   
    use 0x1::coin;
    use 0x1::vector;
    use 0x1::signer;
    use aptos_framework::coin::{Self, Coin};

    const ERROR: u64 = 101;

    // type of coin::Coin, X is a generic type parameter
     struct Coin<X> {}


    // storage part of the module
    struct Storage<T: store>has key{
        val: T,
    }

    fun store<T:store>(account: &signer,val: T){
        let addr = signer::address_of(account);
        assert!(!exists<Storage<T>>(addr),ERROR);
        let to_store = Storage{
            val,
        };
        move_to(account,to_store);
    }

    public fun get<T: store>(account: &signer):T acquires Storage{
        let addr = signer::address_of(account);
        assert!(exists<Storage<T>>(addr),ERROR);
        let Storage{val} = move_from<Storage<T>>(addr);
        val
    }
    

    //settlement part of the module
    entry fun settlement_after_deadline(sender: &signer , to: vector<address> , margins: vector<u64> , leverages : vector<u64> , no_of_assets : vector<u64>,market_price_of_asset : u64){
      
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

        // here sender is replaced with econia_pool_addr . ideally sender will call this function . Can try econia_pool_addr as sender if does not work
        coin::transfer<Coin<X>>(econia_pool_addr,person_to_pay,amt);
        //coin::deposit(person_to_pay,amt);
        i=i+1;
      }
    }  

   // send this when trader changes his position status 
   
    entry fun changed_price_transfer(sender :&signer , to : address , margin : u64){

        coin::transfer<Coin<X>>(econia_pool_addr,to,margin);
        //coin::deposit(to,amt);
        
    }   
    

    // changed_price_transfer with profit and loss cut

    entrt fun changed_price_transfer_with_profit_loss_cut(sender :&signer , to : address , margin : u64 , assets_sold : u64 , total_assets : u64 , market_price_of_asset : u64, leverage : u64){
        let num = margin*assets_sold;
        let den = total_assets;
        let amt_to_return = num/den;
        
        let calc = (margin*leverage)/total_assets;

        let profit_loss_cut = if (market_price_of_asset > calc) {market_price_of_asset - calc} else {calc-market_price_of_asset};

        
        
        let amt_to_pay = if (market_price_of_asset >calc) {amt_to_return + profit_loss_cut} else {amt_to_return - profit_loss_cut};

        
        coin::transfer<Coin<X>>(econia_pool_addr,to,amt_to_pay);
        //coin::deposit(to,amt_to_pay);
    }


    entry fun takes_price_from_user(sender :&signer , from:address , amt : u64){
        coin::transfer<Coin<X>>(from,econia_pool_addr,amt);
       // coin::withdraw(from,amt);
    }

    
}