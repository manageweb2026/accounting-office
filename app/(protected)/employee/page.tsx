export default function AdminPage() {
  return (
    

 
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 p-8 md:p-12 text-white shadow-xl">

          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 right-40 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 3c-2.755 0-5.293.93-7.322 2.493A11.953 11.953 0 003 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-2.21-.717-4.253-1.932-5.908"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">
              Espace Agent
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
              Bienvenue dans votre espace de travail.
              Consultez les tâches qui vous sont confiées,
              organisez vos activités et assurez le traitement
              des dossiers clients dans les délais impartis.
            </p>

            <div className="mt-8 flex items-center gap-2 text-sm text-blue-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Espace de travail et de suivi des tâches
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">
              Mes tâches
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Consultez les tâches qui vous sont attribuées et prenez en charge vos nouvelles missions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">
              Suivi des travaux
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Organisez votre travail et mettez à jour l'état d'avancement de vos tâches.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">
              Rapports et résultats
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Signalez les tâches terminées et assurez le suivi de vos réalisations.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

 
