import * as constants from '../../support/constants'

const searchAppInput = 'input[id="search-by-name"]'
const appUrlInput = 'input[name="appUrl"]'
const closePreviewWindowBtn = 'button[aria-label*="Close"][aria-label*="preview"]'
export const contractMethodIndex = '[name="contractMethodIndex"]'
export const saveToLibraryBtn = 'button[title="Save to Library"]'
export const downloadBatchBtn = 'button[title="Download batch"]'
export const deleteBatchBtn = 'button[title="Delete Batch"]'
const appModal = '[data-testid="app-info-modal"]'
export const safeAppsList = '[data-testid="apps-list"]'

const addBtnStr = /add/i
const noAppsStr = /no Safe Apps found/i
const bookmarkedAppsStr = /bookmarked Apps/i
const customAppsStr = /my custom Apps/i
const addCustomAppBtnStr = /add custom Safe App/i
const openSafeAppBtnStr = /open Safe App/i
const disclaimerTtle = /disclaimer/i
const continueBtnStr = /continue/i
const cameraCheckBoxStr = /camera/i
const microfoneCheckBoxStr = /microphone/i
const permissionRequestStr = /permissions request/i
const accessToAddressBookStr = /access to your address book/i
const acceptBtnStr = /accept/i
const clearAllBtnStr = /clear all/i
const allowAllPermissions = /allow all/i
export const enterAddressStr = /enter address or ens name/i
export const addTransactionStr = /add transaction/i
export const createBatchStr = /create batch/i
export const sendBatchStr = /send batch/i
export const transactionDetailsStr = /transaction details/i
export const addOwnerWithThreshold = /add signer with threshold/i
export const enterABIStr = /Enter ABI/i
export const toAddressStr = /to address/i
export const tokenAmount = /ETH value */i
export const dataStr = /data */i
export const clearTransactionListStr = /Clear transaction list?/i
export const confirmClearTransactionListStr = /Yes, clear/i
export const cancelBtnStr = 'Cancel'
export const confirmDeleteBtnStr = 'Yes, delete'
export const backBtnStr = /Back/i
export const simulateBtnStr = /Simulate/i
export const reviewAndConfirmStr = /Review and confirm/i
export const backToTransactionStr = /Back to Transaction Creation/i
export const batchNameStr = /Batch name/i
export const transactionLibraryStr = /Your transaction library/i
export const noSavedBatchesStr = /You don't have any saved batches./i
export const keepProxiABIStr = /Keep Proxy ABI/i
export const selectAllRowsChbxStr = /Select All Rows checkbox/i
export const selectRowChbxStr = /Select Row checkbox/i
export const recipientStr = /recipient/i
export const validRecipientAddressStr = /please enter a valid recipient address/i
export const testAddressValue2 = 'testAddressValue'
export const testBooleanValue = 'testBooleanValue'
export const testFallback = 'fallback'
export const customData = 'Custom hex data'
export const testBooleanValue1 = '1 testBooleanValue'
export const testBooleanValue2 = '2 testBooleanValue'
export const testBooleanValue3 = '3 testBooleanValue'
export const transfer2AssetsStr = 'Transfer 2 assets'

export const testTransfer1 = '1 transfer'
export const testTransfer2 = '2 transfer'
export const nativeTransfer2 = '2 native transfer'
export const nativeTransfer1 = '1 native transfer'

export const testNativeTransfer = 'native transfer'

export const newValueBool = 'newValue(bool):'
export const ownerAddressStr = 'signer (address)'
export const ownerAddressStr2 = 'signer(address)'
export const thresholdStr = '_threshold (uint256) *'
export const thresholdStr2 = '_threshold(uint256):'

const appNotSupportedMsg = "The app doesn't support Safe App functionality"
export const changedPropertiesStr = 'This batch contains some changed properties since you saved or downloaded it'
export const anotherChainStr = 'This batch is from another Chain (1)!'
export const useImplementationABI = 'Use Implementation ABI'
export const addressNotValidStr = 'The address is not valid'
export const transferEverythingStr = 'Transfer everything'
export const noTokensSelectedStr = 'No tokens selected'
export const reviewConfirmStr = 'Review and Confirm'
export const requiredStr = 'Required'
export const e3eTestStr = 'E2E test'
export const createBtnStr = 'Create'
export const warningStr = 'Warning'
export const transferStr = 'Transfer'
export const successStr = 'Success'
export const failedStr = 'Failed'

export const pinWalletConnectStr = /pin walletconnect/i
export const transactionBuilderStr = 'Transaction Builder'
export const testAddressValueStr = 'testAddressValue'
export const logoWalletConnect = /logo.*walletconnect/i
export const walletConnectHeadlinePreview = /walletconnect/i
export const newAddressValueStr = 'newValue (address)'
export const newAddressValueStr2 = 'newValue(address)'
export const transactiobUilderHeadlinePreview = 'Transaction Builder'
export const availableNetworksPreview = 'Available networks'
export const connecttextPreview = 'Compose custom contract interactions and batch them into a single transaction'
const warningDefaultAppStr = 'The application you are trying to access is not in the default Safe Apps list'
export const localStorageItem =
  '{"https://safe-test-app.com":[{"feature":"camera","status":"granted"},{"feature":"microphone","status":"denied"}]}'
export const gridItem = 'main .MuiPaper-root > .MuiGrid-item'
export const linkNames = {
  wcLogo: /WalletConnect logo/i,
  txBuilderLogo: /Transaction Builder logo/i,
}
export const abi =
  '[{{}"inputs":[{{}"internalType":"address","name":"_singleton","type":"address"{}}],"stateMutability":"nonpayable","type":"constructor"{}},{{}"stateMutability":"payable","type":"fallback"{}}]'

export const permissionCheckboxes = {
  camera: 'input[name="camera"]',
  addressbook: 'input[name="requestAddressBook"]',
  microphone: 'input[name="microphone"]',
  geolocation: 'input[name="geolocation"]',
  fullscreen: 'input[name="fullscreen"]',
}

export const permissionCheckboxNames = {
  camera: 'Camera',
  addressbook: 'Address Book',
  microphone: 'Microphone',
  geolocation: 'Geolocation',
  fullscreen: 'Fullscreen',
}

export function verifyWarningDefaultAppMsgIsDisplayed() {
  cy.get('p').contains(warningDefaultAppStr).should('be.visible')
  cy.wait(1000)
}

export function typeAppName(name) {
  cy.get(searchAppInput).clear().type(name)
}

export function clearSearchAppInput() {
  cy.get(searchAppInput).clear()
}

export function verifyLinkName(name) {
  cy.findAllByRole('link', { name: name }).should('have.length', 1)
}

export function clickOnApp(app) {
  cy.contains(app).click()
}

export function verifyNoAppsTextPresent() {
  cy.contains(noAppsStr).should('exist')
}

export function pinApp(app, pin = true) {
  const option = pin ? 'Pin' : 'Unpin'
  cy.get(`[aria-label="${option} ${app}"]`).click()
}

export function clickOnBookmarkedAppsTab() {
  cy.findByText(bookmarkedAppsStr).click()
}

export function verifyAppCount(count) {
  cy.findByText(`All apps (${count})`).should('be.visible')
}

export function verifyCustomAppCount(count) {
  cy.findByText(`Custom apps (${count})`).should('be.visible')
}

export function verifyPinnedAppCount(count) {
  cy.findByText(`My pinned apps (${count})`).should(count ? 'be.visible' : 'not.exist')
}

export function clickOnCustomAppsTab() {
  cy.findByText(customAppsStr).click()
}

export function clickOnAddCustomApp() {
  cy.findByText(addCustomAppBtnStr).click()
}

export function typeCustomAppUrl(url) {
  cy.get(appUrlInput).clear().type(url)
}

export function verifyAppNotSupportedMsg() {
  cy.contains(appNotSupportedMsg).should('be.visible')
}

export function verifyAppTitle(title) {
  cy.findByRole('heading', { name: title }).should('exist')
}

export function acceptTC() {
  cy.findByRole('checkbox').click()
}

export function clickOnAddBtn() {
  cy.findByRole('button', { name: addBtnStr }).click()
}

export function verifyAppDescription(descr) {
  cy.findByText(descr).should('exist')
}

export function clickOnOpenSafeAppBtn() {
  cy.findByRole('link', { name: openSafeAppBtnStr }).click()
  cy.wait(500)
  verifyDisclaimerIsVisible()
  cy.wait(500)
}

function verifyDisclaimerIsVisible() {
  cy.findByRole('heading', { name: disclaimerTtle }).should('be.visible')
}

export function clickOnContinueBtn() {
  cy.get(appModal).should('exist')
  return cy.findByRole('button', { name: continueBtnStr }).click().wait(1000)
}

export function checkLocalStorage() {
  clickOnContinueBtn().should(() => {
    expect(window.localStorage.getItem(constants.BROWSER_PERMISSIONS_KEY)).to.eq(localStorageItem)
  })
}

export function verifyCameraCheckBoxExists() {
  cy.findByRole('checkbox', { name: cameraCheckBoxStr }).should('exist')
}

export function verifyMicrofoneCheckBoxExists() {
  return cy.findByRole('checkbox', { name: microfoneCheckBoxStr }).should('exist')
}

export function storeAndVerifyPermissions() {
  cy.waitForSelector(() => {
    return cy
      .findByRole('button', { name: continueBtnStr })
      .click()
      .wait(500)
      .should(() => {
        const storedBrowserPermissions = JSON.parse(localStorage.getItem(constants.BROWSER_PERMISSIONS_KEY))
        const browserPermissions = Object.values(storedBrowserPermissions)[0][0]
        const storedInfoModal = JSON.parse(localStorage.getItem(constants.INFO_MODAL_KEY))

        expect(browserPermissions.feature).to.eq('camera')
        expect(browserPermissions.status).to.eq('granted')
        expect(storedInfoModal['11155111'].consentsAccepted).to.eq(true)
      })
  })
}

export function verifyPreviewWindow(str1, str2, str3) {
  cy.findByRole('heading', { name: str1 }).should('exist')
  cy.findByText(str2).should('exist')
  cy.findByText(str3).should('exist')
}

export function closePreviewWindow() {
  cy.get(closePreviewWindowBtn).click()
}

export function verifyPermissionsRequestExists() {
  cy.findByRole('heading', { name: permissionRequestStr }).should('exist')
}

export function verifyAccessToAddressBookExists() {
  cy.findByText(accessToAddressBookStr).should('exist')
}

export function clickOnAcceptBtn() {
  cy.findByRole('button', { name: acceptBtnStr }).click()
}

export function uncheckAllPermissions(element) {
  cy.wrap(element).findByText(clearAllBtnStr).click()
}

export function checkAllPermissions(element) {
  cy.wrap(element).findByText(allowAllPermissions).click()
}

export function verifyPinnedApp(name) {
  cy.get(`[aria-label="${name}"]`)
}
