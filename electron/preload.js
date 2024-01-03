import { contextBridge, ipcRenderer } from 'electron'

// --------- Expose some API to the Renderer process ---------

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath) => ipcRenderer.invoke('readFile', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('writeFile', filePath, content),
  exit: () => ipcRenderer.invoke('exit'),
  join: (...args) => ipcRenderer.invoke('join', ...args),
})
