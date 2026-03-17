import {
    getTodosService,
    createTodoService,
    toggleTodoByIdService,
    getIncompleteTodosService,
    getTodoByIdService,
    deleteTodoByIdService
} from "../services/todo.service.js";

export async function listTodos(req, res) {
    if(!req.user || !req.user.user_id){
        return res.status(401).json({error: "User not authenticated"});
    }
    const todos = await getTodosService(req.user.user_id);
    res.json({ count: todos.length, todos });
}

export async function createTodos(req, res) {
    if(!req.user || !req.user.user_id){
        return res.status(401).json({error: "User not authenticated"});
    }
    const { task } = req.body;
    const todo = await createTodoService(req.user.user_id, task);
    res.status(201).json({ message: "Created", todo });
}

// TODO: does this need to be async and await?
export async function toggleTodo(req, res) {
    const id = Number(req.params.id);
    const todo = await toggleTodoByIdService(id);

    if (!todo) {
        return res.status(400).json({ error: "Todo not found" });
    }
    res.json({ message: "Toggled", todo });
}

export async function incompleteTodos(req, res) {
    const incomplete = await getIncompleteTodosService();
    res.json({ count: incomplete.length, incomplete });
}

export async function getTodo(req, res) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    
    const todo = await getTodoByIdService(id);

    if (!todo) return res.status(404).json({ error: "Todo not found", id });

    res.json(todo);
}

// TODO: does this need to be async and await?
export async function deleteTodo(req, res) {
    const id = Number(req.params.id);
    const todo = await deleteTodoByIdService(id);

    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Deleted Successfully", todo });
}