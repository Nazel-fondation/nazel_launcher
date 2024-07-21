const { ipcRenderer } = require('electron');

const loadingBar = document.getElementById("loadingBar");
const loadingAction = document.getElementById("loadingAction")
const loadingPercentage = document.getElementById("loadingPercentage")

loadingAction.textContent = "Vérification de la configuration"
ipcRenderer.invoke("systemRequirement").then((result) => {
  if (result === "ok"){
    loadingAction.textContent = "Configuration vérifié"
    loadingAction.textContent = "Recherche de mise à jour"
    ipcRenderer.send("updateVerification");
    
    ipcRenderer.on("updateAvailable", () => {
      loadingAction.textContent = "Mise à jour disponible"
    })
    
    ipcRenderer.on("updateNotAvailable", () => {
      loadingAction.textContent = "Pas de mise à jour"
      ipcRenderer.send("loadLauncher");
    })
    
    ipcRenderer.on("updatePercentageValue", (event, percentage) => {
      loadingAction.textContent = "Mise à jour"
      const _percentage = percentage + "%"
      loadingBar.style.width = _percentage;
      loadingPercentage.classList.remove("invisible");
      loadingPercentage.textContent = _percentage
    })
    
    ipcRenderer.on("updateDone", () => {
      loadingAction.textContent = "Mise à jour terminé !"
      ipcRenderer.send("loadLauncher");
    })
    
    ipcRenderer.on("skipUpdate", () => {
      loadingAction.textContent = "Mode développement détecté mise à jour évité"
      ipcRenderer.send("loadLauncher")
    })
  }else{
    loadingAction.textContent = "Problème de configuration logiciel"
  }
})
