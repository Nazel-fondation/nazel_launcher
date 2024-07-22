
const accountScreen = `                
<div id="accountScreen" class="absolute top-0 w-full h-full p-8 bg-background">
    <div class="relative px-24 py-8">
        <h1 class="text-white font-extrabold text-4xl mb-8">Mon compte</h1>
        <div class="flex items-center gap-4 px-4 min-h-14 justify-between py-2">
            <div class="flex flex-col justify-center">
                <p class="text-white text-base font-medium leading-normal line-clamp-1">Pseudo</p>
                <p class="text-[#9dabb8] text-sm font-normal leading-normal line-clamp-2">
                    Cela permet de changer de pseudo
            </div>                            
            <div id="pseudoContainer">
                <div class="invisible h-6"></div>    
                <input id="pseudoInput" type="text" class="shadow border-rose-500 appearance-none py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline rounded-md bg-squareBackground w-56 h-7"></input>
                <p id="errorPseudo" class="text-red-500 text-sm mt-1 font-medium invisible"></p>    
            </div>
        </div>
        <div class="flex items-center gap-4 px-4 min-h-14 justify-between py-2">
            <div class="flex flex-col justify-center">
                <p class="text-white text-base font-medium leading-normal line-clamp-1">Skin</p>
                <p class="text-[#9dabb8] text-sm font-normal leading-normal line-clamp-2">
                Entrer l'url uniquement en png du skin que vous souhaiter avoir (il est possible que le skin ne soit pas visible sur tous les serveurs)
            </div>                            
            <div>
                <div class="invisible h-6"></div>    
                <input id="skinInput" type="text" class="shadow border-rose-500 appearance-none py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline rounded-md bg-squareBackground w-56 h-7"></input>
                <p id="errorSkin" class="text-red-500 text-sm mt-1 font-medium invisible"></p>    
            </div>
        </div>
        <div class="flex items-center gap-4 px-4 min-h-14 justify-between py-2">
            <div class="flex flex-col justify-center">
                <p class="text-white text-base font-medium leading-normal line-clamp-1">Se déconnecter</p>
                <p class="text-[#9dabb8] text-sm font-normal leading-normal line-clamp-2">
                    Cela permet de se déconnecter du launcher
            </div>                            
            <div class="shrink-0">
                <button id="logOutButton" class="flex cursor-pointer items-center justify-center rounded-xl h-8 px-4 bg-squareBackground hover:bg-red-500 text-red-500 hover:text-white text-sm font-medium leading-normal w-fit">Déconnexion</button>
            </div>
        </div>  
    </div>
</div>
                `

let userData = null;

function getAccountValues() {
    ipcRenderer.invoke('getUserData').then((result) => {
        userData = result;
        document.getElementById("pseudoInput").value = result.pseudo;
        if (result.skin !== "undefined")
            document.getElementById("skinInput").value = result.skin;
    })
}

function enableAccountListeners(){
    const pseudoInput = document.getElementById("pseudoInput")
    const skinInput = document.getElementById("skinInput")
    const logOutButton = document.getElementById("logOutButton")
    const errorPseudo = document.getElementById("errorPseudo")

    skinInput.addEventListener("blur", () => {
        pseudoInput.classList.remove("border", "border-red-500")
        if (userData.skin !== skinInput.value){
            ipcRenderer.invoke("updateAccount", pseudoInput.value, skinInput.value).then((result) => {
                console.log(result)
                if (result === "auth/pseudoUsed"){
                    pseudoInput.classList.add("border", "border-red-500")
                }else{
                    ipcRenderer.invoke('getPlayerHead').then((result) => {
                        document.getElementById("playerHeadImage").src = `data:image/png;base64,${result}`; 
                    })
                }
            })
        }
    })

    pseudoInput.addEventListener("blur", () => {
        pseudoInput.value = pseudoInput.value.replace(/[^a-zA-Z0-9_&-]/g, '');
        pseudoInput.classList.remove("border", "border-red-500")
        errorPseudo.classList.add("invisible")
        if (userData.pseudo  !== pseudoInput.value){
            ipcRenderer.invoke("updateAccount", pseudoInput.value, skinInput.value).then((result) => {
                switch (result) {
                    case "auth/pseudoUsed":
                        pseudoInput.classList.add("border", "border-red-500");
                        errorPseudo.textContent = "Pseudo déjà utilisé"
                        errorPseudo.classList.remove("invisible")
                        break;
                    
                    case "auth/pseudoSize":
                        pseudoInput.classList.add("border", "border-red-500");
                        errorPseudo.textContent = "Pseudo trop court ou trop long"
                        errorPseudo.classList.remove("invisible")
                        break;
                
                    default:
                        ipcRenderer.send("updateAccount", pseudoInput.value, skinInput.value);
                        ipcRenderer.invoke('getPlayerHead').then((result) => { //Try to change accountHead if skin url is good the head stay the same
                            document.getElementById("playerHeadImage").src = `data:image/png;base64,${result}`; 
                        })
                        break;
                }
            })
        }
    })

    pseudoInput.addEventListener('keydown', function(event) {
        const allowedCharacters = /^[a-zA-Z0-9_&-]*$/;
        const controlKeys = ['Backspace', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete'];
        if (controlKeys.includes(event.key)) {
            return;
        }
        if (!allowedCharacters.test(event.key)) {
            event.preventDefault();
        }
    });

    pseudoInput.addEventListener('input', function() {
      pseudoInput.value = pseudoInput.value.replace(/[^a-zA-Z0-9_&-]/g, '');
    });

    logOutButton.addEventListener("click", () => {
        ipcRenderer.send("logOut");
    })
}