HEADER Overview of my PhD Research

# Overview of my PhD Research

## Why has my PhD focused on Scene Flow?

My research has focused on describing and learning the _dynamics_ of the 3D world through the problem of Scene Flow. I strongly believe in [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html), but to me it's clear that general embodied AI systems need a deep intuition for the 3D world to be robust and sample efficient. My focus on describing dynamics was driven by the lack of scalable, data-driven methods at the time to learn this; while we have self-supervised problem of next frame prediction to get structure, when I started there were no data-driven methods to learn motion, and I felt this was a critical gap.

## How have I addressed this gap in Scene Flow?

### [ZeroFlow: Scalable Scene Flow via Distillation](./zeroflow.html)

We need _scalable_ Scene Flow methods, i.e.\ methods that improve by adding more raw data and more parameters. When I started this project, scene flow methods were either feed-forward supervised methods using human annotations (or from the synthetic dataset generator), or they were very expensive optimization methods. Worse, almost all of these methods did not run on full-size point clouds; they would downsample the point cloud to 8,196 points instead of the 50,000+ points in the (ground removed!) full point clouds. This is a _critical_ limitation, as it meant they are fundamentally unsuitable to detecting motion on all but the largest objects. This left us with only a couple optimization and feed-forward baseline scene flow methods that even tried to seriously solve the full scene flow problem.

ZeroFlow is a very simple idea: distill one of the few (very) expensive optimization methods ([Neural Scene Flow Prior](https://arxiv.org/abs/2111.01253)) into one of the few feed-forward networks that could handle full-size point clouds ([FastFlow3D](https://arxiv.org/abs/2103.01306)). This was far more successful than we expected, and ZeroFlow was state-of-the-art on the Argoverse 2 Self-Supervised Scene Flow Leaderboard (beating out the optimization teacher!). It was also 1000x faster than the best optimization methods, and 1000x cheaper to train than the human supervised methods.

While conceptually simple, ZeroFlow had several important take-home messages:

 - we have a working blueprint for scaling a scene flow method with data and compute
 - at data scale, feed-forward networks will ignore uncorrelated noise in teacher pseudo-labels, enabling them to outperform the teacher
 - with sufficient data scale, pseudolabel trained feed-forward networks can outperform human supervised methods with the exact same architecture


### [_I Can't Believe It's Not Scene Flow!_](./trackflow.html)

After publishing ZeroFlow, we spent a long time looking at visualizations of its flow results to get a deeper understanding of its shortcomings. We realized it (and all of the baselines) systematically failed to describe most small object motion (e.g. Pedestrians). Worse, we didn't know about these systematic failures using the standard metrics because, by construction, small objects have a very small fraction of the total points in a point cloud, and so their error contribution was reduced to a rounding error compared to large objects.

In order to properly quantify this failure, we proposed a new metric, _Bucket Normalized Scene Flow_, that reported error per class, and normalized these errors by point speed to report a _percentage_ of motion described --- it's clear that 0.5m/s error on a 0.5m/s walking pedestrian is far worse than 0.6m/s error on a 25m/s driving car.

To show that this wasn't an impossible gap to close, we proposed a very simple and crude supervised baseline, _TrackFlow_, constructed by running an off-the-shelf 3D detector on each point cloud and then associating boxes across frames with a 3D Kalman filter to produce flow. Despite the crude construction without any scene flow specific training, it was state-of-the-art by a slim margin on the old metrics but by an enormous margin on our new metric; it was the first method to describe more than 50\% of pedestrian motion correctly (hence the name, _I Can't Believe It's Not Scene Flow!_).

The key take-home messages were:

 - there is a huge performance gap to close between prior art and a qualitative notion of reasonable flow quality
 - standard metrics were _broken_, hiding this large gap
 - this gap is realistically closable, even with very simple methods, if we can properly measure it
 

### [Argoverse 2 2024 Scene Flow Challenge](https://www.argoverse.org/sceneflow)

In order to push the field to close this gap, we hosted the _Argoverse 2 2024 Scene Flow Challenge_ as part of the CVPR 2024 _Workshop on Autonomous Driving_. The goal was to minimize the mean normalized dynamic error of our new metric _Bucket Normalized Scene Flow_, and featured both a supervised and an unsupervised track. The most surprising result was the winning supervised method [Flow4D](https://arxiv.org/abs/2407.07995) was able to _halve_ the error compared to the next best method, our baseline TrackFlow, and it did so with a novel feed forward architecture that was better able to learn general 3D motion cues, while using no additional fancy training tricks like class rebalancing.

Our key take-home message was that feed-forward architecture choice was a critically underexplored aspect of scene flow, and ZeroFlow and other prior work clearly suffered from inferior network design.

### [GIGACHAD: FItting Neural Scene Flow Volumes](./gigachad.html)

Under our new metric from _I Can't Believe It's Not Scene Flow!_, it became clear that ZeroFlow's poor performance was at least partially inherited from the systematic limitations of its teacher. This motivated the need for a high-quality offline optimization method that, even if expensive, could describe the motion of small objects well.

To do this, we proposed _GIGACHAD_, a simple, unsupervised test-time optimization method that fits a neural flow volume to the _entire_ sequence of point clouds. This full sequence formulation, combined with multi-step optimization losses, results in extremely high quality unsupervised flow, allowing GIGACHAD to capture state-of-the-art on the Argoverse 2 2024 Scene Flow Challenge leaderboard, beating out _all_ prior art, including all prior supervised methods. GIGACHAD also displayed a number of emergent capabilities: it is able to extract long tail, small object motion such as birds flying, and it is able to do 3D point tracking across arbitrary time horizons for object using Euler integration.

The key take-home messages:

 - we now have a method to get extremely high quality unsupervised scene flow
   - this is a prime candidate for a pseudolabel teacher
   - this can be used to do long-tail object mining from motion cues
   - this method works out-of-the-box on a wide variety of scenes, including indoor scenes
 - multi-frame predictions were a critical factor to optimizing this representation; this likely has implications for loss design in feed-forward methods

## Artifacts and Code

When I started, there were no model zoos and the open source codebases that were available were a mess. I sat down and wrote the ZeroFlow codebase from scratch, which then turned into [SceneFlowZoo](https://github.com/kylevedder/SceneFlowZoo) with several other baseline implementations.

As part of _I Can't Believe It's Not Scene Flow!_ we also released a standalone dataloader and evaluation package which we used as the basis of the [Argoverse 2 2024 Scene Flow Challenge](https://www.argoverse.org/sceneflow). This codebase, [BucketedSceneFlowEval](https://github.com/kylevedder/BucketedSceneFlowEval) is used by the model zoo, but is deep learning library agnostic (it produces everything in numpy arrays) and is thinly wrapped in the SceneFlowZoo codebase.