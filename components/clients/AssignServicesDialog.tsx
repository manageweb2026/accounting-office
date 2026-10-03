
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Service = {
  _id: string;
  name: string;
  description?: string;
  direction?: string;

  date_recurent?: string;
  date_limite?: string;

  Prix_Traitement_chifré: number;
  Prix_Traitement_néant: number;

  Prix_secretaireC: number;
  Prix_secretaireN: number;

  Prix_service_Agent: number;
  Prix_Agent: number;

  isRecurring: boolean;
  recurrence?: string;
  isActive: boolean;
};

type PaymentMethod = {
  _id: string;
  name: string;
};

type Props = {
  client: any;
  onSuccess?: () => void;
};

export default function AssignServicesDialog({
  client,
  onSuccess,
}: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethod[]
  >([]);

  const [selectedServices, setSelectedServices] =
    useState<string[]>([]);

  const [assignedDates, setAssignedDates] =
    useState<Record<string, string>>({});

  const [selectedPaymentMethods, setSelectedPaymentMethods] =
    useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);

  // ========================================
  // جلب الخدمات
  // ========================================

  useEffect(() => {
    loadServices();
    loadPaymentMethods();
  }, []);

  async function loadServices() {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();

      if (data.success) {
        setServices(data.services);
      } else {
        toast.error("Impossible de charger les services");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des services");
    }
  }

  // ========================================
  // جلب طرق الدفع
  // ========================================

  async function loadPaymentMethods() {
    try {
      const res = await fetch("/api/modep");
      const data = await res.json();

      if (data.success) {
        setPaymentMethods(
          data.paymentMethods || data.modeps || []
        );
      } else {
        toast.error(
          "Impossible de charger les modes de paiement"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Erreur lors du chargement des modes de paiement"
      );
    }
  }

  // ========================================
  // اختيار الخدمة
  // ========================================

  function toggleService(id: string) {
    setSelectedServices((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id);
      }

      return [...prev, id];
    });
  }

  // ========================================
  // التاريخ
  // ========================================

  function changeDate(
    serviceId: string,
    value: string
  ) {
    setAssignedDates((prev) => ({
      ...prev,
      [serviceId]: value,
    }));
  }

  // ========================================
  // طريقة الدفع
  // ========================================

  function changePaymentMethod(
    serviceId: string,
    value: string
  ) {
    setSelectedPaymentMethods((prev) => ({
      ...prev,
      [serviceId]: value,
    }));
  }

  // ========================================
  // حفظ خدمات الزبون
  // ========================================

  async function saveServices() {
    if (selectedServices.length === 0) {
      toast.error("Choisissez au moins un service");
      return;
    }

    // التأكد من وجود التاريخ وطريقة الدفع
    for (const serviceId of selectedServices) {
      const service = services.find(
        (s) => s._id === serviceId
      );

      if (!assignedDates[serviceId]) {
        toast.error(
          `Veuillez sélectionner une date pour "${service?.name}"`
        );
        return;
      }

      if (!selectedPaymentMethods[serviceId]) {
        toast.error(
          `Veuillez sélectionner un mode de paiement pour "${service?.name}"`
        );
        return;
      }
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/clients/${client._id}/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            services: selectedServices,
            assignedDates,
            paymentMethods:
              selectedPaymentMethods,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(
          data.message ||
            "Erreur lors de l'enregistrement"
        );
        return;
      }

      toast.success(
        "Le service a été enregistré avec succès"
      );

      onSuccess?.();

    } catch (error) {
      console.error(
        "Erreur sauvegarde service:",
        error
      );

      toast.error("Erreur serveur");

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* ========================================
          CLIENT
      ======================================== */}

      <div className="border rounded-lg p-4 bg-gray-50">

        <h2 className="text-xl font-bold">
          {client.firstName} {client.lastName}
        </h2>

        <p className="text-gray-500">
          Choisissez les services demandés
        </p>

      </div>

      {/* ========================================
          SERVICES
      ======================================== */}

      <div className="space-y-4">

        {services
          .filter(
            (service) => service.isActive
          )
          .map((service) => {

            const selected =
              selectedServices.includes(
                service._id
              );

            return (
              <div
                key={service._id}
                className={`
                  rounded-lg
                  border
                  p-4
                  transition
                  ${
                    selected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }
                `}
              >

                {/* Service */}

                <div
                  onClick={() =>
                    toggleService(service._id)
                  }
                  className="cursor-pointer"
                >

                  <div className="font-bold text-lg">
                    {service.name}
                  </div>

                  {service.description && (
                    <div className="text-sm text-gray-500">
                      {service.description}
                    </div>
                  )}

                  {service.direction && (
                    <div className="text-sm text-gray-500">
                      Direction :{" "}
                      {service.direction}
                    </div>
                  )}

                  <div className="text-sm mt-1">
                    {service.isRecurring
                      ? `Récurrent - ${
                          service.recurrence || ""
                        }`
                      : "Ponctuel"}
                  </div>

                </div>

                {/* ========================================
                    تفاصيل الخدمة
                ======================================== */}

                {selected && (
                  <div className="mt-4 pt-4 border-t space-y-4">

                    {/* التاريخ */}

                    <div>

                      <label className="block text-sm font-medium mb-1">
                        Date
                      </label>

                      <input
                        type="date"
                        value={
                          assignedDates[
                            service._id
                          ] || ""
                        }
                        onChange={(e) =>
                          changeDate(
                            service._id,
                            e.target.value
                          )
                        }
                        className="w-full border rounded-md px-3 py-2"
                      />

                    </div>

                    {/* طريقة الدفع */}

                    <div>

                      <label className="block text-sm font-medium mb-1">
                        Mode de paiement
                      </label>

                      <select
                        value={
                          selectedPaymentMethods[
                            service._id
                          ] || ""
                        }
                        onChange={(e) =>
                          changePaymentMethod(
                            service._id,
                            e.target.value
                          )
                        }
                        className="w-full border rounded-md px-3 py-2"
                      >

                        <option value="">
                          Choisir un mode de paiement
                        </option>

                        {paymentMethods.map(
                          (method) => (
                            <option
                              key={method._id}
                              value={method._id}
                            >
                              {method.name}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                  </div>
                )}

              </div>
            );
          })}

      </div>

      {/* ========================================
          BUTTON
      ======================================== */}

      <div className="flex justify-end">

        <Button
          onClick={saveServices}
          disabled={loading}
        >
          {loading
            ? "Enregistrement..."
            : "Enregistrer"}
        </Button>

      </div>

    </div>
  );
}
