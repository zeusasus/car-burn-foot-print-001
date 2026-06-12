const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const statePath = path.join(__dirname, "user_state.json");

function isAdmin() {
  if (process.platform !== "win32") return false;
  try {
    execSync("net session", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "karburn Console",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // Load the production build index.html from Vite dist folder
  win.loadFile(path.join(__dirname, "dist", "index.html"));

  // Hide the default browser menu bar for a premium desktop app look
  win.setMenuBarVisibility(false);
}

// IPC handlers
ipcMain.on("save-state", (event, data) => {
  try {
    fs.writeFileSync(statePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save state to file:", err);
  }
});

ipcMain.handle("load-state", () => {
  try {
    if (fs.existsSync(statePath)) {
      const content = fs.readFileSync(statePath, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to load state from file:", err);
  }
  return null;
});

ipcMain.handle("check-admin", () => {
  return isAdmin();
});

ipcMain.handle("save-csv", async (event, { filename, content }) => {
  try {
    const { dialog, shell } = require("electron");
    const win = BrowserWindow.getFocusedWindow();
    const { filePath } = await dialog.showSaveDialog(win, {
      title: "Export Carbon History",
      defaultPath: path.join(app.getPath("downloads"), filename),
      filters: [{ name: "CSV Files", extensions: ["csv"] }]
    });
    if (filePath) {
      fs.writeFileSync(filePath, content, "utf8");
      shell.openPath(filePath); // Auto-open the file in Excel/system default
      return true;
    }
  } catch (err) {
    console.error("Failed to save or open CSV file:", err);
  }
  return false;
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

