import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as safeapps from '../pages/safeapps.pages'

describe('Info modal tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(`${constants.appsUrl}?safe=${constants.SEPOLIA_TEST_SAFE_5}`, {
      failOnStatusCode: false,
    })
    main.acceptCookies()
  })

  it('Verify the disclaimer is displayed when a Safe App is opened', () => {
    safeapps.clickOnApp(safeapps.transactionBuilderStr)
    safeapps.clickOnOpenSafeAppBtn()
  })

  // Skip tests due to changed logic
  // TODO: Discuss furthers
  it.skip('Verify the permissions slide is shown if the app require permissions', () => {
    safeapps.clickOnContinueBtn()
    cy.wait(500) // wait for the animation to finish
    safeapps.verifyCameraCheckBoxExists()
  })

  it.skip('Verify the permissions and consents decision are stored when accepted', () => {
    safeapps.storeAndVerifyPermissions()
  })
})
