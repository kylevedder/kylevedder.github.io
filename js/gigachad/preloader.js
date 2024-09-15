import { PLYLoader } from '../PLYLoader.js';

// Map from str id to metadata object
const id_to_metadata = await fetch("../../img/static/gigachad/metadata.json").then(response => response.json())

function padNumber(number) {
    return number.toString().padStart(4, '0');
}

self.onmessage = function() {
    const plyLoader = new PLYLoader();
    const loadPromises = [];

    const ids = id_to_metadata.keys()
    
    for (let id of ids) {
        const metadata = id_to_metadata[id]
        const frameTotalFrames = metadata['total_frames']
        const baseUrl = `../../${metadata['data_path']}`

        for (let i = 0; i < frameTotalFrames; i++) {
            const frameNum = padNumber(i);
            const plyUrl = `${baseUrl}${frameNum}.ply`;
            const jsonUrl = `${baseUrl}${frameNum}.json`;

            // Preload PLY
            const plyPromise = new Promise((resolve, reject) => {
                plyLoader.load(plyUrl, resolve, undefined, reject);
            });

            // Preload JSON
            const jsonPromise = fetch(jsonUrl).then(response => response.json());

            loadPromises.push(plyPromise, jsonPromise);
        }
    }
    

    Promise.all(loadPromises)
        .then(() => {
            self.postMessage({ status: 'success' });
        })
        .catch(error => {
            self.postMessage({ status: 'error', error });
        });
};