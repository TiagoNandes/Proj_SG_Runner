var scene, camera, renderer;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPEED = 0.01;

function init() {
    scene = new THREE.Scene();

    initHeart();
    initCamera();
    initRenderer();


    document.body.appendChild(renderer.domElement);

}

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
    camera.position.set(0, 3.5, 5);
    camera.lookAt(scene.position);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
}

function initHeart() {
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

    heart = new THREE.Mesh(geometry, heartMaterial);

    //resize
    heart.scale.set(0.2, 0.2, .2);

    //rotate heart
    heart.rotateX(Math.PI);

    scene.add(heart);
}

let up = true

function rotateHeart() {
    heart.rotation.y -= SPEED * 2;
    if (up) {
        heart.translateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), 0.02)
        if (Math.floor(heart.position.y) == -1) {
            up = false
            
        }
    } else if (!up) {
        heart.translateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), -0.02)
        if (Math.floor(heart.position.y) == 1) {
            up = true
            
        }
    } else {
        heart.position.set(0, 0, 0)
        
    }


}



function render() {
    requestAnimationFrame(render);
    rotateHeart();
    renderer.render(scene, camera);
}

init();
render();

