HEADER {"page_name": "EulerFlow: Neural Eulerian Scene Flow Fields", "teaser_img": "https://vedder.io/img/static/eulerflow/gigachad_bird_flow_cropped.png"}

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

.gigachad_viewer {
    display: none;
}


#filler {
    width: 100%;
    height: 200px;
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


# Neural Eulerian Scene Flow Fields

### [Kyle Vedder](http://vedder.io), [Neehar Peri](http://www.neeharperi.com/), [Ishan Khatri](https://ishan.khatri.io/), [Siyi Li](http://linkedin.com/in/siyi-li-14a958328), [Eric Eaton](https://www.seas.upenn.edu/~eeaton/), [Mehmet Kocamaz](https://www.linkedin.com/in/mehmet-kocamaz/), [Yue Wang](https://yuewang.xyz/), [Zhiding Yu](https://chrisding.github.io/), [Deva Ramanan](https://www.cs.cmu.edu/~deva/), and [Joachim Pehserl](https://www.linkedin.com/in/joachim-pehserl-45514a98/)


<div class="centered">
# [[Paper]](https://arxiv.org/abs/2410.02031) [[Code]](https://github.com/kylevedder/SceneFlowZoo) [[𝕏 Thread]](https://x.com/KyleVedder/status/1851732947130589371)
</div>


<!-- Insert img/static/eulerflow/bird.gif and img/static/eulerflow/tabletop.gif side by side -->

<div class="centered">

<img src="./img/static/eulerflow/bird.gif" style="width: 45%; margin-right: 10px;">
<img src="./img/static/eulerflow/tabletop.gif" style="width: 45%; margin-left: 10px;">

</div>

## Abstract

We reframe scene flow as the task of estimating a continuous space-time ODE that describes motion for an entire observation sequence, represented with a neural prior. Our method, EulerFlow, optimizes this neural prior estimate against several multi-observation reconstruction objectives, enabling high quality scene flow estimation via pure self-supervision on real-world data. EulerFlow works out-of-the-box without tuning across multiple domains, including large-scale autonomous driving scenes and dynamic tabletop settings. Remarkably, EulerFlow produces high quality flow estimates on small, fast moving objects like birds and tennis balls, and exhibits emergent 3D point tracking behavior by solving its estimated ODE over long-time horizons. On the Argoverse 2 2024 Scene Flow Challenge, EulerFlow outperforms all prior art, surpassing the next-best unsupervised method by more than 2.5x, and even exceeding the next-best supervised method by over 10%.

## Interactive Visualizations

We present _representative_ examples of EulerFlow's performance on a variety of scenes in order to provide honest depictions of the performance you can expect out of EulerFlow on diverse, in-the-wild data. While these results highlight EulerFlow's many strengths, they also accurately portray its weaknesses, such as adding motion to partially occluded areas or on nearby static surfaces. Scenes with RGB information are for visualization purposes only; RGB information is not used in the flow estimation process.

<div id="iteractive_vis"></div>

<script type="module">
import { setupSceneFlow } from './js/eulerflow/scene_flow_vis.js';
import { setupTraj } from './js/eulerflow/traj_vis.js';

const id_to_metadata = await fetch("./img/static/eulerflow/metadata.json").then(response => response.json())

const container_ids = Object.keys(id_to_metadata);


function showId(id) {
    // Hide the filler
    document.getElementById("filler").style.display = "none";
    // Hide all containers
    container_ids.forEach((id) => {
        document.getElementById(id).style.display = "none";
    });
    // Show the selected container
    document.getElementById(id).style.display = "block";

    // Load the scene flow and trajectory for the selected container
    let flow_container = document.getElementById(`${id}-flow-render-container`);
    let flow_slider = document.getElementById(`${id}-flow-frame-slider`);
    let flow_frame_number = document.getElementById(`${id}-flow-frame-number`);
    let traj_container = document.getElementById(`${id}-traj-render-container`);
    let traj_slider = document.getElementById(`${id}-traj-frame-slider`);
    let traj_frame_number = document.getElementById(`${id}-traj-frame-number`);

    // Check to see if the scene flow and trajectory have already been set up
    if (flow_container.innerHTML !== "" && traj_container.innerHTML !== "") {
        return;
    }

    let metadata = id_to_metadata[id];

    setupSceneFlow(flow_container, flow_slider, flow_frame_number, metadata.data_path, metadata.num_steps, metadata.camera_position, metadata.lookat);
    setupTraj(traj_container, traj_slider, traj_frame_number, metadata.data_path, metadata.num_traj, metadata.num_steps, metadata.camera_position, metadata.lookat);

}


const interactive_vis = document.getElementById("iteractive_vis");
// Create image row
const image_row = document.createElement("div");
// Add "centered" and "image_row" classes
image_row.className = "centered image_row";
interactive_vis.appendChild(image_row);

// Create filler div
const filler = document.createElement("div");
filler.id = "filler";
// Add centered class
filler.className = "centered";
filler.innerHTML = "Click one of the images above to view an interactive visualization of the scene flow and a trajectory.";
interactive_vis.appendChild(filler);


// Create row of images and make them clickable
container_ids.forEach((id) => {
    const metadata = id_to_metadata[id];
    const image_path = metadata.image_path;
    // Compute width based on number of images
    const width = `${100 / container_ids.length}%`;
    // Create image element
    const img = document.createElement("img");
    img.src = image_path;
    img.style.width = width;
    img.style.cursor = "pointer";
    // Make click event listener
    img.onclick = function() {
        showId(id);
    };
    // Add image to row
    image_row.appendChild(img);
});


container_ids.forEach((id) => {
    const metadata = id_to_metadata[id];
    const name = metadata.title;
    const num_steps = metadata.num_steps;
    const num_traj = metadata.num_traj;

    // Create base wrapper
    const container = document.createElement("div");
    container.id = id;
    container.className = "gigachad_viewer";
    interactive_vis.appendChild(container);
    

    // ===========
    // Scene Flow
    // ===========


    // Add scene flow header
    const header = document.createElement("h3");
    header.innerHTML = `${name} Scene Flow`;
    container.appendChild(header);

    // Add centered div
    const centered = document.createElement("div");
    centered.className = "centered";
    container.appendChild(centered);

    // Add flow render container
    const flow_render_container = document.createElement("div");
    flow_render_container.id = `${id}-flow-render-container`;
    centered.appendChild(flow_render_container);

    // Add flow slider container
    const flow_slider_container = document.createElement("div");
    flow_slider_container.id = `${id}-flow-slider-container`;
    centered.appendChild(flow_slider_container);

    // Add flow slider
    const flow_slider = document.createElement("input");
    flow_slider.type = "range";
    flow_slider.id = `${id}-flow-frame-slider`;
    flow_slider.min = 0;
    flow_slider.max = num_steps - 1;
    flow_slider.value = 0;
    flow_slider.className = "centered";
    flow_slider_container.appendChild(flow_slider);

    // Add "Frame " text and frame number
    const frame_number = document.createElement("span");
    frame_number.id = `${id}-flow-frame-number`;
    frame_number.innerHTML = "0";
    flow_slider_container.appendChild(document.createTextNode("Frame "));
    flow_slider_container.appendChild(frame_number);

    // Add instructions
    const flow_instructions = document.createElement("p");
    flow_instructions.innerHTML = "Use the slider or arrow keys to navigate through the frames.";
    centered.appendChild(flow_instructions);



    // ===========
    // Trajectory
    // ===========

    // Add trajectory header
    const traj_header = document.createElement("h3");
    traj_header.innerHTML = `${name} Trajectory`;
    container.appendChild(traj_header);

    // Add centered div
    const traj_centered = document.createElement("div");
    traj_centered.className = "centered";
    container.appendChild(traj_centered);

    // Add traj render container
    const traj_render_container = document.createElement("div");
    traj_render_container.id = `${id}-traj-render-container`;
    traj_centered.appendChild(traj_render_container);

    // Add traj slider container
    const traj_slider_container = document.createElement("div");
    traj_slider_container.id = `${id}-traj-slider-container`;
    traj_centered.appendChild(traj_slider_container);

    // Add traj slider
    const traj_slider = document.createElement("input");
    traj_slider.type = "range";
    traj_slider.id = `${id}-traj-frame-slider`;
    traj_slider.min = 0;
    traj_slider.max = num_steps - 1;
    traj_slider.value = 0;
    traj_slider.className = "centered";
    traj_slider_container.appendChild(traj_slider);

    // Add "Frame " text and frame number
    const traj_frame_number = document.createElement("span");
    traj_frame_number.id = `${id}-traj-frame-number`;
    traj_frame_number.innerHTML = "0";
    traj_slider_container.appendChild(document.createTextNode("Frame "));
    traj_slider_container.appendChild(traj_frame_number);

    // Add instructions
    const traj_instructions = document.createElement("p");
    traj_instructions.innerHTML = "Use the slider or arrow keys to navigate through the frames.";
    // If there are multiple trajectories, add a note about the color scheme
    if (num_traj > 1) {
        traj_instructions.innerHTML += " Color represents Euler integration with shorter step sizes from Δt = 1 to Δt = 1/8. Full red represents Δt = 1.";
    }
    traj_centered.appendChild(traj_instructions);
});

// Create a Web Worker for preloading all PLY and JSON files
const preloadWorker = new Worker('js/eulerflow/preloader.js', { type: "module" });

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

## Citation

```
BIB bibs/conferences.bib vedder2025eulerflow
```