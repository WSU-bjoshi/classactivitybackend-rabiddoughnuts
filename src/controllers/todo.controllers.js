import {
    getTodosService,
    createTodoService,
    toggleTodoByIdService,
    getIncompleteTodosService,
    getTodoByIdService,
    deleteTodoByIdService,
} from "../services/todo.service.js";

export async function listTodos(req, res, next) {
    try {
        const userId = Number(req.user?.user_id ?? 1);
        const todos = await getTodosService(userId);
        res.json({ count: todos.length, todos });
    } catch (err) {
        next(err);
    }
}

export async function createTodos(req, res, next) {
    try {
        const userId = Number(req.user?.user_id ?? 1);
        const task = req.body.task ?? req.body.tasks;
        const todo = await createTodoService(userId, task);
        return res.status(201).json({ todo });
    } catch (err) {
        next(err);
    }
}

export async function toggleTodo(req, res, next) {
    try {
        const id = Number(req.params.id);
        const todo = await toggleTodoByIdService(id);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        return res.status(200).json({ todo });
    } catch (err) {
        next(err);
    }
}

export async function incompleteTodos(req, res, next) {
    try {
        const incomplete = await getIncompleteTodosService();
        return res.status(200).json({ count: incomplete.length, incomplete });
    } catch (err) {
        next(err);
    }
}

export async function getTodo(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }

        const todo = await getTodoByIdService(id);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found", id });
        }

        return res.status(200).json(todo);
    } catch (err) {
        next(err);
    }
}

export async function deleteTodo(req, res, next) {
    try {
        const id = Number(req.params.id);
        const todo = await deleteTodoByIdService(id);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        return res.status(200).json({ message: "Marked inactive", todo });
    } catch (err) {
        next(err);
    }
}