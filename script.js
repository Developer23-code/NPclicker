let napas = 0;
let napasPerSecond = 0;
let totalNapas = 0;
let totalClicks = 0;
let totalUpgrades = 0;
let totalPrestiges = 0;
let totalLevels = 0;
let totalXP = 0;
let goldenClicks = 0;
let highestLevel = 1;
let highestNapasPerSecond = 0;
let prestigeLevel = 0;
let prestigeMultiplier = 1;
let level = 1;
let xp = 0;
let xpToNextLevel = 100;
let soundEnabled = true;
let effectsEnabled = true;
const startTime = Date.now();

const clickButton = document.getElementById('clickButton');
const napasDisplay = document.getElementById('napas');
const perSecondDisplay = document.getElementById('perSecond');
const totalNapasDisplay = document.getElementById('totalNapas');
const prestigeLevelDisplay = document.getElementById('prestigeLevel');
const prestigeMultiplierDisplay = document.getElementById('prestigeMultiplier');
const nextMultiplierDisplay = document.getElementById('nextMultiplier');
const requiredPrestigeLevelDisplay = document.getElementById('requiredPrestigeLevel');
const levelDisplay = document.getElementById('level');
const xpDisplay = document.getElementById('xp');
const xpNextDisplay = document.getElementById('xpNext');
const xpProgressBar = document.getElementById('xpProgressBar');
const rankDisplay = document.getElementById('rankDisplay');
const totalClicksDisplay = document.getElementById('totalClicks');
const totalUpgradesDisplay = document.getElementById('totalUpgrades');
const totalPrestigesDisplay = document.getElementById('totalPrestiges');
const highestLevelDisplay = document.getElementById('highestLevel');
const highestRateDisplay = document.getElementById('highestRate');
const timePlayedDisplay = document.getElementById('timePlayed');
const mainDiv = document.getElementById('main');
const goldenNapa = document.getElementById('golden-napa');
const newsText = document.getElementById('news-text');
const achievementList = document.getElementById('achievement-list');
const prestigeButton = document.getElementById('prestigeButton');
const upgradeList = document.getElementById('upgrade-list');
const notificationContainer = document.getElementById('notification-container');
const settingsButton = document.getElementById('settingsButton');
const settingsOverlay = document.getElementById('settings-overlay');
const closeSettingsButton = document.getElementById('closeSettings');
const soundToggle = document.getElementById('soundToggle');
const effectsToggle = document.getElementById('effectsToggle');
const themeSelect = document.getElementById('themeSelect');
const body = document.body;

const upgrades = [
    { id: 'cursor', name: 'Napa Fingers', desc: 'Auto taps for Napa', icon: '👆', baseCost: 15, cost: 15, owned: 0, rate: 0.25 },
    { id: 'grandma', name: 'Grandma Napa', desc: 'Bakes napas for you', icon: '👵', baseCost: 120, cost: 120, owned: 0, rate: 1.15 },
    { id: 'farm', name: 'Napa Farm', desc: 'Grows napas automatically', icon: '🌾', baseCost: 1200, cost: 1200, owned: 0, rate: 7.8 },
    { id: 'mine', name: 'Napa Mine', desc: 'Mines precious napas', icon: '⛏️', baseCost: 14500, cost: 14500, owned: 0, rate: 52 },
    { id: 'factory', name: 'Napa Factory', desc: 'Mass produces napas', icon: '🏭', baseCost: 150000, cost: 150000, owned: 0, rate: 280 },
    { id: 'bank', name: 'Napa Bank', desc: 'Stores Napas for interest', icon: '🏦', baseCost: 2100000, cost: 2100000, owned: 0, rate: 1400 },
    { id: 'lab', name: 'Napa Lab', desc: 'Researches new Napa formulas', icon: '🔬', baseCost: 30000000, cost: 30000000, owned: 0, rate: 8200 },
    { id: 'temple', name: 'Napa Temple', desc: 'Prays for divine Napas', icon: '⛩️', baseCost: 450000000, cost: 450000000, owned: 0, rate: 47000 },
    { id: 'portal', name: 'Napa Portal', desc: 'Summons Napas from beyond', icon: '🌀', baseCost: 7200000000, cost: 7200000000, owned: 0, rate: 260000 },
    { id: 'ai', name: 'Napa AI', desc: 'Optimizes Napa production', icon: '🤖', baseCost: 120000000000, cost: 120000000000, owned: 0, rate: 1500000 }
];

const achievements = [
    { id: 'first-click', name: 'First Click', icon: '👆', unlocked: false, condition: () => totalClicks >= 1, element: null },
    { id: 'napa-pioneer', name: 'Napa Pioneer', icon: '🌱', unlocked: false, condition: () => totalNapas >= 100, element: null },
    { id: 'napa-factory', name: 'Factory Floor', icon: '🏭', unlocked: false, condition: () => upgrades.find(u => u.id === 'factory').owned >= 10, element: null },
    { id: 'golden-harvest', name: 'Golden Harvest', icon: '🥇', unlocked: false, condition: () => goldenClicks >= 1, element: null },
    { id: 'click-legend', name: 'Click Legend', icon: '⚡', unlocked: false, condition: () => totalClicks >= 500, element: null },
    { id: 'level-architect', name: 'Level Architect', icon: '🛠️', unlocked: false, condition: () => level >= 20, element: null },
    { id: 'sakura-sage', name: 'Sage of Napa', icon: '🌸', unlocked: false, condition: () => level >= 50, element: null },
    { id: 'prestige-initiate', name: 'Ascension Begins', icon: '✨', unlocked: false, condition: () => prestigeLevel >= 1, element: null },
    { id: 'prestige-mage', name: 'Prestige Mage', icon: '🔮', unlocked: false, condition: () => prestigeLevel >= 3, element: null },
    { id: 'upgrade-collector', name: 'Collector of Rice', icon: '📦', unlocked: false, condition: () => totalUpgrades >= 60, element: null },
    { id: 'pure-power', name: 'Pure Power', icon: '🔥', unlocked: false, condition: () => getCurrentRate() >= 10000, element: null },
    { id: 'united-napa', name: 'United Napa', icon: '🌐', unlocked: false, condition: () => upgrades.every(u => u.owned >= 1), element: null }
];

const newsMessages = [
    'Welcome to Napa Clicker!',
    'Napa is your best production buddy!',
    'Level up to unlock stronger Napas!',
    'Golden Napa appeared! Catch it!',
    'Prestige resets progression for stronger bonuses.',
    'More upgrades are hidden in the Napa store.',
    'Achievements reveal Napa secrets.',
    'Napa is glowing with energy.',
    'Customize your theme in Settings.',
    'Keep pushing to the next rank!'
];

let goldenTimer;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function calculateXpToNextLevel(currentLevel) {
    return Math.max(100, Math.floor(60 * Math.pow(currentLevel, 1.45)));
}

function getCurrentRate() {
    return napasPerSecond * prestigeMultiplier * getLevelMultiplier();
}

function getLevelMultiplier() {
    return 1 + level * 0.02;
}

function getRank(levelValue) {
    if (levelValue >= 100) return 'Napa Deity';
    if (levelValue >= 60) return 'Napa Sovereign';
    if (levelValue >= 30) return 'Napa Commander';
    if (levelValue >= 15) return 'Napa Warrior';
    return 'Napa Novice';
}

function getNextPrestigeLevel() {
    return 10 + prestigeLevel * 7;
}

function canPrestige() {
    return level >= getNextPrestigeLevel();
}

function saveSettings() {
    localStorage.setItem('napaSettings', JSON.stringify({
        soundEnabled,
        effectsEnabled,
        theme: themeSelect.value
    }));
}

function loadSettings() {
    const saved = localStorage.getItem('napaSettings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            soundEnabled = settings.soundEnabled ?? true;
            effectsEnabled = settings.effectsEnabled ?? true;
            themeSelect.value = settings.theme || 'theme-napa';
            applyTheme(themeSelect.value);
            soundToggle.checked = soundEnabled;
            effectsToggle.checked = effectsEnabled;
        } catch (e) {
            console.warn('Could not load settings', e);
        }
    }
}

function applyTheme(themeName) {
    body.classList.remove('theme-napa', 'theme-night', 'theme-sakura');
    body.classList.add(themeName);
}

function createNotification(message, type = 'info') {
    if (!effectsEnabled) return;
    const notice = document.createElement('div');
    notice.className = `notification ${type}`;
    notice.textContent = message;
    notificationContainer.appendChild(notice);
    setTimeout(() => {
        notice.style.opacity = '0';
        notice.style.transform = 'translateX(20px)';
        setTimeout(() => notice.remove(), 400);
    }, 2600);
}

function playPopSound() {
    if (!soundEnabled) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(350, audioContext.currentTime + 0.12);
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.12);
}

function createFloatingElement(content, isImage = false) {
    if (!effectsEnabled) return;
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
    const buttonRect = clickButton.getBoundingClientRect();
    const mainRect = mainDiv.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2 - mainRect.left;
    const randomOffset = (Math.random() - 0.5) * 120;
    element.style.left = `${centerX + randomOffset}px`;
    element.style.top = '100px';
    mainDiv.appendChild(element);
    setTimeout(() => {
        if (mainDiv.contains(element)) mainDiv.removeChild(element);
    }, 2200);
}

function showGoldenNapa() {
    goldenNapa.classList.remove('hidden');
    goldenTimer = setTimeout(() => goldenNapa.classList.add('hidden'), 10000);
}

function awardAchievement(message) {
    createNotification(message, 'success');
}

function levelUp() {
    while (xp >= xpToNextLevel) {
        xp -= xpToNextLevel;
        level += 1;
        totalLevels += 1;
        if (level > highestLevel) highestLevel = level;
        xpToNextLevel = calculateXpToNextLevel(level);
        createNotification(`Level up! Napa power increased to level ${level}.`, 'success');
        if (level % 5 === 0) {
            napasPerSecond += 0.75;
            createFloatingElement('⭐', false);
        }
    }
}

function gainXP(amount) {
    if (amount <= 0) return;
    xp += amount;
    totalXP += amount;
    levelUp();
}

function getTimePlayed() {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingSecs = seconds % 60;
    return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m ${remainingSecs}s`;
}

function initStore() {
    upgradeList.innerHTML = '';
    upgrades.forEach(upgrade => {
        const card = document.createElement('div');
        card.className = 'upgrade';
        card.innerHTML = `
            <div class="upgrade-icon">${upgrade.icon}</div>
            <div class="upgrade-info">
                <p class="upgrade-name">${upgrade.name}</p>
                <p class="upgrade-desc">${upgrade.desc}</p>
                <p class="upgrade-cost">Cost: <span id="cost-${upgrade.id}">${formatNumber(upgrade.cost)}</span> Napas</p>
                <p class="upgrade-owned">Owned: <span id="owned-${upgrade.id}">${upgrade.owned}</span></p>
            </div>
            <button id="button-${upgrade.id}">Buy</button>
        `;
        card.querySelector('button').addEventListener('click', () => buyUpgrade(upgrade));
        upgradeList.appendChild(card);
    });
}

function buyUpgrade(upgrade) {
    if (napas < upgrade.cost) return;
    napas -= upgrade.cost;
    upgrade.owned += 1;
    totalUpgrades += 1;
    napasPerSecond += upgrade.rate;
    upgrade.cost = Math.floor(upgrade.cost * 1.18);
    updateDisplays();
    createNotification(`${upgrade.name} acquired!`, 'success');
    checkAchievements();
}

function formatNumber(value) {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return Math.floor(value).toString();
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition()) {
            achievement.unlocked = true;
            if (achievement.element) {
                achievement.element.classList.add('unlocked');
            }
            awardAchievement(`Achievement unlocked: ${achievement.name}`);
        }
    });
}

function updateDisplays() {
    const effectiveRate = getCurrentRate();
    napasDisplay.textContent = formatNumber(napas);
    perSecondDisplay.textContent = effectiveRate.toFixed(1);
    totalNapasDisplay.textContent = formatNumber(totalNapas);
    prestigeLevelDisplay.textContent = prestigeLevel;
    prestigeMultiplierDisplay.textContent = `${prestigeMultiplier.toFixed(2)}x`;
    nextMultiplierDisplay.textContent = `${(1 + (prestigeLevel + 1) * 0.18).toFixed(2)}x`;
    requiredPrestigeLevelDisplay.textContent = getNextPrestigeLevel();
    levelDisplay.textContent = level;
    xpDisplay.textContent = Math.floor(xp);
    xpNextDisplay.textContent = xpToNextLevel;
    xpProgressBar.style.width = `${Math.min(100, (xp / xpToNextLevel) * 100)}%`;
    rankDisplay.textContent = getRank(level);
    totalClicksDisplay.textContent = totalClicks;
    totalUpgradesDisplay.textContent = totalUpgrades;
    totalPrestigesDisplay.textContent = totalPrestiges;
    highestLevelDisplay.textContent = highestLevel;
    highestRateDisplay.textContent = Math.max(highestNapasPerSecond, effectiveRate).toFixed(1);
    timePlayedDisplay.textContent = getTimePlayed();
    prestigeButton.disabled = !canPrestige();

    upgrades.forEach(upgrade => {
        const costEl = document.getElementById(`cost-${upgrade.id}`);
        const ownedEl = document.getElementById(`owned-${upgrade.id}`);
        const buttonEl = document.getElementById(`button-${upgrade.id}`);
        if (costEl) costEl.textContent = formatNumber(upgrade.cost);
        if (ownedEl) ownedEl.textContent = upgrade.owned;
        if (buttonEl) buttonEl.disabled = napas < upgrade.cost;
    });

    if (effectiveRate > highestNapasPerSecond) highestNapasPerSecond = effectiveRate;
}

function applyPrestigeEffects() {
    body.classList.add('prestige-glow');
    setTimeout(() => body.classList.remove('prestige-glow'), 1800);
    createNotification('Prestige achieved! Napa power is stronger than ever.', 'success');
    newsText.textContent = 'The Napa realm has ascended!';
    setTimeout(() => {
        newsText.textContent = newsMessages[Math.floor(Math.random() * newsMessages.length)];
    }, 4000);
}

function prestige() {
    if (!canPrestige()) return;
    prestigeLevel += 1;
    prestigeMultiplier = 1 + prestigeLevel * 0.18;
    totalPrestiges += 1;
    level = 1;
    xp = 0;
    xpToNextLevel = calculateXpToNextLevel(level);
    napas = 0;
    napasPerSecond = 0;
    upgrades.forEach(upgrade => {
        upgrade.owned = 0;
        upgrade.cost = upgrade.baseCost;
    });
    initStore();
    updateDisplays();
    applyPrestigeEffects();
    checkAchievements();
}

function changeTheme(themeValue) {
    applyTheme(themeValue);
    saveSettings();
}

clickButton.addEventListener('click', () => {
    totalClicks += 1;
    napas += 1;
    totalNapas += 1;
    if (napas > 0) {
        gainXP(6 + level * 0.2);
    }
    clickButton.classList.add('squish');
    setTimeout(() => clickButton.classList.remove('squish'), 260);
    playPopSound();
    const emojis = ['💜', '✨', '🌟', '💕', '⚡', '🍑'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    createFloatingElement(randomEmoji);
    if (effectsEnabled && Math.random() < 0.25) createFloatingElement(clickButton.src, true);
    checkAchievements();
    updateDisplays();
});

goldenNapa.addEventListener('click', () => {
    if (goldenNapa.classList.contains('hidden')) return;
    const bonus = Math.floor(getCurrentRate() * 9) + 25;
    napas += bonus;
    totalNapas += bonus;
    goldenClicks += 1;
    goldenNapa.classList.add('hidden');
    clearTimeout(goldenTimer);
    createFloatingElement(`+${formatNumber(bonus)}`);
    newsText.textContent = `Golden Napa! +${formatNumber(bonus)} Napas!`;
    if (soundEnabled) playPopSound();
    setTimeout(() => {
        newsText.textContent = newsMessages[Math.floor(Math.random() * newsMessages.length)];
    }, 3500);
    checkAchievements();
    updateDisplays();
});

prestigeButton.addEventListener('click', prestige);
settingsButton.addEventListener('click', () => settingsOverlay.classList.remove('hidden'));
closeSettingsButton.addEventListener('click', () => settingsOverlay.classList.add('hidden'));
soundToggle.addEventListener('change', () => {
    soundEnabled = soundToggle.checked;
    saveSettings();
});
effectsToggle.addEventListener('change', () => {
    effectsEnabled = effectsToggle.checked;
    saveSettings();
});
themeSelect.addEventListener('change', event => changeTheme(event.target.value));

function initAchievements() {
    achievements.forEach(achievement => {
        const element = document.createElement('div');
        element.className = 'achievement';
        element.innerHTML = `<div class="achievement-icon">${achievement.icon}</div><div class="achievement-name">${achievement.name}</div>`;
        achievement.element = element;
        achievementList.appendChild(element);
    });
}

function mainLoop() {
    const gain = getCurrentRate();
    if (gain > 0) {
        napas += gain;
        totalNapas += gain;
        gainXP(gain * 0.45);
    }
    if (Math.random() < 0.0012 && goldenNapa.classList.contains('hidden')) showGoldenNapa();
    if (Math.random() < 0.015) newsText.textContent = newsMessages[Math.floor(Math.random() * newsMessages.length)];
    updateDisplays();
    checkAchievements();
}

loadSettings();
initStore();
initAchievements();
updateDisplays();
setInterval(mainLoop, 1000);
