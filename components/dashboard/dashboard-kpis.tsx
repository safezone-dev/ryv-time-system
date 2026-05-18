import {
    Clock3,
    FolderKanban,
    BriefcaseBusiness,
    Activity,
  } from "lucide-react";
  
  export default function DashboardKpis({
    totalHours,
    totalEntries,
    totalClients,
    totalUsers,
  }: any) {
    const items = [
      {
        title:
          "Horas registradas",
  
        value: `${totalHours}h`,
  
        icon: Clock3,
  
        color:
          "bg-green-100 text-green-700",
      },
  
      {
        title: "Actividades",
  
        value: totalEntries,
  
        icon: Activity,
  
        color:
          "bg-blue-100 text-blue-700",
      },
  
      {
        title:
          "Clientes activos",
  
        value: totalClients,
  
        icon:
          BriefcaseBusiness,
  
        color:
          "bg-yellow-100 text-yellow-700",
      },
  
      {
        title: "Usuarios",
  
        value: totalUsers,
  
        icon:
          FolderKanban,
  
        color:
          "bg-purple-100 text-purple-700",
      },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon =
            item.icon;
  
          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {item.title}
                  </p>
  
                  <h2 className="text-3xl font-bold text-gray-800 mt-3">
                    {item.value}
                  </h2>
                </div>
  
                <div
                  className={`p-3 rounded-2xl ${item.color}`}
                >
                  <Icon
                    size={26}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }