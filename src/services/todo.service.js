// WILL NEVER HAVE ANYTHING RELATED
// TO HTTP CALLS OR RESPONSES
import ToDoModel from "../models/todo.models.js"

function getTodosService(){
    return ToDoModel.getAllTodos();
}

function createTodoService(task){
    if(!task || typeof task !=="string" || task.trim()===""){
        // return res.status(400).json({error:"task is required. You should provide non-empty string"});
        throw new Error("Invalid task")
    }
    return ToDoModel.createTodo(task);
}

function toggleTodoByIdService(id){
    const todo = todos.find(t => t.id === id);
    if(!todo){
        return null;
    }
    return ToDoModel.toggleTodoById(todo);
}

function deleteTodoByIdService(id){
    const todoIndex = todos.findIndex(t => t.id === id);

    if(todoIndex === -1){
        return null;
    }

    return deleteTodo(todo);
}

export default {
    getTodosService,
    createTodoService,
    toggleTodoByIdService,
    deleteTodoByIdService
}