HEADER Master Plan

# Executive Summary

I want to build a prediction engine that takes as input _raw_ percepts and predicts future "state" of the world. I believe being able to make high quality statements across _time_ is the critical component to understanding _action_ in the world, and a high quality prediction engine is a useful backbone for the planning stack of generally capable embodied agents, from autonomous vehicles to service robots.

I believe that in order for this prediction engine to be effective, it needs to be _highly_ data-driven, an approach that's been massively successful in the language domain. In service of this, I am searching for the learning problem formulation that produces a prediction engine where its prediction quality scales with [compute and data used to train it, *without* requiring human annotations](http://www.incompleteideas.net/IncIdeas/BitterLesson.html). This means filling in important low level details: what are these raw percepts? What is this future "state"? Where are we going to get all this data?

My work is trying to answer these important questions. To my mind, a few answers are clear: 

 - Autonomous Vehicles are the right application domain to start in. Unlike language, data from deployed robots is not readily available, publicly or privately, outside of AVs. 
 - We should use 3D sensors and explicit 3D representations to best capture the fundamentally 3D structure of the world. Traditional 2D image processing models must learn to implicitly represent this 3D structure.
 - We should start by building a non-causal prediction models (one with access to historical _and_ future percepts) in order to characterize best case performance, and then move to causal models.
 
 However, important questions remain:

- What is the right prediction problem? Having [worked with the traditional LiDAR scene flow formulation of predicting motion from time `t` to `t+1`, given point cloud `t` and `t+1`](./zeroflow.html), this problem is clearly impoverished; at the very least, a larger input history is required to distinguish sensor noise from motion and new evaluation protocols are needed to measure performance on the thin tail. I've not written off scene flow as a problem, but its reliance upon human annotations for evaluation is concerning; I am interested in voxel occupancy prediction or other prediction tasks that require zero human labels for training _and_ evaluation.
 - What are the right input modalities? Having worked with current generation commercial LiDAR point clouds (VLP 32, 64, 128), they are very sparse; I think the density + RGB information from RGB cameras is an important input to such a model. I think recent work (e.g. [Simple BEV](https://simple-bev.github.io/)) and continued work on this front will prove important.
 - What are the right internal representations? I think 3D voxel representations are promising, but they have drawbacks such as limited range, limited resolution, etc. These may be fine with the appropriate voxel resolutions, or continuous space representations may be important.
 - How do we represent uncertainty? Currently, models tend to regress a single expected value output; however, distribution aware methods seem to outperform their unaware peers (e.g. [CODAC](https://www.seas.upenn.edu/~dineshj/publication/ma-2021-conservative/) vs [CQL](https://sites.google.com/view/cql-offline-rl))
 
There is useful prior art in this general direction:

 - [Open AI's Video Pre-Training (VPT)](https://openai.com/research/vpt). This lays out a blueprint for taking a small amount of labeled data plus large amount of unlabeled data and learn a visual RL policy to play Minecraft.
 - Offline RL at large. One can reframe the above as a visual approach to learning a (valued) state neighbor function.

<!--
# Illustrative Example: `N` Queens

The `N` Queens Problem asks how to place `N` Queens on an `N x N` chessboard such that no two queens are capturing each other. Naively, a solution can be found via search over an `N x N` array of text characters; each character represents a piece with its unicode representation, or a space character for an empty piece. Search can be done in this representation by repeatedly flipping characters between the ♕ and space, either randomly or via a heuristic, until a satisfying board configuration can be found. However, this representation admits many invalid board configurations: the search process itself must enforce all constraints, e.g. there being only queens on the board, exactly `N` queens on the board, and the queens being in a satisfying position.

A more tailored representation is an `N` row array of entries `1` to `N`; the index of an entry represents the row its queen will sit on, and each entry value represents the column its queen will sit on. This representation bakes in many of the constraints of the problem itself: by construction there must be exactly `N` queens on the board and each row can only have a single queen on it (two queens on the same row would be capturing and thus invalid). Search can be done on this representation by repeatedly generating entries and verifying that there are not duplicate entries (meaning two queens are on the same column and thus invalid) and then simply checking for diagonal captures.

One could imagine the existence of an even more tailored representation: a random `N` dimensional vector space (and an injective map to only valid `N` Queens solutions). Search with this representation is trivial --- generate _any_ random finite `N` dimensional vector, give it to the map, and receive a satisfying solution.

This problem illustrates the tradeoff between representation and search for problem solving --- on the one extreme you have an _uncompressed_ representation that requires a significant amount of clever search to pick through the state space in order to solve the problem; on the other extreme you have a highly _compressed_ representation that discards all irrelevant information and preserves all relevant information, allowing search to collapse to a single trivial sampling step. 

But it also illustrates the tradeoff between reduced search and reduced "generalization" --- the second and third representations are clearly better for solving the `N` Queens problem, but if you also want to _play_ chess, only the first representation is capable of doing so; neither the second nor third representations can represent a _single_ legal board position. Note of course that "generalization" is only a relative term, e.g. none of the representations can play [four-handed chess](https://en.wikipedia.org/wiki/Four-player_chess) (in general, for any finite sized representation, you can construct a problem that requires more information to solve than can be fit into this representation).

# (Visual) Representation Learning and Reinforcement Learning

In RL theory, the state space is assumed to be given as part of the problem definition --- if the state has all of the "relevant" information, then it's an MDP, and if not, it's a POMDP. In RL practice, the state space is very important to the quality of the final learned policy --- 

Reinforcement Learning is a prime example of the interaction between representation and planning in a learning context. The state space is assumed to be given as part of the MDP; if the state does not contain all relevant problem information, it becomes a  part of the definition of an MDP, a state space is given, with the goal of learning a policy that maximizes a given reward to an agent following the policy.


I believe the shortest path to getting robust, generally capable robots in the real world is through the construction of a high quality prediction engine that serves as the core for a planning system.

The key open question: what is the learning problem formulation that allows us to build this prediction engine using only [compute and data, *without* requiring human annotations](http://www.incompleteideas.net/IncIdeas/BitterLesson.html).

The key open question: what is the problem formulation that allows us to scale 

The world is fundamentally 3D, but currently most vision systems focus on 2D data simply due to general availability of RGB images and strong hardware acceleration for standard processing methods (e.g. 2D convolutions). I am interested in building such scalable vision systems on top of 3D sensor data (e.g. LiDAR, Stereo) that reasons natively in 3D, in the hope that these 3D representations are more useful for quickly and robustly learning downstream behavioral tasks compared to their 2D counterparts.
-->