export default function SecretaryPage() {

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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0M19 8v6m3-3h-6"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Espace Secrétariat
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
            Bienvenue dans votre espace de travail.
            Gérez les clients, les services et assurez le suivi
            des tâches du cabinet comptable en toute simplicité.
          </p>

          <div className="mt-8 flex items-center gap-2 text-sm text-blue-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Espace de gestion et de suivi
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">
            Gestion des clients
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Consultez et gérez les informations de vos clients.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">
            Gestion des services
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Organisez les services et les prestations du cabinet.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">
            Suivi des tâches
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Suivez les tâches et leur transmission aux employés.
          </p>
        </div>
      </div>

    </div>
  </div>
);

}