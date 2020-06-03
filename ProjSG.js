//Scene
var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var hero;
var sun;
var ground;
var orbitControl;
var worldRadius = 25;
var rollingSpeed = 0.005;

//Heart settings
this.extrudeSettings = {
    amount: 8,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 20,
    bevelThickness: 20
};





init();

function init() {
    // set up the scene
    createScene();
    
    //call game loop
    update();
}

function createScene() {
    //Scene Properties
    sceneWidth = window.innerWidth;
    sceneHeight = window.innerHeight;
    scene = new THREE.Scene(); //the 3d scene
    scene.fog = new THREE.FogExp2(0xf0fff0, 0.14); //enable fog
    camera = new THREE.PerspectiveCamera(60, sceneWidth / sceneHeight, 0.1, 1000); //perspective camera
    renderer = new THREE.WebGLRenderer({
        alpha: true
    }); //renderer with transparent backdrop
    renderer.setClearColor(0xfffafa, 1);
    renderer.shadowMap.enabled = true; //enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sceneWidth, sceneHeight);
    dom = document.getElementById('gameContainer');
    dom.appendChild(renderer.domElement);
    addWorld();
    addLight();

    //add items to scene







    // //Heart
    // let heartShape = new THREE.Shape();
    // heartShape.moveTo(25, 25);
    // heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    // heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    // heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    // heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    // heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    // heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    // let geometryHeart = new THREE.ExtrudeGeometry(
    //     heartShape,
    //     this.extrudeSettings
    // );

    // let materialHeart = new THREE.MeshPhongMaterial({
    //     color: 'blue',
    //     flatShading: true
    // });

    // let heart = new THREE.Mesh(
    //     geometryHeart,
    //     materialHeart
    // );

    // scene.add(heart);

    //Camera
    camera.position.z = 5;
    camera.position.y = 1.5;

    //Lights and shadows
    sun = new THREE.DirectionalLight(0xffffff, 0.1);
    sun.position.set(0, 4, 1);
    sun.castShadow = true;
    scene.add(sun);
    //Set up shadow properties for the sun light
    sun.shadow.mapSize.width = 256;
    sun.shadow.mapSize.height = 256;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;

    orbitControl = new THREE.OrbitControls(camera, renderer.domElement); //helper to rotate around in scene
    orbitControl.addEventListener('change', render);
    orbitControl.enableZoom = false;


    window.addEventListener('resize', onWindowResize, false); //resize callback
}

function addLight() {
    var hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, .9)
    scene.add(hemisphereLight);
    sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
    sun.position.set(12, 6, -7);
    sun.castShadow = true;
    scene.add(sun);
    //Set up shadow properties for the sun light
    sun.shadow.mapSize.width = 256;
    sun.shadow.mapSize.height = 256;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;
}

function addWorld() {
    var sides = 60;
    var tiers = 60;
    var sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);



    // Create a texture phong material for the sphere, with map and bumpMap textures
    map = new THREE.TextureLoader().load('textures/moon_texture.jpg');
    bumpmap = new THREE.TextureLoader().load('images/desert.jpg');
    sphereMaterial = new THREE.MeshPhongMaterial({
        map: map,
        bumpMap: bumpmap,
        bumpScale: 0.05
    });
  

    //  //desert texture 
    //   var texture = new THREE.TextureLoader().load( 'desert.jpg' );
    //  var material = new THREE.MeshBasicMaterial({
    //       map: texture
    //   });
      

    //   var sphereMaterial = new THREE.Mesh(sphereGeometry, material)


    //  var sphereMaterial = new THREE.MeshStandardMaterial({
    //     color: "#006400",
    //     shading: THREE.FlatShading
    //  })

    // var vertexIndex;
    // var vertexVector = new THREE.Vector3();
    // var nextVertexVector = new THREE.Vector3();
    // var firstVertexVector = new THREE.Vector3();
    // var offset = new THREE.Vector3();
    // var currentTier = 1;
    // var lerpValue = 0.5;
    // var heightValue;
    // var maxHeight = 0.07;
    // for (var j = 1; j < tiers - 2; j++) {
    //     currentTier = j;
    //     for (var i = 0; i < sides; i++) {
    //         vertexIndex = (currentTier * sides) + 1;
    //         vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
    //         if (j % 2 !== 0) {
    //             if (i == 0) {
    //                 firstVertexVector = vertexVector.clone();
    //             }
    //             nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
    //             if (i == sides - 1) {
    //                 nextVertexVector = firstVertexVector;
    //             }
    //             lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
    //             vertexVector.lerp(nextVertexVector, lerpValue);
    //         }
    //         heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
    //         offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
    //         sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
    //     }
    // }
    rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    rollingGroundSphere.receiveShadow = true;
    rollingGroundSphere.castShadow = false;
    rollingGroundSphere.rotation.z = -Math.PI / 2;
    scene.add(rollingGroundSphere);
    rollingGroundSphere.position.y = -24;
    rollingGroundSphere.position.z = 2;
    //addWorldTrees();
}


function update() {
    //animate

    //Ground animation
    rollingGroundSphere.rotation.x += rollingSpeed;

    render();
    requestAnimationFrame(update); //request next update
}

function render() {
    renderer.render(scene, camera); //draw
}

function onWindowResize() {
    //resize & align
    sceneHeight = window.innerHeight;
    sceneWidth = window.innerWidth;
    renderer.setSize(sceneWidth, sceneHeight);
    camera.aspect = sceneWidth / sceneHeight;
    camera.updateProjectionMatrix();
}