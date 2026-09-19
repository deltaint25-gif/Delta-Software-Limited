"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { createDeltaGeometry } from "./delta-geometry";
import {
  SETTLE_END,
  TIMELINE,
  cameraPose,
  clamp01,
  easeInOutCubic,
  easeOutCubic,
  progress,
  smoothstep,
} from "./delta-timeline";

const BRAND_RED = "#ef4136";

/** Material values the mark settles on once fully formed. The reveal ramps
 * transmission down to this from fully clear, and metalness up to it. */
const REST_TRANSMISSION = 0.25;
const REST_METALNESS = 0.45;
/** Resting yaw — the three-quarter angle that shows the extrusion depth and
 * both counters. The intro starts turned further in by INTRO_YAW_OFFSET and
 * eases onto this, then drifts gently around it. */
const HERO_YAW = 0.42;
const INTRO_YAW_OFFSET = 0.55;

/** DeltaMesh's vertical float amplitude, included in the camera fit below. */
const IDLE_BOB = 0.12;
/** Outermost orbiting sphere: furthest orbit radius + its own radius (see
 * OrbitRing's `spheres`), so the flourish is framed along with the mark. */
const ORBIT_EXTENT = 2.15 + 0.25 + 0.07;
/** Breathing room on top of a perfect fit, so nothing ever touches an edge.
 *
 * This is tuned together with the camera's `fov` below, because the two
 * decide different things: the pair (fov, margin) fixes how *close* the
 * camera sits, and closeness alone is what gives the mark its dimensional,
 * foreshortened look. 1.5 paired with a 75° fov lands the camera at ~5.5 —
 * the distance the mark was originally composed at — so it reads with the
 * same depth as before while still clearing every edge by ~20%. The margin
 * also absorbs the intro's bounded push-in (see PUSH_DEPTH). Verified by
 * projecting the mark's bounding box through the fitted camera across a full
 * 360° sweep at the tilt/bob extremes, at the closest the push ever gets. */
const FRAME_MARGIN = 1.5;

/* ---------------------------------------------------------------- lighting */

/**
 * Image-based studio lighting. RoomEnvironment is a little box of emissive
 * panels; running it through PMREM turns it into the blurred reflection probe
 * that gives the mark actual studio highlights rolling across its bevels,
 * instead of the flat shading three's punctual lights alone produce.
 *
 * It renders once into a render target and is reused every frame, so the cost
 * is setup-only — nothing per-frame gets added by having it.
 */
function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;
    // Under reduced motion the loop runs on demand, so nothing would redraw
    // to show the probe without asking for a frame explicitly.
    invalidate();

    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      room.dispose?.();
    };
  }, [gl, scene, invalidate]);

  return null;
}

/* --------------------------------------------------------------- the mark */

interface DeltaMeshProps {
  reducedMotion: boolean;
  geometry: THREE.ExtrudeGeometry;
}

function DeltaMesh({ reducedMotion, geometry }: DeltaMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const tilt = useRef({ x: 0, z: 0 });

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    if (reducedMotion) {
      material.transmission = REST_TRANSMISSION;
      material.metalness = REST_METALNESS;
      material.opacity = 1;
      mesh.scale.setScalar(1);
      mesh.rotation.y = HERO_YAW;
      return;
    }

    const t = state.clock.getElapsedTime();

    // Resolve out of the particle cloud by moving the *material* from clear
    // glass to polished metal while the form grows. `opacity` alone can't do
    // this: with transmission above zero the surface is drawn through three's
    // transmission pass, where opacity no longer fades it — so transmission
    // itself is the thing that has to ramp.
    const formed = easeOutCubic(progress(t, TIMELINE.solidify));
    material.transmission = 1 - (1 - REST_TRANSMISSION) * formed;
    material.metalness = REST_METALNESS * formed;
    material.opacity = 0.25 + 0.75 * formed;
    mesh.scale.setScalar(0.55 + 0.45 * formed);

    // Rotation is a settle, not a spin: it eases from a turned-in angle to the
    // hero yaw and then drifts gently around it. Accumulating rotation would
    // eventually park the mark edge-on, which is the one pose a logo hero
    // can't afford to rest in.
    const settle = easeInOutCubic(progress(t, [TIMELINE.orbit[0], SETTLE_END]));
    const idle = Math.max(0, t - SETTLE_END);
    mesh.rotation.y = HERO_YAW + (1 - settle) * INTRO_YAW_OFFSET + Math.sin(idle * 0.16) * 0.09;

    tilt.current.x = state.pointer.y * -0.25;
    tilt.current.z = state.pointer.x * 0.18;
    mesh.rotation.x += (tilt.current.x - mesh.rotation.x) * 0.04;
    mesh.rotation.z += (tilt.current.z + 0.15 - mesh.rotation.z) * 0.04;
    mesh.position.y = Math.sin(t * 0.6) * IDLE_BOB * formed;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[0.15, 0.5, 0]}>
      {/* High-gloss red metal: the clearcoat is the polished lacquer layer that
          catches the studio probe, the low roughness keeps those highlights
          tight, and a little transmission keeps the thin bevels from reading
          as dead plastic. Brand red is unchanged. */}
      <meshPhysicalMaterial
        ref={materialRef}
        color={BRAND_RED}
        roughness={0.16}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.06}
        transmission={1}
        thickness={1.2}
        ior={1.4}
        reflectivity={0.6}
        envMapIntensity={1.15}
        transparent
        opacity={0}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------- particles */

/** Soft round sprite, so particles read as points of light rather than quads. */
function createGlowSprite() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(239,65,54,1)");
    gradient.addColorStop(0.35, "rgba(239,65,54,0.55)");
    gradient.addColorStop(1, "rgba(239,65,54,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

interface AssemblyParticlesProps {
  geometry: THREE.ExtrudeGeometry;
  count: number;
}

/**
 * The mark assembling out of a particle cloud.
 *
 * Targets are sampled off the real surface, so the cloud converges into the
 * logo's own silhouette rather than an approximation of it. Each particle
 * starts out on a shell around the mark and is released on a delay ordered by
 * its angle, which sweeps the formation around the shape — that's what reads
 * as the contour being drawn rather than everything arriving at once.
 *
 * Normal blending, not additive: the hero sits on near-white, where additive
 * red washes straight out to white and the cloud disappears.
 */
function AssemblyParticles({ geometry, count }: AssemblyParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const { positions, targets, origins, delays, sprite } = useMemo(() => {
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build();
    const target = new THREE.Vector3();

    const targets = new Float32Array(count * 3);
    const origins = new Float32Array(count * 3);
    const delays = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      sampler.sample(target);
      targets[i * 3] = target.x;
      targets[i * 3 + 1] = target.y;
      targets[i * 3 + 2] = target.z;

      // Released in sweep order around the mark's face, plus a little scatter
      // so the leading edge stays soft instead of arriving as a hard line.
      const angle = Math.atan2(target.y, target.x);
      delays[i] = clamp01((angle + Math.PI) / (Math.PI * 2)) * 0.55 + Math.random() * 0.3;

      // Start on a loose shell well outside the mark.
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 4.2 + Math.random() * 2.6;
      origins[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      origins[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 0.7;
      origins[i * 3 + 2] = Math.cos(phi) * radius * 0.6;
    }

    return {
      positions: new Float32Array(origins),
      targets,
      origins,
      delays,
      sprite: createGlowSprite(),
    };
  }, [geometry, count]);

  useEffect(() => () => sprite.dispose(), [sprite]);

  useFrame((state) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    const t = state.clock.getElapsedTime();
    const fadeIn = smoothstep(progress(t, TIMELINE.particlesIn));
    const fadeOut = smoothstep(progress(t, TIMELINE.particlesOut));
    material.opacity = fadeIn * (1 - fadeOut) * 0.9;

    // Once dissolved there's nothing left to move, so stop paying for it.
    if (fadeOut >= 1) {
      points.visible = false;
      return;
    }
    points.visible = true;

    const [start, end] = TIMELINE.assemble;
    const attribute = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;

    for (let i = 0; i < count; i += 1) {
      // Each particle runs the same eased trip, offset by its own delay.
      const local = easeOutCubic(clamp01((t - start - delays[i]) / (end - start)));
      const i3 = i * 3;
      array[i3] = origins[i3] + (targets[i3] - origins[i3]) * local;
      array[i3 + 1] = origins[i3 + 1] + (targets[i3 + 1] - origins[i3 + 1]) * local;
      array[i3 + 2] = origins[i3 + 2] + (targets[i3 + 2] - origins[i3 + 2]) * local;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.085}
        map={sprite}
        color={BRAND_RED}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ----------------------------------------------------------------- rings */

const ORBIT_COUNT = 4;

/** Thin rings + a handful of small orbiting spheres — a decorative "signature
 * mark in orbit" flourish sitting around the main object, independent of it.
 * Both ring radii stay inside ORBIT_EXTENT so the camera fit still covers
 * them. Fades up during the intro's ring beat. */
function OrbitRing({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringMaterials = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const sphereMaterials = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const spheres = useMemo(
    () =>
      Array.from({ length: ORBIT_COUNT }, (_, i) => ({
        angle: (i / ORBIT_COUNT) * Math.PI * 2,
        radius: 2.15 + (i % 2) * 0.25,
        speed: 0.22 + i * 0.05,
        size: 0.05 + (i % 2) * 0.02,
      })),
    []
  );
  const sphereRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    // A soft pulse on top of the fade, so the accents breathe rather than
    // sitting at a fixed brightness.
    const shown = reducedMotion ? 1 : smoothstep(progress(t, TIMELINE.rings));
    const pulse = reducedMotion ? 1 : 0.85 + 0.15 * Math.sin(t * 1.1);
    ringMaterials.current.forEach((m, i) => {
      if (m) m.opacity = shown * (i === 0 ? 0.35 : 0.18) * pulse;
    });
    sphereMaterials.current.forEach((m) => {
      if (m) m.opacity = shown * pulse;
    });

    if (reducedMotion) return;
    if (groupRef.current) groupRef.current.rotation.z += delta * 0.05;
    spheres.forEach((s, i) => {
      const mesh = sphereRefs.current[i];
      if (!mesh) return;
      const a = s.angle + t * s.speed;
      mesh.position.set(Math.cos(a) * s.radius, Math.sin(a) * s.radius * 0.55, Math.sin(a * 0.6) * 0.4);
    });
  });

  return (
    <group ref={groupRef} rotation={[0.35, 0.4, 0.1]}>
      <mesh>
        <torusGeometry args={[2.15, 0.008, 8, 96]} />
        <meshBasicMaterial
          ref={(el) => { ringMaterials.current[0] = el; }}
          color={BRAND_RED}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh rotation={[0.5, 0.2, 0]}>
        <torusGeometry args={[1.92, 0.005, 8, 96]} />
        <meshBasicMaterial
          ref={(el) => { ringMaterials.current[1] = el; }}
          color={BRAND_RED}
          transparent
          opacity={0}
        />
      </mesh>
      {spheres.map((s, i) => (
        <mesh key={i} ref={(el) => { sphereRefs.current[i] = el; }} position={[s.radius, 0, 0]}>
          <sphereGeometry args={[s.size, 12, 12]} />
          <meshBasicMaterial
            ref={(el) => { sphereMaterials.current[i] = el; }}
            color={BRAND_RED}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- camera */

/**
 * Frames the mark and flies the intro move around it.
 *
 * The distance comes from fitting the mark's bounding *sphere*: a sphere is
 * rotation-invariant, so fitting it is what makes 0/90/180/270° all safe at
 * once — and it's also what makes the orbit free, since swinging the camera
 * around a sphere never changes how much of it is in frame. Only the bounded
 * push-in reduces distance, and FRAME_MARGIN is sized to absorb it.
 *
 * r3f already syncs renderer size, camera aspect and the projection matrix on
 * container resize; the distance is recomputed off that same signal so the
 * framing stays correct rather than only the resolution.
 */
function CinematicCamera({ radius, reducedMotion }: { radius: number; reducedMotion: boolean }) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const distance = useMemo(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return radius;
    const aspect = size.width / size.height;
    const halfFov = (camera.fov * Math.PI) / 360;
    // `fov` is the vertical angle; the horizontal one is narrower whenever
    // the canvas is portrait, so that side is the binding constraint there.
    return radius / (Math.tan(halfFov) * Math.min(1, aspect));
  }, [camera, radius, size]);

  useEffect(() => {
    if (!reducedMotion) return;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
  }, [camera, distance, reducedMotion]);

  useFrame((state) => {
    if (reducedMotion) return;
    const { azimuth, elevation, distanceFactor } = cameraPose(state.clock.getElapsedTime());
    const r = distance * distanceFactor;
    camera.position.set(
      Math.sin(azimuth) * Math.cos(elevation) * r,
      Math.sin(elevation) * r,
      Math.cos(azimuth) * Math.cos(elevation) * r
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ----------------------------------------------------------------- scene */

interface DeltaSceneProps {
  reducedMotion: boolean;
}

export default function DeltaScene({ reducedMotion }: DeltaSceneProps) {
  const geometry = useMemo(() => createDeltaGeometry(), []);
  const fitRadius = useMemo(() => {
    geometry.computeBoundingSphere();
    const markRadius = geometry.boundingSphere?.radius ?? ORBIT_EXTENT;
    return (Math.max(markRadius, ORBIT_EXTENT) + IDLE_BOB) * FRAME_MARGIN;
  }, [geometry]);

  // Phones do the same sequence with a lighter cloud — the assembly reads the
  // same at this scale, and it keeps the per-frame position writes down on
  // hardware that has far less headroom.
  const particleCount = useMemo(() => {
    if (typeof window === "undefined") return 2600;
    return window.innerWidth < 768 ? 1100 : 2600;
  }, []);

  return (
    <Canvas
      // A wide fov is what lets the fit frame the whole mark from up close
      // (~5.5, where it was originally composed) instead of backing off to
      // ~12 — same framing, but the near-camera foreshortening that gives the
      // mark its depth is preserved rather than flattened out. The starting z
      // matches where the fit lands, so there's no first frame at the wrong
      // distance.
      camera={{ position: [0, 0, 5.5], fov: 75 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <StudioEnvironment />
      <CinematicCamera radius={fitRadius} reducedMotion={reducedMotion} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      {/* Rim lights: red from below-left for the brand glow, cool white from
          behind to pick the silhouette off the background. */}
      <pointLight position={[-4, -2, 3]} intensity={0.8} color={BRAND_RED} />
      <pointLight position={[2, -3, -2]} intensity={0.3} color="#ffffff" />
      <pointLight position={[-3, 3, -4]} intensity={0.4} color="#ffffff" />
      <OrbitRing reducedMotion={reducedMotion} />
      <DeltaMesh reducedMotion={reducedMotion} geometry={geometry} />
      {!reducedMotion && <AssemblyParticles geometry={geometry} count={particleCount} />}
    </Canvas>
  );
}
