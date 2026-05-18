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

const COLORS = [
  "#16a34a",
  "#2563eb",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
];

export default function DashboardCharts({
  userData,
  clientData,
}: any) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* USER HOURS */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          Horas por usuario
        </h2>

        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={userData}
            >
              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="hours"
                fill="#16a34a"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CLIENT HOURS */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          Horas por cliente
        </h2>

        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={clientData}
                dataKey="hours"
                nameKey="name"
                outerRadius={110}
                label
              >
                {clientData.map(
                  (
                    _: any,
                    index: number
                  ) => (
                    <Cell
                      key={
                        index
                      }
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
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