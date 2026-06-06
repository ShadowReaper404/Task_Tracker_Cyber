import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator";
import {
  postCreateTask,
  postUpdateTask,
  postDeleteTask,
} from "../controllers/task.controller";

const router = Router();

router.post("/project/:projectId/tasks", isAuthenticated, validate(createTaskSchema), postCreateTask);
router.post("/project/:projectId/tasks/:taskId", isAuthenticated, validate(updateTaskSchema), postUpdateTask);
router.post("/project/:projectId/tasks/:taskId/delete", isAuthenticated, postDeleteTask);

export default router;
