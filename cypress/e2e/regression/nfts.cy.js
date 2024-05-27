import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as nfts from '../pages/nfts.pages'
import * as navigation from '../pages/navigation.page'
import * as createTx from '../pages/create_tx.pages'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'

const singleNFT = ['safeTransferFrom']
const multipleNFT = ['multiSend']
const multipleNFTAction = 'safeTransferFrom'
const NFTSentName = 'GTT #22'

let nftsSafes,
  staticSafes = []

describe('NFTs tests', () => {
  before(() => {
    getSafes(CATEGORIES.nfts)
      .then((nfts) => {
        nftsSafes = nfts
        return getSafes(CATEGORIES.static)
      })
      .then((statics) => {
        staticSafes = statics
      })
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(constants.balanceNftsUrl + staticSafes.SEP_STATIC_SAFE_2)
    main.acceptCookies()
    nfts.waitForNftItems(2)
  })

  // TODO: Add Sign action
  it('Verify multipls NFTs can be selected and reviewed', () => {
    nfts.verifyInitialNFTData()
    nfts.selectNFTs(3)
    nfts.deselectNFTs([2], 3)
    nfts.sendNFT()
    nfts.verifyNFTModalData()
    nfts.typeRecipientAddress(staticSafes.SEP_STATIC_SAFE_1)
    nfts.clikOnNextBtn()
    nfts.verifyReviewModalData(2)
  })

  it('Verify that when 1 NFTs is selected, there is no Actions block in Review step', () => {
    nfts.verifyInitialNFTData()
    nfts.selectNFTs(1)
    nfts.sendNFT()
    nfts.typeRecipientAddress(staticSafes.SEP_STATIC_SAFE_1)
    nfts.clikOnNextBtn()
    nfts.verifyTxDetails(singleNFT)
    nfts.verifyCountOfActions(0)
  })

  it('Verify that when 2 NFTs are selected, actions and tx details are correct in Review step', () => {
    nfts.verifyInitialNFTData()
    nfts.selectNFTs(2)
    nfts.sendNFT()
    nfts.typeRecipientAddress(staticSafes.SEP_STATIC_SAFE_1)
    nfts.clikOnNextBtn()
    nfts.verifyTxDetails(multipleNFT)
    nfts.verifyCountOfActions(2)
    nfts.verifyActionName(0, multipleNFTAction)
    nfts.verifyActionName(1, multipleNFTAction)
  })

  it('Verify Send button is disabled for non-owner', () => {
    cy.visit(constants.balanceNftsUrl + nftsSafes.SEP_NFT_SAFE_2)
    nfts.verifyInitialNFTData()
    nfts.selectNFTs(1)
    nfts.verifySendNFTBtnDisabled()
  })

  it('Verify Send button is disabled for disconnected wallet', () => {
    navigation.clickOnWalletExpandMoreIcon()
    navigation.clickOnDisconnectBtn()
    nfts.selectNFTs(1)
    nfts.verifySendNFTBtnDisabled()
  })

  it('Verify Send NFT transaction has been created', () => {
    cy.visit(constants.balanceNftsUrl + nftsSafes.SEP_NFT_SAFE_1)
    nfts.verifyInitialNFTData()
    nfts.selectNFTs(1)
    nfts.sendNFT()
    nfts.typeRecipientAddress(staticSafes.SEP_STATIC_SAFE_1)
    createTx.changeNonce(2)
    nfts.clikOnNextBtn()
    createTx.clickOnSignTransactionBtn()
    createTx.waitForProposeRequest()
    createTx.clickViewTransaction()
    createTx.verifySingleTxPage()
    createTx.verifyQueueLabel()
    createTx.verifyTransactionStrExists(NFTSentName)
  })
})
