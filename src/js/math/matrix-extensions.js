import * as THREE from "../../../node_modules/three/build/three.module.js"

THREE.Matrix4.ZERO = new THREE.Matrix4().set(
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
);

THREE.Matrix4.prototype.zero = function() {
    for (let i = 0; i < 16; i++) this.elements[i] = 0;

    return this;
};

THREE.Matrix4.prototype.add = function(m) {
    for (let i = 0; i < 16; i++) this.elements[i] += m.elements[i];

    return this;
};

THREE.Matrix4.prototype.subtract = function(m) {
    for (let i = 0; i < 16; i++) this.elements[i] -= m.elements[i];

    return this;
};
