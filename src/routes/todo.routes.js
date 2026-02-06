import { Router } from "express";

import {listTodos, createTodos, toggleTodo, incompleteTodos, getTodo, deleteTodo} from "../controllers/todo.controllers.js";


const router = Router();

router.get("/", listTodos);
router.get("/incomplete", incompleteTodos);
router.get("/:id", getTodo);
router.post("/", createTodos);
router.patch("/:id/toggle", toggleTodo);
router.delete("/:id", deleteTodo);

export default router;

