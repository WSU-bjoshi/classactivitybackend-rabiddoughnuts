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
    // // 1. Insert the new todo
    // const [result] = await pool.query("INSERT INTO todos (task) VALUES (?)", [task]);
    // // 2. Fetch the newly inserted todo to return it
    // const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [result.insertId]);
    // return rows[0]; 
    return await Todo.create({task});
}

export async function toggleTodo(id) {
    // 1. Fetch current status
    const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    if (rows.length === 0) return null;

    const todo = rows[0];
    const newStatus = !todo.completed;
    
    // 2. Update with new status
    await pool.query("UPDATE todos SET completed = ? WHERE id = ?", [newStatus, id]);

    // 3. Return updated todo
    const [updatedRows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    return updatedRows[0];
}

export async function getIncompleteTodos() {
    const [rows] = await pool.query("SELECT * FROM todos WHERE completed = 0");
    return rows;
}

export async function getTodoById(id) {
    const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    return rows[0] || null;
}

export async function deleteTodo(id) {
    // 1. Check if exists
    const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    if (rows.length === 0) return null;

    // 2. Delete
    await pool.query("DELETE FROM todos WHERE id = ?", [id]);
    
    // 3. Return the deleted item (similar to how splice returned it)
    return rows[0];
}