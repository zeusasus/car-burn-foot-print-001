import { useMemo } from "react";

// Realistic Star-Cluster Galaxy Component
function GalaxyCluster({ x, y, size, coreColor, rotationDuration = "60s", armCount = 2, starCount = 45 }) {
  const galaxyStars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < starCount; i++) {
      // Distribute stars along spiral arms
      const arm = i % armCount;
      const theta = (i / starCount) * Math.PI * 6 + (arm * (2 * Math.PI / armCount));
      const r = 4 + (i / starCount) * 38 + (Math.random() * 8 - 4); // Radius with noise
      
      const starX = 50 + r * Math.cos(theta);
      const starY = 50 + r * Math.sin(theta);
      const starSize = Math.random() * 1.5 + 0.5; // very tiny stars
      const opacity = Math.random() * 0.75 + 0.25;
      
      arr.push({
        id: i,
        x: starX,
        y: starY,
        size: starSize,
        opacity
      });
    }
    return arr;
  }, [starCount, armCount]);

  return (
    <div 
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: "translate(-50%, -50%)",
        animation: `spinSpiral ${rotationDuration} infinite linear`,
        pointerEvents: "none",
        zIndex: 1
      }}
    >
      {/* Glowing Hazy Nebula Core */}
      <div 
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "35%",
          height: "35%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${coreColor} 0%, rgba(0,0,0,0) 70%)`,
          filter: "blur(20px)",
          opacity: 0.65,
          borderRadius: "50%"
        }}
      />
      <div 
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "12%",
          height: "12%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0) 80%)",
          filter: "blur(4px)",
          opacity: 0.9,
          borderRadius: "50%"
        }}
      />

      {/* Cluster Stars */}
      {galaxyStars.map((star) => (
        <div 
          key={star.id}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            opacity: star.opacity,
            boxShadow: star.size > 1.2 ? `0 0 3px #ffffff` : "none"
          }}
        />
      ))}
    </div>
  );
}

function SpaceBackground() {
  const starsCount = 140;
  const starColors = ["#ffffff", "#93C5FD", "#FEF08A", "#FCA5A5", "#C084FC"];
  
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < starsCount; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.8,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3,
        opacity: Math.random() * 0.7 + 0.3,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }
    return arr;
  }, []);

  const particlesCount = 20;
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < particlesCount; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 2,
        delay: Math.random() * 8,
        duration: Math.random() * 8 + 6,
        opacity: Math.random() * 0.4 + 0.15
      });
    }
    return arr;
  }, []);

  return (
    <div 
      className="space-bg"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at 50% 50%, #0c0d18 0%, #030408 100%)",
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none"
      }}
    >
      {/* General twinkling background stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            borderRadius: "50%",
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s infinite ease-in-out`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 2.2 ? `0 0 5px ${star.color}` : "none"
          }}
        />
      ))}

      {/* Floating green Spiral Energy particles */}
      {particles.map((p) => (
        <div
          key={`p-${p.id}`}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: "#10B981", 
            borderRadius: "50%",
            boxShadow: "0 0 6px #10B981, 0 0 10px rgba(16, 185, 129, 0.3)",
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s infinite linear`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}

      {/* Galaxy 1: Distant slowly spinning gold Star-Cluster Galaxy */}
      <GalaxyCluster 
        x={30} 
        y={35} 
        size={260} 
        coreColor="rgba(245, 158, 11, 0.45)" 
        rotationDuration="90s" 
        armCount={2}
        starCount={40}
      />

      {/* Galaxy 2: Main slowly spinning emerald-green Star-Cluster Galaxy (Gurren Lagann Theme) */}
      <GalaxyCluster 
        x={50} 
        y={50} 
        size={460} 
        coreColor="rgba(16, 185, 129, 0.5)" 
        rotationDuration="70s" 
        armCount={2}
        starCount={60}
      />

      {/* Galaxy 3: Faint blue Star-Cluster Galaxy on the bottom right */}
      <GalaxyCluster 
        x={75} 
        y={70} 
        size={220} 
        coreColor="rgba(59, 130, 246, 0.4)" 
        rotationDuration="110s" 
        armCount={3}
        starCount={35}
      />

      {/* Subtle background drift color washes (nebulas) */}
      <div 
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "60%",
          height: "60%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(40px)",
          animation: "drift 22s infinite alternate ease-in-out"
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "55%",
          height: "55%",
          background: "radial-gradient(circle, rgba(190, 18, 60, 0.06) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(40px)",
          animation: "drift 28s infinite alternate-reverse ease-in-out"
        }}
      />
      <div 
        style={{
          position: "absolute",
          top: "20%",
          right: "15%",
          width: "45%",
          height: "45%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(0,0,0,0) 75%)",
          filter: "blur(45px)",
          animation: "drift 32s infinite alternate ease-in-out"
        }}
      />
    </div>
  );
}

export default SpaceBackground;
