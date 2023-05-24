const express = require('express')
require('./db/mongooseConnect')
const customerRouter = require('./router/customerRouter')
const requestRouter = require('./router/requestRouter')
const companyRouter = require('./router/companyRouter')
const discountRouter = require('./router/discountRouter')
const driverRouter = require('./router/driverRouter')

const app = express()
app.use(express.json())
const port = 3000

app.use(customerRouter)
app.use(requestRouter)
app.use(companyRouter)
app.use(discountRouter)
app.use(driverRouter)




app.listen(port, () => {
    console.log('app running on port ' + port)
})