const squares_container = document.querySelector('.squares-container');
const size_button = document.querySelector('#size-button');
const mode_button = document.querySelector('#mode-button');
const mode_square = document.querySelector('#mode-square');
const shake_button = document.querySelector('#shake-button ');
const shake_intensity_slider = document.querySelector('#shake-intensity');
const intensity_label = document.querySelector('#intensity-label');
let current_mode = "Black"
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
            mode_square.style.background = 'linear-gradient(135deg, red, orange, yellow, green, blue, indigo, violet)';
            break;
        case "RGB":
            current_mode = "Shade";
            mode_square.style.background = 'rgb(128, 128, 128)';
            break;
        case "Shade":
            current_mode = "Eraser";
            mode_square.style.background = 'white';
            break;
        case "Eraser":
            current_mode = "Black";
            mode_square.style.background = 'black';
            break;
        default:
            current_mode = "Black";
            mode_square.style.background = 'black';
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

    const intensity = Number(shake_intensity_slider.value);

    // Set the CSS variable on the container before the animation starts
    squares_container.style.setProperty('--shake-intensity', intensity);
    squares_container.classList.add('shake-effect');

    for (let row = 0; row < gridSize; row++) {
        for (let column = 0; column < gridSize; column++) {
            const index = row * gridSize + column;
            const square = squares[index];

            setTimeout(() => {
                square.style.backgroundColor = 'white';
            }, row * 50); // This delay controls the clearing animation
        }
    }
    
    // After the animation finishes, remove the class
    setTimeout(() => {
        squares_container.classList.remove('shake-effect');
    }, 820);
}

function onLoad(){
    size_button.addEventListener("click", setSize);
    mode_button.addEventListener("click", switchMode);
    shake_button.addEventListener("click", shake);
    init_squares();
    mode_square.style.background = 'black';
    shake_intensity_slider.addEventListener("input", (event) => {
        event.stopPropagation(); // Prevent the slider input event from bubbling up to the button
        const sliderValue = Number(event.target.value);
        const percentage = Math.round((sliderValue - 0.5) * 20);
        intensity_label.textContent = `${percentage}%`;
    });

    shake_intensity_slider.addEventListener("click", (event) => {
        // This stops the click event from bubbling up
        event.stopPropagation();
    });
}

onLoad();