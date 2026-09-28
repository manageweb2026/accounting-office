import { z } from "zod";

export const recurrenceTypes = [
  "mensuel",
  "trimestriel",
  "semestriel",
  "annuel",
] as const;

export type RecurrenceType = typeof recurrenceTypes[number];

export const serviceSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom est obligatoire"),

  description: z.string().optional(),

  direction: z.string().optional(),

  date_recurent: z.string().optional(),

  date_limite: z.string().optional(),

  Prix_Traitement_chifré: z
    .number()
    .min(0, "Le prix doit être supérieur ou égal à 0"),

  Prix_Traitement_néant: z
    .number()
    .min(0, "Le prix doit être supérieur ou égal à 0"),

  Prix_secretaireC: z
    .number()
    .min(0, "Le prix doit être supérieur ou égal à 0"),

  Prix_secretaireN: z
    .number()
    .min(0, "Le prix doit être supérieur ou égal à 0"),

  Prix_service_Agent: z
    .number()
    .min(0, "Le prix doit être supérieur ou égal à 0"),

  Prix_Agent: z
    .number()
    .min(0, "Le prix doit être supérieur ou égal à 0"),

  isRecurring: z.boolean(),

  recurrence: z.enum([
    "mensuel",
    "trimestriel",
    "semestriel",
    "annuel",
    "ponctuel",
  ]).nullable(),

  isActive: z.boolean(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;