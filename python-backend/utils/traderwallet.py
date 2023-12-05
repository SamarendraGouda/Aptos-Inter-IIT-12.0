from .secrets import TRADER_ADDRESS, TRADER_PRIVATE_KEY
from aptos_sdk.account import Account
from aptos_sdk.ed25519 import PrivateKey
from aptos_sdk.account_address import AccountAddress

TraderWallet = Account(AccountAddress.from_hex(TRADER_ADDRESS), PrivateKey.from_hex(TRADER_PRIVATE_KEY))

