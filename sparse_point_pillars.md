<head>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-143379317-1"></script>
<script type="text/javascript" src="js/googleanalytics.js"></script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Sparse PointPillars: Maintain and Exploit InputSparsity to Improve Embedded System Runtime">
<meta name="author" content="Kyle Vedder">
<link rel="shortcut icon" href="favicon.ico">
<title>Sparse Point Pillars</title>
</head>

# Sparse PointPillars: Maintain and Exploit Input Sparsity to Improve Embedded System Runtime

### [Kyle Vedder](http://vedder.io) and [Eric Eaton](https://www.seas.upenn.edu/~eeaton/)

### Links: [[workshop pdf]](publications/sparse_point_pillars_icra_2022.pdf) [[code]](https://github.com/kylevedder/SparsePointPillars) [[model weights]](https://drive.google.com/drive/folders/1rMMblFl73qQnFbqcsK9hgnsTd5K58tJS?usp=sharing)


#### Abstract

Bird's Eye View (BEV) is a popular representation for processing 3D point clouds, and by its nature is  fundamentally sparse. Motivated by the computational limitations of mobile robot platforms, we take a fast, high-performance BEV 3D object detector  - PointPillars - and modify its backbone to maintain _and_ exploit this input sparsity, leading to decreased runtimes. We present results on KITTI, a canonical 3D detection dataset, and Matterport-Chair, a novel Matterport3D-derived chair detection from scenes in real furnished homes, and we evaluate runtime characteristics using a desktop GPU, an embedded ML accelerator, and a robot CPU, demonstrating our method results in significant runtime decreases (2X or more) for embedded systems with only a modest decrease in detection quality. Our work represents a new approach for practitioners to optimize models for embedded systems by maintaining _and_ exploiting input sparsity throughout their entire pipeline to reduce runtime and resource usage while preserving detection performance. All models, their weights, their experimental configurations, and the training data used is publicly available from this webpage.

