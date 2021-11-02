const Todo = require('../models/todo')
const User = require('../models/user')

// controller to add todo
module.exports.addtodo = async (req, res) =>{
    const { userId, title, status, category} = req.body
    if (!title || !status || !category){
        return res.status(400).json({ message: "please enter all fieds" });
    }
    const id = req.user._id
    const newTodo = new Todo({
        userId : id,
        title:title,
        status:status,
        category:category
    });
    await newTodo.save().then((todo) => {
                User.findById(id).then((user)=>{
                    user.todoList.push(todo._id)
                    user.save()
                })
                
                 return res.status(201).json({ message: "todo saved successfully." });
				})
				.catch((error) => {
					return res.status(500).json({ message: error.message });
				});
}

// TODO List with Pagination
// Add Pagination on all get routes
//controller for user to shwo all todo for that user
module.exports.showToDo = async (req, res) =>{
    //pagination part limiting and control the data using page and limit
    let {page =1, limit =10} = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const id = req.user._id
    await Todo.find({userId : id}).populate('userId', 'userName')
    .skip((page -1)*limit)
    .limit(limit)
    .then((todos) =>{
        res.status(200).json(todos)
    })
    .catch((error)=>{
        res.status(500).json({message:error.message})
    })
    
}

// TODO List with Pagination
// Add Pagination on all get routes
//controller for admin to show all todos
module.exports.showToDoForAdmin = async (req, res) =>{
    //pagination part limiting and control the data using page and limit
    let {page =1, limit =10} = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    await Todo.find().populate('userId', 'userName')
    .skip((page -1)*limit)
    .limit(limit)
    .then((todos) =>{
        res.status(200).json(todos)
    })
    .catch((error)=>{
        res.status(500).json({message:error.message})
    })
    
}

//controller to show one todo by id
module.exports.getOnetodo = async (req, res) =>{
    let id = req.params.id
    await Todo.findById(id)
    .then((todo)=>{
        res.json(todo)
    })
    .catch((error)=>{
        res.status(500).json({message: error.message})
    })
}

//controller to update one todo by id
module.exports.updateOne = async (req, res) =>{
    let id = req.params.id;
    await Todo.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((todo) =>{
        res.json(todo)
    })
    .catch((error)=>{
        res.status(500).json({message:error.message})
    }) 
}

//controller to delete one todo by id
module.exports.deleteOne = async (req, res) =>{
    const id = req.params.id
    await Todo.findByIdAndDelete(id)
    .then((todo)=>{
        res.send({message: "todo deleted successfully"})
    })
    .catch(error =>{
        res.status(500).json({message:error.message})
    })
}

module.exports.fetchByCategory = async (req, res)=>{
    const category = req.params.category
    await Todo.find({category:category})
    .then((todo)=>{
        res.status(200).json(todo)
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
}

module.exports.fetchByTitle = async (req, res)=>{
    const title = req.params.title
    await Todo.find({title : title})
    .then(todo=>{
        res.status(200).json(todo)
    })
    .catch(err =>{
        res.status(500).json({message : err.message})
    })
}

module.exports.sortTodo = async (req, res)=>{
    await Todo.find()
    .sort({createdAt: 1})
    .then((todo)=>{
        res.status(200).json(todo)
    })
    .catch(err =>{
        res.status(500).json({message: err.message})
    })
}

module.exports.updateStatusByAdmin = async (req, res) =>{
    const id = req.params.id
    await Todo.updateOne({_id : {$eq:id}},{status : "Done"})
    .then((todo)=>{
        res.status(200).json({message : "Status updated to Done"})
    })
    .catch(err =>{
        res.status(500).json({message : err.message})
    })
}

module.exports.updateStatus = async (req, res) =>{
    const id = req.params.id
    const uid = req.user._id
    await Todo.findOne({_id : id, userId : uid}).then((isMatch)=>{
        if(!isMatch){
            return res.status(401).json({message : 'You are not authorized'})
        }else{
            Todo.updateOne({_id : {$eq:id}},{status : "Done"})
            .then((todo)=>{
                res.status(200).json({message : "Status updated to Done"})
            })
            .catch(err =>{
                res.status(500).json({message : err.message})
            })  
        }
    })
    
}