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
    }

    addOrRemoveInputs(e, numOfPlayers) {
        cl(numOfPlayers)
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
}

const numOfPlayers = new SelectNumOfPlayers();
const form = new PopulateForm();