let napas = 0;
let napasPerSecond = 0;
let totalNapas = 0;
let prestigeLevel = 0;
let prestigeMultiplier = 1;
const clickButton = document.getElementById('clickButton');
const napasDisplay = document.getElementById('napas');
const perSecondDisplay = document.getElementById('perSecond');
const totalNapasDisplay = document.getElementById('totalNapas');
const prestigeLevelDisplay = document.getElementById('prestigeLevel');
const prestigeMultiplierDisplay = document.getElementById('prestigeMultiplier');
const nextMultiplierDisplay = document.getElementById('nextMultiplier');
const mainDiv = document.getElementById('main');
const goldenNapa = document.getElementById('golden-napa');
const newsText = document.getElementById('news-text');
const achievementList = document.getElementById('achievement-list');
const prestigeButton = document.getElementById('prestigeButton');

// Upgrades
let cursorCost = 15;
let cursorOwned = 0;
let grandmaCost = 100;
let grandmaOwned = 0;
let farmCost = 1100;
let farmOwned = 0;
let mineCost = 12000;
let mineOwned = 0;
let factoryCost = 130000;
let factoryOwned = 0;

const upgrades = [
    { name: 'cursor', cost: cursorCost, owned: cursorOwned, costDisplay: 'cursorCost', ownedDisplay: 'cursorOwned', button: 'buyCursor', rate: 0.1 },
    { name: 'grandma', cost: grandmaCost, owned: grandmaOwned, costDisplay: 'grandmaCost', ownedDisplay: 'grandmaOwned', button: 'buyGrandma', rate: 1 },
    { name: 'farm', cost: farmCost, owned: farmOwned, costDisplay: 'farmCost', ownedDisplay: 'farmOwned', button: 'buyFarm', rate: 8 },
    { name: 'mine', cost: mineCost, owned: mineOwned, costDisplay: 'mineCost', ownedDisplay: 'mineOwned', button: 'buyMine', rate: 47 },
    { name: 'factory', cost: factoryCost, owned: factoryOwned, costDisplay: 'factoryCost', ownedDisplay: 'factoryOwned', button: 'buyFactory', rate: 260 }
];

// Achievements
const achievements = [
    { id: 'first-click', name: 'First Click', icon: '👆', unlocked: false, condition: () => totalNapas >= 1, element: null },
    { id: 'hundred-napas', name: '100 Napas', icon: '💯', unlocked: false, condition: () => totalNapas >= 100, element: null },
    { id: 'thousand-napas', name: '1K Napas', icon: '🎉', unlocked: false, condition: () => totalNapas >= 1000, element: null },
    { id: 'first-upgrade', name: 'First Upgrade', icon: '⬆️', unlocked: false, condition: () => cursorOwned >= 1, element: null },
    { id: 'grandma-army', name: 'Grandma Army', icon: '👵', unlocked: false, condition: () => grandmaOwned >= 10, element: null },
    { id: 'millionaire', name: 'Millionaire', icon: '💰', unlocked: false, condition: () => totalNapas >= 1000000, element: null },
    { id: 'prestige', name: 'First Prestige', icon: '⭐', unlocked: false, condition: () => prestigeLevel >= 1, element: null },
    { id: 'golden-click', name: 'Golden Click', icon: '🥇', unlocked: false, condition: () => false, element: null } // Special
];

// News messages
const newsMessages = [
    "Welcome to Napa Clicker!",
    "Napa is the cutest boy ever!",
    "Keep clicking for more Napas!",
    "Golden Napa appeared! Click it for bonus!",
    "Prestige to get multipliers!",
    "Buy upgrades to increase production!",
    "Achievements unlock as you progress!",
    "Napa loves you! ❤️",
    "More features coming soon!",
    "You're doing great!"
];

// Golden Napa
let goldenTimer;

// Audio context for sound
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Function to play pop sound
function playPopSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Create floating element
function createFloatingElement(content, isImage = false) {
    const element = document.createElement('div');
    element.className = 'floating-element';
    if (isImage) {
        const img = document.createElement('img');
        img.src = content;
        img.style.width = '30px';
        img.style.height = '40px';
        img.style.borderRadius = '5px';
        element.appendChild(img);
    } else {
        element.textContent = content;
    }
    // Center on the clickButton
    const buttonRect = clickButton.getBoundingClientRect();
    const mainRect = mainDiv.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2 - mainRect.left;
    const randomOffset = (Math.random() - 0.5) * 100; // Random offset between -50 and 50
    element.style.left = (centerX + randomOffset) + 'px';
    element.style.top = '100px';
    mainDiv.appendChild(element);
    setTimeout(() => {
        if (mainDiv.contains(element)) {
            mainDiv.removeChild(element);
        }
    }, 2000);
}

// Show golden napa
function showGoldenNapa() {
    goldenNapa.classList.remove('hidden');
    goldenTimer = setTimeout(() => {
        goldenNapa.classList.add('hidden');
    }, 10000); // 10 seconds
}

// Click event for Napa
clickButton.addEventListener('click', () => {
    napas++;
    totalNapas++;
    napasDisplay.textContent = Math.floor(napas);
    
    // Animation
    clickButton.classList.add('squish');
    setTimeout(() => {
        clickButton.classList.remove('squish');
    }, 300);
    
    // Sound
    playPopSound();
    
    // Floating elements
    const emojis = ['❤️', '💖', '💕', '💗', '💓', '💘'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    createFloatingElement(randomEmoji);
    
    if (Math.random() < 0.3) { // 30% chance for small Napa image
        createFloatingElement(clickButton.src, true);
    }
    
    checkAchievements();
});

// Golden Napa click
goldenNapa.addEventListener('click', () => {
    const bonus = Math.floor(napasPerSecond * 900) + 13; // Like Cookie Clicker
    napas += bonus;
    totalNapas += bonus;
    goldenNapa.classList.add('hidden');
    clearTimeout(goldenTimer);
    createFloatingElement('+' + bonus);
    newsText.textContent = `Golden Napa! +${bonus} Napas!`;
    setTimeout(() => {
        newsText.textContent = newsMessages[Math.floor(Math.random() * newsMessages.length)];
    }, 3000);
    if (!achievements.find(a => a.id === 'golden-click').unlocked) {
        achievements.find(a => a.id === 'golden-click').unlocked = true;
        achievements.find(a => a.id === 'golden-click').element.classList.add('unlocked');
    }
});

// Prestige
prestigeButton.addEventListener('click', () => {
    if (totalNapas >= 100000) { // Require 100K for prestige
        prestigeLevel++;
        prestigeMultiplier = 1 + (prestigeLevel * 0.15);
        // Reset buildings
        upgrades.forEach(upgrade => {
            upgrade.owned = 0;
            upgrade.cost = upgrade.name === 'cursor' ? 15 : upgrade.name === 'grandma' ? 100 : upgrade.name === 'farm' ? 1100 : upgrade.name === 'mine' ? 12000 : 130000;
        });
        napas = 0;
        napasPerSecond = 0;
        updateDisplays();
        newsText.textContent = `Prestiged! Multiplier increased to ${prestigeMultiplier.toFixed(2)}x!`;
        setTimeout(() => {
            newsText.textContent = newsMessages[Math.floor(Math.random() * newsMessages.length)];
        }, 5000);
    }
});

// Buy upgrade function
function createBuyHandler(upgrade) {
    document.getElementById(upgrade.button).addEventListener('click', () => {
        if (napas >= upgrade.cost) {
            napas -= upgrade.cost;
            upgrade.owned++;
            napasPerSecond += upgrade.rate;
            upgrade.cost = Math.floor(upgrade.cost * 1.15);
            updateDisplays();
        }
    });
}

upgrades.forEach(createBuyHandler);

// Check achievements
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition()) {
            achievement.unlocked = true;
            if (achievement.element) {
                achievement.element.classList.add('unlocked');
            }
        }
    });
}

// Update displays
function updateDisplays() {
    napasDisplay.textContent = Math.floor(napas);
    perSecondDisplay.textContent = (napasPerSecond * prestigeMultiplier).toFixed(1);
    totalNapasDisplay.textContent = Math.floor(totalNapas);
    prestigeLevelDisplay.textContent = prestigeLevel;
    prestigeMultiplierDisplay.textContent = prestigeMultiplier.toFixed(2);
    nextMultiplierDisplay.textContent = (1 + ((prestigeLevel + 1) * 0.15)).toFixed(2);
    
    upgrades.forEach(upgrade => {
        document.getElementById(upgrade.costDisplay).textContent = upgrade.cost;
        document.getElementById(upgrade.ownedDisplay).textContent = upgrade.owned;
        document.getElementById(upgrade.button).disabled = napas < upgrade.cost;
    });
    
    prestigeButton.disabled = totalNapas < 100000;
}

// Auto-generate napas
setInterval(() => {
    napas += napasPerSecond * prestigeMultiplier;
    totalNapas += napasPerSecond * prestigeMultiplier;
    updateDisplays();
    checkAchievements();
    
    // Random golden napa
    if (Math.random() < 0.001 && goldenNapa.classList.contains('hidden')) { // 0.1% chance per second
        showGoldenNapa();
    }
    
    // Random news
    if (Math.random() < 0.01) {
        newsText.textContent = newsMessages[Math.floor(Math.random() * newsMessages.length)];
    }
}, 1000);

// Initialize achievements display
achievements.forEach(achievement => {
    const achElement = document.createElement('div');
    achElement.className = 'achievement' + (achievement.unlocked ? ' unlocked' : '');
    achElement.innerHTML = `<div class="achievement-icon">${achievement.icon}</div><div class="achievement-name">${achievement.name}</div>`;
    achievement.element = achElement;
    achievementList.appendChild(achElement);
});

// Initial update
updateDisplays();

// Disable prestige button initially
prestigeButton.disabled = true;