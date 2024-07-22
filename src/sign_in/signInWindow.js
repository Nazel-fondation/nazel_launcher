const { BrowserWindow } = require('electron');

let signInWindow;

async function createSignInWindow() {
    const isDev = await import('electron-is-dev');

    signInWindow = new BrowserWindow({
        width: 450,
        height: 750,
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