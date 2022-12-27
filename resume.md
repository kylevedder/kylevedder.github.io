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
\newcommand{\vspacebefore}{\vspace{-0.1in}}
\newcommand{\vspaceafter}{\vspace{-0.1in}}
\newcommand{\newl}{\\}

\vspacebefore{}

\name{Kyle Vedder}

\begin{center} \texttt{\href{http://vedder.io}{vedder.io}} |  \texttt{\href{https://github.com/kylevedder}{github.com/kylevedder}} \end{center}


\vspacebefore{}

# Education

\vspaceafter{}

 - PhD in Computer Science, University of Pennsylvania (in progress) \ra{(2019 -- Present)}
     - Advisors: Eric Eaton, Dinesh Jayaraman, _GRASP Lab_
 - BS in Computer Science, University of Massachusetts \ra{(2015 -- 2019)}
     - Advisor: Joydeep Biswas, _Autonomous Mobile Robotics Lab (AMRL)_

\vspacebefore{}

# Research Interests

\vspaceafter{}

STATEMENT_OF_PURPOSE

\vspacebefore{}

# Publications

\vspaceafter{}

## Conferences/Journals

 \vspaceafter{}

PUBS bibs/conferences.bib

\vspacebefore{}

## Workshops

\vspaceafter{}

PUBS bibs/workshops.bib

\vspacebefore{}

## Tech Reports

\vspaceafter{}

PUBS bibs/tech_reports.bib

\vspacebefore{}

<!-- ## In Submission

\vspaceafter{}

 

\vspacebefore{} -->

# Academic Experience

\vspaceafter{}

- _Academic Reviewer_ \ra{(2019 -- Present)}
    - AAAI 2020 -- 2022, AAMAS 2021, JMLR (Secondary) 2021, ICRA 2022, JSA 2022, ICLR 2023

\vspacebefore{}

# Industry Experience

\vspaceafter{}

- _Argo AI -- Research Intern_ \ra{(Summer / Fall 2022)}
    - Exploring 2D and 3D methods for generalizing object detectors to the long tail of objects
- _Amazon Lab126 -- Software Development Intern_ \ra{(Summer 2019)}
    - Worked on Amazon Astro, a small mobile service robot, doing novel classical multi-modal IR camera and ToF sensor fusion for detecting small obstacles such as wires or boxes to avoid collisions
- _Google -- Software Engineering Intern_ \ra{(Summer 2017)}
    - Worked on Ads Quality Metrics team to deliver statistics about bad ads. Developed information theoretic optimization approach to aquire maximally diverse training data for automated detectors
- _Google -- Software Engineering Intern_ \ra{(Summer 2016)}
    - Worked on AdWords Next Overview, the homepage of redesigned AdWords. Developed offline pipelines to do statistical analysis over entire customer dataset to provide automated insights
- _Unidesk Corporation -- C++ Development Intern_ \ra{(Summer 2015)}
    - Designed and implemented testing framework for proprietary Windows registry manipulation APIs, ensuring bug-for-bug compatibility with Windows' implementation of fixed width UTF-16
- _Unidesk Corporation -- Robotics Intern_ \ra{(Summer 2014)}
    - Worked with CTO and CMO to implement a trade show display using a 6DOF robot arm controlled via high level pick-and-place commands. Wrote Java backend to maintain world state and dynamically generate FORTH written over a serial bus to execute robot trajectories requested from high level RESTful API