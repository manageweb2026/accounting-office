"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
};

type Service = {
  _id: string;
  name: string;
  clientPrice: number;
  isRecurring: boolean;
  recurrence: string | null;
};

type PaymentMethod = {
  _id: string;
  name: string;
};

export default function ClientServicesDialog({
  open,
  onOpenChange,
  clientId,
}: Props) {
  const [services, setServices] = useState<Service[]>([]);

  const [selected, setSelected] = useState<string[]>([]);

  // تاريخ كل خدمة
  const [assignedDates, setAssignedDates] = useState<
    Record<string, string>
  >({});

  // طرق الدفع
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethod[]
  >([]);

  // طريقة الدفع لكل خدمة
  const [selectedPaymentMethods, setSelectedPaymentMethods] =
    useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;

    loadServices();
    loadPaymentMethods();
    loadClientServices();
  }, [open]);

  // ==============================
  // تحميل الخدمات
  // ==============================

  async function loadServices() {
    try {
      const res = await fetch("/api/services");

      const data = await res.json();

      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ==============================
  // تحميل طرق الدفع
  // ==============================

  async function loadPaymentMethods() {
    try {
      const res = await fetch(
        "/api/payment-methods?active=true"
      );

      const data = await res.json();

      if (data.success) {
        setPaymentMethods(data.paymentMethods);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ==============================
  // تغيير تاريخ الخدمة
  // ==============================

  function handleAssignedDateChange(
    serviceId: string,
    date: string
  ) {
    setAssignedDates((prev) => ({
      ...prev,
      [serviceId]: date,
    }));
  }

  // ==============================
  // تغيير طريقة الدفع
  // ==============================

  function handlePaymentMethodChange(
    serviceId: string,
    paymentMethodId: string
  ) {
    setSelectedPaymentMethods((prev) => ({
      ...prev,
      [serviceId]: paymentMethodId,
    }));
  }

  // ==============================
  // تحميل خدمات الزبون الموجودة
  // ==============================

 async function loadClientServices() {
  try {
    const res = await fetch(
      `/api/clients/${clientId}/services`
    );

    const data = await res.json();

    if (!data.success) return;

   setSelected(
  data.services
    .filter((item: any) => item.service?._id)
    .map((item: any) => item.service._id)
);

    // تحميل التواريخ الموجودة
    const dates: Record<string, string> = {};

    // تحميل طرق الدفع الموجودة
    const paymentMethodsData: Record<
      string,
      string
    > = {};

   data.services.forEach((item: any) => {
      if (!item.service?._id) return;

      const serviceId =
        item.service._id;

      // التاريخ
     if (item.datePayement) {
  const date = new Date(item.datePayement);

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  dates[serviceId] =
    `${year}-${month}-${day}`;
}

      // طريقة الدفع
      if (item.paymentMethod?._id) {
        paymentMethodsData[serviceId] =
          item.paymentMethod._id;
      }
    });

    setAssignedDates(dates);

    setSelectedPaymentMethods(
      paymentMethodsData
    );

  } catch (error) {
    console.error(
      "Erreur lors du chargement des services:",
      error
    );
  }
}

  // ==============================
  // اختيار / إلغاء الخدمة
  // ==============================

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  // ==============================
  // حفظ
  // ==============================

  async function save() {
    // التأكد من أن كل خدمة مختارة لديها تاريخ وطريقة دفع
    for (const serviceId of selected) {
      if (!assignedDates[serviceId]) {
        alert(
          "Veuillez sélectionner une date pour chaque service."
        );
        return;
      }

      if (!selectedPaymentMethods[serviceId]) {
        alert(
          "Veuillez sélectionner un mode de paiement pour chaque service."
        );
        return;
      }
    }

    try {
      const res = await fetch(
        `/api/clients/${clientId}/services`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            services: selected,

            assignedDates,

            paymentMethods: selectedPaymentMethods,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Erreur lors de l'enregistrement");
        return;
      }

      onOpenChange(false);

    } catch (error) {
      console.error(error);

      alert("Erreur lors de l'enregistrement");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            Services du client
          </DialogTitle>
        </DialogHeader>

        {/* ==============================
            قائمة الخدمات
        ============================== */}

        <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">

          {services.map((service) => {
            const isSelected =
              selected.includes(service._id);

            return (
              <div
                key={service._id}
                className={`
                  border rounded-lg p-3 transition
                  ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }
                `}
              >

                {/* ==============================
                    السطر الرئيسي
                ============================== */}

                <div
                  onClick={() =>
                    toggle(service._id)
                  }
                  className="flex items-center gap-3 cursor-pointer"
                >

                  {/* Checkbox */}

                  <div
                    className={`
                      w-5 h-5 rounded border
                      flex items-center justify-center
                      shrink-0
                      ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-400"
                      }
                    `}
                  >
                    {isSelected && (
                      <span className="text-sm font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* معلومات الخدمة */}

                  <div className="flex-1">

                    <div className="font-semibold">
                      {service.name}{" "}
                      {service.recurrence
                        ? `(${service.recurrence})`
                        : "(ponctuel)"}
                    </div>

                    <div className="text-sm text-gray-600">
                      {service.clientPrice} DA
                    </div>

                  </div>

                </div>

                {/* ==============================
                    معلومات إضافية عند الاختيار
                ============================== */}

                {isSelected && (
                  <div className="mt-4 ml-8 space-y-4">

                    {/* التاريخ */}

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date d&apos;affectation
                      </label>

                      <Input
                        type="date"
                        value={
                          assignedDates[service._id] || ""
                        }
                        onChange={(e) =>
                          handleAssignedDateChange(
                            service._id,
                            e.target.value
                          )
                        }
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
                          handlePaymentMethodChange(
                            service._id,
                            e.target.value
                          )
                        }
                        className="w-full border rounded-md px-3 py-2 bg-white"
                      >

                        <option value="">
                          Sélectionner un mode de paiement
                        </option>

                        {paymentMethods.map(
                          (paymentMethod) => (
                            <option
                              key={paymentMethod._id}
                              value={paymentMethod._id}
                            >
                              {paymentMethod.name}
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

        {/* ==============================
            زر الحفظ
        ============================== */}

        <div className="flex justify-end mt-4">

          <Button onClick={save}>
            Enregistrer
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}