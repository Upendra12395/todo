const user = require('../models/user')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{
    const {authorization} = req.headers
    if(!authorization){
        res.status(401).json({message : 'You must have to logged In'})
    }else{
        const token = authorization.replace("Bearer ", "")
        jwt.verify(token, process.env.JWT_KEY, (err, payLoad)=>{
            if(err) throw err;
            else{
                const _id = payLoad.id
                User.findById(_id).then(user=>{
                    if(user.role == 'admin'){
                        req.user = user
                        next()
                    }else{
                        res.status(401).json({message : 'You are not authorized'})
                    }
                    
                })
            }
        })
    }
}