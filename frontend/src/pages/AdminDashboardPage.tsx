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

        {activeTab === "users" && (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[var(--color-text)]">User Management</h3>
                <p className="text-sm text-[var(--color-muted)]">Manage registered users and permissions.</p>
              </div>
              <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-bold hover:opacity-90">
                + Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                    <th className="p-4 font-bold text-[var(--color-muted)] text-sm">User</th>
                    <th className="p-4 font-bold text-[var(--color-muted)] text-sm">Role</th>
                    <th className="p-4 font-bold text-[var(--color-muted)] text-sm">Status</th>
                    <th className="p-4 font-bold text-[var(--color-muted)] text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {[
                    { name: "Ayush Narkhede", email: "ayush@safebiteai.com", role: "Admin", status: "Active" },
                    { name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
                    { name: "Jane Smith", email: "jane@example.com", role: "User", status: "Suspended" }
                  ].map((user, idx) => (
                    <tr key={idx} className="hover:bg-[var(--color-bg)] transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-[var(--color-text)]">{user.name}</p>
                        <p className="text-sm text-[var(--color-muted)]">{user.email}</p>
                      </td>
                      <td className="p-4 text-[var(--color-text)]">{user.role}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-[var(--color-primary)] hover:underline text-sm font-bold">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-4">
            {[
              { title: "High load detected on OCR Container", time: "10 mins ago", type: "warning", desc: "API response times are exceeding 2000ms. Consider scaling up the ML container." },
              { title: "New allergen alias mapped", time: "2 hours ago", type: "info", desc: "System auto-mapped 'arachis oil' to 'peanuts' globally." },
              { title: "Database backup completed", time: "1 day ago", type: "success", desc: "Daily snapshot created successfully." }
            ].map((alert, idx) => (
               <div key={idx} className={`p-6 rounded-2xl border ${
                 alert.type === "warning" ? "border-orange-300 bg-orange-50" : 
                 alert.type === "info" ? "border-blue-300 bg-blue-50" : 
                 "border-green-300 bg-green-50"
               }`}>
                 <div className="flex justify-between items-start mb-2">
                   <h3 className={`font-bold ${
                     alert.type === "warning" ? "text-orange-800" : 
                     alert.type === "info" ? "text-blue-800" : 
                     "text-green-800"
                   }`}>{alert.title}</h3>
                   <span className="text-xs text-gray-500 font-medium">{alert.time}</span>
                 </div>
                 <p className="text-gray-700 text-sm">{alert.desc}</p>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
