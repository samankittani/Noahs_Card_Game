const cards = document.querySelectorAll('.card');
const energyDisplay = document.getElementById('energy');
const dropZone = document.getElementById('dropZone');
const handContainer = document.getElementById('handContainer');
let draggedCard = null;
let energy = 0;

cards.forEach(card => {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragenter', dragEnter);
    card.addEventListener('dragleave', dragLeave);

    card.addEventListener('dragend', dragEnd);
});

dropZone.addEventListener('dragover', dragOver);
dropZone.addEventListener('drop', dropToHand);

function dragStart(event) {
    draggedCard = this;
    setTimeout(() => (this.style.display = 'none'), 0);
}

function dragEnter(event) {
    event.preventDefault();
    this.classList.add('over');
}

function dragOver(event) {
    event.preventDefault();
}

function dragLeave() {
    this.classList.remove('over');
}

function drop(event) {
    this.appendChild(draggedCard);
    this.classList.remove('over');
}

function dropToHand(event) {
    const rect = handContainer.getBoundingClientRect();
    const mouseY = event.clientY;

    if (mouseY < rect.top + (rect.height * 0.66)) {
        const cardValue = parseInt(draggedCard.textContent);
        if (!isNaN(cardValue)) {
            energy += cardValue;
            energyDisplay.textContent = energy;
            draggedCard.remove();
        } else {
            energy += 10;
            energyDisplay.textContent = energy;
            draggedCard.remove();
        }
    }

    dropZone.classList.remove('over');
    draggedCard = null;
}

function dragEnd() {
    this.style.display = 'block';
    draggedCard = null;
}