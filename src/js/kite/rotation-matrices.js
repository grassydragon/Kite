import * as THREE from "../../../node_modules/three/build/three.module.js"

export class RotationMatrices {
    
    constructor() {
        this.R1E = new THREE.Matrix4();
        this.R21 = new THREE.Matrix4();
        this.RB2 = new THREE.Matrix4();
        this.R2E = new THREE.Matrix4();
        this.RBE = new THREE.Matrix4();
    }

    update(kiteState) {
        let sp = Math.sin(kiteState.phi);
        let cp = Math.cos(kiteState.phi);

        let sg = Math.sin(kiteState.gamma);
        let cg = Math.cos(kiteState.gamma);

        let se = Math.sin(kiteState.eta);
        let ce = Math.cos(kiteState.eta);

        let st = Math.sin(kiteState.theta);
        let ct = Math.cos(kiteState.theta);
        
        this.R1E.set(
            cg * cp, cg * sp, -sg, 0,
            -sp, cp, 0, 0,
            sg * cp, sg * sp, cg, 0,
            0, 0, 0, 0
        );
        
        this.R21.set(
            1, 0, 0, 0,
            0, ce, se, 0,
            0, -se, ce, 0,
            0, 0, 0, 0
        );
        
        this.RB2.set(
            ct, 0, -st, 0,
            0, 1, 0, 0,
            st, 0, ct, 0,
            0, 0, 0, 0
        );

        this.R2E.copy(this.R21);
        this.R2E.multiply(this.R1E);

        this.RBE.copy(this.RB2);
        this.RBE.multiply(this.R2E);
    }
    
}