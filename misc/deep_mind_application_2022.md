# WHAT INTERESTS YOU MOST ABOUT INTERNING AT DEEPMIND?

Access to the researchers at DeepMind with expertise in RL to help me design and run experiments to validate the belief that 3D representations will produce better quality/more sample efficient policies for completing real tasks.

# PLEASE WRITE A SHORT STATEMENT ON WHAT RESEARCH QUESTIONS INTEREST YOU, WHAT YOU HAVE WORKED ON IN THE PAST AND WHAT YOU WOULD LIKE TO WORK ON IN THE FUTURE.

Research interests:

I believe the shortest path to getting robust, generally capable robots in the real world is though the construction of systems whose performance scales with compute and data, *without* requiring human annotations. The world is fundamentally 3D, but currently most vision systems focus on 2D data simply due to general availability of RGB images and strong hardware acceleration for standard processing methods (e.g. 2D convolutions). I am interested in building such scalable vision systems on top of 3D sensor data (e.g. LiDAR, Stereo) that reasons natively in 3D, in the hope that these 3D representations are more useful for quickly and robustly learning downstream behavioral tasks compared to their 2D counterparts.

Past/present work:

In service of this vision, I am presently finishing up a year long project training an appearance based 3D object proposal system via unsupervised object annotations in the hope that these object centric representations are useful for downstream tasks. The training annotations are sourced unsupervised from proposal systems such as coherency heuristics from scene flow or day-over-day object movement from systems such as MODEST (You et. al. CVPR 2022). Importantly, these methods do not provide annotations *all* objects in the scene, violating the assumption of exhaustive labeling in the traditional object detection formulation, thus requiring a new way of training these models.

Future work:

In the future, I would like to move away from object-centric models and focus on raw point cloud representation learning using an auxiliary task such as offline scene flow. I believe this is a less brittle problem formulation, as it does not suffer the foibles of requiring heuristic extraction methods nor the imposition of an arbitrary decision boundary between object/not object, and I think it receives much denser self-supervisory signal per point cloud frame, allowing for greater sample efficiency. Ultimately, I would like to write a paper like R3M (https://sites.google.com/view/robot-r3m/) but for 3D representations. 

# PLEASE DISCUSS ONE RESEARCH PAPER YOU HAVE READ RECENTLY THAT HAS HAD A GREAT IMPACT ON YOU AND DESCRIBE WHY.

The work "Data Distributional Properties Drive Emergent Few-Shot Learning in Transformers
" by Chan et. al. (https://arxiv.org/abs/2205.05055) has had two major impacts on how I think about training systems:

1) My group at Penn is the Lifelong Machine Learning group. After reading this paper I kicked off a key question for the future of our group: does in-context learning trivially solve Lifelong Learning? The paper forwards a hypothesis about the way to mechanize the emergence of in-context learning in trained systems, opening a new direction of research for our group; instead of designing architectural biases (e.g. ELLA) / regularizers (e.g. EWC, replay) / complex training loops (e.g. MAML) to more rapidly enable in-weight learning in a lifelong setting, we explore the problem setup itself to see if we can simply configure a significant corpus of "bursty" training data to get in-context learning to effectively zero shot new Lifelong Learning problems for free.

2) I think vision/interaction data collected from robots, e.g. self-driving cars to service robots, likely exhibits the Zipfian task distribution discussed in the paper -- a large fraction of the time "usual" interactions happens, but still fairly frequently novel interactions occur, and these interactions often require previously unexercised scene understanding and reasoning to handle smoothly. I think these are analogous to the concept of distinct tasks that naturally emerge in language and were constructed via omniglot in the paper, and I suspect that vision systems with temporal understanding and the right problem formulation (perhaps scene flow/next point cloud prediction) will naturally learn to do in-context learning and be able to robustly zero-shot understand and reason about objects with novel geometry or novel behaviors.

# IS THERE ANYTHING ELSE YOU’D LIKE TO ADD IN SUPPORT OF YOUR APPLICATION?

My publication record is weak b/c I switched from planning to 3D vision for my PhD; 3D vision is niche so I initially struggled to find expert collaborators and I spent a lot of time trying things on my own that did not pan out (learned a ton though!)