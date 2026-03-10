import { Outlet, Link, useLocation } from "react-router";
import { Flag, Map, Clock, Gauge, Zap, Dumbbell, Calendar, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";

export function DashboardLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Flag },
    { path: "/dashboard/circuits", label: "Circuits", icon: Map },
    { path: "/dashboard/pitstop-challenge", label: "Pitstop Challenge", icon: Zap },
    { path: "/dashboard/practice", label: "Oefenmodus", icon: Dumbbell },
    { path: "/dashboard/agenda", label: "Agenda", icon: Calendar },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-red-600/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl text-white">Kart Racing Pro</h1>
          </div>
          <Link to="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Uitloggen
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 min-h-[calc(100vh-73px)] border-r border-slate-700">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? "bg-red-600 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
