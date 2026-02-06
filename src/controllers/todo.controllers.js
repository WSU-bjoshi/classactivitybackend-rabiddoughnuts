import todoService from "../services/todo.service.js";

export function listTodos(req, res){
    const todos = todoService.getTodosService();
    res.json({count: todos.length, todos});
}

export function createTodos(req, res){
    try{
        const {task} = req.body;
        const todo = todoService.createTodoService(task);
        res.status(201).json({message:"Created", todo});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

export function toggleTodo(req, res){
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
        return res.status(400).json({error: "Invalid id"});
    }
    const todo = todoService.toggleTodoByIdService(id);

    if(!todo){
        return res.status(404).json({error : "Todo not found"});
    }
    res.json({message:"Toggled", todo});

}

export function incompleteTodos(req, res){
    const incomplete = getIncompleteTodosService();
    res.json({count: incomplete.length, incomplete});
}

export function getTodo(req, res){
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
        return res.status(400).json({error: "Invalid id"});
    }
    const todo = todoService.getTodoByIdService(id);

    if(!todo) return res.status(404).json({error:"todo not found", id});

    res.json(todo);
}

export function deleteTodo(req, res){
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
        return res.status(400).json({error: "Invalid id"});
    }
    const todo = todoService.deleteTodoByIdService(id);

    if(!todo){
        return res.status(404).json({error: "Todo not found"})
    }

    res.json({message:"Deleted Successfully"})
}