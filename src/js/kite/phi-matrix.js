import * as THREE from "../../../node_modules/three/build/three.module.js"

export class PHIMatrix {
    
    constructor() {
        this.PHI = new THREE.Matrix4();
        
        this.PHI_phi = THREE.Matrix4.ZERO;
        this.PHI_gamma = new THREE.Matrix4();
        this.PHI_eta = new THREE.Matrix4();
        this.PHI_theta = new THREE.Matrix4();
        
        this.PHI_s = [
            this.PHI_phi,
            this.PHI_gamma,
            this.PHI_eta,
            this.PHI_theta
        ];
        
    }
    
    update(kiteState) {
        let sg = Math.sin(kiteState.gamma);
        let cg = Math.cos(kiteState.gamma);

        let se = Math.sin(kiteState.eta);
        let ce = Math.cos(kiteState.eta);

        let st = Math.sin(kiteState.theta);
        let ct = Math.cos(kiteState.theta);
        
        this.PHI.set(
            -cg * ce * st - sg * ct, se * st, ct, 0,
            cg * se, ce, 0, 1,
            cg * ce * ct - sg * st, -se * ct, st, 0,
            0, 0, 0, 0
        );

        this.PHI_gamma.set(
            sg * ce * st - cg * ct, 0, 0, 0,
            -sg * se, 0, 0, 0,
            -sg * ce * ct - cg * st, 0, 0, 0,
            0, 0, 0, 0
        );

        this.PHI_eta.set(
            cg * se * st, ce * st, 0, 0,
            cg * ce, -se, 0, 0,
            -cg * se * ct, -ce * ct, 0, 0,
            0, 0, 0, 0
        );

        this.PHI_theta.set(
            -cg * ce * ct + sg * st, se * ct, -st, 0,
            0, 0, 0, 0,
            -cg * ce * st - sg * ct, se * st, ct, 0,
            0, 0, 0, 0
        );
    }
    
}
