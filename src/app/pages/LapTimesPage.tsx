import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Plus, Trophy, Clock } from "lucide-react";
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

interface LapTimeData {
  id: string;
  race_participant_id: string;
  lap_number: number;
  lap_time_seconds: number;
  sector1_time_seconds: number;
  sector2_time_seconds: number;
  sector3_time_seconds: number;
  is_fastest_lap: boolean;
  race_participants: {
    car_number: string;
    races: {
      race_date: string;
    };
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

export function LapTimesPage() {
  const { circuitId } = useParams<{ circuitId: string }>();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [loading, setLoading] = useState(true);
  const [lapTimes, setLapTimes] = useState<LapTimeData[]>([]);
  const [raceParticipants, setRaceParticipants] = useState<RaceParticipant[]>([]);

  const [newLapTime, setNewLapTime] = useState({
    raceDate: "",
    lapNumber: "",
    time: "",
    kartNumber: "",
  });

  useEffect(() => {
    if (!circuitId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch circuit data
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

        // Fetch lap times data for this circuit
        const { data: lapData, error: lapError } = await supabaseAdmin
          .from('lap_times')
          .select(`
            *,
            race_participants!inner(
              car_number,
              races!inner(circuit_id, race_date)
            )
          `)
          .eq('race_participants.races.circuit_id', circuitUuid)
          .order('race_participants.races.race_date', { ascending: false })
          .order('lap_number', { ascending: true });

        if (lapError) {
          console.error('Error fetching lap times:', lapError);
        } else {
          setLapTimes(lapData || []);
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

  const handleAddLapTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLapTime.raceDate || !newLapTime.lapNumber || !newLapTime.time || !newLapTime.kartNumber) {
      alert('Vul alle velden in');
      return;
    }

    try {
      const newEntry = {
        id: Date.now().toString(),
        race_participant_id: `temp-${newLapTime.kartNumber}`,
        lap_number: parseInt(newLapTime.lapNumber),
        lap_time_seconds: parseFloat(newLapTime.time),
        sector1_time_seconds: parseFloat(newLapTime.time) * 0.35,
        sector2_time_seconds: parseFloat(newLapTime.time) * 0.35,
        sector3_time_seconds: parseFloat(newLapTime.time) * 0.30,
        is_fastest_lap: false,
        race_participants: {
          car_number: newLapTime.kartNumber,
          races: {
            race_date: newLapTime.raceDate
          }
        }
      };
      
      // Always add to local state first
      setLapTimes([newEntry, ...lapTimes]);
      
      // Try to save to database (even in fallback mode)
      try {
        // Find or create a race participant for the selected kart
        const circuitUuid = circuitIdToUuid[circuitId];
        
        if (!circuitUuid) {
          console.error('Unknown circuit ID:', circuitId);
          alert('Onbekend circuit');
          return;
        }
        
        let participant = raceParticipants.find(p => p.car_number === newLapTime.kartNumber);
        
        if (!participant) {
          // Try to get required data, with fallbacks
          let raceId, teamId, driverId;
          
          try {
            const raceResult = await supabaseAdmin.from('races').select('id').eq('circuit_id', circuitUuid).limit(1).single();
            raceId = raceResult.data?.id;
          } catch (e) {
            console.error('No race found, creating temporary one');
            // Create a temporary race
            const { data: newRace } = await supabaseAdmin.from('races').insert({
              circuit_id: circuitUuid,
              name: `${circuit?.name} Practice`,
              race_date: new Date(newLapTime.raceDate).toISOString(),
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
              email: `driver${newLapTime.kartNumber}@racing.com`,
              username: `driver${newLapTime.kartNumber}`,
              password_hash: 'temp_hash',
              first_name: 'Driver',
              last_name: newLapTime.kartNumber
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
              car_number: newLapTime.kartNumber,
              driver_id: driverId,
              status: 'finished'
            })
            .select()
            .single();

          if (participantError) {
            console.error('Error creating race participant:', participantError);
            throw participantError;
          }

          participant = newParticipant;
        }

        // Insert lap time data to database
        const lapTimeSeconds = parseFloat(newLapTime.time);
        const { error: lapError } = await supabaseAdmin
          .from('lap_times')
          .insert({
            race_participant_id: participant.id,
            lap_number: parseInt(newLapTime.lapNumber),
            lap_time_seconds: lapTimeSeconds,
            sector1_time_seconds: lapTimeSeconds * 0.35, // Estimate sector times
            sector2_time_seconds: lapTimeSeconds * 0.35,
            sector3_time_seconds: lapTimeSeconds * 0.30,
            is_fastest_lap: false // Will be updated later if needed
          });

        if (lapError) {
          console.error('Error saving to database:', lapError);
          console.error('Full error details:', JSON.stringify(lapError, null, 2));
          console.error('Race participant ID:', participant?.id);
          console.error('Circuit ID:', circuitId);
          alert(`Database opslaan mislukt: ${lapError.message || lapError.details || 'Onbekende fout'}`);
        } else {
          console.log('Successfully saved to database');
          alert('Rondetijd opgeslagen (lokaal + database)!');
        }
        
      } catch (dbError) {
        console.error('Database save failed:', dbError);
        alert('Rondetijd lokaal opgeslagen, maar database opslaan mislukt');
      }
      
      // Clear form
      setNewLapTime({ raceDate: "", lapNumber: "", time: "", kartNumber: "" });
      
    } catch (error) {
      console.error('Error saving lap time:', error);
      alert('Er is een fout opgetreden bij het opslaan: ' + (error as Error).message);
    }
  };

  const groupedByDate = lapTimes.reduce((acc, lap) => {
    const raceDate = new Date(lap.race_participants.races.race_date).toLocaleDateString('nl-NL');
    if (!acc[raceDate]) {
      acc[raceDate] = [];
    }
    acc[raceDate].push(lap);
    return acc;
  }, {} as Record<string, LapTimeData[]>);

  const bestLap = lapTimes.length > 0 ? lapTimes.reduce((best, current) => 
    current.lap_time_seconds < best.lap_time_seconds ? current : best
  ) : null;

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
                <div className="text-white text-3xl">{bestLap.lap_time_seconds}s</div>
                <div className="text-yellow-100 text-sm">
                  {new Date(bestLap.race_participants.races.race_date).toLocaleDateString('nl-NL')} - Ronde {bestLap.lap_number} - Kart #{bestLap.race_participants.car_number}
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
              <Button type="submit" className="w-full text-white" style={{ background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)' }}>
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
                  <Clock className="w-5 h-5" style={{ 
                    background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }} />
                  Race {date}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {laps
                    .sort((a, b) => a.lap_number - b.lap_number)
                    .map((lap) => (
                      <div
                        key={lap.id}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-white border-slate-600">
                            Ronde {lap.lap_number}
                          </Badge>
                          <span className="text-slate-400">Kart #{lap.race_participants.car_number}</span>
                        </div>
                        <div className="text-xl text-green-400">{lap.lap_time_seconds}s</div>
                      </div>
                    ))}
                  {laps.length === 0 && (
                    <div className="text-center text-slate-400 py-4">
                      Geen rondetijden beschikbaar voor deze race.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        {Object.keys(groupedByDate).length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-8">
              <div className="text-slate-400">
                Nog geen rondetijden beschikbaar. Voeg de eerste rondetijd toe.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
