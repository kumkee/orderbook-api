const express = require('express')
const ordbook = require('./orderbook')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  //res.send('Hello World!');
  if (!req.query.symbol) {req.query.symbol = 'BTC/USDT';}
  if (!req.query.exchange) {req.query.exchange = 'binance';}
  if (!req.query.divider) {req.query.divider = 1000;}
  ordbook.getOrderbook(req.query.exchange, req.query.symbol, {'limit':5000}, req.query.divider)
    .then(v => res.send(v))
    .catch(err => res.send(`${err}`));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
