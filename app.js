const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
//const todoRouter = require('./routes/todo')
require('dotenv').config()

const app = express()

app.use(express.json())
const PORT = process.env.PORT || 4000
const password = process.env.PASSWORD
const MONGO_URL = `mongodb+srv://upendraa:${password}@cluster0.mwuaz.mongodb.net/mytodo3?retryWrites=true&w=majority`

mongoose.connect(MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology: true
})

mongoose.connection.on('open', ()=>{
    console.log('Database connected')
})

app.use('/user', userRouter)
//app.use('/todo', todoRouter)


app.listen(PORT, ()=>{
    console.log(`App is running on ${PORT}`)
})