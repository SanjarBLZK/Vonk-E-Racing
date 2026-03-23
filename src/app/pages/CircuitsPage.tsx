import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Map, Clock, Gauge, Plus, Loader2, RefreshCw } from "lucide-react";
import { useCircuits } from "../../hooks/useCircuits";
import { Button } from "../components/ui/button";
import { useState } from "react";

export function CircuitsPage() {
  const { circuits, loading, error, addCircuit, fetchCircuits } = useCircuits();
  const [showAddForm, setShowAddForm] = useState(false);

  console.log('CircuitsPage - circuits:', circuits);
  console.log('CircuitsPage - loading:', loading);
  console.log('CircuitsPage - error:', error);

  // Always show circuits, ignore loading/error states for now
  const displayCircuits = circuits.length > 0 ? circuits : [
    {
      id: 'zwolle',
      name: 'Zwolle',
      location: 'Zwolle',
      country: 'Nederland',
      length_in_meters: 1200,
      number_of_corners: 12,
      fastest_lap_time: 42.3,
      fastest_lap_driver: '',
      description: 'Een technisch circuit in Zwolle',
      image_url: `https://i.imgur.com/zZTd4lG.jpeg`
    },
    {
      id: 'lelystad',
      name: 'Lelystad',
      location: 'Lelystad',
      country: 'Nederland',
      length_in_meters: 1100,
      number_of_corners: 10,
      fastest_lap_time: 41.8,
      fastest_lap_driver: '',
      description: 'Een snel circuit in Lelystad',
      image_url: `https://imgur.com/fAQ1d9q.jpeg`
    },
    {
      id: 'venray',
      name: 'Venray',
      location: 'Venray',
      country: 'Nederland',
      length_in_meters: 1300,
      number_of_corners: 14,
      fastest_lap_time: 43.1,
      fastest_lap_driver: '',
      description: 'Een uitdagend circuit in Venray',
      image_url: `https://imgur.com/bxM9I1s.jpg`
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl text-white mb-2">Circuits ({displayCircuits.length})</h2>
          <p className="text-slate-400">Selecteer een circuit om de rondetijden en bandenspanning te bekijken.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => fetchCircuits(true)}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#d35481] hover:bg-[#d35481]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Circuit toevoegen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCircuits.map((circuit) => (
          <Link key={circuit.id} to={`/dashboard/circuits/${circuit.id}`}>
            <Card className="bg-slate-800 border-slate-700 hover:border-[#d35481]/50 transition-all cursor-pointer overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img
                  src={circuit.image_url}
                  alt={circuit.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onLoad={() => console.log(`Image loaded successfully: ${circuit.image_url}`)}
                  onError={(e) => {
                    console.log(`Image failed to load: ${circuit.image_url}`);
                    const fallbackUrl = `https://picsum.photos/400/200?random=${circuit.id}`;
                    console.log(`Trying fallback: ${fallbackUrl}`);
                    e.currentTarget.src = fallbackUrl;
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-white">{circuit.name}</CardTitle>
                <CardDescription className="text-slate-400">
                  📍 {circuit.location}, {circuit.country}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Gauge className="h-4 w-4" />
                    {circuit.length_in_meters}m
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {circuit.fastest_lap_time}s
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  🏁 {circuit.fastest_lap_driver}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}