"use client";


import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  clientSchema,
  ClientFormData,
} from "@/lib/validations/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";

type ClientFormProps = {
  onSuccess?: () => void;
};

export default function ClientForm({
  onSuccess,
}: ClientFormProps) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      contact: "",
      address: "",
      nif: "",
      nis: "",
      na: "",
      rc: "",
      isActive: true,
    },
  });

  const [createdClient, setCreatedClient] = useState<any>(null);

const [openServices, setOpenServices] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(data: ClientFormData) {
    try {
      const res = await fetch("/api/clients", {
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

      setCreatedClient(result.client);

      toast.success("تمت إضافة الزبون بنجاح");

    

      

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

        {/* الاسم */}
        <div>
          <label className="block mb-2 font-medium">
            الاسم
          </label>

          <Input
            placeholder="أدخل الاسم"
            {...register("firstName")}
          />

          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* اللقب */}
        <div>
          <label className="block mb-2 font-medium">
            اللقب
          </label>

          <Input
            placeholder="أدخل اللقب"
            {...register("lastName")}
          />

          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* جهة الاتصال */}
        <div>
          <label className="block mb-2 font-medium">
            جهة الاتصال
          </label>

          <Input
            placeholder="رقم الهاتف"
            {...register("contact")}
          />
        </div>

        {/* العنوان */}
        <div>
          <label className="block mb-2 font-medium">
            العنوان
          </label>

          <Input
            placeholder="العنوان"
            {...register("address")}
          />
        </div>

        {/* NIF */}
        <div>
          <label className="block mb-2 font-medium">
            NIF
          </label>

          <Input
            placeholder="NIF"
            {...register("nif")}
          />
        </div>

        {/* NIS */}
        <div>
          <label className="block mb-2 font-medium">
            NIS
          </label>

          <Input
            placeholder="NIS"
            {...register("nis")}
          />
        </div>

        {/* NA */}
        <div>
          <label className="block mb-2 font-medium">
            NA
          </label>

          <Input
            placeholder="NA"
            {...register("na")}
          />
        </div>

        {/* RC */}
        <div>
          <label className="block mb-2 font-medium">
            RC
          </label>

          <Input
            placeholder="RC"
            {...register("rc")}
          />
        </div>

      </div>

      {/* حالة الملف */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={form.watch("isActive")}
          onCheckedChange={(checked) =>
            form.setValue("isActive", Boolean(checked))
          }
        />

        <label>الملف نشط</label>
      </div>

      {/* زر الحفظ */}
     <div className="flex justify-end gap-3 pt-4">

  <Button type="submit">
    حفظ
  </Button>

 

</div>
    </form>
  );
}