import 'cypress-file-upload'
import * as constants from '../../support/constants'
import * as safeapps from '../pages/safeapps.pages'
import * as createtx from '../../e2e/pages/create_tx.pages'
import * as navigation from '../pages/navigation.page'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as ls from '../../support/localstorage_data.js'
import { getEvents, events, checkDataLayerEvents } from '../../support/utils/gtag.js'
import * as wallet from '../../support/utils/wallet.js'
import * as utils from '../../support/utils/checkers.js'

let safeAppSafes = []
let iframeSelector

const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY
const signer2 = walletCredentials.OWNER_1_PRIVATE_KEY

describe('Transaction Builder tests', { defaultCommandTimeout: 20000 }, () => {
  before(async () => {
    safeAppSafes = await getSafes(CATEGORIES.safeapps)
  })

  beforeEach(() => {
    const appUrl = constants.TX_Builder_url
    iframeSelector = `iframe[id="iframe-${appUrl}"]`
    const visitUrl = `/apps/open?safe=${safeAppSafes.SEP_SAFEAPP_SAFE_1}&appUrl=${encodeURIComponent(appUrl)}`
    cy.visit(visitUrl)
  })

  // TODO: Check if we still need this test as we now create complete flow of creating, signing and deleting a tx
  it.skip('Verify a simple batch can be created', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByLabelText(safeapps.enterAddressStr).type(constants.SAFE_APP_ADDRESS)
      getBody().find(safeapps.contractMethodIndex).parent().click()
      getBody().findByRole('option', { name: safeapps.testAddressValue2 }).click()
      getBody().findByLabelText(safeapps.newAddressValueStr).type(safeAppSafes.SEP_SAFEAPP_SAFE_2)
      getBody().findByText(safeapps.addTransactionStr).click()
      getBody().findAllByText(constants.SEPOLIA_CONTRACT_SHORT).should('have.length', 1)
      getBody().findByText(safeapps.testAddressValueStr).should('exist')
      getBody().findByText(safeapps.createBatchStr).click()
      getBody().findByText(safeapps.sendBatchStr).click()
    })
    cy.get('h4').contains(safeapps.transactionBuilderStr).should('be.visible')
    createtx.clickOnNoLaterOption()
    createtx.verifyAddToBatchBtnIsEnabled().click()
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByText(safeapps.reviewConfirmStr).should('exist')
      getBody().findAllByText(constants.SEPOLIA_CONTRACT_SHORT).should('have.length', 1)
      getBody().findByText(safeapps.testAddressValueStr).should('exist')
    })
  })

  it('Verify a complex batch can be created', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByLabelText(safeapps.enterAddressStr).type(constants.SAFE_APP_ADDRESS)
      getBody().find(safeapps.contractMethodIndex).parent().click()
      getBody().findByRole('option', { name: safeapps.testBooleanValue }).click()
      getBody().findByText(safeapps.addTransactionStr).click()

      getBody().find(safeapps.contractMethodIndex).parent().click()
      getBody().findByRole('option', { name: safeapps.testBooleanValue }).click()
      getBody().findByText(safeapps.addTransactionStr).click()

      getBody().find(safeapps.contractMethodIndex).parent().click()
      getBody().findByRole('option', { name: safeapps.testBooleanValue }).click()
      getBody().findByText(safeapps.addTransactionStr).click()

      getBody().findAllByText(constants.SEPOLIA_CONTRACT_SHORT).should('have.length', 3)
      getBody().findAllByText(safeapps.testBooleanValue).should('have.length', 3)

      getBody().findByText(safeapps.createBatchStr).click()
      getBody().findByText(safeapps.sendBatchStr).click()
    })
    cy.get('h4').contains(safeapps.transactionBuilderStr).should('be.visible')
    cy.findAllByText(safeapps.testBooleanValue).should('have.length', 6)
    navigation.clickOnModalCloseBtn(0)
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findAllByText(constants.SEPOLIA_CONTRACT_SHORT).should('have.length', 3)
      getBody().findAllByText(safeapps.testBooleanValue).should('have.length', 3)
    })
  })

  // TODO: Fix this test once Sepolia ENS works in tx builder
  it.skip('Verify a batch can be created using ENS name', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByLabelText(safeapps.enterAddressStr).type(constants.ENS_TEST_SEPOLIA)
      getBody().findByRole('button', { name: safeapps.useImplementationABI }).click()
      getBody().findByLabelText(safeapps.ownerAddressStr).type(constants.SAFE_APP_ADDRESS_2)
      getBody().findByLabelText(safeapps.thresholdStr).type('1')
      getBody().findByText(safeapps.addTransactionStr).click()
      getBody().findByText(safeapps.createBatchStr).click()
      getBody().findByText(safeapps.sendBatchStr).click()
    })
    cy.findByRole('button', { name: safeapps.transactionDetailsStr }).click()
    cy.findByRole('region').should('exist')
    cy.findByText(safeapps.addOwnerWithThreshold).should('exist')
    cy.contains(safeapps.ownerAddressStr2).should('exist')
    cy.findAllByText(constants.SAFE_APP_ADDRESS_2_SHORT).should('have.length', 1)
    cy.findByText(safeapps.thresholdStr2).should('exist')
  })

  it.skip('Verify a batch can be created from an ABI', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByLabelText(safeapps.enterABIStr).type(safeapps.abi)
      getBody().findByLabelText(safeapps.toAddressStr).type(safeAppSafes.SEP_SAFEAPP_SAFE_2)
      getBody().findByLabelText(safeapps.tokenAmount).type('0')
      getBody().findByText(safeapps.addTransactionStr).click()

      getBody().findAllByText(constants.SEPOLIA_RECIPIENT_ADDR_SHORT).should('have.length', 1)
      // TODO: Need data-testid for this
      getBody().findAllByText(safeapps.testFallback).should('have.length', 2)

      getBody().findByText(safeapps.createBatchStr).click()
      getBody().findByText(safeapps.sendBatchStr).click()
    })
    cy.get('h4').contains(safeapps.transactionBuilderStr).should('be.visible')
    navigation.clickOnModalCloseBtn(0)
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findAllByText(constants.SEPOLIA_RECIPIENT_ADDR_SHORT).should('have.length', 1)
      getBody().findAllByText(safeapps.testFallback).should('have.length', 1)
    })
  })

  it('Verify a batch with custom data can be created', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().find('.MuiSwitch-root').click()
      getBody().findByLabelText(safeapps.enterAddressStr).type(constants.SAFE_APP_ADDRESS)
      getBody().findByLabelText(safeapps.tokenAmount).type('0')
      getBody().findByLabelText(safeapps.dataStr).type('0x')
      getBody().findByText(safeapps.addTransactionStr).click()

      getBody().findAllByText(constants.SEPOLIA_CONTRACT_SHORT).should('have.length', 1)
      getBody().findAllByText(safeapps.customData).should('have.length', 1)

      getBody().findByText(safeapps.createBatchStr).click()
      getBody().findByText(safeapps.sendBatchStr).click()
    })
    cy.get('h4').contains(safeapps.transactionBuilderStr).should('be.visible')
    navigation.clickOnModalCloseBtn(0)
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findAllByText(constants.SEPOLIA_CONTRACT_SHORT).should('have.length', 1)
      getBody().findAllByText(safeapps.customData).should('have.length', 1)
    })
  })

  it('Verify a batch can be cancelled', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByLabelText(safeapps.enterAddressStr).type(constants.SAFE_APP_ADDRESS)
      getBody().find(safeapps.contractMethodIndex).parent().click()
      getBody().findByRole('option', { name: safeapps.testAddressValue2 }).click()
      getBody().findByLabelText(safeapps.newAddressValueStr).type(safeAppSafes.SEP_SAFEAPP_SAFE_2)
      getBody().findByText(safeapps.addTransactionStr).click()
      getBody().findByText(safeapps.createBatchStr).click()
      getBody().findByRole('button', { name: safeapps.cancelBtnStr }).click()
      getBody().findByText(safeapps.clearTransactionListStr)
      getBody().findByRole('button', { name: safeapps.confirmClearTransactionListStr }).click()
      getBody().findAllByText('choose a file').should('be.visible')
    })
  })

  it('Verify cancel operation can be reverted', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByLabelText(safeapps.enterAddressStr).type(constants.SAFE_APP_ADDRESS)
      getBody().find(safeapps.contractMethodIndex).parent().click()
      getBody().findByRole('option', { name: safeapps.testAddressValue2 }).click()
      getBody().findByLabelText(safeapps.newAddressValueStr).type(safeAppSafes.SEP_SAFEAPP_SAFE_2)
      getBody().findByText(safeapps.addTransactionStr).click()
      getBody().findByText(safeapps.createBatchStr).click()
      getBody().findByRole('button', { name: safeapps.cancelBtnStr }).click()
      getBody().findByText(safeapps.clearTransactionListStr)
      getBody().findByRole('button', { name: safeapps.backBtnStr }).click()
      getBody().findByText(safeapps.reviewAndConfirmStr).should('be.visible')
    })
  })

  it('Verify it is allowed to go back without removing data and add more transactions to the batch', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByLabelText(safeapps.enterAddressStr).type(constants.SAFE_APP_ADDRESS)
      getBody().find(safeapps.contractMethodIndex).parent().click()
      getBody().findByRole('option', { name: safeapps.testAddressValue2 }).click()
      getBody().findByLabelText(safeapps.newAddressValueStr).type(safeAppSafes.SEP_SAFEAPP_SAFE_2)
      getBody().findByText(safeapps.addTransactionStr).click()
      getBody().findByText(safeapps.createBatchStr).click()
      getBody().findByText(safeapps.backToTransactionStr).click()
      getBody().findByLabelText(safeapps.enterAddressStr).type(constants.SAFE_APP_ADDRESS)
      getBody().find(safeapps.contractMethodIndex).parent().click()
      getBody().findByRole('option', { name: safeapps.testAddressValue2 }).click()
      getBody().findByLabelText(safeapps.newAddressValueStr).type(safeAppSafes.SEP_SAFEAPP_SAFE_2)
      getBody().findByText(safeapps.addTransactionStr).click()
      getBody().findByText(safeapps.createBatchStr).click()
      getBody().findByText(safeapps.sendBatchStr).click()
    })
    cy.get('h4').contains(safeapps.transactionBuilderStr).should('be.visible')
    cy.findAllByText(safeapps.testAddressValueStr).should('have.length', 4)
    navigation.clickOnModalCloseBtn(0)
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findAllByText(constants.SEPOLIA_CONTRACT_SHORT).should('have.length', 2)
      getBody().findAllByText(safeapps.testAddressValueStr).should('have.length', 2)
    })
  })

  it('Verify a batch cannot be created with invalid address', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByLabelText(safeapps.enterAddressStr).type(safeAppSafes.SEP_SAFEAPP_SAFE_2.substring(5))
      getBody()
        .findAllByText(safeapps.addressNotValidStr)
        .then(($element) => {
          const color = $element.css('color')
          expect(utils.isInRedRange(color), 'Element color is ').to.be.true
        })
    })
  })

  it('Verify a batch cannot be created without asset amount', () => {
    cy.enter(iframeSelector).then((getBody) => {
      getBody().findByLabelText(safeapps.enterAddressStr).type(safeAppSafes.SEP_SAFEAPP_SAFE_2)
      getBody().findByText(safeapps.keepProxiABIStr).click()
      getBody().findByText(safeapps.addTransactionStr).click()
      getBody()
        .findAllByText(safeapps.requiredStr)
        .then(($element) => {
          const color = $element.css('color')
          expect(utils.isInRedRange(color), 'Element color is ').to.be.true
        })
    })
  })
})
