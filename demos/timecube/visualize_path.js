var container, stats;
var camera, controls, scene, renderer;
var meshes = [];
var initial_mesh_scales = [];

var print = console.log.bind( console );
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

init();
animate();

function applyVertexColors(g, c) {
    g.faces.forEach(function(f) {
        var n = (f instanceof THREE.Face3) ? 3 : 4;
        for (var j = 0; j < n; j++) {
            f.vertexColors[j] = c;
        }
    });
}

function init_container() {
    container = document.getElementById("container");   
}

function init_renderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);   
}

function init_stats() {
    stats = new Stats();
    container.appendChild(stats.dom);
}

function init_scene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
}

function init_camera() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 6, 1000);
    camera.lookAt(scene.position);
}

function init_lighting() {
    scene.add(new THREE.AmbientLight(0x555555));
    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 500, 2000);
    scene.add(light);   
}

function hashCode (str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5 + 1)-hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function getColor(str) {
    return [0xff3300, 0x33cc33, 0x0066ff, 0xffff66, 0x9966ff][parseInt(str)];
}

var kGridSize = 200;  // mm
var kMaxRobotVelociy = 3000;  // mm/s
var kGridProgressionTime = kGridSize / kMaxRobotVelociy;  // s
var kTimeScale = 1000;  // s => millis
var kDebugParsing = false;
var kStepTimeHeight = 200;  // mm/step
var kDoNotDrawPosition = [2147483647, 2147483647]

function parsePoint(point_proto) {
    lines = point_proto.split('\n');
    x = parseFloat(lines.filter(l => l.includes("x:"))[0].replace("x:", ""))
    y = parseFloat(lines.filter(l => l.includes("y:"))[0].replace("y:", ""))
    return [x, y]
}

function parseBoxProto(box_proto) {
        // Removes extra { at the start.
    box_proto = box_proto.split('\n').slice(1).join('\n');
    if (kDebugParsing) {
	print("Parsing box proto:");
	print(box_proto);
    }
    upper_left_point = parsePoint(box_proto.split("upper_left ")[1].split("lower_right")[0]);
    lower_right_point = parsePoint(box_proto.split("lower_right")[1]);
    return [upper_left_point, lower_right_point];
}

function parsePathProtos(path_protos) {
    if (kDebugParsing) {
	print("Parsing path protos:");
	for (proto of path_protos) {
	    print(proto);
	}
    }
    return path_protos.map(p => p.split("vertices {").slice(1).map(s => parsePoint(s)));
}

function initShapeAdd() {
    // Resets the shapes to 1.0 scale, and saves their scaling for later retrevial.
    initial_mesh_scales = meshes.map(function(m) {
	return [m.scale.x, m.scale.y, m.scale.z];
    });
    meshes.forEach(function(m) { m.scale.x = 1; m.scale.y = 1; m.scale.z = 1; });
}

function finishShapeAdd() {
    for (var i = 0; i < meshes.length; ++i) {
	meshes[i].scale.x = initial_mesh_scales[0][0];
	meshes[i].scale.y = initial_mesh_scales[0][1];
	meshes[i].scale.z = initial_mesh_scales[0][2];
    }    
}

function addSearchBox(box_array, step_height) {
    var matrix = new THREE.Matrix4();
    var quaternion = new THREE.Quaternion();

    var center_x = (box_array[0][0] + box_array[1][0]) / 2.0;
    var center_y = (box_array[0][1] + box_array[1][1]) / 2.0;
    var center_z = (step_height * kStepTimeHeight) / 2.0;

    var delta_x = box_array[0][0] - box_array[1][0];
    var delta_y = box_array[1][1] - box_array[0][1];
    var delta_z = (step_height * kStepTimeHeight);

    var wireframe_geometry = new THREE.Geometry();
    var wireframe_material = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        wireframe: false,
	transparent: true,
	opacity: 0.2,
        side: THREE.DoubleSide
    });

    var wireframe_box1 = new THREE.PlaneGeometry(delta_x, delta_z);
    quaternion.setFromEuler(new THREE.Euler(0, 0, 0, "XYZ"), false);
    matrix.compose(new THREE.Vector3(center_x, center_z, -(center_y + delta_y / 2)),
		   quaternion,
		   new THREE.Vector3(1, 1, 1));
    wireframe_geometry.merge(wireframe_box1, matrix);

    var wireframe_box2 = new THREE.PlaneGeometry(delta_x, delta_z);
    quaternion.setFromEuler(new THREE.Euler(0, 0, 0, "XYZ"), false);
    matrix.compose(new THREE.Vector3(center_x, center_z, -(center_y - delta_y / 2)),
		   quaternion,
		   new THREE.Vector3(1, 1, 1));
    wireframe_geometry.merge(wireframe_box2, matrix);

    var wireframe_box3 = new THREE.PlaneGeometry(delta_y, delta_z);
    quaternion.setFromEuler(new THREE.Euler(0, 1.57, 0, "XYZ"), false);
    matrix.compose(new THREE.Vector3(center_x + delta_x / 2, center_z, -center_y),
		   quaternion,
		   new THREE.Vector3(1, 1, 1));
    wireframe_geometry.merge(wireframe_box3, matrix);
    
    var wireframe_box4 = new THREE.PlaneGeometry(delta_y, delta_z);
    quaternion.setFromEuler(new THREE.Euler(0, 1.57, 0, "XYZ"), false);
    matrix.compose(new THREE.Vector3(center_x - delta_x / 2, center_z, -center_y),
		   quaternion,
		   new THREE.Vector3(1, 1, 1));
    wireframe_geometry.merge(wireframe_box4, matrix);
    
    var box_mesh = new THREE.Mesh(wireframe_geometry, wireframe_material);
    meshes.push(box_mesh);
    scene.add(box_mesh);
}

function makeShear(dx, dy) {
    var shear_x = dx / kStepTimeHeight;
    var shear_y = dy / kStepTimeHeight;
    if (dx != 0 && dy != 0) {
        shear_x *= 1 / 1.414213562;
        shear_y *= 1 / 1.414213562;
    }

    var Syx = shear_x,
        Szx = 0,
        Sxy = 0,
        Szy = 0,
        Sxz = 0,
        Syz = shear_y;

    var shear = new THREE.Matrix4();

    shear.set(1, Syx, Szx, 0,
              Sxy, 1, Szy, 0,
              Sxz, Syz, 1, 0,
              0, 0, 0, 1);

    return shear;
}

function addPath(path, idx) {
    var wireframe_geometry = new THREE.Geometry();
    var wireframe_material = new THREE.MeshPhongMaterial( { 
	color: getColor(idx), 
	specular: 0x050505,
	shininess: 100
    });
    
    for (i = 0; i < path.length - 1; ++i) {
	let start_pos = path[i];
	if (start_pos === kDoNotDrawPosition) {
	    continue;
	}
	let end_pos = path[i + 1];

	var matrix = new THREE.Matrix4();
	var quaternion = new THREE.Quaternion();
	
	var center_x = (start_pos[0] + end_pos[0]) / 2.0;
	var center_y = (start_pos[1] + end_pos[1]) / 2.0;
	var center_z = (i + 0.5) * kStepTimeHeight;

	var delta_x = (end_pos[0] - start_pos[0]);
	var delta_y = -(end_pos[1] - start_pos[1]);

	var wireframe_cylinder = new THREE.CylinderGeometry(10, 10, kStepTimeHeight, 20);
	quaternion.setFromEuler(new THREE.Euler(0, 0, 0, "XYZ"), false);
	matrix.compose(new THREE.Vector3(center_x, center_z, -center_y),
		       quaternion,
		       new THREE.Vector3(1, 1, 1));
	matrix.multiply(makeShear(delta_x, delta_y));
	wireframe_geometry.merge(wireframe_cylinder, matrix);
	
    }

    var path_mesh = new THREE.Mesh(wireframe_geometry, wireframe_material);
    meshes.push(path_mesh);
    scene.add(path_mesh);
    
    return;

    var center_x = (box_array[0][0] + box_array[1][0]) / 2.0;
    var center_y = (box_array[0][1] + box_array[1][1]) / 2.0;
    var center_z = (step_height * kStepTimeHeight) / 2.0;

    var delta_x = box_array[0][0] - box_array[1][0];
    var delta_y = box_array[1][1] - box_array[0][1];
    var delta_z = (step_height * kStepTimeHeight);

    
}

function parseSingleFile(event) {
    var fileText = event.target.result;
    // Seperates each proto of the repeated field.
    for (window_proto of fileText.split("box").slice(1)) {
	var box_proto = window_proto.split("relevant_paths")[0];
	var path_protos = window_proto.split("relevant_paths").slice(1)
	var box = parseBoxProto(box_proto)
	var paths = parsePathProtos(path_protos)
	initShapeAdd();
	addSearchBox(box, paths.map(e => e.length).max());
	for (var i = 0; i < paths.length; ++i) {
	    addPath(paths[i], i);
	}
	finishShapeAdd();
    }
}

function loadFilesCallback(evt) {
    var files = evt.target.files;
    for (i = 0; i < files.length; ++i) {
	var reader = new FileReader();
	reader.onload = parseSingleFile;
	reader.readAsText(files[i]);
    }
}

function prepFileLoader() {
    document.getElementById('file').addEventListener('change', loadFilesCallback, false);
}

function init() {
    init_container();
    init_renderer();
    init_stats();
    init_scene();
    init_camera();
    init_lighting();

    prepFileLoader();

    var matrix = new THREE.Matrix4();
    var quaternion = new THREE.Quaternion();

    var wireframe_box = new THREE.PlaneGeometry(9000, 12000);
    var wireframe_geometry = new THREE.Geometry();
    var wireframe_material = new THREE.MeshBasicMaterial({
        color: 0x006400,
        wireframe: false,
        side: THREE.DoubleSide
    });

    quaternion.setFromEuler(new THREE.Euler(1.57, 0, 1.57, "XYZ"), false);
    matrix.compose(new THREE.Vector3(), quaternion, new THREE.Vector3(1, 1, 1));
    wireframe_geometry.merge(wireframe_box, matrix);


    meshes.push(new THREE.Mesh(wireframe_geometry, wireframe_material));

    for (m of meshes) {
        scene.add(m);
    }

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onMouseScroll);
    document.addEventListener("keydown", onDocumentKeyDown, false);

}

function onMouseMove(e) {
    var mouse_x = e.clientX;
    var mouse_y = Math.max(e.clientY - 60, 0);
    var rotation_amount = 0.004;
    for (m of meshes) {
        m.rotation.x = mouse_y * rotation_amount;
        m.rotation.y = mouse_x * rotation_amount;
    }
    renderer.render(scene, camera);

}

function onMouseScroll(e) {

    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail || -e.deltaY)));
    var scale_amount = 0.1;
    for (m of meshes) {
        m.scale.x *= (1 + scale_amount * delta);
        m.scale.y *= (1 + scale_amount * delta);
        m.scale.z *= (1 + scale_amount * delta);
    }
};

function onDocumentKeyDown(e) {};

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {
    renderer.render(scene, camera);

}
