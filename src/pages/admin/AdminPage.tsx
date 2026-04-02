import {
  BarChart3,
  LayoutDashboard,
  MenuIcon,
  Package,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  { id: "products", label: "Products", icon: Package, path: "/admin/products" },
  {
    id: "employees",
    label: "Employees",
    icon: Users,
    path: "/admin/employees",
  },
  { id: "reports", label: "Reports", icon: BarChart3, path: "/admin/reports" },
];

export default function AdminPage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path === "/admin" && location.pathname === "/admin")
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-slate-100 flex">
      <aside
        className={`${sidebarOpen ? "w-72" : "w-24"} border-r border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  Admin Console
                </h2>
                <p className="text-xs text-slate-500">
                  Restaurant control center
                </p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>

        <nav className="p-3 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`group flex items-center ${sidebarOpen ? "gap-3 px-3" : "justify-center px-0"} py-3 rounded-xl transition-all ${
                  active
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div
            className={`${sidebarOpen ? "px-3" : "flex justify-center"} py-3 rounded-xl bg-slate-100 text-slate-700`}
          >
            <div
              className={`flex items-center ${sidebarOpen ? "gap-2" : "justify-center"}`}
            >
              <Settings className="w-4 h-4" />
              {sidebarOpen && (
                <span className="text-xs font-medium">System healthy</span>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="px-4 md:px-8 py-4 border-b border-slate-200 bg-white/70 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Administration
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Restaurant Operations
          </h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
