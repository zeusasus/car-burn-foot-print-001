# karburn 🌀
> **'Your daily carbon ledger'**

## 📢 Disclaimer
This is actually my first time coding an app with 0 coding experience but thanks to google alphacode and claude (alphacode did majority ofn the work, claude helped me in the scaffolding part) I awas able to bring this app to life.

---

## 💡 The Core Theme & Problem
'Your daily carbon ledger' is the theme, this is something which tackles the problem of our invisible emissions into a visible, actionable score.

**karburn** is a privacy-first, offline carbon footprint tracker that breaks down your environmental impact into a simple daily budget. Instead of overwhelming yourself with too many statistics, **karburn** gives you a real-time, gamified view of your daily ecological footprint — and helps you bring it back into balance if you're honest about it. 

### What problem does this app solve?
Most carbon tracking tools fail for the same or different reasons: 
*   **Too abstract**: "12 tons of CO₂ per year" means nothing to most people day-to-day.
*   **Too tedious**: Manual entry of fuel volumes, utility bills, and food weights causes drop-off.
*   **No actionable guidance**: Users learn they have a problem, but not what to do about it.
*   **Privacy-invasive**: Most apps require cloud accounts and continuous GPS tracking.
*   **Blind to digital habits**: Streaming and AI usage carry real energy/water costs that go unnoticed.

*Note: I also added many options like deliveries since people are increasingly into online food delivery/instant delivery schemes so i'd like them to be aware of what impact it causes to the nature (i've added india specific for now) but there is an option for *others* too.*

---

## 🎯 The Approach

| Traditional Carbon Trackers | karburn's Approach |
| :--- | :--- |
| **Invisible footprint** | Converts daily habits into a concrete kg CO₂ score |
| **Yearly-only metrics** | Daily Eco-Budget with a live progress bar (green = on track, red = deficit) |
| **Logging friction** | Smart presets + sliders — log your day in under 30 seconds |
| **Climate anxiety** | Eco Pledges: suggest habits and auto-apply their CO₂ savings |
| **Digital blind spot** | AI Footprint Calculator: reveals hidden energy/water costs (this is not real time and has fixed values so this part is just for the awareness part of the user) |
| **Privacy concerns** | 100% offline — no accounts, no cloud sync, no GPS but in the beginning it uses open meteo for showing weather and aqi |

---

## ✨ Features

### 📅 Daily Eco-Budget
Your yearly carbon footprint is broken down into a personalized daily target (e.g., 5.21 kg CO₂). A live progress bar shows whether you're within budget (green) or in an ecological deficit (red).

### ⚡ Fast Logging
Log activities in seconds using smart presets:
*   **Commute**: Car, bike, public transport, walking.
*   **Meals**: Light Meat Meal, vegetarian, vegan, etc.
*   **Appliances**: Ceiling Fan, AC usage, etc.
*   **Digital activity**: Netflix HD, AI queries, etc.
*   *Each preset uses a simple slider (0–999) to adjust intensity/duration.*

### 🤝 Eco Pledges (Missions)
**karburn** suggests habit changes — like raising your AC to 24°C or going vegetarian for a day — and shows the **annual CO₂ offset potential**. Completing a pledge instantly subtracts the savings from your daily score, closing the loop between what the user reads and if the user actually performs what they pledge to.

### 🤖 AI Footprint Calculator
This is so that it Brings awareness to the often-overlooked environmental cost of digital life including the electricity and water consumed by streaming and AI model usage in remote data center so the user knows what he's contributing to. *I know this is ironic considering i coded this app using AI but i hope that it brings change to people.*

### 🌤️ Live Weather & AQI
Real-time temperature and Air Quality Index, fetched via [Open-Meteo](https://open-meteo.com/):
1. **Geocoding**: Converts your city name into latitude/longitude.
2. **Weather**: Fetches current temperature and weather code.
3. **Air Quality**: Fetches the US AQI (0–500 scale).

**AQI is color-coded for quick reading:**
*   🟢 **0–50**: Good
*   🟡 **51–100**: Moderate
*   🔴 **101+**: Poor
*Note: AQI values use the US EPA standard (0–500 scale). This may differ slightly from country-specific AQI scales (e.g., India's CPCB AQI), though the underlying pollutant data is globally sourced.*

**🔒 No API key, no GPS hardware access — only the city name entered during onboarding is used.**

### 🛡️ Privacy by Design
*   No cloud registration.
*   No continuous location tracking.
*   All logs, presets, and achievements stay on-device.

---

## 🛠️ Technology Stack
*   **Frontend**: React
*   **Build Tooling**: Node.js, npm
*   **Android Packaging**: Android Studio (Capacitor-based)
*   **APIs**: Open-Meteo (Geocoding, Forecast, Air Quality)
*   **Version Control**: Git
*   **Development**: Built with [Google Antigravity](https://antigravity.google/) (AI-assisted / vibecoded development) along with some guidance for scaffolding of the app using Claude chat so, credits to them lol.

---

## 📂 Project Structure (Key Files)
```
car-burn-foot-print-001/
├── src/
│   ├── components/
│   │   └── Dashboard.jsx     Core dashboard, weather/AQI fetch logic
│   └── ...
├── android/                   Android Studio project (Capacitor)
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (LTS recommended)
*   [Git](https://git-scm.com/)
*   [Android Studio](https://developer.android.com/studio) (for Android builds)

**karburn** is distributed as ready-to-use setup so no build setup required.

### 💻 Desktop (Offline)
1. Download and unzip the provided `.zip` file.
2. Open the extracted folder and launch the app.
3. Use **karburn** fully offline on your desktop.

### 📱 Android
1. Download the provided `.apk` file.
2. Install it on your Android device (you may need to allow installs from unknown sources).
3. Open **karburn** and get started.

---

## 🔄 How It Works (Overview)
1. **Onboarding**: User enters their city name (no GPS required).
2. **Diagnostics**: On dashboard load, `fetchLiveDiagnostics()` runs three sequential Open-Meteo calls — geocoding → weather → air quality.
3. **Daily Logging**: User logs activities via presets/sliders; the app calculates real-time CO₂ impact.
4. **Eco-Budget Tracking**: Daily target vs. logged emissions determines progress bar color.
5. **Eco Pledges**: Completing a pledge subtracts its CO₂ savings from the daily total.
6. **AI Footprint Calculator**: Estimates and displays the environmental cost of digital/AI usage.

---

## 🔮 Possible Future Enhancements
*   Historical trends and weekly/monthly insights.
*   Community challenges (opt-in, privacy-preserving).
*   Expanded preset library for region-specific habits.
*   iOS support.

---

## 📄 License
MIT License

Copyright (c) 2026 zeusasus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 💖 Acknowledgements
*   [Open-Meteo](https://open-meteo.com/) for free, open-source weather and air quality data.
*   Built as part of a Hack2Skill vibecoding hackathon submission, developed using Google Antigravity and Claude.
*   *Anyways i hope you guys like my app, you're free to help me change anything in the app. also since i'm a fan of gurren Lagann, some elements from that anime is involved in the app so a plus for the weebs lmao.*
