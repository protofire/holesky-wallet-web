import { EventType } from '@/services/analytics/types'

export const MODALS_CATEGORY = 'modals'

export const MODALS_EVENTS = {
  SEND_FUNDS: {
    action: 'Send tokens',
    category: MODALS_CATEGORY,
  },
  SEND_COLLECTIBLE: {
    action: 'Send NFTs',
    category: MODALS_CATEGORY,
  },
  CONTRACT_INTERACTION: {
    action: 'Contract interaction',
    category: MODALS_CATEGORY,
  },
  TX_DETAILS: {
    action: 'Transaction details',
    category: MODALS_CATEGORY,
  },
  EDIT_ADVANCED_PARAMS: {
    action: 'Edit advanced params',
    category: MODALS_CATEGORY,
  },
  ESTIMATION: {
    action: 'Estimation',
    category: MODALS_CATEGORY,
  },
  TOGGLE_EXECUTE_TX: {
    action: 'Toggle execute transaction',
    category: MODALS_CATEGORY,
  },
  USE_SPENDING_LIMIT: {
    event: EventType.META,
    action: 'Use spending limit',
    category: MODALS_CATEGORY,
  },
  SIMULATE_TX: {
    action: 'Simulate transaction',
    category: MODALS_CATEGORY,
  },
  EDIT_APPROVALS: {
    action: 'Edit approval',
    category: MODALS_CATEGORY,
  },
  ACCEPT_RISK: {
    action: 'Accept transaction risk',
    category: MODALS_CATEGORY,
  },
  REDEFINE_RESULT: {
    action: 'Redefine scan result',
    category: MODALS_CATEGORY,
    event: EventType.META,
  },
}

export enum MODAL_NAVIGATION {
  Next = 'Next click',
  Back = 'Back click',
}
