let isOpen = null;

//Know if clicked element can close the setting screen
let buttons = document.getElementsByTagName('button');
for (let button of buttons) {
    button.addEventListener("click", (function(currentButton) {
        return function() {
            const buttonId = currentButton.id
            switch (buttonId) {
                case "settingsButton":
                    if (isOpen !== "settingsScreen"){
                        closeScreenIfOpen("accountScreen", true)
                        openScreen("settingsScreen");
                    }else{
                        closeScreenIfOpen("settingsScreen", true)
                    }
                    break;
            
                case "accountButton":
                    if (isOpen !== "accountScreen"){
                        closeScreenIfOpen("settingsScreen", true)
                        openScreen("accountScreen");
                    }else{
                        closeScreenIfOpen("accountScreen", true)
                    } 
                    break;

                default:
                    closeScreenIfOpen("settingsScreen", false)
                    closeScreenIfOpen("accountScreen", false)
                    break;
            }
        };
    })(button));
}

//Know if clicked element can close the setting screen
const container = document.getElementById('server-list');
container.addEventListener("click", (event) => {
    if (event.target && (event.target.nodeName === "LI" || event.target.nodeName === "IMG")) {
        if (isOpen !== null){
            closeScreenIfOpen("settingsScreen", false);
            closeScreenIfOpen("accountScreen", false);
        }
    }
});

function closeScreenIfOpen(screenName, animation){
    if (isOpen === screenName){
        isOpen = null
        if (animation){
            gsap.fromTo("#" + screenName, { opacity: 1 }, { duration: 0.5, opacity: 0 });
            setTimeout(() => {document.getElementById(screenName).remove()}, 500);
        }else{
            document.getElementById(screenName).remove()
        }
    }
}

function openScreen(screenName){
    isOpen = screenName;
    document.getElementById('play').style.transform = ''; //Patch play button bug who stay visible when settingsButton due to gsap
    document.getElementById('loadingContener').style.transform = ''; //Patch loadingContener bug who stay visible when settingsButton due to gsap
    switch (screenName) {
        case "settingsScreen":
            document.getElementById('overContent').innerHTML = settingsScreen;
            enableSettingsListener();
            getSettingsValues();
            break;
    
        case "accountScreen":
            document.getElementById('overContent').innerHTML = accountScreen;
            enableAccountListeners();
            getAccountValues();
            break;
    }

    gsap.fromTo("#" + screenName, { opacity: 0 }, { duration: 0.5, opacity: 1 });
}