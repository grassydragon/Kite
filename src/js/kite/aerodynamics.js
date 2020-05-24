import * as THREE from "../../../node_modules/three/build/three.module.js"

export class Aerodynamics {

    constructor() {
        this.Q = new THREE.Vector4();

        this.f = new THREE.Vector4();
        this.m = new THREE.Vector4();

        this.m1 = new THREE.Matrix4();
        this.m2 = new THREE.Matrix4();
    }

    update(kiteParameters, upssMatrix, phiMatrix, va, omega) {
        let f = this.f;
        let m = this.m;

        let m1 = this.m1;
        let m2 = this.m2;

        let UPSs = upssMatrix.UPSs;
        let PHI = phiMatrix.PHI;

        let va2 = va.lengthSq();

        let alpha = Math.atan(va.z / va.x);
        let beta = Math.asin(va.y / Math.sqrt(va2));

        let p = kiteParameters.eb * omega.x / (2 * kiteParameters.vt);
        let q = kiteParameters.ec * omega.y / kiteParameters.vt;
        let r = kiteParameters.eb * omega.z / (2 * kiteParameters.vt);

        let mv = kiteParameters.mu * va2;

        f.set(
            mv * (kiteParameters.Cx0 + kiteParameters.Cxa * alpha),
            mv * kiteParameters.Cyb * beta,
            mv * (kiteParameters.Cz0 + kiteParameters.Cza * alpha),
            0
        );

        m.set(
            mv * kiteParameters.eb * (kiteParameters.Clb * beta + kiteParameters.Clp * p),
            mv * kiteParameters.ec * (kiteParameters.Cm0 + kiteParameters.Cma * alpha + kiteParameters.Cmq * q),
            mv * kiteParameters.eb * (kiteParameters.Cnb * beta + kiteParameters.Cnr * r),
            0
        );

        m1.copy(UPSs).transpose();

        f.applyMatrix4(m1);

        m2.copy(PHI).transpose();

        m.applyMatrix4(m2);

        this.Q.copy(f);
        this.Q.add(m);
    }

}
