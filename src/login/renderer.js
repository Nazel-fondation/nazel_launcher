const { ipcRenderer } = require('electron');

document.getElementById('close-buton').addEventListener('click', () => {
  ipcRenderer.send('close-window', "loginWindow");
});

document.getElementById('open-sign-in').addEventListener('click', () => {
  ipcRenderer.send('sign-in');
});

document.getElementById('loginButton').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordErrorLabel = document.getElementById('passwordErrorLabel');
  const passwordInput = document.getElementById('password');
  const emailErrorLabel = document.getElementById('emailErrorLabel');
  const emailInput = document.getElementById('email');

  if (email.length === 0){
    passwordErrorLabel.textContent = "";
    passwordInput.classList.remove("border-2");
    emailErrorLabel.textContent = "Ce champ est obligatoire";
    emailInput.classList.add("border-2");
  }else if(password.length === 0){
    passwordErrorLabel.textContent = "Ce champ est obligatoire";
    passwordInput.classList.add("border-2");
    emailErrorLabel.textContent = "";
    emailInput.classList.remove("border-2");
  }else{
    ipcRenderer.invoke('loginRequest', email, password).then((result) => {

      if (result !== null){
        if (result === "auth/invalid-credential"){
          passwordErrorLabel.textContent = "Identifiant ou mot de passe incorect";
          passwordInput.classList.add("border-2");
          emailErrorLabel.textContent = "Identifiant ou mot de passe incorect";
          emailInput.classList.add("border-2");
        }else if(result === "auth/invalid-email"){
          passwordErrorLabel.textContent = "";
          passwordInput.classList.remove("border-2");
          emailErrorLabel.textContent = "Email invalid";
          emailInput.classList.add("border-2");
        }
      }else{
        passwordErrorLabel.textContent = '';
      }
    })
  }
});

