import prisma from "../lib/prisma";
import { CreateProjectInput, UpdateProjectInput } from "../validators/project.validator";

export async function createProject(userId: string, input: CreateProjectInput) {
  return prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      ownerId: userId,
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { tasks: true },
      },
    },
  });
}

export async function getProjectsByUserId(userId: string) {
  return prisma.project.findMany({
    where: { ownerId: userId },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      tasks: {
        include: {
          assignee: {
            select: { id: true, name: true, email: true },
          },
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) return null;

  if (project.ownerId !== userId) return null;

  return project;
}

export async function updateProject(projectId: string, userId: string, input: UpdateProjectInput) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project || project.ownerId !== userId) return null;

  return prisma.project.update({
    where: { id: projectId },
    data: {
      name: input.name,
      description: input.description,
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function deleteProject(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project || project.ownerId !== userId) return null;

  return prisma.project.delete({
    where: { id: projectId },
  });
}
