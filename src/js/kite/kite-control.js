import * as THREE from "../../../node_modules/three/build/three.module.js"

export class KiteControl {

    constructor() {
        this.c = new THREE.Vector4(0, 0, 0, 0);
    }

    get l() {
        return this.c.x;
    }

    set l(value) {
        this.c.x = value;
    }

    get delta() {
        return this.c.y;
    }

    set delta(value) {
        this.c.y = value;
    }

}
