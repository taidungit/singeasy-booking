import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Register = () => {
  const { state, register, clearError } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.isAuthenticated) navigate("/dashboard");
  }, [state.isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, email, password);
  };

  const passwordStrength = password.length >= 8 ? "strong" : password.length >= 5 ? "medium" : password.length > 0 ? "weak" : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold">E</span>
            </div>
            <span className="font-bold text-xl text-foreground">Echo</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Start booking karaoke rooms in seconds</p>
        </div>

        <div className="bg-background rounded-2xl card-shadow p-8">
          {state.error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {state.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-sm border border-border rounded-xl px-3 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground"
                placeholder="Alex Chen"
              />
            </div>
            <div>
              <label className="field-label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-sm border border-border rounded-xl px-3 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full text-sm border border-border rounded-xl px-3 py-3 pr-10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordStrength && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1 flex-1">
                    {["weak", "medium", "strong"].map((level, i) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength === "weak" && i === 0 ? "bg-destructive" :
                          passwordStrength === "medium" && i <= 1 ? "bg-warning" :
                          passwordStrength === "strong" ? "bg-success" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength === "weak" ? "text-destructive" :
                    passwordStrength === "medium" ? "text-warning" : "text-success"
                  }`}>{passwordStrength}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-base font-bold"
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="flex items-start gap-2 mt-4 text-xs text-muted-foreground">
            <CheckCircle className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
