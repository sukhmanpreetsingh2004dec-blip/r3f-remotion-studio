import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { PakistanGlobeScene } from '../scenes/PakistanGlobeScene';
import { easeInOut, fadeIn } from '../utils/animation';

/**
 * GlobeZoom — main Remotion composition.
 *
 * Uses ThreeCanvas from @remotion/three for frame-accurate R3F rendering.
 * Camera position is animated using useCurrentFrame().
 */
export const GlobeZoom: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // ── Camera zoom: pull back from z=4 → z=10 for dramatic open, then zoom to z=5 ──
  const cameraZ = easeInOut(frame, 0, fps * 2, 10, 5);

  // ── Title overlay fade in ────────────────────────────────────────────────────────
  const titleOpacity = fadeIn(frame, fps * 3, fps * 1);
  const subtitleOpacity = fadeIn(frame, fps * 3.5, fps * 1);

  // ── Vignette and background ──────────────────────────────────────────────────────
  const bgOpacity = fadeIn(frame, 0, fps * 0.3);

  return (
    <AbsoluteFill>
      {/* ── Deep space background ─────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, #0d1b2a 0%, #020817 60%, #000000 100%)',
          opacity: bgOpacity,
        }}
      />

      {/* ── Subtle star field ─────────────────────────────────────────── */}
      <AbsoluteFill style={{ opacity: bgOpacity * 0.6 }}>
        <svg width={width} height={height} style={{ position: 'absolute' }}>
          {STARS.map((star, i) => (
            <circle
              key={i}
              cx={star.x * width}
              cy={star.y * height}
              r={star.r}
              fill="white"
              opacity={star.o}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* ── Three.js 3D Scene ─────────────────────────────────────────── */}
      <ThreeCanvas
        width={width}
        height={height}
        gl={{ antialias: true, toneMapping: 4 /* ACESFilmicToneMapping */ }}
        camera={{
          fov: 50,
          position: [0, 0.5, cameraZ],
          near: 0.1,
          far: 100,
        }}
      >
        {/* Ambient light — base fill */}
        <ambientLight intensity={0.25} color="#b0c8e8" />

        {/* Key directional light — sunlight from the right */}
        <directionalLight
          position={[5, 3, 5]}
          intensity={1.8}
          color="#ffe8cc"
          castShadow={false}
        />

        {/* Rim light — cool backlight from the left */}
        <directionalLight
          position={[-4, 2, -5]}
          intensity={0.5}
          color="#4488cc"
        />

        {/* ── The 3D Globe Scene ─────────────────────────────────────── */}
        <PakistanGlobeScene />
      </ThreeCanvas>

      {/* ── Text overlays ─────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          padding: '60px 80px',
          pointerEvents: 'none',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            fontSize: 52,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-1px',
            lineHeight: 1.1,
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            opacity: titleOpacity,
            marginBottom: 12,
          }}
        >
          Pakistan
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            fontSize: 22,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.5px',
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            opacity: subtitleOpacity,
          }}
        >
          South Asia · Population 230M · Capital: Islamabad
        </div>
      </AbsoluteFill>

      {/* ── Bottom vignette for cinematic look ────────────────────────── */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)',
          opacity: bgOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

// ── Pre-seeded deterministic star field (no Math.random() at render time) ────
const STARS = [
  { x: 0.05, y: 0.08, r: 1.2, o: 0.9 }, { x: 0.12, y: 0.22, r: 0.8, o: 0.6 },
  { x: 0.18, y: 0.05, r: 1.5, o: 0.7 }, { x: 0.25, y: 0.35, r: 0.6, o: 0.8 },
  { x: 0.33, y: 0.12, r: 1.0, o: 0.5 }, { x: 0.42, y: 0.28, r: 0.9, o: 0.7 },
  { x: 0.55, y: 0.07, r: 1.3, o: 0.9 }, { x: 0.61, y: 0.42, r: 0.7, o: 0.6 },
  { x: 0.72, y: 0.15, r: 1.1, o: 0.8 }, { x: 0.80, y: 0.33, r: 0.5, o: 0.5 },
  { x: 0.88, y: 0.09, r: 1.4, o: 0.7 }, { x: 0.93, y: 0.25, r: 0.8, o: 0.9 },
  { x: 0.07, y: 0.55, r: 0.6, o: 0.5 }, { x: 0.15, y: 0.68, r: 1.2, o: 0.7 },
  { x: 0.22, y: 0.78, r: 0.7, o: 0.6 }, { x: 0.35, y: 0.62, r: 1.0, o: 0.8 },
  { x: 0.48, y: 0.85, r: 0.9, o: 0.5 }, { x: 0.58, y: 0.72, r: 1.3, o: 0.7 },
  { x: 0.68, y: 0.58, r: 0.5, o: 0.9 }, { x: 0.75, y: 0.82, r: 1.1, o: 0.6 },
  { x: 0.85, y: 0.65, r: 0.8, o: 0.8 }, { x: 0.92, y: 0.75, r: 1.4, o: 0.5 },
  { x: 0.03, y: 0.90, r: 0.6, o: 0.7 }, { x: 0.97, y: 0.10, r: 1.0, o: 0.9 },
  { x: 0.50, y: 0.50, r: 0.4, o: 0.4 }, { x: 0.30, y: 0.90, r: 1.2, o: 0.6 },
];
