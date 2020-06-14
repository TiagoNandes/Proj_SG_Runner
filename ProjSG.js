window.onload = function () {
    // var heartRotationSpeed = 1;
    // let up = true;

    var sceneWidth, sceneHeight;
    var camera, scene, renderer;
    var dom;
    var sun;
    var ground;
    //var orbitControl;
    var rollingGroundSphere;
    var heroSphere;
    var rollingSpeed = 0.003;
    var heroRollingSpeed;
    var worldRadius = 26;
    var heroRadius = 0.2;
    var sphericalHelper;
    var pathAngleValues;
    var heroBaseY = 1.8;
    var bounceValue = 0.1;
    var gravity = 0.005;
    var leftLane = -1;
    var rightLane = 1;
    var middleLane = 0;
    var currentLane;
    var jumping;
    var treeReleaseInterval = 0.5;
    var lastTreeReleaseTime = 0;
    var heartsInPath;
    var heartsPool;
    var particleGeometry;
    var particleCount = 20;
    var explosionPower = 1.06;
    var particles;
    //var stats;
    var score;
    var hasCollided;

    //****** FABIO VARIABLES */
    let clock, loader, mixer, animations, robot;
    // Array of obstacles
    let obstacles = [];
    // Initial state of the robot animation which is "Idle" by default
    let state = {
        name: 'Idle'
    }
    //****** FABIO VARIABLES */


    function init() {

        // set up the scene
        createScene();
        //call game loop
        update();
    }

    function createScene() {
        //vars
        heartsInPath = [];
        heartsPool = [];
        pathAngleValues = [1.52, 1.57, 1.62];
        sphericalHelper = new THREE.Spherical();

        hasCollided = false;
        score = 0;
        treesInPath = [];
        treesPool = [];
        clock = new THREE.Clock();
        clock.start();
        heroRollingSpeed = (rollingSpeed * worldRadius / heroRadius) / 5;
        sphericalHelper = new THREE.Spherical();

        //Scene Properties
        scene = new THREE.Scene();
        sceneWidth = window.innerWidth;
        sceneHeight = window.innerHeight;
        scene.fog = new THREE.FogExp2(0xf0fff0, 0.14); //enable fog
        camera = new THREE.PerspectiveCamera(60, sceneWidth / sceneHeight, 0.1, 1000); //perspective camera

        //Renderer
        renderer = new THREE.WebGLRenderer({
            alpha: true
        }); //renderer with transparent backdrop
        renderer.setClearColor(0xfffafa, 1);
        renderer.shadowMap.enabled = true; //enable shadow
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(sceneWidth, sceneHeight);
        dom = document.getElementById('gameContainer');
        dom.appendChild(renderer.domElement);

        // Call Functions to add the components of the game
        // createHeartsPool();
        addWorld();
        addLight();
        addRobot();
        //createHeart();
        //createHeartsPool();

        camera.position.z = 10.5;
        camera.position.y = 5.5;

        //Helping grid
        var gridXZ = new THREE.GridHelper(100, 10);
        scene.add(gridXZ);

        //----------------------------------------------------------------------------
        // Add Barrier
        //----------------------------------------------------------------------------
        var barrierGeometry = new THREE.BoxGeometry(2, 4, 10);
        // Create a texture phong material for the sphere, with map and bumpMap textures
        barrierMap = new THREE.TextureLoader().load('textures/barrier.jpg');
        barrierBumpMap = new THREE.TextureLoader().load('textures/barrier.jpg');
        barrierMaterial = new THREE.MeshPhongMaterial({
            map: barrierMap,
            bumpMap: barrierBumpMap,
            bumpScale: 0.1
        });

        var barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);

        //resize barrier
        barrier.scale.set(0.2, 0.2, .2);

        //rotate barrier
        barrier.rotateY(Math.PI / 2);

        scene.add(barrier);

        //----------------------------------------------------------------------------
        // Add Virus
        //----------------------------------------------------------------------------
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
        cylinder.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
        cylinder.rotateX(Math.PI / 2);
        var torus = new THREE.TorusGeometry(.4, .15, 16, 100);
        torus.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
        torus.rotateX((Math.PI / 2) + (Math.PI / 2));
        //arm2
        var cylinder2 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
        cylinder2.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
        cylinder2.rotateX(Math.PI);
        var torus2 = new THREE.TorusGeometry(.4, .15, 16, 100);
        torus2.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
        torus2.rotateX((Math.PI / 2) + Math.PI);
        //arm3
        var cylinder3 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
        cylinder3.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
        cylinder3.rotateX(3 * Math.PI / 2);
        var torus3 = new THREE.TorusGeometry(.4, .15, 16, 100);
        torus3.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
        torus3.rotateX((Math.PI / 2) + (3 * Math.PI / 2));
        //arm4
        var cylinder4 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
        cylinder4.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
        cylinder4.rotateX(0);
        var torus4 = new THREE.TorusGeometry(.4, .15, 16, 100);
        torus4.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
        torus4.rotateX((Math.PI / 2) + 0);
        //arm5
        var cylinder5 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
        cylinder5.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
        cylinder5.rotateX(Math.PI / 4);
        var torus5 = new THREE.TorusGeometry(.4, .15, 16, 100);
        torus5.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
        torus5.rotateX((Math.PI / 2) + (Math.PI / 4));
        //arm6
        var cylinder6 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
        cylinder6.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
        cylinder6.rotateX(-Math.PI / 4);
        var torus6 = new THREE.TorusGeometry(.4, .15, 16, 100);
        torus6.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
        torus6.rotateX((Math.PI / 2) + (-Math.PI / 4));
        //arm7
        var cylinder7 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
        cylinder7.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
        cylinder7.rotateX(3 * Math.PI / 4);
        var torus7 = new THREE.TorusGeometry(.4, .15, 16, 100);
        torus7.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
        torus7.rotateX((Math.PI / 2) + (3 * Math.PI / 4));
        //arm8
        var cylinder8 = new THREE.CylinderGeometry(.25, .35, 1.5, 32);
        cylinder8.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5.5, 0));
        cylinder8.rotateX(-(3 * Math.PI / 4));
        var torus8 = new THREE.TorusGeometry(.4, .15, 16, 100);
        torus8.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 6.2));
        torus8.rotateX((Math.PI / 2) - (3 * Math.PI / 4));


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
        map = new THREE.TextureLoader().load('textures/virus2.png');
        bumpmap = new THREE.TextureLoader().load('textures/virus2.png');
        sphereMaterial = new THREE.MeshPhongMaterial({
            map: map,
            bumpMap: bumpmap,
            bumpScale: 0.1
        });

        var virusMesh = new THREE.Mesh(mergeGeometry, [sphereMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial]);

        //resize virus
        virusMesh.scale.set(0.2, 0.2, .2);

        //rotate virus
        virusMesh.rotateY(-Math.PI / 2);

        scene.add(virusMesh);


        //----------------------------------------------------------------------------
        // Camera position
        //----------------------------------------------------------------------------
        // camera.position.z = 5;
        // camera.position.y = 1.5;

        //----------------------------------------------------------------------------
        // Lights and shadows
        //----------------------------------------------------------------------------
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


        //Handle keydown and resize events
        document.addEventListener('keydown', handleKeyDown, false);
        // document.addEventListener('keyup', handleKeyRelease, false);
        window.addEventListener('resize', onWindowResize, false);
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


    //! nao esta a fazer nada - ver se é necessário
    //! Criar coleção de hearts
    // function createHeartsPool() {
    //     var maxHeartsInPool = 0;
    //     var newHeart;
    //     for (var i = 0; i < maxHeartsInPool; i++) {
    //         newHeart = createHeart();
    //         heartsPool.push(newHeart);
    //     }
    // }


    function addWorld() {
        var sides = 60;
        var tiers = 60;
        var sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);

        // Create a texture phong material for the sphere, with map and bumpMap textures
        map = new THREE.TextureLoader().load('textures/mercury.jpg');
        bumpmap = new THREE.TextureLoader().load('textures/mercury.jpg');
        sphereMaterial = new THREE.MeshPhongMaterial({
            map: map,
            bumpMap: bumpmap,
            bumpScale: 0.05
        });




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
        addWorldHearts();
    }

    function createHeart() {
        var heartShape = new THREE.Shape();
        let heartMaterial = new THREE.MeshBasicMaterial({
            color: 0xE31B23
        });

        const x = -2;
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

        heart = new THREE.Mesh(geometry, heartMaterial);

        //resize heart
        heart.scale.set(0.1, 0.1, 0.1);


        //rotate heart
        heart.rotateZ(Math.PI / 2);

        //scene.add(heart);

        return heart;
    }

    //Heart animation
    // function rotateHeart() {
    //     heart.rotation.z -= heartRotationSpeed;
    //     if (up) {
    //         heart.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), 0.02)
    //         if (Math.floor(heart.position.z) == -1) {
    //             up = false

    //         }
    //     } else if (!up) {
    //         heart.translateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), -0.02)
    //         if (Math.floor(heart.position.z) == 1) {
    //             up = true

    //         }
    //     } else {
    //         heart.position.set(0, 0, 0)

    //     }


    // }


    //! nao esta a fazer nada - ver se é necessário
    // function addPathHeart() {
    //     var options = [0, 1, 2];
    //     var lane = Math.floor(Math.random() * 3);
    //     addHeart(true, lane);
    //     options.splice(lane, 1);
    //     if (Math.random() > 0.5) {
    //         lane = Math.floor(Math.random() * 2);
    //         addHeart(true, options[lane]);

    //     }
    // }

    function addWorldHearts() {
        var numHearts = 36;
        var gap = 6.28 / 36;
        // var gap=6.28/ 36;
        for (var i = 0; i < numHearts; i++) {
            addHeart(false, i * gap, true);
            addHeart(false, i * gap, false);
        }
    }

    function addHeart(inPath, row, isLeft) {
        var newHeart;
        if (inPath) {
            if (heartsPool.length == 0) return;
            newHeart = heartsPool.pop();
            newHeart.visible = true;
            //console.log("add heart");
            heartsInPath.push(newHeart);
            // sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row], -rollingGroundSphere.rotation.x + 4);
        } else {
            newHeart = createHeart();
            // Define Left and Right position of the heart object
            var forestAreaAngle = 0; //[1.52,1.57,1.62];
            if (isLeft) {
                forestAreaAngle = 1.68 + Math.random() * 0.1;
            } else {
                forestAreaAngle = 1.46 - Math.random() * 0.1;
            }
            sphericalHelper.set(worldRadius + 1, forestAreaAngle, row);
        }
        newHeart.position.setFromSpherical(sphericalHelper);
        var rollingGroundVector = rollingGroundSphere.position.clone().normalize();
        var heartVector = newHeart.position.clone().normalize();
        newHeart.quaternion.setFromUnitVectors(heartVector, rollingGroundVector);
        newHeart.rotation.x += (Math.random() * (2 * Math.PI / 10)) + -Math.PI / 10;

        rollingGroundSphere.add(newHeart);
    }

    function addRobot() {
        loader = new THREE.GLTFLoader();
        loader.load('models/GLTF/RobotExpressive.glb',
            function (gltf) {
                // Import robot and his animations and add them to the scene
                robot = gltf.scene;
                animations = gltf.animations;
                scene.add(robot);
                // Set positions 
                robot.position.y = 2;
                robot.position.z = 1;
                robot.scale.set(0.3, 0.3, 0.3);
                camera.position.z = 5;

                // Rotation
                robot.rotation.y = Math.PI;

                // Play Idle animation at first 
                mixer = new THREE.AnimationMixer(robot);
                let clip = THREE.AnimationClip.findByName(animations, state.name);
                let action = mixer.clipAction(clip);
                action.play();

            })
    }

    // Function to handle pressed keys by the user 
    function handleKeyDown(e) {
        let keyCode = e.which
        // Jump animation
        if (keyCode == 32) {
            state.name = 'Jump'
            mixer = new THREE.AnimationMixer(robot);
            let clip = THREE.AnimationClip.findByName(animations, state.name);
            let action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopOnce) // Make the "jump" animation play only one time per key press
            robot.position.y = 3;
            action.play();


            setTimeout(function () {
                robot.position.y = 2;
            }, 500);
        }
        // Running animation - PRESS W TO START
        if (keyCode == 87) {
            state.name = 'Running'
            mixer = new THREE.AnimationMixer(robot);
            let clip = THREE.AnimationClip.findByName(animations, state.name);
            let action = mixer.clipAction(clip);
            action.play();
        }
        // Death animation - PRESS M
        if (keyCode == 77) {
            state.name = 'Death'
            mixer = new THREE.AnimationMixer(robot);
            let clip = THREE.AnimationClip.findByName(animations, state.name);
            let action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopOnce)
            action.play();
        }
        // Robot move left - PRESS A 
        if (keyCode == 65) {
            robot.position.x -= 0.08
            robot.rotation.y = -2.8;
        }
        // Robot move right - PRESS D
        if (keyCode == 68) {
            robot.position.x += 0.08
            robot.rotation.y = 2.8;

        }
    }

    function handleKeyRelease(e) {
        let keyCode = e.which;
        // Jump animation
        if (keyCode == 32) {
            robot.position.y = 2;
            state.name = 'Running'
            mixer = new THREE.AnimationMixer(robot);
            let clip = THREE.AnimationClip.findByName(animations, state.name);
            let action = mixer.clipAction(clip);
            action.play();
        }
    }

    function detectCollision() {
        // let originPoint = robot.position.clone();
        // console.log(originPoint);
        let robotBox = new THREE.Box3().setFromObject(robot);
        for (let i = 0; i < obstacles.length; i++) {
            // let obstBox = new THREE.Box3().setFromObject(obstacles[i]);
            let collision = robotBox.intersectsBox(obstBox);
            return false;
        }
    }

    function onWindowResize() {
        //resize & align
        sceneHeight = window.innerHeight;
        sceneWidth = window.innerWidth;
        renderer.setSize(sceneWidth, sceneHeight);
        camera.aspect = sceneWidth / sceneHeight;
        camera.updateProjectionMatrix();
    }

    function update() {
        //animate
        //Ground animation
        rollingGroundSphere.rotation.x += rollingSpeed;
        requestAnimationFrame(update); //request next update

        /***FABIO*/
        let deltaTime = clock.getDelta();
        mixer.update(deltaTime)
        render();
    }

    function render() {
        // rotateHeart();
        renderer.render(scene, camera); //draw
    }


    init();
}