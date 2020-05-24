import * as THREE from "../../../node_modules/three/build/three.module.js"

export class MsMatrix {

    constructor() {
        this.Ms = new THREE.Matrix4();

        this.Ms_s = [];

        for (let i = 0; i < 4; i++) this.Ms_s.push(new THREE.Matrix4());

        this.m1 = new THREE.Matrix4();
        this.m2 = new THREE.Matrix4();
        this.m3 = new THREE.Matrix4();
        this.m4 = new THREE.Matrix4();
    }

    update(kiteParameters, upssMatrix, phiMatrix) {
        let m1 = this.m1;
        let m2 = this.m2;
        let m3 = this.m3;
        let m4 = this.m4;

        let IG = kiteParameters.IG;

        let UPSs = upssMatrix.UPSs;
        let UPSs_s = upssMatrix.UPSs_s;
        // let UPSs_c = upssMatrix.UPSs_c;

        let PHI = phiMatrix.PHI;
        let PHI_s = phiMatrix.PHI_s;

        //Ms

        m1.copy(UPSs).transpose();
        m1.multiply(UPSs);

        m2.copy(PHI).transpose();
        m2.multiply(IG);
        m2.multiply(PHI);

        this.Ms.copy(m1);
        this.Ms.add(m2);

        //Ms_s

        for (let i = 0; i < 4; i++) {
            m1.copy(UPSs_s[i]).transpose();
            m1.multiply(UPSs);

            m2.copy(UPSs).transpose();
            m2.multiply(UPSs_s[i]);

            m3.copy(PHI_s[i]).transpose();
            m3.multiply(IG);
            m3.multiply(PHI);

            m4.copy(PHI).transpose();
            m4.multiply(IG);
            m4.multiply(PHI_s[i]);

            let Ms_si = this.Ms_s[i];

            Ms_si.copy(m1);
            Ms_si.add(m2);
            Ms_si.add(m3);
            Ms_si.add(m4);
        }
    }

}
