import { Router } from "express";
import { listTodos, createTodos, toggleTodo, incompleteTodos, getTodo, deleteTodo } from "../controllers/todo.controllers.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js"


const router = Router();

// router.use(requireAuth);

// router.use(requireRole("admin", "staff", "users"));

router.get("/", listTodos);
router.get("/incomplete", incompleteTodos);
router.get("/:id", getTodo);
router.post("/", createTodos);
router.patch("/:id/toggle", toggleTodo);
router.delete("/:id", deleteTodo);

export default router;
