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

const staticCircuits: Record<string, Circuit> = {
  zwolle: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Zwolle',
    location: 'Zwolle',
    country: 'Nederland',
    length_in_meters: 1200,
    number_of_corners: 12,
    fastest_lap_time: 42.3,
    fastest_lap_driver: '',
    description: 'Een technisch circuit in Zwolle',
    image_url: 'https://i.imgur.com/zZTd4lG.jpeg'
  },
  lelystad: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Lelystad',
    location: 'Lelystad',
    country: 'Nederland',
    length_in_meters: 1100,
    number_of_corners: 10,
    fastest_lap_time: 41.8,
    fastest_lap_driver: '',
    description: 'Een snel circuit in Lelystad',
    image_url: 'https://imgur.com/fAQ1d9q.jpeg'
  },
  venray: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Venray',
    location: 'Venray',
    country: 'Nederland',
    length_in_meters: 1300,
    number_of_corners: 14,
    fastest_lap_time: 43.1,
    fastest_lap_driver: '',
    description: 'Een uitdagend circuit in Venray',
    image_url: 'https://imgur.com/bxM9I1s.jpg'
  }
};

// Mapping from URL names to UUIDs
const circuitIdToUuid: Record<string, string> = {
  zwolle: '550e8400-e29b-41d4-a716-446655440001',
  lelystad: '550e8400-e29b-41d4-a716-446655440002',
  venray: '550e8400-e29b-41d4-a716-446655440003'
};

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
        console.log('Fetching circuit with ID:', circuitId);
        console.log('Circuit ID type:', typeof circuitId);
        
        if (!circuitId || typeof circuitId !== 'string') {
          console.error('Invalid circuit ID:', circuitId);
          setCircuit(null);
          return;
        }
        
        const circuitUuid = circuitIdToUuid[circuitId];
        
        if (!circuitUuid) {
          console.error('Unknown circuit ID:', circuitId);
          setCircuit(null);
          return;
        }
        
        const { data: circuitData, error: circuitError } = await supabaseAdmin
          .from('circuits')
          .select('*')
          .eq('id', circuitUuid)
          .single();

        if (circuitError) {
          console.error('Error fetching circuit:', circuitError);
          // Fallback to static circuits
          const fallbackCircuit = staticCircuits[circuitId];
          if (fallbackCircuit) {
            setCircuit(fallbackCircuit);
          } else {
            setCircuit(null);
          }
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
          .eq('race_participants.races.circuit_id', circuitUuid)
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
          .eq('races.circuit_id', circuitUuid);

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
      const newEntry = {
        id: Date.now().toString(),
        race_participant_id: `temp-${selectedKart}`,
        measurement_time: new Date().toISOString(),
        front_left_psi: parseFloat(tirePressure.frontLeft),
        front_right_psi: parseFloat(tirePressure.frontRight),
        rear_left_psi: parseFloat(tirePressure.rearLeft),
        rear_right_psi: parseFloat(tirePressure.rearRight),
        tire_temperature_celsius: parseFloat(temperature),
        notes: `Kart ${selectedKart} - ${new Date().toLocaleDateString()}`,
        race_participants: {
          car_number: selectedKart
        }
      };
      
      // Always add to local state first
      setTirePressureData([newEntry, ...tirePressureData]);
      
      // Try to save to database (even in fallback mode)
      try {
        const circuitUuid = circuitIdToUuid[circuitId];
        
        if (!circuitUuid) {
          console.error('Unknown circuit ID:', circuitId);
          alert('Onbekend circuit');
          return;
        }
        
        let participant = raceParticipants.find(p => p.car_number === selectedKart);
        
        if (!participant) {
          // Try to get required data, with fallbacks
          let raceId, teamId, driverId;
          
          try {
            console.log('Fetching race for circuit UUID:', circuitUuid);
            const raceResult = await supabaseAdmin.from('races').select('id').eq('circuit_id', circuitUuid).limit(1).single();
            console.log('Race query result:', raceResult);
            raceId = raceResult.data?.id;
          } catch (e) {
            console.error('No race found, creating temporary one:', e);
            // Create a temporary race
            const { data: newRace } = await supabaseAdmin.from('races').insert({
              circuit_id: circuitUuid,
              name: `${circuit?.name} Practice`,
              race_date: new Date().toISOString(),
              race_type: 'practice',
              weather_condition: 'Sunny',
              temperature_celsius: 20,
              track_condition: 'Dry',
              status: 'completed'
            }).select('id').single();
            raceId = newRace?.id;
          }
          
          try {
            const teamResult = await supabaseAdmin.from('teams').select('id').limit(1).single();
            teamId = teamResult.data?.id;
          } catch (e) {
            console.error('No team found, creating temporary one');
            // Create a temporary team
            const { data: newTeam } = await supabaseAdmin.from('teams').insert({
              name: 'Default Team',
              team_number: 1,
              description: 'Temporary team for races'
            }).select('id').single();
            teamId = newTeam?.id;
          }
          
          try {
            const userResult = await supabaseAdmin.from('users').select('id').limit(1).single();
            driverId = userResult.data?.id;
          } catch (e) {
            console.error('No user found, creating temporary one');
            // Create a temporary user
            const { data: newUser } = await supabaseAdmin.from('users').insert({
              email: `driver${selectedKart}@racing.com`,
              username: `driver${selectedKart}`,
              password_hash: 'temp_hash',
              first_name: 'Driver',
              last_name: selectedKart
            }).select('id').single();
            driverId = newUser?.id;
          }
          
          if (!raceId || !teamId || !driverId) {
            throw new Error('Kon benodigde data niet aanmaken');
          }
          
          // Create a new race participant
          const { data: newParticipant, error: participantError } = await supabaseAdmin
            .from('race_participants')
            .insert({
              race_id: raceId,
              team_id: teamId,
              car_number: selectedKart,
              driver_id: driverId,
              status: 'active'
            })
            .select()
            .single();

          if (participantError) {
            console.error('Error creating race participant:', participantError);
            throw participantError;
          }

          participant = newParticipant;
        }

        // Insert tire pressure data to database
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
          console.error('Error saving to database:', pressureError);
          console.error('Full error details:', JSON.stringify(pressureError, null, 2));
          console.error('Race participant ID:', participant?.id);
          console.error('Circuit ID:', circuitId);
          alert(`Database opslaan mislukt: ${pressureError.message || pressureError.details || 'Onbekende fout'}`);
        } else {
          console.log('Successfully saved to database');
          alert('Bandenspanning opgeslagen (lokaal + database)!');
        }
        
      } catch (dbError) {
        console.error('Database save failed:', dbError);
        alert('Bandenspanning lokaal opgeslagen, maar database opslaan mislukt');
      }
      
    } catch (error) {
      console.error('Error saving tire pressure:', error);
      alert('Er is een fout opgetreden bij het opslaan: ' + (error as Error).message);
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
