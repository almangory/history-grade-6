import React from "react";
import { motion } from "motion/react";

export const LessonCalmBackground: React.FC = () => {
  // 6 slow floating decorative shapes reflecting Sudan's golden deserts & historic warmth
  const particles = [
    { id: 1, size: 70, top: "10%", left: "15%", delay: 0, duration: 32, x: [0, 40, -30, 0], y: [0, -50, 30, 0], bg: "bg-amber-600/10" },
    { id: 2, size: 110, top: "65%", left: "70%", delay: 3, duration: 45, x: [0, -50, 40, 0], y: [0, 60, -40, 0], bg: "bg-amber-700/10" },
    { id: 3, size: 50, top: "35%", left: "85%", delay: 1.5, duration: 25, x: [0, 30, -25, 0], y: [0, -40, 20, 0], bg: "bg-yellow-600/10" },
    { id: 4, size: 90, top: "80%", left: "10%", delay: 4.5, duration: 38, x: [0, -40, 30, 0], y: [0, 50, -30, 0], bg: "bg-orange-600/10" },
    { id: 5, size: 60, top: "5%", left: "55%", delay: 2.2, duration: 28, x: [0, 35, -35, 0], y: [0, -30, 40, 0], bg: "bg-amber-500/10" },
    { id: 6, size: 85, top: "45%", left: "30%", delay: 1, duration: 35, x: [0, -35, 35, 0], y: [0, -45, 15, 0], bg: "bg-yellow-700/10" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-multiply rounded-3xl" style={{ direction: "ltr" }}>
      {/* 1. Deep ethereal ambient slow color pulse */}
      <motion.div 
        animate={{ 
          scale: [1, 1.08, 0.92, 1],
          opacity: [0.15, 0.35, 0.15, 0.15]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-transparent to-amber-200/20 blur-3xl"
      />
      
      {/* 2. Floating parchment dust particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full border border-amber-900/[0.04] backdrop-blur-[1px] ${p.bg}`}
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
          }}
          animate={{
            x: p.x,
            y: p.y,
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 3. Subtle slow moving diagonal beams (Parchment rays) */}
      <motion.div
        animate={{
          opacity: [0.03, 0.08, 0.03],
          x: [-20, 20, -20]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.15)_0%,transparent_60%)]"
      />
    </div>
  );
};
