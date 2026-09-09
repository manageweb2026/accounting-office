"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Report = {
  newTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  profit: number;
};

export default function EmployeeReportPage() {

  const [report, setReport] = useState<Report | null>(null);
const router = useRouter();

  useEffect(() => {
    loadReport();
  }, []);


  async function loadReport() {

    const res = await fetch("/api/employee/report", {
      credentials: "include",
       cache: "no-store",
    });

    const data = await res.json();

    if (data.success) {
      setReport(data.report);
    }
  }


  if (!report) {
    return (
      <div className="p-6">
        Chargement...
      </div>
    );
  }


  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Mon rapport
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


        {/* nouvelles */}

        <div className="border rounded-xl p-5">

          <h2 className="font-semibold text-lg">
            Nouvelles tâches
          </h2>

          <p className="text-3xl font-bold mt-3">
            {report.newTasks}
          </p>

          <Button
  className="mt-4"
  onClick={() => router.push("/employee/report/nouvelle")}
>
  Voir détails
</Button>

        </div>



        {/* en cours */}

        <div className="border rounded-xl p-5">

          <h2 className="font-semibold text-lg">
            Tâches en cours
          </h2>

          <p className="text-3xl font-bold mt-3">
            {report.inProgressTasks}
          </p>

         <Button
  className="mt-4"
  onClick={() => router.push("/employee/report/en_cours")}
>
  Voir détails
</Button>
        </div>



        {/* terminées */}

        <div className="border rounded-xl p-5">

          <h2 className="font-semibold text-lg">
            Tâches terminées
          </h2>

          <p className="text-3xl font-bold mt-3">
            {report.completedTasks}
          </p>

         <Button
  className="mt-4"
  onClick={() => router.push("/employee/report/terminee")}
>
  Voir détails
</Button>

        </div>



        {/* bénéfice */}

        <div className="border rounded-xl p-5">

          <h2 className="font-semibold text-lg">
            Mes bénéfices
          </h2>

          <p className="text-3xl font-bold mt-3">
            {report.profit} DA
          </p>

        </div>


      </div>

    </div>

  );
}