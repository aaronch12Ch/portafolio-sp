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
  renderer.setClearColor(0x000000, 0); // transparente  
  containerRef.current!.appendChild(renderer.domElement);  

  // Crear labels  
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

    const material = new THREE.SpriteMaterial({  
      map: texture,  
      transparent: true,  
      opacity: 0.95,  
    });  

    const sprite = new THREE.Sprite(material);  

    // distribución esfera  
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
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;  
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;  
  };  

  const onTouchMove = (e: TouchEvent) => {  
    if (!e.touches.length) return;  

    const touch = e.touches[0];  
    mouseX = (touch.clientX / window.innerWidth) * 2 - 1;  
    mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;  
  };  


  window.addEventListener("mousemove", onMouseMove);  
  window.addEventListener("touchmove", onTouchMove, { passive: true });  


  const animate = () => {  
    requestAnimationFrame(animate);  

    const rotX = mouseY * 0.3;  
    const rotY = mouseX * 0.3;  

    scene.rotation.x += (rotX - scene.rotation.x) * 0.05;  
    scene.rotation.y += (rotY - scene.rotation.y) * 0.05;  

    // auto rotación  
    const isMobile = window.innerWidth < 768;  
    scene.rotation.y += isMobile ? 0.006 : 0.002;  

    scene.rotation.x = Math.max(-0.6, Math.min(0.6, scene.rotation.x));  


    labels.forEach((l) => l.lookAt(camera.position));  

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