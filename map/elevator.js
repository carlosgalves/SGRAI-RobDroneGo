import * as THREE from "three";
import { merge } from "../helpers/merge.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import MultiTexturedMaterial from "../helpers/material.js";

/*
 * parameters = {
 *  size: Vector3,
 *  row: int,
 *  column: int,
 *  segments: Vector3,
 *  materialParameters: {
 *   color: Color,
 *   mapUrl: String,
 *   aoMapUrl: String,
 *   aoMapIntensity: Float,
 *   displacementMapUrl: String,
 *   displacementScale: Float,
 *   displacementBias: Float,
 *   normalMapUrl: String,
 *   normalMapType: Integer,
 *   normalScale: Vector2,
 *   bumpMapUrl: String,
 *   bumpScale: Float,
 *   roughnessMapUrl: String,
 *   roughness: Float,
 *   wrapS: Integer,
 *   wrapT: Integer,
 *   repeat: Vector2,
 *   magFilter: Integer,
 *   minFilter: Integer
 *  },
 *  secondaryColor: Color
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
        /*this.elevatorFaceLeft;
        this.elevatorFaceLeft2;
        this.elevatorFaceRight;
        this.elevatorFaceRight2;*/

        // Load the elevator model
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        this.targetPosition = new THREE.Vector3(0, 0, 0);

        // Load MTL file
        mtlLoader.load('../elevator/source/elevator.mtl', (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load('../elevator/source/elevator.obj', (object) => {

                const obj1 = object.getObjectByName('right-door_Cube.001');

                const group = new THREE.Group();
                group.add(obj1);
                object.position.set(0, 0.34, 0);
                object.scale.set(0.005, 0.004, 0.005);

                group.position.set(1.35, 0.34, 0);
                //group.position.set(0, 0.34, 0);
                //group.scale.set(0.005, 0.004, 0.005);
                group.scale.set(0.02, 0.004, 0.005);

                this.object = object;
                this.elevator = group;

                this.add(object);
                this.add(group);
            });
        });
    }

    openAnimation() {
        if (!this.elevator) {
            console.error('Elevator not loaded yet.');
            return;
        }

        if (!this.open) {
            const initialPosition = this.elevator.position.clone();
            const initialScale = this.elevator.scale.clone();
            const targetPosition = new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z);
            const targetScale = new THREE.Vector3(initialScale.x - 0.015, initialScale.y, initialScale.z);

            gsap.to(this.elevator.scale, {
                duration: 1,
                x: targetScale.x,
                y: targetScale.y,
                z: targetScale.z,
                ease: "Power2.easeInOut",
                onComplete: () => {
                    this.open = true;
                    gsap.to(this.elevator.position, {
                        duration: 1,
                        x: targetPosition.x,
                        y: targetPosition.y,
                        z: targetPosition.z,
                        ease: "Power2.easeInOut",
                        onComplete: () => {
                            gsap.to(this.elevator.scale, {
                                duration: 1,
                                x: initialScale.x,
                                y: initialScale.y,
                                z: initialScale.z,
                                ease: "Power2.easeInOut",
                                delay: 2,
                                onComplete: () => {
                                    gsap.to(this.elevator.position, {
                                        duration: 1,
                                        x: initialPosition.x,
                                        y: initialPosition.y,
                                        z: initialPosition.z,
                                        ease: "Power2.easeInOut",
                                        onComplete: () => {
                                            gsap.delayedCall(1, () => {
                                                this.open = false;
                                            });
                                        },
                                    });
                                },
                            });
                        },
                    });
                }
            });
        }
    }
}