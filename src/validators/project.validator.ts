import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).trim(),
  description: z.string().max(2000).trim().default(""),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).trim(),
  description: z.string().max(2000).trim().default(""),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
