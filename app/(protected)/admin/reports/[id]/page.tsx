"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReportData {
  employee: {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    image?: string;
    role?: string;
    niveau?: string;
    isActive?: boolean;
  };

  summary: {
    newTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    profit: number;
  };

  tasks: any[];
}

export default function EmployeeReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // ==========================================
  // Charger le rapport
  // ==========================================

  useEffect(() => {
    async function loadReport() {
      try {
        const { id } = await params;

        const res = await fetch(
          `/api/users/reports/${id}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await res.json();

        console.log("Employee Report:", result);

        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error(
          "Erreur chargement rapport:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [params]);

  // ==========================================
  // Convertir une date en YYYY-MM
  // ==========================================

  const getMonthFromDate = (date: string | Date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  // ==========================================
  // Travaux terminés du mois choisi
  // ==========================================

  const monthlyTasks = useMemo(() => {
    if (!data) return [];

    return data.tasks.filter((task) => {
      if (task.status !== "terminee") {
        return false;
      }

      if (!task.completedAt) {
        return false;
      }

      return (
        getMonthFromDate(task.completedAt) ===
        selectedMonth
      );
    });
  }, [data, selectedMonth]);

  // ==========================================
  // Total honoraire du mois
  // ==========================================

  const monthlyProfit = useMemo(() => {
    return monthlyTasks.reduce(
      (total, task) =>
        total +
        (Number(task.employeePrice) || 0),
      0
    );
  }, [monthlyTasks]);

  // ==========================================
  // Nom du mois
  // ==========================================

  const monthLabel = useMemo(() => {
    if (!selectedMonth) return "";

    const [year, month] =
      selectedMonth.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      1
    );

    return date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  }, [selectedMonth]);

  // ==========================================
  // Date
  // ==========================================

  const formatDate = (date: any) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "fr-FR"
    );
  };

  // ==========================================
  // Client
  // ==========================================

  const getClientName = (task: any) => {
    if (!task.client) return "-";

    return `${task.client.firstName || ""} ${
      task.client.lastName || ""
    }`.trim();
  };

  // ==========================================
  // Détails
  // ==========================================

  const handleDetails = (task: any) => {
    setSelectedTask(task);
    setOpen(true);
  };

  // ==========================================
  // Impression
  // ==========================================

 

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">
        Chargement...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        Employé introuvable.
      </div>
    );
  }

  const handlePrint = () => {
  const report = document.getElementById("print-report");

  if (!report) {
    console.error("Rapport introuvable");
    return;
  }

  const printWindow = window.open(
    "",
    "_blank",
    "width=1000,height=800"
  );

  if (!printWindow) {
    alert(
      "Impossible d'ouvrir la fenêtre d'impression. Veuillez autoriser les fenêtres pop-up."
    );
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />

        <title>
          Rapport mensuel - ${data.employee.name}
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 30px;
            font-family: Arial, Helvetica, sans-serif;
            background: white;
            color: black;
          }

          .print-container {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }

          th,
          td {
            border: 1px solid black;
            padding: 8px;
          }

          th {
            background: #f3f3f3;
            font-weight: bold;
          }

          .text-center {
            text-align: center;
          }

          .text-right {
            text-align: right;
          }

          .text-left {
            text-align: left;
          }

          .font-bold {
            font-weight: bold;
          }

          .text-lg {
            font-size: 18px;
          }

          .text-xl {
            font-size: 22px;
          }

          .text-2xl {
            font-size: 26px;
          }

          .text-3xl {
            font-size: 32px;
          }

          .border {
            border: 1px solid black;
          }

          .border-b {
            border-bottom: 1px solid black;
          }

          .border-b-2 {
            border-bottom: 2px solid black;
          }

          .rounded-lg {
            border-radius: 8px;
          }

          .p-5 {
            padding: 20px;
          }

          .mb-6 {
            margin-bottom: 24px;
          }

          .mb-7 {
            margin-bottom: 28px;
          }

          .mt-2 {
            margin-top: 8px;
          }

          .mt-3 {
            margin-top: 12px;
          }

          .mt-4 {
            margin-top: 16px;
          }

          .mt-12 {
            margin-top: 48px;
          }

          .mt-20 {
            margin-top: 80px;
          }

          .pb-5 {
            padding-bottom: 20px;
          }

          .pt-2 {
            padding-top: 8px;
          }

          .grid {
            display: grid;
          }

          .grid-cols-2 {
            grid-template-columns: 1fr 1fr;
          }

          .gap-3 {
            gap: 12px;
          }

          .gap-4 {
            gap: 16px;
          }

          .gap-5 {
            gap: 20px;
          }

          .gap-20 {
            gap: 80px;
          }

          @page {
            size: A4;
            margin: 12mm;
          }

          @media print {

            body {
              padding: 0;
            }

            .print-container {
              max-width: none;
            }

            tr {
              page-break-inside: avoid;
            }

            thead {
              display: table-header-group;
            }

          }

        </style>
      </head>

      <body>

        <div class="print-container">
          ${report.innerHTML}
        </div>

        <script>

          window.onload = function () {
            window.focus();
            window.print();
          };

          window.onafterprint = function () {
            window.close();
          };

        </script>

      </body>
    </html>
  `);

  printWindow.document.close();
};

  return (
    <>
      {/* =====================================================
          PAGE NORMALE
      ===================================================== */}

      <div className="p-8 print:hidden">

        {/* ==========================================
            TITRE
        ========================================== */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Rapport des travaux réalisés par
            l'employé
          </h1>

         

        </div>


        {/* =================================================
            FORMULAIRE DU RAPPORT
        ================================================= */}

        <div className="max-w-6xl mx-auto">

          <div className="bg-white border rounded-xl shadow-sm">

            {/* ==========================================
                HEADER FORMULAIRE
            ========================================== */}


            {/* ==========================================
                INFORMATIONS EMPLOYÉ
            ========================================== */}

            <div className="p-6">

              <h3 className="text-lg font-bold mb-5">
                Informations de l'agent
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Nom de l'employé
                  </label>

                  <div className="border rounded-lg p-3 bg-gray-50">
                    {data.employee.name}
                  </div>

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Téléphone
                  </label>

                  <div className="border rounded-lg p-3 bg-gray-50">
                    {data.employee.phone || "-"}
                  </div>

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Email
                  </label>

                  <div className="border rounded-lg p-3 bg-gray-50">
                    {data.employee.email || "-"}
                  </div>

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Adresse
                  </label>

                  <div className="border rounded-lg p-3 bg-gray-50">
                    {data.employee.address || "-"}
                  </div>

                </div>

              </div>

            </div>


            {/* ==========================================
                CHOIX DU MOIS
            ========================================== */}

            <div className="border-t p-6">

              <h3 className="text-lg font-bold mb-5">
                Période du rapport
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Choisir le mois
                  </label>

                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) =>
                      setSelectedMonth(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg px-4 py-3"
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Mois sélectionné
                  </label>

                  <div className="border rounded-lg p-3 bg-gray-50 capitalize">
                    {monthLabel}
                  </div>

                </div>

              </div>

            </div>


            {/* ==========================================
                RÉSUMÉ
            ========================================== */}

            <div className="border-t p-6">

              <h3 className="text-lg font-bold mb-5">
                Résumé du rapport
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="border rounded-lg p-5">

                  <p className="text-gray-500">
                    Travaux réalisés
                  </p>

                  <p className="text-3xl font-bold mt-2">
                    {monthlyTasks.length}
                  </p>

                </div>


                <div className="border rounded-lg p-5">

                  <p className="text-gray-500">
                    Total honoraire agent
                  </p>

                  <p className="text-3xl font-bold mt-2">
                    {monthlyProfit.toLocaleString(
                      "fr-FR"
                    )}{" "}
                    DA
                  </p>

                </div>

              </div>

            </div>


            {/* ==========================================
                TRAVAUX RÉALISÉS
            ========================================== */}

            <div className="border-t p-6">

              <div className="flex justify-between items-center mb-5">

                <div>

                  <h3 className="text-lg font-bold">
                    Travaux réalisés
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Travaux terminés pendant{" "}
                    <span className="font-semibold capitalize">
                      {monthLabel}
                    </span>
                  </p>

                </div>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                  <thead>

                    <tr className="bg-gray-100">

                      <th className="border p-3 text-left">
                        N°
                      </th>

                      <th className="border p-3 text-left">
                        Client
                      </th>

                      <th className="border p-3 text-left">
                        Service
                      </th>

                      <th className="border p-3 text-left">
                        Date d'achèvement
                      </th>

                      <th className="border p-3 text-center">
                        Prix client
                      </th>

                      <th className="border p-3 text-center">
                        Honoraire agent
                      </th>

                      <th className="border p-3 text-center">
                        Détails
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {monthlyTasks.length === 0 ? (

                      <tr>

                        <td
                          colSpan={7}
                          className="border p-8 text-center text-gray-500"
                        >
                          Aucun travail terminé
                          pendant ce mois.
                        </td>

                      </tr>

                    ) : (

                      monthlyTasks.map(
                        (task, index) => (

                          <tr
                            key={task._id}
                            className="hover:bg-gray-50"
                          >

                            <td className="border p-3">
                              {index + 1}
                            </td>

                            <td className="border p-3">
                              {getClientName(task)}
                            </td>

                            <td className="border p-3">
                              {task.service?.name ||
                                "-"}
                            </td>

                            <td className="border p-3">
                              {formatDate(
                                task.completedAt
                              )}
                            </td>

                            <td className="border p-3 text-center">
                              {Number(
                                task.clientPrice || 0
                              ).toLocaleString(
                                "fr-FR"
                              )}{" "}
                              DA
                            </td>

                            <td className="border p-3 text-center font-semibold">
                              {Number(
                                task.employeePrice ||
                                  0
                              ).toLocaleString(
                                "fr-FR"
                              )}{" "}
                              DA
                            </td>

                            <td className="border p-3 text-center">

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDetails(
                                    task
                                  )
                                }
                              >
                                Détails
                              </Button>

                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>


                  {monthlyTasks.length > 0 && (

                    <tfoot>

                      <tr>

                        <td
                          colSpan={5}
                          className="border p-4 text-right font-bold"
                        >
                          TOTAL HONORAIRE
                        </td>

                        <td
                          colSpan={2}
                          className="border p-4 text-center font-bold"
                        >
                          {monthlyProfit.toLocaleString(
                            "fr-FR"
                          )}{" "}
                          DA
                        </td>

                      </tr>

                    </tfoot>

                  )}

                </table>

              </div>

            </div>


            {/* ==========================================
                BOUTON IMPRIMER
            ========================================== */}

            <div className="border-t p-6 flex justify-end">

             <Button
  onClick={() => setPrintPreviewOpen(true)}
  className="px-8"
>
  🖨 Imprimer le rapport
</Button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FORMULAIRE QUI SERA IMPRIMÉ
      ===================================================== */}

      <div
        id="print-report"
        className="hidden print:block"
      >

        <div className="p-8">

          {/* En-tête */}

          <div className="text-center border-b-2 border-black pb-5 mb-7">

            <h1 className="text-3xl font-bold">
             COMPTABLE
            </h1>

            <h2 className="text-2xl font-bold mt-3">
              RAPPORT DE L'AGENT
            </h2>

            <p className="text-lg mt-2 capitalize">
              {monthLabel}
            </p>

          </div>


          {/* Informations */}

          <div className="border border-black rounded-lg p-5 mb-6">

            <h2 className="text-lg font-bold mb-4">
              Informations de l'employé
            </h2>

            <div className="grid grid-cols-2 gap-3">

              <p>
                <strong>Nom :</strong>{" "}
                {data.employee.name}
              </p>

              <p>
                <strong>Téléphone :</strong>{" "}
                {data.employee.phone || "-"}
              </p>

              <p>
                <strong>Email :</strong>{" "}
                {data.employee.email || "-"}
              </p>

              <p>
                <strong>Adresse :</strong>{" "}
                {data.employee.address || "-"}
              </p>

            </div>

          </div>


          {/* Résumé */}

          <div className="border border-black rounded-lg p-5 mb-6">

            <div className="grid grid-cols-2 gap-5">

              <div>

                <p>
                  Nombre de travaux réalisés
                </p>

                <p className="text-xl font-bold">
                  {monthlyTasks.length}
                </p>

              </div>

              <div>

                <p>
                  Total honoraire agent
                </p>

                <p className="text-xl font-bold">
                  {monthlyProfit.toLocaleString(
                    "fr-FR"
                  )}{" "}
                  DA
                </p>

              </div>

            </div>

          </div>


          {/* Travaux */}

          <h2 className="text-xl font-bold mb-4">
            Liste des travaux réalisés
          </h2>


          {monthlyTasks.length === 0 ? (

            <div className="border border-black p-5 text-center">
              Aucun travail terminé pendant ce mois.
            </div>

          ) : (

            <table className="w-full border-collapse">

              <thead>

                <tr>

                  <th className="border border-black p-2">
                    N°
                  </th>

                  <th className="border border-black p-2 text-left">
                    Client
                  </th>

                  <th className="border border-black p-2 text-left">
                    Service
                  </th>

                  <th className="border border-black p-2">
                    Date
                  </th>

                  <th className="border border-black p-2">
                    Prix client
                  </th>

                  <th className="border border-black p-2">
                    Honoraire agent
                  </th>

                </tr>

              </thead>


              <tbody>

                {monthlyTasks.map(
                  (task, index) => (

                    <tr key={task._id}>

                      <td className="border border-black p-2 text-center">
                        {index + 1}
                      </td>

                      <td className="border border-black p-2">
                        {getClientName(task)}
                      </td>

                      <td className="border border-black p-2">
                        {task.service?.name ||
                          "-"}
                      </td>

                      <td className="border border-black p-2 text-center">
                        {formatDate(
                          task.completedAt
                        )}
                      </td>

                      <td className="border border-black p-2 text-right">
                        {Number(
                          task.clientPrice || 0
                        ).toLocaleString(
                          "fr-FR"
                        )}{" "}
                        DA
                      </td>

                      <td className="border border-black p-2 text-right">
                        {Number(
                          task.employeePrice ||
                            0
                        ).toLocaleString(
                          "fr-FR"
                        )}{" "}
                        DA
                      </td>

                    </tr>

                  )
                )}

              </tbody>


              <tfoot>

                <tr>

                  <td
                    colSpan={5}
                    className="border border-black p-3 text-right font-bold"
                  >
                    TOTAL HONORAIRE AGENT
                  </td>

                  <td className="border border-black p-3 text-right font-bold">
                    {monthlyProfit.toLocaleString(
                      "fr-FR"
                    )}{" "}
                    DA
                  </td>

                </tr>

              </tfoot>

            </table>

          )}


          {/* توقيع */}

          <div className="grid grid-cols-2 gap-20 mt-20">

            <div className="text-center">

              <p className="font-bold">
                Gerant
              </p>

              <div className="mt-12 border-t border-black pt-2">
                Signature
              </div>

            </div>


            <div className="text-center">

              <p className="font-bold">
                Agent
              </p>

              <div className="mt-12 border-t border-black pt-2">
                Signature
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          MODAL DÉTAILS
      ===================================================== */}


      <Dialog
  open={printPreviewOpen}
  onOpenChange={setPrintPreviewOpen}
>
<DialogContent
  className="
    !w-[91vw]
    !max-w-[1000px]
    !h-[95vh]
    !max-h-[95vh]
    overflow-y-auto
  "
>
    {/* ===============================
        APERÇU DU RAPPORT
    =============================== */}

    <div
      id="print-report"
      className="bg-white p-8"
    >

      {/* Header */}

      <div className="text-center border-b-2 border-black pb-5 mb-7">

        <h1 className="text-3xl font-bold">
           COMPTABLE
        </h1>

        <h2 className="text-2xl font-bold mt-3">
          RAPPORT DE L'AGENT
        </h2>

        <p className="text-lg mt-2 capitalize">
          {monthLabel}
        </p>

      </div>


      {/* Informations employé */}

      <div className="border border-black rounded-lg p-5 mb-6">

        <h2 className="text-lg font-bold mb-4">
          Informations de l'agent
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <p>
            <strong>Nom :</strong>{" "}
            {data.employee.name}
          </p>

          <p>
            <strong>Téléphone :</strong>{" "}
            {data.employee.phone || "-"}
          </p>

          <p>
            <strong>Email :</strong>{" "}
            {data.employee.email || "-"}
          </p>

          <p>
            <strong>Adresse :</strong>{" "}
            {data.employee.address || "-"}
          </p>

        </div>

      </div>


      {/* Résumé */}

      <div className="border border-black rounded-lg p-5 mb-6">

      
        <div className="grid grid-cols-2 gap-5">

          <div>
            <p className="text-gray-600">
              Travaux réalisés
            </p>

            <p className="text-2xl font-bold">
              {monthlyTasks.length}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              Total honoraire agent
            </p>

            <p className="text-2xl font-bold">
              {monthlyProfit.toLocaleString("fr-FR")} DA
            </p>
          </div>

        </div>

      </div>


      {/* Liste des travaux */}

      <h2 className="text-xl font-bold mb-4">
        Travaux réalisés
      </h2>

      {monthlyTasks.length === 0 ? (

        <div className="border border-black p-5 text-center">
          Aucun travail terminé pendant ce mois.
        </div>

      ) : (

        <table className="w-full border-collapse">

          <thead>

            <tr>

              <th className="border border-black p-2">
                N°
              </th>

              <th className="border border-black p-2 text-left">
                Client
              </th>

              <th className="border border-black p-2 text-left">
                Service
              </th>

              <th className="border border-black p-2">
                Date
              </th>

              <th className="border border-black p-2">
                Prix client
              </th>

              <th className="border border-black p-2">
                Honoraire agent
              </th>

            </tr>

          </thead>

          <tbody>

            {monthlyTasks.map((task, index) => (

              <tr key={task._id}>

                <td className="border border-black p-2 text-center">
                  {index + 1}
                </td>

                <td className="border border-black p-2">
                  {getClientName(task)}
                </td>

                <td className="border border-black p-2">
                  {task.service?.name || "-"}
                </td>

                <td className="border border-black p-2 text-center">
                  {formatDate(task.completedAt)}
                </td>

                <td className="border border-black p-2 text-right">
                  {Number(
                    task.clientPrice || 0
                  ).toLocaleString("fr-FR")}{" "}
                  DA
                </td>

                <td className="border border-black p-2 text-right">
                  {Number(
                    task.employeePrice || 0
                  ).toLocaleString("fr-FR")}{" "}
                  DA
                </td>

              </tr>

            ))}

          </tbody>

          <tfoot>

            <tr>

              <td
                colSpan={5}
                className="border border-black p-3 text-right font-bold"
              >
                TOTAL HONORAIRE EMPLOYÉ
              </td>

              <td className="border border-black p-3 text-right font-bold">
                {monthlyProfit.toLocaleString("fr-FR")} DA
              </td>

            </tr>

          </tfoot>

        </table>

      )}


      {/* Signatures */}

      <div className="grid grid-cols-2 gap-20 mt-20">

        <div className="text-center">

          <p className="font-bold">
            Gerant
          </p>

          <div className="mt-12 border-t border-black pt-2">
            Signature
          </div>

        </div>

        <div className="text-center">

          <p className="font-bold">
           Agent
          </p>

          <div className="mt-12 border-t border-black pt-2">
            Signature
          </div>

        </div>

      </div>

    </div>


    {/* ===============================
        BOUTONS DU DIALOG
    =============================== */}

    <div className="flex justify-end gap-3 pt-4 border-t print:hidden">

      <Button
        variant="outline"
        onClick={() => setPrintPreviewOpen(false)}
      >
        Fermer
      </Button>

    <Button onClick={handlePrint}>
  🖨 Imprimer
</Button>

    </div>

  </DialogContent>
</Dialog>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >

<DialogContent className="w-[98vw] max-w-[1600px] max-h-[95vh] overflow-y-auto">
        
          {selectedTask && (

            <div className="p-6 space-y-6">

              <div className="text-center border-b pb-5">

                <h1 className="text-2xl font-bold">
                  Détails du travail
                </h1>

              </div>


              <section>

                <h2 className="text-lg font-bold border-b pb-2 mb-4">
                  Client
                </h2>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <strong>Nom :</strong>{" "}
                    {getClientName(
                      selectedTask
                    )}
                  </div>

                  <div>
                    <strong>Téléphone :</strong>{" "}
                    {selectedTask.client
                      ?.contact || "-"}
                  </div>

                  <div>
                    <strong>Adresse :</strong>{" "}
                    {selectedTask.client
                      ?.address || "-"}
                  </div>

                </div>

              </section>


              <section>

                <h2 className="text-lg font-bold border-b pb-2 mb-4">
                  Travail effectué
                </h2>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <strong>Service :</strong>{" "}
                    {selectedTask.service
                      ?.name || "-"}
                  </div>

                  <div>
                    <strong>Statut :</strong>{" "}
                    {selectedTask.status}
                  </div>

                  <div>
                    <strong>Date
                    d'achèvement :</strong>{" "}
                    {formatDate(
                      selectedTask.completedAt
                    )}
                  </div>

                  <div>
                    <strong>Date limite :</strong>{" "}
                    {formatDate(
                      selectedTask.dueDate
                    )}
                  </div>

                </div>

              </section>


              <section>

                <h2 className="text-lg font-bold border-b pb-2 mb-4">
                  Informations financières
                </h2>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <strong>
                      Prix client :
                    </strong>{" "}
                    {Number(
                      selectedTask.clientPrice ||
                        0
                    ).toLocaleString(
                      "fr-FR"
                    )}{" "}
                    DA
                  </div>

                  <div>
                    <strong>
                      Honoraire agent :
                    </strong>{" "}
                    {Number(
                      selectedTask.employeePrice ||
                        0
                    ).toLocaleString(
                      "fr-FR"
                    )}{" "}
                    DA
                  </div>

                </div>

              </section>


           

              <div className="flex justify-end">

                <Button
                  variant="outline"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  Fermer
                </Button>

              </div>

            </div>

          )}

        </DialogContent>

      </Dialog>


      {/* =====================================================
          STYLE IMPRESSION
      ===================================================== */}

      <style jsx global>{`

        @media print {

          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
          }

          #print-report {
            display: block !important;
            width: 100%;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead {
            display: table-header-group;
          }

          tr {
            page-break-inside: avoid;
          }

        }

      `}</style>
    </>
  );
}