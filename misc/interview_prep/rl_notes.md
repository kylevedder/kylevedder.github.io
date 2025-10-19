HEADER RL Notes

# Reinforcement Learning

## Standard Q Learning --- Discrete Space

Q Learning is an off-policy RL method --- the policy that _generates_ the data does not need to be the same policy that you are improving using it. In discrete tabular setting, this can be solved via simple dynamic programming. $Q$ should tell you the discounted sum of rewards, and thus can be framed recursively as a local update.

Given state $s_t$, action $a_t$, reward $r_{t+1}$ for taking $a_t$ at $s_t$, discount factor $\gamma$

$$Q_{\textup{new}}(s_t, a_t) \gets \left(r_{t+1} + \gamma \max_{a'} Q(s_{t+1}, a') \right) $$

Thus, written a least squares loss function $L_Q$

$$L_Q(s_t, a_t) = \left(Q(s_t, a_t) - \left(r_{t+1} + \gamma \max_{a'} Q(s_{t+1}, a') \right) \right)^2$$

## Actor Critic --- Handling Continuious Space

In discrete space, $\max_{a'}$ is computable as we can enumerate all possible actions. In continuious action space, this is not possible. Thus, we must replace this exhaustive max with a learned "actor" that takes actions, with the Q function taking the role of "critic".

### Deep Deterministic Policy Gradient (DDPG)

In DDPG, the actor learns a simple determinstic mapping from state $s_t$ to action $a_t$, with noise added for exploration during data collection, i.e.

$$a_t = \mu_\theta(s_t) +\mathcal{N}(0, \sigma^2)$$

during training and

$$a_t = \mu_\theta(s_t)$$

during inference. Thus, for a given batch of data, the critic can be optimized via a modified $Q$ loss, i.e.

$$L_Q(s_t, a_t) = \left(Q(s_t, a_t) - \left(r_{t+1} + \gamma Q(s_{t+1}, \mu_\theta(s_{t+1})) \right) \right)^2$$

and then the actor optimized to maximize the $Q$ value; this can be done by simply minimizing the negative of the $Q$ function, i.e.

$$L_\mu(s_t, \theta) = -Q(s_t, \mu_\theta(s_t))$$






<!--This actor is often paramaterized as a Gaussian policy --- the network emits an $n$ dimensional mean $\mu$ and variance $\Sigma$ characterizing a distribution actions are then drawn from. While $\Sigma$ could be a full $n \times n$ matrix, it's often diagonal, i.e. each dimension is sampled independently, to form a _diagonal Gaussian policy_.-->