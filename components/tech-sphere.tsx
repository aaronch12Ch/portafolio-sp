"use client";

import { useEffect, useRef, useState } from "react";

export default function TechSphere() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: any,
      camera: any,
      renderer: any,
      labels: any[] = [],
      raycaster: any,
      mouse: any;

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
      "Tailwind",
    ];

    const init = async () => {
      try {
        const THREE = await import("three");

        const width = containerRef.current!.clientWidth;
        const height = containerRef.current!.clientHeight;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 6;

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        containerRef.current!.appendChild(renderer.domElement);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2(-999, -999);

        // Crear labels con texto curveado
        technologies.forEach((tech, index) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          canvas.width = 512;
          canvas.height = 256;

          // Texto curveado
          ctx.font = "bold 42px Inter, Arial, sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = 140;
          const angleRange = Math.PI * 0.7;
          const startAngle = -angleRange / 2;

          for (let i = 0; i < tech.length; i++) {
            const char = tech[i];
            const angle = startAngle + (angleRange * i) / Math.max(tech.length - 1, 1);

            ctx.save();
            ctx.translate(
              centerX + radius * Math.sin(angle),
              centerY - radius * Math.cos(angle) + 35
            );
            ctx.rotate(angle);
            ctx.fillText(char, 0, 0);
            ctx.restore();
          }

          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;

          const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.95,
          });

          const sprite = new THREE.Sprite(material);

          // Distribución Fibonacci
          const phi = Math.acos(-1 + (2 * index) / technologies.length);
          const theta = Math.sqrt(technologies.length * Math.PI) * phi;
          const radius2 = 2.8;

          sprite.position.set(
            radius2 * Math.cos(theta) * Math.sin(phi),
            radius2 * Math.sin(theta) * Math.sin(phi),
            radius2 * Math.cos(phi)
          );

          sprite.scale.set(2, 1, 1);

          sprite.userData = {
            originalScale: sprite.scale.clone(),
            techName: tech,
            targetScale: sprite.scale.clone(),
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

        const onClick = () => {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(labels);

          if (intersects.length > 0) {
            const clicked = intersects[0].object;
            selectedLabel = selectedLabel === clicked ? null : clicked;
          } else {
            selectedLabel = null;
          }
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("click", onClick);

        const animate = () => {
          requestAnimationFrame(animate);

          const rotX = mouseY * 0.25;
          const rotY = mouseX * 0.25;

          scene.rotation.x += (rotX - scene.rotation.x) * 0.05;
          scene.rotation.y += (rotY - scene.rotation.y) * 0.05;

          const isMobile = window.innerWidth < 768;
          scene.rotation.y += isMobile ? 0.004 : 0.002;

          scene.rotation.x = Math.max(-0.5, Math.min(0.5, scene.rotation.x));

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(labels);

          labels.forEach((label) => {
            const isIntersected = intersects.some((i) => i.object === label);
            const isSelected = label === selectedLabel;

            if (isSelected) {
              label.userData.targetScale = label.userData.originalScale
                .clone()
                .multiplyScalar(2);
              label.material.opacity = 1;
            } else if (isIntersected) {
              label.userData.targetScale = label.userData.originalScale
                .clone()
                .multiplyScalar(1.4);
              label.material.opacity = 1;
              if (containerRef.current) {
                containerRef.current.style.cursor = "pointer";
              }
            } else {
              label.userData.targetScale = label.userData.originalScale.clone();
              label.material.opacity = 0.9;
            }

            label.scale.lerp(label.userData.targetScale, 0.1);
            label.lookAt(camera.position);
          });

          if (intersects.length === 0 && containerRef.current) {
            containerRef.current.style.cursor = "default";
          }

          renderer.render(scene, camera);
        };

        animate();

        const onResize = () => {
          const w = containerRef.current!.clientWidth;
          const h = containerRef.current!.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("click", onClick);
          window.removeEventListener("resize", onResize);
          if (containerRef.current && renderer.domElement.parentNode) {
            containerRef.current.removeChild(renderer.domElement);
          }
          renderer.dispose();
        };
      } catch (err) {
        console.error("Error inicializando Three.js:", err);
      }
    };

    init();
  }, []);

  return (
    <div className="relative w-full h-full">
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