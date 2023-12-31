import * as THREE from "/modules/three.module.js";
let prevTime = performance.now();
let lastTime = 0
import {
  createScene,
  createLights,
  createRenderer,
  createCamera,
  createStars,
} from "/utils/threeUtils.js";
let camera, scene, renderer, lights, stars;

import { createControls, updateControls } from "/utils/Controls.js";
let controls;

import { AxesHelper } from "/utils/AxesHelper.js";
let axesHelper;

import { GridHelper } from "/utils/GridHelper.js";
let gridHelper;

import { Game } from "./Game.js";
let game;

init();
animate();

function init() {
  camera = createCamera();
  renderer = createRenderer(window, camera, document);
  scene = createScene();
  lights = createLights(scene);
  controls = new createControls("noclip", window, camera, document, renderer);
  stars = createStars(scene);
  axesHelper = new AxesHelper(scene);
  gridHelper = new GridHelper(scene);

  game = new Game(scene, camera, controls);
}

function animate() {
  requestAnimationFrame(animate);
  let time = performance.now();
  controls.update(time, prevTime);


  game.update();

  renderer.render(scene, camera);
  prevTime = time;
}
