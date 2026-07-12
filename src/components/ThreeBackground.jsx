import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Particles
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color(0x38bdf8), // sky
      new THREE.Color(0xa78bfa), // lavender
      new THREE.Color(0xf9a8d4), // pink
      new THREE.Color(0xffffff), // white
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Heart shapes as sprites
    const heartTexture = createHeartTexture();
    const heartGeometry = new THREE.BufferGeometry();
    const heartCount = 20;
    const heartPositions = new Float32Array(heartCount * 3);

    for (let i = 0; i < heartCount; i++) {
      heartPositions[i * 3] = (Math.random() - 0.5) * 15;
      heartPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      heartPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }

    heartGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(heartPositions, 3)
    );

    const heartMaterial = new THREE.PointsMaterial({
      size: 0.3,
      map: heartTexture,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });

    const hearts = new THREE.Points(heartGeometry, heartMaterial);
    scene.add(hearts);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animId;
    let time = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.005;

      particles.rotation.y = time * 0.05 + mouseX * 0.1;
      particles.rotation.x = time * 0.03 + mouseY * 0.05;

      hearts.rotation.y = time * 0.03;
      hearts.rotation.z = Math.sin(time * 0.5) * 0.1;

      // Float hearts up
      const pos = heartGeometry.attributes.position.array;
      for (let i = 0; i < heartCount; i++) {
        pos[i * 3 + 1] += 0.002;
        if (pos[i * 3 + 1] > 8) pos[i * 3 + 1] = -8;
      }
      heartGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

function createHeartTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 64, 64);

  ctx.fillStyle = '#f9a8d4';
  ctx.beginPath();
  ctx.moveTo(32, 50);
  ctx.bezierCurveTo(5, 35, 5, 15, 32, 20);
  ctx.bezierCurveTo(59, 15, 59, 35, 32, 50);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}
