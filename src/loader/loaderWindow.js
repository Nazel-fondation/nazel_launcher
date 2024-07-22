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
        //  preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            devTools: !isDev
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