"use client";

import { useEffect, useRef, useState } from "react";

export default function TechSphere() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isHovering = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let scene: any,
      camera: any,
      renderer: any,
      labels: any[] = [],
      raycaster: any,
      mouse: any,
      particles: any[] = [];

    let mouseX = 0,
      mouseY = 0;
    let selectedLabel: any = null;

    const technologies = [
      ".NET",
      "SQL Server",
      "Spring Boot",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Git",
      "Tailwind CSS",
    ];

    const init = async () => {
      const THREE = await import("three");

      scene = new THREE.Scene();

      const aspect =
        containerRef.current!.clientWidth /
        containerRef.current!.clientHeight;

      const isMobile = window.innerWidth < 768;

      camera = new THREE.PerspectiveCamera(aspect > 1 ? 75 : 60, aspect, 0.1, 1000);
      camera.position.z = isMobile ? 6.2 : 7.8;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setSize(
        containerRef.current!.clientWidth,
        containerRef.current!.clientHeight
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      containerRef.current!.appendChild(renderer.domElement);

      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2(-999, -999);

      // Partículas
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 100;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particleSystem = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          size: 0.05,
          transparent: true,
          opacity: 0.3,
        })
      );

      scene.add(particleSystem);
      particles.push(particleSystem);

      // Labels
      technologies.forEach((tech, index) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = 512;
        canvas.height = 128;

        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tech, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);

        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.95,
          })
        );

        const phi = Math.acos(-1 + (2 * index) / technologies.length);
        const theta = Math.sqrt(technologies.length * Math.PI) * phi;

        const radius = isMobile ? 2.7 : 2.9;

        sprite.position.set(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        );

        const baseScale = isMobile ? 1.7 : 1.9;
        sprite.scale.set(baseScale, baseScale * 0.25, 1);

        sprite.userData = {
          originalScale: sprite.scale.clone(),
          originalPosition: sprite.position.clone(),
          targetScale: sprite.scale.clone(),
          techName: tech,
          floatOffset: Math.random() * Math.PI * 2,
        };

        scene.add(sprite);
        labels.push(sprite);
      });

      setIsLoaded(true);

      const onPointerMove = (e: PointerEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        const rect = containerRef.current!.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      };

      const onEnter = () => (isHovering.current = true);
      const onLeave = () => {
        isHovering.current = false;
        mouseX = 0;
        mouseY = 0;
      };

      containerRef.current!.addEventListener("mouseenter", onEnter);
      containerRef.current!.addEventListener("mouseleave", onLeave);

      window.addEventListener("pointermove", onPointerMove);

      const animate = () => {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        const rotX = isHovering.current ? mouseY * 0.35 : 0;
        const rotY = isHovering.current ? mouseX * 0.35 : 0;

        scene.rotation.x += (rotX - scene.rotation.x) * 0.05;
        scene.rotation.y += (rotY - scene.rotation.y) * 0.05;

        scene.rotation.y += isMobile ? 0.008 : 0.003;

        labels.forEach((label) => {
          const floatY =
            Math.sin(time * 2 + label.userData.floatOffset) * 0.05;

          const targetPosition = label.userData.originalPosition.clone();
          targetPosition.y += floatY;

          label.position.lerp(targetPosition, 0.1);
          label.scale.lerp(label.userData.targetScale, 0.15);
          label.lookAt(camera.position);
        });

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        containerRef.current?.removeEventListener("mouseenter", onEnter);
        containerRef.current?.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("pointermove", onPointerMove);
        renderer.dispose();
      };
    };

    init();
  }, []);

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
