import * as THREE from "THREE";
var GPUpSys = require("three-gpu-particle-system")(THREE);

var tick = 0,
  clock = new THREE.Clock(),
  options,
  spawnerOptions,
  particleSystem;

// The GPU Particle system extends THREE.Object3D, and so you can use it
// as you would any other scene graph component.	Particle positions will be
// relative to the position of the particle system, but you will probably only need one
// system for your whole scene
particleSystem = new GPUpSys({
  maxParticles: 25000
});
// options passed during each spawned
options = {
  position: new THREE.Vector3(),
  positionRandomness: 0.3,
  velocity: new THREE.Vector3(),
  velocityRandomness: 0.5,
  color: 0xaa88ff,
  colorRandomness: 0.2,
  turbulence: 0.5,
  lifetime: 2,
  size: 5,
  sizeRandomness: 1
};
spawnerOptions = {
  spawnRate: 15000,
  horizontalSpeed: 1.5,
  verticalSpeed: 1.33,
  timeScale: 1
};

var delta = clock.getDelta() * spawnerOptions.timeScale;
tick += delta;
if (tick < 0) tick = 0;
if (delta > 0) {
  options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 20;
  options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
  options.position.z =
    Math.sin(
      tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed
    ) * 5;
  for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
    // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
    // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
    particleSystem.spawnParticle(options);
  }
}
particleSystem.update(tick);
