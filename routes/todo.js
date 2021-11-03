const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo')
const adminAuth = require('../middleware/admin')
const userAuth = require('../middleware/user')


router.post('/addTodo', userAuth, todoController.addTodo)
router.get('/allTodo', adminAuth, todoController.allTodo)
router.get('/userTodo', userAuth, todoController.userTodo)
router.get('/getOneTodo/:id', userAuth, todoController.getOneTodo)
router.patch('/updateTodo/:id', userAuth, todoController.updateOne)
router.delete('/deleteTodo/:id', userAuth, todoController.deleteOne)
router.get('/getByCategory/:id', adminAuth, todoController.getBycategory)
router.get('/getByStatus/:id', adminAuth, todoController.getByStatus)
router.patch('/updateStatusByAdmin/:id', adminAuth, todoController.updateStatusByAdmin)
router.patch('/updateStatus/:id', userAuth, todoController.updateStatus)
router.get('/sortTodo', adminAuth, todoController.sortTodo)


module.exports = router