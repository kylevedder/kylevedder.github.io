<head>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-143379317-1"></script>
<script type="text/javascript" src="js/googleanalytics.js"></script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="X*: Anytime Multi-Agent Path Finding for Sparse Domains using Window-Based Iterative Repairs">
<meta name="author" content="Kyle Vedder">
<link rel="shortcut icon" href="favicon.ico">
<title>X*</title>
<style>
     .updates li {
          margin-bottom:5px;
     }
</style>
</head>

# X*: Anytime Multi-Agent Path Finding for Sparse Domains using Window-Based Iterative Repairs

### [Kyle Vedder](http://vedder.io) and [Joydeep Biswas](http://joydeepb.com)

### In Artificial Intelligence, Volume 291, 2021.

### Links: [[pdf]](publications/expanding_astar_aij.pdf) [[code]](https://github.com/kylevedder/libMultiRobotPlanning/tree/xstar)

#### Abstract

We present the Windowed Anytime Multiagent Planning Framework (WAMPF), a framework that can make *any* optimal MAPF solver anytime by exploiting domain sparsity. Real-world domains are often sparse, i.e. agent-agent collisions tend to involve a small subset of agents in a single local region; this allows WAMPF to break down a large MAPF problem into small repair windows that can be efficiently searched to quickly generate a *valid* path. As time permits, WAMPF repair windows are grown and further repaired to improve the global repair quality. WAMPF provides online path suboptimality upperbounds, provably converges to a known optimal path given sufficient runtime, and provides infrastructure for information reuse to speed up window repair searches if supported by the underlying MAPF planner.

We present two A\*-based implementations of WAMPF: 1) Naive Windowing A\* (NWA\*), a naive implementation that does not leverage information reuse, and 2) Expanding A\* (X\*), an efficient implementation that employs a novel A* search tree transformation to perform search reuse.
    
Experimentally, we demonstrate that in sparse domains: 1) X\* outperforms state-of-the-art anytime or optimal MAPF solvers in time to valid path, 2) X\* is competitive with state-of-the-art anytime or optimal MAPF solvers in time to optimal path, 3) X\* quickly converges to tight suboptimality bounds, and 4) X\* is competitive with state-of-the-art suboptimal  MAPF solvers in time to valid path for small numbers of agents while providing much higher quality paths.

#### Video

TODO