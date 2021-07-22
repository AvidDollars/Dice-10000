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

// ↓↓↓ SMALL HELPER FUNCTIONS ↓↓↓
const sum = (acc, currVal) => acc + currVal;

// TODO (if necessary, add optional parameter 'sorted' and implement logic for comparing two sorted arrays)
const compareTwoArrays = function (arr1, arr2) {
    return arr1.every((value, index) => value === arr2[index]);
}

// checks if all the numbers of array are the same and if so, it returns corresponding score for a dice roll, false otherwise
// mode switches evaluation for roll in which dice have all the same value (except for value of 1)
const AllValuesAreSame = function (arr, mode = "two") {
    const n = (arr.every(n => n === 1)) ? 3 : 2;
    const coefficient = arr.length - n;

    if (n === 3)
        return 1000 * 2 ** (coefficient);

    // [2, 2, 2] → 200, [3, 3, 3, 3] → 600, [4, 4, 4, 4, 4] → 1200, [5, 5, 5, 5, 5, 5] → 2000 
    if (arr.every(v => v === arr[0]) && mode === "two")
        return arr[0] * (coefficient * 100);

    // [2, 2, 2] → 200, [3, 3, 3, 3] → 600, [4, 4, 4, 4, 4] → 1600, [5, 5, 5, 5, 5, 5] → 4000
    if (arr.every(v => v === arr[0]) && mode === "base")
        return arr[0] * 100 * 2 ** (coefficient - 1);

    return false;
}

// ↓↓↓ HELPER FUNCTIONS FOR PROCESSING DICE ROLLS ↓↓↓

// eg.: [2, 2, 2, 4] → {2: 3, 4: 1}
function countForEachNum(arr) {
    const obj = {};
    arr.forEach(num => {
        if (!(num in obj)) obj[`${num}`] = 1;
        else if (num in obj) obj[`${num}`] += 1;
    })
    return obj;
}

// eg.: {2: 3, 4: 1} → [[2, 2, 2], [4]]
function arraysFromObj(obj) {
    const arr = [];
    for (const k in obj) {
        const res = Array(obj[k]).fill(Number(k));
        arr.push(res)
    }
    return arr;
}

// eg.: [2, 2, 2, 4] → [[2, 2, 2], [4]]
function separateDifferentNumbers(arr, sixDie = false) {
    const o = countForEachNum(arr);

    // hackish approach for evaluation of 6 die roll with potential of having three pairs or 1-6 straight
    if (sixDie === true) {

        // if [1, 2, 3, 4, 5, 6]
        if (arr.length === new Set(arr).size) return arraysFromObj({ 1: 3, 5: 3 })

        for (const k in o) {
            if (arraysFromObj(o).some(arr => arr.length !== 2)) break;
            else {
                // score for eg. [2, 2, 3, 3, 4, 4] is the same as the score for [5, 5, 5, 5]
                return arraysFromObj({ 5: 4 });
            }
        }
    }

    return arraysFromObj(o);
}


// ↓↓↓ INTRO SECTION ↓↓↓
class SelectNumOfPlayers {
    constructor() {
        this.playersEl = select(".intro__players-num");
        this.numOfPlayers = this.playersEl.innerText;

        [
            ".intro__players-left",
            ".intro__players-right"
        ].forEach(element => {
            select(element).addEventListener("click", this.changeNumber.bind(this))
        })
    }

    changeNumber(e) {
        if (e.target.classList.contains("intro__players-right") && this.numOfPlayers < 6) {
            this.numOfPlayers++;
        } else if (e.target.classList.contains("intro__players-left") && this.numOfPlayers > 1) {
            this.numOfPlayers--;
        }

        this.playersEl.innerText = this.numOfPlayers;
        form.addOrRemoveInputs(e, this.numOfPlayers);
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
        const playersArr = items.map(el => el.value.trim() || el.placeholder);
        players.getAndSetPlayers(playersArr);
    }
}

class Players {

    // will contain instances of Player class for easy access for current and total score
    list = [];

    getAndSetPlayers(playersArr) {
        this.players = playersArr;
        this.setPlayers();
    }

    setPlayers() {
        select(".header__player-name").innerText = this.players[0];
        this.players.forEach((p, listIdx) => {
            p = this.createPlayer(p);
            select(".aside").appendChild(p);
            game.getPlayer(this.list[listIdx]);
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

        this.list.push(new Player(div, 0, 0))

        return div;
    }
}

class Player {
    constructor(object, currScore, totalScore) {
        this.object = object;
        this.currScore = currScore;
        this.totalScore = totalScore;
        // ↓↓↓ maybe redundant
        this.currValues = [];
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

    static populateScreen(dieToRoll = 6, shuffle = false) {
        Cube.cubeContainer = select(".cubes");

        for (let i = 1; i <= dieToRoll; i++) {
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
        select(".next-player").addEventListener("click", this.changePlayer.bind(this));
        Cube.cubeContainer.addEventListener("click", this.selectCubes.bind(this));
    }

    getPlayer(player) {
        this.players.push(player);
    }

    setCurrentPlayer() {
        const len = this.players.length;
        this.currPlayer = this.players[this.idx % len];

        const [name, score] = this.currPlayer.object.innerText.split("\n");

        select(".header__player-name").innerText = name;
        select(".header__score-value").innerText = score.split(" ")[1];

        this.previousPlayer = this.players[(this.idx + len - 1) % len];

        this.previousPlayer.object.classList.remove("shining");
        this.currPlayer.object.classList.add("shining");
        this.idx++;
    }

    diceRoller(shuffle = true) {
        const dieToRoll = this.clearCubesFromScreen();
        Cube.populateScreen(dieToRoll, shuffle);
    }

    clearCubesFromScreen(switchedPlayer = false) {
        // ↓↓↓ if player is switched
        if (switchedPlayer === true) {
            Array.from(this.cubes.children).forEach(child => child.remove());
            Cube.populateScreen(6);
            return;
        }

        // ↓↓↓ if player is not switched
        let toBeRemoved = 0;

        Array.from(this.cubes.children).forEach(child => {
            const isNotRolled = (child.dataset.rolled === "false" || child.dataset.rolled === undefined);
            const isNotSelected = !(child.dataset.selected === "true");

            if (isNotRolled && isNotSelected) {
                child.remove();
            } else {
                toBeRemoved++;
            }
        });

        const dieToRoll = 6 - toBeRemoved;
        return dieToRoll;
    }

    diceRollerVisual() {
        // intervals in which diceRoller method is invoked
        const intervalsSequence = [0, 20, 40, 60, 80, 100, 150, 200, 250, 300, 400, 500, 600];
        for (let i = 0; i < intervalsSequence.length; i++) {
            const interval = intervalsSequence[i];
            setTimeout(this.diceRoller.bind(this), interval);
        }

        Array.from(this.cubes.children).forEach(child => {
            if (child.dataset.selected === "true") {
                child.dataset.frozen = "true";

                // dots
                Array.from(child.children).forEach(child => child.dataset.frozen = "true");
            }
        })
    }

    selectCubes(e) {
        if (this.checkIfCubesRolled()) {
            this.cubesNotRolledAlert();
            return;
        }

        if (e.target.dataset.frozen === "true") return;

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

        this.setPlayersCurrScore(target, target.dataset.selected);
    }

    // add logic
    setPlayersCurrScore(target, ifSelected) {
        const selected = ifSelected === "true" ? true : false;
        const vals = this.currPlayer.currValues;

        if (!vals.includes(target) && selected) {
            vals.push(target);
        } else if (vals.includes(target) && !selected) {
            const filtered = vals.filter(item => item !== target);
            this.currPlayer.currValues = filtered;
        }

        // extracting currently selected values
        const valuesArr = this.currPlayer.currValues
            .filter(cube => cube.dataset.frozen !== "true")
            .map(cube => cube.children.length);

        const currScore = this.evaluateValueOfRoll(valuesArr);
        this.updateCurrentScore(currScore);
    }

    // to be populated
    updateCurrentScore(score) {
        select(".header__score-value").innerText = score;
    }

    evaluateValueOfRoll(values) {
        switch (values.length) {
            case 0: return 0;
            case 1: return this.evaluateOneDieRoll(values[0]);
            case 2: return this.evaluateTwoDiceRoll(values);
            case 3: return this.evaluateThreeDiceRoll(values);
            default: return this.evaluateFourToSixDiceRoll(values);
        }
    }

    evaluateOneDieRoll(value) {
        if (value === 1) return 100;
        else if (value === 5) return 50;
        return 0;
    }

    evaluateTwoDiceRoll(values) {
        return values
            .map(value => this.evaluateOneDieRoll(value))
            .reduce(sum, 0);
    }

    evaluateThreeDiceRoll(values) {
        const areSame = AllValuesAreSame(values);
        if (areSame) return areSame;
        const filtered = values.filter(v => v === 1 || v === 5);
        return this.evaluateTwoDiceRoll(filtered);
    }

    evaluateFourToSixDiceRoll(values) {
        // sixDice = potential tree pairs or 1-6 traight
        const sixDice = (values.length === 6) ? true : false
        const areSame = AllValuesAreSame(values);
        if (areSame) return areSame;
        return separateDifferentNumbers(values, sixDice)
            .map(arr => this.evaluateValueOfRoll(arr))
            .reduce(sum)
    }

    // add logic
    changePlayer() {
        // ↓↓↓ clears screen for next player
        this.clearCubesFromScreen(true);
        this.setCurrentPlayer();
    }
}

Cube.populateScreen();
const numOfPlayers = new SelectNumOfPlayers();
const form = new PopulateForm();
const players = new Players();
const game = new Game();