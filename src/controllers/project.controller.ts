import { Request, Response } from "express";
import {
  createProject,
  getProjectsByUserId,
  getProjectById,
  updateProject,
  deleteProject,
} from "../services/project.service";

export async function listProjects(req: Request, res: Response) {
  const projects = await getProjectsByUserId(req.session.userId!);
  res.render("pages/projects/list.njk", { title: "Projects", projects });
}

export async function getCreateProject(_req: Request, res: Response) {
  res.render("pages/projects/create.njk", { title: "New Project" });
}

export async function postCreateProject(req: Request, res: Response) {
  try {
    await createProject(req.session.userId!, req.body);
    res.redirect("/projects");
  } catch (err: any) {
    res.render("pages/projects/create.njk", {
      title: "New Project",
      error: err.message,
      form: req.body,
    });
  }
}

export async function viewProject(req: Request, res: Response) {
  const project = await getProjectById(req.params.id, req.session.userId!);

  if (!project) {
    return res.status(404).render("pages/404.njk", { title: "Not Found" });
  }

  const statuses = ["todo", "in_progress", "done"];
  res.render("pages/projects/detail.njk", { title: project.name, project, statuses });
}

export async function postUpdateProject(req: Request, res: Response) {
  const project = await updateProject(req.params.id, req.session.userId!, req.body);

  if (!project) {
    return res.status(404).render("pages/404.njk", { title: "Not Found" });
  }

  res.redirect(`/projects/${req.params.id}`);
}

export async function postDeleteProject(req: Request, res: Response) {
  const project = await deleteProject(req.params.id, req.session.userId!);

  if (!project) {
    return res.status(404).render("pages/404.njk", { title: "Not Found" });
  }

  res.redirect("/projects");
}
