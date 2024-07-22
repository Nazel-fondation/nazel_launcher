const { BrowserWindow } = require('electron');
const path = require('path');

let homeWindow;

async function createHomeWindow () {
    const isDev = await import('electron-is-dev');
    homeWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 1300,
        height: 1000,
        webPreferences: {
            devTools: isDev.default,
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    homeWindow.on('closed', () => {
        homeWindow = null;
    });
    homeWindow.loadFile('src/home/home.html');
}

function closeHomeWindow(){
    if (homeWindow){
        homeWindow.close();
    }
}

module.exports = {
    createHomeWindow,
    closeHomeWindow
}