import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Save, Thermometer } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { supabaseAdmin } from "../../lib/supabase";

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

interface TirePressureData {
  id: string;
  race_participant_id: string;
  measurement_time: string;
  front_left_psi: number;
  front_right_psi: number;
  rear_left_psi: number;
  rear_right_psi: number;
  tire_temperature_celsius: number;
  notes: string;
  race_participants: {
    car_number: string;
  };
}

interface RaceParticipant {
  id: string;
  race_id: string;
  team_id: string;
  car_number: string;
  driver_id: string;
  status: string;
}

export function TirePressurePage() {
  const { circuitId } = useParams<{ circuitId: string }>();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [loading, setLoading] = useState(true);
  const [tirePressureData, setTirePressureData] = useState<TirePressureData[]>([]);
  const [raceParticipants, setRaceParticipants] = useState<RaceParticipant[]>([]);

  const [selectedKart, setSelectedKart] = useState("12");
  const [temperature, setTemperature] = useState("22");
  
  const [tirePressure, setTirePressure] = useState({
    frontLeft: "0.8",
    frontRight: "0.8", 
    rearLeft: "0.9",
    rearRight: "0.9",
  });

  useEffect(() => {
    if (!circuitId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch circuit data
        const { data: circuitData, error: circuitError } = await supabaseAdmin
          .from('circuits')
          .select('*')
          .eq('id', circuitId)
          .single();

        if (circuitError) {
          console.error('Error fetching circuit:', circuitError);
          setCircuit(null);
          return;
        }

        setCircuit(circuitData);

        // Fetch tire pressure data for this circuit
        const { data: pressureData, error: pressureError } = await supabaseAdmin
          .from('tire_pressure')
          .select(`
            *,
            race_participants!inner(
              car_number,
              races!inner(circuit_id)
            )
          `)
          .eq('race_participants.races.circuit_id', circuitId)
          .order('measurement_time', { ascending: false });

        if (pressureError) {
          console.error('Error fetching tire pressure data:', pressureError);
        } else {
          setTirePressureData(pressureData || []);
        }

        // Fetch race participants for this circuit
        const { data: participantsData, error: participantsError } = await supabaseAdmin
          .from('race_participants')
          .select(`
            *,
            races!inner(circuit_id)
          `)
          .eq('races.circuit_id', circuitId);

        if (participantsError) {
          console.error('Error fetching race participants:', participantsError);
        } else {
          setRaceParticipants(participantsData || []);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setCircuit(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [circuitId]);

  const handleSave = async () => {
    try {
      // Find or create a race participant for the selected kart
      let participant = raceParticipants.find(p => p.car_number === selectedKart);
      
      if (!participant) {
        // Create a new race participant
        const { data: newParticipant, error: participantError } = await supabaseAdmin
          .from('race_participants')
          .insert({
            race_id: (await supabaseAdmin.from('races').select('id').eq('circuit_id', circuitId).limit(1).single()).data?.id,
            team_id: (await supabaseAdmin.from('teams').select('id').limit(1).single()).data?.id,
            car_number: selectedKart,
            driver_id: (await supabaseAdmin.from('users').select('id').limit(1).single()).data?.id,
            status: 'active'
          })
          .select()
          .single();

        if (participantError) {
          console.error('Error creating race participant:', participantError);
          alert('Fout bij het aanmaken van race deelnemer');
          return;
        }

        participant = newParticipant;
      }

      // Insert tire pressure data
      const { error: pressureError } = await supabaseAdmin
        .from('tire_pressure')
        .insert({
          race_participant_id: participant.id,
          measurement_time: new Date().toISOString(),
          front_left_psi: parseFloat(tirePressure.frontLeft),
          front_right_psi: parseFloat(tirePressure.frontRight),
          rear_left_psi: parseFloat(tirePressure.rearLeft),
          rear_right_psi: parseFloat(tirePressure.rearRight),
          tire_temperature_celsius: parseFloat(temperature),
          notes: `Kart ${selectedKart} - ${new Date().toLocaleDateString()}`
        });

      if (pressureError) {
        console.error('Error saving tire pressure:', pressureError);
        alert('Fout bij het opslaan van bandenspanning');
        return;
      }

      // Refresh data
      const fetchData = async () => {
        const { data: pressureData } = await supabaseAdmin
          .from('tire_pressure')
          .select(`
            *,
            race_participants!inner(
              car_number,
              races!inner(circuit_id)
            )
          `)
          .eq('race_participants.races.circuit_id', circuitId)
          .order('measurement_time', { ascending: false });

        setTirePressureData(pressureData || []);
      };

      await fetchData();
      
      alert('Bandenspanning succesvol opgeslagen!');
      
    } catch (error) {
      console.error('Error saving tire pressure:', error);
      alert('Er is een fout opgetreden bij het opslaan');
    }
  };

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
              <div className="grid grid-cols-2 gap-4">
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
                      <div className="bg-slate-900 rounded-lg p-1 h-24 flex items-center justify-center border-2" style={{ borderColor: '#d35481' }}>
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
                      <div className="bg-slate-900 rounded-lg p-1 h-24 flex items-center justify-center border-2" style={{ borderColor: '#d35481' }}>
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
                      <div className="bg-slate-900 rounded-lg p-1 h-24 flex items-center justify-center border-2" style={{ borderColor: '#d35481' }}>
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
                      <div className="bg-slate-900 rounded-lg p-1 h-24 flex items-center justify-center border-2" style={{ borderColor: '#d35481' }}>
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

                <Button onClick={handleSave} className="w-full mt-4 text-white" style={{ background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)' }}>
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
              {tirePressureData.map((data: TirePressureData, idx: number) => (
                <div key={data.id} className="p-4 bg-slate-700/50 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-white border-slate-600">
                      Kart #{data.race_participants.car_number}
                    </Badge>
                    <div className="flex items-center gap-1 text-slate-400 text-sm ml-auto">
                      <Thermometer className="w-4 h-4" />
                      {data.tire_temperature_celsius}°C
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(data.measurement_time).toLocaleDateString('nl-NL')} - {new Date(data.measurement_time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-slate-400">LV</div>
                      <div className="text-white">{data.front_left_psi} bar</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-slate-400">RV</div>
                      <div className="text-white">{data.front_right_psi} bar</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-slate-400">LA</div>
                      <div className="text-white">{data.rear_left_psi} bar</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                      <div className="text-slate-400">RA</div>
                      <div className="text-white">{data.rear_right_psi} bar</div>
                    </div>
                  </div>
                  {data.notes && (
                    <div className="text-xs text-slate-400 italic">
                      {data.notes}
                    </div>
                  )}
                </div>
              ))}
              {tirePressureData.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                  Nog geen bandenspanning data beschikbaar. Voeg de eerste meting toe.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
