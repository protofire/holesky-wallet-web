import * as constants from '../../support/constants.js'
import * as main from '../pages/main.page.js'
import * as create_tx from '../pages/create_tx.pages.js'
import * as swaps_data from '../../fixtures/swaps_data.json'
import * as swaps from '../pages/swaps.pages.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'

let staticSafes = []

const swapsHistory = swaps_data.type.history

describe('Swaps history tests 2', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  it('Verify swap sell order with one action', { defaultCommandTimeout: 30000 }, () => {
    cy.visit(constants.transactionUrl + staticSafes.SEP_STATIC_SAFE_1 + swaps.swapTxs.sell1Action)
    main.acceptCookies()

    const dai = swaps.createRegex(swapsHistory.forAtLeastFullDai, 'DAI')
    const eq = swaps.createRegex(swapsHistory.DAIeqCOW, 'COW')

    create_tx.verifyExpandedDetails([swapsHistory.sellFull, dai, eq, swapsHistory.dai, swapsHistory.filled])
  })

  // TODO: Added to prod
  it('Verify swap buy operation with 2 actions: approve & swap', { defaultCommandTimeout: 30000 }, () => {
    cy.visit(constants.transactionUrl + staticSafes.SEP_STATIC_SAFE_1 + swaps.swapTxs.buy2actions)
    main.acceptCookies()

    const eq = swaps.createRegex(swapsHistory.oneGNOFull, 'COW')
    const atMost = swaps.createRegex(swapsHistory.forAtMostCow, 'COW')

    create_tx.verifyExpandedDetails([
      swapsHistory.buyOrder,
      swapsHistory.buy,
      eq,
      atMost,
      swapsHistory.cow,
      swapsHistory.expired,
      swapsHistory.actionApprove,
      swapsHistory.actionPreSignature,
    ])
  })

  it('Verify "Cancelled" status for manually cancelled limit orders', { defaultCommandTimeout: 30000 }, () => {
    const safe = '0x2a73e61bd15b25B6958b4DA3bfc759ca4db249b9'
    cy.visit(constants.transactionUrl + safe + swaps.swapTxs.sellCancelled)
    main.acceptCookies()

    const uni = swaps.createRegex(swapsHistory.forAtLeastFullUni, 'UNI')
    const eq = swaps.createRegex(swapsHistory.UNIeqCOW, 'K COW')

    create_tx.verifyExpandedDetails([
      swapsHistory.sellOrder,
      swapsHistory.sell,
      uni,
      eq,
      swapsHistory.cow,
      swapsHistory.cancelled,
    ])
  })

  it('Verify swap operation with 3 actions: wrap & approve & swap', { defaultCommandTimeout: 30000 }, () => {
    const safe = '0x140663Cb76e4c4e97621395fc118912fa674150B'
    cy.visit(constants.transactionUrl + safe + swaps.swapTxs.sell3Actions)
    main.acceptCookies()

    const dai = swaps.createRegex(swapsHistory.forAtLeastFullDai, 'DAI')
    const eq = swaps.createRegex(swapsHistory.DAIeqWETH, 'WETH')

    create_tx.verifyExpandedDetails([
      swapsHistory.sellOrder,
      swapsHistory.sell,
      dai,
      eq,
      swapsHistory.actionApproveEth,
      swapsHistory.actionPreSignature,
      swapsHistory.actionDepositEth,
    ])
  })

  it('Verify "Expired" field in the tx details for limit orders', { defaultCommandTimeout: 30000 }, () => {
    cy.visit(constants.transactionUrl + staticSafes.SEP_STATIC_SAFE_1 + swaps.swapTxs.sellLimitOrder)
    main.acceptCookies()

    const dai = swaps.createRegex(swapsHistory.forAtLeastFullDai, 'DAI')
    const eq = swaps.createRegex(swapsHistory.DAIeqCOW, 'COW')

    create_tx.verifyExpandedDetails([swapsHistory.sellOrder, swapsHistory.sell, dai, eq, swapsHistory.expired])
  })

  it('Verify "Filled" field in the tx details for limit orders', { defaultCommandTimeout: 30000 }, () => {
    cy.visit(constants.transactionUrl + swaps.limitOrderSafe + swaps.swapTxs.sellLimitOrderFilled)
    main.acceptCookies()

    const usdc = swaps.createRegex(swapsHistory.forAtLeastFullUSDT, 'USDT')
    const eq = swaps.createRegex(swapsHistory.USDTeqUSDC, 'USDC')

    create_tx.verifyExpandedDetails([swapsHistory.sellOrder, swapsHistory.sell, usdc, eq, swapsHistory.filled])
  })

  // TODO: Added to prod
  it(
    'Verify no decoding if tx was created using CowSwap safe-app in the history',
    { defaultCommandTimeout: 30000 },
    () => {
      cy.visit(constants.transactionUrl + staticSafes.SEP_STATIC_SAFE_1 + swaps.swapTxs.safeAppSwapOrder)
      main.acceptCookies()
      main.verifyValuesDoNotExist('div', [
        swapsHistory.actionApproveG,
        swapsHistory.actionDepositG,
        swapsHistory.amount,
        swapsHistory.executionPrice,
        swapsHistory.surplus,
        swapsHistory.expiry,
        swapsHistory.oderId,
        swapsHistory.status,
        swapsHistory.forAtLeast,
        swapsHistory.forAtMost,
      ])
      main.verifyValuesDoNotExist(create_tx.transactionItem, [swapsHistory.title, swapsHistory.cow, swapsHistory.dai])
      main.verifyValuesExist(create_tx.transactionItem, [swapsHistory.actionPreSignatureG, swapsHistory.gGpV2])
    },
  )

  it('Verify token order in sell and buy operations', { defaultCommandTimeout: 30000 }, () => {
    cy.visit(constants.transactionUrl + staticSafes.SEP_STATIC_SAFE_1 + swaps.swapTxs.sell1Action)
    main.acceptCookies()
    const eq = swaps.createRegex(swapsHistory.DAIeqCOW, 'COW')
    swaps.checkTokenOrder(eq, swapsHistory.executionPrice)

    cy.visit(constants.transactionUrl + staticSafes.SEP_STATIC_SAFE_1 + swaps.swapTxs.buy2actions)
    main.acceptCookies()
    const eq2 = swaps.createRegex(swapsHistory.oneGNOFull, 'COW')
    swaps.checkTokenOrder(eq2, swapsHistory.limitPrice)
  })

  it('Verify OrderID url on cowswap explorer', { defaultCommandTimeout: 30000 }, () => {
    cy.visit(constants.transactionUrl + staticSafes.SEP_STATIC_SAFE_1 + swaps.swapTxs.sell1Action)
    main.acceptCookies()
    swaps.verifyOrderIDUrl()
  })
})
