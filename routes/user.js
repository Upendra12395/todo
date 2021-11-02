const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const adminAuth = require('../middleware/admin')


router.get('/allUser', adminAuth, userController.getAllUser)
router.post('/signIn', userController.signIn)
router.post('/logIn', userController.logIn)
router.patch('/update/:id', userController.updateOne)
router.delete('/remove/:id', userController.remove)

module.exports = router