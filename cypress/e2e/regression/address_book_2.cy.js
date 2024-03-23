import * as constants from '../../support/constants.js'
import * as addressBook from '../pages/address_book.page.js'
import * as main from '../pages/main.page.js'
import * as ls from '../../support/localstorage_data.js'
import * as createtx from '../../e2e/pages/create_tx.pages'
import * as data from '../../fixtures/txhistory_data_data.json'

const typeReceive = data.type.receive

const owner1 = 'Automation owner'
const onwer2 = 'Changed Automation owner'
const onwer3 = 'New Automation owner'

describe('Address book tests - 2', () => {
  beforeEach(() => {
    cy.visit(constants.addressBookUrl + constants.SEPOLIA_TEST_SAFE_1)
    cy.clearLocalStorage()
    cy.wait(1000)
    main.acceptCookies()
  })

  it('Verify Name and Address columns sorting works', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addressBook, ls.addressBookData.sortingData)
    cy.reload()
    addressBook.clickOnNameSortBtn()
    addressBook.verifyEntriesOrder()
    addressBook.clickOnNameSortBtn()
    addressBook.verifyEntriesOrder('descending')

    // Clicking twice is required to trigger actual click after swtiching from Name
    addressBook.clickOnAddrressSortBtn()
    addressBook.clickOnAddrressSortBtn()
    addressBook.verifyEntriesOrder()
    addressBook.clickOnAddrressSortBtn()
    addressBook.verifyEntriesOrder('descending')
  })

  it('Verify that edit owners name changes the name in the settings', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addressBook, ls.addressBookData.sepoliaAddress2)
    cy.reload()
    addressBook.clickOnEditEntryBtn()
    addressBook.typeInNameInput(onwer2)
    addressBook.clickOnSaveEntryBtn()
    addressBook.verifyNameWasChanged(owner1, onwer2)
    cy.visit(constants.setupUrl + constants.SEPOLIA_TEST_SAFE_1)
    addressBook.verifyNameWasChanged(owner1, onwer2)
  })

  it('Verify that editing an entry from the transaction details updates the name in address book', () => {
    cy.visit(constants.transactionsHistoryUrl + constants.SEPOLIA_TEST_SAFE_8)
    main.waitForHistoryCallToComplete()
    createtx.clickOnTransactionItemByName(typeReceive.summaryTitle, typeReceive.summaryTxInfo)
    addressBook.clickOnMoreActionsBtn()
    addressBook.clickOnAddToAddressBookBtn()
    addressBook.typeInNameInput(onwer3)
    addressBook.clickOnSaveEntryBtn()
    addressBook.verifyNameWasChanged(owner1, onwer3)
    cy.visit(constants.addressBookUrl + constants.SEPOLIA_TEST_SAFE_8)
    addressBook.verifyNameWasChanged(owner1, onwer3)
  })

  it('Verify copy to clipboard/Etherscan work as expected', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addressBook, ls.addressBookData.sepoliaAddress1)
    cy.wait(1000)
    cy.reload()
    createtx.verifyCopyIconWorks(0, constants.RECIPIENT_ADDRESS)
    createtx.verifyNumberOfExternalLinks(1)
  })

  it('Verify by default there 25 rows shown per page', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addressBook, ls.addressBookData.pagination)
    cy.wait(1000)
    cy.reload()
    addressBook.verifyCountOfSafes(25)
  })

  it('Verify that clicking on next and previous page buttons shows safes', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addressBook, ls.addressBookData.pagination)
    cy.wait(1000)
    cy.reload()
    addressBook.clickOnNextPageBtn()
    addressBook.verifyCountOfSafes(1)
    addressBook.clickOnPrevPageBtn()
    addressBook.verifyCountOfSafes(25)
  })
})
