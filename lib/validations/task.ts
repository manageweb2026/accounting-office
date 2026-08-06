import { z } from "zod";

export const taskSchema = z.object({
  client: z.string().min(1, "Le client est obligatoire"),

  service: z.string().min(1, "Le service est obligatoire"),

  dueDate: z.string().min(
    1,
    "La date limite est obligatoire"
  ),

  notes: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;