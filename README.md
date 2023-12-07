# Zero Day Futures Contracts Trading Platform
0dte Futures  is a first of a kind Zero day Futures Contract trading platform on Aptos blockchain , which allows the user to buy or sell positions on a zero day Futures Contract . 

### Table of Content
* Features
* Technical Specifications
* Architecture
* Security
* API Docs
* Tech Stack
* Whitepaper
* Future Scope

## Features 

0dte Futures utilises the Block-STM technology to take care of very high Transactions per Second during peak hours while maintaining reliability and security of assets.

Using Econia's Finance Engine , orders are stored in a efficient manner and provides low latency order executions while settlement .

0dte Futures is deployed on website as well as has a mobile app on both ios and android to reach larger audience.

User friendly interface and easy to understand design makes it easier to use.

## Technical Specifications


#### Smart Contracts

* Wallet Contract
This is the Trader's wallet that stores the onchain assets received from his own wallet and profits.

* Pool Contract
This is the pool contract that stores the initial margin collected from the traders. Also handles the fee retrieval and removed margin transfer during change of position . This contract also handles the settlement after zero day.

* Calc Contract
This contract handles the calculation behind the user position's data on-chain.

* Coins Contract
Mints test tokens to check the functioning of the Market



## Architecture 

<img src="" alt="ARCHI" >


## Security

Resource centric model of move helps in preventing the accidental loss of funds.

Econia pool and Trading Wallet have their own reserves and are deployed as smart contracts providing non-custodial asset handling.

Immediate and low latency transfer of funds after the 24 hr mark minimises the loss of funds via slippage due to market fluctuations.

## API Docs

## Tech Stack

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Python.svg/2048px-Python.svg.png" alt="Python" width="50">

<img src="https://icodrops.com/wp-content/uploads/2023/04/n1wu7vCF_400x400.jpg" alt="Alt text" width="50">

<img src="https://static-00.iconduck.com/assets.00/flutter-icon-1651x2048-kopq1sul.png" width="50">

<img src="https://assets-global.website-files.com/63610769a12ca8b167ecebcf/6529f968615bdcc952ab6e3c_Aptos_Brand_Assets_-_Aptos_Foundation.png" width="50">

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Javascript-shield.svg/1200px-Javascript-shield.svg.png" width="50">

## Whitepaper

## Future Scope

0dte Futures has an option to also trade n-day futures with slight changes to the smart contract.

More Complex Liquidity providing pools for more lucrative fee for Liquidity providers and 

Integrating real time Oracles for price feed. (Currently the market price is dependent on the active market and limit orders)





