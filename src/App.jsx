import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import InputForm from "./components/InputForm";
import Breakdown from "./components/Breakdown";
import History from "./components/History";
import AIAwareness from "./components/AIAwareness";
import Tips from "./components/Tips";
import Navbar from "./components/Navbar";
import SpaceBackground from "./components/SpaceBackground";
import { GlassesIcon } from "./components/icons";
import { playClick, playSuccess } from "./utils/audio";
import "./App.css";

// Global localStorage overrides to mirror storage writes directly to Electron user_state.json file
const originalSetItem = localStorage.setItem;
const originalClear = localStorage.clear;
const originalRemoveItem = localStorage.removeItem;

function syncStateToFile() {
  if (window.electronAPI) {
    const keys = ["userData", "history", "pledges", "savedMeals", "savedAppliances", "activeTheme", "glowIntensity", "glowColor", "tutorial_dashboard_completed", "tutorial_input_completed", "tutorial_breakdown_completed", "tutorial_history_completed", "tutorial_tips_completed"];
    const state = {};
    keys.forEach(k => {
      state[k] = localStorage.getItem(k);
    });
    window.electronAPI.saveState(state);
  }
}

function hexToRgba(hex, opacity) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function applyThemeAndGlow() {
  const activeTheme = localStorage.getItem("activeTheme") || "green";
  const glowIntensity = localStorage.getItem("glowIntensity") || "subtle";
  const glowColor = localStorage.getItem("glowColor") || "#10B981";

  const root = document.documentElement;
  
  // Theme base color mapping
  let themeColor = "#10B981";
  if (activeTheme === "crimson") {
    themeColor = "#EF4444";
  } else if (activeTheme === "blue") {
    themeColor = "#3B82F6";
  }
  
  root.style.setProperty("--primary-cta", themeColor);
  root.style.setProperty("--primary-cta-hover-glow-color", glowColor);
  
  // Compute spread and opacity based on user choice
  let spread = "6px";
  let opacity = 0.08;
  if (glowIntensity === "none") {
    spread = "0px";
    opacity = 0;
  } else if (glowIntensity === "vibrant") {
    spread = "12px";
    opacity = 0.18;
  }
  
  root.style.setProperty("--primary-cta-glow-spread", spread);
  root.style.setProperty("--primary-cta-glow-opacity", opacity.toString());
  root.style.setProperty("--primary-cta-hover-glow", hexToRgba(glowColor, opacity));
  
  // Compute shadows dynamically
  const shadowSpread = spread;
  const shadowColor = hexToRgba(themeColor, opacity);
  const outerGlow = hexToRgba(glowColor, opacity * 1.2);
  
  root.style.setProperty("--primary-cta-shadow", `
    4px 4px ${shadowSpread} ${shadowColor},
    0 2px ${spread} ${outerGlow},
    inset 1px 1px 2px rgba(255, 255, 255, 0.15),
    inset -1px -1px 2px rgba(0, 0, 0, 0.2)
  `.trim().replace(/\s+/g, " "));
}

localStorage.setItem = function (key, value) {
  originalSetItem.apply(this, arguments);
  syncStateToFile();
  if (["activeTheme", "glowIntensity", "glowColor"].includes(key)) {
    applyThemeAndGlow();
  }
};

localStorage.removeItem = function (key) {
  originalRemoveItem.apply(this, arguments);
  syncStateToFile();
};

localStorage.clear = function () {
  originalClear.apply(this, arguments);
  syncStateToFile();
};

function App() {
  const [screen, setScreen] = useState("splash");
  const [userData, setUserData] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [showResetWarning, setShowResetWarning] = useState(false);

  useEffect(() => {
    const isDesktop = !!window.electronAPI;
    document.body.classList.add(isDesktop ? "desktop-env" : "mobile-env");
    document.body.classList.remove(isDesktop ? "mobile-env" : "desktop-env");

    async function restoreState() {
      if (window.electronAPI) {
        const fileState = await window.electronAPI.loadState();
        if (fileState) {
          Object.entries(fileState).forEach(([key, val]) => {
            if (val !== null && val !== undefined) {
              originalSetItem.call(localStorage, key, val);
            }
          });
        }
      }
      const saved = localStorage.getItem("userData");
      if (saved) {
        setUserData(JSON.parse(saved));
      }
      applyThemeAndGlow();
      
      // Safety audit: Check elevated Windows Administrator execution
      if (window.electronAPI) {
        const isRunAsAdmin = await window.electronAPI.checkAdmin();
        if (isRunAsAdmin) {
          console.warn("[SECURITY WARNING] Running with Administrative privileges!");
        }
      }
    }
    restoreState();
  }, []);

  const handleSplashContinue = () => {
    if (userData) {
      setScreen("dashboard");
    } else {
      setScreen("onboarding");
    }
  };

  const handleOnboardingComplete = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    setUserData(data);
    setScreen("dashboard");
  };

  const handleFormSubmit = (data) => {
    const today = new Date().toISOString().split("T")[0];
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    
    // Evaluate active pledges offsets
    const pledges = JSON.parse(localStorage.getItem("pledges") || "[]");
    const activePledges = pledges.filter((p) => p.active);
    
    let appliedOffset = 0;
    const fulfilledPledgeIds = [];
    const raw = data.raw || {};
    
    activePledges.forEach((pledge) => {
      let fulfilled = false;
      const val = pledge.value !== undefined ? pledge.value : 0;
      
      if (pledge.id === "public_transit" && raw.kmDriven <= val) fulfilled = true;
      if (pledge.id === "vegetarian_meal" && (raw.vegetarianMeals >= 1 || raw.veganMeals >= 1)) fulfilled = true;
      if (pledge.id === "cold_shower" && raw.useGeyser === false) fulfilled = true;
      if (pledge.id === "ac_temperature" && raw.acHours > 0) fulfilled = true;
      if (pledge.id === "local_veggies" && (raw.vegetarianMeals >= 1 || raw.veganMeals >= 1)) fulfilled = true;
      if (pledge.id === "unplug_reactors") fulfilled = true;
      if (pledge.id === "plant_tree") fulfilled = true;
      
      if (fulfilled) {
        if (pledge.id === "public_transit") appliedOffset += val * (0.15 - 0.04);
        else if (pledge.id === "vegetarian_meal") appliedOffset += (val / 7) * 1.5;
        else if (pledge.id === "ac_temperature") appliedOffset += val * 0.41;
        else if (pledge.id === "unplug_reactors") appliedOffset += val * 0.16;
        else if (pledge.id === "cold_shower") appliedOffset += (val / 7) * 0.27;
        else if (pledge.id === "plant_tree") appliedOffset += val * (21.0 / 365);
        else if (pledge.id === "local_veggies") appliedOffset += (val / 7) * 0.7;
        
        fulfilledPledgeIds.push(pledge.id);
      }
    });

    const calculatedGross = 
      data.transport + data.food + data.energy + data.water + 
      data.books + data.clothing + data.streaming + data.shopping;
    
    const grossEmissions = parseFloat(calculatedGross.toFixed(2));
    const netEmissions = parseFloat(Math.max(0, grossEmissions - appliedOffset).toFixed(2));
    
    const timestamp = Date.now(); // Locked timestamp!
    
    // Create checksum hash
    const dataStr = `${today}|${timestamp}|${grossEmissions}|${netEmissions}|${appliedOffset}`;
    let hash = 0;
    for (let i = 0; i < dataStr.length; i++) {
      hash = (hash << 5) - hash + dataStr.charCodeAt(i);
      hash |= 0;
    }
    const checksum = Math.abs(hash).toString(16);

    const logEntry = {
      date: today,
      timestamp,
      grossEmissions,
      appliedOffset,
      netEmissions,
      fulfilledPledgeIds,
      checksum,
      // store category breakdowns
      transport: data.transport,
      food: data.food,
      energy: data.energy,
      water: data.water,
      books: data.books,
      clothing: data.clothing,
      streaming: data.streaming,
      shopping: data.shopping,
    };

    const existing = history.findIndex((h) => h.date === today);
    if (existing >= 0) {
      // Keep original timestamp if updating for the same day, to prevent changing past logs' time!
      logEntry.timestamp = history[existing].timestamp || timestamp;
      // Recalculate checksum with original timestamp
      const updatedDataStr = `${today}|${logEntry.timestamp}|${grossEmissions}|${netEmissions}|${appliedOffset}`;
      let updatedHash = 0;
      for (let i = 0; i < updatedDataStr.length; i++) {
        updatedHash = (updatedHash << 5) - updatedHash + updatedDataStr.charCodeAt(i);
        updatedHash |= 0;
      }
      logEntry.checksum = Math.abs(updatedHash).toString(16);
      
      history[existing] = logEntry;
    } else {
      history.push(logEntry);
    }
    
    localStorage.setItem("history", JSON.stringify(history));
    setTodayData(logEntry);
    setScreen("breakdown");
  };

  const confirmResetProfile = () => {
    playSuccess();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={`app ${window.electronAPI ? "desktop-env" : "mobile-env"}`}>
      <SpaceBackground />
      {screen === "splash" && (
        <SplashScreen userData={userData} onContinue={handleSplashContinue} />
      )}
      {screen === "onboarding" && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {screen !== "splash" && screen !== "onboarding" && (
        <>
          <Navbar screen={screen} setScreen={setScreen} onResetProfile={() => setShowResetWarning(true)} />
          <main className="main-content">
            {screen === "dashboard" && (
              <Dashboard userData={userData} setScreen={setScreen} />
            )}
            {screen === "input" && (
              <InputForm onSubmit={handleFormSubmit} />
            )}
            {screen === "breakdown" && (
              <Breakdown data={todayData} setScreen={setScreen} />
            )}
            {screen === "history" && (
              <History userData={userData} />
            )}
            {screen === "tips" && (
              <Tips />
            )}
            {screen === "ai" && <AIAwareness />}
          </main>
        </>
      )}

      {/* Global Reset Warning Modal */}
      {showResetWarning && (
        <div className="tutorial-overlay" style={{ zIndex: 1100 }}>
          <div className="tutorial-card" style={{ maxWidth: "450px", borderLeft: "5px solid #EF4444" }}>
            <div className="tutorial-step-header" style={{ borderBottom: "1px solid rgba(239, 68, 68, 0.2)" }}>
              <h3 style={{ color: "#EF4444", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <GlassesIcon size={22} style={{ color: "#EF4444" }} />
                <span>Reset Profile Confirmation</span>
              </h3>
            </div>
            
            <div className="tutorial-step-body" style={{ margin: "20px 0" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>Are you absolutely sure?</h4>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#A5B4FC", lineHeight: "1.5" }}>
                This action is permanent and cannot be undone. It will completely erase:
              </p>
              <ul style={{ margin: "10px 0", paddingLeft: "20px", fontSize: "0.9rem", color: "#A5B4FC" }}>
                <li>All daily activity history logs</li>
                <li>Your rolling daily averages</li>
                <li>All earned achievement badges & medals</li>
                <li>Saved custom meal and appliance presets</li>
              </ul>
              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "bold", color: "#EF4444" }}>
                The application will reload and start the onboarding walkthrough fresh.
              </p>
            </div>

            <div className="tutorial-footer" style={{ justifyContent: "flex-end", gap: "12px", borderTop: "none", padding: 0 }}>
              <button 
                className="btn-secondary" 
                onClick={() => { playClick(); setShowResetWarning(false); }}
                style={{ padding: "10px 20px" }}
              >
                Keep Profile
              </button>
              <button 
                className="btn-primary" 
                onClick={confirmResetProfile}
                style={{ padding: "10px 20px", backgroundColor: "#EF4444", color: "#FFFFFF", border: "none" }}
              >
                Erase & Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;