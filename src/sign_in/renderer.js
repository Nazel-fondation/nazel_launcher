const { ipcRenderer } = require('electron');

document.getElementById('close-buton').addEventListener('click', () => {
  ipcRenderer.send('close-window', "signInWindow");
});

document.getElementById('open-login').addEventListener('click', () => {
  ipcRenderer.send('login');
});

document.getElementById('register-button').addEventListener('click', () => {
  const pseudo = document.getElementById('pseudo').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const repassword = document.getElementById('repassword').value;

  const pseudoErrorLabel = document.getElementById('pseudoErrorLabel');
  const pseudoInput = document.getElementById('pseudo');
  const emailErrorLabel = document.getElementById('emailErrorLabel');
  const emailInput = document.getElementById('email');
  const passwordErrorLabel = document.getElementById('passwordErrorLabel');
  const passwordInput = document.getElementById('password');
  const repasswordErrorLabel = document.getElementById('repasswordErrorLabel');
  const repasswordInput = document.getElementById('repassword');

  pseudoErrorLabel.textContent = "";
  pseudoInput.classList.remove("border-2");
  emailErrorLabel.textContent = "";
  emailInput.classList.remove("border-2");
  passwordErrorLabel.textContent = "";
  passwordInput.classList.remove("border-2");
  repasswordErrorLabel.textContent = "";
  repasswordInput.classList.remove("border-2");

  if (pseudo.length === 0){
    pseudoErrorLabel.textContent = "Ce champ est obligatoire";
    pseudoInput.classList.add("border-2");
  }else if(email.length === 0){
    emailErrorLabel.textContent = "Ce champ est obligatoire";
    emailInput.classList.add("border-2");
  }else if(password.length === 0){
    passwordErrorLabel.textContent = "Ce champ est obligatoire";
    passwordInput.classList.add("border-2");
  }else if(repassword.length === 0){
    repasswordErrorLabel.textContent = "Ce champ est obligatoire";
    repasswordInput.classList.add("border-2");
  }else if(repassword !== password){
    passwordErrorLabel.textContent = "Le mot de passe ne correspond pas";
    passwordInput.classList.add("border-2");
    repasswordErrorLabel.textContent = "Le mot de passe ne correspond pas";
    repasswordInput.classList.add("border-2");
  }else{
    ipcRenderer.invoke('registerRequest', pseudo, email, password).then((result) => {
      switch (result) {
        case "auth/invalid-email":
          emailErrorLabel.textContent = "Email invalide";
          emailInput.classList.add("border-2");
          break;
        
        case "auth/weak-password":
          passwordErrorLabel.textContent = "Mot de passe trop faible";
          passwordInput.classList.add("border-2");
          repasswordErrorLabel.textContent = "Mot de passe trop faible";
          repasswordInput.classList.add("border-2");
          break;

        case "auth/pseudoUsed":
          pseudoErrorLabel.textContent = "Pseudo déjà utilisé";
          pseudoInput.classList.add("border-2");
          break;

        default:
          break;
      }
    })
  }
});