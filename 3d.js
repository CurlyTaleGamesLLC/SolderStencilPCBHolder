// Import Three.js and STLExporter module
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';

let scene, camera, renderer;
let cubes = [];
let fingers = [];
let base;
let fingerLeft, fingerRight;
let flapLeft, flapRight;
const cubeSize = 1; // Base size of the cubes
let fingerThreshold = 25;

let currentX, currentY, currentZ;


function init() {
    // Create the scene and the camera
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(200, 200, 200, 200, 0.001, 1000);
    camera.zoom = 2.9;
    camera.updateProjectionMatrix();

    // Create the renderer and attach it to the canvas
    const canvas = document.getElementById('myCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(200, 200);
    renderer.setClearColor(0x333333); // Set the background color
    renderer.shadowMap.enabled = true; // Enable shadow mapping


    adjustCanvasSize();

    // Create lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Soft white light
    scene.add(ambientLight);

    createCubes();

    // Load the STL file into the scene
    loadSTLModel(true);
    loadSTLModel(false);

    loadFlapSTLModel(true);
    loadFlapSTLModel(false);

    camera.position.z = 50;

    // Add event listener for STL export
    document.getElementById('export-stl').addEventListener('click', function () {
        const exporter = new STLExporter();
        const stlString = exporter.parse(scene);
        const blob = new Blob([stlString], { type: 'text/plain' });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'PCBStencil_Tray.stl';
        a.click();
    });

    animate();
}

function loadSTLModel(isLeft = true) {
    // Create a new STLLoader
    const loader = new STLLoader();

    // Load your STL file
    loader.load('finger.stl', function (geometry) {
        // Create a material
        const material = new THREE.MeshStandardMaterial({ color: 0x0babc8, flatShading: true });

        // Create a mesh with the geometry and the material
        const mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.x = -Math.PI / 2;

        if(isLeft){
            fingerLeft = mesh;
        }
        else{
            fingerRight = mesh;
            mesh.rotation.z = Math.PI;
        }

        // Add the mesh to the scene
        scene.add(mesh);

        UpdateFingers();
        UpdateFlaps();
    }, onProgress, onError);
}

function loadFlapSTLModel(isLeft = true) {
    // Create a new STLLoader
    const loader = new STLLoader();

    // Load your STL file
    loader.load('flap.stl', function (geometry) {
        // Create a material
        const material = new THREE.MeshStandardMaterial({ color: 0x0babc8, flatShading: true });

        // Create a mesh with the geometry and the material
        const mesh = new THREE.Mesh(geometry, material);

        if(isLeft){
            flapLeft = mesh;
        }
        else{
            flapRight = mesh;
        }

        mesh.position.x = isLeft ? -67 : 67;
        if(isLeft){
            mesh.rotation.z = -Math.PI;
        }

        // Add the mesh to the scene
        scene.add(mesh);

        UpdateFingers();
        UpdateFlaps();

    }, onProgress, onError);
}

function onProgress(xhr) {
    if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
    }
}

function onError(error) {
    console.error('An error happened loading the STL model', error);
}

function UpdateFlaps(){

    if(currentZ == null){
        return;
    }

    if(flapLeft != null){
        flapLeft.position.z = -1;
        flapLeft.scale.set(1, 1, currentZ + 2);

    }
    if(flapRight != null){
        flapRight.position.z = -1;
        flapRight.scale.set(1, 1, currentZ + 2);
    }
}

function createCubes() {
    const material = new THREE.MeshStandardMaterial({ color: 0x0babc8 });
    const cubePosition = { x: 0, y: 0, z: 0 };
    const cubeScale = { x: 10, y: 10, z: 1.6 };

    for(let i = 0; i < 4; i++) {
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
        cube.scale.set(cubeScale.x, cubeScale.y, cubeScale.z);
        cube.castShadow = true; // Enable shadows for this object
        cube.receiveShadow = true; // Allow this object to receive shadows
        scene.add(cube);
        cubes.push(cube);
    }

    // Create the fingers
    const fingerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const fingerPosition = { x: 0, y: 0, z: 0 };
    const fingerScale = { x: 10, y: 10, z: 1.6 };

    for(let i = 0; i < 4; i++) {
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        let cubeFinger = new THREE.Mesh(geometry, material);
        cubeFinger.position.set(fingerPosition.x, fingerPosition.y, fingerPosition.z);
        cubeFinger.scale.set(fingerScale.x, fingerScale.y, fingerScale.z);
        cubeFinger.castShadow = true; // Enable shadows for this object
        cubeFinger.receiveShadow = true; // Allow this object to receive shadows
        scene.add(cubeFinger);
        fingers.push(cubeFinger);
    }

    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x0a6070 });
    const basePosition = { x: 0, y: 0, z: -0.8 };
    const baseScale = { x: 118, y: 118, z: 2 };

    const baseGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    let baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.position.set(basePosition.x, basePosition.y, basePosition.z);
    baseMesh.scale.set(baseScale.x, baseScale.y, baseScale.z);
    baseMesh.castShadow = true; // Enable shadows for this object
    baseMesh.receiveShadow = true; // Allow this object to receive shadows
    scene.add(baseMesh);
    base = baseMesh;
}

function adjustPlate(width, length, height) {

    currentX = width;
    currentY = length;
    currentZ = height;

    let maxX = 118;
    let maxY = 118;

    let fingerX = width > 97 ? 8 : 10;
    let fingerY = 20;

    let halfWidth = width / 2;
    let halfLength = length / 2;

    let cubesX = [
        (maxX / 2) - halfWidth - fingerX,
        (maxX / 2) - halfWidth - fingerX,
        maxX,
        maxX
    ];

    let cubesY = [
        length,
        length,
        (maxY / 2) - halfLength,
        (maxY / 2) - halfLength
    ];

    cubes[0].scale.set(cubesX[0], cubesY[0], height); // Left
    cubes[1].scale.set(cubesX[1], cubesY[1], height); // Right
    cubes[2].scale.set(cubesX[2], cubesY[2], height); // Top
    cubes[3].scale.set(cubesX[3], cubesY[3], height); // Bottom

    // Adjust positions after scaling
    cubes[0].position.x = (maxX / 2) - (cubesX[0] / 2);
    cubes[1].position.x = -(maxX / 2) + (cubesX[1] / 2);
    cubes[2].position.y = halfLength + (cubesY[2] / 2);
    cubes[3].position.y = -halfLength - (cubesY[3] / 2);

    // Adjust fingers

    let fingerScaleY = (cubesY[0] / 2) - (fingerY / 2);

    if(currentY < fingerThreshold){
        fingerScaleY = length / 2;
        fingerY = (length / 2) * 1.5;
    }

    fingers[0].scale.set(fingerX, fingerScaleY, height); // Top Left
    fingers[1].scale.set(fingerX, fingerScaleY, height); // Top Right
    fingers[2].scale.set(fingerX, fingerScaleY, height); // Bottom Left
    fingers[3].scale.set(fingerX, fingerScaleY, height); // Bottom Right

     // Adjust finger positions after scaling

    let fingerPositionX = (width / 2) + (fingerX / 2);//
    let fingerPositionY = (fingerY / 2) + (fingerScaleY / 2);

    console.log(fingerX);

    console.log(fingerPositionX);

    fingers[0].position.x = -fingerPositionX;
    fingers[1].position.x = fingerPositionX;
    fingers[2].position.x = -fingerPositionX;
    fingers[3].position.x = fingerPositionX;

    fingers[0].position.y = fingerPositionY;
    fingers[1].position.y = fingerPositionY;
    fingers[2].position.y = -fingerPositionY;
    fingers[3].position.y = -fingerPositionY;

    UpdateFingers();
    UpdateFlaps();

    base.position.set(0, 0, (-height/2) - 1);
}

function UpdateFingers(){

    if(currentX == null){
        return;
    }

    if(fingerLeft != null){
        fingerLeft.visible = (currentY >= fingerThreshold);
    }
    if(fingerRight != null){
        fingerRight.visible = (currentY >= fingerThreshold);
    }

    let fingerX = 10;
    let fingerY = 20;

    let fingerScaleY = (currentY / 2) - (fingerY / 2);

    let fingerPositionX = (currentX / 2) + (fingerX / 2);//
    let fingerPositionY = (fingerY / 2) + (fingerScaleY / 2);

    if(fingerLeft){
        fingerLeft.position.x = -fingerPositionX + 5;
        fingerLeft.position.z = -1;
        fingerLeft.scale.set(1, currentZ + 2, 1);
    }
    if(fingerRight){
        fingerRight.position.x = fingerPositionX - 5;
        fingerRight.position.z = -1;
        fingerRight.scale.set(1, currentZ + 2, 1);

        console.log(fingerRight.position, fingerRight.scale, currentZ);
    }
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function adjustCanvasSize() {
    // Get the container element
    const container = document.getElementById('canvas-container');

    // Get computed styles of the container
    const style = getComputedStyle(container);

    // Calculate the padding
    const paddingWidth = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingHeight = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

    // Calculate the available size inside the container
    const sizeWidth = container.clientWidth - paddingWidth;
    const sizeHeight = container.clientHeight - paddingHeight;

    // Calculate the available size inside the container
    const size = container.clientWidth - paddingWidth;

    const sizeConstant = 480;

    // Adjust the camera aspect ratio and frustum
    camera.left = sizeConstant / -2;
    camera.right = sizeConstant / 2;
    camera.top = sizeConstant / 2;
    camera.bottom = sizeConstant / -2;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(size, size);
}

// Call this function when the window is resized
function onWindowResize() {
    // Adjust the canvas size on window resize
    adjustCanvasSize();
}

window.addEventListener('resize', onWindowResize);

init();

function handleInputChange() {
    // Get the values from the inputs
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const thickness = parseFloat(document.getElementById('thickness').value);

    const tolerance = parseFloat(document.getElementById('tolerance').value);

    console.log(width, height, thickness, tolerance);

    // Log the values to the console
    console.log('Width:', width + tolerance, 'Height:', height + tolerance, 'Thickness:', thickness);
    adjustPlate(width + tolerance, height + tolerance, thickness);
}

// Add change event listeners to the form inputs
document.getElementById('width').addEventListener('change', handleInputChange);
document.getElementById('height').addEventListener('change', handleInputChange);
document.getElementById('thickness').addEventListener('change', handleInputChange);
document.getElementById('tolerance').addEventListener('change', handleInputChange);

// Call the function once to log the initial values on page load
handleInputChange();


