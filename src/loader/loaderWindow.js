const { BrowserWindow } = require('electron');

let loaderWindow;

async function createLoaderWindow() {
    const isDev = await import('electron-is-dev');

    loaderWindow = new BrowserWindow({
        width: 450,
        height: 400,
        autoHideMenuBar: true,
        frame: false,
        transparent: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: isDev.default
        }
    });
    loaderWindow.on('closed', () => {
        loaderWindow = null;
    });
    loaderWindow.loadFile('src/loader/loader.html');
}

function closeLoaderWindow(){
    if (loaderWindow){
        loaderWindow.close();
    }
}

module.exports = {
    createLoaderWindow,
    closeLoaderWindow
}