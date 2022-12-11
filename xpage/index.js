const startButton = document.querySelector('.start-screen__button');
const startScreen = document.querySelector('.start-screen');
const finishWindow = document.querySelector('.finish-window');
const finishButton = document.querySelector('.finish-window__button');
const finalWindow = document.querySelector('.final-window');
const finalClose = document.querySelector('.final-window__close');
const tree = document.querySelector('.tree');
const shelf = document.querySelector('.shelf');
const star = document.querySelector('.star');
const cell = document.querySelector('.cell');
const toys = Array.from(document.querySelectorAll('.toy'));
let currentDroppable = null;
let canDrop = false;
let currentX;
let currentY;
let currentArea;
let currentBlocks = {
    'tree': tree,
    'shelf': shelf
};
let treeMap = document.querySelector('.droppable');
let isFinish = false;

/* SOUNDS */
const clickSound = new Audio;
clickSound.src = 'assets/click.wav';
const bellsSound = new Audio;
bellsSound.src = 'assets/bells.wav';
const bells2Sound = new Audio;
bells2Sound.src = 'assets/bells2.wav';
const toySound = new Audio;
toySound.src = 'assets/toy.mp3';

/***/

document.querySelector('body').onselectstart = function(e) {
    e.preventDefault();
};

document.querySelector('.tree-img').onmousedown = function(e) {
    e.preventDefault();
};

toys.forEach((toy) => {

    toy.onpointerdown = function(event) {
        currentX = `${toy.getBoundingClientRect().left}px`;
        currentY = `${toy.getBoundingClientRect().top}px`;

        let shiftX = event.clientX - toy.getBoundingClientRect().left;
        let shiftY = event.clientY - toy.getBoundingClientRect().top;

        toy.style.position = 'absolute';
        toy.style.zIndex = 1000;
        document.body.append(toy);

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            toy.style.left = pageX - shiftX + 'px';
            toy.style.top = pageY - shiftY + 'px';
        };

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);

            toy.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            toy.hidden = false;

            if (!elemBelow) return;

            let droppableBelow = elemBelow.closest('.droppable');
            if (currentDroppable != droppableBelow) {
                if (currentDroppable) {
                    canDrop = false;
                }
                currentDroppable = droppableBelow;
                if (currentDroppable) {
                    currentArea = droppableBelow;
                    canDrop = true;
                }
            }
        }

        document.addEventListener('pointermove', onMouseMove);

        toy.onpointerup = function() {
            if (canDrop === true) {
                toySound.play();
                currentArea.append(toy);
                toy.style.left = +(toy.style.left).split('px')[0] - currentBlocks[currentArea.name].getBoundingClientRect().left + 'px';
                toy.style.top = +(toy.style.top).split('px')[0] - currentBlocks[currentArea.name].getBoundingClientRect().top - window.pageYOffset + 'px';
                document.removeEventListener('pointermove', onMouseMove);
                toy.onpointerup = null;
                if (treeMap.children.length === 9) finish();
            } else {
                toy.style.left = currentX;
                toy.style.top = currentY;
                document.removeEventListener('pointermove', onMouseMove);
                toy.onpointerup = null;
            };
        };

    };

    toy.ondragstart = function() {
        return false;
    };
});

function finish() {
    if (isFinish === false) {
        finishWindow.classList.add('active');
        setTimeout(() => {
            cell.classList.remove('invis');
        }, 1000);
        isFinish = true;
    } else {
        return;
    }

};


star.onpointerdown = function(event) {
    currentX = `${star.getBoundingClientRect().left}px`;
    currentY = `${star.getBoundingClientRect().top}px`;

    let shiftX = event.clientX - star.getBoundingClientRect().left;
    let shiftY = event.clientY - star.getBoundingClientRect().top;

    star.style.position = 'absolute';
    star.style.zIndex = 1000;
    document.body.append(star);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        star.style.left = pageX - shiftX + 'px';
        star.style.top = pageY - shiftY + 'px';
    };

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);

        star.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        star.hidden = false;

        if (!elemBelow) return;

        let droppableBelow = elemBelow.closest('.star-droppable');
        if (currentDroppable != droppableBelow) {
            if (currentDroppable) {
                canDrop = false;
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) {
                currentArea = droppableBelow;
                canDrop = true;
            }
        }
    }

    document.addEventListener('pointermove', onMouseMove);

    star.onpointerup = function() {
        if (canDrop === true) {
            bellsSound.play();
            document.querySelector('.star').remove();
            cell.style.backgroundImage = "url('assets/star.png')";
            openFinalWindow();
        } else {
            star.style.left = currentX;
            star.style.top = currentY;
            document.removeEventListener('pointermove', onMouseMove);
            star.onpointerup = null;
        };
    };

};

star.ondragstart = function() {
    return false;
};

function openFinalWindow() {
    toys.forEach((toy) => {
        toy.onpointerdown = function(event) {
            return;
        };
    });
    final();
};

function final() {
    setTimeout(() => {
        finalWindow.classList.add('active');
    }, 2000);
};

/* BUTTONS */
startButton.addEventListener('click', () => {
    clickSound.play();
    startScreen.classList.add('invis');
    setTimeout(() => {
        startScreen.remove();
        document.querySelector('.content').classList.remove('invis');
    }, 1000);
    setTimeout(() => {
        document.querySelector('.content').classList.add('active');
    }, 1500);
})

finishButton.addEventListener('click', () => {
    clickSound.play();
    finishWindow.classList.remove('active');
    setTimeout(() => {
        bells2Sound.play();
        star.classList.remove('invis');
    }, 1500);
});

finalClose.addEventListener('click', () => {
    clickSound.play();
    finalWindow.classList.remove('active');
});