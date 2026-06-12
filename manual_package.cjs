const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Starting manual Electron packaging...");

const projectDir = __dirname;
const zipPath = path.join(
  'C:\\Users\\danesh\\AppData\\Local\\electron\\Cache\\6c702b0616b47d67d240ac49d5af99c5f632d2a5a5980f9b655ec34dce08fa94\\electron-v42.4.0-win32-x64.zip'
);
const outDir = path.join(projectDir, 'dist-builds', 'karburn-win32-x64');
const appDir = path.join(outDir, 'resources', 'app');

try {
  // 1. Clean up old dirs
  console.log("Cleaning up old directories...");
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  // 2. Extract using PowerShell native Expand-Archive (very fast and bypasses Node v24 zip bugs)
  console.log("Extracting Electron prebuilt binaries via PowerShell...");
  const psCmd = `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${outDir}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });
  console.log("Extraction complete!");

  // 3. Rename electron.exe to karburn.exe
  console.log("Renaming executable...");
  const oldExe = path.join(outDir, 'electron.exe');
  const newExe = path.join(outDir, 'karburn.exe');
  if (fs.existsSync(oldExe)) {
    fs.renameSync(oldExe, newExe);
  }

  // 4. Create resources/app folder
  fs.mkdirSync(appDir, { recursive: true });

  // 5. Copy app source files into resources/app
  console.log("Copying production assets...");
  
  // Helper to copy directory
  function copyDirSync(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // Copy dist
  copyDirSync(path.join(projectDir, 'dist'), path.join(appDir, 'dist'));

  // Copy main files
  fs.copyFileSync(path.join(projectDir, 'main.cjs'), path.join(appDir, 'main.cjs'));
  fs.copyFileSync(path.join(projectDir, 'preload.cjs'), path.join(appDir, 'preload.cjs'));
  
  // Write a clean production package.json without devDependencies
  const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'));
  const cleanPkg = {
    name: pkg.name,
    version: pkg.version,
    main: "main.cjs",
    type: "module"
  };
  fs.writeFileSync(path.join(appDir, 'package.json'), JSON.stringify(cleanPkg, null, 2), 'utf8');

  // Clean up build temp dirs
  const tmpBuildDir = path.join(projectDir, 'tmp-build-dir');
  if (fs.existsSync(tmpBuildDir)) {
    fs.rmSync(tmpBuildDir, { recursive: true, force: true });
  }

  console.log("=====================================================");
  console.log("SUCCESS: Packaging complete!");
  console.log("App path: " + outDir);
  console.log("Executable path: " + newExe);
  console.log("=====================================================");

} catch (err) {
  console.error("PACKAGING FAILED:", err);
}
