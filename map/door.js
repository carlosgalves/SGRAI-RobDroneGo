import * as THREE from "three";
import { merge } from "../helpers/merge.js";
import MultiTexturedMaterial from "../helpers/material.js";

/*
 * parameters = {
 *  size: Vector3,
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

export default class Door extends THREE.Group {
    constructor(parameters) {
        super();
        merge(this, parameters);
        const halfGroundHeight = this.groundHeight / 2.0;

        // Create the materials
        const primaryMaterial = new MultiTexturedMaterial(this.materialParameters);
        const secondaryMaterial = new THREE.MeshStandardMaterial({ color: this.secondaryColor });
        
        const doorMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

        // Create a wall (seven faces) that casts and receives shadows

        // Create the front face (a rectangle)
        let geometry = new THREE.PlaneGeometry(0.49, 1 + this.groundHeight, this.segments.x, this.segments.y);
        let uv = geometry.getAttribute("uv");
        let uv1 = uv.clone();
        geometry.setAttribute("uv1", uv1); // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap
        
        let doorFace = new THREE.Mesh(geometry, doorMaterial);
        doorFace.position.set(0.23, -halfGroundHeight, 0.025);
        doorFace.castShadow = true;
        doorFace.receiveShadow = true;
        this.add(doorFace);

        doorFace = new THREE.Mesh().copy(doorFace, false);
        doorFace.rotation.y = Math.PI;
        doorFace.position.set(0.23, -halfGroundHeight, -0.025);
        this.add(doorFace);

        
        let face = new THREE.Mesh(geometry, doorMaterial);
        face.castShadow = true;
        face.receiveShadow = true;
        face.position.set(-0.23, -halfGroundHeight, 0.025);
        this.add(face);

        face = new THREE.Mesh().copy(face, false);
        face.rotation.y = Math.PI;
        face.position.set(-0.23, -halfGroundHeight, -0.025);
        this.add(face);

        // Create the two left faces (a four-triangle mesh)
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
        face = new THREE.Mesh(geometry, secondaryMaterial);
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
        const door = new THREE.Group();
        this.children.forEach(mesh => {
            door.add(mesh.clone());
        });
        return door;
    }
}