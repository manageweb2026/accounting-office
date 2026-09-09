export default function AdminPage() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        لوحة تحكم المدير
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            الموظفون
          </h2>

          <p className="text-3xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            العملاء
          </h2>

          <p className="text-3xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            الأعمال
          </h2>

          <p className="text-3xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">
            التقارير
          </h2>

          <p className="text-3xl font-bold mt-3">
            0
          </p>
        </div>

      </div>

    </div>
  );
}