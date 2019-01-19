var c = document.getElementById("rrtcanvas");
var ctx = c.getContext("2d");

// Configuration.
var kStartColor = "#00FF00"
var kGoalColor = "#FF0000"
var kLineColor = "#CCCCCC";
var kFinalPathColor = "#9999FF";
var kStartGoalRadius = 10;
var kDeltaQ = 20.0;
var kGoalBias = 0.1;
var kGoalTestDistance = 21.0;
var kNormalTimeout = 100;
var kGoalTimeout = 2000;

function RandomStart() {
  let sx = Math.random() * c.width / 4 + 3 * c.width / 4;
  let sy = Math.random() * c.height / 4 + 3 * c.height / 4;
  start = [sx, sy];
}

function RandomGoal() {
  let sx = Math.random() * c.width / 4;
  let sy = Math.random() * c.height / 4;
  goal = [sx, sy];
}

function RandomPoint() {
  if (Math.random() <= kGoalBias) {
    return goal;
  }
  let sx = Math.random() * c.width;
  let sy = Math.random() * c.height;
  return [sx, sy];
}

function DrawLine(p1, p2, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.stroke();
}

function DrawCircle(p, radius, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(p[0], p[1], radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function NeedsReset() {
  return ((c.width != document.body.clientWidth) ||
  (c.height != document.body.clientHeight) || GoalTest(ClosestInTree(goal)));
}

function ClearCanvas() {
  c.width = document.body.clientWidth; //document.width is obsolete
  c.height = document.body.clientHeight; //document.height is obsolete
}

function Reset() {
  ClearCanvas();
  RandomStart();
  RandomGoal();
  tree = [[start, start]];
  DrawCircle(start, kStartGoalRadius, kStartColor)
  DrawCircle(goal, kStartGoalRadius, kGoalColor)
}

function AddVecs(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

function SubVecs(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1]];
}

function ScaleVec(v, scale) {
  return [v[0] * scale, v[1] * scale];
}

function Sq(x) {
  return (x * x);
}

function Dist(p1, p2) {  
  return Math.sqrt(Sq(p1[0] - p2[0]) + Sq(p1[1] - p2[1]));
}

function GoalTest(point) {
  return (Dist(point, goal) < kGoalTestDistance);
}

function ClosestInTree(sample) {
  var closest = tree[0][0];
  for (var i = 1; i < tree.length; ++i) {
    let e = tree[i][0];
    if (Dist(sample, closest) > Dist(sample, e)) {
      closest = e;
    }
  }
  return closest;
}

function SteerPoint(start, steering) {
  let dist = Dist(start, steering);
  let subed_vec = SubVecs(steering, start);
  let scaled_vec = ScaleVec(subed_vec, kDeltaQ / dist);
  return AddVecs(start, scaled_vec);
}

function GetParent(point) {
  for (var i = 0; i < tree.length; ++i) {
    if (tree[i][0] === point) {
      return tree[i][1];
    }
  }
  console.log("Could not find parent of " + point);
  return start;
}

function UnwindPath(line_end) {
  let curr = line_end;
  while (curr != start) {
    let parent = GetParent(curr);
    DrawLine(curr, parent, kFinalPathColor);
    curr = parent;
  }
}

function MainLoop() {
  if (NeedsReset()) {
    Reset();
  }
  let sample_point = RandomPoint();
  let closest_in_tree = ClosestInTree(sample_point);
  let line_end = SteerPoint(closest_in_tree, sample_point);
  DrawLine(closest_in_tree, line_end, kLineColor);
  tree.push([line_end, closest_in_tree]);

  if (GoalTest(line_end)) {
    UnwindPath(line_end);
    setTimeout(MainLoop, kGoalTimeout);
  } else {
    setTimeout(MainLoop, kNormalTimeout);
  }
}

// Kick it all off!
MainLoop();
