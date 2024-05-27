import { Builder, type IBuilder } from '@/tests/Builder'
import { faker } from '@faker-js/faker'
import type {
  SwapOrder,
  OrderToken,
  TransactionInfoType,
  CowSwapConfirmationView,
} from '@safe-global/safe-gateway-typescript-sdk'

export function appDataBuilder(
  orderClass: 'limit' | 'market' | 'liquidity' = 'limit',
): IBuilder<Record<string, unknown>> {
  return Builder.new<Record<string, unknown>>().with({
    appCode: 'Safe Wallet Swaps',
    metadata: {
      orderClass: {
        orderClass,
      },
      partnerFee: {
        bps: 50,
        recipient: '0x0B00b3227A5F3df3484f03990A87e02EbaD2F888',
      },
      quote: {
        slippageBips: 50,
      },
      widget: {
        appCode: 'CoW Swap-SafeApp',
        environment: 'production',
      },
    },
    version: '1.1.0',
  })
}

export function orderTokenBuilder(): IBuilder<OrderToken> {
  return Builder.new<OrderToken>().with({
    address: faker.finance.ethereumAddress(),
    decimals: faker.number.int({ max: 18 }),
    logoUri:
      'https://safe-transaction-assets.staging.5afe.dev/tokens/logos/0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14.png',
    name: faker.finance.currencyName(),
    symbol: faker.finance.currencyCode(),
    trusted: faker.datatype.boolean(),
  })
}

export function swapOrderBuilder(): IBuilder<SwapOrder> {
  return Builder.new<SwapOrder>().with({
    type: 'SwapOrder' as TransactionInfoType.SWAP_ORDER,
    uid: faker.string.uuid(),
    status: faker.helpers.arrayElement(['presignaturePending', 'open', 'cancelled', 'fulfilled', 'expired']),
    kind: faker.helpers.arrayElement(['buy', 'sell']),
    orderClass: faker.helpers.arrayElement(['limit', 'market', 'liquidity']),
    validUntil: faker.date.future().getTime(),
    sellAmount: faker.string.numeric(),
    buyAmount: faker.string.numeric(),
    executedSellAmount: faker.string.numeric(),
    executedBuyAmount: faker.string.numeric(),
    sellToken: orderTokenBuilder().build(),
    buyToken: orderTokenBuilder().build(),
    explorerUrl:
      'https://explorer.cow.fi/orders/0x03a5d561ad2452d719a0d075573f4bed68217c696b52f151122c30e3e4426f1b05e6b5eb1d0e6aabab082057d5bb91f2ee6d11be66223d88',
    executedSurplusFee: faker.string.numeric(),
    fullAppData: appDataBuilder().build(),
  })
}

// create a builder for SwapOrderConfirmationView
export function swapOrderConfirmationViewBuilder(): IBuilder<CowSwapConfirmationView> {
  const ownerAndReceiver = faker.finance.ethereumAddress()
  return Builder.new<CowSwapConfirmationView>().with({
    type: 'COW_SWAP_ORDER',
    uid: faker.string.uuid(),
    kind: faker.helpers.arrayElement(['buy', 'sell']),
    orderClass: faker.helpers.arrayElement(['limit', 'market', 'liquidity']),
    validUntil: faker.date.future().getTime(),
    status: faker.helpers.arrayElement(['presignaturePending', 'open', 'cancelled', 'fulfilled', 'expired']),
    sellToken: orderTokenBuilder().build(),
    buyToken: orderTokenBuilder().build(),
    sellAmount: faker.string.numeric(),
    buyAmount: faker.string.numeric(),
    executedSellAmount: faker.string.numeric(),
    executedBuyAmount: faker.string.numeric(),
    receiver: ownerAndReceiver,
    owner: ownerAndReceiver,
    explorerUrl:
      'https://explorer.cow.fi/orders/0x03a5d561ad2452d719a0d075573f4bed68217c696b52f151122c30e3e4426f1b05e6b5eb1d0e6aabab082057d5bb91f2ee6d11be66223d88',
    fullAppData: appDataBuilder().build(),
  })
}
