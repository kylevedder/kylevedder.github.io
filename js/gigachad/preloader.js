// import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

import { PLYLoader } from '../PLYLoader.js';

const jackTotalFrames = 16; // 0000 to 0015
const jackBaseUrl = '../../img/static/gigachad/raw_data/jack_spinning/';

const birdTotalFrames = 20; // 0000 to 0019
const birdBaseUrl = '../../img/static/gigachad/raw_data/av2_bird/';

function padNumber(number) {
    return number.toString().padStart(4, '0');
}

self.onmessage = function() {
    const plyLoader = new PLYLoader();
    const loadPromises = [];

    for (let i = 0; i < birdTotalFrames; i++) {
        const frameNum = padNumber(i);
        const plyUrl = `${birdBaseUrl}${frameNum}.ply`;
        const jsonUrl = `${birdBaseUrl}${frameNum}.json`;

        // Preload PLY
        const plyPromise = new Promise((resolve, reject) => {
            plyLoader.load(plyUrl, resolve, undefined, reject);
        });

        // Preload JSON
        const jsonPromise = fetch(jsonUrl).then(response => response.json());

        loadPromises.push(plyPromise, jsonPromise);
    }

    for (let i = 0; i < jackTotalFrames; i++) {
        const frameNum = padNumber(i);
        const plyUrl = `${jackBaseUrl}${frameNum}.ply`;
        const jsonUrl = `${jackBaseUrl}${frameNum}.json`;

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