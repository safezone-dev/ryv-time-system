"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardCharts({
  userData,
  clientData,
}: any) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* USERS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Horas por colaborador
        </h2>

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={userData}
            >
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CLIENTS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Horas por cliente
        </h2>

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={clientData}
                dataKey="hours"
                nameKey="name"
                outerRadius={120}
                label
              >
                {clientData.map(
                  (
                    _: any,
                    index: number
                  ) => (
                    <Cell
                      key={index}
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}