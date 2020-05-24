export class Objective {

    constructor(text, minH, maxH, minV, maxV, minT, maxT, turns, landing = false) {
        this.text = text;
        this.minH = minH;
        this.maxH = maxH;
        this.minV = minV;
        this.maxV = maxV;
        this.minT = minT;
        this.maxT = maxT;
        this.turns = turns;
        this.landing = landing;
    }

    get hAvailable() {
        return this.minH != null || this.maxH != null;
    }

    get vAvailable() {
        return this.minV != null || this.maxV != null;
    }

    get tAvailable() {
        return this.minT != null || this.maxT != null;
    }

    get turnsAvailable() {
        return this.turns != null;
    }

    checkWindWindowPosition(h, v, t, turns) {
        if (this.hAvailable && (h < this.minH || h > this.maxH)) return false;

        if (this.vAvailable && (v < this.minV || v > this.maxV)) return false;

        if (this.tAvailable && (t < this.minT || t > this.maxT)) return false;

        if (this.turnsAvailable && turns !== this.turns) return false;

        return true;
    }


}
