uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec2 distance;

varying vec2 v_distance;

void main() {
    v_distance = distance;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
