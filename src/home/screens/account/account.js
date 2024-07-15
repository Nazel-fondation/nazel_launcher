
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
            <div class="shrink-0">
                <input id="pseudoInput" type="text" class="shadow border-rose-500 appearance-none py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline rounded-md bg-squareBackground w-56 h-7"></input>
            </div>
        </div>
        <div class="flex items-center gap-4 px-4 min-h-14 justify-between py-2">
            <div class="flex flex-col justify-center">
                <p class="text-white text-base font-medium leading-normal line-clamp-1">Skin</p>
                <p class="text-[#9dabb8] text-sm font-normal leading-normal line-clamp-2">
                Entrer l'url uniquement en png du skin que vous souhaiter avoir (il est possible que le skin ne soit pas visible sur tous les serveurs)
            </div>                            
            <div class="shrink-0">
                <input id="skinInput" type="text" class="shadow border-rose-500 appearance-none py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline rounded-md bg-squareBackground w-56 h-7"></input>
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
        document.getElementById("skinInput").value = result.skin;
    })
}

function enableAccountListeners(){
    const pseudoInput = document.getElementById("pseudoInput")
    const skinInput = document.getElementById("skinInput")
    const logOutButton = document.getElementById("logOutButton")

    skinInput.addEventListener("blur", () => {
        pseudoInput.value = pseudoInput.value.replace(/[^a-zA-Z0-9_&-]/g, '');
        if (userData.skin !== skinInput.value){
            ipcRenderer.send("updateAccount", pseudoInput.value, skinInput.value)
        }
    })

    pseudoInput.addEventListener("blur", () => {
        pseudoInput.value = pseudoInput.value.replace(/[^a-zA-Z0-9_&-]/g, '');
        if (userData.pseudo  !== pseudoInput.value){
            ipcRenderer.send("updateAccount", pseudoInput.value, skinInput.value)
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
      pseudoInput.value = input.value.replace(/[^a-zA-Z0-9_&-]/g, '');
    });

    logOutButton.addEventListener("click", () => {
        ipcRenderer.send("logOut");
    })
}