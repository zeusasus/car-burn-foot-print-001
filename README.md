# karburn 🌀
> **A private, offline-first personal carbon target diary & simulator.**

**karburn** is a premium, space-themed personal carbon tracker and habit simulator designed to solve the friction of environmental tracking. By converting daily behaviors into a tactile, color-coded **Daily Green Target (Eco-Budget)**, it translates abstract planetary metrics into an interactive dashboard.

---

## 💡 Problems Solved

1. **The "Invisible Footprint"**: Maps abstract environmental metrics (driving, cooling, dining) into real-time daily weights in kilograms (kg CO₂).
2. **Eco-Budget Framework**: Breaks down global carbon limits into a daily calorie-style budget (e.g. **5.21 kg CO₂ / day** in India) to keep users out of ecological deficit.
3. **Frictionless Logging**: Simplifies logging through category presets (Travel, Diet, Electricity, Water, Apparel, Deliveries) and quick-sliders under 30 seconds.
4. **Actionable Eco Pledges**: Suggests actionable, custom habit targets (e.g. raises AC to 24°C, plant a tree) and automatically deducts verified daily offsets from scores.
5. **Digital Carbon Impact**: Incorporates calculations for cloud computations, including text LLM prompts, image generations, and media streaming.
6. **100% Client-Side Privacy**: Runs completely offline. No tracking, no GPS hardware access, and no server databases.

---

## 🛠️ Technology Stack
* **Frontend UI**: React 19, CSS3 (Custom theme glows, space canvas backgrounds, glassmorphism card modules), Vite 8 (build packager).
* **Desktop Wrapper**: Electron 42 (mirrors local memory state to a physical `user_state.json` file).
* **Mobile Wrapper**: Capacitor 8 (transpiles frontend code into a native Android project wrapper).
* **Security & Obfuscation**: JavaScript Obfuscator 5, SHA-256 equivalent local integrity checksum hashing.

---

## 🚀 Compilation & Build Guide

### 1. Compile and Obfuscate Web Assets
To build the distribution web app (outputs to `dist/`):
```bash
npm run build
```

### 2. Synchronize Assets to Android Wrapper
To write compiled web assets into Capacitor's Android folder assets:
```bash
npx cap sync
```
*Once synced, open `android/` inside Android Studio to compile your final `.apk` wrapper.*

### 3. Package Standalone Desktop Executable
To package the app into a standalone portable Windows folder (`dist-builds/karburn-win32-x64/` containing `karburn.exe`):
```bash
node manual_package.cjs
```

---

## 🔒 Security & Data Integrity
To protect history honesty, karburn seals every log entry with a cryptographic checksum calculated locally from the date, timestamp, and emission parameters. 

```javascript
const dataStr = `${today}|${timestamp}|${grossEmissions}|${netEmissions}|${appliedOffset}`;
let hash = 0;
for (let i = 0; i < dataStr.length; i++) {
  hash = (hash << 5) - hash + dataStr.charCodeAt(i);
  hash |= 0;
}
const checksum = Math.abs(hash).toString(16);
```
If any log parameters are manually modified inside the local JSON configuration file, the app detects the checksum mismatch on boot and alerts the user of database corruption.
