import {
    getTodosService,
    createTodoService,
    toggleTodoByIdService,
    getIncompleteTodosService,
    getTodoByIdService,
    deleteTodoByIdService
} from "../services/todo.service.js";

export async function listTodos(req, res) {
    try {
        const todos = await getTodosService();
        res.json({ count: todos.length, todos });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function createTodos(req, res) {
    try {
        const { task } = req.body;
        const todo = await createTodoService(task);
        res.status(201).json({ message: "Created", todo });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function toggleTodo(req, res) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        
        const todo = await toggleTodoByIdService(id);
    
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json({ message: "Toggled", todo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function incompleteTodos(req, res) {
    try {
        const incomplete = await getIncompleteTodosService();
        res.json({ count: incomplete.length, incomplete });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getTodo(req, res) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        
        const todo = await getTodoByIdService(id);
    
        if (!todo) return res.status(404).json({ error: "Todo not found", id });
    
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function deleteTodo(req, res) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        
        const todo = await deleteTodoByIdService(id);
    
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
    
        res.json({ message: "Deleted Successfully", todo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}