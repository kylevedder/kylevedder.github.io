var container, stats;
var camera, controls, scene, renderer;
var meshes = [];

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
    scene.background = new THREE.Color(0x000000);
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

function readTextFile() {
    document.getElementById('file').addEventListener('change', readFile, false);

    function readFile (evt) {
        var files = evt.target.files;
        var file = files[0];           
        var reader = new FileReader();
        reader.onload = function(event) {
            var path_coords = [];
            for (l of event.target.result.split('{')) {
                var xy_line = l.split('}')[0].trim();
                var x_and_y = xy_line.split('\n').map(function(x) { return (x.split(':')[1]); }).map(function(x) { return parseInt(x); });
                if (!isNaN(x_and_y[0]) && !isNaN(x_and_y[1])) {
                    path_coords.push(x_and_y);
                }
            }

            var initial_mesh_scales = meshes.map(function(m) { return [m.scale.x, m.scale.y, m.scale.z]; });
            meshes.forEach(function(m) { m.scale.x = 1; m.scale.y = 1; m.scale.z = 1; });

            var cylinder_height = 200;

            function make_cylinder(dx, dy) {
                if (dy!= 0 && dx != 0) {
                    return new THREE.CylinderGeometry(90, 90, cylinder_height * 1.414213562, 20);
                } else {
                    return new THREE.CylinderGeometry(90, 90, cylinder_height, 20);
                }
            }

            var cylinder = make_cylinder(0, 0);
            var cylinder_geometry = new THREE.Geometry();
            var cylinder_material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                flatShading: true,
                vertexColors: THREE.VertexColors,
                shininess: 0
            });

            var matrix = new THREE.Matrix4();
            var quaternion = new THREE.Quaternion();
            var color = new THREE.Color();
            var random_color = Math.random() * 0xffffff;

            var time = 0;

            for (var i = 0; i < path_coords.length - 1; ++i) {
                var bottom_pair = path_coords[i];
                var top_pair = path_coords[i + 1];

                var center_x = (top_pair[0] + bottom_pair[0]) / 2;
                var center_y = (top_pair[1] + bottom_pair[1]) / 2;
                var delta_x = (top_pair[0] - bottom_pair[0]);
                var delta_y = (top_pair[1] - bottom_pair[1]);

                cylinder = make_cylinder(delta_x, delta_y);

                time += Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));

                var position = new THREE.Vector3(center_x,
                                                 time,
                                                 center_y);
                var rotation = new THREE.Euler(0, 0, 0, "XYZ");
                var scale = new THREE.Vector3(1, 1, 1);

                quaternion.setFromEuler(rotation, false);
                matrix.compose(position, quaternion, scale);


                function make_shear(dx, dy) {
                    var shear_x = dx / cylinder_height;
                    var shear_y = dy / cylinder_height;
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

                matrix.multiply(make_shear(delta_x, delta_y));

                // give the cylinder's vertices a random color, to be displayed

                applyVertexColors(cylinder, color.setHex(random_color));

                cylinder_geometry.merge(cylinder, matrix);
            }

            var cylinder_mesh = new THREE.Mesh(cylinder_geometry, cylinder_material);
            scene.add(cylinder_mesh);
            meshes.push(cylinder_mesh);

            for (var i = 0; i < meshes.length; ++i) {
                meshes[i].scale.x = initial_mesh_scales[0][0];
                meshes[i].scale.y = initial_mesh_scales[0][1];
                meshes[i].scale.z = initial_mesh_scales[0][2];
            }


        };

        reader.readAsText(file);
    }
}

function init() {
    init_container();
    init_renderer();
    init_stats();
    init_scene();
    init_camera();
    init_lighting();

    readTextFile();

    var matrix = new THREE.Matrix4();
    var quaternion = new THREE.Quaternion();

    var wireframe_box = new THREE.PlaneGeometry(6000, 9000);
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
    var mouse_y = e.clientY;
    var rotation_amount = 0.003;
    for (m of meshes) {
        m.rotation.x = mouse_y * rotation_amount;
        m.rotation.y = mouse_x * rotation_amount;
    }
    renderer.render(scene, camera);

}

function onMouseScroll(e) {

    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
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
