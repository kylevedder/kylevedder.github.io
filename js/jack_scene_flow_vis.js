import * as THREE from './three.module.js';
import { PLYLoader } from './PLYLoader.js';
import { TrackballControls } from './TrackballControls.js';

const scene = new THREE.Scene();
const container = document.getElementById('jack-flow-render-container');
container.tabIndex = 0;  // Make the container focusable
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
let flowLines = null;
let isFirstLoad = true;

const slider = document.getElementById('jack-flow-frame-slider');
const frameNumber = document.getElementById('jack-flow-frame-number');

function padNumber(number) {
    return number.toString().padStart(4, '0');
}

function loadPLYAndFlow(frameIndex) {
    const plyFileName = `img/static/gigachad/raw_data/jack_spinning/${padNumber(frameIndex)}.ply`;
    const jsonFileName = `img/static/gigachad/raw_data/jack_spinning/${padNumber(frameIndex)}.json`;
    const plyLoader = new PLYLoader();
    
    Promise.all([
        new Promise((resolve, reject) => {
            plyLoader.load(plyFileName, resolve, undefined, reject);
        }),
        fetch(jsonFileName).then(response => response.json())
    ]).then(([geometry, flowData]) => {
        if (currentPoints) {
            scene.remove(currentPoints);
        }
        if (flowLines) {
            scene.remove(flowLines);
        }

        const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
        const points = new THREE.Points(geometry, material);
        
        scene.add(points);
        currentPoints = points;

        // Create flow lines
        const lineGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        const pointPositions = geometry.attributes.position.array;
        for (let i = 0; i < pointPositions.length; i += 3) {
            const startX = pointPositions[i];
            const startY = pointPositions[i + 1];
            const startZ = pointPositions[i + 2];
            
            const flow = flowData[i / 3];
            const endX = startX + flow[0];
            const endY = startY + flow[1];
            const endZ = startZ + flow[2];

            positions.push(startX, startY, startZ);
            positions.push(endX, endY, endZ);

            // Color gradient from blue to red
            colors.push(0, 0, 1);
            colors.push(1, 0, 0);
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
        flowLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(flowLines);

        if (isFirstLoad) {
            // Set up the camera only on first load
            const box = new THREE.Box3().setFromObject(points);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const distance = maxDim * 0.4;
            const angle = Math.PI / 6;
            camera.position.set(
                -distance * Math.cos(angle),
                -distance * Math.sin(angle),
                distance * 0.5
            );
            camera.up.set(0, 0, 1);
            camera.lookAt(0, 0, 0);
            controls.target.set(0, 0, 0);
            controls.update();

            isFirstLoad = false;
        }

    }).catch(error => {
        console.error('An error occurred while loading the PLY file or flow data:', error);
    });
}

function updateFrame(frameIndex) {
    frameIndex = Math.max(0, Math.min(16, frameIndex));
    slider.value = frameIndex;
    frameNumber.textContent = frameIndex;
    loadPLYAndFlow(frameIndex);
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

// Initial load
loadPLYAndFlow(0);
