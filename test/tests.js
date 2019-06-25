import chai from 'chai'
import chaiJsonSchema from 'chai-json-schema'
import jsonSchema from './helpers/jsonSchemas.js'

chai.use(chaiJsonSchema)
const expect = chai.expect

import Valr from '../src'

const delay = ms => new Promise(res => setTimeout(res, ms))

const valr = new Valr({key: process.env.APIKEY, secret:process.env.APISECRET})

let methods = [
  [`getCurrencies`, []],
  [`getCurrencyPairs`, []],
  [`getOrderTypes`, []],
  [`getOrderTypes`, [{ currencyPair: 'BTCZAR' }]],
  [`getMarketSummary`, []],
  [`getMarketSummary`, [{ currencyPair: 'BTCZAR' }]],
  [`getServerTime`, [],],
  [`getBalances`, [],],
  [`getAccountTransactionHistory`, [],],
  [`getAccountTradeHistory`, [{ currencyPair: 'BTCZAR' }],],
  [`getDepositAddress`, [{ currencyCode: 'BTC' }]],
  [`getWithdrawalInfo`, [{ currencyCode: 'BTC' }]],
//  [`newWithdrawal`, [{ currencyCode: 'BTC', amount: '0.0001', address: '3' }]],
  [`getWithdrawalStatus`, [{ currencyCode: 'BTC', withdrawId: '4c89239a-09c7-4409-acf4-5e1317d54611' }]],
  [`getDepositHistory`, [{ currencyCode: 'BTC'}]],
  [`getDepositHistory`, [{ currencyCode: 'BTC', skip: 1}]],
  [`getWithdrawalHistory`, [{ currencyCode: 'BTC'}]],
  [`getBankAccounts`, [{ currencyCode: 'ZAR'}]],
//  [`newFiatWithdrawal`, [{ currencyCode: 'ZAR', linkedBankAccountId: '24cc8bb5-85f9-4f84-aa82-da8eb61050a3', amount: '90647'}]],
  [`getOrderBook`, [{ currencyPair: 'BTCZAR' }],],
  [`getTradeHistory`, [{ currencyPair: 'BTCZAR' }],],
]

describe('rest API methods', async function() {
  methods.forEach(method => {
    it(`${method[0]}`, async function () {
      await delay (0)
      let res = await valr[method[0]](...method[1])
        .catch()
      expect(res).to.be.jsonSchema(jsonSchema[method[0]])
    })
  })
})
