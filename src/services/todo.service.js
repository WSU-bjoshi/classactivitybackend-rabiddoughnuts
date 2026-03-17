// WILL NEVER HAVE ANYTHING RELATED
// TO HTTP CALLS OR RESPONSES
import { 
    getAllTodos, 
    createTodo, 
    toggleTodo, 
    deleteTodo, 
    getIncompleteTodos, 
    getTodoById 
} from "../models/todo.models.js";

export async function getTodosService(userId){
    return await getAllTodos(userId);
}

export async function createTodoService(userId, task){
    if(!task || typeof task !=="string" || task.trim()===""){
        // return res.status(400).json({error:"task is required. You should provide non-empty string"});
        throw new Error("Invalid task")
    }
    return await createTodo(userId, task);
}

export async function toggleTodoByIdService(id){
    return await toggleTodo(id);
}

export async function deleteTodoByIdService(id){
    return await deleteTodo(id);
}

export async function getIncompleteTodosService(){
    return await getIncompleteTodos();
}

export async function getTodoByIdService(id){
    return await getTodoById(id);
}
