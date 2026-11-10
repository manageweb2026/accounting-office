export default function Page() {
 

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
                  d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06-1.5 2.6-.08-.02a1.65 1.65 0 00-1.7.57l-.05.07h-3l-.05-.07a1.65 1.65 0 00-1.7-.57l-.08.02-1.5-2.6.06-.06A1.65 1.65 0 0010.5 15l-.08-.04v-3l.08-.04a1.65 1.65 0 00-.33-1.82l-.06-.06 1.5-2.6.08.02a1.65 1.65 0 001.7-.57l.05-.07h3l.05.07a1.65 1.65 0 001.7.57l.08-.02 1.5 2.6-.06.06A1.65 1.65 0 0019.4 12l.08.04v3l-.08-.04z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">
              Espace Gérant
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
              Bienvenue dans votre espace de gestion.
              Pilotez l'activité du cabinet comptable, supervisez
              les équipes, contrôlez les opérations et assurez
              le bon fonctionnement de l'ensemble des services.
            </p>

            <div className="mt-8 flex items-center gap-2 text-sm text-blue-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Espace de direction et de supervision
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">
              Gestion des utilisateurs
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Gérez les comptes, les rôles et les accès des membres du cabinet.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">
              Supervision des activités
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Suivez les opérations, les services et l'avancement des tâches.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">
              Contrôle et suivi
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Consultez les informations et assurez le suivi global du cabinet.
            </p>
          </div>
        </div>

      </div>
    </div>
  );

}