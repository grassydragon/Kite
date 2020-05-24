import * as THREE from "../../../node_modules/three/build/three.module.js"
import { KiteState } from "./kite-state.js";
import { KiteControl } from "./kite-control.js";
import { RotationMatrices } from "./rotation-matrices.js";
import { UPSsMatrix } from "./ups-s-matrix.js";
import { PHIMatrix } from "./phi-matrix.js";
import { MsMatrix } from "./m-s-matrix.js";
import { PotentialEnergy } from "./potential-energy.js";
import { Aerodynamics } from "./aerodynamics.js";

const MAX_TIME_STEP = 1 / 60 / 4;

const ATTACHMENT_HORIZONTAL_OFFSET = 0.3;

const ATTACHMENT_VERTICAL_OFFSET = 0.08;

const ATTACHMENT_DEPTH_OFFSET = 0.26;

const TIP_VERTICAL_OFFSET = 0.334839;

const KITE_NOSE = new THREE.Vector4(0.371554, 0, 0, 0);

const KITE_LEFT_TIP = new THREE.Vector4(-0.334839, 0.870404, 0, 0);

const KITE_RIGHT_TIP = new THREE.Vector4(-0.334839, -0.870404, 0, 0);

const INTERPOLATION_STEP = 0.1;

const CRASH_SPEED = 0.5;

export class KiteSimulation {

    constructor(kite, leftLineStart, leftLineEnd, rightLineStart, rightLineEnd, gamepadInput, kiteParameters, height) {
        this.kite = kite;

        this.leftLineStart = leftLineStart;
        this.leftLineEnd = leftLineEnd;

        this.rightLineStart = rightLineStart;
        this.rightLineEnd = rightLineEnd;

        this.gamepadInput = gamepadInput;

        this.kiteParameters = kiteParameters;

        this.height = height;

        this.kiteState = new KiteState();
        this.kiteControl = new KiteControl();

        this.rotationMatrices = new RotationMatrices();

        this.upssMatrix = new UPSsMatrix();

        this.phiMatrix = new PHIMatrix();

        this.msMatrix = new MsMatrix();

        this.potentialEnergy = new PotentialEnergy();

        this.aerodynamics = new Aerodynamics();

        this.vg = new THREE.Vector4();

        this.omega = new THREE.Vector4();

        this.va = new THREE.Vector4();

        this.s1 = new THREE.Vector4();
        this.s2 = new THREE.Vector4();

        this.s_t_t = new THREE.Vector4();

        this.directionToKite = new THREE.Vector4();

        this.h = 0;

        this.v = 0;

        this.t = 0;

        this.turns = 0;

        this.collidesWithGround = false;

        this.crashed = false;

        this.m1 = new THREE.Matrix4();
        this.m2 = new THREE.Matrix4();
        this.m3 = new THREE.Matrix4();
        this.m4 = new THREE.Matrix4();

        this.v1 = new THREE.Vector4();
        this.v2 = new THREE.Vector4();
        this.v3 = new THREE.Vector4();
        this.v4 = new THREE.Vector4();
        this.v5 = new THREE.Vector4();

        this.restart();
    }

    restart() {
        let a = this.kiteParameters.L0 + ATTACHMENT_DEPTH_OFFSET;
        let b = TIP_VERTICAL_OFFSET - ATTACHMENT_VERTICAL_OFFSET + 0.01;

        let h = this.height;
        let p = Math.sqrt(a * a + b * b - h * h);

        this.kiteState.phi = 0;
        this.kiteState.gamma = Math.PI - (Math.atan2(p, h) + Math.atan2(b, a));
        this.kiteState.eta = 0;
        this.kiteState.theta = 0;

        this.kiteState.phi_t = 0;
        this.kiteState.gamma_t = -Math.PI;
        this.kiteState.eta_t = 0;
        this.kiteState.theta_t = 0;

        this.kiteControl.l = Math.sqrt(1 - this.kiteParameters.ya * this.kiteParameters.ya);
        this.kiteControl.delta = 0;

        this.rotationMatrices.update(this.kiteState);

        this.turns = 0;

        this.collidesWithGround = false;

        this.crashed = false;

        this.updateKite();

        this.updateWindWindowPosition();

        this.updateLines();
    }

    update(time) {
        this.updateKiteControl();

        this.updateKiteState(time);

        this.updateKite();

        this.updateWindWindowPosition();

        this.updateLines();
    }

    updateKiteControl() {
        let ya = this.kiteParameters.ya;

        let kiteControl = this.kiteControl;

        let lp = 1 - this.gamepadInput.leftStickY * this.kiteParameters.deflection;
        let ln = 1 - this.gamepadInput.rightStickY * this.kiteParameters.deflection;

        let l = Math.sqrt(0.5 * (lp * lp + ln * ln - 2 * ya * ya));

        kiteControl.l = l;

        let delta = Math.asin((lp * lp - ln * ln) / (4 * l * ya));

        this.kiteState.eta -= (delta - kiteControl.delta);

        kiteControl.delta = delta;
    }

    updateKiteState(time) {
        let m1 = this.m1;
        let m2 = this.m2;

        let v1 = this.v1;
        let v2 = this.v2;

        while (!this.collidesWithGround && time > 0) {
            let timeStep;

            if (time > MAX_TIME_STEP) {
                timeStep = this.kiteParameters.convertTime(MAX_TIME_STEP);
                time -= MAX_TIME_STEP;
            }
            else {
                timeStep = this.kiteParameters.convertTime(time);
                time = 0;
            }

            this.upssMatrix.update(this.kiteParameters, this.kiteState, this.kiteControl);

            this.vg.copy(this.kiteState.s_t);
            this.vg.applyMatrix4(this.upssMatrix.UPSs);

            this.phiMatrix.update(this.kiteState);

            this.omega.copy(this.kiteState.s_t);
            this.omega.applyMatrix4(this.phiMatrix.PHI);

            this.msMatrix.update(this.kiteParameters, this.upssMatrix, this.phiMatrix);

            this.potentialEnergy.update(this.kiteParameters, this.kiteState, this.kiteControl);

            v1.set(-this.kiteParameters.vw, 0, 0, 0);
            v1.applyMatrix4(this.rotationMatrices.RBE);

            this.va.copy(this.vg);
            this.va.sub(v1);

            this.aerodynamics.update(this.kiteParameters, this.upssMatrix, this.phiMatrix, this.va, this.omega);

            m1.zero();
            m2.zero();

            for (let i = 0; i < 4; i++) {
                m2.copy(this.msMatrix.Ms_s[i]);
                m2.multiplyScalar(this.kiteState.s_t.getComponent(i));

                m1.add(m2);

                v2.copy(this.kiteState.s_t);
                v2.applyMatrix4(this.msMatrix.Ms_s[i]);

                v1.setComponent(i, v2.dot(this.kiteState.s_t));
            }

            this.s_t_t.copy(this.aerodynamics.Q);
            this.s_t_t.sub(this.potentialEnergy.U_s);

            v2.copy(v1);
            v2.multiplyScalar(0.5);

            this.s_t_t.add(v2);

            v2.copy(this.kiteState.s_t);
            v2.applyMatrix4(m1);

            this.s_t_t.sub(v2);

            m2.getInverse(this.msMatrix.Ms);

            this.s_t_t.applyMatrix4(m2);

            this.s1.copy(this.kiteState.s);

            this.kiteState.s.addScaledVector(this.kiteState.s_t, timeStep);
            this.kiteState.s_t.addScaledVector(this.s_t_t, timeStep);

            this.rotationMatrices.update(this.kiteState);

            this.checkCollisionWithGround();

            if (this.collidesWithGround) {
                this.separateKiteAndGround();

                this.crashed = this.vg.length() >= CRASH_SPEED;
            }
        }
    }

    updateKite() {
        let m1 = this.m1;
        let m2 = this.m2;
        let m3 = this.m3;
        let m4 = this.m4;

        let v1 = this.v1;
        let v2 = this.v2;
        let v3 = this.v3;

        m1.copy(this.rotationMatrices.R1E).transpose();

        let sed = Math.sin(this.kiteState.eta + this.kiteControl.delta);
        let ced = Math.cos(this.kiteState.eta + this.kiteControl.delta);

        v1.set(0, this.kiteControl.l * sed, -this.kiteControl.l * ced, 0);
        v1.applyMatrix4(m1);

        this.directionToKite.copy(v1);
        this.directionToKite.toWorldSpace();
        this.directionToKite.multiplyScalar(this.kiteParameters.L0);

        m1.copy(this.rotationMatrices.RBE).transpose();

        v2.set(this.kiteParameters.xa, 0, this.kiteParameters.za, 0);
        v2.applyMatrix4(m1);
        v2.negate();

        v3.copy(v1);
        v3.add(v2);
        v3.toWorldSpace();
        v3.multiplyScalar(this.kiteParameters.L0);
        v3.y += this.height;

        this.kite.position.set(v3.x, v3.y, v3.z);

        m2.makeRotationZ(-Math.PI / 2);

        m3.makeRotationZ(Math.PI / 2);

        m4.makeRotationX(Math.PI / 2);
        m4.multiply(m3);
        m4.multiply(m1);
        m4.multiply(m2);

        this.kite.setRotationFromMatrix(m4);
    }

    updateWindWindowPosition() {
        let m1 = this.m1;

        let v1 = this.v1;
        let v2 = this.v2;
        let v3 = this.v3;
        let v4 = this.v4;

        let x = this.directionToKite.x;
        let y = this.directionToKite.y;
        let z = this.directionToKite.z;

        this.h = THREE.MathUtils.radToDeg(-Math.atan(x / z));

        this.v = THREE.MathUtils.radToDeg(Math.atan(y / Math.sqrt(x * x + z * z)));

        //The direction to the kite

        v1.copy(this.directionToKite);
        v1.normalize();

        //The Y axis

        v4.set(0, 1, 0, 0);

        //The horizontal vector

        v3.copy(v1);
        v3.cross(v4);
        v3.normalize();

        //The vertical vector

        v2.copy(v3);
        v2.cross(v1);
        v2.normalize();

        m1.copy(this.rotationMatrices.R1E);
        m1.transpose();

        //The kite heading

        v4.set(1, 0, 0, 0);
        v4.applyMatrix4(m1);
        v4.toWorldSpace();

        let angle = THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(v4.dot(v2), -1, 1)));
        let direction = Math.sign(v4.dot(v3));

        let t = angle * direction;

        if (this.t < -90 && t > 90) this.turns--;
        else if (this.t > 90 && t < -90) this.turns++;

        this.t = t;
    }

    updateLines() {
        let m1 = this.m1;

        let v1 = this.v1;
        let v2 = this.v2;
        let v3 = this.v3;
        let v4 = this.v4;
        let v5 = this.v5;

        v5.set(this.directionToKite.x, 0, this.directionToKite.z, 0);
        v5.normalize();
        v5.multiplyScalar(ATTACHMENT_HORIZONTAL_OFFSET);

        //The left line start point

        v1.set(v5.z, this.height, -v5.x, 0);

        //The right line start point

        v2.set(-v5.z, this.height, v5.x, 0);

        this.leftLineStart.position.set(v1.x, v1.y, v1.z);
        this.rightLineStart.position.set(v2.x, v2.y, v2.z);

        m1.copy(this.rotationMatrices.R2E).transpose();

        v5.copy(this.directionToKite);
        v5.y += this.height;

        //The left line end point

        v3.set(0, ATTACHMENT_HORIZONTAL_OFFSET, 0, 0);
        v3.applyMatrix4(m1);
        v3.toWorldSpace();
        v3.add(v5);

        //The right line end point

        v4.set(0, -ATTACHMENT_HORIZONTAL_OFFSET, 0, 0);
        v4.applyMatrix4(m1);
        v4.toWorldSpace();
        v4.add(v5);

        if (this.turns === 0) {
            //The left line

            this.leftLineStart.lookAt(v3.x, v3.y, v3.z);
            this.leftLineStart.scale.z = v1.distanceTo(v3);

            this.leftLineEnd.visible = false;

            //The right line

            this.rightLineStart.lookAt(v4.x, v4.y, v4.z);
            this.rightLineStart.scale.z = v2.distanceTo(v4);

            this.rightLineEnd.visible = false;
        }
        else {
            //The middle point

            v5.copy(this.directionToKite);
            v5.multiplyScalar(0.5);
            v5.y += this.height;

            //The left line

            this.leftLineStart.lookAt(v5.x, v5.y, v5.z);
            this.leftLineStart.scale.z = v1.distanceTo(v5);

            this.leftLineEnd.visible = true;
            this.leftLineEnd.position.set(v5.x, v5.y, v5.z);
            this.leftLineEnd.lookAt(v3.x, v3.y, v3.z);
            this.leftLineEnd.scale.z = v5.distanceTo(v3);

            //The right line

            this.rightLineStart.lookAt(v5.x, v5.y, v5.z);
            this.rightLineStart.scale.z = v2.distanceTo(v5);

            this.rightLineEnd.visible = true;
            this.rightLineEnd.position.set(v5.x, v5.y, v5.z);
            this.rightLineEnd.lookAt(v4.x, v4.y, v4.z);
            this.rightLineEnd.scale.z = v5.distanceTo(v4);
        }
    }

    checkCollisionWithGround() {
        let m1 = this.m1;

        let v1 = this.v1;
        let v2 = this.v2;
        let v3 = this.v3;
        let v4 = this.v4;

        m1.copy(this.rotationMatrices.R1E).transpose();

        let sed = Math.sin(this.kiteState.eta + this.kiteControl.delta);
        let ced = Math.cos(this.kiteState.eta + this.kiteControl.delta);

        v1.set(0, this.kiteControl.l * sed, -this.kiteControl.l * ced, 0);
        v1.applyMatrix4(m1);

        m1.copy(this.rotationMatrices.RBE).transpose();

        v2.set(this.kiteParameters.xa, 0, this.kiteParameters.za, 0);
        v2.applyMatrix4(m1);
        v2.negate();

        v4.copy(v1);
        v4.add(v2);
        v4.toWorldSpace();
        v4.multiplyScalar(this.kiteParameters.L0);
        v4.y += this.height;

        v1.copy(KITE_NOSE);
        v1.applyMatrix4(m1);
        v1.toWorldSpace();
        v1.add(v4);

        v2.copy(KITE_LEFT_TIP);
        v2.applyMatrix4(m1);
        v2.toWorldSpace();
        v2.add(v4);

        v3.copy(KITE_RIGHT_TIP);
        v3.applyMatrix4(m1);
        v3.toWorldSpace();
        v3.add(v4);

        this.collidesWithGround = v1.y <= 0 || v2.y <= 0 || v3.y <= 0;
    }

    separateKiteAndGround() {
        let s1 = this.s1;
        let s2 = this.s2;

        s2.copy(this.kiteState.s);

        let a = INTERPOLATION_STEP;

        this.collidesWithGround = false;

        while (!this.collidesWithGround && a < 1) {
            this.kiteState.s.copy(s1);
            this.kiteState.s.lerp(s2, a);

            this.rotationMatrices.update(this.kiteState);

            this.checkCollisionWithGround();

            a += INTERPOLATION_STEP;
        }

        this.collidesWithGround = true;
    }

}