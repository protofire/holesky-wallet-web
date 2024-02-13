import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as assets from '../pages/assets.pages'
import * as owner from '../pages/owners.pages'

const ASSET_NAME_COLUMN = 0
const TOKEN_AMOUNT_COLUMN = 1
const FIAT_AMOUNT_COLUMN = 2

describe('Tokens tests', () => {
  const fiatRegex = assets.fiatRegex

  beforeEach(() => {
    cy.visit(constants.BALANCE_URL + constants.SEPOLIA_TEST_SAFE_5)
    cy.clearLocalStorage()
    main.acceptCookies()
  })

  it('Verify that non-native tokens are present and have balance', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.verifyBalance(assets.currencyDaiCap, TOKEN_AMOUNT_COLUMN, assets.currencyDaiAlttext)
    assets.verifyTokenBalanceFormat(
      assets.currencyDaiCap,
      assets.currencyDaiFormat_2,
      TOKEN_AMOUNT_COLUMN,
      FIAT_AMOUNT_COLUMN,
      fiatRegex,
    )

    assets.verifyBalance(assets.currencyAave, TOKEN_AMOUNT_COLUMN, assets.currencyAaveAlttext)
    assets.verifyTokenBalanceFormat(
      assets.currencyAave,
      assets.currentcyAaveFormat,
      TOKEN_AMOUNT_COLUMN,
      FIAT_AMOUNT_COLUMN,
      fiatRegex,
    )

    assets.verifyBalance(assets.currencyLink, TOKEN_AMOUNT_COLUMN, assets.currencyLinkAlttext)
    assets.verifyTokenBalanceFormat(
      assets.currencyLink,
      assets.currentcyLinkFormat,
      TOKEN_AMOUNT_COLUMN,
      FIAT_AMOUNT_COLUMN,
      fiatRegex,
    )

    assets.verifyBalance(assets.currencyTestTokenA, TOKEN_AMOUNT_COLUMN, assets.currencyTestTokenAAlttext)
    assets.verifyTokenBalanceFormat(
      assets.currencyTestTokenA,
      assets.currentcyTestTokenAFormat,
      TOKEN_AMOUNT_COLUMN,
      FIAT_AMOUNT_COLUMN,
      fiatRegex,
    )

    assets.verifyBalance(assets.currencyTestTokenB, TOKEN_AMOUNT_COLUMN, assets.currencyTestTokenBAlttext)
    assets.verifyTokenBalanceFormat(
      assets.currencyTestTokenB,
      assets.currentcyTestTokenBFormat,
      TOKEN_AMOUNT_COLUMN,
      FIAT_AMOUNT_COLUMN,
      fiatRegex,
    )

    assets.verifyBalance(assets.currencyUSDC, TOKEN_AMOUNT_COLUMN, assets.currencyTestUSDCAlttext)
    assets.verifyTokenBalanceFormat(
      assets.currencyUSDC,
      assets.currentcyTestUSDCFormat,
      TOKEN_AMOUNT_COLUMN,
      FIAT_AMOUNT_COLUMN,
      fiatRegex,
    )
  })

  it('Verify that every token except the native token has a "go to blockexplorer link"', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.verifyAssetNameHasExplorerLink(assets.currencyUSDC, ASSET_NAME_COLUMN)
    assets.verifyAssetNameHasExplorerLink(assets.currencyTestTokenB, ASSET_NAME_COLUMN)
    assets.verifyAssetNameHasExplorerLink(assets.currencyTestTokenA, ASSET_NAME_COLUMN)
    assets.verifyAssetNameHasExplorerLink(assets.currencyLink, ASSET_NAME_COLUMN)
    assets.verifyAssetNameHasExplorerLink(assets.currencyAave, ASSET_NAME_COLUMN)
    assets.verifyAssetNameHasExplorerLink(assets.currencyDaiCap, ASSET_NAME_COLUMN)
    assets.verifyAssetExplorerLinkNotAvailable(constants.tokenNames.sepoliaEther, ASSET_NAME_COLUMN)
  })

  it('Verify the default Fiat currency and the effects after changing it', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.verifyFirstRowDoesNotContainCurrency(assets.currencyEUR, FIAT_AMOUNT_COLUMN)
    assets.verifyFirstRowContainsCurrency(assets.currencyUSD, FIAT_AMOUNT_COLUMN)
    assets.clickOnCurrencyDropdown()
    assets.selectCurrency(assets.currencyEUR)
    assets.verifyFirstRowDoesNotContainCurrency(assets.currencyUSD, FIAT_AMOUNT_COLUMN)
    assets.verifyFirstRowContainsCurrency(assets.currencyEUR, FIAT_AMOUNT_COLUMN)
  })

  it('Verify that checking the checkboxes increases the token selected counter', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.openHideTokenMenu()
    assets.clickOnTokenCheckbox(assets.currencyLink)
    assets.checkTokenCounter(1)
  })

  it('Verify that selecting tokens and saving hides them from the table', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.openHideTokenMenu()
    assets.clickOnTokenCheckbox(assets.currencyLink)
    assets.saveHiddenTokenSelection()
    main.verifyValuesDoNotExist(assets.tokenListTable, [assets.currencyLink])
  })

  it('Verify that Cancel closes the menu and does not change the table status', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.openHideTokenMenu()
    assets.clickOnTokenCheckbox(assets.currencyLink)
    assets.clickOnTokenCheckbox(assets.currencyAave)
    assets.saveHiddenTokenSelection()
    main.verifyValuesDoNotExist(assets.tokenListTable, [assets.currencyLink, assets.currencyAave])
    assets.openHideTokenMenu()
    assets.clickOnTokenCheckbox(assets.currencyLink)
    assets.clickOnTokenCheckbox(assets.currencyAave)
    assets.cancelSaveHiddenTokenSelection()
    main.verifyValuesDoNotExist(assets.tokenListTable, [assets.currencyLink, assets.currencyAave])
  })

  it('Verify that Deselect All unchecks all tokens from the list', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.openHideTokenMenu()
    assets.clickOnTokenCheckbox(assets.currencyLink)
    assets.clickOnTokenCheckbox(assets.currencyAave)
    assets.deselecAlltHiddenTokenSelection()
    assets.verifyEachRowHasCheckbox(constants.checkboxStates.unchecked)
  })

  it('Verify the Hidden tokens counter works for spam tokens', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.openHideTokenMenu()
    assets.clickOnTokenCheckbox(assets.currencyLink)
    assets.saveHiddenTokenSelection()
    assets.checkHiddenTokenBtnCounter(1)
  })

  it('Verify the Hidden tokens counter works for native tokens', () => {
    assets.openHideTokenMenu()
    assets.clickOnTokenCheckbox(constants.tokenNames.sepoliaEther)
    assets.saveHiddenTokenSelection()
    assets.checkHiddenTokenBtnCounter(1)
  })

  it('Verify you can hide tokens from the eye icon in the table rows', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.hideAsset(assets.currencyLink)
  })

  it('Verify the sorting of "Assets" and "Balance" in the table', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.verifyTableRows(7)
    assets.clickOnTokenNameSortBtn()
    assets.verifyTokenNamesOrder()
    assets.clickOnTokenNameSortBtn()
    assets.verifyTokenNamesOrder('descending')
    assets.clickOnTokenBalanceSortBtn()
    assets.verifyTokenBalanceOrder()
    assets.clickOnTokenBalanceSortBtn()
    assets.verifyTokenBalanceOrder('descending')
  })

  //Include in smoke.
  it('Verify that when owner is disconnected, Send button is disabled', () => {
    //waits for the user to look connected. Sends a default prefix "sep:" if it is called with no params
    main.verifyOwnerConnected()
    owner.clickOnWalletExpandMoreIcon()
    owner.clickOnDisconnectBtn()
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.showSendBtn(0)
    assets.VerifySendButtonIsDisabled()
  })

  it('Verify that when connected user is not owner, Send button is disabled', () => {
    cy.visit(constants.BALANCE_URL + constants.SEPOLIA_TEST_SAFE_15_TOKEN)
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    assets.showSendBtn(0)
    assets.VerifySendButtonIsDisabled()
  })
})
