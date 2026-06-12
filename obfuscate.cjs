const fs = require("fs");
const path = require("path");
const JavaScriptObfuscator = require("javascript-obfuscator");

const assetsDir = path.join(__dirname, "dist", "assets");

function obfuscateDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log("Assets directory not found. Skipping obfuscation.");
    return;
  }
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      obfuscateDirectory(filePath);
    } else if (file.endsWith(".js")) {
      console.log(`Obfuscating: ${file}`);
      const code = fs.readFileSync(filePath, "utf8");
      try {
        const result = JavaScriptObfuscator.obfuscate(code, {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          numbersToExpressions: true,
          simplify: true,
          stringArrayThreshold: 0.8,
          splitStrings: true,
          stringArray: true,
        });
        fs.writeFileSync(filePath, result.getObfuscatedCode(), "utf8");
      } catch (e) {
        console.error(`Error obfuscating ${file}:`, e);
      }
    }
  });
}

console.log("Starting code obfuscation...");
obfuscateDirectory(assetsDir);
console.log("Obfuscation complete.");
