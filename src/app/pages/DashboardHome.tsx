import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Map, Clock, Gauge, Zap, Dumbbell, Calendar, TrendingUp } from "lucide-react";

export function DashboardHome() {
  const quickStats = [
    { label: "Circuits", value: "3", icon: Map, color: "text-blue-400" },
    { label: "Totaal Races", value: "12", icon: Clock, color: "text-green-400" },
    { label: "Best Laptime", value: "42.3s", icon: TrendingUp, color: "text-yellow-400" },
    { label: "Pitstops", value: "24", icon: Zap, color: "text-red-400" },
  ];

  const recentRaces = [
    { circuit: "Zwolle", date: "05-03-2026", bestLap: "42.3s" },
    { circuit: "Lelystad", date: "28-02-2026", bestLap: "38.7s" },
    { circuit: "Venlo", date: "15-02-2026", bestLap: "45.1s" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl text-white mb-2">Dashboard</h2>
        <p className="text-slate-400">Welkom terug! Hier is een overzicht van je race prestaties.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-slate-400">{stat.label}</CardDescription>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Races */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recente Races</CardTitle>
          <CardDescription className="text-slate-400">
            Je laatste race sessies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRaces.map((race, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-600 rounded">
                    <Map className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white">{race.circuit}</div>
                    <div className="text-sm text-slate-400">{race.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Best Lap</div>
                  <div className="text-green-400">{race.bestLap}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/circuits">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 hover:from-blue-500 hover:to-blue-600 transition-all cursor-pointer">
            <CardContent className="pt-6">
              <Map className="w-12 h-12 text-white mb-4" />
              <CardTitle className="text-white mb-2">Bekijk Circuits</CardTitle>
              <CardDescription className="text-blue-100">
                Bekijk en beheer circuit data
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/pitstop-challenge">
          <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0 hover:from-red-500 hover:to-red-600 transition-all cursor-pointer">
            <CardContent className="pt-6">
              <Zap className="w-12 h-12 text-white mb-4" />
              <CardTitle className="text-white mb-2">Pitstop Challenge</CardTitle>
              <CardDescription className="text-red-100">
                Meet je pitstop tijden
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/agenda">
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 hover:from-green-500 hover:to-green-600 transition-all cursor-pointer">
            <CardContent className="pt-6">
              <Calendar className="w-12 h-12 text-white mb-4" />
              <CardTitle className="text-white mb-2">Race Agenda</CardTitle>
              <CardDescription className="text-green-100">
                Plan je volgende race
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}