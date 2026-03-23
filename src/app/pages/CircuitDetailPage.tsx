import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Clock, Gauge, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface Circuit {
  id: string;
  name: string;
  location: string;
  country: string;
  length_in_meters: number;
  number_of_corners: number;
  fastest_lap_time: number;
  fastest_lap_driver: string;
  description: string;
  image_url: string;
}

const staticCircuits: Record<string, Circuit> = {
  zwolle: {
    id: 'zwolle',
    name: 'Zwolle',
    location: 'Zwolle',
    country: 'Nederland',
    length_in_meters: 1200,
    number_of_corners: 12,
    fastest_lap_time: 42.3,
    fastest_lap_driver: 'Max Verstappen',
    description: 'Een technisch circuit in Zwolle',
    image_url: `https://picsum.photos/400/200?random=zwolle`
  },
  lelystad: {
    id: 'lelystad',
    name: 'Lelystad',
    location: 'Lelystad',
    country: 'Nederland',
    length_in_meters: 1100,
    number_of_corners: 10,
    fastest_lap_time: 41.8,
    fastest_lap_driver: 'Lewis Hamilton',
    description: 'Een snel circuit in Lelystad',
    image_url: `https://picsum.photos/400/200?random=lelystad`
  },
  venray: {
    id: 'venray',
    name: 'Venray',
    location: 'Venray',
    country: 'Nederland',
    length_in_meters: 1300,
    number_of_corners: 14,
    fastest_lap_time: 43.1,
    fastest_lap_driver: 'Charles Leclerc',
    description: 'Een uitdagend circuit in Venray',
    image_url: `https://picsum.photos/400/200?random=venray`
  }
};

export function CircuitDetailPage() {
  const { circuitId } = useParams<{ circuitId: string }>();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!circuitId) return;

    const fetchCircuit = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const foundCircuit = staticCircuits[circuitId];
        if (foundCircuit) {
          setCircuit(foundCircuit);
        } else {
          setCircuit(null);
        }
      } catch (err) {
        console.error('Error fetching circuit:', err);
        setCircuit(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCircuit();
  }, [circuitId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Circuit laden...</div>
      </div>
    );
  }

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
          <p className="text-slate-400">{circuit.location}, {circuit.country}</p>
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
