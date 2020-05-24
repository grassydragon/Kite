import * as THREE from "../../../node_modules/three/build/three.module.js"

export class PotentialEnergy {

    constructor() {
        this.U_phi = 0;
        this.U_gamma = 0;
        this.U_eta = 0;
        this.U_theta = 0;

        this.U_s = new THREE.Vector4();
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

        let sed = Math.sin(kiteState.eta + kiteControl.delta);
        let ced = Math.cos(kiteState.eta + kiteControl.delta);

        this.U_gamma = -l * sg * ced - xa * (cg * ct - sg * st * ce) - za * (cg * st + sg * ct * ce);

        this.U_eta = -l * cg * sed + xa * cg * st * se - za * cg * ct * se;

        this.U_theta = xa * (sg * st - cg * ct * ce) - za * (sg * ct + cg * st * ce);

        this.U_s.set(this.U_phi, this.U_gamma, this.U_eta, this.U_theta);
    }

}
