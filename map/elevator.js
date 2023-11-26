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
                object.position.set(0, 0.34, 0);
                object.scale.set(0.005, 0.004, 0.005);
                this.add(object);
            });
        });
    }




        // Create the materials
        /*const primaryMaterial = new MultiTexturedMaterial(this.materialParameters);
        const secondaryMaterial = new THREE.MeshStandardMaterial({ color: this.secondaryColor });
        
        const elevatorMaterial = new THREE.MeshBasicMaterial( {color: 0xff8000, side: THREE.DoubleSide} );
        // Create a wall (seven faces) that casts and receives shadows

        // Create the front face (a rectangle)
        let geometry = new THREE.PlaneGeometry(0.49, 1 + this.groundHeight, this.segments.x, this.segments.y);
        let uv = geometry.getAttribute("uv");
        let uv1 = uv.clone();
        geometry.setAttribute("uv1", uv1); // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap
        this.elevatorFaceRight = new THREE.Mesh(geometry, elevatorMaterial);
        this.elevatorFaceRight.position.set(0.23, -halfGroundHeight, 0.025);
        this.elevatorFaceRight.castShadow = true;
        this.elevatorFaceRight.receiveShadow = true;
        this.add(this.elevatorFaceRight);

        this.elevatorFaceRight2 = new THREE.Mesh().copy(this.elevatorFaceRight, false);
        this.elevatorFaceRight2.rotation.y = Math.PI;
        this.elevatorFaceRight2.position.set(0.23, -halfGroundHeight, -0.025);
        this.add(this.elevatorFaceRight2);

        
        this.elevatorFaceLeft = new THREE.Mesh(geometry, elevatorMaterial);
        this.elevatorFaceLeft.castShadow = true;
        this.elevatorFaceLeft.receiveShadow = true;
        this.elevatorFaceLeft.position.set(-0.23, -halfGroundHeight, 0.015);
        this.add(this.elevatorFaceLeft);

        this.elevatorFaceLeft2 = new THREE.Mesh().copy(this.elevatorFaceLeft, false);
        this.elevatorFaceLeft2.rotation.y = Math.PI;
        this.elevatorFaceLeft2.position.set(-0.23, -halfGroundHeight, -0.015);
        this.add(this.elevatorFaceLeft2);

    
        // Create the rear face (a rectangle)
        face = new THREE.Mesh().copy(face, false);
        face.rotation.y = Math.PI;
        face.position.set(0.0, -halfGroundHeight, -0.025);
        this.add(face);

        //Create the two left faces (a four-triangle mesh)
        let points = new Float32Array([
            -0.475, -0.5 - this.groundHeight, 0.025,
            -0.475, 0.5, 0.025,
            -0.5, 0.5, 0.0,
            -0.5, -0.5 - this.groundHeight, 0.0,
        
            -0.5, 0.5, 0.0,
            -0.475, 0.5, -0.025,
            -0.475, -0.5 - this.groundHeight, -0.025,
            -0.5, -0.5 - this.groundHeight, 0.0
        ]);
        let normals = new Float32Array([
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,

            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707
        ]);
        let indices = [
            0, 1, 2,
            2, 3, 0,
            4, 5, 6,
            6, 7, 4
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        let face = new THREE.Mesh(geometry, secondaryMaterial);
        face.castShadow = true;
        face.receiveShadow = true;
        this.add(face);

        // Create the two right faces (a four-triangle mesh)
        face = new THREE.Mesh().copy(face, false);
        face.rotation.y = Math.PI;
        this.add(face);

        // Create the top face (a four-triangle mesh)
        points = new Float32Array([
            -0.5, 0.5, 0.0,
            -0.475, 0.5, 0.025,
            -0.475, 0.5, -0.025,
            0.475, 0.5, 0.025,
            0.475, 0.5, -0.025,
            0.5, 0.5, 0.0
        ]);
        normals = new Float32Array([
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ]);
        indices = [
            0, 1, 2,
            2, 1, 3,
            3, 4, 2,
            4, 3, 5
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        face = new THREE.Mesh(geometry, secondaryMaterial);
        face.castShadow = true;
        face.receiveShadow = true;
        this.add(face);
    }

    clone() {
        const elevator = new THREE.Group();
        this.children.forEach(mesh => {
            elevator.add(mesh.clone());
        });
        return elevator;*/



    openAnimation() {

    /*const initialRightFacePosition = this.elevatorFaceRight.position.clone();
    const initialRightFace2Position = this.elevatorFaceRight.position.clone();
    const initialLeftFacePosition = this.elevatorFaceLeft.position.clone();
    const initialLeftFace2Position = this.elevatorFaceLeft2.position.clone();

    const targetPositionRight = new THREE.Vector3(initialRightFacePosition.x + 1, initialRightFacePosition.y, initialRightFacePosition.z);
    const targetPositionRight2 = new THREE.Vector3(initialRightFace2Position.x + 1, initialRightFace2Position.y, initialRightFace2Position.z);
    const targetPositionLeft = new THREE.Vector3(initialLeftFacePosition.x + 0.4, initialLeftFacePosition.y, initialLeftFacePosition.z);
    const targetPositionLeft2 = new THREE.Vector3(initialLeftFace2Position.x + 0.4, initialLeftFace2Position.y, initialLeftFace2Position.z);


    //const targetPosition = new THREE.Vector3(initialPosition.x, initialPosition.y + 0.5, initialPosition.z);
    //let targetRotation = new THREE.Euler(initialRotation.x + Math.PI/2, initialRotation.y, initialRotation.z );
    if (this.rotation.y == Math.PI/2) {
      //  targetRotation = new THREE.Euler(Math.PI/2 , initialRotation.y, initialRotation.z );
    }
    if (!this.open) {
          gsap.to([this.elevatorFaceLeft.position], {
                duration: 1,
                x: [targetPositionLeft.x],
                y: [targetPositionLeft.y],
                z: [targetPositionLeft.z],
                ease: "Power2.easeInOut",
                onComplete: () => {
                    gsap.to([this.elevatorFaceLeft.position], {
                        duration: 1,
                        x: [initialLeftFacePosition.x],
                        y: [initialLeftFacePosition.y],
                        z: [initialLeftFacePosition.z],
                        ease: "Power2.easeInOut",
                        delay: 3,
                    });                    }
            });
            gsap.to([this.elevatorFaceLeft2.position], {
                duration: 1,
                x: [targetPositionLeft2.x],
                y: [targetPositionLeft2.y],
                z: [targetPositionLeft2.z],
                ease: "Power2.easeInOut",
                onComplete: () => {
                    this.open = true;
                    gsap.to([this.elevatorFaceLeft2.position], {
                        duration: 1,
                        x: [initialLeftFace2Position.x],
                        y: [initialLeftFace2Position.y],
                        z: [initialLeftFace2Position.z],
                        ease: "Power2.easeInOut",
                        delay: 3,
                        onComplete: () => {
                        this.open = false;
                        }
                    });
                }
            });*/
    }


}