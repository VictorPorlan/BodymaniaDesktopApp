import {app, BrowserWindow} from 'electron';
import path from 'path';
import { isDev } from './util.js';

type test = string

app.on("ready", () => {
    const mainWindow = new BrowserWindow({minWidth: 1400, minHeight: 900});
    if(isDev()){
        mainWindow.loadURL('http://localhost:5123')
    }
    else{
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist/index.html'));
    }
})