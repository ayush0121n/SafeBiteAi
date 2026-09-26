import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Camera, LayoutDashboard, History, User, ShieldCheck, Sun, Moon, Type, Sparkles } from "lucide-react";
import { useAccessibilityStore } from "../../features/accessibility/accessibility.store";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { largeText, highContrast, toggleLargeText, toggleHighContrast, load } = useAccessibilityStore();

  useEffect(() => { 
    load(); 
    // Basic route protection
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [load, navigate]);

  const navItems = [
    { name: "Dashboard", path: "/app", icon: LayoutDashboard },
    { name: "Scan", path: "/app/scan", icon: Camera },
    { name: "History", path: "/app/history", icon: History },
    { name: "Features", path: "/app/features", icon: Sparkles },
    { name: "Profile", path: "/app/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <Link to="/app" className="flex items-center gap-2">
          <div className="gradient-primary p-1.5 rounded-lg">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-[var(--color-text)]">SafeBite</h1>
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleLargeText}
            className={`p-2 rounded-lg transition-colors ${largeText ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]" : "text-[var(--color-muted)] hover:bg-[var(--color-bg)]"}`}
            aria-label="Toggle large text"
            title="Large text"
          >
            <Type size={18} />
          </button>
          <button
            onClick={toggleHighContrast}
            className={`p-2 rounded-lg transition-colors ${highContrast ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]" : "text-[var(--color-muted)] hover:bg-[var(--color-bg)]"}`}
            aria-label="Toggle high contrast"
            title="High contrast"
          >
            {highContrast ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] min-h-screen sticky top-0">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-xl">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">SafeBite</h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-colors ${
                  active
                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--color-border)] flex flex-col gap-2">
          <button
            onClick={toggleLargeText}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-colors ${largeText ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold" : "text-[var(--color-muted)] hover:bg-[var(--color-bg)]"}`}
          >
            <Type size={20} />
            <span className="text-sm">Large Text</span>
          </button>
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-colors ${highContrast ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold" : "text-[var(--color-muted)] hover:bg-[var(--color-bg)]"}`}
          >
            {highContrast ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm">High Contrast</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] z-20">
        <div className="max-w-2xl mx-auto flex justify-around py-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-xl min-w-[64px] min-h-[48px] transition-colors ${
                  active
                    ? "text-[var(--color-primary)] font-bold"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
