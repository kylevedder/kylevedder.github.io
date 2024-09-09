import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const scene = new THREE.Scene();
const container = document.getElementById('jack-traj-render-container');
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

let currentPoints = null;
let trajectorySphereMeshes = [];
let trailSphereMeshes = [];
let trailLines = [];
let isFirstLoad = true;
let trajectoriesData = null;

const slider = document.getElementById('jack-traj-frame-slider');
const frameNumber = document.getElementById('jack-traj-frame-number');

// Load trajectories data
fetch('img/static/gigachad/raw_data/jack_spinning/trajectory.json')
    .then(response => response.json())
    .then(data => {
        trajectoriesData = data;
        loadPLY(0); // Initial load after trajectory data is available
    })
    .catch(error => console.error('Error loading trajectory data:', error));

function padNumber(number) {
    return number.toString().padStart(4, '0');
}

function loadPLY(frameIndex) {
    const fileName = `img/static/gigachad/raw_data/jack_spinning/${padNumber(frameIndex)}.ply`;
    const loader = new PLYLoader();

    loader.load(fileName, function(geometry) {
        if (currentPoints) {
            scene.remove(currentPoints);
        }

        const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
        const points = new THREE.Points(geometry, material);
        
        scene.add(points);
        currentPoints = points;

        if (isFirstLoad) {
            // Set up the camera only on first load
            const box = new THREE.Box3().setFromObject(points);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const distance = maxDim * 0.4; // Reduced distance for a closer view
            const angle = Math.PI / 6; // 30 degrees in radians for a slightly different angle
            camera.position.set(
                -distance * Math.cos(angle),
                -distance * Math.sin(angle),
                distance * 0.5
            );
            camera.up.set(0, 0, 1); // Set +Z as up
            camera.lookAt(0, 0, 0); // Look at the center of the scene
            controls.target.set(0, 0, 0); // Set the control target to the center
            controls.update();

            isFirstLoad = false;
        }


        // Update trajectories
        updateTrajectories(frameIndex);

    }, undefined, function(error) {
        console.error('An error occurred while loading the PLY file:', error);
    });
}

function updateTrajectories(frameIndex) {
    if (!trajectoriesData) return;

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

    trajectoriesData.forEach((trajectory, trajectoryIndex) => {
        const position = trajectory[frameIndex];
        if (!position) return;

        const color = colors[trajectoryIndex % colors.length];

        // Update main trajectory sphere
        if (trajectoryIndex >= trajectorySphereMeshes.length) {
            const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            scene.add(sphereMesh);
            trajectorySphereMeshes.push(sphereMesh);
        }
        trajectorySphereMeshes[trajectoryIndex].position.set(position[0], position[1], position[2]);

        // Update trail
        const trailPositions = [];
        for (let i = 0; i < 17; i++) {
            const trailIndex = Math.max(0, frameIndex - i);
            const trailPos = trajectory[trailIndex];
            if (trailPos) {
                trailPositions.push(new THREE.Vector3(trailPos[0], trailPos[1], trailPos[2]));
                
                if (!trailSphereMeshes[trajectoryIndex]) {
                    trailSphereMeshes[trajectoryIndex] = [];
                }
                if (i >= trailSphereMeshes[trajectoryIndex].length) {
                    const trailSphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                    const trailSphereMaterial = new THREE.MeshBasicMaterial({ color: color });
                    const trailSphereMesh = new THREE.Mesh(trailSphereGeometry, trailSphereMaterial);
                    scene.add(trailSphereMesh);
                    trailSphereMeshes[trajectoryIndex].push(trailSphereMesh);
                }
                trailSphereMeshes[trajectoryIndex][i].position.copy(trailPositions[i]);
            }
        }

        // Update trail line
        if (trailLines[trajectoryIndex]) scene.remove(trailLines[trajectoryIndex]);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(trailPositions);
        const lineMaterial = new THREE.LineBasicMaterial({ color: color });
        trailLines[trajectoryIndex] = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(trailLines[trajectoryIndex]);
    });
}

function updateFrame(frameIndex) {
    frameIndex = Math.max(0, Math.min(16, frameIndex));
    slider.value = frameIndex;
    frameNumber.textContent = frameIndex;
    loadPLY(frameIndex);
}

slider.addEventListener('input', function() {
    updateFrame(parseInt(this.value));
});

document.addEventListener('keydown', function(event) {
    const currentFrame = parseInt(slider.value);
    if (event.key === 'ArrowLeft') {
        updateFrame(currentFrame - 1);
    } else if (event.key === 'ArrowRight') {
        updateFrame(currentFrame + 1);
    }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function() {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
    controls.handleResize();
});