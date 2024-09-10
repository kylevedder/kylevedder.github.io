// import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

import { PLYLoader } from './PLYLoader.js';

console.log('PLYLoader imported successfully');

const totalFrames = 17; // 0000 to 0016
const baseUrl = '../img/static/gigachad/raw_data/jack_spinning/';

function padNumber(number) {
    return number.toString().padStart(4, '0');
}

self.onmessage = function() {
    const plyLoader = new PLYLoader();
    const loadPromises = [];

    for (let i = 0; i < totalFrames; i++) {
        const frameNum = padNumber(i);
        const plyUrl = `${baseUrl}${frameNum}.ply`;
        const jsonUrl = `${baseUrl}${frameNum}.json`;

        console.log(`Preloading ${frameNum}`);

        // Preload PLY
        const plyPromise = new Promise((resolve, reject) => {
            plyLoader.load(plyUrl, resolve, undefined, reject);
        });

        // Preload JSON
        const jsonPromise = fetch(jsonUrl).then(response => response.json());

        loadPromises.push(plyPromise, jsonPromise);
    }

    Promise.all(loadPromises)
        .then(() => {
            self.postMessage({ status: 'success' });
        })
        .catch(error => {
            self.postMessage({ status: 'error', error });
        });
};