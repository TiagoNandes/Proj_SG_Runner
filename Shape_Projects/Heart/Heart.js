let camera; //to adjust the camera, set this variable global, and check its position parameter

// once everything is loaded, we run our Three.js stuff
window.onload = function init() {
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    let scene = new THREE.Scene();

    // // show axes in the screen
    // let axes = new THREE.AxesHelper(3);
    // scene.add(axes);

    // create a camera, which defines where we're looking at
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    // position and point the camera to the center of the scene
    camera.position.x = -10;
    camera.position.y = 5;
    camera.position.z = 0;
    camera.lookAt(scene.position); //point the camera to the center of the scene (default)

    let controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    // create a render and set the size
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // configure renderer clear color
    renderer.setClearColor("#000000");

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);



    var heartShape = new THREE.Shape();

    let heartMaterial = new THREE.MeshBasicMaterial({
        color: 0xE31B23
    });

    const x = -2.5;
    const y = -5;
    heartShape.moveTo(x + 2.5, y + 2.5);
    heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    heartShape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    heartShape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    heartShape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    heartShape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    var extrudeSettings = {
        amount: 1,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        depth: 1,
        bevelSize: 1,
        bevelThickness: 1
    };

    var geometry = new THREE.ExtrudeBufferGeometry(heartShape, extrudeSettings);

    var heart = new THREE.Mesh(geometry, heartMaterial);

    //resize
    //heart.scale.set(1,1,1);

    heart.rotateX(Math.PI);

    scene.add(heart);
    requestAnimationFrame(render);
    this.heartAnimation();
    // render
    renderer.render(scene, camera);
}


function heartAnimation() {
    heart.rotation.y -= 0.1;
}