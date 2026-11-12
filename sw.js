const CACHE_NAME = 'nav-calculator-v1.3';

const FILES_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',

    // JavaScript
    './js/calculator.js',
    './js/skin-selector.js',

    // CSS
    './css/skin-selector.css',

    // Skins
    './skins/skins.css',
    './skins/skin-amiga.css',
    './skins/skin-apollo.css',
    './skins/skin-braun.css',
    './skins/skin-casio-databank.css',
    './skins/skin-casio.css',
    './skins/skin-commodore-pet.css',
    './skins/skin-commodore.css',
    './skins/skin-expanse.css',
    './skins/skin-gameboy.css',
    './skins/skin-hp.css',
    './skins/skin-macintosh.css',
    './skins/skin-matrix.css',
    './skins/skin-msdos.css',
    './skins/skin-nasa.css',
    './skins/skin-orange.css',
    './skins/skin-retro70.css',
    './skins/skin-spectrum.css',
    './skins/skin-startrek.css',
    './skins/skin-synthwave.css',
    './skins/skin-terminal.css',
    './skins/skin-texas.css',
    './skins/skin-tr808.css',
    './skins/skin-windows95.css',
    './skins/skin-xwing.css',

    // Fonts
    './fonts/C64_Pro-STYLE.woff2',
    './fonts/casio-calculator-font.otf',
    './fonts/DSEG14Modern-Regular.woff2',
    './fonts/DSEG7Classic-Regular.woff2',
    './fonts/Early GameBoy.ttf',
    './fonts/Monoton-Regular.ttf',
    './fonts/ti-83-plus-large.ttf',
    './fonts/Topaz_a500_v1.0.ttf',
    './fonts/ZXSpectrum.ttf',

    // Icons
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});