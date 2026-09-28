
import { z } from "zod";

export const clientSchema = z.object({
  code_client: z.string().optional(),

  firstName: z
    .string()
    .min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),

  lastName: z
    .string()
    .min(2, "اللقب يجب أن يحتوي على حرفين على الأقل"),

  contact: z.string().optional(),
  address: z.string().optional(),
   derection: z.string().optional(),
  inspection: z.string().optional(),

  nif: z.string().optional(),
  nis: z.string().optional(),
  ai: z.string().optional(),
  na: z.string().optional(),
  rc: z.string().optional(),
  bp: z.string().optional(),

  // CASNOS
  casnos_n: z.string().optional(),
  casnos_password: z.string().optional(),
  casnos_lieu: z.string().optional(),

  // CNAS
  cnas_n: z.string().optional(),
  cnas_password: z.string().optional(),
  cnas_lieu: z.string().optional(),

  // CACOBATPH
  cacobathph_n: z.string().optional(),
  cacobathph_password: z.string().optional(),
  cacobathph_lieu: z.string().optional(),

  isActive: z.boolean(),
});

export type ClientFormData = z.infer<typeof clientSchema>;