import { Persistence } from "./persistence.js";

let Setup = {
    INACTIVE: 0,
    LEFT_STICK_Y: 1,
    RIGHT_STICK_Y: 2,
    BACK_BUTTON: 3,
    START_BUTTON: 4
};

export class GamepadInput {

    constructor() {
        this.gamepad = null;
        
        this.setup = Setup.INACTIVE;
        
        this.onSetupCompleted = null;

        this.leftStickYIndex = Persistence.leftStickYIndex;
        this.leftStickYDirection = Persistence.leftStickYDirection;

        this.rightStickYIndex = Persistence.rightStickYIndex;
        this.rightStickYDirection = Persistence.rightStickYDirection;

        this.backButtonIndex = Persistence.backButtonIndex;

        this.startButtonIndex = Persistence.startButtonIndex;

         addEventListener("gamepadconnected", (event) => {
            this.gamepad = event.gamepad;
        });
    }

    get available() {
        return this.gamepad != null && this.gamepad.connected;
    }

    get leftStickY() {
        if (this.available) return this.gamepad.axes[this.leftStickYIndex] * this.leftStickYDirection;

        return 0;
    }

    get rightStickY() {
        if (this.available) return this.gamepad.axes[this.rightStickYIndex] * this.rightStickYDirection;

        return 0;
    }

    get backButtonPressed() {
        if (this.available) return this.gamepad.buttons[this.backButtonIndex].pressed;

        return false;
    }

    get startButtonPressed() {
        if (this.available) return this.gamepad.buttons[this.startButtonIndex].pressed;

        return false;
    }

    setupLeftStickY() {
        this.setup = Setup.LEFT_STICK_Y;
    }

    setupRightStickY() {
        this.setup = Setup.RIGHT_STICK_Y;
    }

    setupBackButton() {
        this.setup = Setup.BACK_BUTTON;
    }

    setupStartButton() {
        this.setup = Setup.START_BUTTON;
    }

    cancelSetup() {
        this.setup = Setup.INACTIVE;
    }

    update() {
        let gamepads = navigator.getGamepads();

        if (this.available) {
            if (this.gamepad.timestamp !== gamepads[this.gamepad.index].timestamp) {
                this.gamepad = gamepads[this.gamepad.index];
            }
        }

        if (this.available) {
            if (this.setup === Setup.LEFT_STICK_Y || this.setup === Setup.RIGHT_STICK_Y) {
                let axes = this.gamepad.axes;

                let axisIndex = null;
                let axisDirection = null;

                for (let i = 0; i < axes.length; i++) {
                    if (Math.abs(axes[i]) === 1) {
                        axisIndex = i;
                        axisDirection = Math.sign(axes[i]);
                        break;
                    }
                }

                if (axisIndex != null) {
                    if (this.setup === Setup.LEFT_STICK_Y) {
                        this.leftStickYIndex = axisIndex;
                        this.leftStickYDirection = axisDirection;

                        Persistence.leftStickYIndex = axisIndex;
                        Persistence.leftStickYDirection = axisDirection;
                    }
                    else if (this.setup === Setup.RIGHT_STICK_Y) {
                        this.rightStickYIndex = axisIndex;
                        this.rightStickYDirection = axisDirection;

                        Persistence.rightStickYIndex = axisIndex;
                        Persistence.rightStickYDirection = axisDirection;
                    }

                    this.setup = Setup.INACTIVE;
                    
                    if (this.onSetupCompleted != null) this.onSetupCompleted.call();
                }
            }
            else if (this.setup === Setup.BACK_BUTTON || this.setup === Setup.START_BUTTON) {
                let buttons = this.gamepad.buttons;

                let buttonIndex = null;

                for (let i = 0; i < buttons.length; i++) {
                    if (buttons[i].pressed) {
                        buttonIndex = i;
                        break;
                    }
                }

                if (buttonIndex != null) {
                    if (this.setup === Setup.BACK_BUTTON) {
                        this.backButtonIndex = buttonIndex;

                        Persistence.backButtonIndex = buttonIndex;
                    }
                    else if (this.setup === Setup.START_BUTTON) {
                        this.startButtonIndex = buttonIndex;

                        Persistence.startButtonIndex = buttonIndex;
                    }
                    
                    this.setup = Setup.INACTIVE;

                    if (this.onSetupCompleted != null) this.onSetupCompleted.call();
                }
            }
        }
    }

}