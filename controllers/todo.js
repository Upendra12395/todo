const Todo = require('../models/todo')
const User = require('../models/user')

// controller to add todo
module.exports.addTodo = async (req, res) => {
    const { user, title, status, category } = req.body
    if (!title || !status || !category) {
        return res.status(400).json({ message: "please enter all fieds" });
    }
    const id = req.user._id
    const newTodo = new Todo({
        user: id,
        title: title,
        status: status,
        category: category
    });
    await newTodo.save().then((todo) => {
        User.findById(id).then((user) => {
            user.todoList.push(todo._id)
            user.save()
        })

        return res.status(201).json({ message: "todo saved successfully." });
    })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}


//controller for user to shwo all todo for that user
module.exports.userTodo = async (req, res) => {
    //pagination part limiting and control the data using page and limit
    let { page = 1, limit = 10 } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const id = req.user._id
    await Todo.find({ user: id }).populate('user', 'userName')
        .skip((page - 1) * limit)
        .limit(limit)
        .then((todos) => {
            res.status(200).json(todos)
        })
        .catch((error) => {
            res.status(500).json({ message: error.message })
        })

}


//controller for admin to show all todos
module.exports.allTodo = async (req, res) => {
    //pagination part limiting and control the data using page and limit
    let { page = 1, limit = 10 } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    await Todo.find().populate('user', 'userName')
        .skip((page - 1) * limit)
        .limit(limit)
        .then((todos) => {
            res.status(200).json(todos)
        })
        .catch((error) => {
            res.status(500).json({ message: error.message })
        })

}

//controller to show one todo by id
module.exports.getOneTodo = async (req, res) => {
    let id = req.params.id
    const uId = req.user._id

    await Todo.findById({ _id: id, user: uId })
        .then((todo) => {
            if (!todo) {
                res.status(401).json({ message: 'You are not authorized' })
            } else {
                res.status(200).json(todo)
            }
        })
        .catch((error) => {
            res.status(500).json({ message: error.message })
        })
}

//controller to update one todo by id
module.exports.updateOne = async (req, res) => {
    let id = req.params.id;
    const uId = req.user._id
    await Todo.findOne({ _id: id, user: uId }).then((isMatch) => {
        if (!isMatch) {
            res.status(401).json({ message: "You are not authorized" })
        } else {
                Todo.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                .then((todo) => {
                    res.json(todo)
                })
        }
    })
    .catch((error) => {
        res.status(500).json({ message: error.message })
    })
}

//controller to delete one todo by id
module.exports.deleteOne = async (req, res) => {
    const id = req.params.id
    const uId = req.user._id
    await Todo.findOne({_id : id, user : uId}).then((isMatch)=>{
        if(!isMatch){
            res.status(401).json({message : 'You are not authorized'})
        }else{
            Todo.findByIdAndDelete(id)
        .then((todo) => {
            res.send({ message: "todo deleted successfully" })
        })
        .catch(error => {
            res.status(500).json({ message: error.message })
        })
        }
    })
    .catch(err=>{
        res.status(500).json({message : err.message})
    })
}

module.exports.getBycategory = async (req, res) => {
    const category = req.params.category
    await Todo.find({ category: category })
        .then((todo) => {
            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

module.exports.getByStatus = async (req, res) => {
    const status = req.params.status
    await Todo.find({ status: status })
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

module.exports.sortTodo = async (req, res) => {
    await Todo.find()
        .sort({ createdAt: 1 })
        .then((todo) => {
            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

module.exports.updateStatusByAdmin = async (req, res) => {
    const id = req.params.id
    await Todo.updateOne({ _id: { $eq: id } }, { status: "Done" })
        .then((todo) => {
            res.status(200).json({ message: "Status updated to Done" })
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}