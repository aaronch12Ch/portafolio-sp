"use client";

import { useEffect, useRef, useState } from "react";

export default function TechSphere() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let scene: any,
      camera: any,
      renderer: any,
      labels: any[] = [];

    let mouseX = 0,
      mouseY = 0;

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

      camera = new THREE.PerspectiveCamera(
        60,
        containerRef.current!.clientWidth /
          containerRef.current!.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setSize(
        containerRef.current!.clientWidth,
        containerRef.current!.clientHeight
      );
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      containerRef.current!.appendChild(renderer.domElement);

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Crear labels
      technologies.forEach((tech, index) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = 512;
        canvas.height = 128;

        // ---- TEXTO CURVEADO ----
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 + 20;
        const radiusText = 220;

        const chars = tech.split("");
        const angleStep = Math.PI / (chars.length * 2);

        chars.forEach((char, i) => {
          const angle = -angleStep * (chars.length / 2) + i * angleStep;

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);
          ctx.fillText(char, 0, -radiusText);
          ctx.restore();
        });

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.75,
        });

        const sprite = new THREE.Sprite(material);

        const phi = Math.acos(-1 + (2 * index) / technologies.length);
        const theta = Math.sqrt(technologies.length * Math.PI) * phi;
        const radius = 2.6;

        sprite.position.set(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        );

        sprite.scale.set(1.8, 0.45, 1);

        scene.add(sprite);
        labels.push(sprite);
      });

      setIsLoaded(true);

      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        mouseX = mouse.x;
        mouseY = mouse.y;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!e.touches.length) return;
        const t = e.touches[0];

        mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;

        mouseX = mouse.x;
        mouseY = mouse.y;
      };

      const onTouchStart = (e: TouchEvent) => {
        if (!e.touches.length) return;
        const t = e.touches[0];

        mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });

      const animate = () => {
        requestAnimationFrame(animate);

        const rotX = mouseY * 0.3;
        const rotY = mouseX * 0.3;

        scene.rotation.x += (rotX - scene.rotation.x) * 0.05;
        scene.rotation.y += (rotY - scene.rotation.y) * 0.05;

        const isMobile = window.innerWidth < 768;
        scene.rotation.y += isMobile ? 0.006 : 0.002;

        scene.rotation.x = Math.max(-0.6, Math.min(0.6, scene.rotation.x));

        // ---- HOVER ZOOM ----
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(labels);

        labels.forEach((label: any) => {
          const isHover = intersects.find(i => i.object === label);

          const targetScale = isHover ? 2.4 : 1.8;
          const targetOpacity = isHover ? 1 : 0.75;

          label.scale.lerp(
            new THREE.Vector3(targetScale, targetScale * 0.25, 1),
            0.1
          );

          label.material.opacity +=
            (targetOpacity - label.material.opacity) * 0.1;

          label.lookAt(camera.position);
        });

        renderer.render(scene, camera);
      };

      animate();

      const onResize = () => {
        camera.aspect =
          containerRef.current!.clientWidth /
          containerRef.current!.clientHeight;

        camera.updateProjectionMatrix();
        renderer.setSize(
          containerRef.current!.clientWidth,
          containerRef.current!.clientHeight
        );
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("resize", onResize);
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
                className="w-3 h-3 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}