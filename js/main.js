"use strict";

// to be extended... currently only swaps color ←→ background-color
class ChangeColorTheme {
    constructor(target) {
        // use string for the target argument, eg ".switch-color"
        this.target = document
            .querySelector(target)
            .addEventListener("click", this.toggleTheme.bind(this));

        this.fg = ChangeColorTheme._getProperty("background-color");
        this.bg = ChangeColorTheme._getProperty("color");
    }

    toggleTheme() {
        [this.fg, this.bg] = [this.bg, this.fg];
        document.body.style.backgroundColor = this.fg;
        document.body.style.color = this.bg;
    }

    static _getProperty(property) {
        return window
            .getComputedStyle(document.body)
            .getPropertyValue(property);
    }
}

// DOM manipulation helper functions
function select(item) {
    return document.querySelector(item);
}

function selectAll(item) {
    return document.querySelectorAll(item);
}

function create(element) {
    return document.createElement(element);
}

function cl(item) {
    console.log(item);
}

function cd(item) {
    console.dir(item);
}

// generates random integer, taken from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    //The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min) + min);
}


// ↓↓↓ INTRO SECTION ↓↓↓
class SelectNumOfPlayers {
    constructor() {
        this.playersEl = select(".intro__players-num");
        this.numOfPlayers = this.playersEl.innerText;

        this.leftArrEl = select(".intro__players-left");
        this.leftArrEl.addEventListener("click", this.changeNumber.bind(this));

        this.rightArrEl = select(".intro__players-right");
        this.rightArrEl.addEventListener("click", this.changeNumber.bind(this));
    }

    changeNumber(e) {
        if (e.target === this.rightArrEl && this.numOfPlayers < 6) {
            this.numOfPlayers++;
            this.updateNumerWindow();
            form.addOrRemoveInputs(e, this.numOfPlayers);
        } else if (e.target === this.leftArrEl && this.numOfPlayers > 1) {
            this.numOfPlayers--;
            this.updateNumerWindow();
            form.addOrRemoveInputs(e, this.numOfPlayers);
        }
    }

    updateNumerWindow() {
        this.playersEl.innerText = this.numOfPlayers;
    }
}

class PopulateForm {
    constructor() {
        this.form = select(".intro__submit-players");
        this.formItems = this.form.children;
        select(".intro__submit-players").addEventListener("submit", this.giveFormPlayers.bind(this));
    }

    addOrRemoveInputs(e, numOfPlayers) {
        if (e.target.classList.contains("intro__players-left")) {
            // last input ↓
            this.formItems[this.formItems.length - 2].remove();
        } else if (e.target.classList.contains("intro__players-right")) {
            this.createInput(numOfPlayers);
        }
    }

    createInput(player) {
        const inp = document.createElement("input");
        inp.classList.add("intro__submit-form");
        inp.placeholder = `player ${player}`;
        this.form.insertBefore(inp, select(".intro__submit-btn"));
    }

    hideIntroScreen() {
        select(".intro").classList.add("hidden");
    }

    giveFormPlayers(e) {
        e.preventDefault();
        const items = Array.from(e.target.children).splice(0, e.target.children.length - 1);
        this.hideIntroScreen();
        const playersArr = items.map(el => el.value || el.placeholder);
        players.getAndSetPlayers(playersArr);
    }
}

class Players {
    getAndSetPlayers(playersArr) {
        this.players = playersArr;
        this.setPlayers();
    }

    setPlayers() {
        select(".header__player-name").innerText = this.players[0];
        this.players.forEach(p => {
            p = this.createPlayer(p);
            select(".aside").appendChild(p);
            game.getPlayer(p);
        })

        game.setCurrentPlayer();
    }

    createPlayer(player) {
        const div = create("div");
        div.classList.add("aside__player");

        const h3 = create("h3");
        h3.classList.add("aside__player-name");
        h3.innerText = player;
        div.appendChild(h3);

        const span = create("span");
        span.classList.add("aside__player-text");
        span.innerText = "score: ";
        div.appendChild(span);

        const span2 = create("span");
        span2.classList.add("aside__player-score");
        span2.innerText = "0";
        div.appendChild(span2);

        return div;
    }
}

class Cube {
    // mappings for dots on a cube
    1 = [5];
    2 = [3, 7];
    3 = [3, 5, 7];
    4 = [1, 3, 7, 9];
    5 = [1, 3, 5, 7, 9];
    6 = [1, 3, 4, 6, 7, 9];

    constructor(number) {
        this.number = this[`${number}`];
        this.div = create("div");
        this.div.classList.add("main__cube");

        this.number.forEach(num => {
            const div2 = create("div");
            div2.classList.add("dot");
            div2.classList.add(`dot--${num}`);
            this.div.appendChild(div2);
        })
    }

    // returns cube
    get() {
        return this.div;
    }

    // roll() {
    //     cl(this.get())
    // }

    static populateScreen(shuffle = false) {
        Cube.cubeContainer = select(".cubes");

        for (let i = 1; i < 7; i++) {
            const cube = new Cube(`${Cube.linearOrShuffle(shuffle, i)}`).get();

            // will be marked as cubes that needs to be rolled before they can be selected
            if (shuffle === false) cube.dataset.rolled = false;
            Cube.cubeContainer.appendChild(cube);
        }
    }

    static linearOrShuffle(shuffle, num) {
        if (shuffle === false) {
            return num;

        } else if (shuffle === true) {
            return getRandomInt(1, 7);
        }
    }
}

class Game {
    constructor() {
        this.players = [];
        this.idx = 0;
        this.cubes = select(".cubes");
        select(".roll").addEventListener("click", this.diceRollerVisual.bind(this));
        Cube.cubeContainer.addEventListener("click", this.selectCubes.bind(this));
    }

    getPlayer(player) {
        this.players.push(player);
    }

    setCurrentPlayer() {
        const len = this.players.length;
        this.currPlayer = this.players[this.idx % len];

        const [name, score] = this.currPlayer.innerText.split("\n");

        select(".header__player-name").innerText = name;
        select(".header__score-value").innerText = score.split(" ")[1];

        this.previousPlayer = this.players[(this.idx + len - 1) % len];

        this.previousPlayer.classList.remove("shining");
        this.currPlayer.classList.add("shining");
        this.idx++;
    }

    diceRoller() {
        Array.from(this.cubes.children).forEach(child => child.remove());
        Cube.populateScreen(true);
    }

    diceRollerVisual() {
        // intervals in which diceRoller method is invoked
        const intervalsSequence = [0, 20, 40, 60, 80, 100, 150, 200, 250, 300, 400, 500, 600];

        for (let i = 0; i < intervalsSequence.length; i++) {
            const interval = intervalsSequence[i];
            setTimeout(this.diceRoller.bind(this), interval);
        }
    }

    selectCubes(e) {
        if (this.checkIfCubesRolled()) {
            this.cubesNotRolledAlert();
            return;
        }

        if (e.target.classList.contains("main__cube")) {
            this.toggleCubesSelection(e.target);
        } else if (e.target.classList.contains("dot")) {
            this.toggleCubesSelection(e.target.parentNode);
        }
    }

    cubesNotRolledAlert() {
        // ↓↓↓ POPUP THAT SHOWS YOU NEED ROLL THE DICE FIRST BEFORE SELECTION
        //

        // const e = window.event;
        // const [x, y] = [e.clientX, e.clientY];
        // const span = create("span");
        // span.innerText = "roll the dice first!";
        // span.classList.add("roll-dice-alert");
        // span.style.left = `${x}px`;
        // span.style.top = `${y}px`;
        // select("html").appendChild(span);
        // setTimeout(() => span.remove(), 1000);

        select(".roll").animate([
            // keyframes
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(5deg)' },
            { transform: 'rotate(-5deg)' },
            { transform: 'rotate(0deg)' }

        ], {
            // timing options
            duration: 300,
            iterations: 1
        });
    }

    checkIfCubesRolled() {
        return Array
            .from(Cube.cubeContainer.children)
            .every(cube => cube.dataset.rolled === "false");
    }

    toggleCubesSelection(target) {
        if (target.dataset.selected === "true") {
            target.dataset.selected = false;
            target.style.backgroundColor = "var(--white-older)";
            target.classList.remove("shining");

        } else if (!target.dataset.selected || target.dataset.selected === "false") {
            target.dataset.selected = true;
            target.style.backgroundColor = "var(--primary-color-default)";
            target.classList.add("shining");
        }
    }
}

Cube.populateScreen();
const numOfPlayers = new SelectNumOfPlayers();
const form = new PopulateForm();
const players = new Players();
const game = new Game();