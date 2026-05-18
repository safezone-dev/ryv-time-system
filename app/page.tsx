export default function DashboardPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Bienvenido al sistema de control de tiempos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">
            Horas Hoy
          </h2>

          <p className="text-4xl font-bold mt-4 text-green-600">
            0h
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">
            Horas Mes
          </h2>

          <p className="text-4xl font-bold mt-4 text-blue-600">
            0h
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">
            Clientes Activos
          </h2>

          <p className="text-4xl font-bold mt-4 text-red-500">
            0
          </p>
        </div>
      </div>
    </div>
  );
}