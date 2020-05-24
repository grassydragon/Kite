import * as THREE from "../../../node_modules/three/build/three.module.js"

export class KiteParameters {

    constructor() {
        this.g = 9.81;

        this.ro = 1.225;

        this.m = 0.22;

        this.A = 0.6;

        this.L0 = null;

        this.IG = new THREE.Matrix4();

        this.vw = null;

        this.deflection = null;

        this.xa = null;
        this.ya = null;
        this.za = null;

        this.Cx0 = -0.05;
        this.Cxa = 0.1;

        this.Cyb = -3;

        this.Cz0 = 0.1;
        this.Cza = -3;

        this.Clb = -0.1;
        this.Clp = -0.1;

        this.Cm0 = 0.1;
        this.Cma = -0.7;
        this.Cmq = -0.1;

        this.Cnb = 0.5;
        this.Cnr = -0.01;

        this.eb = null;
        this.ec = null;

        this.mu = null;

        this.vt = null;
    }

    initialize(wind, lines) {
        this.L0 = lines;

        this.IG.set(
            this.covertInertiaMoment(0.08), 0, 0, 0,
            0, this.covertInertiaMoment(0.01), 0, 0,
            0, 0, this.covertInertiaMoment(0.08), 0,
            0, 0, 0, 0
        );

        this.vw = this.convertVelocity(wind);

        this.deflection = this.convertDistance(0.1);

        this.xa = this.convertDistance(-0.08);
        this.ya = this.convertDistance(0.3);
        this.za = this.convertDistance(0.26);

        this.eb = this.convertDistance(1.74);
        this.ec = this.convertDistance(0.69);

        this.mu = this.ro * this.A * this.L0 / (2 * this.m);

        this.vt = this.convertVelocity(6);
    }

    convertTime(time) {
        return time / Math.sqrt(this.L0 / this.g);
    }

    convertDistance(distance) {
        return distance / this.L0;
    }

    convertVelocity(velocity) {
        return velocity / Math.sqrt(this.g * this.L0);
    }

    covertInertiaMoment(inertiaMoment) {
        return inertiaMoment / (this.m * this.L0 * this.L0);
    }

}