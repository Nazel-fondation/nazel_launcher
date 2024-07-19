const { BrowserWindow } = require('electron');
const { default: isDev } = require('electron-is-dev');
const path = require('path');

let homeWindow;

async function createHomeWindow () {
    homeWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 1300,
        height: 1000,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
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