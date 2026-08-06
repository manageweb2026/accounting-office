"use client";

import { useEffect } from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  userUpdateSchema,
  UserUpdateFormData,
} from "@/lib/validations/user";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

type EditEmployeeFormProps = {
  user: any;
  onSuccess?: () => void;
};

export default function EditEmployeeForm({
  user,
  onSuccess,
}: EditEmployeeFormProps)  {
 const form = useForm<UserUpdateFormData>({
  resolver: zodResolver(userUpdateSchema),
  defaultValues: {
    fullName: "",
    username: "",
   
    role: "client",
    phone: "",
    email: "",
    address: "",
    isActive: true,
  },
});


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (user) {
      form.reset({
       fullName : user.fullName,
        username: user.username,
        role: user.role || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address|| "",
        isActive: user.isActive,
      });
    }
  }, [user, form]);
  

async function onSubmit(data: UserUpdateFormData) {
  try {
    const res = await fetch(`/api/users/${user._id}`,  {
     method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success) {
      toast.error(result.message);
      return;
    }

   toast.success("تم تعديل الموظف بنجاح");
    form.reset({
      fullName: "",
      username: "",
    
      role: "client",
      phone: "",
      email: "",
      address: "",
      isActive: true,
    });

    onSuccess?.();

  } catch (error) {
    console.error(error);
    toast.error("حدث خطأ أثناء حفظ البيانات");
  }

}
  return (
    
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">

        {/* الاسم الكامل */}
        <div>
          <label className="block mb-2 font-medium">
            الاسم الكامل
          </label>

          <Input
            placeholder="أدخل الاسم الكامل"
            {...register("fullName")}
          />

          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* اسم المستخدم */}
        <div>
          <label className="block mb-2 font-medium">
            اسم المستخدم
          </label>

          <Input
            placeholder="أدخل اسم المستخدم"
            {...register("username")}
          />

          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

    

        {/* الدور */}
        <div>
          <label className="block mb-2 font-medium">
            الدور
          </label>

        <Select
  value={form.watch("role")}
  onValueChange={(value) => {
    form.setValue("role", value as UserUpdateFormData["role"], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }}
>
            <SelectTrigger>
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="admin">
                المدير
              </SelectItem>

              <SelectItem value="secretary">
                السكرتير
              </SelectItem>

              <SelectItem value="client">
                الموظف
              </SelectItem>

              
            </SelectContent>

            
             
          </Select>

          {errors.role && (
            <p className="text-red-500 text-sm mt-1">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* الهاتف */}
        <div>
          <label className="block mb-2 font-medium">
            رقم الهاتف
          </label>

          <Input
            placeholder="أدخل رقم الهاتف"
            {...register("phone")}
          />

          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block mb-2 font-medium">
            البريد الإلكتروني
          </label>

          <Input
            type="email"
            placeholder="example@email.com"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

      </div>

      {/* العنوان */}
      <div>
        <label className="block mb-2 font-medium">
          العنوان
        </label>

        <Input
          placeholder="أدخل العنوان"
          {...register("address")}
        />

        {errors.address && (
          <p className="text-red-500 text-sm mt-1">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* حالة الحساب */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={form.watch("isActive")}
          onCheckedChange={(checked) =>
            form.setValue("isActive", Boolean(checked))
          }
        />

        <label>الحساب مفعل</label>
      </div>

      {/* الأزرار */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">
  حفظ
</Button>
      </div>
    </form>
  );
}