import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ==========================================
// CONFIGURABLE CONSTANTS FOR DUST LAYER
// ==========================================
export const DUST_COUNT = 1200;      // full desktop dust count
export const DUST_RADIUS = 10.5;     // radius around whole scene (9 to 12)
export const DUST_SIZE = 0.085;      // particle base size
export const DUST_OPACITY = 0.55;    // particle base opacity
export const DUST_SPEED = 0.35;      // organic drift speed

// Helper to generate soft radial gradient sprite canvas texture (no external image files)
function createDustTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(127, 245, 238, 0.85)');
    gradient.addColorStop(0.6, 'rgba(127, 211, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface AtomisScrollSceneProps {
  scrollProgress: number; // 0 to 1
  onProgressChange?: (p: number) => void;
  isDashboard?: boolean; // When in dashboard, uses 40% count & 60% opacity
}

export const AtomisScrollScene: React.FC<AtomisScrollSceneProps> = ({
  scrollProgress,
  onProgressChange,
  isDashboard = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(scrollProgress);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect user preferences and hardware capabilities
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileDevice = window.innerWidth < 768;
    const nav = navigator as any;
    const isLowPower =
      (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) ||
      (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4);

    // CONFIGURATION per template & mobile adaptation
    const PARTICLES = isMobileDevice || isLowPower ? 550 : 1800;
    const ATOMS = isMobileDevice || isLowPower ? 6 : 10;
    const OBJ_R = 1.5;
    const SPREAD = isMobileDevice ? 3.2 : 4.0;

    // Dust particles: 300-400 on mobile/low-power vs 1200 on desktop
    let activeDustCount = isDashboard ? Math.round(DUST_COUNT * 0.4) : DUST_COUNT;
    if (isLowPower) {
      activeDustCount = 300;
    } else if (isMobileDevice) {
      activeDustCount = 350;
    }
    const activeDustOpacity = isDashboard ? DUST_OPACITY * 0.6 : DUST_OPACITY;

    function shapePoint(rnd: () => number) {
      const u = rnd() * 2 - 1;
      const t = rnd() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = OBJ_R * (0.55 + 0.45 * Math.cbrt(rnd())); // thick sphere
      return [r * s * Math.cos(t), r * u, r * s * Math.sin(t)];
    }

    let seed = 11;
    function rnd() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }

    const initialWidth = container.clientWidth || window.innerWidth || 800;
    const initialHeight = container.clientHeight || window.innerHeight || 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(initialWidth, initialHeight);
    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 0.1, 100);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const pl = new THREE.PointLight(0x34d399, 1.8, 50);
    pl.position.set(5, 6, 8);
    scene.add(pl);

    const pl2 = new THREE.PointLight(0x06b6d4, 1.4, 50);
    pl2.position.set(-6, -5, -4);
    scene.add(pl2);

    const root = new THREE.Group();
    scene.add(root);

    // Atom centers (Fibonacci sphere distribution)
    const centers: THREE.Vector3[] = [];
    const g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < ATOMS; i++) {
      const y = 1 - (i / (ATOMS - 1)) * 2;
      const rr = Math.sqrt(1 - y * y);
      const th = g * i;
      centers.push(new THREE.Vector3(Math.cos(th) * rr, y, Math.sin(th) * rr));
    }

    // Particles
    const geo = new THREE.SphereGeometry(0.045, 8, 8);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const mesh = new THREE.InstancedMesh(geo, mat, PARTICLES);
    root.add(mesh);

    const home: THREE.Vector3[] = [];
    const target: THREE.Vector3[] = [];
    const delay: number[] = [];
    const tmp = new THREE.Color();

    for (let n = 0; n < PARTICLES; n++) {
      const p = shapePoint(rnd);
      const v = new THREE.Vector3(p[0], p[1], p[2]);
      const dir = v.clone().normalize();
      let best = 0;
      let bd = -2;

      for (let a = 0; a < ATOMS; a++) {
        const d = dir.dot(centers[a]);
        if (d > bd) {
          bd = d;
          best = a;
        }
      }

      const c = centers[best].clone().multiplyScalar(SPREAD);
      const off = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5)
        .normalize()
        .multiplyScalar(0.12 + 0.38 * Math.cbrt(rnd()));
      home.push(v);
      target.push(c.add(off));
      delay.push(rnd());

      // Vibrant Emerald & Cyan gradient HSL
      tmp.setHSL(0.42 + 0.18 * (best / ATOMS) + 0.04 * rnd(), 0.92, 0.52 + 0.22 * rnd());
      mesh.setColorAt(n, tmp);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // Electrons + Orbit rings per atom
    interface AtomGroupData {
      grp: THREE.Group;
      rings: Array<{
        el: THREE.Mesh;
        ring: THREE.LineLoop;
        rad: number;
        speed: number;
        ph: number;
      }>;
    }

    const atomGroups: AtomGroupData[] = [];
    const ringPts: THREE.Vector3[] = [];
    for (let k = 0; k <= 64; k++) {
      const q = (k / 64) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(Math.cos(q), Math.sin(q), 0));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
    const eGeo = new THREE.SphereGeometry(0.075, 10, 10);

    for (let a2 = 0; a2 < ATOMS; a2++) {
      const grp = new THREE.Group();
      grp.position.copy(centers[a2]).multiplyScalar(SPREAD);
      root.add(grp);

      const rings = [];
      for (let r2 = 0; r2 < 3; r2++) {
        const holder = new THREE.Group();
        holder.rotation.set(r2 * 1.05 + a2, r2 * 0.8, a2 * 0.6);
        const rm = new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0 });
        const ring = new THREE.LineLoop(ringGeo, rm);
        ring.scale.setScalar(0.85 + r2 * 0.18);
        holder.add(ring);

        const el = new THREE.Mesh(eGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
        holder.add(el);
        grp.add(holder);

        rings.push({
          el,
          ring,
          rad: 0.85 + r2 * 0.18,
          speed: 1.4 - r2 * 0.35,
          ph: rnd() * 6.28
        });
      }
      atomGroups.push({ grp, rings });
    }

    function ss(a: number, b: number, x: number) {
      x = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return x * x * (3 - 2 * x);
    }

    // ==========================================
    // DUST LAYER (THREE.Points with custom canvas radial texture)
    // ==========================================
    const dustTexture = createDustTexture();
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(activeDustCount * 3);
    const dustBasePositions = new Float32Array(activeDustCount * 3);
    const dustColors = new Float32Array(activeDustCount * 3);
    const dustSizes = new Float32Array(activeDustCount);
    const dustSpeeds = new Float32Array(activeDustCount);
    const dustPhases = new Float32Array(activeDustCount);

    // Color palette: cyan (#7ff5ee), light blue (#7fd3ff), white (#ffffff), violet (#a78bfa)
    const colorPalette = [
      new THREE.Color(0x7ff5ee), // Cyan
      new THREE.Color(0x7fd3ff), // Light Blue
      new THREE.Color(0xffffff), // White
      new THREE.Color(0xa78bfa), // Violet
      new THREE.Color(0x7ff5ee), // Extra cyan for density
    ];

    for (let di = 0; di < activeDustCount; di++) {
      // Denser distribution near center using cube-root and inverse Gaussian falloff
      const u = rnd() * 2 - 1;
      const t = rnd() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      // radius 0 to DUST_RADIUS, concentrated toward inner 30-70% volume
      const r = DUST_RADIUS * (0.15 + 0.85 * Math.pow(rnd(), 1.6));
      const px = r * s * Math.cos(t) * 1.35;
      const py = r * u * 1.05;
      const pz = r * s * Math.sin(t);

      dustPositions[di * 3] = px;
      dustPositions[di * 3 + 1] = py;
      dustPositions[di * 3 + 2] = pz;

      dustBasePositions[di * 3] = px;
      dustBasePositions[di * 3 + 1] = py;
      dustBasePositions[di * 3 + 2] = pz;

      // Color pick with variance
      const col = colorPalette[Math.floor(rnd() * colorPalette.length)];
      dustColors[di * 3] = col.r;
      dustColors[di * 3 + 1] = col.g;
      dustColors[di * 3 + 2] = col.b;

      // Random size (0.04 to 0.16)
      dustSizes[di] = DUST_SIZE * (0.6 + 0.8 * rnd());
      // Random speed and phase
      dustSpeeds[di] = DUST_SPEED * (0.6 + 0.8 * rnd());
      dustPhases[di] = rnd() * Math.PI * 2;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: DUST_SIZE * 2.8,
      map: dustTexture,
      vertexColors: true,
      transparent: true,
      opacity: activeDustOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);

    let prog = 0;
    const m = new THREE.Matrix4();
    const v3 = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const sc = new THREE.Vector3();
    let mx = 0;
    let my = 0;

    const handlePointerMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', handlePointerMove);

    const clock = new THREE.Clock();
    let animId: number;
    let lastFpsCheck = 0;
    let frameCounter = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth progress lerp towards current goal (responsive)
      const goal = progressRef.current;
      prog += (goal - prog) * 0.16;
      const P = prog;

      // Adaptive performance watchdog: check framerate; if dropped, lower dust opacity
      frameCounter++;
      if (t - lastFpsCheck > 3) {
        const measuredFps = frameCounter / (t - lastFpsCheck);
        if (measuredFps < 28 && dustMaterial.opacity > 0.15) {
          dustMaterial.opacity *= 0.75;
        }
        frameCounter = 0;
        lastFpsCheck = t;
      }

      const isMobile = window.innerWidth < 700;
      const dist = (isMobile ? 11 : 8.5) + ss(0.01, 0.55, P) * (isMobile ? 7 : 5);
      camera.position.set(mx * 1.5, -my * 1.2, dist);
      camera.lookAt(0, 0, 0);

      root.rotation.y = t * 0.18 + P * Math.PI * 1.2;
      root.rotation.x = 0.25 * Math.sin(t * 0.2) + P * 0.3;

      // ==========================================
      // COSMIC DUST MOTION & PARALLAX
      // ==========================================
      if (!prefersReducedMotion) {
        // Rotate dust layer slowly in opposite direction to main object for parallax feel
        dustPoints.rotation.y = -t * 0.05 - P * 0.35;
        dustPoints.rotation.x = 0.08 * Math.cos(t * 0.12);

        // Mouse parallax: shifted opposite to mouse movement, slightly more than main object
        dustPoints.position.x = -mx * 2.2;
        dustPoints.position.y = my * 1.8;

        // Scroll reaction: as scroll progress goes from 0 to 1, dust spreads out slightly (1.0 to 1.35)
        const dustScrollScale = 1.0 + P * 0.35;
        dustPoints.scale.set(dustScrollScale, dustScrollScale, dustScrollScale);

        // Update individual dust particle drift and gentle sine/cosine wobble
        const posAttr = dustGeometry.attributes.position as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;
        const driftSpeedMult = 1.0 + P * 0.45; // drifts a little faster as scroll advances

        for (let di = 0; di < activeDustCount; di++) {
          const idx = di * 3;
          const spd = dustSpeeds[di] * driftSpeedMult;
          const ph = dustPhases[di];

          const bx = dustBasePositions[idx];
          const by = dustBasePositions[idx + 1];
          const bz = dustBasePositions[idx + 2];

          // Gentle organic harmonic drift
          posArr[idx] = bx + Math.sin(t * spd + ph) * 0.28;
          posArr[idx + 1] = by + Math.cos(t * spd * 0.85 + ph * 1.3) * 0.24;
          posArr[idx + 2] = bz + Math.sin(t * spd * 0.65 + ph * 0.7) * 0.2;
        }
        posAttr.needsUpdate = true;

        // Subtle twinkling opacity pulse over time per frame
        if (!isLowPower) {
          const pulse = 0.88 + 0.12 * Math.sin(t * 2.5);
          dustMaterial.opacity = activeDustOpacity * pulse;
        }
      } else {
        // prefers-reduced-motion: static layer with no drift
        dustPoints.scale.set(1.0 + P * 0.2, 1.0 + P * 0.2, 1.0 + P * 0.2);
      }

      for (let i = 0; i < PARTICLES; i++) {
        // Easily splits up when scrolled: starts splitting immediately upon scrolling
        const startSplit = 0.005 + 0.08 * delay[i];
        const endSplit = 0.28 + 0.16 * delay[i];
        const e = ss(startSplit, endSplit, P);
        v3.copy(home[i]).lerp(target[i], e);
        const wob = 0.02 * Math.sin(t * 2 + i);
        v3.x += wob;
        v3.y += wob * 0.7;
        const s = 1 + e * 0.25;
        sc.set(s, s, s);
        m.compose(v3, q, sc);
        mesh.setMatrixAt(i, m);
      }
      mesh.instanceMatrix.needsUpdate = true;

      const show = ss(0.30, 0.60, P);
      for (let a = 0; a < ATOMS; a++) {
        const ag = atomGroups[a];
        for (let r = 0; r < ag.rings.length; r++) {
          const o = ag.rings[r];
          const ang = t * o.speed + o.ph;
          o.el.position.set(Math.cos(ang) * o.rad, Math.sin(ang) * o.rad, 0);
          (o.el.material as THREE.MeshBasicMaterial).opacity = show;
          (o.ring.material as THREE.LineBasicMaterial).opacity = show * 0.6;
        }
      }

      if (document.hidden) {
        animId = requestAnimationFrame(animate);
        return;
      }

      renderer.render(scene, camera);
    };

    let isVisible = true;
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    let lastTime = performance.now();
    const handleVisibilityChange = () => {
      if (!document.hidden && isVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) observer.disconnect();
      cancelAnimationFrame(animId);

      // Clean up dust resources
      dustGeometry.dispose();
      dustMaterial.dispose();
      dustTexture.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />
  );
};
