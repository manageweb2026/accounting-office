import { z } from "zod";

export const clientSchema = z.object({
  firstName: z
    .string()
    .min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),

  lastName: z
    .string()
    .min(2, "اللقب يجب أن يحتوي على حرفين على الأقل"),

  contact: z.string().optional(),

  address: z.string().optional(),

  nif: z.string().optional(),

  nis: z.string().optional(),

  na: z.string().optional(),

  rc: z.string().optional(),

  isActive: z.boolean(),
});

export type ClientFormData = z.infer<typeof clientSchema>;