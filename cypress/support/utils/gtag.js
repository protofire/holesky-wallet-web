export function getEvents() {
  cy.window().then((win) => {
    cy.wrap(win.dataLayer).as('dataLayer')
  })
}

export const checkDataLayerEvents = (expectedEvents) => {
  cy.get('@dataLayer').should((dataLayer) => {
    expectedEvents.forEach((expectedEvent) => {
      const eventExists = dataLayer.some((event) => {
        return Object.keys(expectedEvent).every((key) => {
          return event[key] === expectedEvent[key]
        })
      })
      expect(eventExists, `Expected event matching fields: ${JSON.stringify(expectedEvent)} not found`).to.be.true
    })
  })
}

export const events = {
  safeCreatedCF: {
    category: 'create-safe',
    action: 'Created Safe',
    eventName: 'safe_created',
    eventLabel: 'counterfactual',
    eventType: 'safe_created',
  },

  txCreatedSwapOwner: {
    category: 'transactions',
    action: 'Create transaction',
    eventName: 'tx_created',
    eventLabel: 'owner_swap',
  },

  txConfirmedAddOwner: {
    category: 'transactions',
    action: 'Confirm transaction',
    eventLabel: 'owner_add',
    eventType: 'tx_confirmed',
    event: 'tx_confirmed',
  },
  txCreatedSwap: {
    category: 'transactions',
    action: 'Confirm transaction',
    eventLabel: 'native_swap',
    eventType: 'tx_created',
  },

  txConfirmedSwap: {
    category: 'transactions',
    action: 'Confirm transaction',
    eventLabel: 'native_swap',
    eventType: 'tx_confirmed',
  },

  txCreatedTxBuilder: {
    category: 'transactions',
    action: 'Confirm transaction',
    eventLabel: 'https://safe-apps.dev.5afe.dev/tx-builder',
    eventType: 'tx_created',
    event: 'tx_created',
  },

  txConfirmedTxBuilder: {
    category: 'transactions',
    action: 'Confirm transaction',
    eventLabel: 'https://safe-apps.dev.5afe.dev/tx-builder',
    eventType: 'tx_confirmed',
    event: 'tx_confirmed',
  },
}
