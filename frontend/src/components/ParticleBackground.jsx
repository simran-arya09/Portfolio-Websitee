import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const W = el.clientWidth, H = el.clientHeight;

    // ─── Scene setup ────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    camera.position.z = 30;

    // ─── Particles ───────────────────────────────────────────
    const COUNT = 120;
    const positions = new Float32Array(COUNT * 3);
    const posArr = [];

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 40;
      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      posArr.push(new THREE.Vector3(x, y, z));
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x00d4aa,
      size: 0.25,
      transparent: true,
      opacity: 0.7,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ─── Connecting lines ─────────────────────────────────────
    const lineGeo = new THREE.BufferGeometry();
    const lineVerts = [];
    const DIST_THRESHOLD = 14;

    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        if (posArr[i].distanceTo(posArr[j]) < DIST_THRESHOLD) {
          lineVerts.push(posArr[i].x, posArr[i].y, posArr[i].z);
          lineVerts.push(posArr[j].x, posArr[j].y, posArr[j].z);
        }
      }
    }
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00d4aa,
      transparent: true,
      opacity: 0.08,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // ─── Mouse parallax ──────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);

    // ─── Resize ───────────────────────────────────────────────
    const handleResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ─── Animate ─────────────────────────────────────────────
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      points.rotation.y += 0.0005;
      lines.rotation.y  += 0.0005;
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
