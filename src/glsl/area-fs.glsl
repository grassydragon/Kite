precision mediump float;

uniform vec3 color;
uniform float opacity;
uniform float edge;

varying vec2 v_distance;

void main() {
    vec2 a = min(v_distance / edge, 1.0);

    gl_FragColor = vec4(color, opacity * a.x * a.y);
}
