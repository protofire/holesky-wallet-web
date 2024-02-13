import * as constants from '../../support/constants'

const tokenSelectorText = 'G(ö|oe)rli Ether'
const noLaterString = 'No, later'
const yesExecuteString = 'Yes, execute'
const newTransactionTitle = 'New transaction'
const sendTokensButn = 'Send tokens'
const nextBtn = 'Next'
const executeBtn = 'Execute'
const addToBatchBtn = 'Add to batch'
const confirmBatchBtn = 'Confirm batch'

export const closeModalBtnBtn = '[data-testid="CloseIcon"]'
export const deleteTransactionbtn = '[title="Delete transaction"]'
export const batchTxTopBar = '[data-track="batching: Batch sidebar open"]'
export const batchTxCounter = '[data-track="batching: Batch sidebar open"] span > span'
export const addNewTxBatch = '[data-track="batching: Add new tx to batch"]'
export const batchedTransactionsStr = 'Batched transactions'
export const addInitialTransactionStr = 'Add an initial transaction to the batch'
export const transactionAddedToBatchStr = 'Transaction is added to batch'
export const addNewStransactionStr = 'Add new transaction'

const recipientInput = 'input[name="recipient"]'
const tokenAddressInput = 'input[name="tokenAddress"]'
const listBox = 'ul[role="listbox"]'
const amountInput = '[name="amount"]'
const nonceInput = 'input[name="nonce"]'
const executeOptionsContainer = 'div[role="radiogroup"]'

export function addToBatch(EOA, currentNonce, amount, verify = false) {
  fillTransactionData(EOA, amount)
  setNonceAndProceed(currentNonce)
  // Execute the transaction if verification is required
  if (verify) {
    executeTransaction()
  }
  addToBatchButton()
}

function fillTransactionData(EOA, amount) {
  cy.get(recipientInput).type(EOA, { delay: 1 })
  // Click on the Token selector
  cy.get(tokenAddressInput).prev().click()
  cy.get(listBox).contains(constants.tokenNames.sepoliaEther).click()
  cy.get(amountInput).type(amount)
  cy.contains(nextBtn).click()
}

function setNonceAndProceed(currentNonce) {
  cy.get(nonceInput).clear().type(currentNonce, { force: true }).blur()
  cy.contains(executeBtn).scrollIntoView()
}

function executeTransaction() {
  cy.waitForSelector(() => {
    return cy.get(executeOptionsContainer).then(() => {
      cy.contains(yesExecuteString, { timeout: 4000 }).click()
      cy.contains(addToBatchBtn).should('not.exist')
    })
  })
}

function addToBatchButton() {
  cy.contains(addToBatchBtn).should('be.visible').and('not.be.disabled').click()
}

export function openBatchtransactionsModal() {
  cy.get(batchTxTopBar).should('be.visible').click()
  cy.contains(batchedTransactionsStr).should('be.visible')
}

export function openNewTransactionModal() {
  cy.get(addNewTxBatch).click()
  cy.contains(sendTokensButn).click()
}

export function addNewTransactionToBatch(EOA, currentNonce, funds_first_tx) {
  openBatchtransactionsModal()
  openNewTransactionModal()
  addToBatch(EOA, currentNonce, funds_first_tx)
}

export function verifyAmountTransactionsInBatch(count) {
  cy.contains(batchedTransactionsStr, { timeout: 7000 })
    .should('be.visible')
    .parents('aside')
    .find('ul > li')
    .should('have.length', count)
}

export function clickOnConfirmBatchBtn() {
  cy.get('button').contains(confirmBatchBtn).should('be.visible').should('be.enabled').click()
}

export function verifyBatchTransactionsCount(count) {
  cy.contains(`This batch contains ${count} transactions`).should('be.visible')
}

export function clickOnBatchCounter() {
  cy.get(batchTxCounter).click()
}
export function verifyTransactionAdded() {
  cy.contains(transactionAddedToBatchStr).should('be.visible')
}

export function verifyBatchIconCount(count) {
  cy.get(batchTxCounter).contains(count)
}
