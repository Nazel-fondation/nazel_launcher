const { doc, setDoc, getDoc } = require("firebase/firestore"); 
const { db } = require('../assets/config/firebase.js');

let userData

async function getUserData(){
    const Store = await import('electron-store');
    const store = new Store.default();
    if (!userData){
        const user_uid = store.get("user_uid");
        const docRef = doc(db, "users", user_uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            userData = docSnap.data();
            return docSnap.data();
        } else {
            console.error("No such document!");
            return null;
        }
    }else{
        return userData
    }
}

async function updateUserData(valuePseudo, valueSkin){
    const Store = await import('electron-store');
    const store = new Store.default();
    user_uid = store.get("user_uid");
    const userRef = doc(db, "users", user_uid);
    valuePseudo = valuePseudo.replace(/[^a-zA-Z0-9_&-]/g, '');
    userData.pseudo = valuePseudo;
    userData.skin = valueSkin;
    setDoc(userRef, { pseudo: valuePseudo, skin: valueSkin});
}

module.exports = {getUserData, updateUserData}