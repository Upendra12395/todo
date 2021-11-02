const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    title:{
        type : String,
        required : true
    },
    status:{
        type : String,
        required : true
    },
    category:{
        type : String,
        required : true
    }
    
},{timestamps : true})

module.exports = mongoose.model("Todo", todoSchema)