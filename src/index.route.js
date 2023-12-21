// import express from 'express'
// import app from '../index.js'
const client = require("../DB/Connection.js")
const userRouter = require ("./Modules/User/user.route.js")
const authRouter = require ("./Modules/Regestration/regestration.route.js")
const slotRouter = require("./Modules/Slots/slots.route.js")
const reservationRouter = require("./Modules/Reservation/reserve.route.js")
const bodyParser = require('body-parser')
const cors = require('cors')

const Bootstrap = (express,app)=>{

   app.use(bodyParser.json()) 
     app.use(express.json())
     app.use(cors())
     app.get('/',(req,res)=>{
        res.send("welcome")
    })
    app.use('/auth',authRouter)
    app.use('/user',userRouter)
    app.use('/slot',slotRouter)
    app.use('/reserve',reservationRouter)
    
    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    client.connect()
}

module.exports = Bootstrap