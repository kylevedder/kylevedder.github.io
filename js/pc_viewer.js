
			var container, stats;

			var camera, scene, renderer;

			var group;

			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;

			var mouseX = 0;
			var mouseXOnMouseDown = 0;
      
      var rotateDirection = 1;

      const kMinAngle = -1.0;
      const kMaxAngle = 1.0;
      const kRotateSpeed = 0.0007;
      const kScaleFactor = 200;

			init();
			animate();

			function init() {

				container = document.getElementById( 'pccanvas' );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xFFFFFF );

				camera = new THREE.PerspectiveCamera( 50, document.body.clientWidth / document.body.clientHeight, 1, 5000 );
				camera.position.set( 0, 150, 500 );
				scene.add( camera );

				group = new THREE.Group();
				group.position.y = 50;
				scene.add( group );


				function addLineShape( points, color, x, y, z, rx, ry, rz, s ) {
					var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );

					var particles = new THREE.Points( geometryPoints, new THREE.PointsMaterial( { color: color, size: 4 } ) );
					particles.position.set( x, y, z + 75 );
					particles.rotation.set( rx, ry, rz );
					particles.scale.set( s, s, s );
					group.add( particles );
				}

				var pts = pc.map(e => new THREE.Vector3(e[0], -e[1], -e[2]))

				for ( var i = 0; i < pts.length; i ++ ) pts[ i ].multiplyScalar( kScaleFactor );

				addLineShape( pts, 0xdddddd, 0, 0, 0, 0, 0, 0, 1 );


				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( document.body.clientWidth, document.body.clientHeight);
				container.appendChild( renderer.domElement );

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {
				camera.aspect = document.body.clientWidth / document.body.clientHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( document.body.clientWidth, document.body.clientHeight);

			}

			function animate() {

				requestAnimationFrame( animate );

				render();

			}


			function render() {
        if (group.rotation.y > kMaxAngle || group.rotation.y < kMinAngle) {
          rotateDirection *= -1;
        }
        group.rotation.y += kRotateSpeed * rotateDirection;
				renderer.render( scene, camera );

			}