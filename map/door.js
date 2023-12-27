import * as THREE from "three";
import { merge } from "../helpers/merge.js";
import MultiTexturedMaterial from "../helpers/material.js";
import { OBB } from "three/addons/math/OBB.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
/*
 * parameters = {
 *  size: Vector3,
 *  segments: Vector3,
 *  row: int,
 *  column: int
 * }
 */

export default class Door extends THREE.Group {
    initialDoorPosition = new THREE.Vector3();
    constructor(parameters) {
        super();
        merge(this, parameters);
        const halfGroundHeight = this.groundHeight / 2.0;
        this.open = false;
        this.object;
        this.group;

        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        this.initialDoorPosition.copy(this.position);

        mtlLoader.load('../door/sliding-door-001-obj/sliding-door-001.mtl', (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load('../door/sliding-door-001-obj/sliding-door-001.obj', (object) => {

                const obj1 = object.getObjectByName('Box001');
                const obj2 = object.getObjectByName('Box002');
                const obj3 = object.getObjectByName('Box003');
                const obj4 = object.getObjectByName('Cylinder001');
                const obj5 = object.getObjectByName('Cylinder004');


                const group = new THREE.Group();
                group.add(obj1);
                group.add(obj2);
                group.add(obj3);
                group.add(obj4);
                group.add(obj5);

                object.position.set(0, -0.5, 0);
                object.scale.set(1.1, 0.472, 1);

                group.position.set(0,-0.5,0);
                group.scale.set(1.1, 0.472, 1);

                this.object = object;
                this.group = group;

                this.add(object);
                this.add(group);

            });
        });
    }

    openAnimation() {
        if (!this.group) {
            console.error('Door not loaded yet.');
            return;
        }

        if (!this.open) {
            this.open = true;
            const initialDoorPosition = this.group.position.clone();
            const targetDoorPosition = new THREE.Vector3(initialDoorPosition.x + 0.9, initialDoorPosition.y, initialDoorPosition.z + 0.05);
            const endPosition = new THREE.Vector3(initialDoorPosition.x - 0.015, initialDoorPosition.y, initialDoorPosition.z);
            gsap.to(this.group.position, {
                duration: 1,
                x: targetDoorPosition.x,
                y: targetDoorPosition.y,
                z: targetDoorPosition.z,
                ease: "Power2.easeInOut",
                onComplete: () => {
                    gsap.to(this.group.position, {
                        duration: 1,
                        x: endPosition.x,
                        y: endPosition.y,
                        z: endPosition.z,
                        ease: "Power2.easeInOut",
                        delay: 2,
                        onComplete: () => {
                            gsap.delayedCall(2, () => {
                                this.open = false;
                            });
                        }
                    });
                }
            });
        }
    }
}