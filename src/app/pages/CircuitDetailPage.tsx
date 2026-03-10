import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Clock, Gauge, ArrowLeft } from "lucide-react";

const circuitData: Record<string, { name: string; location: string }> = {
  zwolle: { name: "Zwolle", location: "Zwolle, Nederland" },
  lelystad: { name: "Lelystad", location: "Lelystad, Nederland" },
  venlo: { name: "Venlo", location: "Venlo, Nederland" },
};

export function CircuitDetailPage() {
  const { circuitId } = useParams<{ circuitId: string }>();
  const circuit = circuitData[circuitId || ""];

  if (!circuit) {
    return (
      <div className="text-white">
        <p>Circuit niet gevonden</p>
        <Link to="/dashboard/circuits">
          <Button className="mt-4">Terug naar circuits</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/circuits">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl text-white">{circuit.name}</h2>
          <p className="text-slate-400">{circuit.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to={`/dashboard/circuits/${circuitId}/lap-times`}>
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 hover:from-blue-500 hover:to-blue-600 transition-all cursor-pointer h-full">
            <CardContent className="pt-6">
              <Clock className="w-12 h-12 text-white mb-4" />
              <CardTitle className="text-white mb-2">Rondetijden</CardTitle>
              <CardDescription className="text-blue-100">
                Bekijk en voer rondetijden in voor dit circuit
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/dashboard/circuits/${circuitId}/tire-pressure`}>
          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-0 hover:from-orange-500 hover:to-orange-600 transition-all cursor-pointer h-full">
            <CardContent className="pt-6">
              <Gauge className="w-12 h-12 text-white mb-4" />
              <CardTitle className="text-white mb-2">Bandenspanning</CardTitle>
              <CardDescription className="text-orange-100">
                Beheer bandenspanning instellingen per kart
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
