HEADER {"page_name": "GIGACHAD", "teaser_img": "https://vedder.io/img/static/gigachad/gigachad_bird_flow_cropped.png"}

<style>
#jack-flow-render-container {
    width: 100%;
    height: 600px;
    border: 1px solid #ccc;
    margin-top: 20px;
}
#jack-flow-slider-container {
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
}
#jack-flow-frame-slider {
    flex-grow: 1;
    margin-right: 10px;
}
#jack-flow-frame-number {
    width: 50px;
    text-align: right;
}

#jack-traj-render-container {
    width: 100%;
    height: 600px;
    border: 1px solid #ccc;
    margin-top: 20px;
}
#jack-traj-slider-container {
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
}
#jack-traj-frame-slider {
    flex-grow: 1;
    margin-right: 10px;
}
#jack-traj-frame-number {
    width: 50px;
    text-align: right;
}


</style>


# GIGACHAD

## [Kyle Vedder](http://vedder.io), [Neehar Peri](http://www.neeharperi.com/), [Ishan Khatri](https://ishan.khatri.io/),  [Eric Eaton](https://www.seas.upenn.edu/~eeaton/), [Yue Wang](https://yuewang.xyz/), [Zhiding Yu](https://chrisding.github.io/), and [Joachim Pehserl](https://www.linkedin.com/in/joachim-pehserl-45514a98/)


<div class="centered">
# [[Paper]](TODO)
</div>


<!-- Side by side images from img/static/gigachad/gigachad_bird_flow_cropped.png and  img/static/gigachad/gigachad_bird_trajectory_cropped.png -->
<div style="display: flex" class="centered">
<img src="img/static/gigachad/gigachad_bird_flow_cropped.png" style="width:49%;" />
<img src="img/static/gigachad/gigachad_bird_trajectory_cropped.png" style="width:49%"/>
</div>

<script type="importmap">
{
    "imports": {
        "three": "https://unpkg.com/three@0.159.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.159.0/examples/jsm/"
    }
}
</script>

## Table Top Scene Flow

<div class="centered">
<div id="jack-flow-render-container"></div>
<div id="jack-flow-slider-container">
<input type="range" id="jack-flow-frame-slider" min="0" max="16" value="0" class="centered">
Frame <span id="jack-flow-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.
</div>
<script type="module" src="js/jack_scene_flow_vis.js"></script>


## Table Top Object Tracking

<div class="centered">
<div id="jack-traj-render-container"></div>
<div id="jack-traj-slider-container">
<input type="range" id="jack-traj-frame-slider" min="0" max="16" value="0" class="centered">
Frame <span id="jack-traj-frame-number">0</span>
</div>
Use the slider or arrow keys to navigate through the frames.
</div>
<script type="module" src="js/jack_traj_vis.js"></script>


## Videos



## Citation

```
TODO
```