
const settingsScreen = `                
<div id="settingsScreen" class="absolute top-0 w-full h-full p-8 bg-background">
    <div class="relative px-24 py-8">
        <h1 class="text-white font-extrabold text-4xl mb-8">Paramètres</h1>
        <div class="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
            <div class="flex w-full shrink-[3] items-center justify-between">
                <div class="flex flex-col justify-center mr-20">
                    <p class="text-white text-base font-medium leading-normal line-clamp-1">Mémoire ram</p>
                    <p class="text-[#9dabb8] text-sm font-normal leading-normal line-clamp-2 w-80">
                        Gérer la quantité de mémoire à attribuer au jeu
                </div>                                   
                <div class="w-full">
                    <p id="allocatedMemory" class="text-white text-sm font-normal leading-normal @[480px]:hidden text-right">16 GB</p>
                    <input id="allocatedMemoryRange" type="range" min="1" class="w-full h-1 mb-1 bg-[#3c4753] rounded-lg appearance-none cursor-pointer range-sm accent-white">
                    <div class="flow-root mb-2">
                        <p class="text-white text-sm font-normal leading-normal float-left">1 GB</p>
                        <p id="totalMemoryAvailable" class="text-white text-sm font-normal leading-normal float-right">16 GB</p>
                    </div>
                </div>
            </div>
            </div>
        <div class="flex items-center gap-4 px-4 min-h-14 justify-between">
            <div class="flex flex-col justify-center">
                <p class="text-white text-base font-medium leading-normal line-clamp-1">Répertoire de travail</p>
                <p class="text-[#9dabb8] text-sm font-normal leading-normal line-clamp-2">
                    Permet de définir le chemin d'accès où les fichiers du launcher sont téléchargés
            </div>    
            <div id="workingDirectoryButton" class="flex rounded-md cursor-pointer bg-squareBackground w-96 px-4">
                <span id="workingDirectory" class="text-white/80 w-full h-8 flex items-center overflow-hidden whitespace-nowrap text-ellipsis">C:\\Users\\thiba\\AppData\\Roaming</span>
                <button class="ml-2 flex items-center justify-center rounded-xl h-8 bg-squareBackground text-white text-sm font-medium leading-normal w-fit">Browse</button>
            </div>
        </div>
        <div class="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between">
            <div class="flex flex-col justify-center">
                <p class="text-white text-base font-medium leading-normal line-clamp-1">Fermer le launcher au lancement du jeu</p>
                <p class="text-[#9dabb8] text-sm font-normal leading-normal line-clamp-2">
                S'il est activé, le lanceur se fermera lorsque vous lancerez un jeu. Ceci est utile pour économiser les ressources système.</p>
            </div>
            <div class="shrink-0">
                <label
                class="relative flex h-6 w-12 cursor-pointer items-center rounded-full border-none bg-[#293038] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-green-600"
                >
                <div class="h-5 w-5 rounded-full bg-white" style="box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px;"></div>
                <input id="closeAfterStarted" type="checkbox" class="invisible absolute" />
                </label>
            </div>
            </div>
        <div class="flex items-center gap-4 px-4 min-h-14 justify-between">
            <div class="flex flex-col justify-center">
                <p class="text-white text-base font-medium leading-normal line-clamp-1">Réparer le launcher</p>
                <p class="text-[#9dabb8] text-sm font-normal leading-normal line-clamp-2">
                    Cela réinitialise le launcher complet, à utiliser qu'en cas de problème
            </div>                            
            <div class="shrink-0">
                <button id="resetLauncherButton" class="flex cursor-pointer items-center justify-center rounded-xl h-8 px-4 bg-squareBackground hover:bg-red-500 text-red-500 hover:text-white text-sm font-medium leading-normal w-fit">Réparer</button>
            </div>
        </div>
    </div>
</div>
                `

let isOpen = false;

document.getElementById('settingsButton').addEventListener('click', () => {
    if (!isOpen){
        isOpen = true;
        document.getElementById('play').style.transform = ''; //Patch play button bug who stay visible when settingsButton due to gsap
        document.getElementById('loadingContener').style.transform = ''; //Patch loadingContener bug who stay visible when settingsButton due to gsap
        document.getElementById('overContent').innerHTML = settingsScreen;
        enableSettingsListener();
        getSettingsValues();
        gsap.fromTo("#settingsScreen", { opacity: 0 }, { duration: 0.5, opacity: 1 });
    }else{
        isOpen = false
        gsap.fromTo("#settingsScreen", { opacity: 1 }, { duration: 0.5, opacity: 0 });
        setTimeout(() => {document.getElementById("settingsScreen").remove()}, 500)}
});


//Know if clicked element can close the setting screen
let buttons = document.getElementsByTagName('button');
for (let button of buttons) {
    button.addEventListener("click", (function(currentButton) {
        return function() {
            if (currentButton.id !== "settingsButton") {
                if (isOpen){
                    isOpen = false
                    document.getElementById("settingsScreen").remove();
                }
            }
        };
    })(button));
}

//Know if clicked element can close the setting screen
const container = document.getElementById('server-list');
container.addEventListener("click", (event) => {
    if (event.target && (event.target.nodeName === "LI" || event.target.nodeName === "IMG")) {
        if (isOpen){
            isOpen = false
            document.getElementById("settingsScreen").remove();
        }
    }
});

function getSettingsValues(){
    ipcRenderer.invoke('getcloseAfterStartedValue').then((result) => {
        document.getElementById("closeAfterStarted").checked = result;
    })

    ipcRenderer.invoke('getWorkingDirectory').then((result) => {
        document.getElementById("workingDirectory").textContent = result;
    })

    ipcRenderer.invoke('getAllocatedMemory').then((result) => {
        document.getElementById("allocatedMemory").textContent = result + "Go"
        document.getElementById("allocatedMemoryRange").value = result;
    })

    ipcRenderer.invoke("getTotalMemoryAvailable").then((result) => {
        document.getElementById("totalMemoryAvailable").textContent = result + "Go"
        document.getElementById("allocatedMemoryRange").max = result;
    })
}

function enableSettingsListener(){
    document.getElementById("allocatedMemoryRange").addEventListener("input", () => {
        const rangeValue = document.getElementById("allocatedMemoryRange").value;
        document.getElementById("allocatedMemory").textContent = rangeValue + "Go";
        ipcRenderer.send("updateAllocatedMemoryValue", rangeValue);
    });
    

    document.getElementById("closeAfterStarted").addEventListener("click", async () => {
        var isChecked = document.getElementById("closeAfterStarted").checked;
        ipcRenderer.send("updateSettigns", "closeAfterStarted", isChecked);
    });

    document.getElementById("workingDirectoryButton").addEventListener("click", async () => {
        ipcRenderer.invoke('updateWorkingDirectory').then((result) => {
            if (result !== "none"){
                document.getElementById("workingDirectory").textContent = result;
            }
        });
    });

    document.getElementById("resetLauncherButton").addEventListener("click", async () => {
        const resetLauncherButton = document.getElementById("resetLauncherButton");
        if (resetLauncherButton.textContent === "Réparer"){
            gsap.fromTo("#resetLauncherButton", {scale: 1.2}, {scale: 1.0, duration: 0.5})
            resetLauncherButton.textContent = "Êtes vous sûr ?"
        }else if(resetLauncherButton.textContent === "Êtes vous sûr ?"){
            gsap.fromTo("#resetLauncherButton", {scale: 1.2}, {scale: 1.0, duration: 0.5})
            resetLauncherButton.textContent = "Tout fichier sera supprimé"
        }else{
            ipcRenderer.send("updateSettigns", "resetLauncher");
        }
    });
}