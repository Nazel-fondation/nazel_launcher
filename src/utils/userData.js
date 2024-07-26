const { doc, setDoc, getDoc, query, where, getDocs, collection } = require("firebase/firestore"); 
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

async function updateUserData(valuePseudo){
    const Store = await import('electron-store');
    const store = new Store.default();
    
    valuePseudo = valuePseudo.replace(/[^a-zA-Z0-9_&-]/g, '');
    if (valuePseudo.length <= 4 || valuePseudo.length >= 20)
        return "auth/pseudoSize"

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("pseudo", "==", valuePseudo));
    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty && getUserData !== valuePseudo)
        return "auth/pseudoUsed"

    user_uid = store.get("user_uid");
    const userRef = doc(db, "users", user_uid);
    userData.pseudo = valuePseudo;
    setDoc(userRef, { pseudo: valuePseudo });
    return "ok"
}

module.exports = {getUserData, updateUserData}