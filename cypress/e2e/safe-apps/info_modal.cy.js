import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as safeapps from '../pages/safeapps.pages'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'

let staticSafes = []

describe('Info modal tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.visit(`${constants.appsUrl}?safe=${staticSafes.SEP_STATIC_SAFE_2}`, {
      failOnStatusCode: false,
    })
  })

  it('Verify the disclaimer is displayed when a Safe App is opened', () => {
    // Required to show disclaimer
    cy.clearLocalStorage()
    main.acceptCookies()
    safeapps.clickOnApp(safeapps.transactionBuilderStr)
    safeapps.clickOnOpenSafeAppBtn()
    safeapps.verifyDisclaimerIsDisplayed()
  })

  it('Verify info modal consent is stored when accepted', { defaultCommandTimeout: 20000 }, () => {
    // Required to show disclaimer
    cy.clearLocalStorage()
    main.acceptCookies()
    safeapps.clickOnApp(safeapps.transactionBuilderStr)
    safeapps.clickOnOpenSafeAppBtn()
    safeapps.verifyDisclaimerIsDisplayed()
    safeapps.verifyInfoModalAcceptance()
  })
})
