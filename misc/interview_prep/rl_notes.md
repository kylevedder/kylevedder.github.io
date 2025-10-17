HEADER RL Notes

# Reinforcement Learning

## Standard Q Learning --- Discrete Space

In discrete setting, can be solved by dynamic programming.

Given state $s_t$, action $a_t$, learning rate $l$, reward $r_{t+1}$ for taking $a_t$ at $s_t$, discount factor $\gamma$

$$Q_{\textup{new}}(s_t, a_t) \gets (1 - l) Q_{\textup{old}}(s_t, a_t) + l \left(r_{t+1} + \gamma \max_{a'} Q(s_{t+1}, a') \right) $$

## Actor Critic --- Handling Continuious Space

In discrete space, $\max_{a'}$ is computable as we can enumerate all possible actions. In continuious action space, this is not possible. Thus, we must replace this exhaustive max with a learned "actor" that takes actions, with the Q function taking the role of "critic".

### Deep Deterministic Policy Gradient (DDPG)

In DDPG, the actor learns a simple determinstic mapping from state $s_t$ to action $a_t$, with noise added for exploration during data collection, i.e.

$$a_t = \mu_\theta(s_t) +\mathcal{N}(0, \sigma^2)$$

Thus, for a given batch of data, the critic can be optimized via a modified $Q$ update, i.e.

$$Q_{\textup{new}}(s_t, a_t) \gets (1 - l) Q_{\textup{old}}(s_t, a_t) + l \left(r_{t+1} + \gamma Q(s_{t+1}, \mu_\theta(s_t)) \right) $$

and then the actor optimized to maximize the $Q$ value via




<!--This actor is often paramaterized as a Gaussian policy --- the network emits an $n$ dimensional mean $\mu$ and variance $\Sigma$ characterizing a distribution actions are then drawn from. While $\Sigma$ could be a full $n \times n$ matrix, it's often diagonal, i.e. each dimension is sampled independently, to form a _diagonal Gaussian policy_.-->