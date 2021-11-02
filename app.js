const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

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
app.listen(PORT, ()=>{
    console.log(`app is running on ${PORT}`)
})