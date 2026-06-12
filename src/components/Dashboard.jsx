import { useState, useEffect } from "react";
import { playClick, playSuccess } from "../utils/audio";
import { DrillIcon, GlassesIcon, SpiralIcon, SunIcon, CloudIcon, WindIcon } from "./icons";

function Dashboard({ userData, setScreen }) {
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState(
    localStorage.getItem("activeTheme") || "green"
  );
  const [glowIntensity, setGlowIntensity] = useState(
    localStorage.getItem("glowIntensity") || "subtle"
  );
  const [glowColor, setGlowColor] = useState(
    localStorage.getItem("glowColor") || "#10B981"
  );
  
  // Tutorial Walkthrough State
  const [showTutorial, setShowTutorial] = useState(
    !localStorage.getItem("tutorial_dashboard_completed")
  );
  const [tutorialStep, setTutorialStep] = useState(1);
  const [showResetWarning, setShowResetWarning] = useState(false);

  const [kpis, setKpis] = useState({
    todayTotal: 0,
    todayTrend: "No logs today",
    weeklyAvg: 0,
    weeklyTrend: "No logs yet",
    activePledges: 0,
    bestDay: 0,
    level: "Level 1: Carbon Novice 🌱",
    todayOffset: 0,
    todayGross: 0
  });

  const city = userData?.city || "Bengaluru";
  const country = userData?.country || "India";
  const avgCO2 = userData?.avgCO2 || 5.2;



  const handleThemeChange = (theme) => {
    playClick();
    setActiveTheme(theme);
    localStorage.setItem("activeTheme", theme);
    // Automatically match default glow colors if they haven't set a custom one
    if (glowColor === "#10B981" || glowColor === "#3B82F6" || glowColor === "#EF4444") {
      let nextGlow = "#10B981";
      if (theme === "blue") nextGlow = "#3B82F6";
      if (theme === "crimson") nextGlow = "#EF4444";
      setGlowColor(nextGlow);
      localStorage.setItem("glowColor", nextGlow);
    }
  };

  const handleGlowIntensityChange = (intensity) => {
    playClick();
    setGlowIntensity(intensity);
    localStorage.setItem("glowIntensity", intensity);
  };

  const handleGlowColorChange = (color) => {
    setGlowColor(color);
    localStorage.setItem("glowColor", color);
  };



  useEffect(() => {
    const fetchLiveDiagnostics = async () => {
      try {
        setLoading(true);
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();
        
        let lat = 12.9716; 
        let lon = 77.5946;
        let matchedCityName = city;

        if (geoData.results && geoData.results.length > 0) {
          lat = geoData.results[0].latitude;
          lon = geoData.results[0].longitude;
          matchedCityName = geoData.results[0].name;
        }

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
        );
        const weatherData = await weatherRes.json();

        const aqiRes = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
        );
        const aqiData = await aqiRes.json();

        setWeather({
          temp: Math.round(weatherData.current.temperature_2m),
          code: weatherData.current.weather_code,
          name: matchedCityName
        });
        setAqi(aqiData.current.us_aqi);
      } catch (err) {
        console.error("Failed to fetch weather diagnostics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveDiagnostics();

    // Fetch and calculate KPI statistics
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    const pledges = JSON.parse(localStorage.getItem("pledges") || "[]");
    const today = new Date().toISOString().split("T")[0];
    
    const getEntryNet = (entry) => {
      if (entry.netEmissions !== undefined) return entry.netEmissions;
      return Object.entries(entry)
        .filter(([k]) => k !== "date" && k !== "timestamp" && k !== "checksum" && k !== "fulfilledPledgeIds" && k !== "grossEmissions" && k !== "appliedOffset" && k !== "netEmissions")
        .reduce((sum, [, v]) => sum + (typeof v === "number" ? v : 0), 0);
    };

    // Today's total
    const todayEntry = history.find((h) => h.date === today);
    const todayVal = todayEntry ? getEntryNet(todayEntry) : 0;

    // Yesterday's total
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const yesterdayEntry = history.find((h) => h.date === yesterdayStr);
    const yesterdayVal = yesterdayEntry ? getEntryNet(yesterdayEntry) : 0;

    let todayTrendStr = "No logs yesterday";
    if (todayVal > 0 && yesterdayVal > 0) {
      const diff = ((todayVal - yesterdayVal) / yesterdayVal) * 100;
      todayTrendStr = diff > 0 ? `↑ ${Math.abs(diff).toFixed(0)}% more than yesterday` : `↓ ${Math.abs(diff).toFixed(0)}% less than yesterday`;
    } else if (todayVal > 0 && yesterdayVal === 0) {
      todayTrendStr = "First log logged";
    }

    // Average calculation
    let weeklyAvgVal = 0;
    if (history.length > 0) {
      const absoluteSum = history.reduce((sum, day) => sum + getEntryNet(day), 0);
      weeklyAvgVal = absoluteSum / history.length;
    }

    let weeklyTrendStr = "No history logs yet";
    if (weeklyAvgVal > 0) {
      const diffFromNational = ((weeklyAvgVal - avgCO2) / avgCO2) * 100;
      weeklyTrendStr = diffFromNational > 0 
        ? `↑ ${Math.abs(diffFromNational).toFixed(0)}% above country limit`
        : `↓ ${Math.abs(diffFromNational).toFixed(0)}% below country limit`;
    }

    // Active pledges
    const activePledgeCount = pledges.filter((p) => p.active).length;

    // Best Day calculation (minimum footprint > 0)
    let bestDayVal = 0;
    if (history.length > 0) {
      const dailyTotals = history.map(day => getEntryNet(day)).filter(tot => tot > 0);
      if (dailyTotals.length > 0) {
        bestDayVal = Math.min(...dailyTotals);
      }
    }

    // Level calculation based on log count
    let currentLevel = "Level 1: Carbon Novice 🌱";
    if (history.length >= 8) {
      currentLevel = "Level 4: Spiral Saver 🌀";
    } else if (history.length >= 4) {
      currentLevel = "Level 3: Green Committer ⚡";
    } else if (history.length >= 1) {
      currentLevel = "Level 2: Eco Starter 🚶";
    }

    const todayOffset = todayEntry && todayEntry.appliedOffset !== undefined ? todayEntry.appliedOffset : 0;
    const todayGross = todayEntry && todayEntry.grossEmissions !== undefined ? todayEntry.grossEmissions : todayVal;

    setKpis({
      todayTotal: todayVal.toFixed(2),
      todayTrend: todayTrendStr,
      weeklyAvg: weeklyAvgVal.toFixed(2),
      weeklyTrend: weeklyTrendStr,
      activePledges: activePledgeCount,
      bestDay: bestDayVal.toFixed(2),
      level: currentLevel,
      todayOffset: todayOffset,
      todayGross: todayGross
    });
  }, [userData, city, avgCO2]);

  const getAqiClass = (aqiScore) => {
    if (aqiScore <= 50) return "aqi-good";
    if (aqiScore <= 100) return "aqi-moderate";
    return "aqi-poor";
  };

  const getAqiLabel = (aqiScore) => {
    if (!aqiScore) return "Scanning...";
    if (aqiScore <= 50) return `${aqiScore} Good`;
    if (aqiScore <= 100) return `${aqiScore} Moderate`;
    return `${aqiScore} Poor`;
  };

  const handleQuickLog = () => {
    playClick();
    setScreen("input");
  };

  const handleResetProfile = () => {
    playClick();
    setShowResetWarning(true);
  };

  const confirmResetProfile = () => {
    playSuccess();
    localStorage.clear();
    window.location.reload();
  };

  const closeTutorial = () => {
    playSuccess();
    setShowTutorial(false);
    
    // Save tutorialCompleted as true in localStorage
    const savedData = JSON.parse(localStorage.getItem("userData") || "{}");
    savedData.tutorialCompleted = true;
    localStorage.setItem("userData", JSON.stringify(savedData));
    localStorage.setItem("tutorial_dashboard_completed", "true");
  };

  const nextTutorial = () => {
    playClick();
    if (tutorialStep < 5) {
      setTutorialStep(tutorialStep + 1);
    } else {
      closeTutorial();
    }
  };

  const prevTutorial = () => {
    playClick();
    if (tutorialStep > 1) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const rawPercent = kpis.todayTotal > 0 ? (kpis.todayTotal / avgCO2) * 100 : 0;
  const todayComparePercent = Math.min(rawPercent, 100);
  const todayNum = parseFloat(kpis.todayTotal) || 0;
  const remainingBudget = avgCO2 - todayNum;
  const isOverBudget = todayNum > avgCO2;

  // Custom Inline Star SVG matching Gurren Lagann theme
  const StarIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path 
        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z" 
        fill="#FBBF24" 
        stroke="#D97706" 
        strokeWidth="1.5" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="dashboard-container">
      {/* Custom Reset Warning Modal */}
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
              <h4 style={{ margin: "0 0 10px 0", color: "#1E293B" }}>Are you absolutely sure?</h4>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#475569", lineHeight: "1.5" }}>
                This action is permanent and cannot be undone. It will completely erase:
              </p>
              <ul style={{ margin: "10px 0", paddingLeft: "20px", fontSize: "0.9rem", color: "#475569" }}>
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

      {/* Interactive Walkthrough Tutorial Modal */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <div className="tutorial-step-header">
              <h3>
                <SpiralIcon size={22} className="icon-spiral" />
                <span>Simple Welcome Tour</span>
              </h3>
              <span className="tutorial-step-indicator">Step {tutorialStep} of 5</span>
            </div>
            
            <div className="tutorial-step-body">
              {tutorialStep === 1 && (
                <>
                  <h4>Welcome to karburn!</h4>
                  <p>Let's take a quick 1-minute tour to help you find your way around the home screen and understand how to use the app.</p>
                  <div className="tutorial-tip-box">
                    Your information is 100% private. All your logs are saved safely on your own computer!
                  </div>
                </>
              )}
              {tutorialStep === 2 && (
                <>
                  <h4>1. Daily Green Target (Eco-Budget)</h4>
                  <p>Your daily Green Target is your personal Eco-Budget. Think of it like a daily calorie limit: stay below it to prevent ecological deficit!</p>
                  <div className="tutorial-tip-box">
                    Your daily Eco-Budget target for {country} is {avgCO2} kg CO₂.
                  </div>
                </>
              )}
              {tutorialStep === 3 && (
                <>
                  <h4>2. Local Weather & Air Quality</h4>
                  <p>At the top right, the app displays live weather updates for your city. This shows the temperature and how clean your local air is today.</p>
                  <div className="tutorial-tip-box">
                    This displays estimates for your local area.
                  </div>
                </>
              )}
              {tutorialStep === 4 && (
                <>
                  <h4>3. Log Daily Activities</h4>
                  <p>Click "Log Today's Activity" or the plus (+) button to enter details about your travel distances, meals, and home appliances. The app will automatically calculate your daily score.</p>
                  <div className="tutorial-tip-box">
                    We built simple food presets so you don't need to weigh meals!
                  </div>
                </>
              )}
              {tutorialStep === 5 && (
                <>
                  <h4>4. Personal Journey Milestones</h4>
                  <p>Watch your progress improve over time. You will earn medals and reach new levels as you reduce your daily carbon footprint!</p>
                  <div className="tutorial-tip-box">
                    Ready to start saving? Let's take the first step!
                  </div>
                </>
              )}
            </div>

            <div className="tutorial-footer">
              <div className="tutorial-dot-container">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className={`tutorial-dot ${tutorialStep === s ? "active" : ""}`} />
                ))}
              </div>
              <div className="tutorial-buttons">
                {tutorialStep > 1 && (
                  <button className="btn-secondary" style={{ padding: "8px 16px" }} onClick={prevTutorial}>
                    Back
                  </button>
                )}
                <button className="btn-primary" style={{ padding: "8px 20px" }} onClick={nextTutorial}>
                  {tutorialStep === 5 ? "Get Started!" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header section */}
      <header className="dashboard-header-bar">
        <div className="greeting-block">
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
            Welcome Back, {userData?.name || "Explorer"}!
          </h1>
          <p style={{ margin: "5px 0 0 0" }}>Tracking your personal carbon journey in {city}, {country}.</p>
        </div>

        {/* Live Weather scanner */}
        <div className="scanner-widget kpi-card">
          {loading ? (
            <p className="scanner-loading">Checking local weather...</p>
          ) : weather ? (
            <>
              <div className="scanner-temp" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <SunIcon size={20} />
                <span>{weather.temp}°C</span>
              </div>
              <div className="scanner-city">{weather.name}</div>
              <span className={`scanner-aqi ${getAqiClass(aqi)}`} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <CloudIcon size={12} />
                <span>AQI: {getAqiLabel(aqi)}</span>
              </span>
            </>
          ) : (
            <p className="scanner-error">Weather offline</p>
          )}
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="kpi-grid">
        {/* KPI 1 */}
        <div className="kpi-card">
          <div className="kpi-icon">
            <SpiralIcon size={32} className="icon-spiral" />
          </div>
          <div className="kpi-info">
            <h3>Today's Footprint</h3>
            <div className="kpi-value">{kpis.todayTotal} <span className="kpi-unit">kg CO₂</span></div>
            {kpis.todayOffset > 0 && (
              <div style={{ fontSize: "11px", color: "#10B981", fontWeight: "700", marginTop: "2px", marginBottom: "2px" }}>
                Pledge Offsets: -{kpis.todayOffset.toFixed(2)} kg
              </div>
            )}
            <div className={`kpi-trend ${kpis.todayTrend.startsWith("↓") ? "trend-down" : "trend-up"}`}>
              {kpis.todayTrend}
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="kpi-card">
          <div className="kpi-icon">
            <GlassesIcon size={32} />
          </div>
          <div className="kpi-info">
            <h3>Personal Average</h3>
            <div className="kpi-value">{kpis.weeklyAvg} <span className="kpi-unit">kg CO₂/day</span></div>
            <div className={`kpi-trend ${kpis.weeklyTrend.startsWith("↓") ? "trend-down" : "trend-up"}`}>
              {kpis.weeklyTrend}
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="kpi-card">
          <div className="kpi-icon">
            <StarIcon size={32} />
          </div>
          <div className="kpi-info">
            <h3>Your Best Record</h3>
            <div className="kpi-value">{kpis.bestDay} <span className="kpi-unit">kg CO₂/day</span></div>
            <div className="kpi-trend trend-down">Lowest daily score</div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="kpi-card">
          <div className="kpi-icon">
            <DrillIcon size={32} className="icon-drill" />
          </div>
          <div className="kpi-info">
            <h3>Your Saver Level</h3>
            <div className="kpi-value" style={{ fontSize: "16px", marginTop: "6px" }}>{kpis.level.split(": ")[1]}</div>
            <div className="kpi-trend trend-highlight" style={{ fontSize: "11px" }}>{kpis.level.split(": ")[0]}</div>
          </div>
        </div>
      </section>

      {/* Budget progress bar */}
      <section className="main-budget-card carbon-black">
        <div className="budget-header">
          <h2>Daily Green Target (Eco-Budget)</h2>
          <span className="budget-limit">Budget: {avgCO2} kg CO₂</span>
        </div>
        <div className="budget-bar-bg">
          <div 
            className="budget-bar-fill" 
            style={{ 
              width: `${todayComparePercent}%`,
              backgroundColor: isOverBudget ? "var(--accent-crimson)" : todayComparePercent > 70 ? "var(--accent-gold)" : "var(--primary-green)"
            }}
          />
        </div>
        <div className="budget-footer">
          {todayNum === 0 ? (
            <p>Log your first activity today to see where you stand.</p>
          ) : isOverBudget ? (
            <p className="status-danger" style={{ color: "var(--accent-crimson)" }}>
              Warning: You have exceeded your daily Green Target by {Math.abs(remainingBudget).toFixed(2)} kg CO₂ ({Math.round(rawPercent - 100)}% over budget)!
            </p>
          ) : (
            <p className="status-success" style={{ color: "var(--primary-green)" }}>
              Good job! You have {remainingBudget.toFixed(2)} kg CO₂ remaining in your daily Eco-Budget.
            </p>
          )}
        </div>
      </section>

      {/* Theme & Glow Customization Console */}
      <section className="main-budget-card carbon-black" style={{ marginTop: "10px" }}>
        <div style={{ borderBottom: "1.5px solid rgba(255, 255, 255, 0.05)", paddingBottom: "12px", marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--primary-green)" }}>
            <SpiralIcon size={20} className="icon-spiral" />
            <span>Theme & Button Glow Customization</span>
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--card-text-muted)" }}>
            Personalize your console's primary highlights and button glow styles.
          </p>
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
          {/* Theme Color */}
          <div style={{ flex: "1 1 200px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#ffffff" }}>Primary Theme Color</h4>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                className={`pill-btn ${activeTheme === "green" ? "active" : ""}`}
                onClick={() => handleThemeChange("green")}
                style={{ fontSize: "11px", padding: "8px 14px" }}
              >
                Green Energy
              </button>
              <button 
                className={`pill-btn ${activeTheme === "blue" ? "active" : ""}`}
                onClick={() => handleThemeChange("blue")}
                style={{ fontSize: "11px", padding: "8px 14px" }}
              >
                Electric Blue
              </button>
              <button 
                className={`pill-btn ${activeTheme === "crimson" ? "active" : ""}`}
                onClick={() => handleThemeChange("crimson")}
                style={{ fontSize: "11px", padding: "8px 14px" }}
              >
                Kamina Crimson
              </button>
            </div>
          </div>

          {/* Glow Style/Intensity */}
          <div style={{ flex: "1 1 200px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#ffffff" }}>Button Glow Style</h4>
            <div style={{ display: "flex", gap: "8px" }}>
              {["none", "subtle", "vibrant"].map((intensity) => (
                <button 
                  key={intensity}
                  className={`pill-btn ${glowIntensity === intensity ? "active" : ""}`}
                  onClick={() => handleGlowIntensityChange(intensity)}
                  style={{ textTransform: "capitalize", fontSize: "11px", padding: "8px 14px" }}
                >
                  {intensity}
                </button>
              ))}
            </div>
          </div>

          {/* Glow Color Customization */}
          <div style={{ flex: "1 1 240px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#ffffff" }}>Glow Color</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {[
                { name: "Green", value: "#10B981" },
                { name: "Blue", value: "#3B82F6" },
                { name: "Crimson", value: "#EF4444" },
                { name: "Amber", value: "#F59E0B" },
                { name: "Purple", value: "#8B5CF6" },
                { name: "Cyan", value: "#06B6D4" }
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleGlowColorChange(preset.value)}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: preset.value,
                    border: glowColor.toLowerCase() === preset.value.toLowerCase() ? "2px solid #ffffff" : "2px solid rgba(0, 0, 0, 0.4)",
                    cursor: "pointer",
                    boxShadow: glowColor.toLowerCase() === preset.value.toLowerCase() ? `0 0 10px ${preset.value}` : "none",
                    padding: 0,
                    transition: "transform 0.1s ease"
                  }}
                  title={preset.name}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.15)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                />
              ))}
              
              {/* Custom Color Swatch with hidden input picker */}
              <div 
                style={{
                  position: "relative",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: !["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4"].includes(glowColor.toLowerCase()) ? "2px solid #ffffff" : "2px solid rgba(0, 0, 0, 0.4)",
                  boxShadow: !["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4"].includes(glowColor.toLowerCase()) ? `0 0 10px ${glowColor}` : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  transition: "transform 0.1s ease",
                  background: "linear-gradient(45deg, #ff0000, #ff7700, #ffdd00, #00ff00, #00ffff, #0000ff, #8800ff, #ff00ff)"
                }}
                title="Custom Color"
                onMouseEnter={(e) => e.target.style.transform = "scale(1.15)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                <input 
                  type="color"
                  value={glowColor}
                  onChange={(e) => handleGlowColorChange(e.target.value)}
                  style={{ 
                    position: "absolute",
                    top: "-4px",
                    left: "-4px",
                    width: "32px",
                    height: "32px",
                    opacity: 0,
                    cursor: "pointer",
                    padding: 0,
                    border: "none"
                  }}
                />
              </div>
              
              <span style={{ fontSize: "12px", color: "var(--card-text-muted)", fontFamily: "var(--font-mono)", marginLeft: "4px" }}>
                {glowColor.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Actions and shortcuts */}
      <section className="dashboard-shortcuts" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "80px", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "16px" }}>
          <button className="primary-action-btn" onClick={handleQuickLog} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DrillIcon size={18} />
            Log Today's Activity
          </button>
          <button className="secondary-action-btn" onClick={() => { playClick(); setScreen("history"); }} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <GlassesIcon size={18} />
            View Personal Journey
          </button>
        </div>
      </section>

      {/* Floating Action Button (FAB) */}
      <button 
        className="floating-action-button" 
        onClick={handleQuickLog}
        title="Add New Activity Log"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
}

export default Dashboard;