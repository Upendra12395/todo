const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Todo = require('../models/todo')


module.exports.signIn = (req, res) => {
    const { userName, email, phone, role, password } = req.body
    if (!userName || !email || !phone || !role || !password) {
        res.status(400).json({ message: "All fields required" })
    } else {
        User.findOne({ email: email }).then((user) => {
            if (user) {
                console.log(user)
                res.status(400).json({ message: "User already registered" })
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        else {
                            const newUser = new User({
                                userName: userName,
                                email: email,
                                phone: phone,
                                role: role,
                                password: hash
                            })
                            newUser.save()
                                .then(() => {
                                    res.status(200).json({ message: 'user successfully registered' })
                                })
                                .catch(err => {
                                    res.status(500).json({ message: err.message })
                                })
                        }
                    })
                })
            }
        })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
}

module.exports.logIn = (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ message: "All fields required" })
    } else {
        User.findOne({ email: email }).then((user) => {
            if (!user) {
                res.status(400).json({ message: "User does not exist Kindly register" })
            } else {
                bcrypt.compare(password, user.password).then((isMatch) => {
                    if (!isMatch) {
                        res.status(401).json({ message: 'Email or password incorrect' })
                    } else {
                        user.loggedInAt = new Date()
                        user.save()
                        jwt.sign(
                            { id: user._id },
                            process.env.JWT_KEY,
                            {
                                expiresIn: 3600
                            },
                            (err, token) => {
                                if (err) throw err;
                                res.status(200).json({ Token: token })
                            }
                        )
                    }
                })
            }
        })
    }
}

module.exports.getAllUser = (req, res) => {
    User.find().then((user) => {
        res.status(200).json(user)
    })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

module.exports.updateOne = (req, res) => {
    const uId = req.user._id
    const id = req.params.id
    Todo.findOne({ _id: id, user: uId }).then((user) => {
        if (!user) {
            res.status(401).json({ message: 'You are not authorized' })
        }else {
            User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                .then(() => {
                    res.status(200).json({ message: 'User details updated successfully' })
                })
                .catch(err => {
                    res.status(500).json({ message: err.message })
                })
        }
    })

}

module.exports.remove = (req, res) => {
    const id = req.params.id
    User.findByIdAndDelete(id)
        .then(() => {
            res.status(200).json({ message: 'User deleted successfully' })
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}