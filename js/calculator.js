/*
 * calculator.js
 *
 * Calculadora angular estilo Casio FX-82MS
 *
 * PRINCIPIOS:
 *
 * 1. Mientras escribimos:
 *      value = expresión actual
 *
 * 2. Solo "=" evalúa la expresión.
 *
 * 3. expression conserva el último cálculo.
 *
 * 4. ANS contiene el último resultado.
 *
 * 5. DEG = unidad angular en grados.
 *
 * 6. El botón °′″ construye progresivamente
 *    un valor DMS:
 *
 *      40              -> 40°
 *      40 + 12         -> 40°12′
 *      40°12′ + 30     -> 40°12′30″
 *
 *    También convierte automáticamente:
 *
 *      40.4 -> 40°24′
 *
 * 7. Internamente los valores DMS se convierten
 *    a grados decimales para realizar cálculos.
 */

// =========================================================
// PWA
// =========================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js');
    });
}

// =========================================================
// ESTADO
// =========================================================

let angleMode = 'DEG';

let memory = [null, null, null, null, null, null];

let selectedMemory = 0;

let lastAnswer = 0;

let justCalculated = false;


// =========================================================
// LOCAL STORAGE
// =========================================================

const MEMORY_STORAGE_KEY = 'angleCalculatorMemory';
const ANSWER_STORAGE_KEY = 'angleCalculatorLastAnswer';


function loadPersistentData() {

    try {

        const savedMemory =
            localStorage.getItem(MEMORY_STORAGE_KEY);

        if (savedMemory !== null) {

            const parsedMemory =
                JSON.parse(savedMemory);

            if (
                Array.isArray(parsedMemory) &&
                parsedMemory.length === 6
            ) {
                memory = parsedMemory;
            }
        }

        const savedAnswer =
            localStorage.getItem(ANSWER_STORAGE_KEY);

        if (savedAnswer !== null) {

            const parsedAnswer =
                Number(savedAnswer);

            if (Number.isFinite(parsedAnswer)) {
                lastAnswer = parsedAnswer;
            }
        }

    } catch (error) {

        console.warn(
            'No se pudieron cargar los datos guardados.',
            error
        );
    }
}


function saveMemory() {

    try {

        localStorage.setItem(
            MEMORY_STORAGE_KEY,
            JSON.stringify(memory)
        );

    } catch (error) {

        console.warn(
            'No se pudo guardar la memoria.',
            error
        );
    }
}


function saveLastAnswer() {

    try {

        if (
            lastAnswer !== null &&
            Number.isFinite(lastAnswer)
        ) {

            localStorage.setItem(
                ANSWER_STORAGE_KEY,
                String(lastAnswer)
            );
        }

    } catch (error) {

        console.warn(
            'No se pudo guardar ANS.',
            error
        );
    }
}


// =========================================================
// DISPLAY
// =========================================================

function scrollDisplayToRight(element) {

    if (!element) {
        return;
    }

    element.scrollLeft = element.scrollWidth;
}

function getValueElement() {
    return document.getElementById('value');
}


function getExpressionElement() {
    return document.getElementById('expression');
}

function getDecimalValueElement() {
    return document.getElementById('decimalValue');
}

function getValue() {
    return getValueElement().textContent;
}

function setValue(value) {

    const element = getValueElement();

    element.textContent = value;

    scrollDisplayToRight(element);
}

function setExpression(value) {

    const element = getExpressionElement();

    element.textContent = value;

    scrollDisplayToRight(element);
}

function setDecimalValue(value) {

    const element = getDecimalValueElement();

    element.textContent = value;

    scrollDisplayToRight(element);
}


// =========================================================
// NUEVA ENTRADA DESPUÉS DE =
// =========================================================

function startNewInputIfNeeded() {

    if (!justCalculated) {
        return;
    }

    setValue('');

    justCalculated = false;
}


// =========================================================
// INSERTAR TEXTO
// =========================================================

function insertText(text) {

    const operators = ['+', '−', '×', '÷'];

    /*
     * Después de calcular:
     *
     * 5 + 3 = 8
     *
     * Si pulsamos un operador:
     *
     * 8 +
     *
     * continuamos con el resultado.
     *
     * Si pulsamos un número, función, etc.,
     * empezamos una expresión nueva.
     */

    if (
        justCalculated &&
        operators.includes(text)
    ) {

        justCalculated = false;

    } else {

        startNewInputIfNeeded();
    }

    let value = getValue();

    /*
     * Después de 0 podemos escribir:
     *
     * 01 -> 1
     * 0.5 -> 0.5
     */

    if (value === '0') {

        if (text !== '.') {
            value = '';
        }
    }

    /*
     * Punto decimal.
     *
     * No permitimos:
     *
     * 12.3.4
     */

    if (text === '.') {

        const currentNumber =
            getCurrentNumber(value);

        if (currentNumber.includes('.')) {
            return;
        }
    }

    setValue(value + text);

    updateDecimalValue();
}


// =========================================================
// FUNCIONES
// =========================================================

function insertFunction(functionName) {

    startNewInputIfNeeded();

    const functions = [
        'sin',
        'cos',
        'tan',
        'asin',
        'acos',
        'atan',
        'log'
    ];

    if (!functions.includes(functionName)) {
        return;
    }

    let value = getValue();

    if (value === '0') {
        value = '';
    }

    /*
     * Si antes tenemos un número, una función o ANS,
     * permitimos multiplicación implícita:
     *
     * 2sin(
     * ANSsin(
     */

    if (needsImplicitMultiplicationBeforeFunction(value)) {
        value += '×';
    }

    setValue(value + functionName + '(');

    updateDecimalValue();
}


// =========================================================
// PI
// =========================================================

function insertConstant() {

    startNewInputIfNeeded();

    let value = getValue();

    if (value === '0') {
        value = '';
    }

    if (
        needsImplicitMultiplicationBeforeConstant(value)
    ) {

        value += '×';
    }

    setValue(value + 'π');

    updateDecimalValue();
}


// =========================================================
// ANSWER
// =========================================================

function insertAnswer() {

    startNewInputIfNeeded();

    let value = getValue();

    if (value === '0') {
        value = '';
    }

    if (
        needsImplicitMultiplicationBeforeConstant(value)
    ) {

        value += '×';
    }

    setValue(value + 'ANS');

    updateDecimalValue();
}

function insertSquareRoot() {
    startNewInputIfNeeded();

    const value = getValue();

    if (value === '0') {
        setValue('√(');
    } else {
        insertText('√(');
    }

    updateDecimalValue();
}

function insertSquare() {
    const value = getValue();

    if (!value || value === 'Error') {
        return;
    }

    setValue(value + '²');
    updateDecimalValue();
    justCalculated = false;
}

function insertLog() {
    startNewInputIfNeeded();
    insertFunction('log');
}

// =========================================================
// SIGNO
// =========================================================

function toggleSign() {

    startNewInputIfNeeded();

    const value = getValue();

    if (!value || value === '0') {
        return;
    }

    // Número simple
    if (/^-?\d+(?:\.\d+)?$/.test(value)) {

        if (value.startsWith('-')) {

            setValue(
                value.substring(1)
            );

        } else {

            setValue(
                '-' + value
            );
        }

        updateDecimalValue();

        return;
    }

    // Expresión completa
    setValue(
        '-(' +
        value +
        ')'
    );

    updateDecimalValue();
}

// 1/X
function reciprocal() {
    const value = getValue();

    if (!value || value === 'Error') {
        return;
    }

    setValue('1/(' + value + ')');

    updateDecimalValue();
    justCalculated = false;
}

// =========================================================
// BACKSPACE
// =========================================================

function backspace() {

    startNewInputIfNeeded();

    let value = getValue();

    if (!value || value === '0') {
        return;
    }

    value =
        value.substring(
            0,
            value.length - 1
        );

    if (!value) {
        value = '0';
    }

    setValue(value);

    updateDecimalValue();
}


// =========================================================
// AC
// =========================================================

function clearAll() {

    setValue('0');

    setExpression('');

    setDecimalValue('');

    justCalculated = false;
}


// =========================================================
// CALCULAR
// =========================================================

function calculate() {

    const input = getValue();

    if (!input || input === 'Error') {
        return;
    }

    try {

        const result =
            evaluateExpression(input);

        const formattedResult =
            formatResult(result);

        /*
         * expression solamente cambia aquí.
         */

        setExpression(
            input +
            '=' +
            formattedResult
        );

        /*
         * value se convierte en el resultado.
         */

        setValue(formattedResult);

        // ANS
        lastAnswer = result;

        saveLastAnswer();

        /*
         * La siguiente pulsación empieza
         * una expresión nueva.
         */

        justCalculated = true;

        updateDecimalValue();

    } catch (error) {

        setExpression(
            input +
            '=Error'
        );

        setValue('Error');

        setDecimalValue('');

        justCalculated = true;
    }
}


// =========================================================
// EVALUAR EXPRESIÓN
// =========================================================

function evaluateExpression(expression) {

    let exp = expression;

    // Operadores visuales
    exp = exp
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/,/g, '.');

    /*
     * Convertimos todos los ángulos DMS
     * a grados decimales.
     */
    exp = convertDMSExpression(exp);

    // PI
    exp = exp.replace(/π/g, 'Math.PI');

    // ANS
    exp = exp.replace(/\bANS\b/g, '(' + lastAnswer + ')');

    /*
     * Trigonometría.
     */
    exp = exp
        .replace(/\bsin\s*\(/g,  'sinDeg(')
        .replace(/\bsen\s*\(/g,  'sinDeg(')
        .replace(/\bcos\s*\(/g,  'cosDeg(')
        .replace(/\btan\s*\(/g,  'tanDeg(')
        .replace(/\basin\s*\(/g, 'asinDeg(')
        .replace(/\bacos\s*\(/g, 'acosDeg(')
        .replace(/\batan\s*\(/g, 'atanDeg(');

    exp = exp.replace(/√\(/g, 'Math.sqrt(');

    exp = exp.replace(/log\(/g, 'Math.log10(');
    exp = exp.replace(/²/g, '**2');

    /*
     * Multiplicación implícita.
     */
    exp = addImplicitMultiplication(exp);

    /*
     * Evaluación.
     */
    const fn = new Function(
        'sinDeg',
        'cosDeg',
        'tanDeg',
        'asinDeg',
        'acosDeg',
        'atanDeg',
        '"use strict"; return (' +
        exp +
        ');'
    );

    const result =
        fn(
            sinDeg,
            cosDeg,
            tanDeg,
            asinDeg,
            acosDeg,
            atanDeg
        );

    if (typeof result !== 'number' || !Number.isFinite(result)) {
        throw new Error('Resultado no válido');
    }

    return result;
}


// =========================================================
// CONVERSIÓN DMS -> DECIMAL
// =========================================================

function convertDMSExpression(expression) {

    let exp = expression;

    /*
     * Caso completo:
     *
     * 40°09′30″
     */

    exp = exp.replace(
        /(\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)['′](\d+(?:\.\d+)?)["″]/g,
        function (
            match,
            degrees,
            minutes,
            seconds
        ) {

            return '(' +
                (
                    parseFloat(degrees) +
                    parseFloat(minutes) / 60 +
                    parseFloat(seconds) / 3600
                ) +
                ')';
        }
    );

    /*
     * Grados + minutos:
     *
     * 40°09′
     */

    exp = exp.replace(
        /(\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)['′]/g,
        function (
            match,
            degrees,
            minutes
        ) {

            return '(' +
                (
                    parseFloat(degrees) +
                    parseFloat(minutes) / 60
                ) +
                ')';
        }
    );

    /*
     * Solo grados:
     *
     * 40°
     */

    exp = exp.replace(
        /(\d+(?:\.\d+)?)°/g,
        function (
            match,
            degrees
        ) {

            return '(' +
                parseFloat(degrees) +
                ')';
        }
    );

    /*
     * En caso de que se utilicen ' y "
     * sin °
     *
     * 09'30"
     */

    exp = exp.replace(
        /(\d+(?:\.\d+)?)['′](\d+(?:\.\d+)?)["″]/g,
        function (
            match,
            minutes,
            seconds
        ) {

            return '(' +
                (
                    parseFloat(minutes) / 60 +
                    parseFloat(seconds) / 3600
                ) +
                ')';
        }
    );

    return exp;
}


// =========================================================
// DECIMAL -> DMS
// =========================================================

/*
 * Convierte un número decimal en DMS.
 *
 * Importante:
 *
 * 40       -> 40°
 * 40.4     -> 40°24′
 * 40.4083  -> 40°24′30″
 *
 * No añadimos partes que sean cero.
 */

function decimalToDMS(value) {

    let sign = '';

    if (value < 0) {

        sign = '-';

        value =
            Math.abs(value);
    }

    let degrees =
        Math.floor(value);

    const minutesFull =
        (value - degrees) * 60;

    let minutes =
        Math.floor(minutesFull);

    let seconds =
        (minutesFull - minutes) * 60;

    seconds =
        Math.round(seconds * 1000) / 1000;

    /*
     * Corrección:
     *
     * 39°59′59.999″
     *
     * -> 40°
     */

    if (seconds >= 60) {

        seconds = 0;

        minutes++;
    }

    if (minutes >= 60) {

        minutes = 0;

        degrees++;
    }

    let result =
        sign +
        degrees +
        '°';

    /*
     * Solo mostramos minutos si existen.
     */

    if (minutes !== 0 || seconds !== 0) {

        result +=
            String(minutes) +
            '′';
    }

    /*
     * Solo mostramos segundos si existen.
     */

    if (seconds !== 0) {

        result +=
            formatSeconds(seconds) +
            '″';
    }

    return result;
}


function formatSeconds(seconds) {

    if (Number.isInteger(seconds)) {

        return String(seconds);
    }

    return seconds
        .toFixed(3)
        .replace(/0+$/, '')
        .replace(/\.$/, '');
}


// =========================================================
// BOTÓN DMS
// =========================================================

/*
 * El botón °′″ funciona progresivamente.
 *
 * Ejemplos:
 *
 * 40
 *      -> 40°
 *
 * 40°18
 *      -> 40°18′
 *
 * 40°18′10
 *      -> 40°18′10″
 *
 * También funciona dentro de expresiones:
 *
 * sen(40
 *      -> sen(40°)
 *
 * sen(40°18
 *      -> sen(40°18′)
 *
 * sen(40°18′10
 *      -> sen(40°18′10″)
 */
function convertDMS() {

    const value = getValue();

    if (!value || value === 'Error') {
        return;
    }


    // =====================================================
    // NÚMERO SIMPLE
    // =====================================================

    /*
     * Si toda la pantalla es un número:
     *
     * 40
     * 40.5
     *
     * Convertimos el valor decimal completo a DMS.
     */

    if (/^-?\d+(?:\.\d+)?$/.test(value)) {

        const numericValue = Number(value);

        if (Number.isFinite(numericValue)) {

            setValue(
                decimalToDMS(numericValue)
            );

            updateDecimalValue();

            justCalculated = false;
        }

        return;
    }


    // =====================================================
    // EXPRESIÓN: SEGUNDOS
    // =====================================================

    /*
     * Ejemplo:
     *
     * sen(40°18′10
     *
     * El último 10 es segundos.
     */

    let match =
        value.match(
            /(-?\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)′(\d+(?:\.\d+)?)$/
        );

    if (match) {

        setValue(
            value + '″'
        );

        updateDecimalValue();

        justCalculated = false;

        return;
    }


    // =====================================================
    // EXPRESIÓN: MINUTOS
    // =====================================================

    /*
     * Ejemplo:
     *
     * sen(40°18
     *
     * Aquí el 18 pertenece a los minutos de 40°.
     *
     * Resultado:
     *
     * sen(40°18′
     */

    match =
        value.match(
            /(-?\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)$/
        );

    if (match) {

        setValue(
            value + '′'
        );

        updateDecimalValue();

        justCalculated = false;

        return;
    }


    // =====================================================
    // EXPRESIÓN: GRADOS
    // =====================================================

    /*
     * Ejemplo:
     *
     * sen(40
     *
     * Resultado:
     *
     * sen(40°
     *
     * Importante:
     *
     * aquí solamente cogemos el número final.
     */

    match =
        value.match(
            /(-?\d+(?:\.\d+)?)$/
        );

    if (!match) {
        return;
    }

    const numberPart = match[1];

    const start = match.index;

    const prefix =
        value.substring(0, start);


    setValue(
        prefix +
        numberPart +
        '°'
    );

    updateDecimalValue();

    justCalculated = false;
}

// =========================================================
// ANGLE MODE
// =========================================================

function setAngleMode(mode) {

    if (mode !== 'DEG') {
        return;
    }

    angleMode = 'DEG';

    const element =
        document.getElementById('degMode');

    if (element) {
        element.classList.add('active');
    }
}


// =========================================================
// TRIGONOMETRÍA EN GRADOS
// =========================================================

function sinDeg(value) {

    return Math.sin(
        value * Math.PI / 180
    );
}


function cosDeg(value) {

    return Math.cos(
        value * Math.PI / 180
    );
}


function tanDeg(value) {

    return Math.tan(
        value * Math.PI / 180
    );
}


function asinDeg(value) {

    return Math.asin(value) *
        180 / Math.PI;
}


function acosDeg(value) {

    return Math.acos(value) *
        180 / Math.PI;
}


function atanDeg(value) {

    return Math.atan(value) *
        180 / Math.PI;
}


// =========================================================
// MULTIPLICACIÓN IMPLÍCITA
// =========================================================

function addImplicitMultiplication(expression) {

    let exp = expression;

    // )( -> )*(
    exp = exp.replace(
        /\)\s*\(/g,
        ')*('
    );

    // Número seguido de función
    exp = exp.replace(
        /(\d|\))\s*(sinDeg|cosDeg|tanDeg|asinDeg|acosDeg|atanDeg)\(/g,
        '$1*$2('
    );

    // Función seguida de otra función
    exp = exp.replace(
        /\)\s*(sinDeg|cosDeg|tanDeg|asinDeg|acosDeg|atanDeg)\(/g,
        ')*$1('
    );

    // Número seguido de PI
    exp = exp.replace(
        /(\d)\s*(Math\.PI)/g,
        '$1*$2'
    );

    // PI seguido de número
    exp = exp.replace(
        /(Math\.PI)\s*(\d)/g,
        '$1*$2'
    );

    // PI seguido de función
    exp = exp.replace(
        /(Math\.PI)\s*(sinDeg|cosDeg|tanDeg|asinDeg|acosDeg|atanDeg)\(/g,
        '$1*$2('
    );

    return exp;
}


// =========================================================
// FORMATO DE RESULTADO
// =========================================================

function formatResult(value) {

    /*
     * Eliminamos pequeños errores de coma flotante:
     *
     * 6.123233995736766e-17 -> 0
     */

    if (Math.abs(value) < 1e-14) {
        value = 0;
    }

    // Enteros
    if (Number.isInteger(value)) {
        return String(value);
    }

    // Máximo 12 cifras significativas
    return Number(
        value.toPrecision(12)
    ).toString();
}


// =========================================================
// MEMORIA
// =========================================================

function memoryStore() {

    const value =
        getNumericDisplayValue();

    if (value === null) {
        return;
    }

    memory[selectedMemory] =
        value;

    updateMemoryDisplay();
}


function memoryRecall() {

    if (selectedMemory === null) {
        return;
    }

    const value =
        memory[selectedMemory];

    if (
        value === null ||
        value === undefined
    ) {
        return;
    }

    startNewInputIfNeeded();

    insertText(
        formatResult(value)
    );
}


function memoryAdd() {

    const value =
        getNumericDisplayValue();

    if (value === null) {
        return;
    }

    if (
        memory[selectedMemory] === null
    ) {

        memory[selectedMemory] = 0;
    }

    memory[selectedMemory] += value;

    updateMemoryDisplay();
}


function memorySubtract() {

    const value =
        getNumericDisplayValue();

    if (value === null) {
        return;
    }

    if (
        memory[selectedMemory] === null
    ) {

        memory[selectedMemory] = 0;
    }

    memory[selectedMemory] -= value;

    updateMemoryDisplay();
}


function memoryClear() {

    memory[selectedMemory] = null;

    updateMemoryDisplay();
}


// =========================================================
// MEMORIAS M1-M6
// =========================================================

function selectMemory(index) {

    selectedMemory = index;

    for (let i = 0; i < 6; i++) {

        const button =
            document.getElementById(
                'memory-' +
                (i + 1)
            );

        if (!button) {
            continue;
        }

        button.classList.toggle(
            'active',
            i === selectedMemory
        );
    }
}


function updateMemoryDisplay() {

    saveMemory();

    for (let i = 0; i < 6; i++) {

        const element =
            document.getElementById(
                'memory-value-' +
                (i + 1)
            );

        if (!element) {
            continue;
        }

        if (memory[i] === null) {

            element.textContent = '—';

        } else {

            element.textContent =
                formatResult(memory[i]);
        }
    }
}


// =========================================================
// VALOR NUMÉRICO ACTUAL
// =========================================================

function getNumericDisplayValue() {

    const value =
        getValue();

    /*
     * Número decimal normal.
     */
    if (/^-?\d+(?:\.\d+)?$/.test(value)) {

        const number =Number(value);

        if (Number.isFinite(number)) {
            return number;
        }
    }

    /*
     * Número DMS.
     */
    if (/^-?\d+(?:\.\d+)?°/.test(value)) {

        const converted = convertDMSExpression(value);

        try {

            const number = Function(
                '"use strict"; return (' +
                converted +
                ');'
            )();

            if (Number.isFinite(number)) {
                return number;
            }

        } catch (error) {

            return null;
        }
    }

    return null;
}


// =========================================================
// UTILIDADES DE ENTRADA
// =========================================================

function getCurrentNumber(value) {

    const match =
        value.match(
            /(-?\d+(?:\.\d*)?)$/
        );

    return match
        ? match[1]
        : '';
}


// =========================================================
// MULTIPLICACIÓN IMPLÍCITA
// =========================================================

function needsImplicitMultiplicationBeforeFunction(value) {

    if (!value) {
        return false;
    }

    return (
        /\d$/.test(value) ||
        /π$/.test(value) ||
        /ANS$/.test(value) ||
        /\)$/.test(value)
    );
}


function needsImplicitMultiplicationBeforeConstant(value) {

    if (!value) {
        return false;
    }

    return (
        /\d$/.test(value) ||
        /π$/.test(value) ||
        /ANS$/.test(value) ||
        /\)$/.test(value)
    );
}


// =========================================================
// DECIMAL VALUE
// =========================================================

function updateDecimalValue() {

    const value =
        getValue();

    /*
     * Si el display está en DMS,
     * mostramos debajo su equivalente decimal.
     */
    if (
        value.includes('°') ||
        value.includes('′') ||
        value.includes('″')
    ) {

        const converted = convertDMSExpression(value);

        try {

            const number = Function(
                '"use strict"; return (' +
                converted +
                ');'
            )();

            if (Number.isFinite(number)) {

                setDecimalValue(
                    Number(
                        number.toPrecision(12)
                    ).toString()
                );

                return;
            }

        } catch (error) {
            // No hacemos nada.
        }
    }

    setDecimalValue('');
}


// =========================================================
// INICIALIZACIÓN
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

    setValue('0');

    setExpression('');

    setDecimalValue('');

    selectMemory(0);

    loadPersistentData();

    updateMemoryDisplay();

    // ACTION BUTTONS
    document
        .querySelectorAll('[data-action]')
        .forEach(button => {

            const action = button.dataset.action;

            button.addEventListener(
                'click',
                () => {

                    if (typeof window[action] === 'function') {
                        window[action]();
                    }
                }
            );
        });


    // FUNCTIONS
    document
        .querySelectorAll('[data-function]')
        .forEach(button => {

            const functionName = button.dataset.function;

            button.addEventListener('click', () => {
                insertFunction(functionName);
            });
        });


    // TEXT BUTTONS
    document
        .querySelectorAll('[data-text]')
        .forEach(button => {

            const text = button.dataset.text;

            button.addEventListener('click', () => {
                insertText(text);
            });
        });


    // MEMORY SELECTION
    document
        .querySelectorAll('[data-memory]')
        .forEach(button => {

            const memoryIndex =Number(button.dataset.memory);

            button.addEventListener(
                'click',
                () => {

                    selectMemory(
                        memoryIndex
                    );
                }
            );
        });

    // KEYS
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        // Números
        if (/^[0-9]$/.test(key)) {
            insertText(key);
            return;
        }

        // Punto decimal
        if (key === '.' || key === ',') {
            insertText('.');
            return;
        }

        if (key === 'Escape') {
            clearAll();
            return;
        }

        // Operadores
        switch (key) {
            case '+':
                insertText('+');
                return;

            case '-':
                insertText('-');
                return;

            case '*':
                insertText('×');
                return;

            case '/':
                event.preventDefault();
                insertText('÷');
                return;

            case '(':
                insertText('(');
                return;

            case ')':
                insertText(')');
                return;

            case 'Backspace':
                event.preventDefault();
                backspace();
                return;

            case 'd':
            case 'D':
                convertDMS();
                return;

            case 'Enter':
            case '=':
                event.preventDefault();
                calculate();
                return;

            case 'a':
            case 'A':
                insertAnswer();
                return;

            case 's':
            case 'S':
                insertFunction('sin');
                return;

            case 'c':
            case 'C':
                insertFunction('cos');
                return;

            case 't':
            case 'T':
                insertFunction('tan');
                return;
        }
    });
});