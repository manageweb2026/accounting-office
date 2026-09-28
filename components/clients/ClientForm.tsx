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
  className="flex flex-col space-y-4"
>
  {/* الحقول القابلة للتمرير */}
  <div className="max-h-[70vh] overflow-y-auto pr-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* اللقب */}
      <div>
        <label className="block mb-2 font-medium">
          nom
        </label>
        <Input
          placeholder="saisir le nom"
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
          placeholder="saisir le prenom"
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>

      {/* العنوان */}
      <div>
        <label className="block mb-2 font-medium">
          address
        </label>
        <Input
          placeholder="saisir l'adresse"
          {...register("address")}
        />
      </div>

      {/* رقم الهاتف */}
      <div>
        <label className="block mb-2 font-medium">
          N_telephone
        </label>
        <Input
          placeholder="saisir le numéro de téléphone"
          {...register("contact")}
        />
      </div>

      {/* Direction */}
      <div>
        <label className="block mb-2 font-medium">
          direction
        </label>
        <Input
          placeholder="saisir la direction"
          {...register("derection")}
        />
      </div>

      {/* Inspection */}
      <div>
        <label className="block mb-2 font-medium">
          inspection
        </label>
        <Input
          placeholder="saisir l'inspection"
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

      {/* CASNOS */}
      <div>
        <label className="block mb-2 font-medium">
          CASNOS_N
        </label>
        <Input
          placeholder="CASNOS_N"
          {...register("casnos_n")}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          CASNOS_PASSWORD
        </label>
        <Input
          type="password"
          placeholder="CASNOS_PASSWORD"
          {...register("casnos_password")}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          CASNOS_LIEU
        </label>
        <Input
          placeholder=""
          {...register("casnos_lieu")}
        />
      </div>

      {/* CNAS */}
      <div>
        <label className="block mb-2 font-medium">
          CNAS_N
        </label>
        <Input
          placeholder="CNAS_N"
          {...register("cnas_n")}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          CNAS_PASSWORD
        </label>
        <Input
          type="password"
          placeholder="CNAS_PASSWORD"
          {...register("cnas_password")}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          CNAS_LIEU
        </label>
        <Input
          placeholder="CNAS_LIEU"
          {...register("cnas_lieu")}
        />
      </div>

      {/* CACOBATPH */}
      <div>
        <label className="block mb-2 font-medium">
          CACOBATPH_N
        </label>
        <Input
          placeholder="CACOBATPH_N"
          {...register("cacobathph_n")}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          CACOBATPH_PASSWORD
        </label>
        <Input
          type="password"
          placeholder="CACOBATPH_PASSWORD"
          {...register("cacobathph_password")}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          CACOBATPH_LIEU
        </label>
        <Input
          placeholder="CACOBATPH_LIEU"
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
    <label>ACTIVE</label>
  </div>

  {/* زر الحفظ */}
  <div className="flex justify-end gap-3 pt-4">
    <Button type="submit">
      enregistrer
    </Button>
  </div>
</form>
  );
}