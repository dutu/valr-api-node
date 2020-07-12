import chai from 'chai'
import chaiJsonSchema from 'chai-json-schema'
import jsonSchema from './helpers/jsonSchemas.js'

chai.use(chaiJsonSchema)
const expect = chai.expect

import Valr from '../dist'

const delay = ms => new Promise(res => setTimeout(res, ms))

const valr = new Valr({key: process.env.APIKEY, secret:process.env.APISECRET})

let methods = [
  ['getCurrencies', []],
  ['getCurrencyPairs', []],
  ['getOrderTypes', []],
  ['getOrderTypes', [{ currencyPair: 'BTCZAR' }]],
  ['getMarketSummary', []],
  ['getMarketSummary', [{ currencyPair: 'BTCZAR' }]],
  ['getServerTime', [],],
  ['getStatus', [],],
  ['getBalances', [],],
  ['getAccountTransactionHistory', [],],
  ['getAccountTradeHistory', [{ currencyPair: 'BTCZAR' }],],
  ['getDepositAddress', [{ currencyCode: 'BTC' }]],
  ['getWithdrawalInfo', [{ currencyCode: 'BTC' }]],
//  ['newWithdrawal', [{ currencyCode: 'BTC', amount: '0.0001', address: '3' }]],
  ['getWithdrawalStatus', [{ currencyCode: 'BTC', withdrawId: '4c89239a-09c7-4409-acf4-5e1317d54611' }]],
  ['getDepositHistory', [{ currencyCode: 'BTC'}]],
  ['getDepositHistory', [{ currencyCode: 'BTC', skip: 1}]],
  ['getWithdrawalHistory', [{ currencyCode: 'BTC'}]],
  ['getBankAccounts', [{ currencyCode: 'ZAR'}]],
//  ['newFiatWithdrawal', [{ currencyCode: 'ZAR', linkedBankAccountId: '24cc8bb5-85f9-4f84-aa82-da8eb61050a3', amount: '90647'}]],
  ['getOrderBook', [{ currencyPair: 'BTCZAR' }],],
  ['getTradeHistory', [{ currencyPair: 'BTCZAR' }],],
  ['getSimpleQuote', [{ currencyPair: 'BTCZAR', payInCurrency: 'BTC', payAmount: '0.0001', side: 'SELL' }],],
//  ['simpleOrder', [{ currencyPair: 'BTCZAR', payInCurrency: 'BTC', payAmount: '0.0001', side: 'SELL' }],],
  ['getSimpleOrderStatus', [{ currencyPair: 'BTCZAR', orderId: '7952019d-9647-4a4f-bf37-71d60e418016' }],],
//  ['limitOrder', [{ pair: 'BTCZAR', side: 'BUY', quantity: '0.0001', price: '100000', postOnly: true, customerOrderId: '1234' }],],
//  ['marketOrder', [{ pair: 'BTCZAR', side: 'SELL', amount: '0.0001', customerOrderId: '12345' }],],
  ['getOrderStatus', [{ currencyPair: 'BTCZAR',  customerOrderId: '1234' }],],
  ['getOrderStatus', [{ currencyPair: 'BTCZAR',  orderId: '17635598-aca6-46ba-b3ff-0dec3d752aa3' }],],
  ['getOpenOrders', [],],
  ['getOrderHistory', [],],
  ['getOrderHistory', [{ skip: 1, limit: 4 }],],
  ['getOrderHistorySummary', [{ currencyPair: 'BTCZAR',  customerOrderId: '12345' }],],
  ['getOrderHistorySummary', [{ currencyPair: 'BTCZAR',  orderId: '8f31d81e-1a14-4cb0-b29c-2f7fb7a23bc2' }],],
  ['getOrderHistoryDetail', [{ currencyPair: 'BTCZAR',  customerOrderId: '12345' }],],
  ['getOrderHistoryDetail', [{ currencyPair: 'BTCZAR',  orderId: '8f31d81e-1a14-4cb0-b29c-2f7fb7a23bc2' }],],
//  ['cancelOrder', [{ pair: 'BTCZAR', customerOrderId: '1234' }],],
]

describe('REST API methods', async function() {
  methods.forEach(method => {
    it(`${method[0]}`, async function () {
      await delay (300)
      let res = await valr[method[0]](...method[1])
        .catch()
      expect(res).to.be.jsonSchema(jsonSchema[method[0]])
    })
  })
})

describe('REST API errors', function() {
  it(`throws error 400`, function (done) {
    valr.cancelOrder({ pair: 'BTCZAR', id: '8f31d81e-1a14-4cb0-b29c-2f7fb7a23bc2'})
      .catch((err) => {
        expect(err).to.be.an('error')
        done()
      })

  })
})

const TIMEOUT = 15000

describe('WebSocket API', function() {
  it(`Connects to Account Websocket`, function (done) {
    let isdone  = false
    let open = false
    let message = false
    let timeoutId = setTimeout(function() {
      if (!open) expect(false, 'open has not been received').to.be.ok
      if (!message) expect(false, 'message type "AUTHENTICATED" has not been received').to.be.ok
      isdone || done()
      isdone = true
    }, TIMEOUT)

    const accountWebSocket = valr.newAccountWebSocket()
    accountWebSocket.onopen = (...args) => {
      open = true
    }

    accountWebSocket.onmessage = (msg) => {
      message = true
      if (msg.type === 'message' && JSON.parse(msg.data).type === 'AUTHENTICATED') {
        clearTimeout(timeoutId);
        isdone || done()
        isdone = true
      }
    }

    accountWebSocket.onerror = (...args) => {
      message = true
      clearTimeout(timeoutId);
      isdone || done(args)
      isdone = true
    }

  })

  it(`Connects to Trade Websocket`, function (done) {
    let isdone  = false
    let open = false
    let message = false
    let timeoutId = setTimeout(function() {
      if (!open) expect(false, 'open has not been received').to.be.ok
      if (!message) expect(false, 'message type "MARKET_SUMMARY_UPDATE" has not been received').to.be.ok
      isdone || done()
      isdone = true
    }, TIMEOUT)

    const tradeWebSocket = valr.newTradeWebSocket()
    tradeWebSocket.onopen = (...args) => {
      open = true
    }

    tradeWebSocket.onmessage = (msg) => {
      message = true
      if (msg.type === 'message' && JSON.parse(msg.data).type === 'AUTHENTICATED') {
        const subscribeMessage = {
          type: 'SUBSCRIBE',
          subscriptions: [
            {
              event: 'MARKET_SUMMARY_UPDATE',
              pairs: ['BTCZAR']
            }
          ]
        }
        tradeWebSocket.send(JSON.stringify(subscribeMessage))
      }

      if (msg.type === 'message' && JSON.parse(msg.data).type === 'MARKET_SUMMARY_UPDATE') {
        clearTimeout(timeoutId);
        isdone || done()
        isdone = true
      }
    }

    tradeWebSocket.onerror = (...args) => {
      message = true
      clearTimeout(timeoutId);
      isdone || done(args)
      isdone = true
    }
  })
})
