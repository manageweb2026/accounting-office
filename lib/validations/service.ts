import { z } from "zod";

export const recurrenceTypes = [
  "mensuel",
  "trimestriel",
  "semestriel",
  "annuel",
] as const;

export type RecurrenceType = typeof recurrenceTypes[number];

export const serviceSchema = z.object({
  name: z.string().min(2, "Le nom est obligatoire"),

  description: z.string().optional(),

  clientPrice: z.number().min(0),

  employeePrice: z.number().min(0),

  isActive: z.boolean(),

  isRecurring: z.boolean(),

  recurrence: z.enum(recurrenceTypes).or(z.literal("")),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;