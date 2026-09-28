"use client";

import { useEffect } from "react";
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

type EditClientFormProps = {
  client: any;
  onSuccess?: () => void;
};

export default function EditClientForm({
  client,
  onSuccess,
}: EditClientFormProps) {

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),

   defaultValues: {
      code_client:"",
      firstName: "",
      lastName: "",
      contact: "",
      address: "",
      derection:"",
      inspection:"",
      nif: "",
      nis: "",
      ai: "",
      rc: "",
       bp: "",
      casnos_n: "",
      casnos_password: "",
      casnos_lieu: "",
      cnas_n: "",
      cnas_password: "",
      cnas_lieu: "",
      cacobathph_n:"",
      cacobathph_password: "",
      cacobathph_lieu: "",
      isActive: true,
}
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (client) {
     form.reset({
  code_client: client.code_client || "",
  firstName: client.firstName || "",
  lastName: client.lastName || "",
  contact: client.contact || "",
  address: client.address || "",
  derection: client.derection || "",
  inspection: client.inspection || "",
  nif: client.nif || "",
  nis: client.nis || "",
  ai: client.ai || "",
  rc: client.rc || "",
  bp: client.bp || "",

  // CASNOS
  casnos_n: client.casnos_n || "",
  casnos_password: client.casnos_password || "",
  casnos_lieu: client.casnos_lieu || "",

  // CNAS
  cnas_n: client.cnas_n || "",
  cnas_password: client.cnas_password || "",
  cnas_lieu: client.cnas_lieu || "",

  // CACOBATPH
  cacobathph_n: client.cacobathph_n || "",
  cacobathph_password: client.cacobathph_password || "",
  cacobathph_lieu: client.cacobathph_lieu || "",

  isActive: client.isActive ?? true,
});
    }
  }, [client, form]);

  async function onSubmit(data: ClientFormData) {
    try {
      const res = await fetch(`/api/clients/${client._id}`, {
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

      toast.success("تم تعديل الزبون بنجاح");

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
   
<div className="max-h-[70vh] overflow-y-auto pr-3">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

  {/* Code client */}
  <div>
    <label className="block mb-2 font-medium">
      Code client
    </label>
    <Input
      placeholder="Code client"
      {...register("code_client")}
    />
  </div>

  

  {/* اللقب */}
  <div>
    <label className="block mb-2 font-medium">
      nom
    </label>
    <Input
      placeholder="nom"
      {...register("lastName")}
    />
    {errors.lastName && (
      <p className="text-red-500 text-sm mt-1">
        {errors.lastName.message}
      </p>
    )}
  </div>

  {/* الاسم */}
  <div>
    <label className="block mb-2 font-medium">
      prenom
    </label>
    <Input
      placeholder="prenom"
      {...register("firstName")}
    />
    {errors.firstName && (
      <p className="text-red-500 text-sm mt-1">
        {errors.firstName.message}
      </p>
    )}
  </div>

  {/* جهة الاتصال */}
  <div>
    <label className="block mb-2 font-medium">
      N_telephone 
    </label>
    <Input
      placeholder="N_telephone"
      {...register("contact")}
    />
  </div>

  {/* العنوان */}
  <div>
    <label className="block mb-2 font-medium">
      address
    </label>
    <Input
      placeholder="address"
      {...register("address")}
    />
  </div>

  {/* Direction */}
  <div>
    <label className="block mb-2 font-medium">
      Direction
    </label>
    <Input
      placeholder="Direction"
      {...register("derection")}
    />
  </div>

  {/* Inspection */}
  <div>
    <label className="block mb-2 font-medium">
      Inspection
    </label>
    <Input
      placeholder="Inspection"
      {...register("inspection")}
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

  {/* AI */}
  <div>
    <label className="block mb-2 font-medium">
      AI
    </label>
    <Input
      placeholder="AI"
      {...register("ai")}
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

  {/* BP */}
  <div>
    <label className="block mb-2 font-medium">
      BP
    </label>
    <Input
      placeholder="BP"
      {...register("bp")}
    />
  </div>

  {/* CASNOS N */}
  <div>
    <label className="block mb-2 font-medium">
      CASNOS N°
    </label>
    <Input
      placeholder="CASNOS N°"
      {...register("casnos_n")}
    />
  </div>

  {/* CASNOS Password */}
  <div>
    <label className="block mb-2 font-medium">
      CASNOS Password
    </label>
    <Input
      type="password"
      placeholder="CASNOS Password"
      {...register("casnos_password")}
    />
  </div>

  {/* CASNOS Lieu */}
  <div>
    <label className="block mb-2 font-medium">
      CASNOS Lieu
    </label>
    <Input
      placeholder="CASNOS Lieu"
      {...register("casnos_lieu")}
    />
  </div>

  {/* CNAS N */}
  <div>
    <label className="block mb-2 font-medium">
      CNAS N°
    </label>
    <Input
      placeholder="CNAS N°"
      {...register("cnas_n")}
    />
  </div>

  {/* CNAS Password */}
  <div>
    <label className="block mb-2 font-medium">
      CNAS Password
    </label>
    <Input
      type="password"
      placeholder="CNAS Password"
      {...register("cnas_password")}
    />
  </div>

  {/* CNAS Lieu */}
  <div>
    <label className="block mb-2 font-medium">
      CNAS Lieu
    </label>
    <Input
      placeholder="CNAS Lieu"
      {...register("cnas_lieu")}
    />
  </div>

  {/* CACOBATPH N */}
  <div>
    <label className="block mb-2 font-medium">
      CACOBATPH N°
    </label>
    <Input
      placeholder="CACOBATPH N°"
      {...register("cacobathph_n")}
    />
  </div>

  {/* CACOBATPH Password */}
  <div>
    <label className="block mb-2 font-medium">
      CACOBATPH Password
    </label>
    <Input
      type="password"
      placeholder="CACOBATPH Password"
      {...register("cacobathph_password")}
    />
  </div>

  {/* CACOBATPH Lieu */}
  <div>
    <label className="block mb-2 font-medium">
      CACOBATPH Lieu
    </label>
    <Input
      placeholder="CACOBATPH Lieu"
      {...register("cacobathph_lieu")}
    />
  </div>

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

        <label>active</label>
      </div>

      {/* زر الحفظ */}
      <div className="flex justify-end pt-4">
        <Button type="submit">
          enregistrer
        </Button>
      </div>
    </form>
  );
}