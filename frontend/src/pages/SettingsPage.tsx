import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Bell, Shield, Smartphone, Globe, Activity } from "lucide-react";
import { useProfileStore } from "../features/profile/profile.store";

export function SettingsPage() {
  const profile = useProfileStore((s) => s.profile);
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [offlineSync, setOfflineSync] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert("Settings saved successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in space-y-6">
      <Link to="/app" className="text-[var(--color-primary)] font-bold flex items-center gap-2 mb-4">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-2">Settings</h1>
        <p className="text-lg text-[var(--color-muted)] font-medium mb-8">Manage your app preferences and account settings.</p>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Notifications */}
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <Bell className="text-[var(--color-primary)]" /> Notifications
            </h2>
            <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
              <div>
                <p className="font-bold text-[var(--color-text)]">Push Notifications</p>
                <p className="text-sm text-[var(--color-muted)]">Receive alerts for high-risk scans or new features.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
          </div>

          {/* Privacy & Security */}
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <Shield className="text-[var(--color-primary)]" /> Privacy & Security
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                <div>
                  <p className="font-bold text-[var(--color-text)]">Anonymous Data Sharing</p>
                  <p className="text-sm text-[var(--color-muted)]">Help us improve SafeBite by sharing anonymous scan data.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={dataSharing} onChange={(e) => setDataSharing(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Device & Offline */}
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <Smartphone className="text-[var(--color-primary)]" /> Device & Offline
            </h2>
            <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
              <div>
                <p className="font-bold text-[var(--color-text)]">Offline Database Sync</p>
                <p className="text-sm text-[var(--color-muted)]">Keep your allergen aliases cached for offline emergency use.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={offlineSync} onChange={(e) => setOfflineSync(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <Globe className="text-[var(--color-primary)]" /> Account
            </h2>
            <div className="p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] space-y-4">
              <div>
                <p className="text-sm text-[var(--color-muted)] uppercase font-bold tracking-wider mb-1">Email</p>
                <p className="font-bold text-[var(--color-text)]">{profile.name.toLowerCase().replace(" ", "") || "user"}@example.com</p>
              </div>
              <button type="button" className="text-red-500 font-bold hover:underline">
                Delete Account
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--color-border)] flex justify-end">
             <button type="submit" className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
               <Save size={20} /> Save Preferences
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
