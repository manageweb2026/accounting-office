"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  serviceSchema,
  ServiceFormData,
} from "@/lib/validations/service";

import type { RecurrenceType } from "@/lib/validations/service";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";

type ServiceFormProps = {
  onSuccess?: () => void;
};

export default function ServiceForm({
  onSuccess,
}: ServiceFormProps) {

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),

    defaultValues: {
  name: "",
  description: "",
  clientPrice: 0,
  employeePrice: 0,
  isActive: true,

  isRecurring: false,
  recurrence: "",
},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const isRecurring = form.watch("isRecurring");

  async function onSubmit(data: ServiceFormData) {
    try {
      const res = await fetch("/api/services", {
        method: "POST",
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

      toast.success("تمت إضافة الخدمة بنجاح");
form.reset({
  name: "",
  description: "",
  clientPrice: 0,
  employeePrice: 0,
  isActive: true,
  isRecurring: false,
  recurrence: "",
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

      <div>

        <label className="block mb-2 font-medium">
          اسم الخدمة
        </label>

        <Input
          placeholder="مثال: TVA"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </p>
        )}

      </div>

      <div>

        <label className="block mb-2 font-medium">
          الوصف
        </label>

        <Input
          placeholder="وصف الخدمة"
          {...register("description")}
        />

      </div>

     <div>

  <label className="block mb-2 font-medium">
    Prix Client (DA)
  </label>

  <Input
    type="number"
    {...register("clientPrice", {
      valueAsNumber: true,
    })}
  />

  {errors.clientPrice && (
    <p className="text-red-500 text-sm mt-1">
      {errors.clientPrice.message}
    </p>
  )}

</div>

<div>

  <label className="block mb-2 font-medium">
    Prix Employé (DA)
  </label>

  <Input
    type="number"
    {...register("employeePrice", {
      valueAsNumber: true,
    })}
  />

  {errors.employeePrice && (
    <p className="text-red-500 text-sm mt-1">
      {errors.employeePrice.message}
    </p>
  )}

</div>

   {/* Service active */}
<div className="flex items-center gap-3">

  <Checkbox
    checked={form.watch("isActive")}
    onCheckedChange={(checked) =>
      form.setValue("isActive", Boolean(checked))
    }
  />

  <label>Service active</label>

</div>

{/* Service récurrent */}
<div className="flex items-center gap-3">

  <Checkbox
    checked={isRecurring}
    onCheckedChange={(checked) =>
      form.setValue("isRecurring", Boolean(checked))
    }
  />

  <label>Service récurrent</label>

</div>

{isRecurring && (

  <div>

    <label className="block mb-2 font-medium">
      Type de récurrence
    </label>

    <Select
      onValueChange={(value) =>
        form.setValue(
          "recurrence",
          value as "mensuel" | "trimestriel" | "semestriel" | "annuel"
        )
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Choisir..." />
      </SelectTrigger>

      <SelectContent>

        <SelectItem value="mensuel">
          Mensuel
        </SelectItem>

        <SelectItem value="trimestriel">
          Trimestriel
        </SelectItem>

        <SelectItem value="semestriel">
          Semestriel
        </SelectItem>

        <SelectItem value="annuel">
          Annuel
        </SelectItem>

      </SelectContent>

    </Select>

  </div>

)}
      <div className="flex justify-end pt-4">

        <Button type="submit">
          حفظ
        </Button>

      </div>

    </form>
  );
}