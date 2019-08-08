import WebSocket from 'ws'
import superagent from 'superagent'
import crypto from 'crypto';

export default class Valr {
  constructor({ key, secret }) {
    this.key = key;
    this.secret = secret;
    this.baseUrl = 'https://api.valr.com';
  }

  async requestPublic(endpoint, params = {}) {
    let res  = await superagent
      .get(`${this.baseUrl}/v1/public${endpoint}`)
      .query(params)
    return res.body
  }

  async requestPrivate(verb, path, params = {}, body) {
    const makeRequestHeaders = function makeRequestHeaders (verb, path, body) {
      const timestamp = Date.now()
      let signature = crypto
        .createHmac(`sha512`, this.secret)
        .update(timestamp.toString())
        .update(verb.toUpperCase())
        .update(path)
        .update(body && JSON.stringify(body) || '')
        .digest(`hex`)

      return {
        'X-VALR-API-KEY': this.key,
        'X-VALR-TIMESTAMP': timestamp.toString(),
        'X-VALR-SIGNATURE': signature,
      }
    }

    const makeParamsString = function makeParamsString(params = {}) {
      let paramsString = Object.keys(params)
        .reduce((acc, crtKey) => {
          return `${acc}&${crtKey}=${params[crtKey] === true && 'true' || params[crtKey] === false && 'false' || params[crtKey]}`
        }, '')

      if (paramsString !== '') {
        paramsString = `?${paramsString.substring(1)}`
      }

      return paramsString
    }

    if (!this.key || !this.secret) {
      throw new Error('API key and secret key required to use authenticated methods')
    }

    const requestPath = `/v1${path}${makeParamsString.call(this, params)}`
    try {
      let res  = await superagent(verb, `${this.baseUrl}/v1${path}`)
        .query(params)
        .set(makeRequestHeaders.call(this, verb, requestPath, body))
        .send(body)
      return res.body
    } catch (e) {
      console.log(e)
    }
  }

  getCurrencies() {
    return this.requestPublic(`/currencies`)
  }

  getCurrencyPairs() {
    return this.requestPublic(`/pairs`)
  }

  getOrderTypes(params) {
    if (params) {
      return this.requestPublic(`/${params.currencyPair}/ordertypes`)
    } else {
      return this.requestPublic(`/ordertypes`)
    }
  }

  getMarketSummary(params) {
    if (params) {
      return this.requestPublic(`/${params.currencyPair}/marketsummary`)
    } else {
      return this.requestPublic(`/marketsummary`)
    }
  }

  getServerTime() {
    return this.requestPublic(`/time`)
  }

  getBalances(params) {
    return this.requestPrivate('GET',`/account/balances`, params)
  }

  getAccountTransactionHistory(params) {
    return this.requestPrivate('GET',`/account/transactionhistory`, params)
  }

  getAccountTradeHistory(params) {
    let p = Object.assign({}, params)
    delete p.currencyPair
    return this.requestPrivate('GET',`/account/${params.currencyPair}/tradehistory`, p)
  }

  getDepositAddress(params) {
    return this.requestPrivate('GET',`/wallet/crypto/${params.currencyCode}/deposit/address`)
  }

  getWithdrawalInfo(params) {
    return this.requestPrivate('GET',`/wallet/crypto/${params.currencyCode}/withdraw`)
  }

  newWithdrawal(params) {
    let p = Object.assign({}, params)
    delete p.currencyCode
    delete p.amount
    delete p.address
    delete p.paymentReference
    const body = {
      amount: params.amount,
      address: params.address,
      paymentReference: params.paymentReference,
    }

    return this.requestPrivate('POST',`/wallet/crypto/${params.currencyCode}/withdraw`, p, body)
  }

  getWithdrawalStatus(params) {
    return this.requestPrivate('GET',`/wallet/crypto/${params.currencyCode}/withdraw/${params.withdrawId}`)
  }

  getDepositHistory(params) {
    let p = Object.assign({}, params)
    delete p.currencyCode

    return this.requestPrivate('GET',`/wallet/crypto/${params.currencyCode}/deposit/history`, p)
  }

  getWithdrawalHistory(params) {
    let p = Object.assign({}, params)
    delete p.currencyCode

    return this.requestPrivate('GET',`/wallet/crypto/${params.currencyCode}/withdraw/history`, p)
  }

  getBankAccounts(params) {
    return this.requestPrivate('GET',`/wallet/fiat/${params.currencyCode}/accounts`)
  }

  newFiatWithdrawal(params) {
    const body = {
      linkedBankAccountId: params.linkedBankAccountId,
      amount: params.amount,
    }

    return this.requestPrivate('POST',`/wallet/fiat/${params.currencyCode}/withdraw`, {}, body)
  }

  getOrderBook(params) {
    let p = Object.assign({}, params)
    delete p.currencyPair
      return this.requestPrivate('GET',`/marketdata/${params.currencyPair}/orderbook`, p)
  }

  getTradeHistory(params) {
    let p = Object.assign({}, params)
    delete p.currencyPair
    return this.requestPrivate('GET',`/marketdata/${params.currencyPair}/tradehistory`, p)
  }

  getSimpleQuote(params) {
    const body = {
      payInCurrency: params.payInCurrency,
      payAmount: params.payAmount,
      side: params.side,
    }

    return this.requestPrivate('POST',`/simple/${params.currencyPair}/quote`, {}, body)
  }

  simpleOrder(params) {
    const body = {
      payInCurrency: params.payInCurrency,
      payAmount: params.payAmount,
      side: params.side,
    }

    return this.requestPrivate('POST',`/simple/${params.currencyPair}/order`, {}, body)
  }

  getSimpleOrderStatus(params = {}) {
    return this.requestPrivate('GET',`/simple/${params.currencyPair}/order/${params.orderId}`, params)
  }

  limitOrder(params) {
    let p = Object.assign({}, params)
    if (p.hasOwnProperty('amount') && p.side === 'BUY') {
      p.quoteAmount = p.amount
      delete p.amount
    }

    if (p.hasOwnProperty('amount') && p.side === 'SELL') {
      p.baseAmount = p.amount
      delete p.amount
    }

    return this.requestPrivate('POST',`/orders/limit`, {}, p)
  }

  marketOrder(params) {
    return this.requestPrivate('POST',`/orders/market`, {}, params)
  }

  getOrderStatus(params = {}) {
    if (params instanceof Object && params.customerOrderId)
      return this.requestPrivate('GET',`/orders/${params.currencyPair}/customerorderid/${params.customerOrderId}`, params)
    else
      return this.requestPrivate('GET',`/orders/${params.currencyPair}/orderid/${params.orderId}`, params)
  }

  getOpenOrders(params = {}) {
    return this.requestPrivate('GET',`/orders/open`, params)
  }

  getOrderHistory(params = {}) {
    return this.requestPrivate('GET',`/orders/history`, params)
  }

  getOrderHistorySummary(params) {
    if (params instanceof Object && params.customerOrderId)
      return this.requestPrivate('GET',`/orders/history/summary/customerorderid/${params.customerOrderId}`, {})
    else
      return this.requestPrivate('GET',`/orders/history/summary/orderid/${params.orderId}`, {})
  }

  getOrderHistoryDetail(params) {
    if (params instanceof Object && params.customerOrderId)
      return this.requestPrivate('GET',`/orders/history/detail/customerorderid/${params.customerOrderId}`, {})
    else
      return this.requestPrivate('GET',`/orders/history/detail/orderid/${params.orderId}`, {})
  }

  cancelOrder(params) {
    return this.requestPrivate('DELETE',`/orders/order`, {}, params)
  }


  /*
    // WebSocket
    newWebSocketOrderEvents(options = {}) {
      const requestPath = `/v1/order/events`
      const params = makeParams(options)

      return new WebSocket(`${this.baseUrl}${requestPath}${params}`, createRequestConfig({
        key: this.key,
        secret: this.secret,
        payload: {
          nonce: Date.now(),
          request: requestPath,
        },
      }))
    }

    newWebSocketMarketData(symbol, options = {}) {
      const requestPath = `/v1/marketdata`
      const params = makeParams(options)

      return new WebSocket(`${this.baseUrl}${requestPath}/${symbol}${params}`)
    }
  */
}
