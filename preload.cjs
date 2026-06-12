const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveState: (data) => ipcRenderer.send("save-state", data),
  loadState: () => ipcRenderer.invoke("load-state"),
  checkAdmin: () => ipcRenderer.invoke("check-admin"),
  saveCSV: (filename, content) => ipcRenderer.invoke("save-csv", { filename, content }),
});
