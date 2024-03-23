import * as constants from '../../support/constants'
import * as safeapps from '../pages/safeapps.pages'
import * as main from '../pages/main.page'
import * as createtx from '../../e2e/pages/create_tx.pages'

const connectAndTransactStr = 'Connect & transact'
const transactionQueueStr = 'Pending transactions'
const noTransactionStr = 'This Safe has no queued transactions'
const overviewStr = 'Total asset value'
const sendStr = 'Send'
const receiveStr = 'Receive'
const viewAllStr = 'View all'
const transactionBuilderStr = 'Use Transaction Builder'
const safeAppStr = 'Safe Apps'
const exploreSafeApps = 'Explore Safe Apps'
export const copiedAppUrl = 'share/safe-app?appUrl'

const txBuilder = 'a[href*="tx-builder"]'
const safeSpecificLink = 'a[href*="&appUrl=http"]'
const copyShareBtn = '[data-testid="copy-btn-icon"]'
const exploreAppsBtn = '[data-testid="explore-apps-btn"]'
const viewAllLink = '[data-testid="view-all-link"]'
const noTxIcon = '[data-testid="no-tx-icon"]'
const noTxText = '[data-testid="no-tx-text"]'
const pendingTxWidget = '[data-testid="pending-tx-widget"]'
const pendingTxItem = '[data-testid="tx-pending-item"]'
const singleTxDetailsHeader = '[data-testid="tx-details"]'

export function clickOnTxByIndex(index) {
  cy.get(pendingTxItem).eq(index).click()
  cy.get(singleTxDetailsHeader).should('be.visible')
}

export function verifySingleTxItem(data) {
  main.checkTextsExistWithinElement(createtx.transactionItem, data)
}

export function verifyDataInPendingTx(data) {
  main.checkTextsExistWithinElement(pendingTxWidget, data)
}

export function verifyTxItemInPendingTx(data) {
  let matchFound = false

  cy.get(pendingTxItem)
    .each(($item) => {
      const itemText = $item.text()
      const isMatch = data.every((tx) => itemText.includes(tx))

      if (isMatch) {
        matchFound = true
        return false
      }
    })
    .then(() => {
      expect(matchFound).to.be.true
    })
}

export function verifyEmptyTxSection() {
  main.verifyElementsIsVisible([noTxIcon, noTxText])
}

export function clickOnViewAllBtn() {
  cy.get(viewAllLink).click()
}

export function pinAppByIndex(index) {
  return cy
    .get('[aria-label*="Pin"]')
    .eq(index)
    .click()
    .then(() => {
      cy.wait(1000)
      return cy.get('[aria-label*="Unpin"]').eq(0).invoke('attr', 'aria-label')
    })
}

export function clickOnPinBtnByName(name) {
  cy.get(`[aria-label="${name}"]`).click()
}

export function verifyPinnedAppsCount(count) {
  cy.get(`[aria-label*="Unpin"]`).should('have.length', count)
}

export function clickOnExploreAppsBtn() {
  cy.get(exploreAppsBtn).click()
  cy.get(safeapps.safeAppsList)
    .should('exist')
    .within(() => {
      cy.get('li').should('have.length.at.least', 1)
    })
}

export function verifyShareBtnWorks(index, data) {
  cy.get(copyShareBtn)
    .eq(index)
    .click()
    .then(() =>
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          expect(text).to.contain(data)
        })
      }),
    )
}

export function verifyConnectTransactStrIsVisible() {
  cy.contains(connectAndTransactStr).should('be.visible')
}

export function verifyOverviewWidgetData() {
  // Alias for the Overview section
  cy.contains('div', overviewStr).parents('section').as('overviewSection')

  cy.get('@overviewSection').within(() => {
    // Prefix is separated across elements in EthHashInfo
    cy.get('button').contains(sendStr)
    cy.get('button').contains(receiveStr)
  })
}

export function verifyTxQueueWidget() {
  // Alias for the Transaction queue section
  cy.contains('h2', transactionQueueStr).parents('section').as('txQueueSection')

  cy.get('@txQueueSection').within(() => {
    // There should be queued transactions
    cy.contains(noTransactionStr).should('not.exist')

    // Queued txns
    cy.contains(
      `a[href^="/transactions/tx?id=multisig_0x"]`,
      '14' + 'Send' + `-0.00002 ${constants.tokenAbbreviation.sep}` + '1 out of 1',
    ).should('exist')

    cy.contains(
      `a[href="${constants.transactionQueueUrl}${encodeURIComponent(constants.SEPOLIA_TEST_SAFE_5)}"]`,
      viewAllStr,
    )
  })
}

export function verifyFeaturedAppsSection() {
  // Alias for the featured Safe Apps section
  cy.contains('h2', connectAndTransactStr).parents('section').as('featuredSafeAppsSection')

  // Tx Builder app
  cy.get('@featuredSafeAppsSection').within(() => {
    // Transaction Builder
    cy.contains(transactionBuilderStr)
    cy.get(txBuilder).should('exist')

    // Featured apps have a Safe-specific link
    cy.get(safeSpecificLink).should('have.length', 2)
  })
}

export function verifySafeAppsSection() {
  cy.contains('h2', safeAppStr).parents('section').as('safeAppsSection')
  cy.get('@safeAppsSection').contains(exploreSafeApps)
}
