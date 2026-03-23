import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Flag, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        setError(authError.message || "Login mislukt. Controleer je email en wachtwoord.");
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Successfully logged in
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Er is een onverwachte fout opgetreden");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!signupName || !signupEmail || !signupPassword) {
        setError("Vul alle velden in");
        setLoading(false);
        return;
      }

      // Create user with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            first_name: signupName.split(" ")[0],
            last_name: signupName.split(" ").slice(1).join(" ") || "",
          }
        }
      });

      if (authError) {
        setError(authError.message || "Registratie mislukt");
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          // Email automatically confirmed (dev mode)
          navigate("/dashboard");
        } else {
          setError("Account aangemaakt! Controleer je email voor confirmatie.");
          // Clear form
          setShowSignup(false);
          setSignupName("");
          setSignupEmail("");
          setSignupPassword("");
        }
      }
    } catch (err) {
      setError("Er is een onverwachte fout opgetreden");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-[#d35481] p-4">
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur border-[#d35481]/30">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-4 rounded-full" style={{ background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)' }}>
              <Flag className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl text-white">Kart Racing Pro</CardTitle>
            <CardDescription className="text-slate-300">
              {showSignup ? "Maak een account aan" : "Login om je race data te bekijken"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-900/20 border-red-500/50">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {!showSignup ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@email.com"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Voer je wachtwoord in"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full text-white"
                style={{ background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inloggen...
                  </>
                ) : (
                  "Inloggen"
                )}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowSignup(true);
                    setError("");
                  }}
                  className="text-sm text-slate-400 hover:text-[#d35481]"
                >
                  Heb je nog geen account? Registreer hier
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-white">Volledige naam</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Jan de Vries"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="je@email.com"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white">Wachtwoord</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Minimaal 6 karakters"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full text-white"
                style={{ background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Account aanmaken...
                  </>
                ) : (
                  "Account aanmaken"
                )}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowSignup(false);
                    setError("");
                  }}
                  className="text-sm text-slate-400 hover:text-[#d35481]"
                >
                  Terug naar login
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
