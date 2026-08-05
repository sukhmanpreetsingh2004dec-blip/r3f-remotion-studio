import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { easeOut, easeInOut } from '../utils/animation';
import { interpolate } from 'remotion';

// ─── Constants ────────────────────────────────────────────────────────────────
const TREE_COUNT = 280;
const CAR_COUNT = 5;
const ROAD_LENGTH = 80;
const ROAD_WIDTH = 3.5;

// ─── Seeded pseudo-random (deterministic — no Math.random at render time) ─────
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

/**
 * RussianForestScene — cinematic aerial drone shot over snow-covered pine forest.
 *
 * ALL animations are driven by useCurrentFrame(). No useFrame() used.
 */
export const RussianForestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timing ─────────────────────────────────────────────────────────────────
  const TOTAL = fps * 8; // 8-second scene

  // ─── Motorcade position along road (Z axis) ──────────────────────────────
  // Cars start far away and drive toward camera slowly
  const motorcadeZ = easeInOut(frame, 0, TOTAL, -ROAD_LENGTH * 0.5, ROAD_LENGTH * 0.1);

  // ─── Dawn light intensity: very dim at start, slowly brightens ───────────
  const keyLightIntensity = easeOut(frame, 0, fps * 4, 0.15, 0.7);
  const ambientIntensity = easeOut(frame, 0, fps * 3, 0.05, 0.22);

  // ─── Generate forest tree positions (deterministic) ──────────────────────
  const trees = useMemo(() => {
    return Array.from({ length: TREE_COUNT }, (_, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      const xBase = side * (ROAD_WIDTH / 2 + 1.5 + seededRandom(i * 3) * 28);
      const z = (seededRandom(i * 7) - 0.5) * ROAD_LENGTH;
      const height = 3.5 + seededRandom(i * 11) * 4.5;
      const radius = 0.6 + seededRandom(i * 13) * 0.8;
      const layers = Math.floor(2 + seededRandom(i * 17) * 2);
      const wobble = seededRandom(i * 5) * 0.15 - 0.075; // slight tilt
      return { x: xBase, z, height, radius, layers, wobble };
    });
  }, []);

  // ─── Generate car positions along motorcade ──────────────────────────────
  const cars = useMemo(() => {
    return Array.from({ length: CAR_COUNT }, (_, i) => ({
      offset: i * -3.5,   // evenly spaced convoy
      xOffset: (i % 2 === 0 ? 0 : 0.08), // slight lane variation
    }));
  }, []);

  return (
    <group>
      {/* ── Scene Fog (set via primitive on scene) ─────────────────────── */}
      <fogExp2 attach="fog" args={[0x0a1520, 0.022]} />

      {/* ── Ground — snow field ────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#c8d8e8"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* ── Road ───────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[ROAD_WIDTH, ROAD_LENGTH]} />
        <meshStandardMaterial color="#1a1e22" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Road center line dashes */}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh
          key={`dash-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, -ROAD_LENGTH / 2 + 2 + i * 4.5]}
        >
          <planeGeometry args={[0.08, 1.8]} />
          <meshBasicMaterial color="#e8e0c8" />
        </mesh>
      ))}

      {/* ── Pine Trees ─────────────────────────────────────────────────── */}
      {trees.map((tree, i) => (
        <group key={`tree-${i}`} position={[tree.x, 0, tree.z]} rotation={[tree.wobble, 0, 0]}>
          {/* Trunk */}
          <mesh position={[0, tree.height * 0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.14, tree.height * 0.4, 6]} />
            <meshStandardMaterial color="#3d2a1a" roughness={0.95} />
          </mesh>

          {/* Pine layers — cone stack */}
          {Array.from({ length: tree.layers }, (_, layer) => {
            const layerRatio = layer / tree.layers;
            const layerY = tree.height * 0.35 + layerRatio * tree.height * 0.65;
            const layerRadius = tree.radius * (1 - layerRatio * 0.45);
            const layerHeight = tree.height * 0.45 * (1 - layerRatio * 0.3);
            // Snow coverage on top of cones
            const snowAmount = 0.3 + seededRandom(i * layer + 3) * 0.5;
            return (
              <group key={`layer-${layer}`} position={[0, layerY, 0]}>
                {/* Dark green pine cone */}
                <mesh>
                  <coneGeometry args={[layerRadius, layerHeight, 7]} />
                  <meshStandardMaterial
                    color={`hsl(${140 + layer * 5}, ${25 + layer * 3}%, ${12 + layer * 2}%)`}
                    roughness={0.9}
                  />
                </mesh>
                {/* Snow cap on top */}
                <mesh position={[0, layerHeight * 0.3, 0]}>
                  <coneGeometry args={[layerRadius * 0.55 * snowAmount, layerHeight * 0.2, 7]} />
                  <meshStandardMaterial color="#dce8f0" roughness={1.0} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* ── Government Motorcade ───────────────────────────────────────── */}
      {cars.map((car, i) => {
        const carZ = motorcadeZ + car.offset;
        // Headlights visible at dawn
        const lightIntensity = interpolate(frame, [0, fps * 1], [0.8, 0.4], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <group key={`car-${i}`} position={[car.xOffset, 0.32, carZ]}>
            {/* Car body */}
            <mesh>
              <boxGeometry args={[1.6, 0.55, 3.0]} />
              <meshStandardMaterial
                color={i === 2 ? '#0a0f14' : '#111820'}
                roughness={0.35}
                metalness={0.7}
              />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 0.38, -0.2]}>
              <boxGeometry args={[1.3, 0.35, 1.6]} />
              <meshStandardMaterial color="#0d1318" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Windshield tint */}
            <mesh position={[0, 0.35, 0.72]}>
              <boxGeometry args={[1.25, 0.3, 0.06]} />
              <meshStandardMaterial color="#1a2530" roughness={0.1} metalness={0.2} transparent opacity={0.7} />
            </mesh>
            {/* Left headlight */}
            <pointLight
              position={[-0.55, 0.1, 1.55]}
              intensity={lightIntensity}
              color="#c8dff0"
              distance={12}
              decay={2}
            />
            {/* Right headlight */}
            <pointLight
              position={[0.55, 0.1, 1.55]}
              intensity={lightIntensity}
              color="#c8dff0"
              distance={12}
              decay={2}
            />
            {/* Tail light glow */}
            <pointLight
              position={[0, 0.1, -1.55]}
              intensity={lightIntensity * 0.4}
              color="#ff2200"
              distance={4}
              decay={2}
            />
          </group>
        );
      })}

      {/* ── Dawn Lighting Rig ──────────────────────────────────────────── */}

      {/* Ambient — cold pre-dawn blue */}
      <ambientLight intensity={ambientIntensity} color="#2a4a7a" />

      {/* Key — low horizon sun just breaking (warm amber strip on treetops) */}
      <directionalLight
        position={[-40, 8, -30]}
        intensity={keyLightIntensity}
        color="#e8c090"
        castShadow={false}
      />

      {/* Fill — cold sky light from above */}
      <directionalLight
        position={[10, 30, 20]}
        intensity={ambientIntensity * 1.2}
        color="#6090c8"
      />

      {/* Bounce — slight warm ground bounce */}
      <directionalLight
        position={[0, -5, 0]}
        intensity={keyLightIntensity * 0.15}
        color="#d0c8b0"
      />
    </group>
  );
};
