# Nazel Launcher 🎮

**Nazel Launcher** est un launcher Minecraft open-source qui permet d'afficher des serveurs privés et d'en créer facilement. Le client est optimisé 🌍

![Aperçu du Nazel Launcher](https://nazel-launcher.web.app/pictures/screen.png)

## Fonctionnalités ✨

- Affichage de tous vos serveurs Minecraft. 🖥️
- Connexion rapide à vos serveurs. ⚡
- Possibilité de créer un serveur de mini-jeux privé. 🕹️ ( En cour de dev )

## Installation 🛠️

Ce projet utilise [Electron](https://www.electronjs.org/), un framework pour créer des applications de bureau à partir de JavaScript.

### Prérequis 📋

- Node.js et npm doivent être installés sur votre machine.

### Étapes d'installation 🚀

1. Clonez le dépôt :

    ```bash
    git clone https://github.com/Nazel-fondation/nazel_launcher.git
    cd nazel-launcher
    ```

2. Installez les dépendances nécessaires :

    ```bash
    npm install
    ```

3. Configurez Firebase 🔑 :

    - Créez vos propres clés Firebase.
    - Mettez à jour la clé Firebase dans le fichier de configuration. Un fichier d'exemple (`assets/config/configExample.json`) est fourni pour vous aider à configurer correctement votre environnement. Le fichier finale doit se nomme `config.json`

## Utilisation 🎯

Une fois l'installation terminée et les clés Firebase configurées, vous pouvez lancer le launcher Nazel en utilisant :

```bash
npm run start
```

Le launcher s'ouvrira alors et vous pourrez sélectionner et rejoindre vos serveurs Minecraft ou en créer un nouveau.

## Contribution 🤝

Les contributions sont les bienvenues ! Voici les étapes de base pour contribuer :

1. Forkez le projet. 🍴
2. Créez une branche pour votre fonctionnalité ou correction (`git checkout -b feature/ma-fonctionnalite`). 🌿
3. Commitez vos modifications (`git commit -m 'Ajout de ma fonctionnalité'`). 💬
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`). 📤
5. Ouvrez une Pull Request. 🔄

Merci de respecter les bonnes pratiques de code lors de vos contributions.

## Tests et Déploiement 🧪

Il n'y a pas de processus de test automatisé en place actuellement. Cependant, un workflow est configuré pour compiler le projet et envoyer une nouvelle release.

## Licence 📄

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## Contact 📬

Pour toute question ou support, vous pouvez me contacter via :

- Email : thibaultfalezan@gmail.com
- Discord : Vupilex