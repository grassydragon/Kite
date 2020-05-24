import * as THREE from "../../../node_modules/three/build/three.module.js"

export class KiteState {

    constructor() {
        this.s = new THREE.Vector4(0, 0, 0, 0);

        this.s_t = new THREE.Vector4(0, 0, 0, 0);
    }

    get phi() {
        return this.s.x;
    }

    set phi(value) {
        this.s.x = value;
    }

    get gamma() {
        return this.s.y;
    }

    set gamma(value) {
        this.s.y = value;
    }

    get eta() {
        return this.s.z;
    }

    set eta(value) {
        this.s.z = value;
    }

    get theta() {
        return this.s.w;
    }

    set theta(value) {
        this.s.w = value;
    }

    get phi_t() {
        return this.s_t.x;
    }

    set phi_t(value) {
        this.s_t.x = value;
    }

    get gamma_t() {
        return this.s_t.y;
    }

    set gamma_t(value) {
        this.s_t.y = value;
    }

    get eta_t() {
        return this.s_t.z;
    }

    set eta_t(value) {
        this.s_t.z = value;
    }

    get theta_t() {
        return this.s_t.w;
    }

    set theta_t(value) {
        this.s_t.w = value;
    }

}