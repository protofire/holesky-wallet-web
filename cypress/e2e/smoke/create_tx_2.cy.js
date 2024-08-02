import * as constants from '../../support/constants.js'
import * as main from '../pages/main.page.js'
import * as createtx from '../pages/create_tx.pages.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as wallet from '../../support/utils/wallet.js'

let staticSafes = []

const sendValue = 0.00002

const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY

function happyPathToStepTwo() {
  createtx.typeRecipientAddress(constants.EOA)
  createtx.clickOnTokenselectorAndSelectSepoliaEth()
  createtx.setSendValue(sendValue)
  createtx.clickOnNextBtn()
}

describe('[SMOKE] Create transactions tests 2', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_6)
    main.acceptCookies()
    wallet.connectSigner(signer)
    createtx.clickOnNewtransactionBtn()
    createtx.clickOnSendTokensBtn()
  })

  it('[SMOKE] Verify advance parameters gas limit input', () => {
    happyPathToStepTwo()
    createtx.changeNonce('1')
    createtx.selectCurrentWallet()
    createtx.openExecutionParamsModal()
    createtx.verifyAndSubmitExecutionParams()
  })

  it('[SMOKE] Verify a transaction shows relayer and addToBatch button', () => {
    happyPathToStepTwo()
    createtx.verifySubmitBtnIsEnabled()
    createtx.verifyNativeTokenTransfer()
    createtx.changeNonce('1')
    createtx.verifyConfirmTransactionData()
    createtx.verifyRelayerAttemptsAvailable()
    createtx.selectCurrentWallet()
    createtx.clickOnNoLaterOption()
    createtx.verifyAddToBatchBtnIsEnabled()
  })
})
