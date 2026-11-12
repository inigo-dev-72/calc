// =========================================================
// CALCULATOR MUSEUM
// =========================================================

const skins = [
    'skin-terminal.css',
    'skin-braun.css',
    'skin-casio.css',
    'skin-hp.css',
    'skin-spectrum.css',
    'skin-nasa.css',
    'skin-synthwave.css',
    'skin-texas.css',
    'skin-startrek.css',
    'skin-expanse.css',
    'skin-gameboy.css',
    'skin-windows95.css',
    'skin-matrix.css',
    'skin-macintosh.css',
    'skin-commodore.css',
    'skin-commodore-pet.css',
    'skin-retro70.css',
    'skin-msdos.css',
    'skin-orange.css',
    'skin-casio-databank.css',
    'skin-amiga.css',
    'skin-apollo.css',
    'skin-tr808.css',
    'skin-xwing.css',
    'skin-tron.css',
    'skin-nixie.css',
    'skin-nasa-mission-control.css',
    'skin-cyberpunk-2099.css',
];


// =========================================================
// MUSEUM INFORMATION
// =========================================================

const skinInfo = [

    {
        name: 'TERMINAL',
        year: '1980s',
        type: 'COMPUTER',
        accent: '#f5d000',
        background: '#111111',
        screen: '#050505'
    },

    {
        name: 'BRAUN ET66',
        year: '1987',
        type: 'CALCULATOR',
        accent: '#e6e3d8',
        background: '#333330',
        screen: '#181818'
    },

    {
        name: 'CASIO fx-82MS',
        year: '1990s',
        type: 'SCIENTIFIC',
        accent: '#202020',
        background: '#aaa99d',
        screen: '#7f806f'
    },

    {
        name: 'HP-12C',
        year: '1981',
        type: 'FINANCIAL',
        accent: '#d8b45a',
        background: '#292929',
        screen: '#111111'
    },

    {
        name: 'ZX SPECTRUM',
        year: '1982',
        type: 'COMPUTER',
        accent: '#ffffff',
        background: '#111111',
        screen: '#000000'
    },

    {
        name: 'NASA',
        year: '1960s—70s',
        type: 'SPACE PROGRAM',
        accent: '#ffb000',
        background: '#171717',
        screen: '#080808'
    },

    {
        name: 'SYNTHWAVE',
        year: '1984',
        type: 'RETRO FUTURE',
        accent: '#ff2e92',
        background: '#120018',
        screen: '#05000a'
    },

    {
        name: 'TEXAS INSTRUMENTS',
        year: '1976',
        type: 'SCIENTIFIC',
        accent: '#f2eee2',
        background: '#30302d',
        screen: '#151515'
    },

    {
        name: 'STAR TREK',
        year: '1966',
        type: 'STARFLEET',
        accent: '#63d7d2',
        background: '#081214',
        screen: '#020707'
    },

    {
        name: 'THE EXPANSE',
        year: '24th CENTURY',
        type: 'SPACESHIP',
        accent: '#63d7d2',
        background: '#101516',
        screen: '#050909'
    },

    {
        name: 'GAME BOY',
        year: '1989',
        type: 'HANDHELD',
        accent: '#d8e4a8',
        background: '#8b956b',
        screen: '#9bbc0f'
    },

    {
        name: 'WINDOWS 95',
        year: '1995',
        type: 'PERSONAL COMPUTER',
        accent: '#000080',
        background: '#c0c0c0',
        screen: '#ffffff'
    },

    {
        name: 'MATRIX',
        year: '1999',
        type: 'COMPUTER',
        accent: '#00ff41',
        background: '#000800',
        screen: '#000500'
    },

    {
        name: 'MACINTOSH',
        year: '1984',
        type: 'PERSONAL COMPUTER',
        accent: '#444444',
        background: '#c6c6c6',
        screen: '#eeeeee'
    },

    {
        name: 'COMMODORE 64',
        year: '1982',
        type: 'COMPUTER',
        accent: '#9f9fca',
        background: '#403b70',
        screen: '#211e48'
    },

    {
        name: 'COMMODORE PET',
        year: '1977',
        type: 'COMPUTER',
        accent: '#eeeeee',
        background: '#555555',
        screen: '#111111'
    },

    {
        name: 'RETRO 70',
        year: '1974',
        type: 'CALCULATOR',
        accent: '#e2d0ad',
        background: '#5b4632',
        screen: '#2a2119'
    },

    {
        name: 'MS-DOS',
        year: '1981',
        type: 'COMPUTER',
        accent: '#ffffff',
        background: '#000080',
        screen: '#000000'
    },

    {
        name: 'ORANGE 74',
        year: '1974',
        type: 'CALCULATOR',
        accent: '#f5d49a',
        background: '#9b3d0d',
        screen: '#3b1607'
    },

    {
        name: 'CASIO DATABANK',
        year: '1980s',
        type: 'DIGITAL WATCH',
        accent: '#252725',
        background: '#aaa99d',
        screen: '#77786c'
    },

    {
        name: 'AMIGA 500',
        year: '1987',
        type: 'COMPUTER',
        accent: '#eeeeee',
        background: '#aaaaaa',
        screen: '#eeeeee'
    },

    {
        name: 'APOLLO DSKY',
        year: '1969',
        type: 'SPACECRAFT',
        accent: '#63f36b',
        background: '#242422',
        screen: '#061006'
    },

    {
        name: 'ROLAND TR-808',
        year: '1980',
        type: 'RHYTHM COMPOSER',
        accent: '#e65f29',
        background: '#aaa79d',
        screen: '#211f1a'
    },

    {
        name: 'X-WING NAV COMPUTER',
        year: '1977',
        type: 'SPACECRAFT',
        accent: '#a9e6c7',
        background: '#252928',
        screen: '#07110f'
    },

    {
        name: 'TRON SCIENTIFIC COMPUTER',
        year: '1982',
        type: 'DIGITAL SYSTEM',
        accent: '#00eaff',
        background: '#030608',
        screen: '#020506'
    },

    {
        name: 'NIXIE TUBE',
        year: '1960',
        type: 'ELECTRONIC INSTRUMENT',
        accent: '#ff8a24',
        background: '#1d1c19',
        screen: '#0c0806'
    },

    {
        name: 'NASA MISSION CONTROL',
        year: '1969',
        type: 'MISSION CONTROL',
        accent: '#62e967',
        background: '#292b28',
        screen: '#061006'
    },

    {
        name: 'CYBERPUNK 2099',
        year: '2099',
        type: 'FUTURE SYSTEM',
        accent: '#21e1ff',
        background: '#030306',
        screen: '#06050b'
    },
];

const SKIN_STORAGE_KEY = 'calculator-skin';

let currentSkin = 0;


// =========================================================
// APPLY SKIN
// =========================================================

function applySkin() {

    const skinElement = document.getElementById(SKIN_STORAGE_KEY);

    if (!skinElement) {
        return;
    }

    skinElement.href = 'skins/' + skins[currentSkin];

    updateSkinSelector();
}


// =========================================================
// SELECT SKIN
// =========================================================

function selectSkin(index) {

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= skins.length
    ) {
        return;
    }

    currentSkin = index;

    localStorage.setItem(
        SKIN_STORAGE_KEY,
        currentSkin
    );

    applySkin();

    closeSkinSelector();
}


// =========================================================
// OPEN MUSEUM
// =========================================================

function openSkinSelector() {

    const modal = document.getElementById('skin-selector-modal');

    if (!modal) {
        return;
    }

    modal.classList.add('visible');

    updateSkinSelector();
}


// =========================================================
// CLOSE MUSEUM
// =========================================================

function closeSkinSelector() {

    const modal = document.getElementById('skin-selector-modal');

    modal.classList.remove('visible');
}


// =========================================================
// BUILD MUSEUM
// =========================================================

function buildSkinSelector() {

    const list = document.getElementById('skin-list');

    if (!list) {
        return;
    }

    list.innerHTML = '';

    [...skinInfo.keys()]
    .sort((a, b) => skinInfo[a].name.localeCompare(skinInfo[b].name))
    .forEach(index => {

        const info = skinInfo[index];

        const card = document.createElement('button');

        card.className = 'skin-card skin-' + index;

        card.dataset.style = index;

        card.style.setProperty(
            '--skin-accent',
            info.accent
        );

        card.style.setProperty(
            '--skin-background',
            info.background
        );

        card.style.setProperty(
            '--skin-screen',
            info.screen
        );

        card.innerHTML = `

            <div class="museum-machine">

                <div class="museum-display">

                    <span class="museum-expression">
                        cos(40)
                    </span>

                    <span class="museum-value">
                        0.766044
                    </span>

                </div>

                <div class="museum-controls">

                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>

                </div>

            </div>

            <div class="skin-card-caption">

                <span class="skin-card-name">
                    ${info.name}
                </span>

                <span class="skin-card-year">
                    ${info.year}
                </span>

            </div>
        `;

        card.onclick = () => {
            selectSkin(index);
        };

        list.appendChild(card);
    });

    updateSkinSelector();
}


// =========================================================
// UPDATE CURRENT SKIN
// =========================================================

function updateSkinSelector() {

    document
        .querySelectorAll('.skin-card')
        .forEach(card => {

            const index =Number(card.dataset.style);

            card.classList.toggle('active', index === currentSkin);
        });
}


// =========================================================
// LOAD SAVED SKIN
// =========================================================

function loadSavedSkin() {

    const savedStyle = localStorage.getItem(SKIN_STORAGE_KEY);

    if (savedStyle !== null) {

        const index = Number(savedStyle);

        if (Number.isInteger(index) && index >= 0 && index < skins.length) {
            currentSkin = index;
        }
    }

    applySkin();
}


// =========================================================
// KEYBOARD
// =========================================================

document.addEventListener('keydown', event => {

    if (event.key === 'Escape') {
        closeSkinSelector();
    }
});


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    loadSavedSkin();

    buildSkinSelector();

    const display = document.querySelector('.display');

    if (display) {
        display.addEventListener('click', openSkinSelector);
    }

    document.getElementById('skin-selector-close').addEventListener('click', () => {
        closeSkinSelector();
    });

});