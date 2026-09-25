import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock } from "lucide-react";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@safebiteai.com" && password === "Admin@123") {
      // For MVP, just use localStorage to track admin state
      localStorage.setItem("safebite_admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-[var(--color-primary)]" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text)]">
          SafeBite AI Admin
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
          Authorized personnel only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--color-surface)] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[var(--color-border)]">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white gradient-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
              >
                <Lock className="w-5 h-5 mr-2" />
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
