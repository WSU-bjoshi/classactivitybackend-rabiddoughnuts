let nextId = 3;

const todos =[
    {id:1, task:"Try to have fun with express", done:false},
    {id:2, task:"buy eggs", done:false}
]

function getAllTodos(){
    return todos;
}

function createTodo(task){
    const todo = {id: nextId++, task:task.trim(), done: false};
    todos.push(todo);
    return todo;
}

function toggleTodo(todo){
    todo.done= !todo.done;
    return todo;
}

function getIncompleteTodos(){
    const incomplete = todos.filter(t => !t.done);
    return incomplete;
}

function getTodoById(id){
    const todo = todos.find(t => t.id === id);
    return todo ?? null;
}

function deleteTodo(todo){
    return todos.splice(todoIndex, 1)[0];
}

export default {
    getAllTodos,
    createTodo,
    toggleTodo,
    getIncompleteTodos,
    getTodoById,
    deleteTodo
}