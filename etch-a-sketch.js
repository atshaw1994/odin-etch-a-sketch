const outer_shell = document.querySelector('.outer-shell');
const squares_container = document.querySelector('.squares-container');
const size_button = document.querySelector('#size-button');
const mode_button = document.querySelector('#mode-button');
const shake_button = document.querySelector('#shake-button ');
let current_mode = "Black"
let squares = [];
let isDrawingEnabled = false;
let squareEnterColor = 'white';

function getRandomColorValue() {
    return Math.floor(Math.random() * 256);
}

function init_squares(desiredSize = 16){
    squares_container.innerHTML = '';

    squares = []; 
    
    const containerWidth = 512;
    const squareSize = containerWidth / desiredSize;
    
    for (let row = 0; row < desiredSize; row++) {
        for (let column = 0; column < desiredSize; column++) {
            const square = document.createElement('div');
            square.classList.add('grid-square');
            
            square.style.width = `${squareSize}px`;
            square.style.height = `${squareSize}px`;

            square.addEventListener("mouseenter", square_OnHover);
            square.addEventListener("mouseleave", square_OnLeave);
            squares_container.appendChild(square);
            squares.push(square);
        }
    }
}

function square_OnHover(event) {
    const square = event.target;
    squareEnterColor = square.style.backgroundColor;
    if (current_mode == "Black") {
        square.style.backgroundColor = 'black'; 
    }
    else if (current_mode == "RGB") {
        const r = getRandomColorValue();
        const g = getRandomColorValue();
        const b = getRandomColorValue();
        square.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
    else if (current_mode == "Eraser") {
        square.style.backgroundColor = 'white'; 
    }
    else {
        const currentColor = square.style.backgroundColor;
        if (currentColor === '' || currentColor === 'rgba(0, 0, 0, 0)' || currentColor === 'white') {
            square.style.backgroundColor = 'rgb(240, 240, 240)';
            return;
        }
        const rgbValues = currentColor.match(/\d+/g).map(Number);
        const newR = Math.max(0, Math.floor(rgbValues[0] - (rgbValues[0] * 0.1)));
        const newG = Math.max(0, Math.floor(rgbValues[1] - (rgbValues[1] * 0.1)));
        const newB = Math.max(0, Math.floor(rgbValues[2] - (rgbValues[2] * 0.1)));
        square.style.backgroundColor = `rgb(${newR}, ${newG}, ${newB})`;
    }
}

function square_OnLeave(event) {
    const square = event.target;
    if (!isDrawingEnabled) {
        square.style.backgroundColor = squareEnterColor; 
    }
}

function setSize(){
    let desiredSize = 101
    while (desiredSize < 1 || desiredSize > 100){
        let input = prompt("Enter size for display (max 100)", "16");
        if (input === null) {
            return;
        }
        desiredSize = parseInt(input)
    }
    squares_container.innerHTML = '';
    init_squares(desiredSize);
}

function switchMode(){
    switch (current_mode) {
        case "Black":
            current_mode = "RGB";
            mode_button.style.background = 'linear-gradient(135deg, red, orange, yellow, green, blue, indigo, violet)';
            break;
        case "RGB":
            current_mode = "Shade";
            mode_button.style.background = 'rgb(128, 128, 128)';
            break;
        case "Shade":
            current_mode = "Eraser";
            mode_button.style.background = 'white';
            break;
        case "Eraser":
            current_mode = "Black";
            mode_button.style.background = 'black';
            break;
        default:
            current_mode = "Black";
            mode_button.style.background = 'black';
            break;
    }
}

function getGridSize() {
    const totalSquares = squares.length;
    return Math.sqrt(totalSquares);
}

function shake() {
    const gridSize = getGridSize();
    if (gridSize === 0) return;

    outer_shell.classList.remove('shake-effect');
    void outer_shell.offsetWidth;

    // Set the CSS variable on the container before the animation starts
    outer_shell.style.setProperty('--shake-intensity', 2.5);
    outer_shell.classList.add('shake-effect');

    for (let row = 0; row < gridSize; row++) {
        for (let column = 0; column < gridSize; column++) {
            const index = row * gridSize + column;
            const square = squares[index];

            setTimeout(() => {
                square.style.backgroundColor = 'white';
            }, row * 50); // This delay controls the clearing animation
        }
    }
}

function onLoad(){
    size_button.addEventListener("click", (event) => {
        // Stop the event from bubbling up to the outer-shell
        event.stopPropagation(); 
        setSize();
    });

    mode_button.addEventListener("click", (event) => {
        // Stop the event from bubbling up to the outer-shell
        event.stopPropagation();
        switchMode();
    });

    outer_shell.addEventListener("click", shake);
    
    init_squares();

    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            isDrawingEnabled = !isDrawingEnabled;
            event.preventDefault();
        }
    });

    mode_button.style.background = 'black';
}

onLoad();