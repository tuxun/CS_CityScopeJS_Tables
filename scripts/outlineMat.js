//import { outlineMat } from "./outlineMat";

import * as THREE from "THREE";

export function outlineMat(obj) {
  var shader = {
    outline: {
      vertex_shader: [
        "uniform float offset;",
        "void main() {",
        "vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );",
        "gl_Position = projectionMatrix * pos;",
        "}"
      ].join("\n"),
      fragment_shader: [
        "void main(){",
        "gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.1 );",
        "}"
      ].join("\n")
    }
  };

  var uniforms = {
    offset: {
      type: "f",
      value: 1
    }
  };
  var outShader = shader["outline"];
  var matShader = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: outShader.vertex_shader,
    fragmentShader: outShader.fragment_shader
  });
  obj.material = matShader;
  obj.material.depthWrite = false;
}
