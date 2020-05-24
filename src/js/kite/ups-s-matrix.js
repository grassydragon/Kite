import * as THREE from "../../../node_modules/three/build/three.module.js"

export class UPSsMatrix {

    constructor() {
        this.UPSs = new THREE.Matrix4();
        
        this.UPSs_phi = THREE.Matrix4.ZERO;
        this.UPSs_gamma = new THREE.Matrix4();
        this.UPSs_eta = new THREE.Matrix4();
        this.UPSs_theta = new THREE.Matrix4();
        
        this.UPSs_s = [
            this.UPSs_phi,
            this.UPSs_gamma,
            this.UPSs_eta,
            this.UPSs_theta
        ];
    }
    
    update(kiteParameters, kiteState, kiteControl) {
        let xa = kiteParameters.xa;
        let za = kiteParameters.za;

        let l = kiteControl.l;

        let sg = Math.sin(kiteState.gamma);
        let cg = Math.cos(kiteState.gamma);
        
        let se = Math.sin(kiteState.eta);
        let ce = Math.cos(kiteState.eta);

        let st = Math.sin(kiteState.theta);
        let ct = Math.cos(kiteState.theta);

        let sd = Math.sin(kiteControl.delta);
        let cd = Math.cos(kiteControl.delta);
        
        let sed = Math.sin(kiteState.eta + kiteControl.delta);
        let ced = Math.cos(kiteState.eta + kiteControl.delta);
        
        this.UPSs.set(
            l * (sd * sg * st - cg * sed * ct) - za * cg * se, -l * ced * ct - za * ce, -l * sd * st, -za,
            sg * (xa * st - za * ct - l * cd) - cg * ce * (xa * ct + za * st), (xa * ct + za * st) * se, l * cd - xa * st + za * ct, 0,
            -l * (sd * sg * ct + cg * sed * st) + xa * cg * se, -l * ced * st + xa * ce, l * sd * ct, xa,
            0, 0, 0, 0,
        );
        
        this.UPSs_gamma.set(
            l * (sd * cg * st + sg * sed * ct) + za * sg * se, 0, 0, 0,
            cg * (xa * st - za * ct - l * cd) + sg * ce * (xa * ct + za * st), 0, 0, 0,
            -l * (sd * cg * ct - sg * sed * st) - xa * sg * se, 0, 0, 0,
            0, 0, 0, 0
        );
        
        this.UPSs_eta.set(
            -l * cg * ced * ct - za * cg * ce, l * sed * ct + za * se, 0, 0,
            cg * se * (xa * ct + za * st), (xa * ct + za * st) * ce, 0, 0,
            -l * cg * ced * st + xa * cg * ce, l * sed * st - xa * se, 0, 0,
            0, 0, 0, 0
        );
        
        this.UPSs_theta.set(
            l * (sd * sg * ct + cg * sed * st), l * ced * st, -l * sd * ct, 0,
            sg * (xa * ct + za * st) - cg * ce * (za * ct - xa * st), -(xa * st - za * ct) * se, -xa * ct - za * st, 0,
            l * (sd * sg * st - cg * sed * ct), -l * ced * ct, -l * sd * st, 0,
            0, 0, 0, 0
        );
    }
    
}
