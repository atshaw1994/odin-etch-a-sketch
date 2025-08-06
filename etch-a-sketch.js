const squares_container = document.querySelector('.squares-container');
const size_button = document.querySelector('#size_button');
const mode_button = document.querySelector('#mode_button');
const shake_button = document.querySelector('#shake_button ');
let squares = [];

function getRandomColorValue() {
    return Math.floor(Math.random() * 256);
}

function init_squares(desiredSize = 16){
    squares_container.innerHTML = '';

    squares = []; 
    
    const containerWidth = 768;
    const squareSize = containerWidth / desiredSize;
    
    for (let row = 0; row < desiredSize; row++) {
        for (let column = 0; column < desiredSize; column++) {
            const square = document.createElement('div');
            square.classList.add('grid-square');
            
            square.style.width = `${squareSize}px`;
            square.style.height = `${squareSize}px`;

            square.addEventListener("mouseenter", square_OnHover);
            squares_container.appendChild(square);
            squares.push(square);
        }
    }
}

function square_OnHover(event) {
    const square = event.target;
    if (mode_button.innerHTML === "Black") {
        square.style.backgroundColor = 'black'; 
    }
    else if (mode_button.innerHTML === "RGB") {
        const r = getRandomColorValue();
        const g = getRandomColorValue();
        const b = getRandomColorValue();
        square.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
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
    if (mode_button.innerHTML === "Black") {
        mode_button.innerHTML = "RGB";
    }
    else if (mode_button.innerHTML === "RGB") {
        mode_button.innerHTML = "Shade";
    }
    else if (mode_button.innerHTML === "Shade") {
        mode_button.innerHTML = "Black";
    }
}

function onLoad(){
    size_button.addEventListener("click", setSize);
    mode_button.addEventListener("click", switchMode);
    shake_button.addEventListener("click", shake);
    init_squares();
}

function getGridSize() {
    const totalSquares = squares.length;
    return Math.sqrt(totalSquares);
}

function shake(){
    const gridSize = getGridSize();
    if (gridSize === 0) return;

    squares_container.classList.add('shake-effect');

    for (let row = 0; row < gridSize; row++) {
        for (let column = 0; column < gridSize; column++) {
            const index = row * gridSize + column;
            const square = squares[index];

            setTimeout(() => {
                square.style.backgroundColor = 'white';
            }, row * 50);
        }
    }

    setTimeout(() => {
        squares_container.classList.remove('shake-effect');
    }, 820);
}

onLoad();