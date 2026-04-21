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
let musicEnabled = true;
let comboCount = 0;
let comboTimer = null;
let lastComboTime = 0;
const startTime = Date.now();
let lastSaveTime = Date.now();
let lastSessionTime = 0;

let bgMusic = null;
let audioContext = null;

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

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playPopSound() {
    if (!soundEnabled) return;
    initAudioContext();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(700, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.28, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.12);
}

function playSuccessSound() {
    if (!soundEnabled) return;
    initAudioContext();
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(800, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
}

function playLevelUpSound() {
    if (!soundEnabled) return;
    initAudioContext();
    const now = audioContext.currentTime;
    const notes = [523, 659, 784, 988];
    notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.22, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.1);
        osc.start(now + i * 0.1);
        osc.stop(now + (i + 1) * 0.1);
    });
}

function initBackgroundMusic() {
    if (!musicEnabled || bgMusic) return;
    initAudioContext();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const lfo = audioContext.createOscillator();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    lfo.connect(gain.gain);
    
    osc.frequency.value = 220;
    lfo.frequency.value = 0.5;
    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    
    osc.start();
    lfo.start();
    
    bgMusic = { osc, lfo, gain };
}

function createFloatingElement(content, isImage = false, clickX = null, clickY = null) {
    if (!effectsEnabled) return;
    const particleContainer = document.getElementById('particle-container');
    if (!particleContainer) return;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    if (isImage) {
        const img = document.createElement('img');
        img.src = content;
        img.style.width = '30px';
        img.style.height = '40px';
        img.style.borderRadius = '5px';
        particle.appendChild(img);
    } else {
        particle.textContent = content;
    }
    
    const mainRect = mainDiv.getBoundingClientRect();
    const containerRect = particleContainer.getBoundingClientRect();
    
    let posX = clickX ?? mainRect.left + mainRect.width / 2 - containerRect.left;
    let posY = clickY ?? mainRect.top + mainRect.height / 2 - containerRect.top;
    
    if (clickX === null) {
        posX += (Math.random() - 0.5) * 60;
    }
    
    particle.style.left = `${posX}px`;
    particle.style.top = `${posY}px`;
    particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);
    
    particleContainer.appendChild(particle);
    particle.offsetHeight;
    particle.classList.add('rise');
    
    setTimeout(() => {
        if (particleContainer && particleContainer.contains(particle)) {
            particleContainer.removeChild(particle);
        }
    }, 2500);
}

function showGoldenNapa() {
    goldenNapa.classList.remove('hidden');
    goldenTimer = setTimeout(() => goldenNapa.classList.add('hidden'), 10000);
}

function awardAchievement(message) {
    createNotification(message, 'success');
}

function saveGameState() {
    const gameState = {
        napas,
        napasPerSecond,
        totalNapas,
        totalClicks,
        totalUpgrades,
        totalPrestiges,
        totalLevels,
        totalXP,
        goldenClicks,
        highestLevel,
        highestNapasPerSecond,
        prestigeLevel,
        prestigeMultiplier,
        level,
        xp,
        xpToNextLevel,
        currentPlanet,
        planetsUnlocked,
        upgrades: upgrades.map(u => ({
            id: u.id,
            owned: u.owned,
            cost: u.cost
        })),
        achievements: achievements.map(a => ({
            id: a.id,
            unlocked: a.unlocked
        })),
        // Save planet-specific upgrades and achievements
        planetUpgrades: Object.keys(planetUpgrades).reduce((acc, key) => {
            acc[key] = planetUpgrades[key].map(u => ({
                id: u.id,
                purchased: u.purchased
            }));
            return acc;
        }, {}),
        planetAchievements: Object.keys(planetAchievements).reduce((acc, key) => {
            acc[key] = planetAchievements[key].map(a => ({
                id: a.id,
                earned: a.earned
            }));
            return acc;
        }, {}),
        lastSessionTime: Date.now(),
        lastOfflineProductionTime: Date.now(),
        startTime
    };
    localStorage.setItem('napaGameState', JSON.stringify(gameState));
    lastSaveTime = Date.now();
}

function loadGameState() {
    const saved = localStorage.getItem('napaGameState');
    if (!saved) return false;
    
    try {
        const gameState = JSON.parse(saved);
        lastSessionTime = gameState.lastSessionTime || 0;
        const offlineTime = (Date.now() - lastSessionTime) / 1000;
        
        napas = gameState.napas || 0;
        napasPerSecond = gameState.napasPerSecond || 0;
        totalNapas = gameState.totalNapas || 0;
        totalClicks = gameState.totalClicks || 0;
        totalUpgrades = gameState.totalUpgrades || 0;
        totalPrestiges = gameState.totalPrestiges || 0;
        totalLevels = gameState.totalLevels || 0;
        totalXP = gameState.totalXP || 0;
        goldenClicks = gameState.goldenClicks || 0;
        highestLevel = gameState.highestLevel || 1;
        highestNapasPerSecond = gameState.highestNapasPerSecond || 0;
        prestigeLevel = gameState.prestigeLevel || 0;
        prestigeMultiplier = gameState.prestigeMultiplier || 1;
        level = gameState.level || 1;
        xp = gameState.xp || 0;
        xpToNextLevel = gameState.xpToNextLevel || 100;
        currentPlanet = gameState.currentPlanet || 'p1';
        planetsUnlocked = gameState.planetsUnlocked || ['p1'];
        
        // Restore planet unlocked states
        planetsUnlocked.forEach(key => {
            if (planets[key]) {
                planets[key].unlocked = true;
            }
        });
        
        // Restore upgrades
        if (gameState.upgrades && gameState.upgrades.length > 0) {
            gameState.upgrades.forEach(saved => {
                const upgrade = upgrades.find(u => u.id === saved.id);
                if (upgrade) {
                    upgrade.owned = saved.owned || 0;
                    upgrade.cost = saved.cost || upgrade.baseCost;
                }
            });
        }
        
        // Restore achievements
        if (gameState.achievements && gameState.achievements.length > 0) {
            gameState.achievements.forEach(saved => {
                const achievement = achievements.find(a => a.id === saved.id);
                if (achievement) {
                    achievement.unlocked = saved.unlocked || false;
                }
            });
        }
        
        // Restore planet-specific upgrades
        if (gameState.planetUpgrades) {
            Object.keys(gameState.planetUpgrades).forEach(planetKey => {
                if (planetUpgrades[planetKey]) {
                    gameState.planetUpgrades[planetKey].forEach(saved => {
                        const upgrade = planetUpgrades[planetKey].find(u => u.id === saved.id);
                        if (upgrade) {
                            upgrade.purchased = saved.purchased || false;
                            // Apply purchased upgrades to napasPerSecond
                            if (upgrade.purchased && napasPerSecond > 0) {
                                napasPerSecond *= upgrade.effect;
                            }
                        }
                    });
                }
            });
        }
        
        // Restore planet-specific achievements
        if (gameState.planetAchievements) {
            Object.keys(gameState.planetAchievements).forEach(planetKey => {
                if (planetAchievements[planetKey]) {
                    gameState.planetAchievements[planetKey].forEach(saved => {
                        const achievement = planetAchievements[planetKey].find(a => a.id === saved.id);
                        if (achievement) {
                            achievement.earned = saved.earned || false;
                        }
                    });
                }
            });
        }
        
        // Apply offline progress with planet bonus
        if (offlineTime > 2 && napasPerSecond > 0) {
            const currentPlanetData = planets[currentPlanet] || planets['p1'];
            const planetBonus = currentPlanetData.bonus || 1;
            const levelMultiplier = 1 + level * 0.02;
            const offlineGain = Math.min(offlineTime, 604800) * napasPerSecond * prestigeMultiplier * planetBonus * levelMultiplier;
            napas += offlineGain;
            totalNapas += offlineGain;
            const xpGain = offlineGain * 0.45;
            totalXP += xpGain;
            xp += xpGain;
            createNotification(`📊 Offline Progress: +${formatNumber(offlineGain)} Napas generated while you were away!`, 'success');
        }
        
        return true;
    } catch (e) {
        console.warn('Could not load game state', e);
        return false;
    }
}

function levelUp() {
    while (xp >= xpToNextLevel) {
        xp -= xpToNextLevel;
        level += 1;
        totalLevels += 1;
        if (level > highestLevel) highestLevel = level;
        xpToNextLevel = calculateXpToNextLevel(level);
        playLevelUpSound();
        const mainRect = mainDiv.getBoundingClientRect();
        const centerX = mainRect.width / 2;
        const centerY = mainRect.height / 2;
        createFloatingElement('⭐', false, centerX, centerY - 60);
        if (level % 5 === 0) {
            napasPerSecond += 0.75;
            createFloatingElement('💫', false, centerX, centerY - 100);
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
    const currentPlanetEl = document.getElementById('currentPlanet');
    if (currentPlanetEl) {
        const planetData = planets[currentPlanet] || planets['p1'];
        const bonusText = planetData.bonus > 1 ? ` (+${Math.round((planetData.bonus - 1) * 100)}%)` : '';
        currentPlanetEl.textContent = `${planetData.emoji} ${planetData.name}${bonusText}`;
    }
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
    playSuccessSound();
    setTimeout(() => body.classList.remove('prestige-glow'), 1800);
    createNotification('Prestige achieved! Napa power is stronger than ever.', 'success');
    newsText.textContent = 'The Napa realm has ascended!';
    setTimeout(() => {
        newsText.textContent = newsMessages[Math.floor(Math.random() * newsMessages.length)];
    }, 4000);
}

function updateMiniGame() {
    const now = Date.now();
    if (now - lastComboTime > 2500) {
        comboCount = 0;
        clearTimeout(comboTimer);
    }
    
    comboCount++;
    lastComboTime = now;
    document.getElementById('combo-count').textContent = comboCount;
    
    const tapZone = document.getElementById('tap-zone');
    tapZone.classList.add('active');
    clearTimeout(comboTimer);
    
    if (comboCount >= 5) {
        const bonus = Math.floor(comboCount * 2.5);
        napas += bonus;
        totalNapas += bonus;
        createNotification(`Combo x${comboCount}! +${bonus} Napas!`, 'success');
        playSuccessSound();
        comboCount = 0;
        tapZone.classList.remove('active');
        comboTimer = setTimeout(() => {
            document.getElementById('combo-text').textContent = 'Combo: 0';
            document.getElementById('combo-count').textContent = '0';
        }, 1500);
    } else {
        comboTimer = setTimeout(() => {
            tapZone.classList.remove('active');
        }, 400);
    }
}

function initMiniGame() {
    const tapZone = document.getElementById('tap-zone');
    tapZone.addEventListener('click', updateMiniGame);
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
    saveGameState();
}

function changeTheme(themeValue) {
    applyTheme(themeValue);
    saveSettings();
}

clickButton.addEventListener('click', (event) => {
    const rect = clickButton.getBoundingClientRect();
    const mainRect = mainDiv.getBoundingClientRect();
    const clickX = event.clientX - mainRect.left;
    const clickY = event.clientY - mainRect.top;
    
    totalClicks += 1;
    napas += 1;
    totalNapas += 1;
    if (napas > 0) {
        gainXP(6 + level * 0.2);
    }
    clickButton.classList.add('squish');
    setTimeout(() => clickButton.classList.remove('squish'), 260);
    playPopSound();
    const emojis = ['💜', '✨', '🌟', '💕', '⚡', '🍑', '🎉'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    createFloatingElement(randomEmoji, false, clickX, clickY);
    if (effectsEnabled && Math.random() < 0.2) createFloatingElement(clickButton.src, true, clickX, clickY - 50);
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
    checkClickMilestones();
    checkSecretBonus();
    
    // Auto-save every 10 seconds
    if (Date.now() - lastSaveTime >= 10000) {
        saveGameState();
    }
}

// Process background production when tab becomes visible
function handlePageVisibilityChange() {
    if (document.hidden) {
        // Tab is hidden - save state
        saveGameState();
    } else {
        // Tab is now visible - calculate and apply any accumulated production
        const timeSinceLastSave = (Date.now() - lastOfflineProductionTime) / 1000;
        if (timeSinceLastSave > 0.5 && napasPerSecond > 0) {
            const currentPlanetData = planets[currentPlanet] || planets['p1'];
            const planetBonus = currentPlanetData.bonus || 1;
            const levelMultiplier = 1 + level * 0.02;
            const backgroundGain = timeSinceLastSave * napasPerSecond * prestigeMultiplier * planetBonus * levelMultiplier;
            if (backgroundGain > 0) {
                napas += backgroundGain;
                totalNapas += backgroundGain;
                gainXP(backgroundGain * 0.45);
                createNotification(`✨ Background Production: +${formatNumber(backgroundGain)} Napas while tab was inactive!`, 'success');
            }
            lastOfflineProductionTime = Date.now();
        }
    }
}

// Tooltip system
let activeTooltip = null;

function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            // Remove existing tooltip if any
            if (activeTooltip) activeTooltip.remove();
            
            const tooltipText = element.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            activeTooltip = tooltip;
            
            // Position tooltip
            updateTooltipPosition(element, tooltip);
        });
        
        element.addEventListener('mousemove', (e) => {
            if (activeTooltip) {
                updateTooltipPosition(element, activeTooltip, e);
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
        });
    });
}

function updateTooltipPosition(element, tooltip, mouseEvent = null) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let x = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let y = rect.top - tooltipRect.height - 10;
    
    // If mouse event is provided, follow the mouse horizontally
    if (mouseEvent) {
        x = mouseEvent.clientX - tooltipRect.width / 2;
    }
    
    // Clamp tooltip to viewport
    const padding = 10;
    if (x < padding) x = padding;
    if (x + tooltipRect.width > window.innerWidth - padding) {
        x = window.innerWidth - tooltipRect.width - padding;
    }
    
    // If tooltip would go above viewport, place it below
    if (y < padding) {
        y = rect.bottom + 10;
    }
    
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}

// ===== REDEEM CODE SYSTEM =====
let currentPlanet = 'p1';
let planetsUnlocked = ['p1'];
let lastOfflineProductionTime = Date.now();

const redeemCodes = {
    'napavortex': { reward: 'napas', amount: 50000, message: 'The Napa Vortex opens!' },
    'secretfruit': { reward: 'prestige', amount: 1, message: 'A mysterious fruit appears!' },
    'koalaforce': { reward: 'napas', amount: 100000, message: 'Koala spirit awakens!' },
    'vineplague': { reward: 'level', amount: 5, message: 'Vine plague outbreak!' },
    'timetravel': { reward: 'napas', amount: 250000, message: 'Time bends around you!' },
    'dragonblood': { reward: 'multiplier', amount: 0.25, message: 'Dragon blood flows through you!' },
    'moonlight': { reward: 'napas', amount: 75000, message: 'Moonlight energy surges!' },
    'napacore': { reward: 'napasPerSecond', amount: 50, message: 'You found the Napa core!' },
    'prophecy': { reward: 'level', amount: 10, message: 'The prophecy fulfills!' },
    'eternal': { reward: 'napas', amount: 50000000000000, message: 'Eternal Napa blessing!' }
};

const planets = {
    // Tier 1 - Starting Point
    p1: { id: 1, name: 'Earth', emoji: '🌍', desc: 'Your home planet. The Napa journey begins here.', bonus: 1, unlocked: true, milestone: 0, color: '#00ff00', parents: [], children: ['p2', 'p3'] },
    
    // Tier 2 - First Branches
    p2: { id: 2, name: 'Venus', emoji: '🔥', desc: 'A scorching hot planet with intense Napa growth.', bonus: 1.15, unlocked: false, milestone: 40, color: '#ffaa00', parents: ['p1'], children: ['p4', 'p5'] },
    p3: { id: 3, name: 'Mercury', emoji: '⚡', desc: 'Swift Mercury accelerates your production.', bonus: 1.12, unlocked: false, milestone: 45, color: '#ffff00', parents: ['p1'], children: ['p6', 'p7'] },
    
    // Tier 3
    p4: { id: 4, name: 'Mars', emoji: '🔴', desc: 'The red planet holds untapped Napa reserves.', bonus: 1.25, unlocked: false, milestone: 80, color: '#ff4444', parents: ['p2'], children: ['p8', 'p9'] },
    p5: { id: 5, name: 'Jupiter', emoji: '🌀', desc: 'Massive gas giant with enormous Napa storms.', bonus: 1.22, unlocked: false, milestone: 90, color: '#cc7722', parents: ['p2'], children: ['p10', 'p11'] },
    p6: { id: 6, name: 'Saturn', emoji: '💍', desc: 'Beautiful ringed planet with ring bonuses.', bonus: 1.20, unlocked: false, milestone: 85, color: '#ffeecc', parents: ['p3'], children: ['p12', 'p13'] },
    p7: { id: 7, name: 'Uranus', emoji: '🧊', desc: 'Frozen planet with crystal Napa deposits.', bonus: 1.18, unlocked: false, milestone: 75, color: '#00ccff', parents: ['p3'], children: ['p14', 'p15'] },
    
    // Tier 4
    p8: { id: 8, name: 'Neptune', emoji: '🌊', desc: 'Distant water world with icy Napa.', bonus: 1.35, unlocked: false, milestone: 140, color: '#0066ff', parents: ['p4'], children: ['p16', 'p17'] },
    p9: { id: 9, name: 'Pluto', emoji: '❄️', desc: 'Dwarf planet at the edge of explored space.', bonus: 1.32, unlocked: false, milestone: 130, color: '#999999', parents: ['p4'], children: ['p18', 'p19'] },
    p10: { id: 10, name: 'Io', emoji: '🌋', desc: 'Volcanic moon with fiery Napa flows.', bonus: 1.30, unlocked: false, milestone: 150, color: '#ff6600', parents: ['p5'], children: ['p20', 'p21'] },
    p11: { id: 11, name: 'Europa', emoji: '🧊', desc: 'Icy moon with hidden Napa oceans.', bonus: 1.28, unlocked: false, milestone: 145, color: '#aaccff', parents: ['p5'], children: ['p22', 'p23'] },
    p12: { id: 12, name: 'Titan', emoji: '🌫️', desc: 'Methane-rich moon with dense Napa atmosphere.', bonus: 1.26, unlocked: false, milestone: 140, color: '#ff9944', parents: ['p6'], children: ['p24', 'p25'] },
    p13: { id: 13, name: 'Enceladus', emoji: '✨', desc: 'Shimmering ice moon with Napa geysers.', bonus: 1.24, unlocked: false, milestone: 135, color: '#ffffff', parents: ['p6'], children: [] },
    p14: { id: 14, name: 'Triton', emoji: '❄️', desc: 'Icy moon with frozen Napa methane.', bonus: 1.40, unlocked: false, milestone: 155, color: '#4488ff', parents: ['p7'], children: [] },
    p15: { id: 15, name: 'Oberon', emoji: '🌑', desc: 'Dark moon with mysterious Napa forces.', bonus: 1.38, unlocked: false, milestone: 160, color: '#333333', parents: ['p7'], children: [], isGoal: true }
};

// ===== PLANET-SPECIFIC UPGRADES =====
const planetUpgrades = {
    p1: [
        { id: 'earth-soil', name: '🌱 Rich Earth Soil', desc: 'Increases Napa yield from Earth soil by 10%', cost: 100, effect: 1.10, tier: 1, purchased: false },
        { id: 'earth-spring', name: '💧 Natural Spring', desc: 'Add irrigation system for +15% production', cost: 500, effect: 1.15, tier: 2, purchased: false },
        { id: 'earth-greenhouse', name: '🌿 Global Greenhouse', desc: 'Cover-all greenhouse magnifies growth by 25%', cost: 2000, effect: 1.25, tier: 3, purchased: false }
    ],
    p2: [
        { id: 'venus-heat', name: '🔥 Heat Harness', desc: 'Capture volcanic heat for +20% bonus', cost: 1000, effect: 1.20, tier: 1, purchased: false },
        { id: 'venus-shield', name: '🛡️ Heat Shield', desc: 'Advanced protection unlocks 30% more production', cost: 5000, effect: 1.30, tier: 2, purchased: false },
        { id: 'venus-reactor', name: '⚛️ Thermal Reactor', desc: 'Infinite thermal reactor boosts by 50%', cost: 20000, effect: 1.50, tier: 3, purchased: false }
    ],
    p3: [
        { id: 'mercury-speed', name: '⚡ Speed Catalyst', desc: 'Harness Mercury\'s speed for +18% boost', cost: 800, effect: 1.18, tier: 1, purchased: false },
        { id: 'mercury-orbit', name: '🌀 Orbital Sync', desc: 'Synchronize with orbit for +28% production', cost: 4000, effect: 1.28, tier: 2, purchased: false },
        { id: 'mercury-flux', name: '✨ Quantum Flux', desc: 'Tap quantum particles for 45% increase', cost: 18000, effect: 1.45, tier: 3, purchased: false }
    ],
    p4: [
        { id: 'mars-mining', name: '⛏️ Deep Mining', desc: 'Mine Mars core Napa deposits (+22%)', cost: 2000, effect: 1.22, tier: 1, purchased: false },
        { id: 'mars-colony', name: '🏗️ Colony Expansion', desc: 'Establish mega-colony for 35% bonus', cost: 8000, effect: 1.35, tier: 2, purchased: false }
    ],
    p5: [
        { id: 'jupiter-storm', name: '🌪️ Storm Alchemy', desc: 'Control Jupiter storms (+20% production)', cost: 1500, effect: 1.20, tier: 1, purchased: false },
        { id: 'jupiter-core', name: '💎 Core Tapping', desc: 'Access Jupiter core for 32% boost', cost: 6500, effect: 1.32, tier: 2, purchased: false }
    ],
    p8: [
        { id: 'neptune-ice', name: '❄️ Ice Compression', desc: 'Compress icy Napa for +25% production', cost: 5000, effect: 1.25, tier: 1, purchased: false },
        { id: 'neptune-abyss', name: '🌊 Abyss Dive', desc: 'Deep ocean mining yields 40% bonus', cost: 15000, effect: 1.40, tier: 2, purchased: false }
    ],
    p16: [
        { id: 'sun-photon', name: '☀️ Photon Harness', desc: 'Capture stellar photons (+30%)', cost: 8000, effect: 1.30, tier: 1, purchased: false },
        { id: 'sun-fusion', name: '⚛️ Fusion Core', desc: 'Miniature fusion reactor (50% boost)', cost: 30000, effect: 1.50, tier: 2, purchased: false }
    ],
    p25: [
        { id: 'antares-supernova', name: '🔥 Supernova Chain', desc: 'Channel supernova energy (+40%)', cost: 15000, effect: 1.40, tier: 1, purchased: false },
        { id: 'antares-singularity', name: '🔯 Micro-Singularity', desc: 'Create controlled black hole (60% boost)', cost: 50000, effect: 1.60, tier: 2, purchased: false }
    ],
    p50: [
        { id: 'napa-ascension', name: '👑 Napa Ascension', desc: 'Ultimate transformation unlocked!', cost: 0, effect: 2.0, tier: 5, purchased: false },
        { id: 'napa-omnipotence', name: '🍜 Omnipotent Napa', desc: 'All-consuming Napa power (100% bonus)', cost: 0, effect: 2.0, tier: 5, purchased: false }
    ]
};

// ===== PLANET-SPECIFIC ACHIEVEMENTS =====
const planetAchievements = {
    p1: [
        { id: 'earth-born', name: '🌍 Earthling', desc: 'Reach level 5 on Earth', condition: 'level >= 5 && currentPlanet === "p1"', earned: false },
        { id: 'earth-master', name: '🌎 Terraformer', desc: 'Spend 50,000 napas on Earth upgrades', condition: 'custom', earned: false }
    ],
    p2: [
        { id: 'venus-traveler', name: '🔥 Fire Seeker', desc: 'Reach Venus and survive the heat', condition: 'currentPlanet === "p2" && level >= 10', earned: false }
    ],
    p5: [
        { id: 'jupiter-storm-rider', name: '🌀 Storm Rider', desc: 'Reach Jupiter and collect 1 million napas', condition: 'currentPlanet === "p5" && totalNapas >= 1000000', earned: false }
    ],
    p8: [
        { id: 'neptune-explorer', name: '🌊 Deep Diver', desc: 'Reach Neptune, the distant water world', condition: 'currentPlanet === "p8" && level >= 55', earned: false }
    ],
    p16: [
        { id: 'sun-pilgrim', name: '☀️ Solar Pilgrim', desc: 'Stand on the Sun itself', condition: 'currentPlanet === "p16" && level >= 80', earned: false }
    ],
    p25: [
        { id: 'antares-champion', name: '🔥 Red Giant Champion', desc: 'Reach the magnificent Antares', condition: 'currentPlanet === "p25" && level >= 95', earned: false }
    ],
    p50: [
        { id: 'napa-legend', name: '🍜 NAPA LEGEND', desc: 'Reach the legendary NAPA PLANET', condition: 'currentPlanet === "p50"', earned: false },
        { id: 'napa-master', name: '👑 Napa Emperor', desc: 'Complete all planet achievements', condition: 'totalAchievements === 50', earned: false }
    ]
};

let easterEggsTrigger = {
    konami: [],
    clicked25x: false,
    clickedImage50x: false,
    prestiged20x: false,
    reachedLevel100: false
};

function processRedeemCode(code) {
    const normalizedCode = code.toLowerCase().trim();
    
    if (!redeemCodes[normalizedCode]) {
        showRedeemMessage('Invalid code! Try again.', 'error');
        return;
    }
    
    const codeData = redeemCodes[normalizedCode];
    let message = codeData.message;
    
    switch (codeData.reward) {
        case 'napas':
            napas += codeData.amount;
            totalNapas += codeData.amount;
            message += ` +${formatNumber(codeData.amount)} Napas!`;
            break;
        case 'prestige':
            prestigeLevel += codeData.amount;
            prestigeMultiplier += codeData.amount * 0.18;
            message += ` +${codeData.amount} Prestige level!`;
            break;
        case 'level':
            level += codeData.amount;
            xpToNextLevel = calculateXpToNextLevel(level);
            message += ` +${codeData.amount} Levels!`;
            break;
        case 'napasPerSecond':
            napasPerSecond += codeData.amount;
            message += ` +${codeData.amount} Napas/sec production!`;
            break;
        case 'multiplier':
            prestigeMultiplier += codeData.amount;
            message += ` +${codeData.amount.toFixed(2)}x multiplier!`;
            break;
    }
    
    // Delete the code so it can't be reused
    delete redeemCodes[normalizedCode];
    
    awardAchievement(`Redeemed: ${message}`);
    showRedeemMessage(`✨ ${message}`, 'success');
    playSuccessSound();
    createFloatingElement('🎁', false, mainDiv.getBoundingClientRect().width / 2, 100);
    updateDisplays();
}

function showRedeemMessage(text, type) {
    const msgEl = document.getElementById('redeem-message');
    msgEl.textContent = text;
    msgEl.className = type;
    msgEl.style.display = 'block';
    
    setTimeout(() => {
        msgEl.style.display = 'none';
    }, 3000);
}

function showPlanetMap() {
    const checkMilestone = (planet) => {
        return level >= planet.milestone;
    };
    
    // Auto-unlock planets based on milestone
    Object.keys(planets).forEach(key => {
        if (checkMilestone(planets[key]) && !planets[key].unlocked) {
            planets[key].unlocked = true;
            if (!planetsUnlocked.includes(key)) {
                planetsUnlocked.push(key);
                const isGoal = planets[key].isGoal;
                createNotification(`${isGoal ? '🎉' : '🌌'} New planet unlocked: ${planets[key].name}!${isGoal ? ' YOU REACHED THE GOAL!' : ''}`, 'success');
                if (isGoal) {
                    // Add special celebration
                    for (let i = 0; i < 15; i++) {
                        setTimeout(() => createFloatingElement(['🍜', '✨', '🎉'][Math.floor(Math.random() * 3)]), i * 50);
                    }
                }
            }
        }
    });
    
    const mapContainer = document.getElementById('planet-map');
    mapContainer.innerHTML = '';
    
    // Build tree structure by levels
    const treeStructure = buildPlanetTree();
    
    // Render tree
    treeStructure.forEach((level, levelIndex) => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'planet-tree-level';
        
        level.forEach(key => {
            const planet = planets[key];
            const node = document.createElement('div');
            node.className = 'planet-node';
            
            // Special styling for NAPA PLANET
            if (planet.isGoal) {
                if (planet.unlocked) {
                    node.classList.add('napa-planet-achieved');
                } else {
                    node.classList.add('napa-planet-node');
                }
            }
            
            node.style.borderColor = planet.color + '60';
            node.style.backgroundColor = planet.color + '20';
            
            if (key === currentPlanet) {
                node.classList.add('current');
                node.style.borderColor = planet.color + 'ff';
                node.style.boxShadow = `0 0 20px ${planet.color}80`;
            } else if (planet.unlocked) {
                node.classList.add('unlocked');
            } else {
                node.classList.add('locked');
            }
            
            node.innerHTML = `
                <div class="planet-emoji">${planet.emoji}</div>
                <div class="planet-name">${planet.name}</div>
                <div class="planet-number">Lvl ${planet.milestone}</div>
            `;
            
            // Add hover tooltip showing requirements
            node.addEventListener('mouseenter', (e) => {
                showPlanetTooltip(key, e);
            });
            
            node.addEventListener('mouseleave', () => {
                hidePlanetTooltip();
            });
            
            // Click to show detailed statistics and upgrades
            node.addEventListener('click', () => {
                showPlanetDetailedStats(key);
            });
            
            levelDiv.appendChild(node);
        });
        
        mapContainer.appendChild(levelDiv);
    });
}

function buildPlanetTree() {
    // Create tree levels starting from p1
    const levels = [];
    const visited = new Set();
    const currentLevel = ['p1'];
    visited.add('p1');
    
    while (currentLevel.length > 0) {
        levels.push([...currentLevel]);
        const nextLevel = [];
        
        currentLevel.forEach(key => {
            const planet = planets[key];
            if (planet.children && planet.children.length > 0) {
                planet.children.forEach(childKey => {
                    if (!visited.has(childKey)) {
                        nextLevel.push(childKey);
                        visited.add(childKey);
                    }
                });
            }
        });
        
        if (nextLevel.length === 0) break;
        currentLevel.length = 0;
        currentLevel.push(...nextLevel);
    }
    
    return levels;
}

function showPlanetInfo(key) {
    const planet = planets[key];
    const infoDiv = document.getElementById('planet-info');
    const nameEl = document.getElementById('planet-name');
    const descEl = document.getElementById('planet-desc');
    const statsEl = document.getElementById('planet-stats');
    const inhabitBtn = document.getElementById('inhabit-button');
    
    // Apply planet-specific styling
    const planetPanel = document.querySelector('.planet-panel');
    planetPanel.style.borderColor = planet.color + '80';
    planetPanel.style.background = `linear-gradient(135deg, ${planet.color}15, ${planet.color}05)`;
    
    nameEl.textContent = `${planet.emoji} ${planet.name}`;
    nameEl.style.color = planet.color;
    descEl.textContent = planet.desc;
    descEl.style.color = planet.color + 'dd';
    
    const bonusPercent = Math.round((planet.bonus - 1) * 100);
    statsEl.innerHTML = `
        <div style="padding: 12px; background: ${planet.color}22; border-radius: 8px; margin: 12px 0;">
            <div style="margin: 8px 0;"><strong>Bonus Multiplier:</strong> <span style="color: ${planet.color}; font-weight: bold;">${planet.bonus.toFixed(2)}x ${bonusPercent > 0 ? '+' + bonusPercent + '%' : ''}</span></div>
            <div style="margin: 8px 0;"><strong>Planet Level Requirement:</strong> <span style="color: ${planet.color};">${planet.milestone}</span></div>
            <div style="margin: 8px 0;"><strong>Your Level:</strong> <span style="color: ${level >= planet.milestone ? '#00ff00' : '#ff4444'};">${level}</span></div>
            ${planet.isGoal ? `<div style="margin: 12px 0; padding: 12px; background: ${planet.color}44; border-radius: 8px; text-align: center; font-weight: bold; color: #ffff00;">🎉 THIS IS THE LEGENDARY NAPA PLANET! 🎉</div>` : ''}
        </div>
    `;
    
    if (key === currentPlanet) {
        inhabitBtn.textContent = '✓ Current Location';
        inhabitBtn.disabled = true;
        inhabitBtn.style.background = '#44ff4480';
    } else if (planet.unlocked) {
        inhabitBtn.textContent = `Inhabit ${planet.name}`;
        inhabitBtn.disabled = false;
        inhabitBtn.style.background = `linear-gradient(135deg, ${planet.color}, ${planet.color}dd)`;
        inhabitBtn.onclick = () => inhabitPlanet(key);
    } else {
        inhabitBtn.textContent = `Locked (Need Level ${planet.milestone})`;
        inhabitBtn.disabled = true;
        inhabitBtn.style.background = '#66666680';
    }
    
    infoDiv.classList.remove('hidden');
}

function inhabitPlanet(key) {
    const planet = planets[key];
    const oldPlanet = planets[currentPlanet];
    const oldBonus = oldPlanet ? oldPlanet.bonus : 1;
    
    currentPlanet = key;
    const planetEl = document.getElementById('currentPlanet');
    if (planetEl) {
        const bonusText = planet.bonus > 1 ? ` (+${Math.round((planet.bonus - 1) * 100)}%)` : '';
        planetEl.textContent = `${planet.emoji} ${planet.name}${bonusText}`;
    }
    
    // Apply planet bonus
    napasPerSecond = napasPerSecond / oldBonus * planet.bonus;
    
    const bonusPercent = Math.round((planet.bonus - 1) * 100);
    const message = planet.isGoal 
        ? `🎉 YOU HAVE INHABITED THE LEGENDARY NAPA PLANET! 🎉 The ultimate journey is complete!`
        : `✨ You have inhabited ${planet.name}! +${bonusPercent}% production bonus!`;
    
    createNotification(message, 'success');
    playSuccessSound();
    createFloatingElement(planet.emoji, false, mainDiv.getBoundingClientRect().width / 2, 150);
    updateDisplays();
    showPlanetMap();
    
    // Special celebration if NAPA PLANET reached
    if (planet.isGoal) {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createFloatingElement(['🍜', '✨', '🎉', '👑'][Math.floor(Math.random() * 4)]), i * 40);
        }
    }
    
    // Check planet-specific achievements
    checkPlanetAchievements(key);
}

// ===== ADVANCED PLANET SYSTEM: TOOLTIPS & STATISTICS =====

function showPlanetTooltip(planetKey, mouseEvent) {
    const planet = planets[planetKey];
    const tooltip = document.getElementById('planet-tooltip');
    
    const parentNames = planet.parents.map(p => planets[p].name).join(', ') || 'None';
    const children = planet.children.length > 0 ? planet.children.map(p => planets[p].name).join(', ') : 'None';
    
    // Calculate production for this planet
    const levelMult = 1 + (level || 1) * 0.02;
    const production = napasPerSecond * planet.bonus * levelMult;
    
    const html = `
        <div class="tooltip-title">${planet.emoji} ${planet.name}</div>
        <div class="tooltip-stat"><strong>ID:</strong> P${planet.id}</div>
        <div class="tooltip-stat"><strong>Requirement:</strong> Level ${planet.milestone}</div>
        <div class="tooltip-stat" style="color: ${planet.color}; font-weight: bold;"><strong>Bonus:</strong> ${(planet.bonus * 100).toFixed(0)}% (+${((planet.bonus - 1) * 100).toFixed(1)}%)</div>
        <div class="tooltip-stat"><strong>Current Status:</strong> ${level >= planet.milestone ? '✅ Unlocked' : `🔒 Need Level ${planet.milestone - level}`}</div>
        <div class="tooltip-stat"><strong>Est. Production:</strong> ${production.toFixed(1)}/sec</div>
        <div class="tooltip-divider"></div>
        <div class="tooltip-stat"><strong>Parents:</strong> ${parentNames}</div>
        <div class="tooltip-stat"><strong>Children:</strong> ${children}</div>
        <div class="tooltip-stat" style="text-align: center; margin-top: 8px; font-size: 0.9em; color: #ffff00;">💡 Click to see detailed stats</div>
    `;
    
    tooltip.innerHTML = html;
    tooltip.classList.remove('hidden');
    
    // Position tooltip near mouse
    const x = mouseEvent.pageX + 10;
    const y = mouseEvent.pageY + 10;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function hidePlanetTooltip() {
    const tooltip = document.getElementById('planet-tooltip');
    tooltip.classList.add('hidden');
}

function showPlanetDetailedStats(planetKey) {
    const planet = planets[planetKey];
    const modal = document.getElementById('planet-stats-modal');
    const titleEl = document.getElementById('stats-planet-title');
    const mainEl = document.getElementById('stats-main');
    const upgradesEl = document.getElementById('stats-upgrades');
    const achievementsEl = document.getElementById('stats-achievements');
    
    titleEl.textContent = `${planet.emoji} ${planet.name} - Advanced Statistics`;
    
    // Main stats section
    const levelMult = 1 + (level || 1) * 0.02;
    const production = napasPerSecond * planet.bonus * levelMult;
    const parentNames = planet.parents.map(p => planets[p].name).join(', ') || 'Starting planet';
    const childNames = planet.children.length > 0 ? planet.children.map(p => planets[p].name).join(', ') : 'Dead end';
    
    mainEl.innerHTML = `
        <div class="stats-section">
            <h4 style="color: ${planet.color};">📊 Core Statistics</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">Name</div>
                    <div class="stat-value">${planet.name}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Planet ID</div>
                    <div class="stat-value">P${planet.id}/50</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Requirement</div>
                    <div class="stat-value ${level >= planet.milestone ? 'unlocked' : 'locked'}">Level ${planet.milestone}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Bonus Multiplier</div>
                    <div class="stat-value" style="color: ${planet.color}; font-weight: bold;">${(planet.bonus).toFixed(2)}x</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Production Here</div>
                    <div class="stat-value">${production.toFixed(2)} napas/sec</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Status</div>
                    <div class="stat-value">
                        ${currentPlanet === planetKey ? '🌍 HOME PLANET' : (planet.unlocked ? '✅ Unlocked' : '🔒 Locked')}
                    </div>
                </div>
            </div>
            <div class="stat-description">${planet.desc}</div>
            <div class="stat-hierarchy">
                <strong style="color: ${planet.color};">🔗 Planet Hierarchy:</strong><br>
                <span>← ${parentNames}</span><br>
                <span>→ ${childNames}</span>
            </div>
        </div>
    `;
    
    // Upgrades section
    const upgrades = planetUpgrades[planetKey] || [];
    let upgradesHTML = `<div class="stats-section"><h4 style="color: ${planet.color};">⚙️ Planet Upgrades (${upgrades.length})</h4>`;
    if (upgrades.length === 0) {
        upgradesHTML += `<p style="color: #888;">No upgrades available for this planet.</p>`;
    } else {
        upgrades.forEach(upgrade => {
            const canAfford = napas >= upgrade.cost;
            upgradesHTML += `
                <div class="upgrade-item ${upgrade.purchased ? 'purchased' : ''} ${!canAfford && !upgrade.purchased ? 'expensive' : ''}">
                    <div class="upgrade-header">
                        <span class="upgrade-name">${upgrade.name}</span>
                        <span class="upgrade-tier">Tier ${upgrade.tier}</span>
                    </div>
                    <div class="upgrade-desc">${upgrade.desc}</div>
                    <div class="upgrade-stats">
                        <span class="upgrade-cost" style="color: ${canAfford || upgrade.purchased ? planet.color : '#ff4444'};">
                            ${upgrade.purchased ? '✅ OWNED' : upgrade.cost + ' napas'}
                        </span>
                        <span class="upgrade-bonus" style="color: ${planet.color};">+${((upgrade.effect - 1) * 100).toFixed(0)}% bonus</span>
                    </div>
                    ${!upgrade.purchased && level >= planet.milestone ? `
                        <button class="upgrade-button ${canAfford ? 'buyable' : 'expensive'}" 
                                onclick="purchasePlanetUpgrade('${planetKey}', '${upgrade.id}')"
                                ${!canAfford ? 'disabled' : ''}>
                            ${canAfford ? 'Purchase' : 'Too Expensive'}
                        </button>
                    ` : ''}
                </div>
            `;
        });
    }
    upgradesHTML += `</div>`;
    upgradesEl.innerHTML = upgradesHTML;
    
    // Achievements section
    const achievements = planetAchievements[planetKey] || [];
    let achievementsHTML = `<div class="stats-section"><h4 style="color: ${planet.color};">🏆 Planet Achievements (${achievements.length})</h4>`;
    if (achievements.length === 0) {
        achievementsHTML += `<p style="color: #888;">No achievements available.</p>`;
    } else {
        achievements.forEach(ach => {
            achievementsHTML += `
                <div class="achievement-item ${ach.earned ? 'earned' : 'locked'}">
                    <div class="achievement-content">
                        <span class="achievement-name">${ach.name}</span>
                        <span class="achievement-desc">${ach.desc}</span>
                    </div>
                    <span class="achievement-status">${ach.earned ? '🏆 EARNED' : '🔒 LOCKED'}</span>
                </div>
            `;
        });
    }
    achievementsHTML += `</div>`;
    achievementsEl.innerHTML = achievementsHTML;
    
    modal.classList.remove('hidden');
}

function hidePlanetDetailedStats() {
    const modal = document.getElementById('planet-stats-modal');
    modal.classList.add('hidden');
}

function purchasePlanetUpgrade(planetKey, upgradeId) {
    const upgrades = planetUpgrades[planetKey];
    const upgrade = upgrades.find(u => u.id === upgradeId);
    
    if (!upgrade) return;
    if (upgrade.purchased) {
        createNotification('You already own this upgrade!', 'error');
        return;
    }
    if (napas < upgrade.cost) {
        createNotification('Not enough Napas!', 'error');
        return;
    }
    
    napas -= upgrade.cost;
    upgrade.purchased = true;
    napasPerSecond *= upgrade.effect;
    
    createNotification(`🎉 Purchased ${upgrade.name}! +${((upgrade.effect - 1) * 100).toFixed(0)}% bonus!`, 'success');
    playSuccessSound();
    createFloatingElement('⭐', false, mainDiv.getBoundingClientRect().width / 2, 150);
    
    saveGameState();
    updateDisplays();
    showPlanetDetailedStats(planetKey);
}

function checkPlanetAchievements(planetKey) {
    const achievements = planetAchievements[planetKey];
    if (!achievements) return;
    
    achievements.forEach(ach => {
        if (ach.earned) return; // Already earned
        
        let condition = false;
        if (ach.condition === 'custom') {
            // Handle custom conditions
            condition = false; // Implement as needed
        } else {
            // Evaluate condition
            condition = eval(ach.condition.replace(/currentPlanet/g, `'${currentPlanet}'`));
        }
        
        if (condition) {
            ach.earned = true;
            createNotification(`🏆 Achievement Unlocked: ${ach.name}!`, 'achievement');
            playSuccessSound();
            saveGameState();
        }
    });
}

// ===== EASTER EGGS =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function checkKonamiCode() {
    document.addEventListener('keydown', (e) => {
        easterEggsTrigger.konami.push(e.key);
        if (easterEggsTrigger.konami.length > 10) easterEggsTrigger.konami.shift();
        
        if (easterEggsTrigger.konami.join(',') === konamiCode.join(',')) {
            triggerKonamiEasterEgg();
        }
    });
}

function triggerKonamiEasterEgg() {
    const mainEl = document.getElementById('main');
    mainEl.classList.add('easter-egg-triggered');
    napas += 1000000;
    totalNapas += 1000000;
    createNotification('🎮 KONAMI CODE ACTIVATED! +1M Napas!', 'success');
    playSuccessSound();
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingElement(['🎮', '⭐', '💫'][Math.floor(Math.random() * 3)]);
        }, i * 50);
    }
    updateDisplays();
}

function checkClickMilestones() {
    if (totalClicks === 25 && !easterEggsTrigger.clicked25x) {
        easterEggsTrigger.clicked25x = true;
        createNotification('🎯 25 clicks! You are persistent!', 'success');
        napas += 500;
        totalNapas += 500;
    }
    
    if (totalClicks === 100 && easterEggsTrigger.clicked25x && !easterEggsTrigger.clicked100x) {
        easterEggsTrigger.clicked100x = true;
        createNotification('🎯 100 clicks! Master clicker title earned!', 'success');
        napas += 5000;
        totalNapas += 5000;
    }
    
    if (level === 100 && !easterEggsTrigger.reachedLevel100) {
        easterEggsTrigger.reachedLevel100 = true;
        createNotification('🌟 LEVEL 100 ACHIEVED! You are a Napa legend!', 'success');
        napas += 500000;
        totalNapas += 500000;
        createFloatingElement('👑');
    }
    
    if (totalPrestiges === 20 && !easterEggsTrigger.prestiged20x) {
        easterEggsTrigger.prestiged20x = true;
        createNotification('👑 20 Prestiges! Ultimate power unlocked!', 'success');
        napas += 1000000;
        totalNapas += 1000000;
    }
}

// Random secret chance of big reward
function checkSecretBonus() {
    if (Math.random() < 0.00001) {
        const bonus = Math.floor(getCurrentRate() * 1000) + 10000;
        napas += bonus;
        totalNapas += bonus;
        createNotification(`🌟 SECRET BONUS! +${formatNumber(bonus)} Napas!`, 'success');
        createFloatingElement('✨');
        for (let i = 0; i < 10; i++) {
            setTimeout(() => createFloatingElement('⭐'), i * 30);
        }
    }
}

// Load game state first
const hasLoadedGame = loadGameState();
loadSettings();
initStore();
initAchievements();
initMiniGame();
initTooltips();

// Ensure planets are properly initialized
Object.keys(planets).forEach(key => {
    if (key === 'p1' || planetsUnlocked.includes(key)) {
        planets[key].unlocked = true;
    }
});

// Initialize Redeem Code System
const redeemModal = document.getElementById('redeem-modal');
const redeemButton = document.getElementById('redeemButton');
const closeRedeemBtn = document.getElementById('closeRedeem');
const redeemInput = document.getElementById('redeem-input');
const redeemSubmitBtn = document.getElementById('redeem-submit');

redeemButton.addEventListener('click', () => {
    redeemModal.classList.remove('hidden');
    redeemInput.focus();
});

closeRedeemBtn.addEventListener('click', () => {
    redeemModal.classList.add('hidden');
    redeemInput.value = '';
});

redeemSubmitBtn.addEventListener('click', () => {
    if (redeemInput.value.trim()) {
        processRedeemCode(redeemInput.value);
        redeemInput.value = '';
    }
});

redeemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        redeemSubmitBtn.click();
    }
});

// Initialize Planet System
const planetModal = document.getElementById('planet-modal');
const planetButton = document.getElementById('planetButton');
const closePlanetBtn = document.getElementById('closePlanet');

planetButton.addEventListener('click', () => {
    planetModal.classList.remove('hidden');
    showPlanetMap();
});

closePlanetBtn.addEventListener('click', () => {
    planetModal.classList.add('hidden');
});

// Close button for Stats Modal
const closeStatsBtn = document.getElementById('closeStats');
const statsModal = document.getElementById('planet-stats-modal');
if (closeStatsBtn && statsModal) {
    closeStatsBtn.addEventListener('click', () => {
        hidePlanetDetailedStats();
    });
}

// Initialize Konami Code Easter Egg
checkKonamiCode();

// Page Visibility API - detect when tab becomes hidden/visible
document.addEventListener('visibilitychange', handlePageVisibilityChange);

// Also handle when window is about to close
window.addEventListener('beforeunload', () => {
    saveGameState();
});

updateDisplays();
if (musicEnabled) initBackgroundMusic();
setInterval(mainLoop, 1000);

// Register Service Worker for background production
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(registration => {
        console.log('Service Worker registered successfully');
        // Request periodic background sync every 30 seconds
        if ('periodicSync' in registration) {
            registration.periodicSync.register('sync-production', {
                minInterval: 30 * 1000 // 30 seconds
            }).catch(() => console.log('Periodic sync not available'));
        }
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}
