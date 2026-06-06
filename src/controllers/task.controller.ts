import { Request, Response } from "express";
import { createTask, updateTask, deleteTask } from "../services/task.service";

export async function postCreateTask(req: Request, res: Response) {
  await createTask(req.session.userId!, { ...req.body, projectId: req.params.projectId });
  res.redirect(`/projects/${req.params.projectId}`);
}

export async function postUpdateTask(req: Request, res: Response) {
  await updateTask(req.params.taskId, req.session.userId!, req.body);
  res.redirect(`/projects/${req.params.projectId}`);
}

export async function postDeleteTask(req: Request, res: Response) {
  await deleteTask(req.params.taskId, req.session.userId!);
  res.redirect(`/projects/${req.params.projectId}`);
}
