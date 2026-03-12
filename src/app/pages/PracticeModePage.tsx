import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dumbbell, Timer, Play, Square, RotateCcw, Award } from "lucide-react";
import { Progress } from "../components/ui/progress";

export function PracticeModePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [session, setSession] = useState<number[]>([]);
  const [currentRep, setCurrentRep] = useState(0);

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
    if (time > 0) {
      setSession([...session, time / 1000]);
      setCurrentRep(currentRep + 1);
    }
  };

  const handleReset = () => {
    setTime(0);
    setSession([]);
    setCurrentRep(0);
    setIsRunning(false);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const bestTime = session.length > 0 ? Math.min(...session) : 0;
  const avgTime = session.length > 0 
    ? session.reduce((sum, t) => sum + t, 0) / session.length 
    : 0;

  const targetReps = 10;
  const progress = (currentRep / targetReps) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl text-white mb-2">Oefenmodus</h2>
        <p className="text-slate-400">Train je pitstop vaardigheden op school</p>
      </div>

      {/* Progress */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Training Voortgang</CardTitle>
          <CardDescription className="text-slate-400">
            Herhalingen: {currentRep} / {targetReps}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Beste Tijd</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-green-400">
              {bestTime > 0 ? `${bestTime.toFixed(1)}s` : '-'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Gemiddelde</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-blue-400">
              {avgTime > 0 ? `${avgTime.toFixed(1)}s` : '-'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Sessie Pogingen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{session.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Timer */}
      <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <Dumbbell className="w-16 h-16 text-white mx-auto" />
            <div className="text-7xl text-white tabular-nums">
              {formatTime(time)}s
            </div>
            <div className="flex gap-4 justify-center">
              {!isRunning ? (
                <>
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-slate-100"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Oefening
                  </Button>
                  {session.length > 0 && (
                    <Button
                      onClick={handleReset}
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset Sessie
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={handleStop}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-slate-100"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Results */}
      {session.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sessie Resultaten</CardTitle>
            <CardDescription className="text-slate-400">
              Je oefentijden van deze sessie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {session.map((time, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg text-center ${
                    time === bestTime 
                      ? 'bg-green-600 border-2 border-green-400' 
                      : 'bg-slate-700/50'
                  }`}
                >
                  <div className="text-xs text-slate-400 mb-1">Rep {idx + 1}</div>
                  <div className={`text-xl ${
                    time === bestTime ? 'text-white' : 'text-white'
                  }`}>
                    {time.toFixed(1)}s
                  </div>
                  {time === bestTime && (
                    <Award className="w-4 h-4 text-white mx-auto mt-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Training Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span style={{ 
                background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>•</span>
              <span>Oefen eerst de bewegingen langzaam en focus op de juiste techniek</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ 
                background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>•</span>
              <span>Probeer een consistente tijd te halen voordat je sneller gaat</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ 
                background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>•</span>
              <span>Let op de volgorde: kruislings wielen vervangen (LV → RA → RV → LA)</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ 
                background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>•</span>
              <span>Houd je gereedschap altijd op dezelfde plek voor snelle toegang</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
