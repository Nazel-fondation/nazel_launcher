const { BrowserWindow } = require('electron');

let signInWindow;

function createSignInWindow() {
    const { isDev } = import("electron-is-dev")
    signInWindow = new BrowserWindow({
        width: 450,
        height: 750,
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
    signInWindow.on('closed', () => {
        signInWindow = null;
    });
    signInWindow.loadFile('src/sign_in/sign_in.html');
}

function closeSignInWindow(){
    if (signInWindow){
        signInWindow.close();
    }
}

module.exports = {
    createSignInWindow,
    closeSignInWindow
}