import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Activity, Heart, Zap, Camera, Leaf } from "lucide-react";

export function AnimatedBackground({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 180 * intensity]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -140 * intensity]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100 * intensity]);

  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[var(--color-primary)]/15 via-purple-400/10 to-transparent blur-[110px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-blue-400/15 via-[var(--color-primary)]/10 to-transparent blur-[120px]"
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-[40%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-amber-300/10 to-orange-400/8 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Anti-gravity floating icons */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[16%] right-[11%] opacity-[0.12]"
        animate={{ y: [0, -28, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Activity size={120} className="text-[var(--color-primary)] drop-shadow-2xl" />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[20%] left-[7%] opacity-[0.12]"
        animate={{ y: [0, -22, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <Heart size={100} className="text-pink-500 drop-shadow-2xl" />
      </motion.div>

      <motion.div
        className="absolute top-[32%] left-[13%] opacity-[0.10]"
        animate={{ y: [0, -32, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <Zap size={85} className="text-amber-500 drop-shadow-xl" />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-[15%] right-[9%] opacity-[0.10]"
        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <Camera size={130} className="text-blue-500 drop-shadow-2xl" />
      </motion.div>

      <motion.div
        className="absolute top-[55%] right-[22%] opacity-[0.09]"
        animate={{ y: [0, -25, 0], rotate: [0, 7, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
      >
        <Leaf size={70} className="text-emerald-500 drop-shadow-xl" />
      </motion.div>
    </div>
  );
}
