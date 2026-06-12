import { useEffect, useState } from "react";
import { playSuccess } from "../utils/audio";
import { SpiralIcon } from "./icons";

function SplashScreen({ userData, onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 150);
  }, []);

  const handleTap = () => {
    playSuccess();
    onContinue();
  };

  return (
    <div 
      className="splash-screen" 
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleTap(); }}
      aria-label="Welcome screen. Press enter or space, or tap anywhere to begin."
    >
      <div className={`splash-content ${visible ? "fade-in" : ""}`}>
        <div className="splash-icon" style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <SpiralIcon size={64} className="animate-spin" style={{ color: "#10B981", animationDuration: "8s" }} />
        </div>
        <h1 className="splash-title">karburn</h1>
        {userData ? (
          <h2 className="splash-welcome">Welcome back, {userData.name}!</h2>
        ) : (
          <h2 className="splash-welcome">Welcome, Citizen!</h2>
        )}
        <p className="splash-subtitle">
          Track your footprint.<br />Optimize the grid.
        </p>
        <p className="splash-tap">tap anywhere to begin</p>
      </div>
    </div>
  );
}

export default SplashScreen;