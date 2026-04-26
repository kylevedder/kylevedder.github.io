HEADER {"page_name": "The Case Against Human Hands", "teaser_img": "https://vedder.io/img/static/state_of_robot_learning_dec_2025/teaser.png"}

# The Case Against Human Hands

Copying biological morphology imports biological constraints --- small fingers, dense cabling, micron-scale joints --- without preserving the biological advantages that justified them: free self-healing, free compliance, a metabolic budget that penalizes large limbs. Robots should buy dexterity along their substrate's cheap dimensions instead: more arms, simpler contact geometry, bigger serviceable actuators.

## The Argument

 - Design a system based on its substrate's strengths and weaknesses
    - A mechanical substrate has many advantages over biological substrate: 
        - no rest / recovery time during steady state operation
        - no food
        - willing do the same task over and over
 - Mechanical substrate can't self-heal, need to plan out wear parts and have a repair story
 - Easier to build and repair big things than small things
     - Mechanical watches are more expensive to make than large motors
 - Unlike biology, makes sense to make big things move and point of contact simple
     - Too metabolically expensive to have four arms and four parallel jaw grippers
     - Makes a lot of sense if big motor joints are cheap and easy to repair
 - Cost stems from laws of physics not pre-economies of scale
     - 3D printed gripper tips that replace every 2 weeks are far more cost effective than delicate mechanical parts, even when manufactured at scale
     - Napkin math for mechanical watch movements made at scale

### Napkin math at scale

There is no public BOM series for dexterous robot hands. Two imperfect proxies bracket the regime:

 - **Mechanical watch movements** --- finger-sized, ~100-part, micron-tolerance assemblies.
 - **Hard disk drives** --- mid-sized electromechanical assemblies produced at hundreds of times watch volume.

Both are sealed, climate-controlled devices with no active contact wear. A robot hand grips, slides, and impacts; the proxy floors below are an optimistic lower bound on a hand BOM, not a forecast. Both series show the same shape: real-terms BOM falls **~87%** (watches) and **~99%** (HDDs) from launch to the modern floor, most of it in the first decade or two, after which the floor is set by physics and prices track industry structure.

#### Mechanical Watch Movements

![Mass-market mechanical watch movements: real wholesale price over time](/img/static/the_argument_against_human_hands/movement_prices.png)

A Miyota 8215 --- ~100-part, micron-tolerance, fully mechanical --- wholesales for **$15--25** in packs of 300, produced at >1M units/year. In real terms it fell from **~$162 (2026 dollars) at launch in 1977 to ~$21 today**, an 87% decline, most of it taken by the late 1980s. The Seiko NH35 runs $40--80 and is roughly flat in real terms. The Swiss ETA 2824-2 went the *other* way, climbing ~30% to $200--300 as Swatch restricted supply through the 2010s. The floor was hit a generation ago; price now responds to industry structure, not process improvement.

#### HDDs

![Hard disk drive prices over time](/img/static/the_argument_against_human_hands/hdd_prices.png)

A complete HDD fell from **~$16,500 (2026 dollars) in 1980 to $70--100 today**, a ~99% decline. As with watches, most of it came early: the cheap-drive floor was already in the low hundreds by the early 2000s and has lived in the $50--200 real band for two decades. The famous price-per-byte collapse came from packing more data into the same mechanism --- the *mechanism* itself did not get seven orders cheaper.

#### Now price a hand

The cheapest five-finger dexterous hand, an Inspire RH56DFX, is **$5,600**. A Schunk SVH is **~$54,000**. A Shadow Dexterous Hand is **>$60,000**. The hand floor sits two orders of magnitude above the small-precision-mechanism floor, the ceiling three --- and that proxy floor is for *sealed* devices that never see contact wear.

#### Big actuators are the contrast

Big actuators are still moving down. Teknic ClearPath integrated servos start at **$249** because the cost is mostly silicon, which does sit on Moore-style curves; the mechanical parts that remain have tens-of-micron tolerances, scale linearly in material cost, and fail in diagnosable, replaceable ways. Bare NEMA 23 BLDCs are $100--200; planetary gearboxes at qty 100+ run $88; harmonic drives start at $119. A complete arm joint at scale lands in the low hundreds; a full 6-DoF arm in $5--15k.

Stack the two configurations on the same robot:

 - *Two arms, two hands.* ~$20k of arm plus $11k--$120k of hands. **$31--140k**, dominated by the hands. Thirty-plus small actuators with cabling routed through the wrists; failure modes everywhere.
 - *Three arms, three parallel jaws.* ~$30k of arm plus $13k of grippers (Robotiq 2F-85, list ~$4,245 each). **~$43k.** Three big motors per gripper, drop-in replacement parts.

A third arm with a parallel jaw costs less than putting fingers on either of the first two. The ratio is set by the gap between watch-class parts and motor-class parts, and the watch-class side is not catching up.

## Counter-arguments

**"Parallel-jaw grippers can't button a shirt."** The implicit comparison fixes the arm count at two. The substrate argument is precisely that you don't have to: a third or fourth arm enables hand-offs, opposed grasps, and stabilize-while-manipulate that two five-finger hands can't do without contortion --- and the marginal arm is cheaper than fingers on the first two. The right question is "can N grippers beat two hands for less?", and for most tasks short of pure in-hand reorientation, yes.

**"Five fingers give free transfer from human demo data."** Less free than it looks. Adult hand length varies ~30% across the population; human substrate bakes in compliance, deformable fingertips, and proprioception that a rigid robot has to either re-engineer (expensive) or compensate for in policy (data-hungry); and retargeting human kinematics to a specific robot hand is itself a learned step. The framing pays the substrate tax (small joints, dense routing, expensive repair) on every unit forever to chase a transfer benefit that mostly doesn't materialize.
