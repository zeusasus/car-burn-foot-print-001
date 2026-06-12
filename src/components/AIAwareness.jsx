import { useState } from "react";
import { playClick } from "../utils/audio";
import { 
  DrillIcon, 
  GlassesIcon, 
  WaterIcon, 
  LightbulbIcon, 
  SpiralIcon 
} from "./icons";

const aiPresets = [
  {
    id: "casual",
    title: "Casual User",
    usage: "~5 text queries per day",
    co2: 0.01,
    water: 2.5,
    equivalents: [
      { label: "Smartphone charges", val: 1 },
      { label: "LED bulb run time", val: "1 hour" },
      { label: "Plastic bottles (500ml)", val: 5 }
    ]
  },
  {
    id: "active",
    title: "Active Chatting",
    usage: "~50 text queries & search daily",
    co2: 0.15,
    water: 25,
    equivalents: [
      { label: "Smartphone charges", val: 18 },
      { label: "LED bulb run time", val: "18 hours" },
      { label: "EV travel equivalent", val: "3 km" }
    ]
  },
  {
    id: "power",
    title: "Power Creator",
    usage: "Heavy debugging, coding, and image generation",
    co2: 1.2,
    water: 150,
    equivalents: [
      { label: "Smartphone charges", val: 150 },
      { label: "LED bulb run time", val: "6 days" },
      { label: "Electric kettle boils", val: 50 },
      { label: "Petrol car travel", val: "5 km" }
    ]
  }
];

const staticFacts = [
  {
    id: "water",
    title: "Water Cooling Drain",
    fact: "Data centers consume fresh water to keep compute servers cool. A single conversation of 20-50 queries with an LLM can consume up to 500ml of water.",
    source: "University of California — 2023 Study"
  },
  {
    id: "energy",
    title: "Energy & Training Intensity",
    fact: "Training a single large AI model can consume more energy than 100 average households use in an entire year.",
    source: "IEA Electricity Report — 2024"
  },
  {
    id: "grid",
    title: "Global Grid Impact",
    fact: "Data center electricity demand is projected to double by 2026, reaching consumption levels comparable to the country of Japan.",
    source: "International Energy Agency"
  }
];

function AIAwareness() {
  const [selectedPreset, setSelectedPreset] = useState("casual");

  const activeData = aiPresets.find(p => p.id === selectedPreset);

  const handleSelectPreset = (id) => {
    playClick();
    setSelectedPreset(id);
  };

  const getFactIcon = (id) => {
    switch (id) {
      case "water": return <WaterIcon size={28} style={{ color: "#0D9488" }} />;
      case "energy": return <LightbulbIcon size={28} style={{ color: "#F59E0B" }} />;
      case "grid": return <SpiralIcon size={28} className="animate-spin" style={{ color: "#10B981", animationDuration: "12s" }} />;
      default: return <DrillIcon size={28} />;
    }
  };

  return (
    <div className="ai-awareness-container">
      <header className="ai-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
          <DrillIcon size={36} className="animate-pulse" style={{ color: "#FBBF24" }} />
          <h1 style={{ margin: 0 }}>AI Footprint Calculator</h1>
        </div>
        <p style={{ marginTop: "0.5rem" }}>Large AI language models run on high-intensity clusters. Choose your profile to scan the digital carbon cost.</p>
      </header>

      {/* Simplified Preset Selector Segment */}
      <section className="ai-selector-section card carbon-black">
        <h2>Choose Your AI Usage Level</h2>
        <p className="section-desc">Select the preset that matches your typical daily AI use.</p>
        
        <div className="segment-selector">
          {aiPresets.map((preset) => (
            <button
              key={preset.id}
              className={`segment-btn ${selectedPreset === preset.id ? "active" : ""}`}
              onClick={() => handleSelectPreset(preset.id)}
            >
              <span className="segment-title">{preset.title}</span>
              <span className="segment-subtitle">{preset.usage}</span>
            </button>
          ))}
        </div>

        {/* Dynamic calculation results */}
        <div className="ai-results-pane fade-in">
          <div className="results-grid">
            <div className="result-metric">
              <span className="metric-label">AI Carbon Cost</span>
              <span className="metric-value">{activeData.co2} kg CO₂ / day</span>
            </div>
            <div className="result-metric">
              <span className="metric-label">Water Cooling Cost</span>
              <span className="metric-value">{activeData.water} Litres / day</span>
            </div>
          </div>

          <div className="equivalents-box">
            <h3>Equivalent Physical Impact:</h3>
            <div className="equivalents-grid">
              {activeData.equivalents.map((eq, i) => (
                <div key={i} className="equivalent-card">
                  <span className="eq-value">{eq.val}</span>
                  <span className="eq-label">{eq.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Static Facts Grid */}
      <section className="ai-facts-section" style={{ marginTop: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
          <GlassesIcon size={28} />
          <h2 style={{ margin: 0 }}>AI & Environmental Impact Facts</h2>
        </div>
        <div className="facts-grid">
          {staticFacts.map((fact, i) => (
            <div key={i} className="fact-card card carbon-black">
              <div className="fact-header" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span className="fact-icon" style={{ display: "inline-flex" }}>{getFactIcon(fact.id)}</span>
                <h3 style={{ margin: 0 }}>{fact.title}</h3>
              </div>
              <p className="fact-body">{fact.fact}</p>
              <span className="fact-source" style={{ fontSize: "0.8rem", opacity: 0.7 }}>Source: {fact.source}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="disclaimer-banner" style={{ marginTop: "2rem", padding: "12px", background: "rgba(37, 99, 235, 0.1)", borderRadius: "8px", borderLeft: "4px solid #2563EB" }}>
        <p style={{ margin: 0, fontSize: "0.9rem" }}>
          <strong>Note:</strong> AI operations run remotely in cloud data centers. Incorporating digital carbon calculations shows comprehensive awareness of modern, invisible environmental costs.
        </p>
      </div>
    </div>
  );
}

export default AIAwareness;