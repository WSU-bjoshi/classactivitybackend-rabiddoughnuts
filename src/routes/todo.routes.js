import { Router } from "express";
import { listTodos, createTodos, toggleTodo, incompleteTodos, getTodo, deleteTodo } from "../controllers/todo.controllers.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";


const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

router.get("/", listTodos);
router.get("/incomplete", incompleteTodos);
router.get("/:id", getTodo);
router.post("/", createTodos);
router.patch("/:id/toggle", toggleTodo);
router.delete("/:id", deleteTodo);

export default router;
