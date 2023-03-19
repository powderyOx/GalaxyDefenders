import * as THREE from 'three';
import './css/demo-style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const element = document.getElementById("step2_active");
element.addEventListener("click", step2);

const element1 = document.getElementById("step9_active");
element1.addEventListener("click", step9);

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

// Load the background image
const backgroundImage = textureLoader.load('img/galaxy.jpg', function (texture) {
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(window.innerWidth / texture.image.width, window.innerHeight / texture.image.height);
});

scene.background = backgroundImage;


// board
const board = new THREE.Mesh(
    new THREE.PlaneGeometry(23, 20),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('./img/assets/board.png') })
);
board.position.set(0, 3, 0);
scene.add(board);

// agent card
const agent_card = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 4.5),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('./img/assets/agent.png'), transparent: true })
);

agent_card.position.set(15, 0, 0);
scene.add(agent_card);

// enemy card
const enemy_card = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('./img/cards/xb-b.png') })
);

enemy_card.position.set(-15, 0, 0);
scene.add(enemy_card);

// agent symbol on map
const agent = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 4, 2),
    new THREE.MeshBasicMaterial({
        color: 0x00ff00
    })
);

agent.position.set(3.85, 3.0, 0.5);
scene.add(agent);

// enemy symbol on map
const enemy = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 4, 2),
    new THREE.MeshBasicMaterial({
        color: 0xff0000
    })
);

enemy.position.set(-1, 5.7, 0.5);
scene.add(enemy);


//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//light
const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 10, 10);
scene.add(light);

// create a camera
const camera = new THREE.PerspectiveCamera(75,sizes.width / sizes.height);
camera.position.set(0, -5, 16);
scene.add(camera);


// create a renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


function step2() {
    agent.position.set(0.635, 3, 0.5);
    
}
function step9() {
    enemy.position.set(-1.7, 7, 0.5);
}
// resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
});

/*
const objects = [enemy, agent];

function animate(time) {
    highlightMesh.material.opacity = 1 + Math.sin(time / 120);
    objects.forEach(function(object) {
        object.rotation.x = time / 1000;
        object.rotation.z = time / 1000;
        object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
    });
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);*/


const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}
loop();






/*
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 15, -22);

orbit.update();

const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({
        //side: THREE.DoubleSide,
        //visible: false,
        map: new THREE.TextureLoader().load('./img/board.png')
    })
);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.rotateZ(Math.PI);
scene.add(planeMesh);

const agent = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 4, 2),
    new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x00ff00
    })
);

agent.position.set(0.5, 0.4, 0.5);
scene.add(agent);

const enemy = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 4, 2),
    new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xff0000
    })
);

enemy.position.set(3.5, 0.4, 3.5);
scene.add(enemy);

//const grid = new THREE.GridHelper(20, 20);
//scene.add(grid);

const highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true
    })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.rotateZ(Math.PI);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObject(planeMesh);
    if(intersects.length > 0) {
        const intersect = intersects[0];
        const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
        highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);

        const objectExist = objects.find(function(object) {
            return (object.position.x === highlightMesh.position.x)
            && (object.position.z === highlightMesh.position.z)
        });

        if(!objectExist)
            highlightMesh.material.color.setHex(0xFFFFFF);
        else
            highlightMesh.material.color.setHex(0xFF0000);
    }
});

const objects = [enemy, agent];

window.addEventListener('mousedown', function() {
    const objectExist = objects.find(function(object) {
        return (object.position.x === highlightMesh.position.x)
        && (object.position.z === highlightMesh.position.z)
    });

    if(!objectExist) {
        if(intersects.length > 0) {
            //const sphereClone = agent.clone();
            //sphereClone.position.copy(highlightMesh.position);
            //scene.add(sphereClone);
            //objects.push(sphereClone);
            highlightMesh.material.color.setHex(0xFF0000);
        }
    }
    console.log(scene.children.length);
});

function animate(time) {
    highlightMesh.material.opacity = 1 + Math.sin(time / 120);
    objects.forEach(function(object) {
        object.rotation.x = time / 1000;
        object.rotation.z = time / 1000;
        object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
    });
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});*/