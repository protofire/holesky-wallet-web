import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as safeapps from '../pages/safeapps.pages'

const testAppName = 'Cypress Test App'
const testAppDescr = 'Cypress Test App Description'

describe('Transaction modal tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.fixture('safe-app').then((html) => {
      cy.intercept('GET', `${constants.testAppUrl}/*`, html)
      cy.intercept('GET', `*/manifest.json`, {
        name: testAppName,
        description: testAppDescr,
        icons: [{ src: 'logo.svg', sizes: 'any', type: 'image/svg+xml' }],
      })
    })
  })

  it(
    'Verify that the transaction popup is displayed when sending a transaction from an app',
    { defaultCommandTimeout: 12000 },
    () => {
      cy.visitSafeApp(`${constants.testAppUrl}/dummy`)
      main.acceptCookies()
      safeapps.clickOnContinueBtn()
      safeapps.verifyWarningDefaultAppMsgIsDisplayed()
      safeapps.clickOnContinueBtn()
      cy.findByRole('dialog').within(() => {
        cy.findByText(testAppName)
      })
    },
  )
})
