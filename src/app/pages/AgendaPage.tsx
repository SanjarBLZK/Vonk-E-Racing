import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Calendar, Plus, MapPin, Clock, Trash2 } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface RaceEvent {
  id: string;
  title: string;
  circuit: string;
  date: string;
  time: string;
  type: "race" | "practice" | "qualifying";
}

export function AgendaPage() {
  const [events, setEvents] = useState<RaceEvent[]>([
    {
      id: "1",
      title: "Zwolle Race Dag",
      circuit: "Zwolle",
      date: "2026-03-15",
      time: "10:00",
      type: "race",
    },
    {
      id: "2",
      title: "Lelystad Kwalificatie",
      circuit: "Lelystad",
      date: "2026-03-22",
      time: "14:00",
      type: "qualifying",
    },
    {
      id: "3",
      title: "Venray Training",
      circuit: "Venray",
      date: "2026-03-29",
      time: "09:00",
      type: "practice",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    circuit: "",
    date: "",
    time: "",
    type: "race" as const,
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.circuit && newEvent.date && newEvent.time) {
      const event: RaceEvent = {
        id: Date.now().toString(),
        ...newEvent,
      };
      setEvents([...events, event].sort((a, b) => a.date.localeCompare(b.date)));
      setNewEvent({ title: "", circuit: "", date: "", time: "", type: "race" });
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "race":
        return "bg-red-600";
      case "qualifying":
        return "bg-yellow-600";
      case "practice":
        return "bg-blue-600";
      default:
        return "bg-slate-600";
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case "race":
        return "Race";
      case "qualifying":
        return "Kwalificatie";
      case "practice":
        return "Training";
      default:
        return type;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("nl-NL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl text-white mb-2">Race Agenda</h2>
        <p className="text-slate-400">Plan en bekijk alle wedstrijddagen</p>
      </div>

      {/* Add Event Form */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Nieuw Evenement Toevoegen</CardTitle>
          <CardDescription className="text-slate-400">
            Voeg een race, kwalificatie of training toe aan de agenda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Titel</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="bijv. Zwolle Race Dag"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circuit" className="text-white">Circuit</Label>
                <Input
                  id="circuit"
                  type="text"
                  placeholder="bijv. Zwolle"
                  value={newEvent.circuit}
                  onChange={(e) => setNewEvent({ ...newEvent, circuit: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">Datum</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-white">Tijd</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Type</Label>
                <select
                  id="type"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as "race" | "practice" | "qualifying" })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="race">Race</option>
                  <option value="qualifying">Kwalificatie</option>
                  <option value="practice">Training</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Evenement Toevoegen
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Geen evenementen gepland</p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="bg-slate-800 border-slate-700 hover:border-red-600/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-1 h-16 rounded ${getEventColor(event.type)}`}></div>
                      <div>
                        <h3 className="text-xl text-white">{event.title}</h3>
                        <Badge className={`${getEventColor(event.type)} text-white border-0`}>
                          {getEventLabel(event.type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{event.circuit}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
