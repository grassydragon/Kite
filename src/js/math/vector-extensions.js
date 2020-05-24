import * as THREE from "../../../node_modules/three/build/three.module.js"

THREE.Vector4.prototype.cross = function(v) {
    let x = this.x;
    let y = this.y;
    let z = this.z;

    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;

    return this;
};

THREE.Vector4.prototype.distanceTo = function(v) {
    let dx = v.x - this.x;
    let dy = v.y - this.y;
    let dz = v.z - this.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

THREE.Vector4.prototype.toWorldSpace = function() {
    let x = this.x;
    let y = this.y;
    let z = this.z;

    this.x = -y;
    this.y = -z;
    this.z = x;

    return this;
};
