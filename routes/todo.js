const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo')
const adminAuth = require('../middleware/admin')
const userAuth = require


router.post('/addTodo', todoController.addTodo)
router.get('/allTodo', todoController.allTodo)
router.get('/userTodo', todoController.userTodo)
router.patch('/updateTodo/:id', todoController.updateOne)
router.delete('/deleteTodo/:id', todoController.deleteOne)
router.get('/getByCategory/:id', todoController.getBycategory)
router.get('/getByStatus/:id', todoController.getByStatus)


module.exports = router