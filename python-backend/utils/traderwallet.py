from .secrets import TRADER_ADDRESS, TRADER_PRIVATE_KEY
from aptos_sdk.account import Account

TraderWallet = Account(TRADER_ADDRESS, TRADER_PRIVATE_KEY)

