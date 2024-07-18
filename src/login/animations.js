const { gsap } = require('gsap');

document.getElementById('loginButton').addEventListener('mouseover', () => {gsap.to('#loginButton', { scale: 1.02, duration: 0.2 })});
document.getElementById('loginButton').addEventListener('mouseout', () => {gsap.to('#loginButton', { scale: 1.0, duration: 0.2 })});
document.getElementById('loginButton').addEventListener('mousedown', () => {gsap.to('#loginButton', { scale: 1, duration: 0.2 })});
document.getElementById('loginButton').addEventListener('mouseup', () => {gsap.to('#loginButton', { scale: 1.0, duration: 0.2 })});