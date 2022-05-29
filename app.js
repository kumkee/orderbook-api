const express = require('express')
const ordbook = require('./orderbook')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  //res.send('Hello World!');
  ordbook.getOrderbook('binance', 'BTC/USDT', {'limit':5000})
    .then(v => res.send(v));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
