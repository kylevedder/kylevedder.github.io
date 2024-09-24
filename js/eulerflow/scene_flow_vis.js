import * as THREE from '../three.module.js';
import { PLYLoader } from '../PLYLoader.js';
import { TrackballControls } from '../TrackballControls.js';

function setupSceneFlow(container, slider, frameNumber, dataRoot, traj_length, camera_position, camera_lookat) {
    const scene = new THREE.Scene();
    container.tabIndex = 0;  // Make the container focusable
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xffffff)
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

    function padNumber(number) {
        return number.toString().padStart(4, '0');
    }

    function loadPLYAndFlow(frameIndex) {
        const plyFileName = `${dataRoot}/${padNumber(frameIndex)}.ply`;
        const jsonFileName = `${dataRoot}/${padNumber(frameIndex)}.json`;
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
            // If colors are all white, set to black
            if (geometry.attributes.color.array.every(color => color === 1)) {
                const point_colors = new Float32Array(geometry.attributes.position.count * 3).fill(0);
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(point_colors, 3));
            }
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
                camera.position.set(camera_position[0], camera_position[1], camera_position[2]);
                camera.up.set(0, 0, 1); 
                camera.lookAt(camera_lookat[0], camera_lookat[1], camera_lookat[2]);
                controls.target.set(camera_lookat[0], camera_lookat[1], camera_lookat[2]);
                controls.update();

                isFirstLoad = false;
            }

        }).catch(error => {
            console.error('An error occurred while loading the PLY file or flow data:', error);
        });
    }

    function updateFrame(frameIndex) {
        frameIndex = Math.max(0, Math.min(traj_length - 1, frameIndex));
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

    return { scene, camera, renderer, controls  }
}

export { setupSceneFlow };