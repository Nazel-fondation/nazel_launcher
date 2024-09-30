const log = require('electron-log')
const fs = require('fs-extra');
const path = require('path');

function getDefaultWorkingDirectory(){
    const os = process.platform
    switch (os) {
        case "win32": //WINDOWS
            return process.env.APPDATA + "\\.nazel"

        case "linux": //LINUX
            return process.env.HOME + "/.nazel"
        
        case "darwin": //MAC
            return process.env.HOME + "\\.nazel"
    
        default:
            console.error("ERROR : Impossible to find operating system")
            return process.env.HOME + "/.nazel"
    }
}

async function getWorkingDirectory(){
    const Store = await import('electron-store');
    const store = new Store.default();
    if (store.has("workingDirectory")){
        return store.get("workingDirectory");
    }else{
        return getDefaultWorkingDirectory();
    }
}

async function moveWorkingDirectory(target) {
    const source = await getWorkingDirectory();
    let files = [];
    try {
        await fs.ensureDir(target);

        const items = await fs.readdir(source);

        for (const item of items) {
            const sourcePath = path.join(source, item);
            const targetPath = path.join(target, item);

            await fs.move(sourcePath, targetPath, { overwrite: true });
        }
    } catch (err) {
        console.error(err);
    }
}

async function rmDir(path) {
    const exists = await fs.pathExists(path);
    if (!exists) {
        log.info(`Le dossier à supprimer n'existe pas : ${path}`);
        return;
    }

    await fs.remove(path);
}

// Fonction to remove files can create confict with other files like mods folder if I update a mod
async function cleanWorkingDirectoryForServerUpdate(serverId){
    const directory = await getWorkingDirectory() + "/" + serverId + "/defaullt/"
    rmDir(directory + "forge");
    rmDir(directory + "logs"); //Not obligatory but I prefere if there is a problem the user send a log smaller with the problem
    rmDir(directory + "mods");
}


module.exports = {getWorkingDirectory, moveWorkingDirectory, cleanWorkingDirectoryForServerUpdate};
