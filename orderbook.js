"use strict";

const ccxt = require ('ccxt')

const aggregateOrderBookSide = function (orderbookSide, precision = undefined) {
    const result = []
    const amounts = {}
    for (let i = 0; i < orderbookSide.length; i++) {
        const ask = orderbookSide[i]
        let price = ask[0]
        if (precision !== undefined) {
            price = ccxt.decimalToPrecision (price, ccxt.ROUND, precision, ccxt.TICK_SIZE)
        }
        amounts[price] = (amounts[price] || 0) + ask[1]
    }
    Object.keys (amounts).forEach (price => {
        result.push ([
            parseFloat (price),
            amounts[price]
        ])
    })
    return result
}

const aggregateOrderBook = function (orderbook, precision = undefined) {
    let asks = aggregateOrderBookSide(orderbook['asks'], precision)
    let bids = aggregateOrderBookSide(orderbook['bids'], precision)
    return {
        'asks': ccxt.sortBy (asks, 0),
        'bids': ccxt.sortBy (bids, 0, true),
        'timestamp': orderbook['timestamp'],
        'datetime': orderbook['datetime'],
        'nonce': orderbook['nonce'],
    };
}

;(async function getOrderbook(exchangeId, symbol, options) {

    const exchange = new ccxt[exchangeId]()

    await exchange.loadMarkets ()

    // exchange.verbose = true // uncomment for verbose debug output

    // level 2 (default)
    //const orderbook = await exchange.fetchOrderBook('BTC/USDT')

    // or level 3
    // const orderbook = await exchange.fetchOrderBook('BTC/USD', undefined, { 'level': 3 })
    // const orderbook = await exchange.fetchOrderBook('BNB/USDT', undefined, { 'limit': 5000 })
    const orderbook = await exchange.fetchOrderBook(symbol, undefined, options)

    const step = 28800.0/1000.0 // 0.01, 0.1, 0.5, 1.0, 2.5, 5.0, 10.0
    console.log(orderbook)
    console.log("-----------------------------------------------")
    console.log (aggregateOrderBook (orderbook, step))

}) ('binance', 'BTC/USDT', {'limit':1000});
