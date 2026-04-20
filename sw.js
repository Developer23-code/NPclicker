// Napa Clicker Service Worker
// Enables background production even when the app is fully closed

const CACHE_NAME = 'napa-clicker-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    event.waitUntil(clients.claim());
});

// Background sync for production
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-production') {
        event.waitUntil(syncProduction());
    }
});

async function syncProduction() {
    try {
        // Open IndexedDB or localStorage
        const gameData = await getGameData();
        if (gameData && gameData.napasPerSecond > 0) {
            const now = Date.now();
            const timeSince = (now - gameData.lastOfflineProductionTime) / 1000;
            
            if (timeSince > 1) {
                // Calculate production
                const currentPlanet = gameData.planets?.[gameData.currentPlanet] || gameData.planets?.earth || { bonus: 1 };
                const planetBonus = currentPlanet.bonus || 1;
                const levelMultiplier = 1 + (gameData.level || 1) * 0.02;
                const production = timeSince * gameData.napasPerSecond * (gameData.prestigeMultiplier || 1) * planetBonus * levelMultiplier;
                
                // Update game data
                gameData.napas = (gameData.napas || 0) + production;
                gameData.totalNapas = (gameData.totalNapas || 0) + production;
                gameData.lastOfflineProductionTime = now;
                
                // Save back
                await saveGameData(gameData);
            }
        }
    } catch (error) {
        console.error('Background sync error:', error);
    }
}

async function getGameData() {
    return new Promise((resolve) => {
        const request = indexedDB.open('NapaClicker', 1);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['gameState']);
            const objectStore = transaction.objectStore('gameState');
            const getRequest = objectStore.get('current');
            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            };
        };
        request.onerror = () => {
            resolve(null);
        };
    });
}

async function saveGameData(data) {
    return new Promise((resolve) => {
        const request = indexedDB.open('NapaClicker', 1);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['gameState'], 'readwrite');
            const objectStore = transaction.objectStore('gameState');
            objectStore.put(data, 'current');
            transaction.oncomplete = () => resolve(true);
        };
        request.onerror = () => {
            resolve(false);
        };
    });
}
