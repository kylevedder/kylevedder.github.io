HEADER {"page_name": "GIGACHAD", "teaser_img": "https://vedder.io/img/static/gigachad/gigachad_bird_flow_cropped.png"}

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

</style>


# GIGACHAD

## [Kyle Vedder](http://vedder.io), [Neehar Peri](http://www.neeharperi.com/), [Ishan Khatri](https://ishan.khatri.io/),  [Eric Eaton](https://www.seas.upenn.edu/~eeaton/), [Yue Wang](https://yuewang.xyz/), [Zhiding Yu](https://chrisding.github.io/), [Deva Ramanan](https://www.cs.cmu.edu/~deva/), and [Joachim Pehserl](https://www.linkedin.com/in/joachim-pehserl-45514a98/)


<div class="centered">
# [[Paper]](TODO)
</div>



<!-- Side by side images from img/static/gigachad/gigachad_bird_flow_cropped.png and  img/static/gigachad/gigachad_bird_trajectory_cropped.png -->
<div style="display: flex" class="centered">
<img src="img/static/gigachad/gigachad_bird_flow_cropped.png" style="width:49%;" />
<img src="img/static/gigachad/gigachad_bird_trajectory_cropped.png" style="width:49%"/>
</div>


## Argoverse 2 Bird scene flow

<div class="centered">
<div id="bird-flow-render-container"></div>
<div id="bird-flow-slider-container">
<input type="range" id="bird-flow-frame-slider" min="0" max="19" value="0" class="centered">
Frame <span id="bird-flow-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.

</div>
<script type="module" src="js/gigachad/bird_scene_flow_vis.js"></script>



## Argoverse 2 Bird tracking

<div class="centered">
<div id="bird-traj-render-container"></div>
<div id="bird-traj-slider-container">
<input type="range" id="bird-traj-frame-slider" min="0" max="19" value="0" class="centered">
Frame <span id="bird-traj-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.

Color represents Euler integration with shorter step sizes from $\Delta t = 1$ to $\frac{1}{8}$. Full red represents $\Delta t = 1$.
</div>
<script type="module" src="js/gigachad/bird_traj_vis.js"></script>



## Tabletop scene flow

<div class="centered">
<div id="jack-flow-render-container"></div>
<div id="jack-flow-slider-container">
<input type="range" id="jack-flow-frame-slider" min="0" max="15" value="0" class="centered">
Frame <span id="jack-flow-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.
</div>
<script type="module" src="js/gigachad/jack_scene_flow_vis.js"></script>


## Tabletop point tracking with multiple types of Euler Integration

<div class="centered">
<div id="jack-traj-render-container"></div>
<div id="jack-traj-slider-container">
<input type="range" id="jack-traj-frame-slider" min="0" max="15" value="0" class="centered">
Frame <span id="jack-traj-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.

Color represents Euler integration with shorter step sizes from $\Delta t = 1$ to $\frac{1}{8}$. Full red represents $\Delta t = 1$.
</div>
<script type="module" src="js/gigachad/jack_traj_vis.js"></script>

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