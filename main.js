import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const clock = new THREE.Clock();

camera.position.y = 8;
camera.position.z = 30;
camera.rotation.x = -0.3;

window.addEventListener("resize", function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
// const torus = new THREE.Mesh(geometry, material);
// scene.add(torus);

// add background
const backgroundTexture = new THREE.TextureLoader().load("background.png");
scene.background = backgroundTexture;

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 100, 100),
    new THREE.MeshStandardMaterial({ color: 0x00000, opacity: .3, transparent: true })
);
floor.rotation.x = -Math.PI * 0.5;

scene.add(floor);

const playerHeight = 5;

const player = new THREE.Mesh(
    new THREE.BoxGeometry(3, playerHeight, 2),
    new THREE.MeshStandardMaterial({ color: 0xff6347 })
);
scene.add(player);

player.position.y = playerHeight / 2;

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 10, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);

// scene.add(lightHelper);

// const gridHelper = new THREE.GridHelper(100, 100);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

let jumping = false;
let jumpGround = player.scale.y / 2;
let currentJump = 0;
let jumpingDirection = "up";
const startSpeed = 80;
let speed = startSpeed;
let speedIncrease = 1.2;

let keyboard = {};

document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        if (!jumping) {
            jumping = true;
        }
    }

    keyboard[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keyboard[e.key.toLowerCase()] = false;
});

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    let movementSpeed = 25 * delta;

    if (keyboard["shift"]) {
        movementSpeed *= 3;
    }

    if (keyboard["d"]) {
        player.position.x += movementSpeed;
    }

    if (keyboard["a"]) {
        player.position.x -= movementSpeed;
    }

    if (keyboard["w"]) {
        player.position.z -= movementSpeed;
    }

    if (keyboard["s"]) {
        player.position.z += movementSpeed;
    }

    if (jumping) {
        if (jumpingDirection === "up" && speed <= 0) {
            speed = 0;
            jumpingDirection = "down";
        }

        if (
            jumpingDirection === "down" &&
            player.position.y <= playerHeight / 2
        ) {
            jumpingDirection = "up";
            jumping = false;
            speed = startSpeed;
            player.position.y = playerHeight / 2;
        }

        if (jumping) {
            if (jumpingDirection === "up") {
                speed -= speedIncrease;
                player.position.y += speed * delta;
            } else {
                speed += speedIncrease;
                player.position.y -= speed * delta;
            }
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();
