const { gsap } = require('gsap');

document.getElementById('register-button').addEventListener('mouseover', () => {gsap.to('#register-button', { scale: 1.02, duration: 0.2 })});
document.getElementById('register-button').addEventListener('mouseout', () => {gsap.to('#register-button', { scale: 1.0, duration: 0.2 })});
document.getElementById('register-button').addEventListener('mousedown', () => {gsap.to('#register-button', { scale: 1, duration: 0.2 })});
document.getElementById('register-button').addEventListener('mouseup', () => {gsap.to('#register-button', { scale: 1.0, duration: 0.2 })});