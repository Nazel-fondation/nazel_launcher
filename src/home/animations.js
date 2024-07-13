const { gsap } = require('gsap');

// Animation for anim1 element
gsap.fromTo("#anim1", { x: -32 }, { x: 0, duration: 1 });

// Button hover and tap animations
document.getElementById('settingsIcon').addEventListener('mouseover', () => {gsap.to('#settingsIcon', { rotate: 90, duration: 0.5 })});
document.getElementById('settingsIcon').addEventListener('mouseout', () => {gsap.to('#settingsIcon', { rotate: 0, duration: 0.5 })});
document.getElementById('settingsIcon').addEventListener('mousedown', () => {gsap.to('#settingsIcon', { scale: 1.1, duration: 0.2 })});
document.getElementById('settingsIcon').addEventListener('mouseup', () => {gsap.to('#settingsIcon', { scale: 1.0, duration: 0.2 })});
document.getElementById('playerHeadImage').addEventListener('mouseover', () => {gsap.to('#playerHeadImage', { scale: 1.2, duration: 0.2 })});
document.getElementById('playerHeadImage').addEventListener('mouseout', () => {gsap.to('#playerHeadImage', { scale: 1.0, duration: 0.2 })});
document.getElementById('playerHeadImage').addEventListener('mousedown', () => {gsap.to('#playerHeadImage', { scale: 1.2, duration: 0.2 })});
document.getElementById('playerHeadImage').addEventListener('mouseup', () => {gsap.to('#playerHeadImage', { scale: 1.0, duration: 0.2 })});
document.getElementById('play').addEventListener('mouseover', () => {gsap.to('#play', { scale: 1.1, duration: 0.2 })});
document.getElementById('play').addEventListener('mouseout', () => {gsap.to('#play', { scale: 1.0, duration: 0.2 })});
document.getElementById('play').addEventListener('mousedown', () => {gsap.to('#play', { scale: 1, duration: 0.2 })});
document.getElementById('play').addEventListener('mouseup', () => {gsap.to('#play', { scale: 1.0, duration: 0.2 })});