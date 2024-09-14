HEADER {"page_name": "GIGACHAD: Fitting Neural Scene Flow Volumes", "teaser_img": "https://vedder.io/img/static/gigachad/gigachad_bird_flow_cropped.png"}

<style>
[id*="render-container"] {
    width: 100%;
    height: 600px;
    border: 1px solid #ccc;
    margin-top: 20px;
}
[id*="slider-container"] {
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
}
[id*="frame-slider"] {
    flex-grow: 1;
    margin-right: 10px;
}
[id*="frame-number"] {
    width: 50px;
    text-align: right;
}

#jack {
    visibility: hidden;
}

#bird {
    visibility: hidden;
}

#filler {
    width: 100%;
    height: 600px;
    border: 1px solid #ccc;
    margin-top: 20px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    /* Set font size */
    font-size: 24px;
}

</style>


# GIGACHAD: Fitting Neural Scene Flow Volumes

## [Kyle Vedder](http://vedder.io), [Neehar Peri](http://www.neeharperi.com/), [Ishan Khatri](https://ishan.khatri.io/), [Siyi Li](http://linkedin.com/in/siyi-li-14a958328), [Eric Eaton](https://www.seas.upenn.edu/~eeaton/), [Yue Wang](https://yuewang.xyz/), [Zhiding Yu](https://chrisding.github.io/), [Deva Ramanan](https://www.cs.cmu.edu/~deva/), and [Joachim Pehserl](https://www.linkedin.com/in/joachim-pehserl-45514a98/)


<div class="centered">
# [[Paper]](TODO)
</div>


## Abstract

We present a step function unlock in unsupervised scene flow capabilities. Our unsupervised method, GIGACHAD, outperforms _all_ prior art, unsupervised or supervised, on the Argoverse 2 2024 Scene Flow Challenge leaderboard, as well as other common benchmarks. GIGACHAD's success is powered by straightforwardly fitting a neural scene flow volume to an entire time-conditioned sequence of observations by optimizing against multi-frame objectives, enabling high quality scene flow estimation even for small, sparsely observed objects. Consequently, GIGACHAD is capable of providing high quality motion descriptions for small objects, including those outside any labeled object taxonomy, making good on the promise of scene flow as a strong signal for open-world object detection. GIGACHAD provides good quality scene flow out-of-the-box on real-world data in multiple domains, including dynamic tabletop settings, and demonstrates emergent capabilities such as point tracking via Euler integration.

<!-- Side by side images from img/static/gigachad/gigachad_bird_flow_cropped.png and  img/static/gigachad/gigachad_bird_trajectory_cropped.png -->
<!-- <div style="display: flex" class="centered">
<img src="img/static/gigachad/gigachad_bird_flow_cropped.png" style="width:49%;" />
<img src="img/static/gigachad/gigachad_bird_trajectory_cropped.png" style="width:49%"/>
</div> -->


## Interactive Visualizations

<!-- Side by side images from img/static/gigachad/gigachad_bird_flow_cropped.png and  img/static/gigachad/gigachad_bird_trajectory_cropped.png -->
<div style="display: flex" class="centered">
<img id="img-bird" src="img/static/gigachad/bird.png" style="width:49%;"/>
<img id="img-jack" src="img/static/gigachad/jack.png" style="width:49%"/>
</div>

<div id="filler">Click one of the images above to view an interactive visualization of the scene flow and a trajectory.</div>

<div id="bird">

### Argoverse 2 Bird scene flow

<div class="centered">
<div id="bird-flow-render-container"></div>
<div id="bird-flow-slider-container">
<input type="range" id="bird-flow-frame-slider" min="0" max="19" value="0" class="centered">
Frame <span id="bird-flow-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.

</div>
<!-- <script type="module" src="js/gigachad/bird_scene_flow_vis.js"></script> -->




### Argoverse 2 Bird tracking

<div class="centered">
<div id="bird-traj-render-container"></div>
<div id="bird-traj-slider-container">
<input type="range" id="bird-traj-frame-slider" min="0" max="19" value="0" class="centered">
Frame <span id="bird-traj-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.

Color represents Euler integration with shorter step sizes from $\Delta t = 1$ to $\frac{1}{8}$. Full red represents $\Delta t = 1$.
</div>
<!-- <script type="module" src="js/gigachad/bird_traj_vis.js"></script> -->
</div>


<div id="jack">

### Jack scene flow

<div class="centered">
<div id="jack-flow-render-container"></div>
<div id="jack-flow-slider-container">
<input type="range" id="jack-flow-frame-slider" min="0" max="15" value="0" class="centered">
Frame <span id="jack-flow-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.
</div>
<!-- <script type="module" src="js/gigachad/jack_scene_flow_vis.js"></script> -->


### Jack point tracking with multiple types of Euler Integration

<div class="centered">
<div id="jack-traj-render-container"></div>
<div id="jack-traj-slider-container">
<input type="range" id="jack-traj-frame-slider" min="0" max="15" value="0" class="centered">
Frame <span id="jack-traj-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.

Color represents Euler integration with shorter step sizes from $\Delta t = 1$ to $\frac{1}{8}$. Full red represents $\Delta t = 1$.
</div>
<!-- <script type="module" src="js/gigachad/jack_traj_vis.js"></script> -->
</div>


<script type="module">
import { setupBirdSceneFlow } from './js/gigachad/bird_scene_flow_vis.js';
import { setupBirdTraj  } from './js/gigachad/bird_traj_vis.js';

import { setupJackSceneFlow  } from './js/gigachad/jack_scene_flow_vis.js';
import { setupJackTraj  } from './js/gigachad/jack_traj_vis.js';

const bird_flow_container = document.getElementById('bird-flow-render-container');
const bird_flow_slider = document.getElementById('bird-flow-frame-slider');
const bird_flow_frame_number = document.getElementById('bird-flow-frame-number');
const bird_traj_container = document.getElementById('bird-traj-render-container');
const bird_traj_slider = document.getElementById('bird-traj-frame-slider');
const bird_traj_frame_number = document.getElementById('bird-traj-frame-number');



const jack_flow_container = document.getElementById('jack-flow-render-container');
const jack_flow_slider = document.getElementById('jack-flow-frame-slider');
const jack_flow_frame_number = document.getElementById('jack-flow-frame-number');
const jack_traj_container = document.getElementById('jack-traj-render-container');
const jack_traj_slider = document.getElementById('jack-traj-frame-slider');
const jack_traj_frame_number = document.getElementById('jack-traj-frame-number');

let bird_flow = setupBirdSceneFlow(bird_flow_container, bird_flow_slider, bird_flow_frame_number);
let bird_traj = setupBirdTraj(bird_traj_container, bird_traj_slider, bird_traj_frame_number);

let jack_flow = setupJackSceneFlow(jack_flow_container, jack_flow_slider, jack_flow_frame_number);
let jack_traj = setupJackTraj(jack_traj_container, jack_traj_slider, jack_traj_frame_number);


document.getElementById("bird").style.display = "none";
document.getElementById("jack").style.display = "none";

// Set to visible 
document.getElementById("bird").style.visibility = "visible";
document.getElementById("jack").style.visibility = "visible";










function showBird() {
    document.getElementById("bird").style.display = "block";
    document.getElementById("jack").style.display = "none";
    document.getElementById("filler").style.display = "none";

    let bird_flow_container = document.getElementById("bird-flow-render-container");
    let bird_flow_canvas = bird_flow_container.getElementsByTagName("canvas")[0];
    let bird_traj_container = document.getElementById("bird-traj-render-container");
    let bird_traj_canvas = bird_traj_container.getElementsByTagName("canvas")[0];


    // Set the canvas to the container width and height
    bird_flow_canvas.width = bird_flow_container.clientWidth;
    bird_flow_canvas.height = bird_flow_container.clientHeight;
    bird_traj_canvas.width = bird_traj_container.clientWidth;
    bird_traj_canvas.height = bird_traj_container.clientHeight;

    // set the style width and height to be in px
    bird_flow_canvas.style.width = bird_flow_container.clientWidth + "px";
    bird_flow_canvas.style.height = bird_flow_container.clientHeight + "px";
    bird_traj_canvas.style.width = bird_traj_container.clientWidth + "px";
    bird_traj_canvas.style.height = bird_traj_container.clientHeight + "px";

    // Resize the canvas tags
    bird_flow.renderer.setSize(bird_flow_container.clientWidth, bird_flow_container.clientHeight);
    bird_traj.renderer.setSize(bird_flow_container.clientWidth, bird_flow_container.clientHeight);

    

    // Call render on the bird scenes
    bird_flow.renderer.render(bird_flow.scene, bird_flow.camera);
    bird_traj.renderer.render(bird_traj.scene, bird_traj.camera);

    console.log("Showing bird");

}

function showJack() {
    document.getElementById("bird").style.display = "none";
    document.getElementById("jack").style.display = "block";
    document.getElementById("filler").style.display = "none";

    let jack_flow_container = document.getElementById("jack-flow-render-container");
    let jack_flow_canvas = jack_flow_container.getElementsByTagName("canvas")[0];
    let jack_traj_container = document.getElementById("jack-traj-render-container");
    let jack_traj_canvas = jack_traj_container.getElementsByTagName("canvas")[0];


    // Set the canvas to the container width and height
    jack_flow_canvas.width = jack_flow_container.clientWidth;
    jack_flow_canvas.height = jack_flow_container.clientHeight;
    jack_traj_canvas.width = jack_traj_container.clientWidth;
    jack_traj_canvas.height = jack_traj_container.clientHeight;

    // Resize the canvas tags
    jack_flow_renderer.setSize(jack_flow_canvas.clientWidth, jack_flow_canvas.clientHeight);
    jack_traj_renderer.setSize(jack_traj_canvas.clientWidth, jack_traj_canvas.clientHeight);

    

    // Call render on the jack scenes
    jack_flow.renderer.render(jack_flow.scene, jack_flow.camera);
    jack_traj.renderer.render(jack_traj.scene, jack_traj.camera);


}

// Get the bird and jack images
const birdImg = document.getElementById("img-bird");
const jackImg = document.getElementById("img-jack");

// Add onclick listeners to the images
birdImg.onclick = showBird;
jackImg.onclick = showJack;

</script>


<script>
// Create a Web Worker for preloading all PLY and JSON files
const preloadWorker = new Worker('js/gigachad/preloader.js', { type: "module" });

// Start preloading files in the background
preloadWorker.postMessage('start');

// Listen for success or error messages from the worker
preloadWorker.onmessage = function(event) {
    if (event.data.status === 'success') {
        console.log('All PLY and JSON files preloaded successfully');
    } else if (event.data.status === 'error') {
        console.error('Error preloading files:', event.data.error);
    }
};
</script>

## Videos



## Citation

```
TODO
```