# r3f-remotion-studio

A production-ready **React Three Fiber + Remotion** video pipeline that automatically renders a 3D animated MP4 via GitHub Actions.

## ✨ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + TypeScript + Vite |
| 3D Engine | Three.js via React Three Fiber |
| Video Renderer | Remotion + @remotion/three |
| Animation | Remotion `interpolate()` + frame-driven GSAP values |
| CI/CD | GitHub Actions |
| Encoding | FFmpeg via Remotion |
| Output | 720p HD MP4 |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Preview in Remotion Studio
npm start

# Render a single frame preview
npm run still

# Render full video locally
npm run build
```

## 📁 Project Structure

```
r3f-remotion-studio/
├── src/
│   ├── index.ts                    # Remotion entry point
│   ├── Root.tsx                    # Composition registry
│   ├── compositions/
│   │   └── GlobeZoom.tsx           # Main 6-second composition
│   ├── scenes/
│   │   └── PakistanGlobeScene.tsx  # R3F 3D globe scene
│   └── utils/
│       └── animation.ts            # Frame-accurate interpolation helpers
├── .github/
│   └── workflows/
│       └── render.yml              # Auto-render on push to main
├── out/                            # Rendered output (gitignored)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎬 Video Composition

**GlobeZoom** (6 seconds, 30fps, 1280×720)

| Time | Event |
|------|-------|
| 0–2s | Earth globe fades in, camera zooms from space |
| 0.5–3s | Globe rotates to center Pakistan |
| 2.5–4s | Red location marker appears with spring animation |
| 3–6s | Pulse ring radiates from Pakistan |
| 3–5s | Title text "Pakistan" fades in |

## 🤖 GitHub Actions

Every push to `main` automatically:
1. Installs Node.js + Chromium + FFmpeg on Ubuntu
2. Runs `npx remotion render GlobeZoom`
3. Uploads `output.mp4` as a downloadable artifact (keeps 14 days)

Download your video from: **GitHub → Actions → Latest run → Artifacts → rendered-video**

## ⚙️ Configuration

Edit `src/Root.tsx` to change video dimensions/duration:

```tsx
<Composition
  id="GlobeZoom"
  durationInFrames={180}  // 6 seconds × 30fps
  fps={30}
  width={1280}
  height={720}
/>
```

## 🔧 Adding New Scenes

1. Create a new scene in `src/scenes/MyScene.tsx`
2. Import and use `useCurrentFrame()` for ALL animations
3. Add to `GlobeZoom.tsx` wrapped in `<Sequence from={...}>`
4. Register new composition in `src/Root.tsx` if needed

## ⚠️ Remotion Rules

- **NEVER use `useFrame()`** from React Three Fiber — it breaks rendering
- **ALL animations must use `useCurrentFrame()`** — otherwise frames flicker
- **CSS transitions/animations are FORBIDDEN** in Remotion
