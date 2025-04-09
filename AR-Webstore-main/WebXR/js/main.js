import * as THREE from "three";
import { ARButton } from '../../node_modules/three/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controller;
init();
animate();

function init() {
    // Create the scene
    scene = new THREE.Scene();

    // Set up the camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    // Set up the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add AR button
    const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ['hit-test'],
    });
    document.body.appendChild(arButton);

    // Set up controller for placing objects
    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    // Load multiple models
    loadModels();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function loadModels() {
    const loader = new GLTFLoader();
    const models = [
        { url: '../models/chair.glb', position: new THREE.Vector3(0, 0, -1) },
        { url: '../models/pot.glb', position: new THREE.Vector3(0.5, 0, -1) },
        { url: '../models/OfficeChair.glb', position: new THREE.Vector3(-0.5, 0, -1) },
    ];

    models.forEach(({ url, position }) => {
        loader.load(url, (gltf) => {
            const model = gltf.scene;
            model.position.copy(position);
            scene.add(model);
        });
    });
}

function onSelect() {
    // Load models at controller position when tapped
    const loader = new GLTFLoader();
    loader.load('../models/model1.glb', (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, -1).applyMatrix4(controller.matrixWorld);
        model.scale.set(0.3, 0.3, 0.3);
        scene.add(model);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    renderer.render(scene, camera);
}
