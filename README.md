valr-api-node
====
[![Build Status](https://travis-ci.com/dutu/valr-api-node.svg?branch=master)](https://travis-ci.com/dutu/valr-api-node)  

**valr-api-node** is a simple node.js wrapper for VALR REST and WebSocket API.

Clients for both the [REST API](https://docs.valr.com/?version=latest#7d993732-7f64-42cb-86d3-1a1d1bf04557) and [streaming WebSocket API](https://docs.valr.com/?version=latest#da6a3bc7-51e6-4585-baa6-65502a7c8de7) are included.


### Contents
* [Changelog](#changelog)
* [Installation](#installation)
* [Quick examples](#quick-examples)
* [API](#api)
* [Contributors](#contributors)
* [License](#license)


# Changelog

See detailed [Changelog](CHANGELOG.md)

# Installation

```
npm install --save valr-api-node
```

# Quick examples


### REST API example:

```js
import Valr from 'valr-api-node'

const valr = new VALR({ key, secret })
valr.getMarketSummary({ currencyPair: 'BTCZAR' })
  .then(console.log)
  .catch(console.error)
```

### WebSocket API examples:

```js
import Valr from 'valr-api-node'

const valr = new Valr({ key, secret })
let accountWebSocket = valr.newAccountWebSocket()

accountWebSocket.onopen = () => {
  console.log('Websocket is open')
}
  
accountWebSocket.onmessage = (message) => {
  let data = JSON.parse(message.data)
  console.log('Websocket data received')
}
```

```js
import Valr from 'valr-api-node'

const valr = new Valr({ key, secret })
let tradeWebSocket = valr.newTradeWebSocket()

tradeWebSocket.onopen = () => {
  console.log('Websocket is open')
}
  
tradeWebSocket.onmessage = (msg) => {
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
    console.log(msg.data)
  }
}

tradeWebSocket.onerror = (...args) => {
}

```


# REST API

All methods return promises.

## Public APIs

### `getCurrencies()`
Get a list of currencies supported by VALR [:bookmark_tabs:](https://docs.valr.com/?version=latest#88ab52a2-d63b-48b2-8984-d0982baec40a).


### `getCurrencyPairs()`
Get all the order types supported for all currency pairs [:bookmark_tabs:](https://docs.valr.com/?version=latest#cfa57d7e-2106-4066-bc27-c10210b6aa82).


### `getOrderTypes({ currencyPair })`
Get all the order types supported for all currency pairs [:bookmark_tabs:](https://docs.valr.com/?version=latest#700eddaa-60ba-4872-ae2b-577c3285d695) or for a given currency pair [:bookmark_tabs:](https://docs.valr.com/?version=latest#a3675f5a-34e0-45b3-9458-f3cffdbe4360).

Parameter     |          | Description 
--------------|----------|-------------
`currencyPair`| optional | Specify the currency pair for which you want to query the market summary


### `getMarketSummary({ currencyPair })`

Get the market summary for all currency pairs [:bookmark_tabs:](https://docs.valr.com/?version=latest#cd1f0448-3da3-44cf-b00d-91edd74e7e19) or for a given currency pair [:bookmark_tabs:](https://docs.valr.com/?version=latest#89b446bb-60a6-42ff-aa09-29e4918a9eb0).

Parameter     |          | Description 
--------------|----------|-------------
`currencyPair`| optional | Specify the currency pair for which you want to query the market summary


### `getServerTime()`

Get the server time [:bookmark_tabs:](https://docs.valr.com/?version=latest#95f84056-2ac7-4f92-a5d9-fd0d9c104f01).


### `getStatus()`

Get the current status of VALR [:bookmark_tabs:](https://docs.valr.com/?version=latest#16ccc087-4f8c-49b0-aa43-fd4f472c6a52).


## Account
The following APIs allow you to query your account balances and full transaction history. These APIs are protected and will require authentication.


### `getApiKeyInfo()`
Returns the current API Key's information and permissions [:bookmark_tabs:](https://docs.valr.com/?version=latest#af083ac6-0514-4979-9bab-f599ea1bed4f).


### `getBalances()`
Returns the list of all wallets with their respective balances[:bookmark_tabs:](https://docs.valr.com/?version=latest#60455ec7-ecdc-42ad-9a57-64941299da52).


### `getAccountTransactionHistory({ skip, limit })`
Get the transaction history for your account[:bookmark_tabs:](https://docs.valr.com/?version=latest#a84bf578-adb8-4023-8aa0-5f74550490a8).

Parameter     |          | Description 
--------------|----------|-------------
`skip`        | optional | Skip number of items from the list
`limit`       | optional | Limit the number of items returned

### `getAccountTradeHistory({limit, currencyPair })`
Get the last 100 recent trades for the given currency pair for your account[:bookmark_tabs:](https://docs.valr.com/?version=latest#11856958-9461-490e-9e01-4b1f5a2097ae).

Parameter     |          | Description 
--------------|----------|-------------
`limit`       | optional | Limit the number of items returned
`currencyPair`| optional | Specify the currency pair for which you want to query the market 

## Wallets
Access your wallets programmatically.

### `getDepositAddress({ currencyCode })`
Returns the default deposit address associated with currency specified with the parameter `currencyCode` [:bookmark_tabs:](https://docs.valr.com/?version=latest#b10ea5dd-00cb-4c33-bb28-53104a8f1b7b).

Parameter     |          | Description 
--------------|----------|-------------
`currencyCode`| required | Currently, the allowed values here are `BTC` and `ETH`


### `getWithdrawalInfo({ currencyCode })`
Get all the information about withdrawing a given currency from your VALR account[:bookmark_tabs:](https://docs.valr.com/?version=latest#b44b9b19-3e9b-45b0-be2b-0adc35caf480). 

Parameter     |          | Description 
--------------|----------|-------------
`currencyCode`| required | This is the currency code of the currency you want withdrawal information about


### `newWithdrawal({ currencyCode, amount, address, paymentReference })`
Withdraw cryptocurrency funds to an address[:bookmark_tabs:](https://docs.valr.com/?version=latest#bb0ad4dc-a28d-41a3-8e59-5070bc589c5a).

Parameter          |          | Description 
-------------------|----------|-------------
`currencyCode`     | required | This is the currency code for the currency you are withdrawing
`amount`           | required | The amount to be withdrawn
`address`          | required | The address the funds are withdrawn to
`paymentReference` | optional | Withdrawal request for XRP, XMR, XEM, XLM will accept this optional parameter. Max length is 256


### `getWithdrawalStatus({ currencyCode, withdrawId })`
Check the status of a withdrawal [:bookmark_tabs:](https://docs.valr.com/?version=latest#b1f5aae3-c896-4a7f-a20a-ff4d67ea8007).

Parameter          |          | Description 
-------------------|----------|-------------
`currencyCode`     | required | This is the currency code for the currency you have withdrawn
`withdrawId`       | required | The unique id that represents your withdrawal request. This is provided as a response to the API call to withdraw


### `getDepositHistory({ currencyCode, skip, limit })`
Get the Deposit History records for a given currency [:bookmark_tabs:](https://docs.valr.com/?version=latest#1061d8de-3792-4a0a-8ae6-715cb8a5179e).

Parameter          |          | Description 
-------------------|----------|-------------
`currencyCode`     | required | Currently, the allowed values here are `BTC` and `ETH`
`skip`             | optional | Skip number of items from the list
`limit`            | optional | Limit the number of items returned


### `getWithdrawalHistory({ currencyCode, skip, limit })`
Get Withdrawal History records for a given currency [:bookmark_tabs:](https://docs.valr.com/?version=latest#d166dbf5-e922-4037-b0a7-5d490796662c).

Parameter          |          | Description 
-------------------|----------|-------------
`currencyCode`     | required | This is the currency code for the currency you want the historical withdrawal records
`skip`             | optional | Skip number of items from the list
`limit`            | optional | Limit the number of items returned


### `getBankAccounts({ currencyCode })`
Get a list of bank accounts that are bookmark_tabsed to your VALR account [:bookmark_tabs:](https://docs.valr.com/?version=latest#e7b13f1d-9740-4452-9653-141e1055d03b).

Parameter          |          | Description 
-------------------|----------|-------------
`currencyCode`     | required | The currency code for the fiat currency. Supported: `ZAR`


### `newFiatWithdrawal({ currencyCode, amount, linkedBankAccountId })`
Withdraw cryptocurrency funds to an address[:bookmark_tabs:](https://docs.valr.com/?version=latest#fb4db187-530b-4632-b933-7bdfd192bcf5).

Parameter            |          | Description 
---------------------|----------|-------------
`currencyCode`       | required | The currency code for the fiat currency. Supported: `ZAR`
`amount`             | required | The amount to be withdrawn
`linkedBankAccountId`| required | The bank account Id the funds are withdrawn to


## Market Data
These API calls can be used to receive the market data.


### `getOrderBook({ currencyPair, full })`
Withdraw cryptocurrency funds to an address[:bookmark_tabs:](https://docs.valr.com/?version=latest#926f9245-35d1-4bca-a114-0af07bc229f7).

Parameter            |          | Description 
---------------------|----------|-------------
`currencyPair`       | required | Currency pair for which you want to query the order book. Supported currency pairs: Can be `BTCZAR`, `ETHZAR` or `XRPZAR`
`full`               | optional | `true` or `false` (default  = `false`). If it should return a list of all the bids and asks in the order book


### `getTradeHistory({ currencyPair, limit })`
Withdraw cryptocurrency funds to an address[:bookmark_tabs:](https://docs.valr.com/?version=latest#8e9429c0-f43b-4483-a2be-d03cd1bbb230).

Parameter            |          | Description 
---------------------|----------|-------------
`currencyPair`       | required | Currency pair for which you want to query the trade history. Supported currency pairs: Can be `BTCZAR`, `ETHZAR` or `XRPZAR`
`limit`              | optional | Limit the number of items returned


## Simple Buy/Sell
Make use of our powerful Simple Buy/Sell API to instantly buy and sell currencies.


### `getSimpleQuote({ currencyPair, payInCurrency, payAmount, side })`
Get a quote to buy or sell instantly using Simple Buy[:bookmark_tabs:](https://docs.valr.com/?version=latest#8c1df98d-5878-44f0-9090-2211f793fd6f).

Parameter            |          | Description 
---------------------|----------|-------------
`currencyPair`       | required | Currency pair to get a simple quote for. Any currency pair that supports the "simple" order type, can be specified
`payInCurrency`      | required | 
`payAmount`          | required | 
`side`               | required | `SELL` or `BUY`


### `simpleOrder({ currencyPair, payInCurrency, payAmount, side })`
Submit an order to buy or sell instantly using Simple Buy/Sell[:bookmark_tabs:](https://docs.valr.com/?version=latest#b064c7f3-d789-47ea-a427-e86a8039fdda).

Parameter            |          | Description 
---------------------|----------|-------------
`currencyPair`       | required | Currency pair to get a simple quote for. Any currency pair that supports the "simple" order type, can be specified
`payInCurrency`      | required | 
`payAmount`          | required | 
`side`               | required | `BUY` or `SELL`


### `getSimpleOrderStatus({ currencyPair, orderId })`
Submit an order to buy or sell instantly using Simple Buy/Sell[:bookmark_tabs:](https://docs.valr.com/?version=latest#b064c7f3-d789-47ea-a427-e86a8039fdda).

Parameter            |          | Description 
---------------------|----------|-------------
`currencyPair`       | required | Currency pair of the order for which you are querying the status
`orderId`            | required | Order Id of the order for which you are querying the status


##Exchange Buy/Sell
Make use of our powerful Exchange Buy/Sell APIs to place your orders on the Exchange programmatically.


### `limitOrder({ side, quantity, price, pair, postOnly, customerOrderId })`
Create a new limit order [:bookmark_tabs:](https://docs.valr.com/?version=latest#5beb7328-24ca-4d8a-84f2-6029725ad923).

Parameter          |          | Description 
-------------------|----------|-------------
`side`             | required | `BUY` or `SELL` 
`quantity`         | required | Base amount in BTC
`price`            | required | Price per coin in ZAR
`pair`             | required | Can be `BTCZAR`, `ETHZAR` or `XRPZAR`
`postOnly`         | optional | `true` or `false`
`customerOrderId ` | optional | An unique Id across all open orders for a given account. Alphanumeric value with no special chars, limit of 50 characters


### `marketOrder({ side, amount, pair, customerOrderId })`
Create a new market order [:bookmark_tabs:](https://docs.valr.com/?version=latest#e1892b20-2b2a-44cf-a67b-1d86def85ec4).

Parameter          |          | Description
-------------------|----------|-------------
`side`             | required | `BUY` or `SELL`
`amount`           | required | Quote amount for `BUY`. Base amount for `SELL`
`pair`             | required | Can be `BTCZAR`, `ETHZAR` or `XRPZAR`
`customerOrderId ` | optional | An unique Id across all open orders for a given account. Alphanumeric value with no special chars, limit of 50 characters


### `stopLimitOrder({ side, amount, pair, customerOrderId })`
Create a new market order [:bookmark_tabs:](https://docs.valr.com/?version=latest#4bdd004a-a7a0-4d75-b018-d0e4b7316614).

Parameter          |          | Description
-------------------|----------|-------------
`side`             | required | `BUY` or `SELL`
`quantity`         | required | Amount in Base Currency
`price`            | required | The Limit Price at which the BUY or SELL order will be placed
`pair`             | required | Can be `BTCZAR`, `ETHZAR` or `XRPZAR`
`timeInForce`      | required | Can be `GTC`, `FOK` or `IOC`
`stopPrice`        | required | The target price for the trade to trigger
`type`             | required | Can be `TAKE_PROFIT_LIMIT` or `STOP_LOSS_LIMIT`
`customerOrderId ` | optional | An unique Id across all open orders for a given account. Alphanumeric value with no special chars, limit of 50 characters


### `batchOrders({ requests })`
Create a batch of multiple orders, or cancel orders, in a single request [:bookmark_tabs:](https://docs.valr.com/?version=latest#bae7aee0-9768-4daa-8331-81096abf6934).
See VALR API documentation for applicable parameters. 


### `getOrderStatus({ orderId, customerOrderId })`
Returns the status of an order that was placed on the Exchange queried using the `orderId` [:bookmark_tabs:](https://docs.valr.com/?version=latest#8d9252e1-ee27-495e-86ed-57458bdafd19) or `customerOrderId` [:bookmark_tabs:](https://docs.valr.com/?version=latest#87c78a99-c94c-4b16-a986-5957a62a66fc).

Parameter          |          | Description 
-------------------|----------|-------------
`currencyPair`     | required | Currency pair 
`orderId` or `customerOrderId` | required | `orderId` is the order id provided by VALR. `customerOrderId` is the order Id provided by you when creating the order. Either `orderId` or `customerOrderId` can be specified, but not both.  


### `getOpenOrders()`
Returns all open orders for your account [:bookmark_tabs:](https://docs.valr.com/?version=latest#910bc498-b88d-48e8-b392-6cc94b8cb66d).


### `getOrderHistory({ skip, limit })`
Returns historical orders placed by you [:bookmark_tabs:](https://docs.valr.com/?version=latest#5f0ef16a-4f9d-40f3-bcdf-b1a63a0b42a4).

Parameter          |          | Description 
-------------------|----------|-------------
`skip`             | optional | Skip number of items from the list
`limit`            | optional | Limit the number of items returned


### `getOrderHistorySummary({ orderId, customerOrderId })`
Returns a more detailed summary about an order queried using the `orderId` [:bookmark_tabs:](https://docs.valr.com/?version=latest#7f42e4d5-c853-4da2-9c7d-adb4f3385ca2) or `customerOrderId` [:bookmark_tabs:](https://docs.valr.com/?version=latest#112c551e-4ee3-46a3-8fcf-0db07d3f48f2).

Detailed summary can be requested for an order when the `getOrderStatus` API call returns one of the following statuses: `Filled`, `Cancelled` or `Failed`.

Parameter          |          | Description 
-------------------|----------|-------------
`orderId` or `customerOrderId` | required | `orderId` is the order id provided by VALR. `customerOrderId` is the order Id provided by you when creating the order. Either `orderId` or `customerOrderId` can be specified, but not both.  


### `getOrderHistoryDetail({ orderId, customerOrderId })`
Returns detailed history of an order's statuses queried using the `orderId` [:bookmark_tabs:](https://docs.valr.com/?version=latest#a5d5dbcd-e034-422c-acec-4257e3c12e2d) or `customerOrderId` [:bookmark_tabs:](https://docs.valr.com/?version=latest#ed7fbcb1-550f-4b73-8b48-273f5ee78cdb).

This call returns an array of "Order Status" objects. The latest and most up-to-date status of this order is the zeroth element in the array.

Parameter          |          | Description 
-------------------|----------|-------------
`orderId` or `customerOrderId` | required | `orderId` is the order id provided by VALR. `customerOrderId` is the order Id provided by you when creating the order. Either `orderId` or `customerOrderId` can be specified, but not both.  


### `cancelOrder({ pair, orderId, customerOrderId })`
Cancel an open order [:bookmark_tabs:](https://docs.valr.com/?version=latest#3d9ba169-7222-4c0f-ab08-87c22162c0c4).


Parameter          |          | Description 
-------------------|----------|-------------
`pair`                         | required | Currency pair 
`orderId` or `customerOrderId` | required | `orderId` is the order id provided by VALR. `customerOrderId` is the order Id provided by you when creating the order. Either `orderId` or `customerOrderId` can be specified, but not both.  


# WebSocket API

## Connection

The methods return a [`WebSocket`](https://github.com/websockets/ws) object.

### `newAccountWebSocket()`
Establishes a WebSocket connection to receive streaming updates about your VALR account.


### `newTradeWebSocket()`
Establishes a WebSocket connection to receive streaming updates about Trade data.


## Events subscribing and unsubscribing

Once you open a connection to 'Account', you are automatically subscribed to all messages for all events on the 'Account' WebSocket connection. You will start receiving message feeds pertaining to your VALR account. For example, you will receive messages when your balance is updated or when a new trade is executed on your account.

On the other hand, When you open a connection to 'Trade', in order to receive message feeds about trading data, you must subscribe to events you are interested in on the 'Trade' WebSocket connection.

When you are no longer interested in receiving messages for certain events on the 'Trade' WebSocket connection, you can send a `unsubscribe` message.

See [VALR Websocket API documentation](https://docs.valr.com/?version=latest#da6a3bc7-51e6-4585-baa6-65502a7c8de7) on how to subscribe and unsubscribe to 'Trade' events.


## Message Feeds
See [VALR Websocket API documentation](https://docs.valr.com/?version=latest#da6a3bc7-51e6-4585-baa6-65502a7c8de7) 

# License

[MIT](LICENSE)
