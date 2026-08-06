import { z } from "zod";

// إضافة مستخدم جديد
export const userSchema = z.object({
  fullName: z
    .string()
    .min(3, "الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل"),

  username: z
    .string()
    .min(4, "اسم المستخدم يجب أن يحتوي على 4 أحرف على الأقل"),

  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"),

  role: z.enum(["admin", "secretary", "client"]),

  phone: z.string().optional(),

  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .or(z.literal("")),

  address: z.string().optional(),

  isActive: z.boolean(),
});

// تعديل مستخدم
export const userUpdateSchema = z.object({
  fullName: z
    .string()
    .min(3, "الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل"),

  username: z
    .string()
    .min(2, "اسم المستخدم يجب أن يحتوي على 2 أحرف على الأقل"),

  role: z.enum(["admin", "secretary", "client"]),

  phone: z.string().optional(),

  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .or(z.literal("")),

  address: z.string().optional(),

  isActive: z.boolean(),
});

export type UserFormData = z.infer<typeof userSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;