<head>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-143379317-1"></script>
<script type="text/javascript" src="js/googleanalytics.js"></script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Setting up mujoco-py for on-screen and off-screen rendering via GLEW and EGL library configuration.">
<meta name="author" content="Kyle Vedder">
<link rel="shortcut icon" href="../favicon.ico">
<title>Setting up `mujoco-py` for on-screen and off-screen rendering via GLEW and EGL library configuration</title>
</head>

# Setting up mujoco-py for use with on-screen and off-screen rendering

Setting up [`mujoco-py`](https://github.com/openai/mujoco-py) for on-screen and off-screen rendering on Ubuntu 18.04

## System packages

```
sudo apt install patchelf libosmesa6-dev libegl1-mesa libgl1-mesa-glx libglfw3 libglew-dev
```

## Installing MuJoCo

Download MuJoCo, create the `~/.mujoco/` directory. Place your MuJoCo key inside this directory, naming it `mjkey.txt`, and unzip MuJoCo 2.0.0 inside it, creating the following directory structure:

```
~/.mujoco/
├── mjkey.txt
└── mujoco200/
```

Additionally, so that code can compile and link against MuJoCo, you need to add it to your library path; this can be done by adding 

```
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/k/.mujoco/mujoco200/bin
```

to your `~/.bashrc` and `source`ing it.

## Installing mujoco-py

This can either be installed via pip with

```
pip install -U 'mujoco-py<2.1,>=2.0'
```

or by cloning the repo and running 

```
make test
pip install -e .
```

inside it to compile from source. We recommend cloning the repo and building from source, as this gives you access to `examples/` that will be useful below.

## Selecting the proper graphics library

Due to the nature of the graphics libraries that MuJoCo uses, it's not possible to render to the viewer and programatically render images for a MuJoCo camera without causing errors. This is because rendering off-screen and rendering with the viewer require two different graphics libraries (EGL vs GLEW respectively).


### Graphics library for running viewer

If we try to run one of the `mujoco-py` examples (e.g. `examples/body_interaction.py`), we get the following error:

```
Creating window glfw
ERROR: GLEW initalization error: Missing GL version
```

To remedy this, we need to set the `LD_PRELOAD` environment variable to point to the `libGLEW.so`; on my system, this is `/usr/lib/x86_64-linux-gnu/libGLEW.so`, but you can confirm this on your system by running `locate libGLEW.so`; multiple copies may appear (e.g. in `snap` packages or `conda` environments) but at least one should exist at the above path. As a permanant fix, we recommend adding 

```
export LD_PRELOAD=$LD_PRELOAD:/usr/lib/x86_64-linux-gnu/libGLEW.so
```

to your `~/.bashrc` and `source`ing it. The `examples/body_interaction.py` should now render.


### Graphics library for rendering off-screen

In order to render off-screen, e.g. by saving images from MuJoCo `camera` objects while running headless, we must use EGL instead of GLEW. To do this **comment out** any `LD_PRELOAD=` command in your `~/.bashrc` and remove any `MjViewer` creation in your code.

To demo this, modify `examples/body_interaction.py` as follows

```
model = load_model_from_xml(MODEL_XML)
sim = MjSim(model)
# viewer = MjViewer(sim)
while True:
    sim.data.ctrl[0] = math.cos(t / 10.) * 0.01
    sim.data.ctrl[1] = math.sin(t / 10.) * 0.01
    res = sim.render(255, 255, camera_name="rgb")
    print(type(res), res.shape)
    sim.step()
    # viewer.render()
    if t > 100 and os.getenv('TESTING') is not None:
        break
```

Note the `sim.render()` call, and the commented out `viewer` calls. This should print that `res` is a 255 x 255 x 3 numpy array representing an RGB image from the `rgb` camera.
