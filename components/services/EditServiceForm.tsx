"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  serviceSchema,
  ServiceFormData,
} from "@/lib/validations/service";

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

type EditServiceFormProps = {
  service: any;
  onSuccess?: () => void;
};


export default function EditServiceForm({
  service,
  onSuccess,
}: EditServiceFormProps) {

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),

 defaultValues: {
  name: "",
  description: "",

  direction: "",
  date_recurent: "",
  date_limite: "",

  Prix_Traitement_chifré: 0,
  Prix_Traitement_néant: 0,

  Prix_secretaireC: 0,
  Prix_secretaireN: 0,

  Prix_service_Agent: 0,
  Prix_Agent: 0,

  isActive: true,
  isRecurring: false,

  recurrence: null,
},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const isRecurring = form.watch("isRecurring");


  useEffect(() => {
      if (service) {
     form.reset({
  name: service.name,

  description: service.description || "",

  direction: service.direction || "",

  date_recurent: service.date_recurent || "",

  date_limite: service.date_limite || "",

  Prix_Traitement_chifré: service.Prix_Traitement_chifré ?? 0,

  Prix_Traitement_néant: service.Prix_Traitement_néant ?? 0,

  Prix_secretaireC: service.Prix_secretaireC ?? 0,

  Prix_secretaireN: service.Prix_secretaireN ?? 0,

  Prix_service_Agent: service.Prix_service_Agent ?? 0,

  Prix_Agent: service.Prix_Agent ?? 0,

  isActive: service.isActive ?? true,

  isRecurring: service.isRecurring ?? false,

  recurrence: service.recurrence ?? null,
});
      }
    }, [service, form]);

  async function onSubmit(data: ServiceFormData) {
    try {
      const res = await fetch(`/api/services/${service._id}`, {
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

     toast.success("la modification du service a ete faite avec succes");

      onSuccess?.();

    } catch (error) {
      console.error(error);
      toast.error("la modification du service a echoue");
    }
  }
  return (
    <form
  onSubmit={handleSubmit(onSubmit)}
  className="flex flex-col space-y-4"
>
  {/* منطقة الحقول القابلة للتمرير */}
  <div className="max-h-[70vh] overflow-y-auto pr-3">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Nom de service */}
      <div>
        <label className="block mb-2 font-medium">
          Nom de service
        </label>

        <Input
          placeholder="..."
          {...register("name")}
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-medium">
          Description de service
        </label>

        <Input
          placeholder="..."
          {...register("description")}
        />
      </div>

      {/* Direction */}
      <div>
        <label className="block mb-2 font-medium">
          Direction
        </label>

        <Input
          placeholder="..."
          {...register("direction")}
        />
      </div>

      {/* Date récurrente */}
      <div>
        <label className="block mb-2 font-medium">
          Date récurrente
        </label>

        <Input
          type="date"
          {...register("date_recurent")}
        />
      </div>

      {/* Date limite */}
      <div>
        <label className="block mb-2 font-medium">
          Date limite
        </label>

        <Input
          type="date"
          {...register("date_limite")}
        />
      </div>

      {/* Prix Traitement chiffré */}
      <div>
        <label className="block mb-2 font-medium">
          Prix Traitement chiffré (DA)
        </label>

        <Input
          type="number"
          {...register("Prix_Traitement_chifré", {
            valueAsNumber: true,
          })}
        />

        {errors.Prix_Traitement_chifré && (
          <p className="text-red-500 text-sm mt-1">
            {errors.Prix_Traitement_chifré.message}
          </p>
        )}
      </div>

      {/* Prix Traitement néant */}
      <div>
        <label className="block mb-2 font-medium">
          Prix Traitement néant (DA)
        </label>

        <Input
          type="number"
          {...register("Prix_Traitement_néant", {
            valueAsNumber: true,
          })}
        />

        {errors.Prix_Traitement_néant && (
          <p className="text-red-500 text-sm mt-1">
            {errors.Prix_Traitement_néant.message}
          </p>
        )}
      </div>

      {/* Prix secrétaire C */}
      <div>
        <label className="block mb-2 font-medium">
          Prix secrétaire C (DA)
        </label>

        <Input
          type="number"
          {...register("Prix_secretaireC", {
            valueAsNumber: true,
          })}
        />

        {errors.Prix_secretaireC && (
          <p className="text-red-500 text-sm mt-1">
            {errors.Prix_secretaireC.message}
          </p>
        )}
      </div>

      {/* Prix secrétaire N */}
      <div>
        <label className="block mb-2 font-medium">
          Prix secrétaire N (DA)
        </label>

        <Input
          type="number"
          {...register("Prix_secretaireN", {
            valueAsNumber: true,
          })}
        />

        {errors.Prix_secretaireN && (
          <p className="text-red-500 text-sm mt-1">
            {errors.Prix_secretaireN.message}
          </p>
        )}
      </div>

      {/* Prix service Agent */}
      <div>
        <label className="block mb-2 font-medium">
          Prix service Agent (DA)
        </label>

        <Input
          type="number"
          {...register("Prix_service_Agent", {
            valueAsNumber: true,
          })}
        />

        {errors.Prix_service_Agent && (
          <p className="text-red-500 text-sm mt-1">
            {errors.Prix_service_Agent.message}
          </p>
        )}
      </div>

      {/* Prix Agent */}
      <div>
        <label className="block mb-2 font-medium">
          Prix Agent (DA)
        </label>

        <Input
          type="number"
          {...register("Prix_Agent", {
            valueAsNumber: true,
          })}
        />

        {errors.Prix_Agent && (
          <p className="text-red-500 text-sm mt-1">
            {errors.Prix_Agent.message}
          </p>
        )}
      </div>

      {/* Service active */}
      <div className="flex items-center gap-3 md:col-span-2">
        <Checkbox
          checked={form.watch("isActive")}
          onCheckedChange={(checked) =>
            form.setValue("isActive", Boolean(checked))
          }
        />

        <label>Service active</label>
      </div>

      {/* Service récurrent */}
      <div className="flex items-center gap-3 md:col-span-2">
        <Checkbox
          checked={isRecurring}
          onCheckedChange={(checked) => {
            const value = Boolean(checked);

            form.setValue("isRecurring", value);

            if (!value) {
              form.setValue("recurrence", null);
            }
          }}
        />

        <label>Service récurrent</label>
      </div>

      {/* Type de récurrence */}
      {isRecurring && (
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Type de récurrence
          </label>

          <Select
            value={form.watch("recurrence") ?? ""}
            onValueChange={(value) =>
              form.setValue(
                "recurrence",
                value as
                  | "mensuel"
                  | "trimestriel"
                  | "semestriel"
                  | "annuel"
                  | "ponctuel"
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

              <SelectItem value="ponctuel">
                Ponctuel
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

    </div>
  </div>

  {/* زر الحفظ */}
  <div className="flex justify-end pt-4 border-t">
    <Button type="submit">
      enregistrer
    </Button>
  </div>
</form>
  );
}