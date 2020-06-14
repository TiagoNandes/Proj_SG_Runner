window.onload = function () {
    var sceneWidth, sceneHeight, rollingGroundSphere, dom, sun, camera, scene, renderer, sphericalHelper, pathAngleValues;
    var heartsInPath, heartsPool, hasCollided, up;
    var orbitControl;
    var rollingSpeed = 0.003;
    var worldRadius = 26;
    //var heartRotationSpeed = 1;
    var heartReleaseInterval = 0.5;

    //****** FABIO VARIABLES */
    let clock, loader, mixer, animations, robot;
    let score = 0;
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

        clock = new THREE.Clock();

        sphericalHelper = new THREE.Spherical();

        //Scene Properties
        scene = new THREE.Scene();
        sceneWidth = window.innerWidth;
        sceneHeight = window.innerHeight;
        // scene.fog = new THREE.FogExp2(0xf0fff0, 0.14); //enable fog
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

        //----------------------------------------------------------------------------
        // Camera position
        //----------------------------------------------------------------------------
        camera.position.z = 10.5;
        camera.position.y = 5.5;

        //Helping grid
        // var gridXZ = new THREE.GridHelper(100, 10);
        // scene.add(gridXZ);


        //----------------------------------------------------------------------------
        // Enables mouse and zoom controlls on the scene 
        //----------------------------------------------------------------------------
        orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.addEventListener('change', render);
        // Disable zoom functionality
        orbitControl.enableZoom = true;

        // Call Functions to add the components of the game
        // createHeartsPool();
        addWorld();
        addLight();
        addRobot();
        addSkyBox();
        addScore();
        //createHeart();
        //createHeartsPool();
        setInterval(updateScore, 1000);

        //Handle keydown and resize events
        document.addEventListener('keydown', handleKeyDown, false);
        // document.addEventListener('keyup', handleKeyRelease, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    //----------------------------------------------------------------------------
    // Sky 
    //----------------------------------------------------------------------------
    function addSkyBox() {
        // Create a Sphere Geometry with a space texture to be applied as background scene 
        let skyGeo = new THREE.SphereGeometry(worldRadius * 2, 25, 25);
        let loader = new THREE.TextureLoader(),
            //todo TROCAR CAMINHO PARA TESTAR DIFERENTES FUNDOS
            texture = loader.load("textures/milky_way.jpg");

        let material = new THREE.MeshPhongMaterial({
            map: texture,
        });

        let sky = new THREE.Mesh(skyGeo, material);
        sky.material.side = THREE.BackSide;
        scene.add(sky);
    }


    //----------------------------------------------------------------------------
    // Lights and shadows
    //----------------------------------------------------------------------------
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

    //----------------------------------------------------------------------------
    // Adds the moon to the scene and calls the object's functions
    //----------------------------------------------------------------------------
    function addWorld() {
        var sphereGeometry = new THREE.SphereGeometry(worldRadius, 60, 60);

        // Create a texture phong material for the sphere, with map and bumpMap textures
        map = new THREE.TextureLoader().load('textures/mercury.jpg');
        bumpmap = new THREE.TextureLoader().load('textures/mercury.jpg');
        sphereMaterial = new THREE.MeshPhongMaterial({
            map: map,
            bumpMap: bumpmap,
            bumpScale: 0.05
        });

        rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        //Allow shadow
        rollingGroundSphere.receiveShadow = true;
        rollingGroundSphere.castShadow = false;
        rollingGroundSphere.rotation.z = -Math.PI / 2;
        scene.add(rollingGroundSphere);
        rollingGroundSphere.position.y = -24;
        rollingGroundSphere.position.z = 2;
        addWorldHearts();
        addWorldBarriers();
        addWorldVirus();
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


    //----------------------------------------------------------------------------
    // Create Heart
    //----------------------------------------------------------------------------
    function createHeart() {
        var heartShape = new THREE.Shape();
        let heartMaterial = new THREE.MeshPhongMaterial({
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
        // Allow heart object to cast shadow
        heart.castShadow = true;
        //resize heart
        heart.scale.set(0.1, 0.1, 0.1);

        return heart;
    }


    //----------------------------------------------------------------------------
    // Create Virus
    //----------------------------------------------------------------------------
    function createVirus() {

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

        var virus = new THREE.Mesh(mergeGeometry, [sphereMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial, virusMaterial, redMaterial]);

        //resize virus
        virus.scale.set(0.15, 0.15, .15);
        // Allow virus object to cast shadow
        virus.castShadow = true;

        return virus;
    }

    //----------------------------------------------------------------------------
    // Create Barrier
    //----------------------------------------------------------------------------
    function createBarrier() {

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

        // Allow barrier object to cast shadow
        barrier.castShadow = true;

        return barrier;
    }

    //----------------------------------------------------------------------------
    //TODO Heart addicional animation 
    //----------------------------------------------------------------------------
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


    //----------------------------------------------------------------------------
    // Adds hearts to the scene based on the number of hearts and the gap between them
    //----------------------------------------------------------------------------
    function addWorldHearts() {
        var numHearts = 26; //36
        var gap = 6.28 / 26; //6.28 / 36
        // var gap=6.28/ 36;
        for (var i = 0; i < numHearts; i++) {
            var rnd = Math.random();
            if (rnd >= 0.5) {
                addHeart(false, i * gap, true);
            } else {
                addHeart(false, i * gap, false);
            }

        }
    }


    //----------------------------------------------------------------------------
    // Sets the new heart's position on the scene 
    //----------------------------------------------------------------------------
    function addHeart(inPath, row, isLeft) {
        var newHeart;
        if (inPath) {
            if (heartsPool.length == 0) return;
            newHeart = heartsPool.pop();
            newHeart.visible = true;
            heartsInPath.push(newHeart);
            // sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row], -rollingGroundSphere.rotation.x + 4);
        } else {
            newHeart = createHeart();
            // Define Left and Right position of the heart object
            var forestAreaAngle = 0; //[1.52,1.57,1.62];
            if (isLeft) {
                forestAreaAngle = Math.random() * (1.75 - 1.6) + 1.6; //1.68 + Math.random() * 0.3
            } else {
                forestAreaAngle = Math.random() * (1.4 - 1.54) + 1.54; //1.46 - Math.random() * 0.1
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

    //----------------------------------------------------------------------------
    // Adds barriers to the scene based on the number of hearts and the gap between them
    //----------------------------------------------------------------------------
    function addWorldBarriers() {
        var numBarriers = 15; //36
        var gap = 6.28 / 15; //6.28 / 36
        // var gap=6.28/ 36;
        for (var i = 0; i < numBarriers; i++) {
            addBarrier(false, i * gap, true);
            //addBarrier(false, i * gap, false);
        }
    }

    //----------------------------------------------------------------------------
    // Sets the new barrier's position on the scene 
    //----------------------------------------------------------------------------
    function addBarrier(inPath, row, isLeft) {
        var newBarrier;
        if (inPath) {
            if (barriersPool.length == 0) return;
            newBarrier = barriersPool.pop();
            newBarrier.visible = true;
            barriersInPath.push(newBarrier);
            // sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row], -rollingGroundSphere.rotation.x + 4);
        } else {
            newBarrier = createBarrier();
            // Define Left and Right position of the heart object
            var forestAreaAngle = 0; //[1.52,1.57,1.62];
            if (isLeft) {
                forestAreaAngle = 1.68 + Math.random() * 0.3;
            } else {
                forestAreaAngle = 1.46 - Math.random() * 0.1;
            }
            sphericalHelper.set(worldRadius + 1, forestAreaAngle, row);
        }
        newBarrier.position.setFromSpherical(sphericalHelper);
        var rollingGroundVector = rollingGroundSphere.position.clone().normalize();
        var barrierVector = newBarrier.position.clone().normalize();
        newBarrier.quaternion.setFromUnitVectors(barrierVector, rollingGroundVector);
        newBarrier.rotation.x += (Math.random() * (2 * Math.PI / 10)) + -Math.PI / 10;

        rollingGroundSphere.add(newBarrier);
    }


    //----------------------------------------------------------------------------
    // Adds virus to the scene based on the number of hearts and the gap between them
    //----------------------------------------------------------------------------
    function addWorldVirus() {
        var numVirus = 15; //36
        var gap = 9.28 / 15; //6.28 / 36
        // var gap=6.28/ 36;
        for (var i = 0; i < numVirus; i++) {
            addVirus(false, i * gap, true);
            //addVirus(false, i * gap, false);
        }
    }

    //----------------------------------------------------------------------------
    // Sets the new virus' position on the scene 
    //----------------------------------------------------------------------------
    function addVirus(inPath, row, isLeft) {
        var newVirus;
        if (inPath) {
            if (virusPool.length == 0) return;
            newVirus = virusPool.pop();
            newVirus.visible = true;
            virusInPath.push(newVirus);
            // sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row], -rollingGroundSphere.rotation.x + 4);
        } else {
            newVirus = createVirus();
            // Define Left and Right position of the heart object
            var forestAreaAngle = 0; //[1.52,1.57,1.62];
            if (isLeft) {
                forestAreaAngle = 1.68 + Math.random() * 0.3;
            } else {
                forestAreaAngle = 1.46 - Math.random() * 0.1;
            }
            sphericalHelper.set(worldRadius + 1, forestAreaAngle, row);
        }
        newVirus.position.setFromSpherical(sphericalHelper);
        var rollingGroundVector = rollingGroundSphere.position.clone().normalize();
        var virusVector = newVirus.position.clone().normalize();
        newVirus.quaternion.setFromUnitVectors(virusVector, rollingGroundVector);
        newVirus.rotation.x += (Math.random() * (2 * Math.PI / 10)) + -Math.PI / 10;

        rollingGroundSphere.add(newVirus);
    }

    //----------------------------------------------------------------------------
    // Adds robot to the scene
    //----------------------------------------------------------------------------
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

    function addScore() {
        let loader = new THREE.FontLoader();
        loader.load('fonts/font.json', data => {
            font = data;
            let text = 'Score: ' + score;
            let geo = new THREE.TextGeometry(text, {
                font: font,
                size: 0.3,
                height: 0.05
            })

            let material = new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
            let scoreMesh = new THREE.Mesh(geo, material);
            scoreMesh.position.x = worldRadius - 26.8;
            scoreMesh.position.y = 5;
            scoreMesh.position.z = 1;
            // scoreMesh.rotateY(Math.PI / 2)
            scene.add(scoreMesh)


        })
    }

    function updateScore() {
        if (score >= 1000) {
            score += 5;
        }

    }

    //----------------------------------------------------------------------------
    //  Function to handle pressed keys by the user 
    //----------------------------------------------------------------------------
    function handleKeyDown(e) {
        let keyCode = e.which
        // Jump animation
        if (keyCode == 32) {
            state.name = 'Jump'
            mixer = new THREE.AnimationMixer(robot);
            let clip = THREE.AnimationClip.findByName(animations, state.name);
            let action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopOnce) // Make the "jump" animation play only one time per key press
            action.play();
            robot.position.y = 2.5;

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

    //----------------------------------------------------------------------------
    //  Function to handle released keys 
    //----------------------------------------------------------------------------
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

    //----------------------------------------------------------------------------
    //  Function to handle colisions 
    //----------------------------------------------------------------------------
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


    //----------------------------------------------------------------------------
    //  Function to handle window resizes 
    //----------------------------------------------------------------------------
    function onWindowResize() {
        //resize & align
        sceneHeight = window.innerHeight;
        sceneWidth = window.innerWidth;
        renderer.setSize(sceneWidth, sceneHeight);
        camera.aspect = sceneWidth / sceneHeight;
        camera.updateProjectionMatrix();
    }

    function updateRollingSpeed() {
        if (rollingSpeed > 1) {
            rollingSpeed += 0.01
        }

    }

    function update() {
        //animate
        //Ground animation
        rollingGroundSphere.rotation.x += rollingSpeed;
        requestAnimationFrame(update); //request next update


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