import * as THREE from "three";

export class BoxHelper extends THREE.LineSegments {
    constructor(color) {
        super();

        this.geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.0, 2.0, 2.0));
        this.material = new THREE.LineBasicMaterial({ color: color });
    }
}