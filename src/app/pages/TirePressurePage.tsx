import { useState } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Save, Thermometer } from "lucide-react";
import { Badge } from "../components/ui/badge";

const circuitData: Record<string, { name: string }> = {
  zwolle: { name: "Zwolle" },
  lelystad: { name: "Lelystad" },
  venray: { name: "Venray" },
};

interface TirePressure {
  frontLeft: string;
  frontRight: string;
  rearLeft: string;
  rearRight: string;
}

interface PitStopData {
  kartNumber: string;
  pitstopNumber: number;
  temperature: string;
  pressure: TirePressure;
}

export function TirePressurePage() {
  const { circuitId } = useParams<{ circuitId: string }>();
  const circuit = circuitData[circuitId || ""];

  const [selectedKart, setSelectedKart] = useState("12");
  const [selectedPitstop, setSelectedPitstop] = useState(1);
  const [temperature, setTemperature] = useState("22");
  
  const [tirePressure, setTirePressure] = useState<TirePressure>({
    frontLeft: "0.8",
    frontRight: "0.8",
    rearLeft: "0.9",
    rearRight: "0.9",
  });

  const [savedData, setSavedData] = useState<PitStopData[]>([
    {
      kartNumber: "12",
      pitstopNumber: 1,
      temperature: "22",
      pressure: { frontLeft: "0.8", frontRight: "0.8", rearLeft: "0.9", rearRight: "0.9" },
    },
    {
      kartNumber: "8",
      pitstopNumber: 1,
      temperature: "24",
      pressure: { frontLeft: "0.75", frontRight: "0.75", rearLeft: "0.85", rearRight: "0.85" },
    },
  ]);

  const handleSave = () => {
    const newData: PitStopData = {
      kartNumber: selectedKart,
      pitstopNumber: selectedPitstop,
      temperature,
      pressure: { ...tirePressure },
    };
    
    const existingIndex = savedData.findIndex(
      d => d.kartNumber === selectedKart && d.pitstopNumber === selectedPitstop
    );
    
    if (existingIndex >= 0) {
      const updated = [...savedData];
      updated[existingIndex] = newData;
      setSavedData(updated);
    } else {
      setSavedData([...savedData, newData]);
    }
  };

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
          <h2 className="text-3xl text-white">Bandenspanning - {circuit.name}</h2>
          <p className="text-slate-400">Registreer bandenspanning per kart en pitstop</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Bandenspanning Invoeren</CardTitle>
              <CardDescription className="text-slate-400">
                Selecteer kart en pitstop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kartNumber" className="text-white">Kart #</Label>
                  <Input
                    id="kartNumber"
                    type="text"
                    value={selectedKart}
                    onChange={(e) => setSelectedKart(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pitstop" className="text-white">Pitstop #</Label>
                  <Input
                    id="pitstop"
                    type="number"
                    value={selectedPitstop}
                    onChange={(e) => setSelectedPitstop(parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-white">Temp (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tire Pressure Diagram */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Bandenspanning (bar)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Kart Top View Visualization */}
                <div className="bg-slate-700 rounded-2xl p-8 relative">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 text-slate-400 text-sm">
                    Voor
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-400 text-sm">
                    Achter
                  </div>

                  {/* Front Tires */}
                  <div className="grid grid-cols-2 gap-20 mb-20">
                    <div className="space-y-2">
                      <div className="bg-slate-900 rounded-lg p-1 h-24 flex items-center justify-center border-2 border-red-600">
                        <div className="text-center">
                          <div className="text-xs text-slate-400 mb-1">Links Voor</div>
                          <Input
                            type="number"
                            step="0.05"
                            value={tirePressure.frontLeft}
                            onChange={(e) =>
                              setTirePressure({ ...tirePressure, frontLeft: e.target.value })
                            }
                            className="w-20 text-center bg-slate-800 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-slate-900 rounded-lg p-1 h-24 flex items-center justify-center border-2 border-red-600">
                        <div className="text-center">
                          <div className="text-xs text-slate-400 mb-1">Rechts Voor</div>
                          <Input
                            type="number"
                            step="0.05"
                            value={tirePressure.frontRight}
                            onChange={(e) =>
                              setTirePressure({ ...tirePressure, frontRight: e.target.value })
                            }
                            className="w-20 text-center bg-slate-800 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kart Body */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 bg-slate-600 rounded-lg opacity-30"></div>

                  {/* Rear Tires */}
                  <div className="grid grid-cols-2 gap-20">
                    <div className="space-y-2">
                      <div className="bg-slate-900 rounded-lg p-1 h-24 flex items-center justify-center border-2 border-red-600">
                        <div className="text-center">
                          <div className="text-xs text-slate-400 mb-1">Links Achter</div>
                          <Input
                            type="number"
                            step="0.05"
                            value={tirePressure.rearLeft}
                            onChange={(e) =>
                              setTirePressure({ ...tirePressure, rearLeft: e.target.value })
                            }
                            className="w-20 text-center bg-slate-800 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-slate-900 rounded-lg p-1 h-24 flex items-center justify-center border-2 border-red-600">
                        <div className="text-center">
                          <div className="text-xs text-slate-400 mb-1">Rechts Achter</div>
                          <Input
                            type="number"
                            step="0.05"
                            value={tirePressure.rearRight}
                            onChange={(e) =>
                              setTirePressure({ ...tirePressure, rearRight: e.target.value })
                            }
                            className="w-20 text-center bg-slate-800 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full mt-4 bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  Opslaan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Data */}
        <div>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Opgeslagen Gegevens</CardTitle>
              <CardDescription className="text-slate-400">
                Eerder ingevoerde bandenspanning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedData.map((data, idx) => (
                <div key={idx} className="p-4 bg-slate-700/50 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-white border-slate-600">
                      Kart #{data.kartNumber}
                    </Badge>
                    <Badge variant="outline" className="text-white border-slate-600">
                      Pitstop {data.pitstopNumber}
                    </Badge>
                    <div className="flex items-center gap-1 text-slate-400 text-sm ml-auto">
                      <Thermometer className="w-4 h-4" />
                      {data.temperature}°C
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-slate-400">LV</div>
                      <div className="text-white">{data.pressure.frontLeft} bar</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-slate-400">RV</div>
                      <div className="text-white">{data.pressure.frontRight} bar</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-slate-400">LA</div>
                      <div className="text-white">{data.pressure.rearLeft} bar</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-slate-400">RA</div>
                      <div className="text-white">{data.pressure.rearRight} bar</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
