const { createSignInWindow, closeSignInWindow } = require('./sign_in/signInWindow');
const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron');
const path = require('path');
const { Client, Authenticator } = require('minecraft-launcher-core');
const { createLoaderWindow, closeLoaderWindow } = require('./loader/loaderWindow');
const { createLoginWindow, closeLoginWindow } = require('./login/loginWindow');
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { doc, setDoc, collection, query, where, getDocs, getDoc } = require("firebase/firestore"); 
const { auth, db } = require('./assets/config/firebase.js');
const fs = require('fs');
const { createHomeWindow, closeHomeWindow } = require('./home/homeWindow.js');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const workingDirectory = require('./utils/workingDirectory.js')
const memory = require("./utils/memory.js")
const userData = require("./utils/userData.js")
const head = require("./utils/playerHead.js")
const canRun = require("./utils/canRun.js");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

app.on('ready', createLoaderWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createHomeWindow();
    }
});

ipcMain.handle("systemRequirement", async () => {
    if (!await canRun.canRun()){ 
        return "problem"
    }else{
        return "ok"
    }
})

ipcMain.on("updateVerification", async (event) => {
    const isDev = await import('electron-is-dev');
    if(isDev.default){
        event.sender.send("skipUpdate")
    }else{
        autoUpdater.checkForUpdatesAndNotify();
    }

    autoUpdater.on('update-available', () => {
        event.sender.send('updateAvailable');
    })
    autoUpdater.on('update-not-available', () => {
        log.info("mise à jour non disponible")
        event.sender.send('updateNotAvailable');
    })
    autoUpdater.on('error', (err) => {
        log.info('Error in auto-updater. ' + err);
    })
    autoUpdater.on('download-progress', (progressObj) => {
        const percentage = (progressObj.percent).toFixed(2)
        event.sender.send("updatePercentageValue", percentage)
    })
    autoUpdater.on('update-downloaded', () => {
        event.sender.send("updateDone");
        log.info('Update downloaded');

        setImmediate(() => {
            autoUpdater.quitAndInstall();
        });
    });
})

ipcMain.on("loadLauncher", async () => {
    const Store = await import('electron-store');
    const store = new Store.default();
    closeLoaderWindow();
    if(store.has("user_uid")){
        createHomeWindow();
    }else{
        createLoginWindow();
    }
})

ipcMain.on('close-window', (event, arg) => {
    if (arg === "loginWindow"){
        closeLoginWindow();
    }else if(arg === "signInWindow"){
        closeSignInWindow();
    }
})

ipcMain.on('sign-in', () => {
    createSignInWindow();
    closeLoginWindow();
})

ipcMain.on('login', () => {
    createLoginWindow();
    closeSignInWindow();
})

ipcMain.handle('loginRequest', async (event, email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const Store = await import('electron-store');
        const store = new Store.default();
        store.set("user_uid", user.uid);
        closeLoginWindow();
        createHomeWindow();
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Erreur : ${errorCode} : ${errorMessage}`);
        return errorCode;
    }
})

ipcMain.handle('registerRequest', async (event, pseudo, email, password) => {
    try {
        pseudo = pseudo.replace(/[^a-zA-Z0-9_&-]/g, '');
        if (pseudo.length <= 4 || pseudo.length >= 20)
            return "auth/pseudoSize"
        
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("pseudo", "==", pseudo));
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty){
            return "auth/pseudoUsed"
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const Store = await import('electron-store');
        const store = new Store.default();
        store.set("user_uid", user.uid);
        await setDoc(doc(db, "users", user.uid), {
            pseudo: pseudo
        });

        closeSignInWindow();
        createHomeWindow();
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Erreur : ${errorCode} : ${errorMessage}`);
        return errorCode;
    }
})

ipcMain.on('open-url', (event, url) => {
    shell.openExternal(url);
});

ipcMain.on('launchMinecraft', async (event, serverData) => {
    const Store = await import('electron-store');
    const extract = require('extract-zip')
    const store = new Store.default();

    if (!store.has("VERSION_" + serverData.id) || store.get("VERSION_" + serverData.id) !== serverData.clientVersion){
        workingDirectory.cleanWorkingDirectoryForServerUpdate(serverData.id)
        const { download } = await import('electron-dl');
        const win = BrowserWindow.getFocusedWindow();
        try {
            await download(win, serverData.serverContent, 
                {
                directory: await workingDirectory.getWorkingDirectory() + "/" + serverData.id + "/defaullt",
                onTotalProgress: (e) => {            
                        const convertedData = {
                            type: "serverContent",
                            task: e.transferredBytes,
                            total: e.totalBytes
                        }
                        event.sender.send('launcherProgress', convertedData);
                    }
            });
            await extract(await workingDirectory.getWorkingDirectory() + "/" + serverData.id + "/defaullt/serverContent.zip", { dir: await workingDirectory.getWorkingDirectory() + "/" + serverData.id + "/defaullt" })
            fs.unlink(await workingDirectory.getWorkingDirectory() + "/" + serverData.id + "/defaullt/serverContent.zip", (err) => {
                if (err) {
                  console.error('Failed to delete the file:', err);
                } else {
                  console.log('File deleted successfully');
                }
              });
            store.set("VERSION_" + serverData.id, serverData.clientVersion)
        } catch (error) {
            console.log(error)
        }
    }

    const userData_ = await userData.getUserData();
    const launcher = new Client();
    let opts = {
        overrides: {
            detached: false,
        },
        authorization: Authenticator.getAuth(userData_.pseudo),
        root: await workingDirectory.getWorkingDirectory() + "/" + serverData.id + "/defaullt",
        quickPlay: {
            type: "multiplayer",
            identifier: serverData.ip
        },
        version: {
            number: serverData.version,
            type: "release"
        },
        memory: {
            max: await memory.convertedAllocatedMemoryForMinecraft(), //We can't use getAllocatedMemory because we had to precise the unit of memory (Gigabyt, Byte, Bite, ...)
            min: "1G"
        }
    }
    if (serverData.type === "forge") {
        opts.forge = await workingDirectory.getWorkingDirectory() + "/" + serverData.id + "/defaullt/forge/forge.jar";
    }

    launcher.launch(opts);
    launcher.on('progress', (e) => {
        event.sender.send('launcherProgress', e);
    });

    launcher.on('data', async (e) => {
        log.info(e)
        //Know if minecraft is launched or not
        const Store = await import('electron-store');
        const store = new Store.default();
        if (store.has("closeAfterStarted") && store.get("closeAfterStarted") === true){
            app.quit()
        }else{
            event.sender.send('minecraftData', e)
        }
    });

    launcher.on('debug', (e) => {log.info(e)})
    launcher.on('close', (e) => {
        event.sender.send('minecraftClose', e)
    });
});

ipcMain.on("updateSettigns", async (event, settingName, settingValue) => {
    const Store = await import('electron-store');
    const store = new Store.default();
    switch (settingName) {
        case "closeAfterStarted":
            store.set(settingName, settingValue);
            break;
        
        case "resetLauncher":
            fs.rmSync(await workingDirectory.getWorkingDirectory(), { recursive: true, force: true });
            store.clear();
            app.quit();
            break;
    
        default:
            break;
    }
})

ipcMain.on("updateAllocatedMemoryValue", (event, memoryValue) => {
    memory.updateAllocatedMemory(memoryValue);
})

ipcMain.handle("getcloseAfterStartedValue", async () => {
    const Store = await import('electron-store');
    const store = new Store.default();
    if (store.has("closeAfterStarted")){
        return store.get("closeAfterStarted");
    }else{
        return false;
    }
})

ipcMain.handle("getWorkingDirectory", async () => {
    return await workingDirectory.getWorkingDirectory();
})

ipcMain.handle("getTotalMemoryAvailable", () => {
    const os = require("os")
    return (os.totalmem() / Math.pow(1024, 3)).toFixed(0) 
})

ipcMain.handle("getAllocatedMemory", async () => {
    return await memory.getAllocatedMemory();
})

ipcMain.handle("updateWorkingDirectory", async () => {
    const Store = await import('electron-store');
    const store = new Store.default();
    const response = await dialog.showOpenDialog({
        properties: ['openDirectory']
      });
      if (!response.canceled) {
        workingDirectory.moveWorkingDirectory(response.filePaths[0]).then(() => {
            store.set("workingDirectory", response.filePaths[0])
        })
        return response.filePaths[0];
      } else {
        return "none";
      }
})

ipcMain.handle("getUserData", async () => {
    return await userData.getUserData();
})

ipcMain.on("logOut", async () => {
    const Store = await import('electron-store');
    const store = new Store.default();
    store.clear("user_uid");
    createLoginWindow();
    closeHomeWindow();
})

ipcMain.handle("updateAccount", async (event, valuePseudo, valueSkin) => {
    return userData.updateUserData(valuePseudo, valueSkin);
})

ipcMain.handle("getPlayerHead", async () => {
    const data = await userData.getUserData();
    const result = await head.getPlayerHead(data.skin, data.pseudo);
    return result.toString("base64");
})
