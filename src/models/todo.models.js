import pool from "../db/connection.js"

import Todo from "./Todo.js"

let nextId = 3;

let todos =[
    {id:1, task:"Try to have fun with express", done:false},
    {id:2, task:"buy eggs", done:false}
]

export async function getAllTodos(){
    // const [rows] = await pool.query("SELECT * FROM todos")
    // console.log(rows);
    // return rows;
    return await Todo.findAll({order: [["id", "ASC"]]});
}

export async function createTodo(task) {
    // const [result] = await pool.query("INSERT INTO todos (task) VALUES (?)", [task]);
    // const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [result.insertId]);
    // return rows[0]; 
    return await Todo.create({task});
}

// TODO - maybe old? needs to be rechecked
export async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if(!todo){  return null;    }

    todo.done = !todo.done;
    return todo;
    // const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    // if (rows.length === 0) return null;

    // const todo = rows[0];
    // const newStatus = !todo.completed;
    
    // await pool.query("UPDATE todos SET completed = ? WHERE id = ?", [newStatus, id]);

    // const [updatedRows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    // return updatedRows[0];
}

// TODO - OLD needs to be rechecked
export async function getIncompleteTodos() {
    const [rows] = await pool.query("SELECT * FROM todos WHERE completed = 0");
    return rows;
}

// TODO - OLD needs to be rechecked
export async function getTodoById(id) {
    const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    return rows[0] || null;
}

// TODO - maybe old? needs to be rechecked
export async function deleteTodo(id) {
    const todoIndex = todos.findIndex(t => t.id === id);
    if(todoIndex === -1){   return null;    }
    return todos.splice(id, 1)[0];
    // const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    // if (rows.length === 0) return null;

    // await pool.query("DELETE FROM todos WHERE id = ?", [id]);
    
    // return rows[0];
}