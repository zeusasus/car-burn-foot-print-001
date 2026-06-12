import { useEffect, useState, useMemo } from "react";
import { playClick } from "../utils/audio";
import { 
  CarIcon, 
  PlateIcon, 
  LightbulbIcon, 
  WaterIcon, 
  BookIcon, 
  ClothingIcon, 
  ScreenIcon, 
  CartIcon, 
  SpiralIcon, 
  GlassesIcon, 
  DrillIcon 
} from "./icons";

const transportTips = [
  "Switch to public transport or metro to cut emissions by 70%",
  "Use a bicycle or walk for distances under 3km",
  "Carpool with friends or colleagues to share the impact",
  "Keep your vehicle tires inflated correctly to save up to 3% fuel",
];

const foodTips = [
  "Try one meat-free day per week — cuts footprint by 0.5kg CO₂",
  "Choose chicken or fish over beef — much lower carbon footprints",
  "Buy seasonal and locally sourced ingredients to limit transport",
];

const energyTips = [
  "Set your AC to 24°C — each degree lower adds 6% to power consumption",
  "Switch to LED lighting bulbs — they draw 75% less energy",
  "Unplug laptop and TV units when not actively in use",
];

const generalTips = [
  "Plant a local tree to absorb roughly 21kg of CO₂ every year",
  "Engage in daily tracking — small steps aggregate into big offsets",
];

function Breakdown({ data, setScreen }) {
  const [animated, setAnimated] = useState(false);
  const randomTips = useMemo(() => {
    const tips = [];
    if (data.transport > 2) {
      const idx = Math.floor(data.transport) % transportTips.length;
      tips.push(transportTips[idx]);
    }
    if (data.food > 1) {
      const idx = Math.floor(data.food * 10) % foodTips.length;
      tips.push(foodTips[idx]);
    }
    if (data.energy > 1) {
      const idx = Math.floor(data.energy * 10) % energyTips.length;
      tips.push(energyTips[idx]);
    }
    const genIdx = Math.floor((data.transport + data.food + data.energy) * 10) % generalTips.length;
    tips.push(generalTips[genIdx]);
    return tips;
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const netTotal = data.netEmissions !== undefined ? data.netEmissions : 0;
  const grossTotal = data.grossEmissions !== undefined ? data.grossEmissions : 0;
  const offsets = data.appliedOffset !== undefined ? data.appliedOffset : 0;
  const total = netTotal.toFixed(2);

  const categories = [
    { id: "transport", label: "Travel", value: data.transport },
    { id: "food", label: "Diet", value: data.food },
    { id: "energy", label: "Electricity", value: data.energy },
    { id: "water", label: "Water", value: data.water },
    { id: "books", label: "Paper", value: data.books },
    { id: "clothing", label: "Apparel", value: data.clothing },
    { id: "streaming", label: "Media", value: data.streaming },
    { id: "shopping", label: "Deliveries", value: data.shopping },
  ].filter((c) => c.value > 0);

  const highest = categories.reduce((a, b) => (a.value > b.value ? a : b), { value: 0 });

  const getBarWidth = (value) => {
    const denom = grossTotal > 0 ? grossTotal : 1;
    return `${Math.min((value / denom) * 100, 100)}%`;
  };

  const handleAction = (screenId) => {
    playClick();
    setScreen(screenId);
  };

  const getCategoryIcon = (id) => {
    const iconStyle = { marginRight: "8px", flexShrink: 0 };
    switch(id) {
      case "transport": return <CarIcon size={18} style={iconStyle} />;
      case "food": return <PlateIcon size={18} style={iconStyle} />;
      case "energy": return <LightbulbIcon size={18} style={iconStyle} />;
      case "water": return <WaterIcon size={18} style={iconStyle} />;
      case "books": return <BookIcon size={18} style={iconStyle} />;
      case "clothing": return <ClothingIcon size={18} style={iconStyle} />;
      case "streaming": return <ScreenIcon size={18} style={iconStyle} />;
      case "shopping": return <CartIcon size={18} style={iconStyle} />;
      default: return <SpiralIcon size={18} style={iconStyle} />;
    }
  };

  return (
    <div className="breakdown fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <header style={{ textAlign: "center", marginBottom: "10px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          <SpiralIcon size={32} className="animate-spin" style={{ color: "#10B981", animationDuration: "12s" }} />
          <h1 style={{ margin: 0 }}>Daily Carbon Breakdown</h1>
        </div>
      </header>

      <div className={`total-circle ${animated ? "pop-in" : ""}`} style={{ alignSelf: "center" }}>
        <span className="circle-number">{total}</span>
        <span className="circle-unit">kg CO₂ Today</span>
      </div>

      {/* Gross / Offset / Net summary block */}
      <div className="card carbon-black" style={{ maxWidth: "400px", width: "100%", alignSelf: "center", padding: "16px", marginTop: "-5px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
            <span style={{ color: "var(--card-text-muted)" }}>Gross Daily Emissions:</span>
            <span style={{ fontWeight: "700", color: "#ffffff" }}>{grossTotal.toFixed(2)} kg CO₂</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
            <span style={{ color: "var(--card-text-muted)" }}>Eco Pledge Offsets:</span>
            <span style={{ fontWeight: "700", color: "#10B981" }}>-{offsets.toFixed(2)} kg CO₂</span>
          </div>
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: "bold" }}>
            <span style={{ color: "#ffffff" }}>Net Daily Footprint:</span>
            <span style={{ color: "var(--primary-cta)" }}>{netTotal.toFixed(2)} kg CO₂</span>
          </div>
        </div>
      </div>

      <div className="breakdown-bars card carbon-black">
        <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Emissions by Category:</h3>
        {categories.map((cat) => (
          <div key={cat.id} className="breakdown-row" style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <span className="breakdown-label" style={{ display: "inline-flex", alignItems: "center", width: "120px", fontWeight: "600" }}>
              {getCategoryIcon(cat.id)}
              {cat.label}
            </span>
            <div className="breakdown-bar-bg" style={{ flexGrow: 1, margin: "0 12px", background: "rgba(30, 41, 59, 0.2)", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
              <div
                className="breakdown-bar-fill"
                style={{ 
                  width: animated ? getBarWidth(cat.value) : "0%",
                  background: "linear-gradient(90deg, #F59E0B 0%, #2563EB 100%)",
                  height: "100%",
                  transition: "width 0.4s ease"
                }}
              />
            </div>
            <span className="breakdown-value" style={{ width: "65px", textAlign: "right", fontWeight: "bold" }}>{cat.value.toFixed(1)} kg</span>
          </div>
        ))}
      </div>

      {highest.value > 0 && (
        <div className="insight-box card" style={{ borderLeft: "4px solid #F59E0B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <DrillIcon size={20} style={{ color: "#F59E0B" }} />
            <h3 style={{ margin: 0 }}>Daily Carbon Insight</h3>
          </div>
          <p style={{ margin: "6px 0" }}>Your highest resource emission was <strong>{highest.label}</strong> at <strong>{highest.value.toFixed(1)} kg CO₂</strong>.</p>
          {total > 5 ? (
            <p style={{ margin: 0, color: "#EF4444" }}>Your emissions are above average today. Refer to your Eco Pledges to find ways to reduce them!</p>
          ) : (
            <p style={{ margin: 0, color: "#10B981" }}>You are operating on a highly sustainable footprint. Excellent work!</p>
          )}
        </div>
      )}

      <div className="tips-section card carbon-black" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <GlassesIcon size={20} style={{ color: "#BE123C" }} />
          <h3 style={{ margin: 0 }}>Actionable Eco Tips</h3>
        </div>
        {randomTips.map((tip, i) => (
          <div key={i} className="tip-card" style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "8px" }}>
            <SpiralIcon size={16} style={{ color: "#10B981", marginTop: "3px", flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: "0.9rem" }}>{tip}</p>
          </div>
        ))}
      </div>

      <div className="breakdown-actions" style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "10px" }}>
        <button className="primary-action-btn" onClick={() => handleAction("dashboard")} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <DrillIcon size={16} />
          Back to Dashboard
        </button>
        <button className="secondary-action-btn" onClick={() => handleAction("history")} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <GlassesIcon size={16} />
          View History & Records
        </button>
      </div>
    </div>
  );
}

export default Breakdown;