import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Upload, User, Sparkles, Heart, Eye, ArrowRight } from "lucide-react";
import { useProfileStore } from "../features/profile/profile.store";

export function LandingPage() {
  const profile = useProfileStore((s) => s.profile);
  const hasProfile = profile.allergies.length > 0 || profile.conditions.length > 0;
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero min-h-[85vh] flex flex-col items-center justify-center p-6 text-center relative perspective-1000">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#4E8F68]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#E7A63F]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-lg w-full relative z-10 animate-3d-float transform-style-3d">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 transform-translate-z-20">
            <div className="gradient-primary p-3 rounded-2xl shadow-lg">
              <ShieldCheck size={36} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold text-[var(--color-text)] tracking-tight">
              Safe<span className="text-[var(--color-primary)]">Bite</span>
            </h1>
          </div>

          <p className="text-2xl font-medium text-[var(--color-text)] mb-4 leading-snug transform-translate-z-10">
            Know what's inside your food.
          </p>
          <p className="text-lg text-[var(--color-muted)] mb-10 max-w-md mx-auto leading-relaxed transform-translate-z-10">
            Upload a photo of any food label. SafeBite helps you spot allergens,
            high sugar, high salt, and ingredients that matter to your health profile.
          </p>

          <div className="transform-translate-z-30">
            <Link
              to={hasProfile ? "/app" : "/onboarding"}
              className="inline-flex items-center gap-3 gradient-primary text-white text-xl font-bold py-4 px-10 rounded-2xl shadow-[0_10px_30px_rgba(78,143,104,0.4)] hover:shadow-[0_15px_40px_rgba(78,143,104,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {hasProfile ? <ArrowRight size={24} /> : <Upload size={24} />}
              {hasProfile ? "Go to Dashboard" : "Get Started Free"}
            </Link>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 transform-translate-z-10">
            <p className="text-[var(--color-muted)] text-sm flex items-center justify-center gap-2">
              <Sparkles size={16} />
              No camera needed · 100% free
            </p>
            <p className="text-sm">
              <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
                Already have an account? Log in
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--color-text)] mb-12">
            Built for everyone
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                color: "text-[var(--color-avoid)]",
                bg: "bg-[var(--color-avoid-bg)]",
                title: "Allergy Safe",
                desc: "Instantly spots allergens like peanuts, milk, wheat, soy, and more from your personal avoid list.",
              },
              {
                icon: User,
                color: "text-[var(--color-primary)]",
                bg: "bg-[var(--color-primary-light)]",
                title: "Your Health Profile",
                desc: "Personalized for diabetes, heart health, blood pressure, celiac, and dietary preferences.",
              },
              {
                icon: Eye,
                color: "text-[var(--color-caution)]",
                bg: "bg-[var(--color-caution-bg)]",
                title: "Easy to Read",
                desc: "Large text, high contrast, voice readout, and plain language. Designed for all ages.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card-hover bg-[var(--color-bg)] rounded-2xl p-6 text-center border border-[var(--color-border)]"
              >
                <div className={`${feature.bg} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon size={28} className={feature.color} />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{feature.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--color-text)] mb-12">
            Three simple steps
          </h2>
          <div className="space-y-8">
            {[
              { step: "1", title: "Set your profile", desc: "Select your allergies, health goals, and dietary preferences." },
              { step: "2", title: "Upload a label photo", desc: "Take a clear photo of the ingredients list or nutrition panel." },
              { step: "3", title: "Get instant guidance", desc: "See a clear Safe, Caution, or Avoid result with plain-language reasons." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-5 animate-fade-in">
                <div className="gradient-primary text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-1">{item.title}</h3>
                  <p className="text-[var(--color-muted)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={hasProfile ? "/app/scan" : "/onboarding"}
              className="inline-flex items-center gap-2 gradient-primary text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Scanning
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-8 px-6 text-center">
        <p className="text-[var(--color-muted)] text-sm mb-2">
          SafeBite AI provides educational guidance only. It does not replace medical advice.
        </p>
        <div className="flex items-center justify-center gap-4 text-[var(--color-muted)] text-xs mt-4">
          <p>© 2026 Ayush Narkhede · MIT License</p>
          <span>•</span>
          <Link to="/admin" className="hover:text-[var(--color-primary)] transition-colors">
            Admin Portal
          </Link>
        </div>
      </footer>
    </div>
  );
}
