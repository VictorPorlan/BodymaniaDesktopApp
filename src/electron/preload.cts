const electron = require('electron');
electron.contextBridge.exposeInMainWorld("electron", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron  
})