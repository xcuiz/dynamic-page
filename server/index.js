const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router')

const app = express()

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// application/json
app.use(bodyParser.json())

app.use('/api', router)

app.listen(9090, () => {
  console.log('server listening on port 9090')
})
