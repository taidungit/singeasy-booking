import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/royal-logo.avif";

const Register = () => {
  const { state, register, clearError } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 1. Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated) navigate("/dashboard");
  }, [state.isAuthenticated, navigate]);

  // 2. Clear auth errors on component unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛠️ 1. CHECK VALIDATION PHÍA FRONTEND (Bọc lót chống null / rỗng)
    if (!name.trim()) {
      return toast.error("Missing Information", {
        description: "Please enter your full name.",
      });
    }

    if (!email.trim()) {
      return toast.error("Missing Information", {
        description: "Please enter your email address.",
      });
    }

    // Kiểm tra định dạng Email cơ bản bằng Regex để tránh gửi rác lên Spring Boot
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Invalid Email", {
        description: "Please enter a valid email address (e.g., alex@example.com).",
      });
    }

    if (password.length < 6) {
      return toast.error("Invalid Password", {
        description: "Password must be at least 6 characters long.",
      });
    }
    
    try {
      // Execute registration context action
      await register(name.trim(), email.trim(), password);
      
      toast.success("Account created successfully!", {
        description: "Redirecting you to the login page...",
        duration: 2000,
      });

      navigate("/login");
    } catch (err: unknown) {
      // Ép kiểu an toàn vượt qua ESLint khắt khe, bốc chuẩn "Email already exists!" từ Backend về
      const errorWithDetail = err as { message?: string };
      const errorMessage =
        errorWithDetail?.message ||
        (typeof err === "string" ? err : null) ||
        String(err) ||
        "An unexpected error occurred.";

      toast.error("Registration Failed", {
        description: errorMessage,
      });
    }
  };

  const passwordStrength = password.length >= 8 ? "strong" : password.length >= 5 ? "medium" : password.length > 0 ? "weak" : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md">
        
        {/* Header Section (Giữ nguyên w-20 h-20 theo ý bạn) */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/" className="group inline-block mb-5">
            <div className="w-20 h-20 relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950 shadow-xl shadow-primary/5 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-primary/10 flex items-center justify-center">
              <img 
                src={logo} 
                alt="SingEasy Logo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Start booking karaoke rooms in seconds</p>
        </div>

        {/* Form Container */}
        <div className="bg-background rounded-2xl card-shadow p-8">
          {/* noValidate dùng để chặn đứng hoàn toàn bong bóng cũ kỹ của HTML5 */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              
              {/* Password Strength Meter */}
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
                  <span className={`text-xs font-medium uppercase tracking-wider ${
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