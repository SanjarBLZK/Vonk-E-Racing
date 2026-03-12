import { useState } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Plus, Trophy, Clock } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface LapTime {
  id: string;
  raceDate: string;
  lapNumber: number;
  time: string;
  kartNumber: string;
}

const circuitData: Record<string, { name: string }> = {
  zwolle: { name: "Zwolle" },
  lelystad: { name: "Lelystad" },
  venray: { name: "Venray" },
};

export function LapTimesPage() {
  const { circuitId } = useParams<{ circuitId: string }>();
  const circuit = circuitData[circuitId || ""];

  const [lapTimes, setLapTimes] = useState<LapTime[]>([
    { id: "1", raceDate: "05-03-2026", lapNumber: 1, time: "42.3", kartNumber: "12" },
    { id: "2", raceDate: "05-03-2026", lapNumber: 2, time: "41.8", kartNumber: "12" },
    { id: "3", raceDate: "05-03-2026", lapNumber: 3, time: "42.1", kartNumber: "12" },
    { id: "4", raceDate: "28-02-2026", lapNumber: 1, time: "43.2", kartNumber: "8" },
    { id: "5", raceDate: "28-02-2026", lapNumber: 2, time: "42.7", kartNumber: "8" },
  ]);

  const [newLapTime, setNewLapTime] = useState({
    raceDate: "",
    lapNumber: "",
    time: "",
    kartNumber: "",
  });

  const handleAddLapTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLapTime.raceDate && newLapTime.lapNumber && newLapTime.time && newLapTime.kartNumber) {
      const newLap: LapTime = {
        id: Date.now().toString(),
        raceDate: newLapTime.raceDate,
        lapNumber: parseInt(newLapTime.lapNumber),
        time: newLapTime.time,
        kartNumber: newLapTime.kartNumber,
      };
      setLapTimes([newLap, ...lapTimes]);
      setNewLapTime({ raceDate: "", lapNumber: "", time: "", kartNumber: "" });
    }
  };

  const groupedByDate = lapTimes.reduce((acc, lap) => {
    if (!acc[lap.raceDate]) {
      acc[lap.raceDate] = [];
    }
    acc[lap.raceDate].push(lap);
    return acc;
  }, {} as Record<string, LapTime[]>);

  const bestLap = lapTimes.reduce((best, current) => 
    parseFloat(current.time) < parseFloat(best.time) ? current : best
  , lapTimes[0]);

  if (!circuit) {
    return <div className="text-white">Circuit niet gevonden</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to={`/dashboard/circuits/${circuitId}`}>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl text-white">Rondetijden - {circuit.name}</h2>
          <p className="text-slate-400">Invoeren en bekijken van rondetijden</p>
        </div>
      </div>

      {/* Best Lap */}
      {bestLap && (
        <Card className="bg-gradient-to-r from-yellow-600 to-yellow-700 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Trophy className="w-12 h-12 text-white" />
              <div>
                <div className="text-yellow-100 text-sm">Snelste Rondetijd</div>
                <div className="text-white text-3xl">{bestLap.time}s</div>
                <div className="text-yellow-100 text-sm">
                  {bestLap.raceDate} - Ronde {bestLap.lapNumber} - Kart #{bestLap.kartNumber}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Lap Time Form */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Nieuwe Rondetijd Toevoegen</CardTitle>
          <CardDescription className="text-slate-400">
            Voer de gegevens van een nieuwe ronde in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLapTime} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="raceDate" className="text-white">Race Datum</Label>
              <Input
                id="raceDate"
                type="date"
                value={newLapTime.raceDate}
                onChange={(e) => setNewLapTime({ ...newLapTime, raceDate: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lapNumber" className="text-white">Ronde #</Label>
              <Input
                id="lapNumber"
                type="number"
                placeholder="1"
                value={newLapTime.lapNumber}
                onChange={(e) => setNewLapTime({ ...newLapTime, lapNumber: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white">Tijd (sec)</Label>
              <Input
                id="time"
                type="number"
                step="0.1"
                placeholder="42.3"
                value={newLapTime.time}
                onChange={(e) => setNewLapTime({ ...newLapTime, time: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kartNumber" className="text-white">Kart #</Label>
              <Input
                id="kartNumber"
                type="text"
                placeholder="12"
                value={newLapTime.kartNumber}
                onChange={(e) => setNewLapTime({ ...newLapTime, kartNumber: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Toevoegen
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lap Times List */}
      <div className="space-y-6">
        {Object.entries(groupedByDate)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([date, laps]) => (
            <Card key={date} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-500" />
                  Race {date}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {laps
                    .sort((a, b) => a.lapNumber - b.lapNumber)
                    .map((lap) => (
                      <div
                        key={lap.id}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-white border-slate-600">
                            Ronde {lap.lapNumber}
                          </Badge>
                          <span className="text-slate-400">Kart #{lap.kartNumber}</span>
                        </div>
                        <div className="text-xl text-green-400">{lap.time}s</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
