import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, LogIn } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For MVP, skip real authentication and just go to dashboard
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center animate-fade-in">
        <Link to="/" className="inline-block">
          <div className="gradient-primary p-3 rounded-2xl shadow-lg mx-auto w-16 h-16 flex items-center justify-center">
            <ShieldCheck size={36} className="text-white" />
          </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text)]">
          Welcome back to SafeBite
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
          Sign in to access your health profile
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in" style={{animationDelay: "0.1s"}}>
        <div className="bg-[var(--color-surface)] py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-[var(--color-border)]">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-[var(--color-border)] rounded-xl shadow-sm bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-[var(--color-border)] rounded-xl shadow-sm bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border)] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--color-text)]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[var(--color-primary)] hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white gradient-primary hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--color-surface)] text-[var(--color-muted)]">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/onboarding"
                className="w-full flex justify-center py-3 px-4 border-2 border-[var(--color-border)] rounded-xl shadow-sm text-sm font-bold text-[var(--color-text)] bg-[var(--color-bg)] hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all"
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
