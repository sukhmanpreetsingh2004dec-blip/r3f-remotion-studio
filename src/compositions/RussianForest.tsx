import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, Easing } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { RussianForestScene } from '../scenes/RussianForestScene';
import { easeOut, fadeIn } from '../utils/animation';

/**
 * RussianForest — cinematic aerial drone shot over snow-covered Russian pine forest at dawn.
 *
 * Duration: 8 seconds (240 frames at 30fps)
 * Camera: slow descending drone push-in
 * Transition: fade from black
 */
export const RussianForest: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const TOTAL = fps * 8;

  // ── Drone camera: high & far → lower & closer ─────────────────────────────
  const camY = easeOut(frame, 0, TOTAL, 28, 12);
  const camZ = easeOut(frame, 0, TOTAL, 55, 22);
  const camFov = interpolate(frame, [0, TOTAL], [38, 52], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  // ── Fade from black: 0→1s ─────────────────────────────────────────────────
  const fadeFromBlack = interpolate(frame, [0, fps * 1.2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  // ── Subtle title card fades in at the end ────────────────────────────────
  const titleOpacity = fadeIn(frame, fps * 5, fps * 1.5);
  const titleSlide = interpolate(frame, [fps * 5, fps * 6.5], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill>
      {/* ── Deep cold pre-dawn background ──────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 30% 40%, #0d1a2e 0%, #060d18 50%, #020508 100%)',
        }}
      />

      {/* ── Three.js 3D forest scene ────────────────────────────────────── */}
      <ThreeCanvas
        width={width}
        height={height}
        gl={{
          antialias: true,
          toneMapping: 4, // ACESFilmicToneMapping
          toneMappingExposure: 1.1,
        }}
        camera={{
          fov: camFov,
          position: [0, camY, camZ],
          near: 0.5,
          far: 300,
        }}
        shadows={false}
      >
        <RussianForestScene />
      </ThreeCanvas>

      {/* ── Cinematic letterbox bars (2.35:1 widescreen) ───────────────── */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {/* Top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: Math.round(height * 0.105),
            background: '#000',
          }}
        />
        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: Math.round(height * 0.105),
            background: '#000',
          }}
        />
      </AbsoluteFill>

      {/* ── Bottom vignette ─────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 35%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Location title card ─────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          padding: `${height * 0.16}px 72px`,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleSlide}px)`,
          }}
        >
          {/* Location label */}
          <div
            style={{
              fontFamily: '"Courier New", "Lucida Console", monospace',
              fontSize: 13,
              fontWeight: 400,
              color: 'rgba(180, 210, 240, 0.85)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom: 8,
              textShadow: '0 1px 8px rgba(0,0,0,0.9)',
            }}
          >
            Classified Location · Russia
          </div>
          {/* Main title */}
          <div
            style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontSize: 44,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              textShadow: '0 2px 24px rgba(0,0,0,0.95)',
              marginBottom: 6,
            }}
          >
            Siberian Wilderness
          </div>
          {/* Timestamp */}
          <div
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 12,
              color: 'rgba(140, 180, 220, 0.7)',
              letterSpacing: '3px',
              textShadow: '0 1px 6px rgba(0,0,0,0.8)',
            }}
          >
            05:47 LOCAL · −18°C
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Fade from black overlay ─────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: '#000',
          opacity: 1 - fadeFromBlack,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
