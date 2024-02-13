export const enum WALLET_KEYS {
  INJECTED = 'INJECTED',
  WALLETCONNECT_V2 = 'WALLETCONNECT_V2',
  SOCIAL = 'SOCIAL_LOGIN',
  COINBASE = 'COINBASE',
  LEDGER = 'LEDGER',
  TREZOR = 'TREZOR',
  KEYSTONE = 'KEYSTONE',
}

// TODO: Check if undefined is needed as a return type, possibly couple this with WALLET_MODULES
export const CGW_NAMES: { [key in WALLET_KEYS]: string | undefined } = {
  [WALLET_KEYS.INJECTED]: 'detectedwallet',
  [WALLET_KEYS.WALLETCONNECT_V2]: 'walletConnect_v2',
  [WALLET_KEYS.COINBASE]: 'coinbase',
  [WALLET_KEYS.SOCIAL]: 'socialSigner',
  [WALLET_KEYS.LEDGER]: 'ledger',
  [WALLET_KEYS.TREZOR]: 'trezor',
  [WALLET_KEYS.KEYSTONE]: 'keystone',
}
