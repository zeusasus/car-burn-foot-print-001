import { useState } from "react";
import { playClick, playSuccess } from "../utils/audio";
import { CarIcon, PlateIcon, LightbulbIcon, WaterIcon, BookIcon, ClothingIcon, ScreenIcon, CartIcon } from "./icons";

const PackageBoxIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="21 8 21 21 3 21 3 8"></polyline>
    <rect x="1" y="3" width="22" height="5"></rect>
    <line x1="10" y1="12" x2="14" y2="12"></line>
  </svg>
);

const foodItems = [
  { name: "Heavy Meat Meal", co2: 4.5, desc: "Beef, lamb, or pork dishes with sides" },
  { name: "Light Meat Meal", co2: 1.2, desc: "Chicken, turkey, fish, or egg dishes" },
  { name: "Vegetarian Meal", co2: 0.5, desc: "Dairy, paneer, eggs, rice, or lentils" },
  { name: "Vegan Meal", co2: 0.2, desc: "100% plant-based vegetables and grains" },
  { name: "Beverage & Snack", co2: 0.3, desc: "Coffee, tea, milk drinks, and snacks" },
];

const appliances = [
  { name: "AC (1 ton)", kw: 1.0 },
  { name: "AC (1.5 ton)", kw: 1.5 },
  { name: "AC (2 ton)", kw: 2.0 },
  { name: "Refrigerator", kw: 0.15 },
  { name: "Washing Machine", kw: 0.5 },
  { name: "TV", kw: 0.1 },
  { name: "Microwave", kw: 1.2 },
  { name: "Electric Water Heater", kw: 2.0 },
  { name: "Ceiling Fan", kw: 0.075 },
  { name: "Laptop", kw: 0.05 },
  { name: "Desktop PC", kw: 0.2 },
  { name: "Clothing Iron", kw: 1.0 },
  { name: "Induction Stove", kw: 1.8 },
];

const fabricTypes = [
  { name: "Cotton", co2: 5.5, info: "Natural fiber but moderate water use" },
  { name: "Polyester", co2: 9.5, info: "Synthetic fossil fuel derivative" },
  { name: "Linen", co2: 1.5, info: "Highly sustainable, biodegradable" },
  { name: "Hemp", co2: 0.5, info: "Excellent carbon capture crop" },
  { name: "Wool", co2: 4.0, info: "Natural fiber, animal footprint" },
  { name: "Recycled", co2: 0.3, info: "Lowest carbon textile option" },
];

const streamingApps = [
  { name: "Netflix HD", co2: 0.072 },
  { name: "Netflix SD", co2: 0.036 },
  { name: "YouTube Video", co2: 0.036 },
  { name: "Spotify Audio", co2: 0.001 },
  { name: "Streaming Video (Other)", co2: 0.036 },
];

const quickCommerceApps = [
  "Blinkit", "Zepto", "Swiggy Instamart", "BigBasket", "Amazon / Flipkart", "Other"
];

const INDIA_GRID = 0.82; // kg CO2 per kWh grid factor

function InputForm({ onSubmit }) {
  const [section, setSection] = useState("transport");
  const [showTutorial, setShowTutorial] = useState(
    !localStorage.getItem("tutorial_input_completed")
  );
  const [tutorialStep, setTutorialStep] = useState(1);

  const nextTutorial = () => {
    playClick();
    if (tutorialStep === 3) {
      setShowTutorial(false);
      localStorage.setItem("tutorial_input_completed", "true");
    } else {
      setTutorialStep(tutorialStep + 1);
    }
  };

  const [transport, setTransport] = useState({
    km: 0, fuelType: "petrol", kmPerLiter: 15,
    flightTaken: false,
  });

  const [foodSelections, setFoodSelections] = useState([]);
  const [savedMeals, setSavedMeals] = useState(
    JSON.parse(localStorage.getItem("savedMeals") || "[]")
  );

  const [applianceSelections, setApplianceSelections] = useState([]);
  const [savedAppliances, setSavedAppliances] = useState(
    JSON.parse(localStorage.getItem("savedAppliances") || "[]")
  );

  const [books, setBooks] = useState(0);

  const [clothing, setClothing] = useState({
    count: 0, fabric: "Cotton"
  });

  const [water, setWater] = useState({
    showerMinutes: 0, useGeyser: false
  });

  const [streaming, setStreaming] = useState([]);

  const [shoppingList, setShoppingList] = useState([]);
  const [currentDelivery, setCurrentDelivery] = useState({
    app: "Blinkit", distance: 5
  });

  const handleSectionSwitch = (sec) => {
    playClick();
    setSection(sec);
  };

  const addFood = (item) => {
    playClick();
    const existing = foodSelections.findIndex((f) => f.name === item.name);
    if (existing >= 0) {
      const updated = [...foodSelections];
      updated[existing].quantity += 1;
      setFoodSelections(updated);
    } else {
      setFoodSelections([...foodSelections, { ...item, quantity: 1 }]);
    }
  };

  const updateFoodQty = (index, qty) => {
    const updated = [...foodSelections];
    updated[index].quantity = qty === "" ? "" : Math.max(0, Number(qty));
    setFoodSelections(updated.filter((f) => f.quantity !== 0 && f.quantity !== "0"));
  };

  const saveMeal = () => {
    playClick();
    if (foodSelections.length === 0) {
      alert("Select some foods first!");
      return;
    }
    const meals = [...savedMeals, foodSelections];
    setSavedMeals(meals);
    localStorage.setItem("savedMeals", JSON.stringify(meals));
    playSuccess();
    alert("Meal setup saved as preset!");
  };

  const loadMeal = (meal) => {
    playClick();
    setFoodSelections(meal);
  };

  const addAppliance = (appliance) => {
    playClick();
    const existing = applianceSelections.findIndex((a) => a.name === appliance.name);
    if (existing >= 0) {
      const updated = [...applianceSelections];
      updated[existing].hours += 1;
      setApplianceSelections(updated);
    } else {
      setApplianceSelections([...applianceSelections, { ...appliance, hours: 1 }]);
    }
  };

  const updateApplianceHours = (index, hours) => {
    const updated = [...applianceSelections];
    updated[index].hours = Math.max(0, hours);
    setApplianceSelections(updated.filter((a) => a.hours > 0));
  };

  const saveAppliancesPreset = () => {
    playClick();
    if (applianceSelections.length === 0) {
      alert("Select some appliances first!");
      return;
    }
    const saved = [...savedAppliances, applianceSelections];
    setSavedAppliances(saved);
    localStorage.setItem("savedAppliances", JSON.stringify(saved));
    playSuccess();
    alert("Appliance setup saved as preset!");
  };

  const loadAppliances = (preset) => {
    playClick();
    setApplianceSelections(preset);
  };

  const addStreaming = (app) => {
    playClick();
    const existing = streaming.findIndex((s) => s.name === app.name);
    if (existing >= 0) {
      const updated = [...streaming];
      updated[existing].hours += 1;
      setStreaming(updated);
    } else {
      setStreaming([...streaming, { ...app, hours: 1 }]);
    }
  };

  const updateStreamingHours = (index, hours) => {
    const updated = [...streaming];
    updated[index].hours = Math.max(0, hours);
    setStreaming(updated.filter((s) => s.hours > 0));
  };

  const calculateTransport = () => {
    const fuelFactors = { petrol: 2.31, diesel: 2.68, cng: 1.96, electric: 0.05 };
    const carCO2 = transport.km > 0
      ? (transport.km / transport.kmPerLiter) * fuelFactors[transport.fuelType]
      : 0;
    const flightCO2 = transport.flightTaken ? 255 : 0;
    return parseFloat((carCO2 + flightCO2).toFixed(2));
  };

  const calculateFood = () => {
    return parseFloat(
      foodSelections.reduce((sum, item) => sum + item.co2 * item.quantity, 0).toFixed(2)
    );
  };

  const calculateEnergy = () => {
    return parseFloat(
      applianceSelections.reduce((sum, a) => sum + a.kw * a.hours * INDIA_GRID, 0).toFixed(2)
    );
  };

  const calculateWater = () => {
    return parseFloat(
      (water.useGeyser ? water.showerMinutes * 0.05 : 0).toFixed(2)
    );
  };

  const calculateClothing = () => {
    const fabric = fabricTypes.find((f) => f.name === clothing.fabric);
    return parseFloat((clothing.count * (fabric?.co2 || 5.5)).toFixed(2));
  };

  const calculateStreaming = () => {
    return parseFloat(
      streaming.reduce((sum, s) => sum + s.co2 * s.hours, 0).toFixed(2)
    );
  };

  const calculateShopping = () => {
    return parseFloat(
      shoppingList.reduce((sum, item) => sum + (item.distance * 0.05), 0).toFixed(2)
    );
  };

  const handleSubmit = () => {
    playSuccess();
    onSubmit({
      transport: calculateTransport(),
      food: calculateFood(),
      energy: calculateEnergy(),
      water: calculateWater(),
      books: parseFloat((books * 1.2).toFixed(2)),
      clothing: calculateClothing(),
      streaming: calculateStreaming(),
      shopping: calculateShopping(),
      raw: {
        kmDriven: transport.km,
        flightTaken: transport.flightTaken,
        vegetarianMeals: foodSelections.filter(f => f.name === "Vegetarian Meal").reduce((sum, f) => sum + f.quantity, 0),
        veganMeals: foodSelections.filter(f => f.name === "Vegan Meal").reduce((sum, f) => sum + f.quantity, 0),
        useGeyser: water.useGeyser,
        showerMinutes: water.showerMinutes,
        acHours: applianceSelections.filter(a => a.name.includes("AC")).reduce((sum, a) => sum + a.hours, 0),
      }
    });
  };

  const sections = [
    { id: "transport", icon: <CarIcon size={22} />, label: "Travel" },
    { id: "food", icon: <PlateIcon size={22} />, label: "Diet" },
    { id: "energy", icon: <LightbulbIcon size={22} />, label: "Electricity" },
    { id: "water", icon: <WaterIcon size={22} />, label: "Water" },
    { id: "books", icon: <BookIcon size={22} />, label: "Paper" },
    { id: "clothing", icon: <ClothingIcon size={22} />, label: "Apparel" },
    { id: "streaming", icon: <ScreenIcon size={22} />, label: "Media" },
    { id: "shopping", icon: <CartIcon size={22} />, label: "Deliveries" }
  ];

  return (
    <div className="log-container">
      {showTutorial && (
        <div className="tutorial-overlay" style={{ zIndex: 1100 }}>
          <div className="tutorial-card" style={{ maxWidth: "450px" }}>
            <div className="tutorial-step-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <CarIcon size={22} style={{ color: "var(--primary-green)" }} />
                <span>Logger Tour</span>
              </h3>
              <span className="tutorial-step-indicator">Step {tutorialStep} of 3</span>
            </div>
            
            <div className="tutorial-step-body" style={{ margin: "20px 0" }}>
              {tutorialStep === 1 && (
                <>
                  <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>1. Choose a Category</h4>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#A5B4FC", lineHeight: "1.5" }}>
                    Use the tabs at the top to switch between different parts of your day, such as Travel, Diet, Electricity, and more.
                  </p>
                </>
              )}
              {tutorialStep === 2 && (
                <>
                  <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>2. Easy Sliders & Presets</h4>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#A5B4FC", lineHeight: "1.5" }}>
                    Drag the sliders or enter your miles/km (up to 999) to log details. You can also save common setups as presets.
                  </p>
                </>
              )}
              {tutorialStep === 3 && (
                <>
                  <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>3. Safe Saving</h4>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#A5B4FC", lineHeight: "1.5" }}>
                    When you save today's log, the entries are recorded with the correct date and time. Past days cannot be edited later to keep your diary honest and clean!
                  </p>
                </>
              )}
            </div>

            <div className="tutorial-footer" style={{ justifyContent: "space-between", borderTop: "none", padding: 0 }}>
              <div className="tutorial-dot-container" style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`tutorial-dot ${tutorialStep === s ? "active" : ""}`} />
                ))}
              </div>
              <div className="tutorial-buttons">
                <button className="btn-primary" style={{ padding: "8px 20px" }} onClick={nextTutorial}>
                  {tutorialStep === 3 ? "Understood!" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="log-header">
        <h1>Log Daily Activities</h1>
        <p>Input today's consumption details to calculate your carbon footprint.</p>
      </header>

      {/* Grid selector buttons with clean vectors */}
      <div className="log-tabs">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`log-tab-btn tab-${s.id} ${section === s.id ? "active" : ""}`}
            onClick={() => handleSectionSwitch(s.id)}
          >
            <span className="tab-icon">{s.icon}</span>
            <span className="tab-label">{s.label}</span>
          </button>
        ))}
      </div>

      <div className={`log-form-panel carbon-black section-glow-${section}`}>
        {/* TRANSPORT */}
        {section === "transport" && (
          <div className="form-pane fade-in">
            <h2>Travel & Transport</h2>
            <div className="form-field">
              <label>Distance Driven (km)</label>
              <input 
                type="range" min="0" max="999" step="5"
                value={transport.km}
                onChange={(e) => setTransport({ ...transport, km: Number(e.target.value) })} 
              />
              <div className="slider-indicator">{transport.km} km</div>
            </div>

            <div className="form-field-grid">
              <div className="form-field">
                <label>Fuel Casing Type</label>
                <select 
                  value={transport.fuelType}
                  onChange={(e) => { playClick(); setTransport({ ...transport, fuelType: e.target.value }); }}
                >
                  <option value="petrol">Petrol Car (2.31 kg CO₂/L)</option>
                  <option value="diesel">Diesel Car (2.68 kg CO₂/L)</option>
                  <option value="cng">CNG Vehicle (1.96 kg CO₂/kg)</option>
                  <option value="electric">Electric Vehicle (0.05 kg CO₂/km)</option>
                </select>
              </div>

              <div className="form-field">
                <label>Vehicle Mileage (km/L or km/charge)</label>
                <input 
                  type="number" min="1" max="100"
                  value={transport.kmPerLiter === 0 ? "" : transport.kmPerLiter}
                  onChange={(e) => setTransport({ ...transport, kmPerLiter: e.target.value === "" ? 0 : Number(e.target.value) })} 
                />
              </div>
            </div>

            <div className="form-checkbox-field">
              <label className="checkbox-container">
                <input 
                  type="checkbox" checked={transport.flightTaken}
                  onChange={(e) => { playClick(); setTransport({ ...transport, flightTaken: e.target.checked }); }} 
                />
                <span className="checkmark"></span>
                Flown a domestic flight today (+255 kg CO₂)
              </label>
            </div>
            
            <div className="estimate-indicator">
              Category Total: <strong>{calculateTransport()} kg CO₂</strong>
            </div>
          </div>
        )}

        {/* FOOD (Simplified Meal Presets) */}
        {section === "food" && (
          <div className="form-pane fade-in">
            <h2>Dietary Consumption</h2>
            
            {savedMeals.length > 0 && (
              <div className="presets-block">
                <span>Quick-load meal presets:</span>
                <div className="presets-grid">
                  {savedMeals.map((meal, index) => (
                    <button 
                      key={index} className="preset-pill-btn" 
                      onClick={() => loadMeal(meal)}
                    >
                      Saved Meal Preset {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="field-hint">Select the type of meals you had today (tap to add multiple):</p>
            <div className="selector-cards-grid">
              {foodItems.map((item) => (
                <button 
                  key={item.name} className="selector-card" 
                  onClick={() => addFood(item)}
                >
                  <span className="plus-symbol">+</span> {item.name}
                  <span className="card-co2" style={{ fontSize: "11px", color: "var(--card-text-muted)" }}>{item.desc}</span>
                  <span className="card-co2" style={{ fontWeight: "700" }}>{item.co2} kg CO₂</span>
                </button>
              ))}
            </div>

            {foodSelections.length > 0 && (
              <div className="selection-review-box">
                <h3>Selected Meals:</h3>
                {foodSelections.map((item, index) => (
                  <div key={index} className="selection-row">
                    <span>{item.name}</span>
                    <div className="qty-controls">
                      <button onClick={() => updateFoodQty(index, item.quantity - 1)}>-</button>
                      <input 
                        type="number" min="1" value={item.quantity}
                        onChange={(e) => updateFoodQty(index, e.target.value === "" ? "" : Number(e.target.value))} 
                      />
                      <button onClick={() => updateFoodQty(index, item.quantity + 1)}>+</button>
                    </div>
                    <span>{(item.co2 * item.quantity).toFixed(2)} kg CO₂</span>
                  </div>
                ))}
                <button className="btn-secondary" onClick={saveMeal}>Save Meal Preset</button>
              </div>
            )}

            <div className="estimate-indicator">
              Category Total: <strong>{calculateFood()} kg CO₂</strong>
            </div>
          </div>
        )}

        {/* ENERGY */}
        {section === "energy" && (
          <div className="form-pane fade-in">
            <h2>Electricity & AC</h2>
            
            {savedAppliances.length > 0 && (
              <div className="presets-block">
                <span>Quick-load appliance configurations:</span>
                <div className="presets-grid">
                  {savedAppliances.map((preset, index) => (
                    <button 
                      key={index} className="preset-pill-btn" 
                      onClick={() => loadAppliances(preset)}
                    >
                      Config {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="field-hint">Select the appliances run today to log active runtime:</p>
            <div className="selector-cards-grid">
              {appliances.map((a) => (
                <button 
                  key={a.name} className="selector-card" 
                  onClick={() => addAppliance(a)}
                >
                  <span className="plus-symbol">+</span> {a.name}
                  <span className="card-co2">{a.kw} kW draw</span>
                </button>
              ))}
            </div>

            {applianceSelections.length > 0 && (
              <div className="selection-review-box">
                <h3>Selected Appliance Runtime:</h3>
                {applianceSelections.map((a, index) => (
                  <div key={index} className="selection-row">
                    <span>{a.name}</span>
                    <div className="qty-controls">
                      <button onClick={() => updateApplianceHours(index, a.hours - 0.5)}>-</button>
                      <span className="qty-hours-label">{a.hours} hrs</span>
                      <button onClick={() => updateApplianceHours(index, a.hours + 0.5)}>+</button>
                    </div>
                    <span>{(a.kw * a.hours * INDIA_GRID).toFixed(2)} kg CO₂</span>
                  </div>
                ))}
                <button className="btn-secondary" onClick={saveAppliancesPreset}>Save Appliance Preset</button>
              </div>
            )}

            <div className="estimate-indicator">
              Category Total: <strong>{calculateEnergy()} kg CO₂</strong>
            </div>
          </div>
        )}

        {/* WATER */}
        {section === "water" && (
          <div className="form-pane fade-in">
            <h2>Shower & Water</h2>
            
            <div className="form-field">
              <label>Shower Duration (minutes)</label>
              <input 
                type="range" min="0" max="60" step="1"
                value={water.showerMinutes}
                onChange={(e) => setWater({ ...water, showerMinutes: Number(e.target.value) })} 
              />
              <div className="slider-indicator">{water.showerMinutes} mins</div>
            </div>

            <div className="form-checkbox-field">
              <label className="checkbox-container">
                <input 
                  type="checkbox" checked={water.useGeyser}
                  onChange={(e) => { playClick(); setWater({ ...water, useGeyser: e.target.checked }); }} 
                />
                <span className="checkmark"></span>
                Used Electric Water Heater (+0.05 kg CO₂ per minute)
              </label>
            </div>

            <div className="estimate-indicator">
              Category Total: <strong>{calculateWater()} kg CO₂</strong>
            </div>
          </div>
        )}

        {/* BOOKS */}
        {section === "books" && (
          <div className="form-pane fade-in">
            <h2>Paper & Books</h2>
            <div className="form-field">
              <label>New Notebooks or Paper Books used this month</label>
              <input 
                type="number" min="0" max="50"
                value={books === 0 ? "" : books}
                onChange={(e) => setBooks(e.target.value === "" ? 0 : Number(e.target.value))} 
              />
            </div>
            
            <div className="estimate-indicator">
              Category Total: <strong>{(books * 1.2).toFixed(2)} kg CO₂</strong>
            </div>
          </div>
        )}

        {/* CLOTHING */}
        {section === "clothing" && (
          <div className="form-pane fade-in">
            <h2>Apparel Purchases</h2>
            <div className="form-field-grid">
              <div className="form-field">
                <label>New Clothing Items Purchased (this month)</label>
                <input 
                  type="number" min="0" max="20"
                  value={clothing.count === 0 ? "" : clothing.count}
                  onChange={(e) => setClothing({ ...clothing, count: e.target.value === "" ? 0 : Number(e.target.value) })} 
                />
              </div>

              <div className="form-field">
                <label>Primary Fabric Material</label>
                <select 
                  value={clothing.fabric}
                  onChange={(e) => { playClick(); setClothing({ ...clothing, fabric: e.target.value }); }}
                >
                  {fabricTypes.map((f) => (
                    <option key={f.name} value={f.name}>{f.name} ({f.co2} kg CO₂) - {f.info}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="estimate-indicator">
              Category Total: <strong>{calculateClothing()} kg CO₂</strong>
            </div>
          </div>
        )}

        {/* STREAMING */}
        {section === "streaming" && (
          <div className="form-pane fade-in">
            <h2>Streaming Net Media</h2>
            <p className="field-hint">Select platforms used for media consumption today:</p>
            
            <div className="selector-cards-grid">
              {streamingApps.map((app) => (
                <button 
                  key={app.name} className="selector-card" 
                  onClick={() => addStreaming(app)}
                >
                  <span className="plus-symbol">+</span> {app.name}
                  <span className="card-co2">{app.co2} kg/hr</span>
                </button>
              ))}
            </div>

            {streaming.length > 0 && (
              <div className="selection-review-box">
                <h3>Streaming Details:</h3>
                {streaming.map((s, index) => (
                  <div key={index} className="selection-row">
                    <span>{s.name}</span>
                    <div className="qty-controls">
                      <button onClick={() => updateStreamingHours(index, s.hours - 0.5)}>-</button>
                      <span className="qty-hours-label">{s.hours} hrs</span>
                      <button onClick={() => updateStreamingHours(index, s.hours + 0.5)}>+</button>
                    </div>
                    <span>{(s.co2 * s.hours).toFixed(2)} kg CO₂</span>
                  </div>
                ))}
              </div>
            )}

            <div className="estimate-indicator">
              Category Total: <strong>{calculateStreaming()} kg CO₂</strong>
            </div>
          </div>
        )}

        {/* SHOPPING */}
        {section === "shopping" && (
          <div className="form-pane fade-in">
            <h2>Online Deliveries</h2>
            <p className="field-hint">Add individual deliveries ordered today to calculate your footprint:</p>
            
            {shoppingList.length === 0 ? (
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                padding: "32px 20px", 
                backgroundColor: "rgba(255, 255, 255, 0.02)", 
                border: "1.5px dashed rgba(255, 255, 255, 0.08)", 
                borderRadius: "16px", 
                textAlign: "center", 
                marginTop: "16px",
                marginBottom: "24px"
              }}>
                <CartIcon size={40} style={{ color: "rgba(239, 68, 68, 0.4)", marginBottom: "12px" }} />
                <h3 style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#ffffff", fontWeight: "600" }}>No packages logged today</h3>
                <p style={{ margin: 0, fontSize: "11px", color: "var(--card-text-muted)", maxWidth: "280px", lineHeight: "1.4" }}>
                  Add your food deliveries or online shopping packages below to estimate their transit carbon footprint.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "16px 0 24px 0" }}>
                <h3 style={{ fontSize: "13px", color: "#ffffff", fontWeight: "600", marginBottom: "4px" }}>Logged Packages:</h3>
                {shoppingList.map((item) => (
                  <div key={item.id} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    padding: "12px 16px", 
                    backgroundColor: "rgba(255, 255, 255, 0.03)", 
                    border: "1.5px solid rgba(255, 255, 255, 0.06)", 
                    borderRadius: "12px",
                    gap: "12px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ 
                        width: "32px", 
                        height: "32px", 
                        borderRadius: "8px", 
                        backgroundColor: "rgba(239, 68, 68, 0.1)", 
                        border: "1.5px solid rgba(239, 68, 68, 0.2)",
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        color: "#EF4444"
                      }}>
                        <PackageBoxIcon size={16} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <span style={{ fontWeight: "700", color: "#ffffff", fontSize: "13px" }}>{item.app} package</span>
                        <span style={{ fontSize: "11px", color: "var(--card-text-muted)" }}>Distance: {item.distance} km</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontWeight: "700", color: "#EF4444", fontSize: "13px" }}>
                        +{(item.distance * 0.05).toFixed(2)} kg CO₂
                      </span>
                      <button 
                        onClick={() => {
                          playClick();
                          setShoppingList(shoppingList.filter(s => s.id !== item.id));
                        }}
                        style={{ 
                          backgroundColor: "rgba(239, 68, 68, 0.15)", 
                          color: "#EF4444", 
                          border: "none", 
                          borderRadius: "50%", 
                          width: "22px", 
                          height: "22px", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "11px"
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="form-field-grid" style={{ alignItems: "flex-end", borderTop: "1.5px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px" }}>
              <div className="form-field">
                <label>Delivery App Platform</label>
                <select 
                  value={currentDelivery.app}
                  onChange={(e) => { playClick(); setCurrentDelivery({ ...currentDelivery, app: e.target.value }); }}
                >
                  {quickCommerceApps.map((app) => (
                    <option key={app} value={app}>{app}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Approx. Warehouse Distance (km)</label>
                <input 
                  type="number" min="1" max="999"
                  value={currentDelivery.distance === 0 ? "" : currentDelivery.distance}
                  onChange={(e) => setCurrentDelivery({ ...currentDelivery, distance: e.target.value === "" ? 0 : Number(e.target.value) })} 
                />
              </div>

              <div className="form-field">
                <button 
                  className="btn-primary highlight-btn" 
                  onClick={() => {
                    playClick();
                    if (currentDelivery.distance <= 0) {
                      alert("Please enter a valid distance!");
                      return;
                    }
                    setShoppingList([...shoppingList, { ...currentDelivery, id: Date.now() }]);
                    setCurrentDelivery({ ...currentDelivery, distance: 5 }); // Reset distance
                  }}
                  style={{ padding: "12px 20px", width: "100%", borderRadius: "12px" }}
                >
                  + Add Package
                </button>
              </div>
            </div>

            <div className="estimate-indicator" style={{ marginTop: "24px" }}>
              Category Total: <strong>{calculateShopping()} kg CO₂</strong>
            </div>
          </div>
        )}
      </div>

      <div className="submit-block">
        <button className="primary-action-btn submit-btn" onClick={handleSubmit}>
          Record Today's Final Emissions
        </button>
      </div>
    </div>
  );
}

export default InputForm;