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

    var dl = new THREE.SpotLight();
    scene.add(dl);
    dl.position.set(0, 50, 0);

    scene.add(new THREE.AmbientLight(0x555555));

    // create a render and set the size
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // configure renderer clear color
    renderer.setClearColor("#000000");

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);



    //Virus 

    var virusMaterial = new THREE.MeshPhongMaterial({
        color: 0x4ab897
    });
    var redMaterial = new THREE.MeshPhongMaterial({
        color: 0xE03931
    });

    //sphere 
    var sphereGeometry = new THREE.SphereGeometry(5, 16, 16);
    
    //arm1
    var cylinder = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
    cylinder.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
    cylinder.rotateX( Math.PI / 2);
    var torus = new THREE.TorusGeometry(.4, .15, 16, 100);
    torus.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
    torus.rotateX( (Math.PI / 2) + (Math.PI / 2));
    //arm2
    var cylinder2 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
    cylinder2.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
    cylinder2.rotateX( Math.PI);
    var torus2 = new THREE.TorusGeometry(.4, .15, 16, 100);
    torus2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
    torus2.rotateX( (Math.PI / 2) + Math.PI);
    //arm3
    var cylinder3 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
    cylinder3.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
    cylinder3.rotateX( 3 * Math.PI / 2 );
    var torus3 = new THREE.TorusGeometry(.4, .15, 16, 100);
    torus3.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
    torus3.rotateX( (Math.PI / 2) +(3 * Math.PI / 2 ));
    //arm4
    var cylinder4 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
    cylinder4.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
    cylinder4.rotateX( 0 );
    var torus4 = new THREE.TorusGeometry(.4, .15, 16, 100);
    torus4.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
    torus4.rotateX((Math.PI / 2) + 0);
    //arm5
    var cylinder5 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
    cylinder5.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
    cylinder5.rotateX(Math.PI / 4 );
    var torus5 = new THREE.TorusGeometry(.4, .15, 16, 100);
    torus5.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
    torus5.rotateX((Math.PI / 2) + (Math.PI / 4));
    //arm6
    var cylinder6 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
    cylinder6.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
    cylinder6.rotateX( -Math.PI / 4);
    var torus6 = new THREE.TorusGeometry(.4, .15, 16, 100);
    torus6.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
    torus6.rotateX((Math.PI / 2) + (-Math.PI / 4));
    //arm7
    var cylinder7 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
    cylinder7.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
    cylinder7.rotateX( 3 * Math.PI / 4 );
    var torus7 = new THREE.TorusGeometry(.4, .15, 16, 100);
    torus7.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
    torus7.rotateX((Math.PI / 2) + (3 * Math.PI / 4));
    //arm8
    var cylinder8 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
    cylinder8.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
    cylinder8.rotateX( -(3 * Math.PI / 4) );
    var torus8 = new THREE.TorusGeometry(.4, .15, 16, 100);
    torus8.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
    torus8.rotateX((Math.PI / 2) -(3 * Math.PI / 4));
       

    //merge geometries 
    var mergeGeometry = new THREE.Geometry();
    mergeGeometry.merge(sphereGeometry, sphereGeometry.matrix);
    mergeGeometry.merge(cylinder, cylinder.matrix, 1);
    mergeGeometry.merge(torus, torus.matrix, 2);
    mergeGeometry.merge(cylinder2, cylinder2.matrix, 3);
    mergeGeometry.merge(torus2, torus2.matrix, 4);
    mergeGeometry.merge(cylinder3, cylinder3.matrix, 5);
    mergeGeometry.merge(torus3, torus3.matrix, 6);
    mergeGeometry.merge(cylinder4, cylinder4.matrix, 7);
    mergeGeometry.merge(torus4, torus4.matrix, 8);
    mergeGeometry.merge(cylinder5, cylinder5.matrix, 9);
    mergeGeometry.merge(torus5, torus5.matrix, 10);
    mergeGeometry.merge(cylinder6, cylinder6.matrix, 11);
    mergeGeometry.merge(torus6, torus6.matrix, 12);
    mergeGeometry.merge(cylinder7, cylinder7.matrix, 13);
    mergeGeometry.merge(torus7, torus7.matrix, 14);
    mergeGeometry.merge(cylinder8, cylinder8.matrix, 15);
    mergeGeometry.merge(torus8, torus8.matrix, 16);
    // Create a texture phong material for the sphere, with map and bumpMap textures
    map = new THREE.TextureLoader().load('img/virus2.png');
    bumpmap = new THREE.TextureLoader().load('img/virus2.png');
    sphereMaterial = new THREE.MeshPhongMaterial({
        map: map,
        bumpMap: bumpmap,
        bumpScale: 0.1
    });

    var virusMesh = new THREE.Mesh(mergeGeometry, [sphereMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial]);



    scene.add(virusMesh);

    // render
    renderer.render(scene, camera);
}

