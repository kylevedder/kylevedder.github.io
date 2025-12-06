HEADER {"page_name": "State of Robot Learning, December 2025", "teaser_img": "https://vedder.io/img/static/state_of_robot_learning_dec_2025.png"}

# State of Robot Learning --- December 2025

Basically all robot learning systems today (December, 2025) are pure Behavior Cloning (BC, also called Imitation Learning) systems. Humans provide (near) optimal demonstrations of a task, and machine learning models try to imitate those actions. Formally, a policy $\pi$ is trained in a supervised fashion — given the robot's state $s$ (i.e. the camera images, robot joint angles, and maybe task description text), $\pi(s)$ predicts the demonstrated actions $a$ (often an action _chunk_, e.g. the next second of ~50hz).

This doc aims to describe the anatomy of a modern BC stack, as well as its shortcomings and (incomplete / clunky) workarounds. It then aims to explain what other approaches people are considering for the future, and the issues preventing them from being the conventional approach. Finally, in concludes with some predictions about the future of robot learning, and navigation advice for the "picks and shovels" salesmen in the Embodied AI race.


## The Anatomy of a 2025 Robot Learning Stack

### Collecting human expert demonstrations

First and foremost, to do Behavior Cloning you need data to clone. These come from human demonstrations, and from a variety of sources.

#### Leader-Follower (GELLO, ALOHA)

Humans directly teleoperate a full robot (follower) using a controller (leader). This can be done with a full copy of the robot setup (ALOHA[^1]) or a smaller, lighter scaled down version (GELLO[^2]).

Pros:

 - Follower robot has the full sensor suite to record all of $s$
 - All demonstrations are kinodynamically feasible, as they were executed on the robot

Cons:

 - Typically _much_ (up to 10x!) slower than humans performing the task directly with their hands
 - Operators require multiple weeks of practice to become proficient enough to make data usable for training
 - Requires a full robot onsite to collect data — significant production and capital requirement to scale collection

#### Smart Demo Gloves (Universal Manipulation Interface)

Rather than full leader follower, humans hold devices (e.g. Universal Manipulation Interface[^3]) in their hands and use these devices to perform the task. The end effectors match the robot, along with a cheap version of the sensor suite onboard the robot to try to reconstruct $s$. Devices perform SLAM to get end effector pose in task space, such that IK can later be used to estimate full joint state.

Pros:

 - Faster to learn for operators
 - Faster demonstrations
 - Cheaper to deploy at scale (e.g. Generalist[^4], Sunday[^5])

Cons:

 - Noisy reconstruction of $s$ and $a$, introducing a domain gap that can severely harm policy performance
	- Proprioception and actions need to be inferred from the SLAM estimate of end effector pose
	- Camera images all feature human arms holding a device, but at inference time the robot sees robot arms instead
 - No guarantee of kinodynamic feasibility — human may reach outside of the workspace as part of the demonstration, or use their arms to achieve poses that are impossible with the robots 


#### Direct human demonstrations

YouTube and other video sources have large scale data of humans performing all kinds of tasks. Similarly, many factories feature humans performing dexterous tasks, and these workers can be augmented with cameras to record their observations, providing an enormous source of data.

Pros:

 - Easiest data source to acquire
 - Enormous amounts of diverse data
 - At full human speed

Cons:

 - Enormous gap in reconstructing $s$ and $a$
	 - State may not be from first person view, or be from a different angle, introducing a large state gap
	 - Actions must be entirely inferred from the raw data, likely via a pseudolabeling process from another model (e.g. skeleton trackers / human hand trackers)
 - Without full human DoF, trajectories are likely _not_ kinodynamically feasible, due to torso leaning, shifting weight, reaching, etc

### The hard problem of behavior cloning (OOD states)

Behavior cloning sounds simple in principle --- supervise $\pi(s)$ to predict $a$. 

However, even with extremely clean demonstration data these policies still wander into _out of distribution_ states. There are several reasons for this:

1. The world will never perfectly match the training data; even at the same station, minor variations in lighting, background scene, or other distractors change the information in state $s$, which in turn can impact the prediction of $a$
2. There's uncertainty inherent in what exactly to do next (e.g. unfolding a shirt) — both due to inherent partial observability of $s$ (e.g. cannot see inside of a crumpled shirt to see its internal folds) and inherent multi-modality in the action distribution from demonstrators
3. Models have prediction error on their actions; because $\pi(s)$ is making _sequential_ decisions about $a$ that in turn influence the next state $s'$, this error compounds upon itself as it rolls out recursively

Tackling these challenges requires design choices, both for the model itself and for the data it's trained on. Modeling choices are important —strong, data driven priors (e.g. VLMs) and the right model class to handle the multi-modality in the action distribution (either discrete autoregression, where the model inherently models the full probability distribution over the next token, or continuous denoising, where the model is trained to sample from the true target distribution) — but the data distribution the model is trained on arguably matters more.

As discussed in 3), naively training these models on expert human demonstrations will result in the accumulation of errors in their predictions during inference, leading them to drift out-of-distribution into states they've never seen before. While the strong visual priors of a VLM can help the model generalize to novel states, there will still be scenarios where the model fails.

### Tackling out-of-distribution state performance (by bringing them in distribution)

This is why it's important to not just naively train on expert human data! In addition to these straightforward task demonstrations, it's critical to train the model how to get out of these failure states — a "DAgger"[^6] style approach. There's a bit of nuance to constructing this data — you want to train your model to _leave_ these bad states, but you do not want to accidentally train to _enter_ these bad states, lest it imitate this data and intentionally visit these bad states. Doing this right means carefully curating your recovery data. 

Building out this DAgger data is an iterative process, and an art at that. You train the model for the given task, observe its failure modes, concoct a new dataset to try to address those failure modes, retrain, and retry. This is a tedious process, requiring many hours of very smart and discerning human time to essentially play whack-a-mole with various issues. Along the way, you start to develop a touch and feel for the policy and its issues. Due to the need for rapid iteration, this is typically done as a post-training step atop a base pretrained policy, and hopefully that base policy has already seen quite a bit of task data such that it already mostly knows what it's doing.

This frustration is compounded by the fact that the touch and feel you have developed from your task iteration can be completely wiped out by a new pretraining of the base policy, sometimes presenting a new (but hopefully much smaller) set of failure modes. This DAgger data can be included in a pretraining run, and alongside data scale often results in higher quality predictions and fewer failures. With sufficient effort on data iteration, policies can be made to be surprisingly robust.

As these policies get more robust, they also take more of your time to evalaute their performance. If your policy typically fails every 15 seconds, you only need a few minutes of evals comparing training run A vs B to get signal on their performance. If your policy takes minutes to hours between failures, you need to spend many hours doing evals to get any relative signal. It's tempting to look for offline metrics (e.g. the validation MSE featured in = Generalist's blogpost[^4]), but emperically there is very poor correlation between these offline metrics and on-robot performance.

### Speeding up your behavior cloning policy (it's hard!)

DAgger addresses robustness issues, and avoiding catastrophic failures can speed up your average time to complete a task, but it does nothing to improve your speed in best-case-scenario. Given a dataset, you can discard all but the fastest demonstrations (losing enormous data scale and likely hurting robustness), or condition on speed (see: Eric Jang's “Just Ask For Generalization”[^7]), but none of these allow for faster than human demonstration performance.

Another trick is to simply execute the policy actions at faster than realtime (e.g. execute 50hz control at 70hz), but this stresses your low level control stack and leads to incorrect behavior when interacting with world physics (e.g. waiting for a garment to settle flat on a table after being flicked in the air).


## Beyond a Behavior Cloning Stack

The 2025 BC stack kind of sucks. It is not just bottlenecked on data scale to get generalization, but _also_ the speed of the data collectors providing the demonstrations and the hustle (and taste) of the data sommelier doing DAgger to address any failures.

Ideally, we want robot systems that self-improve:

 - they collect their own data to learn and improve from
 - they may get stuck in bad states, but they can do exploration to escape, and then automatically learn to avoid that bad state again
 - they can automatically get faster, becoming super-human at the task for their embodiment

Reinforcement Learning seems to fit this bill. RL has been wildly successful in the LLM space, and it's tempting to imagine we can drag and drop the same techniques into robotics. Unfortunately, this has yet to pan out, despite several different approaches.

### RL in LLMs

LLMs differ from robotics in two important ways:

 - LLMs are able to be rolled out an unlimited number of times from the identical state $s$
 - LLMs start with a very strong base policy

Because of these two factors, online, on-policy RL becomes feasible. Either directly, or after a little bit of supervised fine-tuning from a few expert demonstrations, the policy can start to achieve a non-zero success rate from a given state $s$. This allows for the LLM to simply be rolled out hundreds or thousands of times from $s$ as a form of exploration, receive (sparse) rewards from the environment on how its performed, and directly update its policy.

Importantly, this process avoids having to hallucinate a counterfactual. By rolling out many different trajectories from $s$, it avoids having to hallucinate “what if”s and instead directly receives environment feedback from its already strong guesses.

Robotics has none of these luxuries in the real world. Given the state $s$ of a messy kitchen at the beginning of a "clean the kitchen" task, we do not have the ability to easily perfectly replicate the clutter in the kitchen hundreds of times, nor do we have strong enough base models that we can reliably fully clean the kitchen with some nonzero success rate.

Thus, we either need to leverage simulation, where we can reliably reconstruct $s$ arbitrarily many times (and suffer the sim to real gap), or we need to be able to hallucinate good quality answers to counterfactuals given only a single real rollout from a real state $s$.

### RL in Sim

_NB: I am not a sim expert._

In LLMs, there is no sim-to-real gap — the environments it interacts with during training are the exact same environments it will see at inference. However, in robotics, our simulators are a facsimile for the real world, and often a poor one at that. Simulators have naive physics models, have to make numerical estimates to handle multiple colliding bodies, must select contact models with different tradeoffs, are poor models of non-rigid objects, and have large visual gaps between sim and real.

For these reasons training policies entirely in simulation performs very poorly when transferring to the real world. Domain randomization, i.e. significantly varying the parameters of the simulator, helps, as does having a highly structured visual input representation (e.g. scan dots), but outside of locomotion (e.g. RMA[^8]) this has seen limited success on robots.

There is ongoing work in “world models”, which are effectively learned simulators. One major reason for hope is, unlike a policy which needs to know the optimal action given a state, a world model need only simulate the dynamics given a state and action. In domains with structure (such as the real world, which has physics composable rules of interaction), _any_ state action transition data, be it from an optimal or a random policy, seemingly should aid in learning general dynamics, hopefully giving us a shot at building a good, general purpose world model. That said, as of today, I am unaware of any work that comes close to modeling well the sort of environment interaction dynamics that we care about for dexterous manipulation.

### RL In Real

Using real-world data avoids any sim to real gap, the same reason we were animated to do BC to begin with. However, learning to improve directly from your own policy rollouts has a number of hurdles.

The goal of an RL improvement loop is to upweight relatively good actions and downweight relatively bad ones. To know if an action was _relatively_ good or not, we need to answer counterfactuals; as we discussed in the LLM section, we don't have the luxury of simply running the policy over and over from the same state, trying a bunch of semi-reasonable actions to estimate the relative performance of action $a$ vs $a'$. Instead, we need some sort of system to hallucinate this; either a Q function that directly estimates discounted reward $Q(s, a)$, or some knowledge of the transition dynamics $(s, a) -> s'$ and then the Value of nearby state $V(s')$.

Notably, both $Q$ and $V$ are a sort of world model by a different name; rather than predicting some future state in its entirety as you might imagine out of a learned simulator, its instead baking in a bunch of long horizon information about how, under good decision making through future interactions with the world, you will ultimately get to the goal.

As you might imagine, this too is quite challenging, and learning good Q or V functions is an open area of research. Very recently, Physical Intelligence released $\pi_{0.6}^*$[^9], an approach that performs advantage weighted regression (BC, but rather than weighting every transition equally, weight it by $Q(s, a) - V(s)$), where they show minor improvements beyond that of just doing naive BC on the same data. However, in many of the tasks, the policy _also_ required human DAgger data, and it's clearly not a silver bullet for real world RL. There is much more work to be done in building good, reliable Q and V functions such that they work well out of distribution, without grossly over or under estimating their true values.

## Predictions and Advice

Here's a bunch of predictions about the future of robot learning:

 - In (at most) 2 years, VLAs (e.g. $\pi_0$) will be replaced by video model backbones.
 - In (at most) 10 years, world models are going to work well at simulating general open world interactions, and we will be doing policy extraction within them as part of policy training.
	- Traditional sim / video game engines will be data generators for World Models, but they will be at their core learned end-to-end.
 - (Near) expert data collection will still matter for finetuning these world models
 - Real world rollouts on real robots will still matter for reaching superhuman performance on that embodiment

As part of understanding where the field is going, many people have asked me for advice about building "picks and shovels" startups to profit from the Embodied AGI race. I think:

 - Data labeling is a comodity, and fundamentally a human labor arbitrage hustle play, not a tech play. You will need to out-operate Scale AI.
 - Pretraining data sales is also a hustle play, _and_ requires making the case that your data is actually helpful to the customer's model performance. This is an ops question as well as a technical one, and we know _it's not simply the case that all robot data helps_.
 - Evals are a bottleneck, but they are so important to the model improvement loop that they have to be done in-house. This cannot be cleaved off and farmed out to a third party.
 - Data platforms were not one-size-fits-all for Autonomous Vehicles, a domain where everyone had roughly the same sensors solving the same problem. There will not be one for for Embodied AGI.

I think the only solid foundation for the future is: human demonstrations will continue to matter. If you build out a hardware plus software stack for demonstration (either GELLO or UMI) that reduces the painpoints described above _and you can show produces good policies by training some_, you will be an attractive business partner if not outright acquisition target.


[^1]: Zhao, T. Z., Kumar, V., Levine, S., & Finn, C. (2023). Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware. Robotics: Science and Systems (RSS).
[^2]: Wu, P., Shentu, Y., Yi, Z., Lin, X., & Abbeel, P. (2023). GELLO: A General, Low-Cost, and Intuitive Teleoperation Framework for Robot Manipulators. IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS).
[^3]: Chi, C., Xu, Z., Pan, C., Cousineau, E., Burchfiel, B., Feng, S., Tedrake, R., & Song, S. (2024). Universal Manipulation Interface: In-The-Wild Robot Teaching Without In-The-Wild Robots. Robotics: Science and Systems (RSS).
[^4]: Generalist AI Team. (2025). GEN-0: Embodied Foundation Models That Scale with Physical Interaction. Generalist AI Blog. Available at: https://generalistai.com/blog/nov-04-2025-GEN-0
[^5]: Sunday Team. (2025). ACT-1: A Robot Foundation Model Trained on Zero Robot Data. Sunday AI Journal. Available at: https://www.sunday.ai/journal/no-robot-data
[^6]: Ross, S., Gordon, G., & Bagnell, J. A. (2011). A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning. AISTATS.
[^7]: Jang, E. (2021). Just Ask for Generalization. [Blog Post]. Available at: evjang.com/2021/10/23/generalization.html
[^8]: Kumar, A., Fu, Z., Pathak, D., & Malik, J. (2021). RMA: Rapid Motor Adaptation for Legged Robots. Robotics: Science and Systems (RSS).
[^9]: Amin, A., et al. (2025). $\pi^*_{0.6}$: a VLA that Learns from Experience. Physical Intelligence.