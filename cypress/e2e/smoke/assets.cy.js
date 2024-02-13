import * as constants from '../../support/constants'
import * as main from '../../e2e/pages/main.page'
import * as assets from '../pages/assets.pages'

const ASSET_NAME_COLUMN = 0
const TOKEN_AMOUNT_COLUMN = 1
const FIAT_AMOUNT_COLUMN = 2

describe('[SMOKE] Assets tests', () => {
  const fiatRegex = assets.fiatRegex

  beforeEach(() => {
    cy.visit(constants.BALANCE_URL + constants.SEPOLIA_TEST_SAFE_5)
    cy.clearLocalStorage()
    main.acceptCookies()
  })

  it('[SMOKE] Verify that the token tab is selected by default and the table is visible', () => {
    assets.verifyTokensTabIsSelected('true')
  })

  it('[SMOKE] Verify that the native token is visible', () => {
    assets.verifyTokenIsPresent(constants.tokenNames.sepoliaEther)
  })

  it('[SMOKE] Verify that Token list dropdown down options show/hide spam tokens', () => {
    let spamTokens = [
      assets.currencyAave,
      assets.currencyTestTokenA,
      assets.currencyTestTokenB,
      assets.currencyUSDC,
      assets.currencyLink,
      assets.currencyDaiCap,
    ]

    main.verifyValuesDoNotExist(assets.tokenListTable, spamTokens)
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    spamTokens.push(constants.tokenNames.sepoliaEther)
    main.verifyValuesExist(assets.tokenListTable, spamTokens)
  })

  it('[SMOKE] Verify that "Hide token" button is present and opens the "Hide tokens menu"', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.openHideTokenMenu()
    assets.verifyEachRowHasCheckbox()
  })

  it('[SMOKE] Verify that clicking the button with an owner opens the Send funds form', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.clickOnSendBtn(0)
  })
})
