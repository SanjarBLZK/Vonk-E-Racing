import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Zap, Timer, Play, Square, Trophy, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface PitStopRecord {
  id: string;
  kartNumber: string;
  time: number;
  date: string;
  notes: string;
}

export function PitStopChallengePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [kartNumber, setKartNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [records, setRecords] = useState<PitStopRecord[]>([
    { id: "1", kartNumber: "12", time: 45.2, date: "05-03-2026", notes: "Goede wissel" },
    { id: "2", kartNumber: "12", time: 52.8, date: "05-03-2026", notes: "Moer losgeschoten" },
    { id: "3", kartNumber: "8", time: 48.3, date: "28-02-2026", notes: "Standaard wissel" },
    { id: "4", kartNumber: "12", time: 43.1, date: "28-02-2026", notes: "Nieuw record!" },
  ]);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStart = () => {
    setTime(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleSave = () => {
    if (kartNumber && time > 0) {
      const newRecord: PitStopRecord = {
        id: Date.now().toString(),
        kartNumber,
        time: time / 1000,
        date: new Date().toLocaleDateString("nl-NL"),
        notes,
      };
      setRecords([newRecord, ...records]);
      setTime(0);
      setKartNumber("");
      setNotes("");
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const bestTime = records.length > 0 
    ? Math.min(...records.map(r => r.time))
    : 0;

  const avgTime = records.length > 0
    ? records.reduce((sum, r) => sum + r.time, 0) / records.length
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl text-white mb-2">Pitstop Challenge</h2>
        <p className="text-slate-400">Meet je bandenwissel tijden en verbeter je prestaties</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Beste Tijd</CardDescription>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-green-400">{bestTime > 0 ? `${bestTime.toFixed(1)}s` : '-'}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Gemiddelde</CardDescription>
              <TrendingDown className="w-5 h-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-blue-400">{avgTime > 0 ? `${avgTime.toFixed(1)}s` : '-'}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Totaal Pogingen</CardDescription>
              <Zap className="w-5 h-5 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{records.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Timer Section */}
      <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <Timer className="w-16 h-16 text-white mx-auto" />
            <div className="text-7xl text-white tabular-nums">
              {formatTime(time)}s
            </div>
            <div className="flex gap-4 justify-center">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-white text-red-600 hover:bg-slate-100"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handleStop}
                  size="lg"
                  className="bg-white text-red-600 hover:bg-slate-100"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Form */}
      {!isRunning && time > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Tijd Opslaan</CardTitle>
            <CardDescription className="text-slate-400">
              Voeg details toe aan deze pitstop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kartNumber" className="text-white">Kart Nummer</Label>
                <Input
                  id="kartNumber"
                  type="text"
                  placeholder="12"
                  value={kartNumber}
                  onChange={(e) => setKartNumber(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-white">Notities</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Bijv. snelle wissel, problemen met moer, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full mt-4 bg-red-600 hover:bg-red-700">
              Opslaan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Records History */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Pitstop Geschiedenis</CardTitle>
          <CardDescription className="text-slate-400">
            Al je pitstop tijden en verbeterpunten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`text-2xl ${
                  record.time === bestTime ? 'text-yellow-400' : 'text-white'
                }`}>
                  {record.time.toFixed(1)}s
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-white border-slate-600">
                      Kart #{record.kartNumber}
                    </Badge>
                    {record.time === bestTime && (
                      <Trophy className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{record.date}</div>
                </div>
              </div>
              <div className="text-slate-300 text-sm max-w-xs text-right">
                {record.notes || '-'}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
