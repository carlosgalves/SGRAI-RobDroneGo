import * as THREE from "three";
import { merge } from "../helpers/merge.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

/*
 * parameters = {
 *  size: Vector3,
 *  row: int,
 *  column: int,
 *  segments: Vector3
 * }
 */

export default class Elevator extends THREE.Group {
    constructor(parameters) {
        super();
        merge(this, parameters);
        const halfGroundHeight = this.groundHeight / 2.0;
        this.open = false;
        this.elevator;
        this.object;
        this.wall;

        const material = new THREE.MeshStandardMaterial({ color: "#3d3c3c", transparent: true});
        const group = new THREE.Group();

        let geometry = new THREE.PlaneGeometry(0.65, 0.8 + this.groundHeight, this.segments.x, this.segments.y);
        let uv = geometry.getAttribute("uv");
        let uv1 = uv.clone();
        geometry.setAttribute("uv1", uv1); // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap
        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.0, -halfGroundHeight, -0.025);
        face.castShadow = true;
        face.receiveShadow = true;
        group.add(face);

        face = new THREE.Mesh().copy(face, false);
        face.rotation.y = Math.PI;
        face.position.set(0.0, -halfGroundHeight, 0.025);
        group.add(face);
        this.add(group);

        this.elevator = group;

        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        this.targetPosition = new THREE.Vector3(0, 0, 0);

        mtlLoader.load('../elevator/source/elevator.mtl', (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load('../elevator/source/elevator.obj', (object) => {
                object.position.set(0, 0.34, 0);
                object.scale.set(0.005, 0.004, 0.005);

                this.object = object;
                this.add(object);
            });
        });

        const material2 = new THREE.MeshStandardMaterial({ color: "#ffffff", transparent: true, opacity: 0});
        //material2.opacity = 0;
        let geometry2 = new THREE.PlaneGeometry(1, 0.8 + this.groundHeight, this.segments.x, this.segments.y);
        let wall = new THREE.Mesh(geometry2, material2);
        wall.position.set(0, -halfGroundHeight, -0.5);
        wall.castShadow = true;
        wall.receiveShadow = true;
        this.wall = wall;
        this.add(wall);
    }

    openAnimation() {
        if (!this.elevator) {
            console.error('Elevator not loaded yet.');
            return;
        }

        if (!this.open) {
            const initialPosition = this.elevator.position.clone();
            const initialScale = this.elevator.scale.clone();
            const targetPosition = new THREE.Vector3(initialPosition.x+0.2, initialPosition.y, initialPosition.z);
            const targetScale = new THREE.Vector3(initialScale.x - 1, initialScale.y, initialScale.z);
            this.open = true;
            const elevatorMaterial = this.elevator.children[0].material;
            const tl = gsap.timeline();

            tl.to(this.elevator.position, {
                duration: 1,
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                ease: "Power2.easeInOut"
            });

            tl.to(elevatorMaterial, {
                duration: 1,
                opacity: 0
            }, 0);

            tl.to(this.elevator.position, {
                duration: 1,
                x: initialPosition.x,
                y: initialPosition.y,
                z: initialPosition.z,
                ease: "Power2.easeInOut",
                delay: 2
            });

            tl.to(elevatorMaterial, {
                duration: 1.5,
                opacity: 1
            }, "-=1");

            gsap.delayedCall(3.5, () => {
                this.open = false;
            });
        }
    }

    checkCollisionWithWall(playerPosition) {
        const playerPositionRelativeToElevator = this.worldToLocal(playerPosition.clone());

        const wallPosition = this.wall.position.clone();
        if (playerPositionRelativeToElevator.x <= wallPosition.x && playerPositionRelativeToElevator.z <= wallPosition.z) {
            return true;
        }

        return false;
    }

}