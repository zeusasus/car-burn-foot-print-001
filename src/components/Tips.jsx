import { useState, useMemo } from "react";
import { playClick, playSuccess } from "../utils/audio";
import { 
  SpiralIcon, 
  GlassesIcon, 
  CarIcon, 
  PlateIcon, 
  LightbulbIcon, 
  WaterIcon 
} from "./icons";

const baselineTips = [
  {
    id: "public_transit",
    category: "transport",
    title: "Metro & Public Transit",
    desc: "Carpool or take public transit tomorrow instead of driving alone.",
    unit: "km commuted",
    min: 0,
    max: 999,
    defaultValue: 15,
    calculateOffset: (val) => val * 0.11 * 365
  },
  {
    id: "vegetarian_meal",
    category: "food",
    title: "Plant-based Meal",
    desc: "Substitute one meat meal today with a low-carbon vegetarian meal.",
    unit: "meals per week",
    min: 0,
    max: 21,
    defaultValue: 3,
    calculateOffset: (val) => val * 1.5 * 52
  },
  {
    id: "ac_temperature",
    category: "energy",
    title: "Adjust AC to 24°C",
    desc: "Keep your AC set to 24°C instead of 18°C to cut energy draw by 30%.",
    unit: "hours per day",
    min: 0,
    max: 24,
    defaultValue: 4,
    calculateOffset: (val) => val * 0.41 * 365
  },
  {
    id: "unplug_reactors",
    category: "energy",
    title: "Unplug Idle Devices",
    desc: "Unplug phantom grid loads like laptop chargers and TV plugs when not active.",
    unit: "devices unplugged",
    min: 0,
    max: 20,
    defaultValue: 5,
    calculateOffset: (val) => val * 0.16 * 365
  },
  {
    id: "cold_shower",
    category: "water",
    title: "Cool Shower",
    desc: "Skip electric geysers/heaters for a cold shower today.",
    unit: "showers per week",
    min: 0,
    max: 14,
    defaultValue: 5,
    calculateOffset: (val) => val * 0.27 * 52
  },
  {
    id: "plant_tree",
    category: "general",
    title: "Plant a Tree",
    desc: "Plant a tree locally to offset approximately 21kg of CO₂ per year.",
    unit: "trees planted",
    min: 0,
    max: 10,
    defaultValue: 1,
    calculateOffset: (val) => val * 21.0
  },
  {
    id: "local_veggies",
    category: "food",
    title: "Buy Local Ingredients",
    desc: "Buy local, seasonal veggies to cut long food transport emissions.",
    unit: "meals per week",
    min: 0,
    max: 21,
    defaultValue: 7,
    calculateOffset: (val) => val * 0.7 * 52
  }
];

function Tips() {
  const [pledges, setPledges] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("pledges") || "[]");
    return baselineTips.map((t) => {
      const match = saved.find(s => s.id === t.id);
      return {
        ...t,
        active: match ? match.active : false,
        value: match && match.value !== undefined ? match.value : t.defaultValue
      };
    });
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const [showTutorial, setShowTutorial] = useState(
    !localStorage.getItem("tutorial_tips_completed")
  );
  const [tutorialStep, setTutorialStep] = useState(1);
  const totalOffsetEarned = useMemo(() => {
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    return history.reduce((sum, h) => sum + (h.appliedOffset || 0), 0);
  }, []);

  const nextTutorial = () => {
    playClick();
    if (tutorialStep === 2) {
      setShowTutorial(false);
      localStorage.setItem("tutorial_tips_completed", "true");
    } else {
      setTutorialStep(tutorialStep + 1);
    }
  };



  const handlePledgeToggle = (id) => {
    const updated = pledges.map((p) => {
      if (p.id === id) {
        const nextState = !p.active;
        if (nextState) {
          playSuccess(); // Pleasant success chime on pledge activation!
        } else {
          playClick();
        }
        return { ...p, active: nextState };
      }
      return p;
    });
    setPledges(updated);
    localStorage.setItem("pledges", JSON.stringify(updated.map(p => ({ id: p.id, active: p.active, value: p.value }))));
  };

  const handleValueChange = (id, val) => {
    const updated = pledges.map((p) => {
      if (p.id === id) {
        return { ...p, value: val };
      }
      return p;
    });
    setPledges(updated);
    localStorage.setItem("pledges", JSON.stringify(updated.map(p => ({ id: p.id, active: p.active, value: p.value }))));
  };

  const handleCategorySwitch = (cat) => {
    playClick();
    setActiveCategory(cat);
  };

  const activePledges = pledges.filter((p) => p.active);
  const totalOffsetCommitted = activePledges.reduce((sum, p) => sum + p.calculateOffset(p.value !== undefined ? p.value : p.defaultValue), 0);

  const categories = [
    { id: "all", label: "All Pledges" },
    { id: "transport", label: "Travel" },
    { id: "food", label: "Diet" },
    { id: "energy", label: "Electricity" },
    { id: "water", label: "Water" }
  ];

  const filteredTips = pledges.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  const getTipIcon = (id) => {
    switch(id) {
      case "public_transit": return <CarIcon size={32} style={{ color: "#2563EB" }} />;
      case "vegetarian_meal": return <PlateIcon size={32} style={{ color: "#8FAF8A" }} />;
      case "ac_temperature": return <LightbulbIcon size={32} style={{ color: "#F59E0B" }} />;
      case "unplug_reactors": return <LightbulbIcon size={32} style={{ color: "#D97706" }} />;
      case "cold_shower": return <WaterIcon size={32} style={{ color: "#0D9488" }} />;
      case "plant_tree": return <SpiralIcon size={32} className="animate-spin" style={{ color: "#10B981", animationDuration: "10s" }} />;
      case "local_veggies": return <PlateIcon size={32} style={{ color: "#10B981" }} />;
      default: return <SpiralIcon size={32} />;
    }
  };

  return (
    <div className="tips-container">
      {showTutorial && (
        <div className="tutorial-overlay" style={{ zIndex: 1100 }}>
          <div className="tutorial-card" style={{ maxWidth: "450px" }}>
            <div className="tutorial-step-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <GlassesIcon size={22} style={{ color: "var(--primary-green)" }} />
                <span>Pledges Tour</span>
              </h3>
              <span className="tutorial-step-indicator">Step {tutorialStep} of 2</span>
            </div>
            
            <div className="tutorial-step-body" style={{ margin: "20px 0" }}>
              {tutorialStep === 1 && (
                <>
                  <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>1. Pick Green Habits</h4>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#A5B4FC", lineHeight: "1.5" }}>
                    Look through our list of friendly green habits, adjust the sliders to fit your daily targets, and toggle "Start Mission" to commit to them!
                  </p>
                </>
              )}
              {tutorialStep === 2 && (
                <>
                  <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>2. Earn Rewards</h4>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#A5B4FC", lineHeight: "1.5" }}>
                    When you log matching green actions, the app automatically checks your targets and deducts carbon savings from your daily score!
                  </p>
                </>
              )}
            </div>

            <div className="tutorial-footer" style={{ justifyContent: "space-between", borderTop: "none", padding: 0 }}>
              <div className="tutorial-dot-container" style={{ display: "flex", gap: "6px" }}>
                {[1, 2].map((s) => (
                  <div key={s} className={`tutorial-dot ${tutorialStep === s ? "active" : ""}`} />
                ))}
              </div>
              <div className="tutorial-buttons">
                <button className="btn-primary" style={{ padding: "8px 20px" }} onClick={nextTutorial}>
                  {tutorialStep === 2 ? "Understood!" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="tips-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
          <GlassesIcon size={36} />
          <h1 style={{ margin: 0 }}>Eco Pledges & Missions</h1>
        </div>
        <p style={{ marginTop: "0.5rem" }}>Adopt sustainable habits to offset your carbon footprint. Commit to active eco pledges and make a real impact!</p>
      </header>

      {/* Dynamic Pledges Sync Clarification Box */}
      <div className="disclaimer-banner" style={{ marginBottom: "24px", backgroundColor: "rgba(16, 185, 129, 0.05)", border: "1.5px solid rgba(16, 185, 129, 0.2)" }}>
        <h3 style={{ margin: "0 0 6px 0", color: "var(--primary-cta)", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
          <SpiralIcon size={16} className="icon-spiral" />
          <span>What are Pledges and Carbon Savings?</span>
        </h3>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
          <strong>• Active Targets (Commitments):</strong> This is your goal. When you click <em>"Start Mission"</em> on a green habit below and choose a target, we calculate how much carbon you would save in a whole year if you stick to it. <br />
          <strong>• Carbon Offsetted (Actual Savings):</strong> This is your achievement. When you actually log matching green actions (like eating plant-based meals or taking public transit) in your daily diary, the app calculates the daily savings and subtracts them from your daily footprint score. <br />
          <strong>• How to Earn Savings:</strong> Simply set your targets here, then log your green actions in the daily diary. Your real-world offsets will automatically be added to your score!
        </p>
      </div>

      {/* Cards container for flex display */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {/* Progress committed offsets bar */}
        <section className="offset-progress-card card carbon-black" style={{ flex: "1 1 300px", margin: 0 }}>
          <div className="progress-details" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Eco Targets Potential</h2>
            <span className="offset-value" style={{ fontWeight: "bold", color: "#2563EB" }}>
              {totalOffsetCommitted.toFixed(0)} kg CO₂ / yr
            </span>
          </div>
          <div className="offset-progress-bar-bg" style={{ background: "rgba(30, 41, 59, 0.2)", borderRadius: "10px", height: "12px", margin: "12px 0", overflow: "hidden" }}>
            <div 
              className="offset-progress-bar-fill" 
              style={{ 
                width: `${Math.min((totalOffsetCommitted / 500) * 100, 100)}%`,
                background: "linear-gradient(90deg, #8FAF8A 0%, #2563EB 100%)",
                height: "100%",
                transition: "width 0.4s ease"
              }}
            />
          </div>
          <p className="progress-hint" style={{ margin: 0 }}>
            {activePledges.length === 0 
              ? "Select a mission below to start active carbon offsetting." 
              : `Active targets: ${activePledges.length}. Aim for a target of 500 kg/yr!`}
          </p>
        </section>

        {/* Total carbon offsetted so far */}
        <section className="offset-progress-card card carbon-black" style={{ flex: "1 1 300px", margin: 0, borderLeft: "4px solid #10B981" }}>
          <div className="progress-details" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Carbon Offsetted So Far</h2>
            <span className="offset-value" style={{ fontWeight: "bold", color: "#10B981" }}>
              {totalOffsetEarned.toFixed(1)} kg CO₂
            </span>
          </div>
          <div style={{ margin: "14px 0", fontSize: "0.9rem", color: "var(--card-text-muted)", lineHeight: "1.5" }}>
            This is the total amount of carbon you have actually prevented from entering the atmosphere by logging matching green activities in your diary.
          </div>
          <p className="progress-hint" style={{ margin: 0, color: "#10B981", fontWeight: "600" }}>
            {totalOffsetEarned === 0 
              ? "Log your daily activities to earn offsets!" 
              : "Keep up the amazing work on your clean journey!"}
          </p>
        </section>
      </div>

      {/* Filter pills */}
      <div className="tips-pills-bar" style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "1.5rem 0", flexWrap: "wrap" }}>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`pill-btn ${activeCategory === c.id ? "active" : ""}`}
            onClick={() => handleCategorySwitch(c.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Pledges list */}
      <div className="directives-list">
        {filteredTips.map((tip) => (
          <div key={tip.id} className={`directive-card card carbon-black category-${tip.category} ${tip.active ? "active-pledge" : ""}`}>
            <div className="directive-icon">{getTipIcon(tip.id)}</div>
            <div className="directive-info">
              <h3>{tip.title}</h3>
              <p>{tip.desc}</p>
              
              {/* Slider for interactive input */}
              <div style={{ margin: "14px 0", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--card-text-muted)", marginBottom: "6px" }}>
                  <span>Custom commitment:</span>
                  <span style={{ fontWeight: "bold", color: "#ffffff" }}>{tip.value !== undefined ? tip.value : tip.defaultValue} {tip.unit}</span>
                </div>
                <input 
                  type="range" 
                  min={tip.min} 
                  max={tip.max} 
                  value={tip.value !== undefined ? tip.value : tip.defaultValue}
                  onChange={(e) => handleValueChange(tip.id, Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>

              <div className="directive-offset">Offset Potential: <strong>-{tip.calculateOffset(tip.value !== undefined ? tip.value : tip.defaultValue).toFixed(0)} kg CO₂ / yr</strong></div>
            </div>
            <button 
              className={`pledge-toggle-btn ${tip.active ? "active" : ""}`}
              onClick={() => handlePledgeToggle(tip.id)}
            >
              {tip.active ? "Active Pledge" : "Start Mission"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tips;
