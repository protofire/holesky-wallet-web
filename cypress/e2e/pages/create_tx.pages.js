import * as constants from '../../support/constants'
import * as main from '../pages/main.page'

export const delegateCallWarning = '[data-testid="delegate-call-warning"]'
export const policyChangeWarning = '[data-testid="threshold-warning"]'
const newTransactionBtnStr = 'New transaction'
const recepientInput = 'input[name="recipient"]'
const sendTokensBtnStr = 'Send tokens'
const tokenAddressInput = 'input[name="tokenAddress"]'
const amountInput = 'input[name="amount"]'
const nonceInput = 'input[name="nonce"]'
const nonceTxValue = '[data-testid="nonce"]'
const gasLimitInput = '[name="gasLimit"]'
const rotateLeftIcon = '[data-testid="RotateLeftIcon"]'
export const transactionItem = '[data-testid="transaction-item"]'
export const connectedWalletExecMethod = '[data-testid="connected-wallet-execution-method"]'
const addToBatchBtn = '[data-track="batching: Add to batch"]'
const accordionDetails = '[data-testid="accordion-details"]'
const copyIcon = '[data-testid="copy-btn-icon"]'
const transactionSideList = '[data-testid="transaction-actions-list"]'
const confirmationVisibilityBtn = '[data-testid="confirmation-visibility-btn"]'
const expandAllBtn = '[data-testid="expande-all-btn"]'
const collapseAllBtn = '[data-testid="collapse-all-btn"]'
const txRowTitle = '[data-testid="tx-row-title"]'
const advancedDetails = '[data-testid="tx-advanced-details"]'
const baseGas = '[data-testid="tx-bas-gas"]'
const requiredConfirmation = '[data-testid="required-confirmations"]'
export const txDate = '[data-testid="tx-date"]'
const spamTokenWarningIcon = '[data-testid="warning"]'
const untrustedTokenWarningModal = '[data-testid="untrusted-token-warning"]'
const sendTokensBtn = '[data-testid="send-tokens-btn"]'

const viewTransactionBtn = 'View transaction'
const transactionDetailsTitle = 'Transaction details'
const QueueLabel = 'needs to be executed first'
const TransactionSummary = 'Send '
const transactionsPerHrStr = 'free transactions left this hour'

const maxAmountBtnStr = 'Max'
const nextBtnStr = 'Next'
const nativeTokenTransferStr = 'Native token transfer'
const yesStr = 'Yes, '
const estimatedFeeStr = 'Estimated fee'
const executeStr = 'Execute'
const editBtnStr = 'Edit'
const executionParamsStr = 'Execution parameters'
const noLaterStr = 'No, later'
const signBtnStr = 'Sign'
const expandAllBtnStr = 'Expand all'
const collapseAllBtnStr = 'Collapse all'

export function clickOnSendTokensBtn() {
  cy.get(sendTokensBtn).click()
}
export function verifyNumberOfTransactions(count) {
  cy.get(txDate).should('have.length.at.least', count)
  cy.get(transactionItem).should('have.length.at.least', count)
}

export function checkRequiredThreshold(count) {
  cy.get(requiredConfirmation).should('be.visible').and('include.text', count)
}

export function verifyAddressNotCopied(index, data) {
  cy.get(copyIcon)
    .parent()
    .eq(index)
    .trigger('click')
    .wait(1000)
    .then(() =>
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          expect(text).not.to.contain(data)
        })
      }),
    )
  cy.get(untrustedTokenWarningModal).should('be.visible')
}

export function verifyWarningModalVisible() {
  cy.get(untrustedTokenWarningModal).should('be.visible')
}

export function clickOnCopyBtn(index) {
  cy.get(copyIcon).parent().eq(index).trigger('click')
}

export function verifyCopyIconWorks(index, data) {
  cy.get(copyIcon)
    .parent()
    .eq(index)
    .trigger('click')
    .then(() =>
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          expect(text).to.contain(data)
        })
      }),
    )
}

export function verifyNumberOfCopyIcons(number) {
  main.verifyElementsCount(copyIcon, number)
}

export function verifyNumberOfExternalLinks(number) {
  for (let i = 0; i <= number; i++) {
    cy.get(copyIcon).parent().parent().next().should('be.visible')
    cy.get(copyIcon)
      .parent()
      .parent()
      .next()
      .children()
      .should('have.attr', 'href')
      .and('include', constants.sepoliaEtherscanlLink)
  }
}

export function clickOnTransactionItemByName(name, token) {
  cy.get(transactionItem)
    .filter(':contains("' + name + '")')
    .then(($elements) => {
      if (token) {
        $elements = $elements.filter(':contains("' + token + '")')
      }
      cy.wrap($elements.first()).click({ force: true })
    })
}

export function verifyExpandedDetails(data, warning) {
  main.checkTextsExistWithinElement(accordionDetails, data)
  if (warning) cy.get(warning).should('be.visible')
}

export function verifyActions(data) {
  main.checkTextsExistWithinElement(accordionDetails, data)
}

export function clickOnExpandableAction(data) {
  cy.get(accordionDetails).within(() => {
    cy.get('div').contains(data).click()
  })
}

function clickOnAdvancedDetails() {
  cy.get(advancedDetails).click()
}

export function expandAdvancedDetails(data) {
  clickOnAdvancedDetails()
  data.forEach((row) => {
    cy.get(txRowTitle).contains(row).should('be.visible')
  })
}

export function collapseAdvancedDetails() {
  clickOnAdvancedDetails()
  cy.get(baseGas).should('not.exist')
}

export function expandAllActions(actions) {
  cy.get(expandAllBtn).click()
  main.checkTextsExistWithinElement(accordionDetails, actions)
}

export function collapseAllActions(data) {
  cy.get(collapseAllBtn).click()
  data.forEach((action) => {
    cy.get(txRowTitle).contains(action).should('have.css', 'visibility', 'hidden')
  })
}

export function verifyActionListExists(data) {
  main.checkTextsExistWithinElement(transactionSideList, data)
  main.verifyElementsIsVisible([confirmationVisibilityBtn])
}

export function verifySpamIconIsDisplayed(name, token) {
  cy.get(transactionItem)
    .filter(':contains("' + name + '")')
    .filter(':contains("' + token + '")')
    .then(($elements) => {
      cy.wrap($elements.first()).then(($element) => {
        cy.wrap($element).find(spamTokenWarningIcon).should('be.visible')
      })
    })
}

export function verifySummaryByName(name, token, data, alt, altToken) {
  cy.get(transactionItem)
    .filter(':contains("' + name + '")')
    .then(($elements) => {
      if (token) {
        $elements = $elements.filter(':contains("' + token + '")')
      }

      if ($elements.length > 0) {
        cy.wrap($elements.first()).then(($element) => {
          if (Array.isArray(data)) {
            data.forEach((text) => {
              cy.wrap($element).contains(text).should('be.visible')
            })
          } else {
            cy.wrap($element).contains(data).should('be.visible')
          }
          if (alt) cy.wrap($element).find('img').eq(0).should('have.attr', 'alt', alt).should('be.visible')
          if (altToken) cy.wrap($element).find('img').eq(1).should('have.attr', 'alt', alt).should('be.visible')
        })
      }
    })
}

export function clickOnTransactionItem(item) {
  cy.get(transactionItem).eq(item).scrollIntoView().click({ force: true })
}

export function verifyTransactionActionsVisibility(option) {
  cy.get(transactionSideList).should(option)
}

export function clickOnNewtransactionBtn() {
  // Assert that "New transaction" button is visible
  cy.contains(newTransactionBtnStr, {
    timeout: 60_000, // `lastWallet` takes a while initialize in CI
  })
    .should('be.visible')
    .and('not.be.disabled')

  // Open the new transaction modal
  cy.contains(newTransactionBtnStr).click()
  cy.contains('h1', newTransactionBtnStr).should('be.visible')
}

export function typeRecipientAddress(address) {
  cy.get(recepientInput).clear().type(address).should('have.value', address)
}
export function verifyENSResolves(fullAddress) {
  let split = fullAddress.split(':')
  let noPrefixAddress = split[1]
  cy.get(recepientInput).should('have.value', noPrefixAddress)
}

export function verifyRandomStringAddress(randomAddressString) {
  typeRecipientAddress(randomAddressString)
  cy.contains(constants.addressBookErrrMsg.invalidFormat).should('be.visible')
}

export function verifyWrongChecksum(wronglyChecksummedAddress) {
  typeRecipientAddress(wronglyChecksummedAddress)
  cy.contains(constants.addressBookErrrMsg.invalidChecksum).should('be.visible')
}

export function verifyAmountLargerThanCurrentBalance() {
  setSendValue(9999)
  cy.contains(constants.amountErrorMsg.largerThanCurrentBalance).should('be.visible')
}

export function verifyTooltipMessage(message) {
  cy.get('div[role="tooltip"]').contains(message).should('be.visible')
}

export function selectCurrentWallet() {
  cy.get(connectedWalletExecMethod).click()
}

export function verifyRelayerAttemptsAvailable() {
  cy.contains(transactionsPerHrStr).should('be.visible')
}

export function clickOnTokenselectorAndSelectSepoliaEth() {
  cy.get(tokenAddressInput).prev().click()
  cy.get('ul[role="listbox"]').contains(constants.tokenNames.sepoliaEther).click()
}

export function setMaxAmount() {
  cy.contains(maxAmountBtnStr).click()
}

export function verifyMaxAmount(token, tokenAbbreviation) {
  cy.get(tokenAddressInput)
    .prev()
    .find('p')
    .contains(token)
    .next()
    .then((element) => {
      const maxBalance = parseFloat(element.text().replace(tokenAbbreviation, '').trim())
      cy.get(amountInput).should(($input) => {
        const actualValue = parseFloat($input.val())
        expect(actualValue).to.be.closeTo(maxBalance, 0.1)
      })
      console.log(maxBalance)
    })
}

export function setSendValue(value) {
  cy.get(amountInput).clear().type(value)
}

export function clickOnNextBtn() {
  cy.contains(nextBtnStr).click()
}

export function verifySubmitBtnIsEnabled() {
  cy.get('button[type="submit"]').should('not.be.disabled')
}

export function verifyAddToBatchBtnIsEnabled() {
  return cy.get(addToBatchBtn).should('not.be.disabled')
}

export function verifyNativeTokenTransfer() {
  cy.contains(nativeTokenTransferStr).should('be.visible')
}

export function changeNonce(value) {
  cy.get(nonceInput).clear().type(value, { force: true })
}

export function verifyConfirmTransactionData() {
  cy.contains(yesStr).should('exist').click()
  cy.contains(estimatedFeeStr).should('exist')

  // Asserting the sponsored info is present
  cy.contains(executeStr).scrollIntoView().should('be.visible')

  cy.get('span').contains(estimatedFeeStr)
}

export function openExecutionParamsModal() {
  cy.contains(estimatedFeeStr).click()
  cy.contains(editBtnStr).click()
}

export function verifyAndSubmitExecutionParams() {
  cy.contains(executionParamsStr).parents('form').as('Paramsform')

  const arrayNames = ['Wallet nonce', 'Max priority fee (Gwei)', 'Max fee (Gwei)', 'Gas limit']
  arrayNames.forEach((element) => {
    cy.get('@Paramsform').find('label').contains(`${element}`).next().find('input').should('not.be.disabled')
  })

  cy.get('@Paramsform').find(gasLimitInput).clear().type('100').invoke('prop', 'value').should('equal', '100')
  cy.contains('Gas limit must be at least 21000').should('be.visible')
  cy.get('@Paramsform').find(gasLimitInput).clear().type('300000').invoke('prop', 'value').should('equal', '300000')
  cy.get('@Paramsform').find(gasLimitInput).parent('div').find(rotateLeftIcon).click()
  cy.get('@Paramsform').submit()
}

export function clickOnNoLaterOption() {
  cy.contains(noLaterStr).click()
}

export function clickOnSignTransactionBtn() {
  cy.get('button').contains(signBtnStr).click()
}

export function waitForProposeRequest() {
  cy.intercept('POST', constants.proposeEndpoint).as('ProposeTx')
  cy.wait('@ProposeTx')
}

export function clickViewTransaction() {
  cy.contains(viewTransactionBtn).click()
}

export function verifySingleTxPage() {
  cy.get('h3').contains(transactionDetailsTitle).should('be.visible')
}

export function verifyQueueLabel() {
  cy.contains(QueueLabel).should('be.visible')
}

export function verifyTransactionSummary(sendValue) {
  cy.contains(TransactionSummary + `${sendValue} ${constants.tokenAbbreviation.sep}`).should('exist')
}

export function verifyDateExists(date) {
  cy.contains('div', date).should('exist')
}

export function verifyImageAltTxt(index, text) {
  cy.get('img').eq(index).should('have.attr', 'alt', text).should('be.visible')
}

export function verifyStatus(status) {
  cy.contains('div', status).should('exist')
}

export function verifyTransactionStrExists(str) {
  cy.contains(str).should('exist')
}

export function verifyTransactionStrNotVible(str) {
  cy.contains(str).should('not.be.visible')
}

export function clickOnExpandAllBtn() {
  cy.contains(expandAllBtnStr).click()
}

export function clickOnCollapseAllBtn() {
  cy.contains(collapseAllBtnStr).click()
}

export function verifyTxDestinationAddress(receivedAddress) {
  cy.get(receivedAddress).then((address) => {
    cy.contains(address).should('exist')
  })
}
