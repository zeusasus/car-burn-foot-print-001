import { useState, useEffect, useRef } from "react";
import { playClick, playSuccess } from "../utils/audio";
import { countryAvgCO2, countries } from "../utils/countries";
import { SpiralIcon, DrillIcon } from "./icons";

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    country: "India",
    city: "Bengaluru",
  });

  const nameInputRef = useRef(null);
  const cityInputRef = useRef(null);

  useEffect(() => {
    if (step === 2 && nameInputRef.current) {
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
    if (step === 4 && cityInputRef.current) {
      setTimeout(() => {
        if (cityInputRef.current) {
          cityInputRef.current.focus();
        }
      }, 100);
    }
  }, [step]);

  const handleNext = () => {
    playClick();
    if (step === 2) {
      if (!form.name.trim()) {
        alert("Please enter your name!");
        return;
      }
    }
    if (step === 4) {
      if (!form.city.trim()) {
        alert("Please enter your city!");
        return;
      }
      playSuccess();
      onComplete({
        ...form,
        avgCO2: Number(((countryAvgCO2[form.country] || 4.8) * 1000 / 365).toFixed(2)),
        tutorialCompleted: false, // Triggers tutorial walkthrough on dashboard load
      });
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    playClick();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Dynamic help guide text based on current step
  const getStepGuide = () => {
    switch (step) {
      case 1:
        return {
          title: "Welcome to karburn",
          text: "This simple app helps you measure your daily carbon footprint, pick clean green habits, and watch your carbon score shrink.",
          tip: "Tip: Click Continue below to begin your setup!"
        };
      case 2:
        return {
          title: "Introduce Yourself",
          text: "We need your name to personalize your experience. Your name will be displayed at the top of the dashboard and used to log your custom achievements.",
          tip: "Tip: You can use your first name or a fun nickname!"
        };
      case 3:
        return {
          title: "Select Your Country",
          text: "Different countries have different energy grids and average habits. Selecting your country sets your baseline daily carbon goal based on a typical citizen's daily footprint.",
          tip: `Average citizen of ${form.country} emits ${((countryAvgCO2[form.country] || 4.8) * 1000 / 365).toFixed(2)} kg CO₂/day.`
        };
      case 4:
        return {
          title: "Live Local Weather",
          text: "We will look up your city coordinates to show you your local temperature and real-time air quality index right on your home dashboard.",
          tip: "Tip: Type city names in standard English (e.g. London, Tokyo, Bengaluru)."
        };
      default:
        return {};
    }
  };

  const guide = getStepGuide();

  return (
    <div className="onboarding-container">
      <div className="onboarding-card-split">
        {/* Left Side: Guide Panel */}
        <div className="onboarding-guide-panel">
          <div className="guide-header">
            <DrillIcon size={24} />
            <h3>First-Time Guide</h3>
          </div>
          <div className="guide-body">
            <h4>{guide.title}</h4>
            <p>{guide.text}</p>
            <div className="guide-tip-box">{guide.tip}</div>
          </div>
        </div>

        {/* Right Side: Onboarding form */}
        <div className="onboarding-form-panel">
          <div className="onboarding-header">
            <SpiralIcon size={44} className="icon-spiral" style={{ marginBottom: "12px" }} />
            <h1>karburn</h1>
            <p>Setting up your new profile</p>
          </div>

          <div className="step-indicator">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`step-dot ${step === s ? "active" : ""} ${step > s ? "completed" : ""}`} />
            ))}
          </div>

          <div className="onboarding-content">
            {step === 1 && (
              <div className="onboarding-step fade-in">
                <h2>Welcome aboard!</h2>
                <p style={{ fontSize: "1.05rem", color: "#A5B4FC", lineHeight: "1.6", margin: "10px 0 0 0" }}>
                  We're excited to help you track your green habits. Setting up your profile takes less than 30 seconds. Click continue to get started!
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="onboarding-step fade-in">
                <h2 id="onboarding-name-label">What is your name?</h2>
                <input
                  id="onboarding-name"
                  ref={nameInputRef}
                  className="google-input"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  autoFocus
                  aria-labelledby="onboarding-name-label"
                />
              </div>
            )}

            {step === 3 && (
              <div className="onboarding-step fade-in">
                <h2 id="onboarding-country-label">Select your country</h2>
                <select
                  id="onboarding-country"
                  className="google-select"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  aria-labelledby="onboarding-country-label"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {step === 4 && (
              <div className="onboarding-step fade-in">
                <h2 id="onboarding-city-label">Which city do you live in?</h2>
                <input
                  id="onboarding-city"
                  ref={cityInputRef}
                  className="google-input"
                  type="text"
                  placeholder="e.g. Bengaluru, London, Paris"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  autoFocus
                  aria-labelledby="onboarding-city-label"
                />
              </div>
            )}
          </div>

          <div className="onboarding-actions">
            {step > 1 && (
              <button className="btn-secondary" onClick={handlePrev}>
                ← Back
              </button>
            )}
            <button className="btn-primary highlight-btn" onClick={handleNext}>
              {step === 4 ? "Start Walkthrough" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;