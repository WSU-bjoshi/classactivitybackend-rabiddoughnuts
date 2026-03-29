// import pool from "../db/connection.js"
import Todo from "./Todo.js"
import { Op } from "sequelize";

// let nextId = 3;

// let todos =[
//     {id:1, task:"Try to have fun with express", done:false},
//     {id:2, task:"buy eggs", done:false}
// ]

export async function getAllTodos(userId){
    // const [rows] = await pool.query("SELECT * FROM todos")
    // console.log(rows);
    // return rows;

    // Filter to only include active todos (in_use: true)
    return await Todo.findAll({
        where: {
            user_id: userId,
            in_use: true
        }, 
        order: [["task_id", "ASC"]]
    });
}

export async function createTodo(userId, task) {
    // const [result] = await pool.query("INSERT INTO todos (task) VALUES (?)", [task]);
    // const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [result.insertId]);
    // return rows[0]; 
    return await Todo.create({user_id: userId, tasks: task});
}

export async function toggleTodo(id) {
    /* OLD ARRAY IMPLEMENTATION
    const todo = todos.find(t => t.id === id);
    if(!todo){  return null;    }

    todo.done = !todo.done;
    return todo;
    */
    
    /* OLD SQL IMPLEMENTATION
    const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    if (rows.length === 0) return null;

    const todo = rows[0];
    const newStatus = !todo.completed;
    
    await pool.query("UPDATE todos SET completed = ? WHERE id = ?", [newStatus, id]);

    const [updatedRows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    return updatedRows[0];
    */

    // NEW SEQUELIZE IMPLEMENTATION
    const todo = await Todo.findOne({ where: { task_id: id, in_use: true } });
    if (!todo) return null;

    todo.completed = !todo.completed;
    await todo.save();
    return todo;
}

export async function getIncompleteTodos() {
    /* OLD SQL IMPLEMENTATION
    const [rows] = await pool.query("SELECT * FROM todos WHERE completed = 0");
    return rows;
    */

    // NEW SEQUELIZE IMPLEMENTATION
    return await Todo.findAll({
        where: {
            completed: false,
            in_use: true
        }
    });

}

export async function getTodoById(id) {
    /* OLD SQL IMPLEMENTATION
    const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    return rows[0] || null;
    */

    // NEW SEQUELIZE IMPLEMENTATION
    return await Todo.findOne({
        where: {
            task_id: id,
            in_use: true
        }
    });
}

export async function deleteTodo(id) {
    /* OLD ARRAY IMPLEMENTATION
    const todoIndex = todos.findIndex(t => t.id === id);
    if(todoIndex === -1){   return null;    }
    return todos.splice(id, 1)[0];
    */

    /* OLD SQL IMPLEMENTATION
    const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    if (rows.length === 0) return null;

    await pool.query("DELETE FROM todos WHERE id = ?", [id]);
    
    return rows[0];
    */

    // NEW SEQUELIZE IMPLEMENTATION (Soft Delete)
    const todo = await Todo.findOne({ where: { task_id: id, in_use: true } });
    if (!todo) return null;

    todo.in_use = false;
    await todo.save();
    return todo;
}