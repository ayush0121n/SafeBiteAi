import { Link } from "react-router-dom";
import { ShieldCheck, Upload, User, Sparkles, Heart, Eye, ArrowRight, Camera, Activity, Zap } from "lucide-react";
import { useProfileStore } from "../features/profile/profile.store";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedBackground } from "../components/ui/AnimatedBackground";

const features = [
  {
    icon: Heart,
    color: "text-pink-600",
    bg: "bg-pink-50",
    title: "Allergy Safe",
    desc: "Instantly spots allergens like peanuts, milk, wheat, soy, and more from your personal avoid list.",
  },
  {
    icon: User,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Personalized Profile",
    desc: "Customized analysis for diabetes, heart health, blood pressure, celiac, and dietary preferences.",
  },
  {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50",
    title: "Lightning Fast AI OCR",
    desc: "We use YOLOv8 + PaddleOCR to accurately read ingredient labels in seconds.",
  },
  {
    icon: Eye,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Accessible & Readable",
    desc: "Designed for all ages with large text, high contrast modes, and plain-language summaries.",
  },
];

const steps = [
  { step: "1", title: "Set your profile", desc: "Select your allergies, health goals, and dietary preferences." },
  { step: "2", title: "Upload a label photo", desc: "Take a clear photo of the ingredients list or nutrition panel." },
  { step: "3", title: "Get instant guidance", desc: "See a clear Safe, Caution, or Avoid result with plain-language reasons." },
];

export function LandingPage() {
  const profile = useProfileStore((s) => s.profile);
  const hasProfile = (profile.allergies?.length > 0) || (profile.conditions?.length > 0);

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-bg)] relative">
      <AnimatedBackground intensity={0.9} />

      {/* ── Hero ── */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 50, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl w-full relative z-10 bg-[var(--color-surface)]/80 backdrop-blur-sm p-8 sm:p-14 rounded-[40px] border border-[var(--color-border)] shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
        >
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-blue-500 p-4 rounded-3xl shadow-xl">
              <ShieldCheck size={56} className="text-white" />
            </div>
            <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-600 tracking-tighter">
              SafeBite
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-6 leading-tight"
          >
            Know what's inside your food with AI.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-xl text-[var(--color-muted)] mb-12 mx-auto leading-relaxed max-w-2xl"
          >
            Upload a photo of any food label or meal. SafeBite instantly spots allergens, analyzes nutrition, and gives personalized health recommendations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={hasProfile ? "/app/scan" : "/signup"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gray-900 text-white text-xl font-bold py-5 px-10 rounded-2xl hover:bg-black transition-all shadow-[0_15px_30px_rgba(0,0,0,0.25)]"
              >
                <Upload size={24} />
                {hasProfile ? "Scan Now" : "Start For Free"}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[var(--color-surface)] text-[var(--color-text)] border-2 border-[var(--color-border)] text-xl font-bold py-5 px-10 rounded-2xl hover:border-[var(--color-primary)] transition-all shadow-sm"
              >
                Pricing
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <p className="text-[var(--color-muted)] font-medium flex items-center gap-2 bg-[var(--color-bg)] py-2 px-4 rounded-full shadow-sm border border-[var(--color-border)]">
              <Sparkles size={18} className="text-yellow-500" />
              Powered by YOLOv8 + PaddleOCR · 100% Free
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 relative z-10 bg-[var(--color-surface)]/70 backdrop-blur-sm border-t border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[var(--color-primary)] inline-block tracking-tight mb-4">
              Intelligent Features for Your Health
            </h2>
            <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
              Everything you need to eat safely and confidently.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.07)" }}
                className="group p-8 rounded-[32px] bg-[var(--color-bg)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors duration-300 relative overflow-hidden cursor-default"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[var(--color-primary)]/8 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={32} className={feature.color} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">{feature.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-center text-[var(--color-text)] mb-16 tracking-tight"
          >
            Three simple steps
          </motion.h2>

          <div className="space-y-12">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex items-start gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="gradient-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-lg relative cursor-default"
                >
                  {item.step}
                  {index !== 2 && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-[var(--color-primary)]/50 to-transparent rounded-full" />
                  )}
                </motion.div>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">{item.title}</h3>
                  <p className="text-[var(--color-muted)] leading-relaxed text-lg">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-20"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={hasProfile ? "/app/scan" : "/onboarding"}
                className="inline-flex items-center justify-center gap-3 bg-gray-900 text-white text-2xl font-bold py-6 px-14 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.25)] hover:bg-black transition-all"
              >
                Start Scanning Now
                <ArrowRight size={28} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-10 px-6 text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-[var(--color-muted)] text-sm mb-4 bg-[var(--color-bg)] py-3 px-6 rounded-xl inline-block border border-[var(--color-border)]">
            <span className="font-bold text-[var(--color-text)]">Disclaimer:</span> SafeBite AI provides educational guidance only. It does not replace medical advice.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--color-muted)] text-sm mt-6">
            <p className="font-medium">© 2026 Ayush Narkhede · MIT License</p>
            <span className="text-[var(--color-border)]">|</span>
            <Link to="/pricing" className="font-bold hover:text-[var(--color-primary)] transition-colors">Pricing & About</Link>
            <span className="text-[var(--color-border)]">|</span>
            <Link to="/admin" className="font-bold hover:text-[var(--color-primary)] transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
