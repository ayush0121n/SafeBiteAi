import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Users, Activity, LogOut, Check, X, Bell, Menu } from "lucide-react";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock Feature Flags for MVP
  const [features, setFeatures] = useState({
    parentalControls: true,
    mlLabelDetection: false,
    offlineMode: true,
    experimentalOcr: false
  });

  useEffect(() => {
    if (localStorage.getItem("safebite_admin_auth") !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("safebite_admin_auth");
    navigate("/admin");
  };

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Settings className="text-[var(--color-primary)]" size={24} />
          <h1 className="text-xl font-bold text-[var(--color-text)]">Admin</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[var(--color-text)]">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`w-full md:w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] p-6 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block md:min-h-screen flex-shrink-0 relative`}>
        <div className="items-center gap-2 mb-8 hidden md:flex">
          <Settings className="text-[var(--color-primary)]" />
          <h1 className="text-xl font-bold text-[var(--color-text)]">Admin Panel</h1>
        </div>

        <nav className="space-y-2 mb-10">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "features", label: "Feature Flags", icon: Settings },
            { id: "users", label: "Users & Roles", icon: Users },
            { id: "alerts", label: "System Alerts", icon: Bell },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 md:py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? "bg-[var(--color-primary)] text-white" 
                  : "text-[var(--color-muted)] hover:bg-[var(--color-bg)]"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="md:absolute md:bottom-6 flex w-full md:w-auto items-center gap-2 text-[var(--color-muted)] hover:text-red-500 font-medium px-4 py-2 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 capitalize">{activeTab.replace("-", " ")}</h2>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
                <p className="text-[var(--color-muted)] text-sm font-bold uppercase tracking-wider mb-2">Total Active Users</p>
                <p className="text-4xl font-bold text-[var(--color-text)]">2,492</p>
             </div>
             <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
                <p className="text-[var(--color-muted)] text-sm font-bold uppercase tracking-wider mb-2">Scans Today</p>
                <p className="text-4xl font-bold text-[var(--color-primary)]">14,801</p>
             </div>
             <div className="bg-[var(--color-avoid-bg)] p-6 rounded-2xl border border-[var(--color-avoid)] shadow-sm">
                <p className="text-[var(--color-avoid)] text-sm font-bold uppercase tracking-wider mb-2">High Risk Alerts</p>
                <p className="text-4xl font-bold text-[var(--color-avoid)]">843</p>
             </div>
          </div>
        )}

        {activeTab === "features" && (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
             <div className="p-6 border-b border-[var(--color-border)]">
               <h3 className="font-bold text-[var(--color-text)]">Application Features</h3>
               <p className="text-sm text-[var(--color-muted)]">Toggle experimental and core features across the platform.</p>
             </div>
             <div className="divide-y divide-[var(--color-border)]">
               {[
                 { key: "parentalControls", label: "Parental Controls", desc: "Enable strict safety locks for children's profiles." },
                 { key: "mlLabelDetection", label: "ML Label Detection", desc: "Use the new paddle-based YOLO models for bounding boxes." },
                 { key: "offlineMode", label: "Offline Mode", desc: "Enable the offline emergency checklist." },
                 { key: "experimentalOcr", label: "Experimental OCR Engine", desc: "Route 10% of traffic to the new V2 OCR API." },
               ].map((feat) => (
                 <div key={feat.key} className="p-6 flex items-center justify-between">
                   <div>
                     <p className="font-bold text-[var(--color-text)]">{feat.label}</p>
                     <p className="text-sm text-[var(--color-muted)]">{feat.desc}</p>
                   </div>
                   <button 
                     onClick={() => toggleFeature(feat.key as keyof typeof features)}
                     className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${
                       features[feat.key as keyof typeof features] ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                     }`}
                   >
                     <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                       features[feat.key as keyof typeof features] ? 'translate-x-6' : 'translate-x-0'
                     }`} />
                   </button>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab !== "overview" && activeTab !== "features" && (
          <div className="bg-[var(--color-surface)] p-12 rounded-2xl border border-[var(--color-border)] shadow-sm text-center">
             <Settings className="mx-auto h-16 w-16 text-[var(--color-muted)] opacity-50 mb-4" />
             <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Module under development</h3>
             <p className="text-[var(--color-muted)]">This section is part of Phase 3 development.</p>
          </div>
        )}
      </div>
    </div>
  );
}
