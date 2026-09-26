import { Check, Info } from "lucide-react";
import { Link } from "react-router-dom";

export function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* Header */}
      <div className="pt-20 pb-16 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-text)] mb-6 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
          Start for free, upgrade when you need advanced intelligence.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        
        {/* Basic Tier */}
        <div className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-3xl p-8 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Basic</h2>
          <p className="text-[var(--color-muted)] mb-6">Perfect for everyday scanning.</p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-extrabold text-[var(--color-text)]">$0</span>
            <span className="text-[var(--color-muted)]">/ forever</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            {["100 scans per month", "Basic allergy alerts (Top 9 allergens)", "Standard OCR text extraction", "Access to Learn library"].map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="text-[var(--color-primary)] shrink-0" size={20} />
                <span className="text-[var(--color-text)] font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Link to="/signup" className="block w-full py-4 text-center rounded-2xl font-bold border-2 border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors">
            Get Started
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="bg-[var(--color-surface)] border-4 border-[var(--color-primary)] rounded-3xl p-8 shadow-xl relative transform md:-translate-y-4">
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
            {["Unlimited food & meal scans", "Deep personalization (Medications, diet goals)", "Cross-contamination detection", "Early access to AI features", "Priority support"].map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="text-[var(--color-primary)] shrink-0" size={20} />
                <span className="text-[var(--color-text)] font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Link to="/signup" className="block w-full py-4 text-center rounded-2xl font-bold bg-[var(--color-primary)] text-white hover:opacity-90 shadow-lg transition-opacity">
            Upgrade to Pro
          </Link>
        </div>

      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <h2 className="text-3xl font-extrabold text-[var(--color-text)] mb-6">About SafeBite AI</h2>
        <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">
          SafeBite was built with a simple mission: to make food safety accessible to everyone. We believe you shouldn't need a medical degree to understand what's in your food. By combining advanced Machine Learning OCR with deeply personalized health profiles, we empower you to make safe, confident dietary choices in seconds.
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
      </div>

    </div>
  );
}
