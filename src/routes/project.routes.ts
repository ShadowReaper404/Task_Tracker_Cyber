import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator";
import {
  listProjects,
  getCreateProject,
  postCreateProject,
  viewProject,
  postUpdateProject,
  postDeleteProject,
} from "../controllers/project.controller";

const router = Router();

router.get("/", isAuthenticated, listProjects);
router.get("/new", isAuthenticated, getCreateProject);
router.post("/", isAuthenticated, validate(createProjectSchema), postCreateProject);
router.get("/:id", isAuthenticated, viewProject);
router.post("/:id", isAuthenticated, validate(updateProjectSchema), postUpdateProject);
router.post("/:id/delete", isAuthenticated, postDeleteProject);

export default router;
