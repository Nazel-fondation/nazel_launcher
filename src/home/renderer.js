const axios = require('axios');
const { getDocs, collection, getDoc } = require('firebase/firestore');
const { db } = require('../assets/config/firebase.js');
const { shell, ipcRenderer } = require('electron');

var selectedServer = null;
var serverData = null;

async function updateServerData() {
    try {
        const response = await axios.get('https://api.mcstatus.io/v2/status/java/play.hypixel.net');
        const data = response.data;
        document.getElementById("players-number").textContent = data.players.online +  " joueurs en ligne";
        if(data.online){
            document.getElementById("server-status").classList.add("bg-green-700");
            document.getElementById("server-status").classList.remove("bg-red-700");
        }else{
            document.getElementById("server-status").classList.add("bg-red-700");
            document.getElementById("server-status").classList.remove("bg-green-700");
        }
    } catch (error) {
        console.log(error);
        document.getElementById("players-number").textContent = "0 joueur en ligne";
        document.getElementById("server-status").classList.add("bg-red-500");
        document.getElementById("server-status").classList.remove("bg-green-500");
    }  
}

async function getServerList(){
    const querySnapshot = await getDocs(collection(db, "servers"));
    const docList = document.getElementById('server-list');
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id
        const li = document.createElement('li');
        li.id = doc.id
        if (selectedServer === null) { 
            selectedServer = doc.id 
            serverData = data;
            li.classList.add("h-14", "w-14", "rounded-md", "my-8", "bg-selectedSquareBackground", "p-2", "border-4", "border-squareBackground", "cursor-pointer");
            document.getElementById("serverName").textContent = data.name;
            document.getElementById("serverBanner").style = "background-image: url('" + data.banner + "')"
            document.getElementById("serverVersion").textContent = "Version du serveur : " + data.clientVersion;
        }else{
            li.classList.add("h-14", "w-14", "rounded-md", "my-8", "bg-squareBackground", "p-2", "cursor-pointer");
        }
        li.addEventListener('click', () => {
            if (selectedServer !== li.id){
                gsap.fromTo("#serverBanner", { opacity: 0 }, { duration: 1, opacity: 1 });
                document.getElementById(selectedServer).classList.remove("h-14", "w-14", "rounded-md", "my-8", "bg-selectedSquareBackground", "p-2", "border-4", "border-squareBackground", "cursor-pointer")
                document.getElementById(selectedServer).classList.add("h-14", "w-14", "rounded-md", "my-8", "bg-squareBackground", "p-2", "cursor-pointer");
                serverData = data;
                selectedServer = li.id;
                li.classList.remove("h-14", "w-14", "rounded-md", "my-8", "bg-squareBackground", "p-2", "cursor-pointer");
                li.classList.add("h-14", "w-14", "rounded-md", "my-8", "bg-selectedSquareBackground", "p-2", "border-4", "border-squareBackground", "cursor-pointer");
                document.getElementById("serverName").textContent = data.name;
                document.getElementById("serverBanner").style = "background-image: url('" + data.banner + "')"
                document.getElementById("serverVersion").textContent = "Version du client : " + data.clientVersion;
            }
        });
        li.addEventListener('mouseenter', () => {gsap.to(img, { scale: 1.2, duration: 0.3, className: '+=enlarged' })});
        li.addEventListener('mouseleave', () => {gsap.to(img, { scale: 1, duration: 0.3, className: '-=enlarged' })});
        li.addEventListener('mousedown', () => {gsap.to(img, { scale: 1, duration: 0.3, className: '-=enlarged' })});
        const img = document.createElement('img');
        img.src = data.logo;
        img.alt = data.name;
        img.classList.add("h-full", "w-full", "rounded-md");
        li.appendChild(img);
        docList.appendChild(li);
    });
}

document.getElementById('discordLink').addEventListener('click', () => {
    shell.openExternal(serverData.discord);
})

document.getElementById('play').addEventListener('click', async () => {
    ipcRenderer.send("launchMinecraft", serverData);
    document.getElementById('play').classList.add("hidden", "max-h-0")
    document.getElementById('loadingContener').classList.remove("hidden", "max-h-0")
    gsap.timeline()
        .to('#loadingContener', { scale: 1.2, duration: 0.3 })
        .to('#loadingContener', { scale: 1, duration: 0.3 });
    ipcRenderer.on('launcherProgress', (event, progressData) => {
        document.getElementById("loadingTitle").textContent = "Téléchargement de " + progressData.type;
        const percentageValue = (progressData.task * 100 / progressData.total).toFixed(2) + "%"
        document.getElementById("loadingLabel").textContent = percentageValue;
        document.getElementById("loadingBar").style.width = percentageValue;
    });
})

ipcRenderer.on('minecraftData', (event, minecraftData) => {
    const playButton = document.getElementById('play')
    playButton.classList.remove("hidden", "max-h-0", "bg-white")
    playButton.classList.add("bg-gameLaunched", "cursor-default")
    playButton.textContent = "Jeu en cours"
    playButton.id = "disabledPlay"
    document.getElementById('loadingContener').classList.add("hidden", "max-h-0")
})

ipcRenderer.on('minecraftClose', (event, reasonNumber) => {
    const playButton = document.getElementById('disabledPlay')
    playButton.classList.remove("bg-gameLaunched", "cursor-default")
    playButton.classList.add("bg-white", "cursor-pointer")
    playButton.textContent = "Jouer"
    playButton.id = "play"
})

ipcRenderer.invoke('getPlayerHead').then((result) => {
    document.getElementById("playerHeadImage").src = `data:image/png;base64,${result}`; 
})



getServerList();
updateServerData();
setInterval(updateServerData, 5 * 60 * 1000)