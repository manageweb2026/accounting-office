"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

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

export default function ClientServicesDialog({
  open,
  onOpenChange,
  clientId,
}: Props) {

  const [services, setServices] = useState<Service[]>([]);

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;

    loadServices();
    loadClientServices();

  }, [open]);

  async function loadServices() {

    const res = await fetch("/api/services");

    const data = await res.json();

    if (data.success) {
      setServices(data.services);
    }
  }

  async function loadClientServices() {

    const res = await fetch(
      `/api/clients/${clientId}/services`
    );

    const data = await res.json();

    if (!data.success) return;

    setSelected(
      data.tasks.map((t: any) => t.service._id)
    );
  }

  function toggle(id: string) {

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );

  }

  async function save() {

    await fetch(
      `/api/clients/${clientId}/services`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          services: selected,
        }),
      }
    );

    onOpenChange(false);

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

        <div className="grid grid-cols-2 gap-3">

          {services.map((service) => (

            <div
              key={service._id}
              onClick={() => toggle(service._id)}
              className={`
                border rounded-lg p-3 cursor-pointer

                ${
                  selected.includes(service._id)
                    ? "border-blue-600 bg-blue-50"
                    : ""
                }
              `}
            >

              <div className="font-semibold">

                {service.name}

              </div>

              <div className="text-sm">

                {service.clientPrice} DA

              </div>

            </div>

          ))}

        </div>

        <div className="flex justify-end">

          <Button onClick={save}>

            Enregistrer

          </Button>

        </div>

      </DialogContent>

    </Dialog>

  );

}