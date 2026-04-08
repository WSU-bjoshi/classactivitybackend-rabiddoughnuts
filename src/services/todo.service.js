// WILL NEVER HAVE ANYTHING RELATING TO HTTP CALLS OR RESPONSES

// import { where } from "sequelize";
import {
    getAllTodos,
    createTodo,
    toggleTodo as toggleTodoModel,
    deleteTodo as deleteTodoModel,
    getIncompleteTodos,
    getTodoById
} from "../models/todo.models.js";

export async function getTodosService(userId){
    return await getAllTodos(userId);
}

export async function createTodoService(userId, task){
    if(!task || typeof task !=="string" || task.trim()===""){
        throw new Error("Invalid task")
    }
    return await createTodo(userId, task);
}

export async function toggleTodoByIdService(id){
    return await toggleTodoModel(id);
}

export async function deleteTodoByIdService(id){
    return await deleteTodoModel(id);
}

export async function getIncompleteTodosService(){
    return await getIncompleteTodos();
}

export async function getTodoByIdService(id){
    return await getTodoById(id);
}