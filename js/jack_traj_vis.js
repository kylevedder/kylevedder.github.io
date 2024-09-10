import * as THREE from './three.module.js';
import { PLYLoader } from './PLYLoader.js';
import { TrackballControls } from './TrackballControls.js';

const scene = new THREE.Scene();
const container = document.getElementById('jack-traj-render-container');
container.tabIndex = 0; 
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({   
 antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new   
 TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan   
 = false;
controls.staticMoving = true;
controls.dynamicDampingFactor   
 = 0.3;

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

let currentPoints = null;
let trajectorySphereMeshes = [];
let trailSphereMeshes = [];
let trailLines = [];
let isFirstLoad = true;
let trajectoriesData = []; // Array to store trajectories with different substeps

const slider = document.getElementById('jack-traj-frame-slider');
const frameNumber = document.getElementById('jack-traj-frame-number');

// Load multiple trajectories data
const trajectoryFiles = [
    'img/static/gigachad/raw_data/jack_spinning/trajectories_num_substeps_1.json',
    'img/static/gigachad/raw_data/jack_spinning/trajectories_num_substeps_2.json',
    'img/static/gigachad/raw_data/jack_spinning/trajectories_num_substeps_4.json',
    'img/static/gigachad/raw_data/jack_spinning/trajectories_num_substeps_8.json'
];

Promise.all(trajectoryFiles.map(file => 
    fetch(file)
        .then(response => response.json())
))
.then(data => {
    trajectoriesData = data;
    loadPLY(0); 
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
            const box = new THREE.Box3().setFromObject(points);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const distance = maxDim * 0.3; 
            const angle = Math.PI / 6; 
            camera.position.set(
                -distance * Math.cos(angle),
                -distance * Math.sin(angle),
                distance * 0.5
            );
            camera.up.set(0, 0, 1); 
            camera.lookAt(-6, 0, 0); 
            controls.target.set(-6, 0, 0); 
            controls.update();

            isFirstLoad = false;
        }

        updateTrajectories(frameIndex);

    }, undefined, function(error) {
        console.error('An error occurred while loading the PLY file:', error);
    });
}


function updateTrajectories(frameIndex) {
    if (!trajectoriesData.length) return;

    const baseColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

    trajectoriesData.forEach((trajectoryData, substepIndex) => {
        const substepsPerFrame = 2 ** substepIndex;

        trajectoryData.forEach((trajectory, trajectoryIndex) => {
            // Calculate the effective frame index for this substep level
            const effectiveFrameIndex = frameIndex * substepsPerFrame;

            // Check if the effective frame index is within the trajectory bounds
            if (effectiveFrameIndex >= trajectory.length) return;

            const position = trajectory[effectiveFrameIndex];

            const color = new THREE.Color(baseColors[trajectoryIndex % baseColors.length]);
            color.lerp(new THREE.Color(0xffffff), substepIndex / (trajectoriesData.length - 1));

            if (trajectoryIndex >= trajectorySphereMeshes.length) {
                trajectorySphereMeshes.push([]);
            }
            if (substepIndex >= trajectorySphereMeshes[trajectoryIndex].length) {
                const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
                const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
                const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
                scene.add(sphereMesh);
                trajectorySphereMeshes[trajectoryIndex].push(sphereMesh);
            }
            trajectorySphereMeshes[trajectoryIndex][substepIndex].position.set(position[0], position[1], position[2]);

            const trailPositions = [];
            for (let i = 0; i < 16 * substepsPerFrame; i++) {
                const trailIndex = Math.max(0, effectiveFrameIndex - i);
                const trailPos = trajectory[trailIndex];
                if (trailPos) {
                    trailPositions.push(new THREE.Vector3(trailPos[0], trailPos[1], trailPos[2]));

                    if (!trailSphereMeshes[trajectoryIndex]) {
                        trailSphereMeshes[trajectoryIndex] = [];
                    }
                    if (substepIndex >= trailSphereMeshes[trajectoryIndex].length) {
                        trailSphereMeshes[trajectoryIndex].push([]);
                    }
                    if (i >= trailSphereMeshes[trajectoryIndex][substepIndex].length) {
                        const trailSphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                        const trailSphereMaterial = new THREE.MeshBasicMaterial({ color: color });
                        const trailSphereMesh = new THREE.Mesh(trailSphereGeometry, trailSphereMaterial);
                        scene.add(trailSphereMesh);
                        trailSphereMeshes[trajectoryIndex][substepIndex].push(trailSphereMesh);
                    }
                    trailSphereMeshes[trajectoryIndex][substepIndex][i].position.copy(trailPositions[i]);
                }
            }

            if (trailLines[trajectoryIndex]) {
                if (trailLines[trajectoryIndex][substepIndex]) {
                    scene.remove(trailLines[trajectoryIndex][substepIndex]);
                }
            } else {
                trailLines[trajectoryIndex] = [];
            }
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(trailPositions);
            const lineMaterial = new THREE.LineBasicMaterial({ color: color });
            trailLines[trajectoryIndex][substepIndex] = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(trailLines[trajectoryIndex][substepIndex]);
        });
    });
}

function updateFrame(frameIndex) {
    frameIndex = Math.max(0, Math.min(15, frameIndex));
    slider.value = frameIndex;
    frameNumber.textContent = frameIndex;
    loadPLY(frameIndex);
}

slider.addEventListener('input', function() {
    updateFrame(parseInt(this.value));
});

let isMouseOver = false;

container.addEventListener('mouseenter', () => {
    isMouseOver = true;
    container.focus();  // Focus on the container when the mouse enters
});

container.addEventListener('mouseleave', () => {
    isMouseOver = false;
    container.blur();  // Blur the container when the mouse leaves
});

container.addEventListener('keydown', function(event) {
    if (!isMouseOver) return;  // Ensure the key press is registered only when the mouse is over the container

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