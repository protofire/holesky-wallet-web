import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as sideBar from '../pages/sidebar.pages'
import * as navigation from '../pages/navigation.page'

describe('Sidebar tests', () => {
  beforeEach(() => {
    cy.visit(constants.homeUrl + constants.SEPOLIA_TEST_SAFE_13)
    cy.clearLocalStorage()
    main.acceptCookies()
  })

  it('Verify Current network is displayed at the top', () => {
    sideBar.verifyNetworkIsDisplayed(constants.networks.sepolia)
  })

  it('Verify current safe details', () => {
    sideBar.verifySafeHeaderDetails(sideBar.testSafeHeaderDetails)
  })

  it('Verify QR button opens the QR code modal', () => {
    sideBar.clickOnQRCodeBtn()
    sideBar.verifyQRModalDisplayed()
  })

  it('Verify Copy button copies the address', () => {
    sideBar.verifyCopyAddressBtn(constants.SEPOLIA_TEST_SAFE_13.substring(4))
  })

  it('Verify Open blockexplorer button contain etherscan link', () => {
    sideBar.verifyEtherscanLinkExists()
  })

  it('Verify New transaction button enabled for owners', () => {
    sideBar.verifyNewTxBtnStatus(constants.enabledStates.enabled)
  })

  it('Verify New transaction button enabled for beneficiaries who are non-owners', () => {
    cy.visit(constants.homeUrl + constants.SEPOLIA_TEST_SAFE_14)
    sideBar.verifyNewTxBtnStatus(constants.enabledStates.enabled)
  })

  it('Verify New Transaction button disabled for non-owners', () => {
    navigation.clickOnWalletExpandMoreIcon()
    navigation.clickOnDisconnectBtn()
    main.verifyElementsCount(navigation.newTxBtn, 0)
  })

  it('Verify the side menu buttons exist', () => {
    sideBar.verifySideListItems()
  })

  it('Verify counter in the "Transaction" menu item if there are tx in the queue tab', () => {
    sideBar.verifyTxCounter(1)
  })
})
