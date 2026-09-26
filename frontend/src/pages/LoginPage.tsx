import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn("Using mock auth bypass since VITE_SUPABASE_URL is missing.");
        localStorage.setItem("safebite_mock_auth", "true");
        navigate("/app");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <div className="max-w-md w-full bg-[var(--color-surface)] p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[var(--color-border)] animate-slide-up perspective-1000">
        <div className="text-center mb-8 transform-style-3d">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-4 transform-translate-z-20">
            <ShieldCheck size={40} className="animate-pulse-gentle" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2 transform-translate-z-10">Welcome back</h1>
          <p className="text-[var(--color-muted)]">Sign in to your SafeBite account</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--color-text)] mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-text)] mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl shadow-[0_4px_20px_rgba(78,143,104,0.3)] hover:shadow-[0_8px_30px_rgba(78,143,104,0.5)] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex justify-center mt-6"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-[var(--color-muted)]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[var(--color-primary)] font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
