import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Map, Clock, Gauge } from "lucide-react";

const circuits = [
  {
    id: "zwolle",
    name: "Zwolle",
    location: "Zwolle, Nederland",
    totalRaces: 4,
    bestLap: "42.3s",
    image: "https://images.unsplash.com/photo-1630160868576-27794a220fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXJ0aW5nJTIwcmFjZSUyMHRyYWNrfGVufDF8fHx8MTc3MzA5Njk5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "lelystad",
    name: "Lelystad",
    location: "Lelystad, Nederland",
    totalRaces: 5,
    bestLap: "38.7s",
    image: "https://images.unsplash.com/photo-1752348510798-9c8dd2cb6541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbyUyMGthcnQlMjByYWNpbmclMjBvdXRkb29yfGVufDF8fHx8MTc3MzEzMjI5NHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "venlo",
    name: "Venlo",
    location: "Venlo, Nederland",
    totalRaces: 3,
    bestLap: "45.1s",
    image: "https://images.unsplash.com/photo-1735636134481-1c6ef7f8df49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBjaXJjdWl0JTIwYWVyaWFsfGVufDF8fHx8MTc3MzExMjczN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function CircuitsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl text-white mb-2">Circuits</h2>
        <p className="text-slate-400">Selecteer een circuit om de rondetijden en bandenspanning te bekijken.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circuits.map((circuit) => (
          <Link key={circuit.id} to={`/dashboard/circuits/${circuit.id}`}>
            <Card className="bg-slate-800 border-slate-700 hover:border-red-600/50 transition-all cursor-pointer overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img
                  src={circuit.image}
                  alt={circuit.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-red-500" />
                  {circuit.name}
                </CardTitle>
                <CardDescription className="text-slate-400">{circuit.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Totaal races:</span>
                  <span className="text-white">{circuit.totalRaces}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Beste ronde:</span>
                  <span className="text-green-400">{circuit.bestLap}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}