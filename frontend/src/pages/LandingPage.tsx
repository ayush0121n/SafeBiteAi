import { Link } from "react-router-dom";
import { ShieldCheck, Upload, User, Sparkles, Heart, Eye, ArrowRight, Camera, Activity, Zap } from "lucide-react";
import { useProfileStore } from "../features/profile/profile.store";
import { useState, useEffect } from "react";

export function LandingPage() {
  const profile = useProfileStore((s) => s.profile);
  const hasProfile = (profile.allergies?.length > 0) || (profile.conditions?.length > 0);
  
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-bg)]">
      {/* Hero Section with Parallax */}
      <section 
        className="relative min-h-[95vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden perspective-1000"
      >
        {/* Colorful Animated Gradient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-400/30 to-pink-500/30 blur-[120px] animate-pulse-gentle" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[var(--color-primary)]/30 to-blue-500/30 blur-[120px] animate-pulse-gentle" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-yellow-400/20 to-orange-500/20 blur-[100px] animate-pulse-gentle" style={{ animationDelay: '1s' }} />
        </div>

        {/* Floating SVG Elements (Parallax) */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none hidden md:block"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
           <Activity size={120} className="absolute top-[20%] right-[15%] text-[var(--color-primary)]/20 rotate-12 drop-shadow-xl" />
           <Heart size={100} className="absolute bottom-[25%] left-[10%] text-pink-500/20 -rotate-12 drop-shadow-xl" />
           <Zap size={80} className="absolute top-[30%] left-[15%] text-yellow-500/20 rotate-45 drop-shadow-xl" />
           <Camera size={140} className="absolute bottom-[20%] right-[10%] text-blue-500/20 -rotate-6 drop-shadow-xl" />
        </div>

        <div 
          className="max-w-3xl w-full relative z-10 glass p-8 sm:p-14 rounded-[40px] border-[1.5px] border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.05)]" 
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-blue-500 p-4 rounded-3xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
              <ShieldCheck size={56} className="text-white" />
            </div>
            <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-600 tracking-tighter">
              SafeBite
            </h1>
          </div>

          <p className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-6 leading-tight">
            Know what's inside your food with AI.
          </p>
          <p className="text-xl text-[var(--color-muted)] mb-12 mx-auto leading-relaxed max-w-2xl">
            Upload a photo of any food label or meal. SafeBite instantly spots allergens, analyzes nutrition, and gives personalized health recommendations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to={hasProfile ? "/app/scan" : "/signup"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 btn-premium text-white text-xl font-bold py-5 px-10 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(78,143,104,0.4)]"
            >
              <Upload size={24} />
              {hasProfile ? "Scan Now" : "Start For Free"}
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[var(--color-surface)]/80 backdrop-blur-md text-[var(--color-text)] border-2 border-[var(--color-border)] text-xl font-bold py-5 px-10 rounded-2xl hover:border-[var(--color-primary)] hover:bg-white transition-all shadow-sm"
            >
              Pricing
            </Link>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3">
            <p className="text-[var(--color-muted)] font-medium flex items-center justify-center gap-2 bg-white/50 py-2 px-4 rounded-full shadow-sm">
              <Sparkles size={18} className="text-yellow-500" />
              Powered by Advanced Vision AI · 100% Free
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Features Section */}
      <section className="py-24 px-6 relative z-10 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[var(--color-primary)] inline-block tracking-tight mb-4">
              Intelligent Features for Your Health
            </h2>
            <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
              Everything you need to eat safely and confidently, packed into a beautiful and easy-to-use interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Heart,
                color: "text-pink-600",
                bg: "bg-pink-100",
                title: "Allergy Safe",
                desc: "Instantly spots allergens like peanuts, milk, wheat, soy, and more from your personal avoid list.",
              },
              {
                icon: User,
                color: "text-purple-600",
                bg: "bg-purple-100",
                title: "Personalized Profile",
                desc: "Customized analysis for diabetes, heart health, blood pressure, celiac, and dietary preferences.",
              },
              {
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-100",
                title: "Lightning Fast AI OCR",
                desc: "We use advanced Hugging Face ML models to accurately read ingredient labels in seconds.",
              },
              {
                icon: Eye,
                color: "text-blue-600",
                bg: "bg-blue-100",
                title: "Accessible & Readable",
                desc: "Designed for all ages with large text, high contrast modes, and plain-language summaries.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-8 rounded-[32px] bg-[var(--color-bg)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={32} className={feature.color} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">{feature.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-[var(--color-text)] mb-16 tracking-tight">
            Three simple steps
          </h2>
          <div className="space-y-12">
            {[
              { step: "1", title: "Set your profile", desc: "Select your allergies, health goals, and dietary preferences." },
              { step: "2", title: "Upload a label photo", desc: "Take a clear photo of the ingredients list or nutrition panel." },
              { step: "3", title: "Get instant guidance", desc: "See a clear Safe, Caution, or Avoid result with plain-language reasons." },
            ].map((item, index) => (
              <div key={item.step} className="flex items-start gap-6 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="gradient-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-lg relative">
                  {item.step}
                  {index !== 2 && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-[var(--color-primary)]/50 to-transparent rounded-full" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">{item.title}</h3>
                  <p className="text-[var(--color-muted)] leading-relaxed text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link
              to={hasProfile ? "/app/scan" : "/onboarding"}
              className="inline-flex items-center justify-center gap-3 gradient-primary text-white text-2xl font-bold py-6 px-14 rounded-full shadow-[0_20px_40px_rgba(78,143,104,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              Start Scanning Now
              <ArrowRight size={28} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-10 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[var(--color-muted)] text-sm mb-4 bg-[var(--color-bg)] py-3 px-6 rounded-xl inline-block border border-[var(--color-border)]">
            <span className="font-bold text-[var(--color-text)]">Disclaimer:</span> SafeBite AI provides educational guidance only. It does not replace medical advice.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--color-muted)] text-sm mt-6">
            <p className="font-medium">© 2026 Ayush Narkhede · MIT License</p>
            <span className="text-[var(--color-border)]">|</span>
            <Link to="/pricing" className="font-bold hover:text-[var(--color-primary)] transition-colors">
              Pricing & About
            </Link>
            <span className="text-[var(--color-border)]">|</span>
            <Link to="/admin" className="font-bold hover:text-[var(--color-primary)] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
