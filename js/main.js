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
        } else if (e.target === this.leftArrEl && this.numOfPlayers > 1) {
            this.numOfPlayers--;
            this.updateNumerWindow();
        }
    }

    updateNumerWindow() {
        this.playersEl.innerText = this.numOfPlayers;
    }
}

new SelectNumOfPlayers()