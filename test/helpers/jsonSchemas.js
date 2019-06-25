let jsonSchema = {
  getCurrencies: {
    title: 'getCurrencies schema',
    description: 'Schema for getCurrencies results',
    type: 'array',
    items: {
      type: 'object',
      required: ['symbol', 'isActive', 'shortName', 'longName'],
      properties: {
        symbol: { type: 'string', minLength: 1 },
        isActive: { type: 'boolean' },
        shortName: { type: 'string',  minLength: 1 },
        longName: { type: 'string',  minLength: 1 }
      }
    }
  },

  getCurrencyPairs: {
    title: 'getCurrencyPairs schema',
    description: 'Schema for getCurrencyPairs results',
    type: 'array',
    items: {
      type: 'object',
      required: ['symbol', 'baseCurrency', 'quoteCurrency', 'shortName', 'active', 'minBaseAmount', 'maxBaseAmount', 'minQuoteAmount', 'maxQuoteAmount'],
      properties: {
        symbol: { type: 'string', minLength: 1 },
        baseCurrency: { type: 'string', minLength: 1 },
        quoteCurrency: { type: 'string', minLength: 1 },
        shortName: { type: 'string', minLength: 1 },
        active: { type: 'boolean' },
        minBaseAmount: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
        maxBaseAmount: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
        minQuoteAmount: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
        maxQuoteAmount: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
      }
    }
  },

  getOrderTypes: {
    title: 'getOrderTypes schema',
    description: 'Schema for getOrderTypes results',
    anyOf: [
      {
        type: 'array',
        items: {
          type: 'object',
          required: ['currencyPair', 'orderTypes'],
          properties: {
            currencyPair: { type: 'string', minLength: 1 },
            orderTypes: { type: 'array', items: { type: 'string' }}
          }
        }
      },
      {
        type: 'array',
        items: { type: 'string' }
      }
    ]
  },

  getMarketSummary: {
    title: 'getMarketSummary schema',
    description: 'Schema for getMarketSummary results',
    anyOf: [
      {
        type: 'array',
        items: {
          type: 'object',
          required: ['currencyPair', 'askPrice', 'bidPrice', 'lastTradedPrice', 'previousClosePrice', 'baseVolume', 'highPrice', 'lowPrice', 'created', 'changeFromPrevious'],
          properties: {
            currencyPair: { type: 'string', minLength: 1 },
            askPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
            bidPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
            lastTradedPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
            previousClosePrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
            baseVolume: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
            highPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
            lowPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
            created: { type: 'string', minLength: 1 },
            changeFromPrevious: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
          }
        }
      },
      {
        type: 'object',
        required: ['currencyPair', 'askPrice', 'bidPrice', 'lastTradedPrice', 'previousClosePrice', 'baseVolume', 'highPrice', 'lowPrice', 'created', 'changeFromPrevious'],
        properties: {
          currencyPair: { type: 'string', minLength: 1 },
          askPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
          bidPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
          lastTradedPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
          previousClosePrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
          baseVolume: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
          highPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
          lowPrice: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
          created: { type: 'string', minLength: 1 },
          changeFromPrevious: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
        }
      }
    ]
  },

  getServerTime: {
    title: 'getServerTime schema',
    description: 'Schema for getServerTime results',
    type: 'object',
    required: ['epochTime', 'time'],
    properties: {
      epochTime: { type: 'number' },
      time: { type: 'string', minLength: 1 },
    }
  },

  getBalances: {
    title: 'getBalances schema',
    description: 'Schema for getBalances results',
    type: 'array',
    items: {
      type: 'object',
      required: ['currency', 'available', 'reserved', 'total'],
      properties: {
        currency: { type: 'string', minLength: 1 },
        available: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
        reserved: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
        total: { type: 'string', pattern: '[0-9]+(\.[0-9]+)?' },
      }
    }
  },

  getAccountTransactionHistory: {
    title: 'getAccountTransactionHistory schema',
    description: 'Schema for getAccountTransactionHistory results',
    type: 'array',
    items: {
      type: 'object',
      required: ['transactionType', 'eventAt'],
      properties: {
        transactionType: { type: 'object', required: ['type', 'description'] },
        eventAt: { type: 'string', minLength: 1 },
      }
    },
  },

  getAccountTradeHistory: {
    title: 'getAccountTradeHistory schema',
    description: 'Schema for getAccountTradeHistory results',
    type: 'array',
    items: {
      type: 'object',
      required: ['price', 'quantity', 'currencyPair', 'tradedAt', 'side', 'id', 'sequenceId'],
    }
  },

  getDepositAddress: {
    title: 'getDepositAddress schema',
    description: 'Schema for getDepositAddress results',
    type: 'object',
    required: ['currency', 'address'],
  },

  getWithdrawalInfo: {
    title: 'getWithdrawalInfo schema',
    description: 'Schema for getWithdrawalInfo results',
    type: 'object',
    required: ['currency', 'minimumWithdrawAmount'],
  },

  newWithdrawal: {
    title: 'newWithdrawal schema',
    description: 'Schema for newWithdrawal results',
    type: 'object',
    required: ['id'],
  },

  getWithdrawalStatus: {
    title: 'getWithdrawalStatus schema',
    description: 'Schema for getWithdrawalStatus results',
    type: 'object',
    required: ['currency', 'address', 'amount', 'createdAt'],
  },

  getDepositHistory: {
    title: 'getDepositHistory schema',
    description: 'Schema for getDepositHistory results',
    type: 'array',
    items: {
      type: 'object',
      required: ['currencyCode', 'receiveAddress', 'amount', 'createdAt'],
    }
  },

  getWithdrawalHistory: {
    title: 'getWithdrawalHistory schema',
    description: 'Schema for getWithdrawalHistory results',
    type: 'array',
    items: {
      type: 'object',
      required: ['currency', 'address', 'amount', 'createdAt'],
    }
  },

  getBankAccounts: {
    title: 'getBankAccounts schema',
    description: 'Schema for getBankAccounts results',
    type: 'array',
    items: {
      type: 'object',
      required: ['id', 'bank', 'accountHolder', 'accountNumber', 'branchCode', 'accountType', 'createdAt'],
    }
  },

  newFiatWithdrawal: {
    title: 'newFiatWithdrawal schema',
    description: 'Schema for newFiatWithdrawal results',
    type: 'object',
    required: ['id'],
  },

  getOrderBook: {
    title: 'getOrderBook schema',
    description: 'Schema for getOrderBook results',
    type: 'object',
    required: ['Asks', 'Bids'],
    properties: {
      Asks: { type: 'array', items: { type: 'object', required: ['quantity', 'price'] } },
      Bids: { type: 'array', items: { type: 'object', required: ['quantity', 'price'] } },
      },
  },

  getTradeHistory: {
    title: 'getTradeHistory schema',
    description: 'Schema for getTradeHistory results',
    type: 'array',
    items: {
      type: 'object',
      required: ['price', 'quantity', 'currencyPair', 'tradedAt', 'takerSide', 'id'],
    }
  },

}
export default jsonSchema
