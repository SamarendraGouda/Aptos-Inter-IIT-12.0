// module Wallet_addr::Wallet {

//     use aptos_framework::coin::Coin;
//     //use 0x1::event;
//     //use 0x1::debug;
//     use 0x1::signer;
    
//     struct X {}

//     // struct Wallet has key,store{
//     //     coin_store: CoinStore<Coin<X>>,
//     // }

//    struct Wallet<phantom X, phantom Y, phantom Z, phantom W> has key {
//     APT: Coin<X>,
//     USDC: Coin<Y>,
//     Test: Coin<Z>,
//     ETH: Coin<W>,
//     balance_APT: u64,
//     balance_USDC: u64,
//     balance_Test: u64,
//     balance_ETH: u64,
// }
    
//     public entry fun init_Wallet(sender : &signer) acquires Wallet {
//         let addr = signer::address_of(sender);
        
//         move_to(sender, Wallet<X,Y,Z,W> {
//             APT : Coin<X>,
//             USDC : Coin<Y>,
//             Test : Coin<Z>,
//             ETH : Coin<W>,
//             balance_APT : 0,
//             balance_USDC : 0,
//             balance_Test : 0,
//             balance_ETH : 0,
//         });
//     }

//     // public fun get_balance(addr: address):u64  acquires Wallet{
//     //     let balance = borrow_global<Wallet>(addr).coins.val
//     // }

//     // public fun deposit(addr:address , coins : coin::Coin<X>) acquires Wallet{

//     // let balance = get_balance(addr);
//     // let coin::Coin<X>{val} = coins;
//     // let balance_ref = &mut borrow_global_mut<Wallet>(addr).coins.val;

//     // *balance_ref = balance + val;
//     // }

//     // public fun withdraw(addr:address ,value : u64) : coin::Coin<X> acquires Wallet {
   
//     // let balance = get_balance(addr);
//     // let balance_ref = &mut borrow_global_mut<Wallet>(addr).coins.val;
//     // *balance_ref = balance - value;
//     //  coin::Coin<X>{val} = value

//     // }

//     // public fun transfer(from: &signer, to: address, amount: u64) acquires Wallet {
      
//     //    let from_addr = signer::address_of(from);
//     //    let check = withdraw(from_addr, amount);
//     //    deposit(to, check);
//     // }
    
//     // #[view]
//     // public fun view_balance(addr: address):u64 {
//     //   let balance = borrow_global<Wallet>(addr).coins.val
//     // } 
    

// }


module Wallet_addr::Wallet{
    use std::signer;
    use aptos_framework::coin::{Coin, Self};

    /// User doesn't have enough funds to withdraw
    const ERR_NO_ENOUGH_DEPOSIT: u64 = 1;

    /// The signer does not have permission to update state
    const ERR_NOT_OWNER: u64 = 2;

    /// Error when module has been paused
    const ERR_PAUSED: u64 = 3;

    /// Error when module has been unpaused
    const ERR_UNPAUSED: u64 = 4;

    struct UserDeposit<phantom CoinType> has key {
        coin: Coin<CoinType>
    }

    struct Paused has key { }

    public fun depositedBalance<CoinType>(owner: address): u64 acquires UserDeposit {
        if (!exists<UserDeposit<CoinType>>(owner)) {
            0u64
        } else {
            coin::value(&borrow_global<UserDeposit<CoinType>>(owner).coin)
        }
    }

    public entry fun deposit<CoinType>(account: &signer, amount: u64) acquires UserDeposit {
        assert!(!paused(), ERR_PAUSED);

        let coin = coin::withdraw<CoinType>(account, amount);

        let account_addr = signer::address_of(account);

        if (!exists<UserDeposit<CoinType>>(account_addr)) {
            move_to(account, UserDeposit<CoinType> {
                coin
            });
        } else {
            let user_deposit = borrow_global_mut<UserDeposit<CoinType>>(account_addr);
            coin::merge(&mut user_deposit.coin, coin);
        }
    }

    public entry fun withdraw<CoinType>(account: &signer, amount: u64) acquires UserDeposit {
        assert!(!paused(), ERR_PAUSED);

        let account_addr = signer::address_of(account);

        let balance = depositedBalance<CoinType>(account_addr);

        assert!(balance >= amount, ERR_NO_ENOUGH_DEPOSIT);

        let user_deposit = borrow_global_mut<UserDeposit<CoinType>>(account_addr);

        let coin = coin::extract(&mut user_deposit.coin, amount);

        coin::deposit(account_addr, coin);
    }

    public entry fun pause(account: &signer) {
        assert!(!paused(), ERR_PAUSED);

        assert!(signer::address_of(account) == @Wallet_addr, ERR_NOT_OWNER);

        move_to(account, Paused { });
    }

    public entry fun unpause(account: &signer) acquires Paused {
        assert!(paused(), ERR_UNPAUSED);

        let account_addr = signer::address_of(account);
        assert!(account_addr == @Wallet_addr, ERR_NOT_OWNER);

        let Paused {} = move_from<Paused>(account_addr);
    }

    /// Get if it's disabled or not.
    public fun paused(): bool {
        exists<Paused>(@Wallet_addr)
    }
}