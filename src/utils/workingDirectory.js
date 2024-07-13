const fs = require('fs-extra');
const path = require('path');

function getDefaultWorkingDirectory(){
    const os = process.platform
    switch (os) {
        case "win32": //WINDOWS
            return process.env.APPDATA + "/.nazel"

        case "linux": //LINUX
            return process.env.HOME + "/.nazel"
        
        case "darwin": //MAC
            return process.env.HOME + "/.nazel"
    
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
        // Assure-toi que le dossier cible existe, sinon le crée
        await fs.ensureDir(target);

        // Lit le contenu du dossier source
        const items = await fs.readdir(source);

        // Déplace chaque élément du dossier source vers le dossier cible
        for (const item of items) {
            const sourcePath = path.join(source, item);
            const targetPath = path.join(target, item);

            await fs.move(sourcePath, targetPath, { overwrite: true });
        }
    } catch (err) {
        console.error(err);
    }
}


module.exports = {getWorkingDirectory, moveWorkingDirectory};