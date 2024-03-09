HEADER I Can't Believe It's Not Scene Flow!
<body>
<!-- <style>
* {
  background-color: #f5bd3a;
}
</style> -->

<!-- Color is f5bd3a -->

# _I Can't Believe It's Not Scene Flow!_

## [Kyle Vedder](http://vedder.io), [Ishan Khatri](https://ishan.khatri.io/), [Neehar Peri](http://www.neeharperi.com/), [Deva Ramanan](https://www.cs.cmu.edu/~deva/), and [James Hays](https://faculty.cc.gatech.edu/~hays/)

<!-- <img class="centered" src="img/static/trackflow/i_cant_believe_its_not_scene_flow_gen_bg.png" height=400> -->

## Abstract:

Current scene flow methods broadly fail to describe motion on small objects, and current scene flow evaluation protocols hide this failure by averaging over many points, with most drawn from larger objects. To fix this evaluation failure, we propose a new evaluation protocol, _Bucket Normalized EPE_, which is class-aware and speed-normalized, enabling contextualized error comparisons between object types that move at vastly different speeds. To highlight current method failures, we propose a frustratingly simple supervised scene flow baseline, _TrackFlow_, built by bolting a high-quality pretrained detector (trained using many class rebalancing techniques) onto a simple tracker, that produces state-of-the-art performance on current standard evaluations and large improvements over prior art on our new evaluation. Our results make it clear that all scene flow evaluations must be class and speed aware, and supervised scene flow methods must address point class imbalances. We release the evaluation code publicly at [https://github.com/kylevedder/BucketedSceneFlowEval](https://github.com/kylevedder/BucketedSceneFlowEval).

## Key Insights:

The scene flow community must:

1. Evaluate scene flow methods, supervised or unsupervised, using a class and speed aware eval metric (e.g. [_Bucket Normalized EPE_](https://github.com/kylevedder/BucketedSceneFlowEval)).
2. Supervised scene flow needs to address class and point imbalances.

## Downloads:

[[Preprint PDF]](https://arxiv.org/abs/2403.04739)

[[Official Code]](https://github.com/kylevedder/BucketedSceneFlowEval)


## Citation:

```
BIB bibs/in_submission.bib khatri2024trackflow
```

</body>