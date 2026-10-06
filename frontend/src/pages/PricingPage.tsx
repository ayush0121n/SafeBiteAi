import { Check, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedBackground } from "../components/ui/AnimatedBackground";

const basicFeatures = [
  "100 scans per month",
  "Basic allergy alerts (Top 9 allergens)",
  "Standard OCR text extraction",
  "Access to Learn library",
];

const proFeatures = [
  "Unlimited food & meal scans",
  "Deep personalization (Medications, diet goals)",
  "Cross-contamination detection",
  "Early access to AI features",
  "Priority support",
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 relative">
      <AnimatedBackground intensity={0.5} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pt-20 pb-16 px-6 text-center relative z-10"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-text)] mb-6 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
          Start for free, upgrade when you need advanced intelligence.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 relative z-10">

        {/* Basic */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.07)" }}
          className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-3xl p-8 transition-colors duration-300"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Basic</h2>
          <p className="text-[var(--color-muted)] mb-6">Perfect for everyday scanning.</p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-extrabold text-[var(--color-text)]">$0</span>
            <span className="text-[var(--color-muted)]">/ forever</span>
          </div>

          <ul className="space-y-4 mb-8">
            {basicFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="text-[var(--color-primary)] shrink-0 mt-0.5" size={20} />
                <span className="text-[var(--color-text)] font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/signup"
              className="block w-full py-4 text-center rounded-2xl font-bold border-2 border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>

        {/* Pro */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(78,143,104,0.2)" }}
          className="bg-[var(--color-surface)] border-4 border-[var(--color-primary)] rounded-3xl p-8 shadow-xl relative md:-translate-y-4 transition-colors duration-300"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md uppercase tracking-wider">
            Most Popular
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Pro</h2>
          <p className="text-[var(--color-muted)] mb-6">Deep personalization & unlimited power.</p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-extrabold text-[var(--color-text)]">$4.99</span>
            <span className="text-[var(--color-muted)]">/ month</span>
          </div>

          <ul className="space-y-4 mb-8">
            {proFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="text-[var(--color-primary)] shrink-0 mt-0.5" size={20} />
                <span className="text-[var(--color-text)] font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/signup"
              className="block w-full py-4 text-center rounded-2xl font-bold bg-[var(--color-primary)] text-white hover:opacity-90 shadow-lg transition-opacity"
            >
              Upgrade to Pro
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 mt-32 text-center relative z-10"
      >
        <h2 className="text-3xl font-extrabold text-[var(--color-text)] mb-6">About SafeBite AI</h2>
        <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">
          SafeBite was built with a simple mission: to make food safety accessible to everyone. We believe you shouldn't need a medical degree to understand what's in your food. By combining advanced Machine Learning with deeply personalized health profiles, we empower you to make safe, confident dietary choices in seconds.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-blue-900 inline-block text-left">
          <div className="flex items-center gap-3 font-bold mb-2">
            <Info className="text-blue-600" />
            Our Promise
          </div>
          <p className="text-sm leading-relaxed">
            We will never sell your health data. Your profile is strictly used to provide you with the most accurate and safe food recommendations possible.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
