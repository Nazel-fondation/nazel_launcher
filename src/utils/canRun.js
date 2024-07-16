const util = require('util');
const exec = util.promisify(require('child_process').exec);
const notifier = require('node-notifier');
const path = require('path');

async function canRun(){ //canRun verify if java 17 is installed
    
    try {
        const { error, stdout, stderr } = await exec('java -version');

        const versionOutput = stderr.split('\n')[0];
        const versionMatch = versionOutput.match(/(?:java|openjdk) version "(?:(\d+)\.(\d+)(?:\.(\d+))?(?:_(\d+))?)/);
        if (!versionMatch){
            showErrorNotification("Nazel launcher a besoin de java 17 au minimum. \nMerci de mettre à jour java")
            return false;
        }
        
        const major = parseInt(versionMatch[1], 10);
        if (major >= 17){
            return true;
        }else{
            showErrorNotification("Nazel launcher a besoin de java 17 au minimum. \nMerci de mettre à jour java")
            console.error("Merci de mettre à jour java");
            return false;
        }
    } catch (error) {
        showErrorNotification("Nazel launcher a besoin de java pour fonctionner. \nMerci d'installer java")
        return false
    }
}

function showErrorNotification(errorMessage) {
    notifier.notify({
        title: 'Erreur java',
        message: errorMessage,
        sound: true, // Activer le son
        wait: true // Attendre que l'utilisateur ferme la notification
    }, function (err, response, metadata) {
        if (err) console.error(err);
    });
}

module.exports = {canRun}