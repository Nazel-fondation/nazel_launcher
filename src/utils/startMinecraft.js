const log = require('electron-log');
const { Client, Authenticator } = require('minecraft-launcher-core');

async function startMinecraft(event, userData, serverData, _workingDirectory, memory){
    const userData_ = await userData.getUserData();
    const launcher = new Client();
    let opts = {
        overrides: {
            detached: false,
        },
        authorization: Authenticator.getAuth(userData_.pseudo),
        root: _workingDirectory + "/" + serverData.id + "/defaullt",
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
        opts.forge = _workingDirectory + "/" + serverData.id + "/defaullt/forge/forge.jar";
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
}

module.exports = {startMinecraft}