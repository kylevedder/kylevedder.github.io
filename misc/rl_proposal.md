HEADER Densifying RL Proposal

# Densifying RL Proposal

I think the problem with most robotics RL approaches is that straightforward, end-of-episode reward models provide insufficiently dense signal -- the signal becomes so diluted when stretched over long time horizons that modeling it with a network becomes difficult. This is why today, to get RL to work well we have to either hand-craft heuristic reward functions or select an artificially short-horizon task.

To try to address this horizon issue in general, I propose a three-part approach:

 - break down long-horizon tasks into short, coherent subtasks using human annotators and/or a pseudolabeler
 - use those posed subtasks to train a general subtask language-conditioned short-horizon reward model
 - use that reward model to do offline or online RL

## Premises and priors

 - Humans seem to be really good at taking an unstructured problem and breaking it down into structured affordances / subtasks / steps
     - CV taxonomies seem natural to us but they are situation dependent and not some true universal substructure (e.g. water bottle is one or multiple objects depending on whether you want to throw it or open it)
 - RL seems to work really poorly if the task horizon is long, but OK if it's short
     - Two major reasons:
         - credit assignment models have less signal to distinguish between states
             - smooth / dampen nuances in value estimates
             - even if you increase resolution of target bins, the scale of objective noise (e.g. Monte Carlo or TD bootstrapping) drowns out nuanced signal
         - good policy extraction gets harder when it needs to be sensitive to minor changes in value but ignore noise
             - advantage estimates get diluted because the scale of the advantage is smaller
             - NNs are not optimal Bayesian updaters, and so the scale of these changes seems to have weird interactions with learning dynamics
     - [RLT](https://www.pi.website/research/rlt) worked on tasks shorter than 5 seconds
     - [RECAP](https://www.pi.website/blog/pistar06) struggled to work even with per-task human advantage thresholding and subtask creation because each subtask was still 15+ seconds
 - Pieces of the puzzle exist in the literature, but they have not been put together in a scaled up package
     - Value and Progress estimation from video ([VIP](https://arxiv.org/abs/2210.00030))
     - Language conditioned reward learning ([LIV](https://arxiv.org/abs/2306.00958))
     - VLM for reward modeling ([RoboCLIP](https://arxiv.org/abs/2310.07899))
     - Subtask reward learning ([ReWiND](https://arxiv.org/abs/2505.10911) and [REDS](https://arxiv.org/abs/2502.20630))


## Execution Plan

### Step 1: Breaking long-horizon demonstrations down into subtasks

#### What do we want?

We want to break long, multi-minute demonstrations down into short subtasks.

The form of this annotation is a time span plus a language description --- (start time, end time, language description) --- across enormous quantities of long-horizon data. Notably, these spans do _not_ need to be non-overlapping.

Importantly, we want demonstrations to contain both successes and failures for given subtasks to ensure failures are in-distribution.

#### How do we get it?

I think this is mostly an execution question.

We need mixed-quality data that has subtasks that are both successes and failures. I think [ReWiND](https://rewind-reward.github.io/) style mislabeling is a hack to get started, but truly disastrous trajectories are still out of distribution.

These annotations can be sourced from human annotation, or potentially from a sufficiently strong embodied video understanding model (e.g. a better version of [Perceptron](https://www.perceptron.inc/) may be able to do this). If an existing video understanding model cannot do this, we should do a [SAM](https://arxiv.org/abs/2304.02643)-style human-plus-pseudolabel bootstrapping approach to produce a model that can.

### Step 2: Large-scale training of language-conditioned short-horizon reward model

#### What do we want?

Using these diverse, large-scale (start time, end time, language description) annotations, we can train a general language-conditioned value function: $V(x_t, z)$

If we have action labels, we can also train a Q function $Q(x_t, a, z)$

#### How do we get it?

The details of the training objective are an open research question.

For value estimation I want to try:

 - Bootstrapping
     - N-step SARSA
 - Progress estimation
     - Monte Carlo

For state representation $x_t$ I want to try:

 - single observation Markovian
 - multi-observation Markovian
 - fully non-causal value estimation across an entire window of states
     - Inspired by my prior work [EulerFlow](https://vedder.io/eulerflow), this non-causal formulation is unreasonably effective
     - Try both block-diagonal and fully square temporal attention to observations

But at scale this ought to produce a general, short-horizon reward model.

### Step 3: Offline and Online RL with short-horizon tasks

Given that we now have

 - A model to break down arbitrary tasks into short tasks (the Step 1 pseudolabeler)
 - A reward model / value function for those short tasks (Step 2 model)

We can explore offline algorithms first that we can incorporate into large-scale policy or world model training. In terms of likelihood to work and add value:

 - Advantage conditioning
 - Advantage weighting
 - Advantage filtering

If the value function is causal, we can also explore online, on-policy approaches (e.g. RLT), and use that to produce policy rollouts we can add to the large-scale training corpus.
