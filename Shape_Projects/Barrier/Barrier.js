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

    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    var light2 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light2 );

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



    var geometry = new THREE.BoxGeometry(2, 4, 10);
    // Create a texture phong material for the sphere, with map and bumpMap textures
    map = new THREE.TextureLoader().load('img/barrier.jpg');
    bumpmap = new THREE.TextureLoader().load('img/barrier.jpg');
    sphereMaterial = new THREE.MeshPhongMaterial({
        map: map,
        bumpMap: bumpmap,
        bumpScale: 0.1
    });

   

    var cube = new THREE.Mesh(geometry, sphereMaterial);
    scene.add(cube);


    // render
    renderer.render(scene, camera);
}