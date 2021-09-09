---
header-includes:
  - \usepackage{setspace}
  - \usepackage[margin=1in]{geometry}
  - \usepackage{xcolor}
  - \usepackage{hyperref}
  - \hypersetup{colorlinks=true,urlcolor=magenta,filecolor=magenta}
output:
    pdf_document
---
\hypersetup{
    pdftitle = {Kyle Vedder's Resume},
    pdfauthor = {Kyle Vedder},
}

\newcommand{\name}[1]{\begin{center} \huge{\textbf{#1}} \end{center}}
\newcommand{\page}[1]{\begin{center} \texttt{\url{#1}} \end{center}}
\newcommand{\ra}[1]{\hspace*{0pt}\hfill #1}
\newcommand{\vspacebefore}{\vspace{-0.25in}}
\newcommand{\vspaceafter}{\vspace{-0.15in}}
\newcommand{\newl}{\\}

\vspacebefore{}

\name{Kyle Vedder}

\begin{center} \texttt{\href{http://vedder.io}{vedder.io}} |  \texttt{\href{https://github.com/kylevedder}{github.com/kylevedder}} \end{center}


\vspacebefore{}

# Education

\vspaceafter{}

 - PhD in Computer Science, University of Pennsylvania (in progress) \ra{(2019 --     Present)}
 - BS in Computer Science, University of Massachusetts \ra{(2015 -- 2019)}

\vspacebefore{}

# Research Interests

\vspaceafter{}

In 20 years I want there to be robots that can effectively provide a full range of quality care to the elderly and disabled. In service of this goal, I am interested in improving continual learning for visual and behavioral tasks, as these abilities are required to robustly perform even basic care tasks in real world settings.

\vspacebefore{}

# Technical Skills

\vspaceafter{}

- Proficient with C++1X, Python 3, PyTorch, ROS 1, git, Debian Linux, \LaTeX
- Knowledgeable in Robotics and Machine Learning, including 3D Object Detection ([[3]](http://vedder.io/publications/sparse_point_pillars_snn_workshop.pdf) [[5]](http://vedder.io/misc/KyleVedderWPEII2021.pdf)), Single/Multi-Agent Path Planning ([[1]](http://vedder.io/publications/expanding_astar_aij.pdf) [[2]](http://vedder.io/publications/expanding_astar_aamas_extended_abstract.pdf) [[4]](http://vedder.io/publications/ScaffoldsLaneVedderBiswasPlanRob2017.pdf)), Shapley Values for Explainable AI ([[6]](http://vedder.io/misc/shap_for_classification.pdf)), Motion Control ([[7]](http://vedder.io/publications/MinutebotsRoboCupTDP2018.pdf) [[8]](http://vedder.io/publications/MinutebotsRoboCupTDP2017.pdf))

\vspacebefore{}

# Publications

\vspaceafter{}

## Conferences/Journals

 \vspaceafter{}

 1. _X_*_: Anytime Multi-Agent Path Finding For Sparse Domains Using Window-Based Iterative Repairs._ \newl{}
**Kyle Vedder**, Joydeep Biswas.
In Artificial Intelligence (AIJ), Volume 291, 2021. [[pdf]](http://vedder.io/publications/expanding_astar_aij.pdf)  [[website]](http://vedder.io/xstar.html)

 2. _X_*_: Anytime Multiagent Path Planning With Bounded Search._ \newl{}
**Kyle Vedder**, Joydeep Biswas.
In Proceedings of the 18th International Conference on Autonomous Agents and MultiAgent Systems (AAMAS), Montreal, Quebec, CA. July 2019. [[pdf]](http://vedder.io/publications/expanding_astar_aamas_extended_abstract.pdf)

\vspacebefore{}

## Workshops

\vspaceafter{}

 3. _Sparse PointPillars: Exploiting Sparsity on Birds-Eye-View Object Detection._ \newl{}
**Kyle Vedder**, Eric Eaton. Sparsity in Neural Networks Workshop (SNN). 2021. [[pdf]](http://vedder.io/publications/sparse_point_pillars_snn_workshop.pdf) [[arxiv]](https://arxiv.org/abs/2106.06882) [[poster]](http://vedder.io/misc/SparsePointPillarsSNNPoster.pdf)

 4. _Augmenting Planning Graphs in 2-Dimensional Dynamic Environments With Obstacle Scaffolds._ \newl{}
Spencer Lane, **Kyle Vedder**, Joydeep Biswas.
In Proceedings of the 5th Workshop on Planning and Robotics (ICAPS PlanRob), Pittsburgh, PA, USA. June 2017. [[pdf]](http://vedder.io/publications/ScaffoldsLaneVedderBiswasPlanRob2017.pdf)

\vspacebefore{}

## Tech Reports

\vspaceafter{}

 5. _Current Approaches and Future Directions for Point Cloud Object Detection in Intelligent Agents._\newl{}
**Kyle Vedder**. UPenn WPEII. 2021. [[pdf]](http://vedder.io/misc/KyleVedderWPEII2021.pdf) [[video]](https://www.youtube.com/watch?v=xFFCQVwYeec) [[slides]](https://docs.google.com/presentation/d/1-tvZP_1UkgX-zU0ytV_TEiGaOjezcXT9W77x9sHk5Y0/edit?usp=sharing)

 6. _An Overview of SHAP-based Feature Importance Measures and Their Applications To Classification._\newl{}
**Kyle Vedder**. 2020. [[pdf]](http://vedder.io/misc/shap_for_classification.pdf) [[video]](https://www.youtube.com/watch?v=xFFCQVwYeec) [[slides]](misc/FromShapleyValuesToExplainableAISlides.pdf)

 7. _UMass MinuteBots 2018 Team Description Paper._\newl{}
**Kyle Vedder**, Edward Schneeweiss, Sadegh Rabiee, Samer Nashed, Spencer Lane, Jarrett Holtz, Joydeep Biswas, David Balaban. 2018. [[pdf]](http://vedder.io/publications/MinutebotsRoboCupTDP2018.pdf) [[website]](https://amrl.cs.umass.edu/minutebots.html)

 8. _UMass MinuteBots 2017 Team Description Paper._\newl{}
**Kyle Vedder**, Edward Schneeweiss, Sadegh Rabiee, Samer Nashed, Spencer Lane, Jarrett Holtz, Joydeep Biswas, David Balaban. 2017. [[pdf]](http://vedder.io/publications/MinutebotsRoboCupTDP2017.pdf) [[website]](https://amrl.cs.umass.edu/minutebots.html)

\vspacebefore{}

# Honors and Awards

\vspaceafter{}

- _Goldwater Scholarship Honorable Mention_ \ra{(2018)}
    - One of 281 Honorable Mentions selected from a pool of 1280 national nominees 
- _Outstanding Undergraduate Course Assistant (CS220 Programming Methodologies)_ \ra{(Fall 2017)}
    - Received award for contributions to course development

\vspacebefore{}

# Academic Experience

\vspaceafter{}

- _PhD Student -- Lifelong Machine Learning group (LML), UPenn_ \ra{(2019 -- Present)}
    - Developed _Sparse PointPillars_, a point cloud 3D object detector for embedded systems
        - Based on popular detector _PointPillars_, with modified backbone to maintain and exploit input sparsity using end-to-end submanifold convolutions, significantly reducing model FLOPs
        - Contributed bugfixes and improvements to Open3D implementation of _PointPillars_ [[commits]](https://github.com/isl-org/Open3D-ML/commits?author=kylevedder)
        - Presented in workshop form at Sparse Neural Networks Workshop, currently in preparation for conference submission

    - Core Team Lead for Phase 2 of DARPA Lifelong Learning Machines (L2M) program
        - Led multi-University team to develop core infrastructure for RL and Perception subgroups atop the AIHabitat sim using Matterport3D, a dataset of 3D indoor scans of real houses
        - Worked with DARPA SETAs and other performers to refine fundamental cross-domain definition of lifelong learning systems along with domain agnostic evaluation approaches
        - Worked with subcontractors to develop concrete tasks for lifelong learning for an embodied agent in Matterport3D
        - Coordinated RL and Perception subgroups to provide system diagrams and metrics for evaluation by JHU APL, DARPA's independent evaluator, using APL's metrics definitions
        - Worked on adapting and tuning our group's Lifelong RL algorithm, LPG-FTW, for AIHabitat
    - Developed from scratch open-source control stack for LML Service Robots in C++14 [[code]](https://github.com/kylevedder/ServiceRobotControlStack)
        - Provides efficient implementation of particle filter-based localization on vector maps, velocity space obstacle avoidance, hierarchical path planning for real-time performance, visualization support via ROS, and integration with a multi-agent robot simulator
        - Basis for getting started homework assignment and several final group projects in CIS700 Integrated Intelligence, Fall 2020
- _Research Assistant -- Autonomous Mobile Robotics Lab (AMRL), UMass_ \ra{(2016 -- 2019)}
    - Developed _X\*_, an anytime multiagent planner for realtime systems
        - Designed, proved correct, implemented, and evaluated all novel algorithms
        - Performed literature review and wrote paper with high level editing input from coauthor
    - Developed _Obstacle Scaffolds_, an extension to roadmap based planners that allow for finer path generation near dynamic obstacles
        - Implemented baseline and experimental planners
        - Evaluated planner characteristics across multiple scenarios
    - Founding member of the UMass Minutebots, the RoboCup Small Size League team that serves as AMRL's research platform for autonomous multiagent systems
        - Architected and implemented majority of the core software infrastructure for the control stack
        - Implemented state-of-the-art realtime path planning, low level collision avoidance, and portions of the motion planning system
- _Academic Reviewer_ \ra{(2019 -- Present)}
    - AAAI 2020 -- 2022, AAMAS 2021, JMLR (Secondary) 2021
    - Reviewed articles on topics across robotics, vision, machine learning, and classical AI
- _Teaching Assistant -- CIS 519 Applied Machine Learning, UPenn_ \ra{(Spring 2021)}
    - Head TA managing 14 TAs doing homework assignment creation, running office hours, and performing small group cohort sessions
- _Teaching Assistant -- CIS 700 Integrated Intelligence, UPenn_ \ra{(Fall 2020)}
    - Developed assignments, led paper discussions, led technical lessons on ROS and C++1X, and helped students with ideation and execution of final project
- _Undergraduate Course Assistant -- CIS 220 Programming Methodologies, UMass_ \ra{(2016 -- 2017)}
    - Led discussion sections, held office hours, answered Q&A forum questions, overhauled course material, and restructured discussion sections to better suit student needs

\vspacebefore{}

# Industry Experience

\vspaceafter{}

- _Amazon Lab126 -- Software Development Intern_ \ra{(Summer 2019)}
    - Worked on confidential project doing novel classical multi-modal vision and ToF sensor fusion
- _Google -- Software Engineering Intern_ \ra{(Summer 2017)}
    - Worked on Ads Quality Metrics team to deliver statistics about bad ads. Developed information theoretic optimization approach to aquire maximally diverse training data for automated detectors
- _Google -- Software Engineering Intern_ \ra{(Summer 2016)}
    - Worked on AdWords Next Overview, the homepage of redesigned AdWords. Developed offline pipelines to do statistical analysis over entire customer dataset to provide automated insights
- _Unidesk Corporation -- C++ Development Intern_ \ra{(Summer 2015)}
    - Designed and implemented testing framework for proprietary Windows registry manipulation APIs, ensuring bug-for-bug compatability with Windows' implementation of fixed width UTF-16
- _Unidesk Corporation -- Robotics Intern_ \ra{(Summer 2014)}
    - Worked with CTO and CMO to implement a trade show display using a 6DOF robot arm controlled via high level pick-and-place commands. Wrote Java backend to maintain world state and dynamically generate FORTH written over a serial bus to execute robot trajectories requested from high level RESTful API