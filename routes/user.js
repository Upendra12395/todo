const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const adminAuth = require('../middleware/admin')
const userAuth = require('../middleware/user')


router.get('/allUser', adminAuth, userController.getAllUser)
router.post('/signIn', userController.signIn)
router.post('/logIn', userController.logIn)
router.patch('/update/:id', userAuth, userController.updateOne)
router.delete('/remove/:id', adminAuth, userController.remove)
router.get('/todayRegistered', adminAuth, userController.todayRegistered)
router.get('/todayActive', adminAuth, userController.todayActive)
router.get('/weekActive', adminAuth, userController.weekActive)

module.exports = router