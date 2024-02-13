import * as constants from '../../support/constants'
import * as main from '../../e2e/pages/main.page'
import * as owner from '../pages/owners.pages'
import * as navigation from '../pages/navigation.page'

describe('[SMOKE] Add Owners tests', () => {
  beforeEach(() => {
    cy.visit(constants.setupUrl + constants.SEPOLIA_TEST_SAFE_1)
    cy.clearLocalStorage()
    main.waitForHistoryCallToComplete()
    main.acceptCookies()
    main.verifyElementsExist([navigation.setupSection])
  })

  it('[SMOKE] Verify the presence of "Add Owner" button', () => {
    owner.verifyAddOwnerBtnIsEnabled()
  })

  it('[SMOKE] Verify “Add new owner” button tooltip displays correct message for Non-Owner', () => {
    cy.visit(constants.setupUrl + constants.SEPOLIA_TEST_SAFE_2)
    main.waitForHistoryCallToComplete()
    owner.verifyAddOwnerBtnIsDisabled()
  })

  // TODO: Check if this test is covered with unit tests
  it('[SMOKE] Verify relevant error messages are displayed in Address input', () => {
    owner.waitForConnectionStatus()
    owner.openAddOwnerWindow()
    owner.typeOwnerAddress(main.generateRandomString(10))
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.invalidFormat)

    owner.typeOwnerAddress(constants.addresBookContacts.user1.address.toUpperCase())
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.invalidChecksum)

    owner.typeOwnerAddress(constants.SEPOLIA_TEST_SAFE_1)
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.ownSafe)

    owner.typeOwnerAddress(constants.addresBookContacts.user1.address.replace('F', 'f'))
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.invalidChecksum)

    owner.typeOwnerAddress(constants.DEFAULT_OWNER_ADDRESS)
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.alreadyAdded)
  })

  it('[SMOKE] Verify default threshold value. Verify correct threshold calculation', () => {
    owner.waitForConnectionStatus()
    owner.openAddOwnerWindow()
    owner.typeOwnerAddress(constants.DEFAULT_OWNER_ADDRESS)
    owner.verifyThreshold(1, 2)
  })

  it('[SMOKE] Verify valid Address validation', () => {
    owner.waitForConnectionStatus()
    owner.openAddOwnerWindow()
    owner.typeOwnerAddress(constants.SEPOLIA_OWNER_2)
    owner.clickOnNextBtn()
    owner.verifyConfirmTransactionWindowDisplayed()
    owner.clickOnBackBtn()
    owner.typeOwnerAddress(constants.SEPOLIA_TEST_SAFE_2)
    owner.clickOnNextBtn()
    owner.verifyConfirmTransactionWindowDisplayed()
  })
})
