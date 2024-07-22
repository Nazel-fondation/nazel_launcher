const { BrowserWindow } = require('electron');

let loginWindow;

async function createLoginWindow() {
    const isDev = await import('electron-is-dev');

    loginWindow = new BrowserWindow({
        width: 450,
        height: 520,
        autoHideMenuBar: true,
        frame: false,
        transparent: true,
        resizable: false,
        webPreferences: {
        //  preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            devTools: !isDev.default
        }
    });
    loginWindow.on('closed', () => {
        loginWindow = null;
    });
    loginWindow.loadFile('src/login/login.html');
}

function closeLoginWindow(){
    if (loginWindow){
        loginWindow.close();
    }
}

module.exports = {
    createLoginWindow,
    closeLoginWindow
}