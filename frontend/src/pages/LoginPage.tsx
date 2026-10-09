import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { AnimatedBackground } from "../components/ui/AnimatedBackground";

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

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)] relative">
      <AnimatedBackground intensity={0.4} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-[var(--color-surface)] p-8 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.07)] border border-[var(--color-border)] relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-4"
          >
            <ShieldCheck size={40} />
          </motion.div>
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Welcome back</h1>
          <p className="text-[var(--color-muted)]">Sign in to your SafeBite account</p>
        </div>

        <div className="bg-[var(--color-caution-bg)] border border-[var(--color-caution)] text-[var(--color-caution)] p-3 rounded-lg text-sm mb-6 text-center shadow-sm">
          <strong>Demo Mode:</strong> Authentication is currently bypassed for demo purposes. Any email/password will log you into a local guest session.
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-avoid-bg)] text-[var(--color-avoid)] p-3 rounded-lg text-sm font-bold mb-6 text-center"
          >
            {error}
          </motion.div>
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

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl shadow-[0_4px_20px_rgba(78,143,104,0.3)] hover:shadow-[0_8px_30px_rgba(78,143,104,0.5)] transition-shadow disabled:opacity-70 flex justify-center mt-6"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-[var(--color-muted)]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[var(--color-primary)] font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
