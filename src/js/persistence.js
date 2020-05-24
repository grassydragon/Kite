const LEFT_STICK_Y_INDEX_KEY = "left-stick-y-index";

const LEFT_STICK_Y_DIRECTION_KEY = "left-stick-y-direction";

const RIGHT_STICK_Y_INDEX_KEY = "right-stick-y-index";

const RIGHT_STICK_Y_DIRECTION_KEY = "right-stick-y-direction";

const BACK_BUTTON_INDEX_KEY = "back-button-index";

const START_BUTTON_INDEX_KEY = "start-button-index";

const PROGRESS_KEY = "progress";

function loadNumber(key, defaultValue) {
    let value = localStorage.getItem(key);

    if (value == null) return defaultValue;

    return Number.parseInt(value);
}

function saveNumber(key, value) {
    localStorage.setItem(key, value);
}

export let Persistence = {

    get leftStickYIndex() {
        return loadNumber(LEFT_STICK_Y_INDEX_KEY, 1);
    },

    set leftStickYIndex(value) {
        saveNumber(LEFT_STICK_Y_INDEX_KEY, value);
    },

    get leftStickYDirection() {
        return loadNumber(LEFT_STICK_Y_DIRECTION_KEY, 1);
    },

    set leftStickYDirection(value) {
        saveNumber(LEFT_STICK_Y_DIRECTION_KEY, value);
    },

    get rightStickYIndex() {
        return loadNumber(RIGHT_STICK_Y_INDEX_KEY, 3);
    },

    set rightStickYIndex(value) {
        saveNumber(RIGHT_STICK_Y_INDEX_KEY, value);
    },

    get rightStickYDirection() {
        return loadNumber(RIGHT_STICK_Y_DIRECTION_KEY, 1);
    },

    set rightStickYDirection(value) {
        saveNumber(RIGHT_STICK_Y_DIRECTION_KEY, value);
    },

    get backButtonIndex() {
        return loadNumber(BACK_BUTTON_INDEX_KEY, 8);
    },

    set backButtonIndex(value) {
        saveNumber(BACK_BUTTON_INDEX_KEY, value);
    },

    get startButtonIndex() {
        return loadNumber(START_BUTTON_INDEX_KEY, 9);
    },

    set startButtonIndex(value) {
        saveNumber(START_BUTTON_INDEX_KEY, value);
    },

    get progress() {
        return loadNumber(PROGRESS_KEY, 0);
    },

    set progress(value) {
        saveNumber(PROGRESS_KEY, value);
    }

};