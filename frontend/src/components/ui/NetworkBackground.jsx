import React from 'react';
import { motion } from 'framer-motion';

export default function NetworkBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Soft radar / grid circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-cyan-900/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-900/20 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-purple-900/20 rounded-full" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-400/20 rounded-full border-dashed" 
        style={{ animation: 'spin-slow 30s linear infinite' }} 
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-purple-400/20 rounded-full border-dotted" 
        style={{ animation: 'spin-slow 20s linear reverse infinite' }} 
      />

      {/* SVG Network Lines and Hexagon Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.4)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0.4)" />
          </linearGradient>
          {/* Hexagon Pattern for Anime Tech Vibe */}
          <pattern id="hexGrid" width="60" height="103.923" patternUnits="userSpaceOnUse" patternTransform="scale(0.6)">
             <path d="M30 0L60 17.32L60 51.96L30 69.28L0 51.96L0 17.32Z" fill="none" stroke="rgba(168,85,247,0.07)" strokeWidth="1"/>
             <path d="M30 103.923L60 86.603L60 51.96L30 34.641L0 51.96L0 86.603Z" fill="none" stroke="rgba(168,85,247,0.07)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexGrid)" />
        
        {/* Animated Tech / Web Connections */}
        <motion.path 
          d="M 10%,10% L 30%,25% L 50%,15% L 80%,40%" 
          fill="none" 
          stroke="url(#lineGrad)" 
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path 
          d="M 90%,20% L 60%,50% L 85%,80% L 50%,90%" 
          fill="none" 
          stroke="url(#lineGrad)" 
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
        />
        <motion.path 
          d="M 20%,90% L 40%,60% L 25%,30% L 40%,10%" 
          fill="none" 
          stroke="url(#lineGrad)" 
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      {/* Floating Data Nodes (Orbs) */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            background: i % 3 === 0 ? '#06b6d4' : (i % 3 === 1 ? '#a855f7' : '#ffffff'),
            boxShadow: `0 0 12px ${i % 3 === 0 ? '#06b6d4' : '#a855f7'}`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, Math.random() * -60 - 20, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.1, 0.9, 0.1]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3
          }}
        />
      ))}
    </div>
  );
}
