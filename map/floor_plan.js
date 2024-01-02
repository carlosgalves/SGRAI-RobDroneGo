import * as THREE from "three";
import { OBB } from "three/addons/math/OBB.js";
import { merge } from "../helpers/merge.js";
import Ground from "./ground.js";
import Wall from "./wall.js";
import Door from "./door.js";
import Elevator from "./elevator.js";

/*
 * parameters = {
 *  url: String,
 *  designCredits: String,
 *  texturesCredits: String,
 *  scale: Vector3,
 *  helpersColor: Color
 * }
 */

export default class FloorPlan extends THREE.Group {
    constructor(parameters) {
        super();
        merge(this, parameters);
        this.loaded = false;
        this.doors = [];
        this.elevators = [];

        this.onLoad = function (description) {
            const normalMapTypes = [THREE.TangentSpaceNormalMap, THREE.ObjectSpaceNormalMap];
            const wrappingModes = [THREE.ClampToEdgeWrapping, THREE.RepeatWrapping, THREE.MirroredRepeatWrapping];
            const magnificationFilters = [THREE.NearestFilter, THREE.LinearFilter];
            const minificationFilters = [THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter, THREE.LinearMipmapLinearFilter];

            // Store the maze's size, map and exit location
            this.size = description.floorPlan.size;
            this.halfSize = { width: this.size.width / 2.0, depth: this.size.depth / 2.0 };
            this.map = description.floorPlan.map;
            // Create the helpers
            this.helper = new THREE.Group();

            // Create the ground
            const ground = new Ground({
                size: new THREE.Vector3(description.ground.size.width, description.ground.size.height, description.ground.size.depth),
                segments: new THREE.Vector3(description.ground.segments.width, description.ground.segments.height, description.ground.segments.depth),
                materialParameters: {
                    color: new THREE.Color(parseInt(description.ground.primaryColor, 16)),
                    mapUrl: description.ground.maps.color.url,
                    aoMapUrl: description.ground.maps.ao.url,
                    aoMapIntensity: description.ground.maps.ao.intensity,
                    displacementMapUrl: description.ground.maps.displacement.url,
                    displacementScale: description.ground.maps.displacement.scale,
                    displacementBias: description.ground.maps.displacement.bias,
                    normalMapUrl: description.ground.maps.normal.url,
                    normalMapType: normalMapTypes[description.ground.maps.normal.type],
                    normalScale: new THREE.Vector2(description.ground.maps.normal.scale.x, description.ground.maps.normal.scale.y),
                    bumpMapUrl: description.ground.maps.bump.url,
                    bumpScale: description.ground.maps.bump.scale,
                    roughnessMapUrl: description.ground.maps.roughness.url,
                    roughness: description.ground.maps.roughness.rough,
                    wrapS: wrappingModes[description.ground.wrapS],
                    wrapT: wrappingModes[description.ground.wrapT],
                    repeat: new THREE.Vector2(description.ground.repeat.u, description.ground.repeat.v),
                    magFilter: magnificationFilters[description.ground.magFilter],
                    minFilter: minificationFilters[description.ground.minFilter]
                },
                secondaryColor: new THREE.Color(parseInt(description.ground.secondaryColor, 16))
            });
            this.add(ground);

            // Create a wall
            const wall = new Wall({
                groundHeight: description.ground.size.height,
                segments: new THREE.Vector2(description.wall.segments.width, description.wall.segments.height),
                materialParameters: {
                    color: new THREE.Color(parseInt(description.wall.primaryColor, 16)),
                    mapUrl: description.wall.maps.color.url,
                    aoMapUrl: description.wall.maps.ao.url,
                    aoMapIntensity: description.wall.maps.ao.intensity,
                    displacementMapUrl: description.wall.maps.displacement.url,
                    displacementScale: description.wall.maps.displacement.scale,
                    displacementBias: description.wall.maps.displacement.bias,
                    normalMapUrl: description.wall.maps.normal.url,
                    normalMapType: normalMapTypes[description.wall.maps.normal.type],
                    normalScale: new THREE.Vector2(description.wall.maps.normal.scale.x, description.wall.maps.normal.scale.y),
                    bumpMapUrl: description.wall.maps.bump.url,
                    bumpScale: description.wall.maps.bump.scale,
                    roughnessMapUrl: description.wall.maps.roughness.url,
                    roughness: description.wall.maps.roughness.rough,
                    wrapS: wrappingModes[description.wall.wrapS],
                    wrapT: wrappingModes[description.wall.wrapT],
                    repeat: new THREE.Vector2(description.wall.repeat.u, description.wall.repeat.v),
                    magFilter: magnificationFilters[description.wall.magFilter],
                    minFilter: minificationFilters[description.wall.minFilter]
                },
                secondaryColor: new THREE.Color(parseInt(description.wall.secondaryColor, 16))
            });

            // Build the maze
            let clonedWall;
            this.aabb = [];
            for (let i = 0; i <= this.size.depth; i++) { // In order to represent the southmost walls, the map depth is one row greater than the actual maze depth
                this.aabb[i] = [];
                for (let j = 0; j <= this.size.width; j++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                    this.aabb[i][j] = [];
                    /*
                     *  this.map[][] | North wall | West wall
                     * --------------+------------+-----------
                     *       0       |     No     |     No
                     *       1       |     No     |    Yes
                     *       2       |    Yes     |     No
                     *       3       |    Yes     |    Yes
                     */
                    if (this.map[i][j] === 2 || this.map[i][j] === 3 || this.map[i][j] === 11 || this.map[i][j] === 9 ) {
                        clonedWall = wall.clone();
                        clonedWall.position.set(j - this.halfSize.width + 0.5, 0.5, i - this.halfSize.depth);
                        this.add(clonedWall);
                        this.aabb[i][j][0] = new THREE.Box3().setFromObject(clonedWall).applyMatrix4(new THREE.Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z));
                        this.helper.add(new THREE.Box3Helper(this.aabb[i][j][0], this.helpersColor));

                    }
                    if (this.map[i][j] === 1 || this.map[i][j] === 3 || this.map[i][j] === 10 || this.map[i][j] === 8) {
                        clonedWall = wall.clone();
                        clonedWall.rotateY(Math.PI / 2.0);
                        clonedWall.position.set(j - this.halfSize.width, 0.5, i - this.halfSize.depth + 0.5);
                        this.add(clonedWall);
                        this.aabb[i][j][1] = new THREE.Box3().setFromObject(clonedWall).applyMatrix4(new THREE.Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z));
                        this.helper.add(new THREE.Box3Helper(this.aabb[i][j][1], this.helpersColor));
                    }
                    if (this.map[i][j] === 4 || this.map[i][j] === 8) {
                        const clonedDoor = new Door({
                            groundHeight: description.ground.size.height,
                            segments: new THREE.Vector2(description.wall.segments.width, description.wall.segments.height),
                            row: 0,
                            column: 0
                        });
                        clonedDoor.row = i;
                        clonedDoor.column = j;
                        clonedDoor.position.set(j - this.halfSize.width + 0.5, 0.5, i - this.halfSize.depth);
                        this.add(clonedDoor);
                        this.doors.push(clonedDoor);
                        this.aabb[i][j][0] = new THREE.Box3().setFromObject(clonedDoor).applyMatrix4(new THREE.Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z));
                        this.helper.add(new THREE.Box3Helper(this.aabb[i][j][0], this.helpersColor));

                    }
                    if (this.map[i][j] === 5 || this.map[i][j] === 9) {
                        const clonedDoor = new Door({
                            groundHeight: description.ground.size.height,
                            segments: new THREE.Vector2(description.wall.segments.width, description.wall.segments.height),
                            row: 0,
                            column: 0
                        });
                        clonedDoor.row = i;
                        clonedDoor.column = j;
                        clonedDoor.rotateY(Math.PI / 2.0);
                        clonedDoor.position.set(j - this.halfSize.width, 0.5, i - this.halfSize.depth + 0.5);
                        this.add(clonedDoor);
                        this.doors.push(clonedDoor);
                        this.aabb[i][j][1] = new THREE.Box3().setFromObject(clonedDoor).applyMatrix4(new THREE.Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z));
                        this.helper.add(new THREE.Box3Helper(this.aabb[i][j][1], this.helpersColor));
                    }
                    if (this.map[i][j] === 6 || this.map[i][j] === 10) {
                        const clonedElevator = new Elevator({
                            groundHeight: description.ground.size.height,
                            segments: new THREE.Vector2(description.wall.segments.width, description.wall.segments.height),
                            row: 0,
                            column: 0
                        });
                        clonedElevator.row = i;
                        clonedElevator.column = j;
                        clonedElevator.position.set(j - this.halfSize.width + 0.5, 0.5, i - this.halfSize.depth);
                        this.add(clonedElevator);
                        this.elevators.push(clonedElevator);
                        this.aabb[i][j][0] = new THREE.Box3().setFromObject(clonedElevator).applyMatrix4(new THREE.Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z));
                        this.helper.add(new THREE.Box3Helper(this.aabb[i][j][0], this.helpersColor));

                    }
                    if (this.map[i][j] === 7 || this.map[i][j] === 11) {
                        const clonedElevator = new Elevator({
                            groundHeight: description.ground.size.height,
                            segments: new THREE.Vector2(description.wall.segments.width, description.wall.segments.height),
                            row: 0,
                            column: 0
                        });
                        clonedElevator.row = i;
                        clonedElevator.column = j;
                        clonedElevator.rotateY(Math.PI / 2.0);
                        clonedElevator.position.set(j - this.halfSize.width, 0.5, i - this.halfSize.depth + 0.5);
                        this.add(clonedElevator);
                        this.elevators.push(clonedElevator);
                        this.aabb[i][j][1] = new THREE.Box3().setFromObject(clonedElevator).applyMatrix4(new THREE.Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z));
                        this.helper.add(new THREE.Box3Helper(this.aabb[i][j][1], this.helpersColor));
                    }
                }
            }

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.player.initialPosition);
            this.initialDirection = description.player.initialDirection;

            this.loaded = true;
        }

        const onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        const onError = function (url, error) {
            console.error("Error loading resource '" + url + "' (" + error + ").");
        }

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => onProgress(this.url, xhr),

            // onError callback
            error => onError(this.url, error)
        );
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.halfSize.width + 0.5) * this.scale.x, 0.0, (position[0] - this.halfSize.depth + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.halfSize.depth), Math.floor(position.x / this.scale.x + this.halfSize.width)];
    }

    // Detect collision with corners (method: BC/AABB)
    cornerCollision(indices, offsets, orientation, position, delta, radius, name) {
        const row = indices[0] + offsets[0];
        const column = indices[1] + offsets[1];
        if (this.map[row][column] === 2 - orientation || this.map[row][column] === 3) {
            const x = position.x - (this.cellToCartesian([row, column]).x + delta.x * this.scale.x);
            const z = position.z - (this.cellToCartesian([row, column]).z + delta.z * this.scale.z);
            if (x * x + z * z < radius * radius) {
                console.log("Collision with " + name + ".");
                return true;
            }
        }
        return false;
    }

    // Detect collision with walls (method: BC/AABB)
    wallCollision(indices, offsets, orientation, position, delta, radius, name) {
        const row = indices[0] + offsets[0];
        const column = indices[1] + offsets[1];
        if (this.map[row][column] === 2 - orientation || this.map[row][column] === 3) {
            if (orientation !== 0) {
                if (Math.abs(position.x - (this.cellToCartesian([row, column]).x + delta.x * this.scale.x)) < radius) {
                    console.log("Collision with " + name + ".");
                    return true;
                }
            }
            else {
                if (Math.abs(position.z - (this.cellToCartesian([row, column]).z + delta.z * this.scale.z)) < radius) {
                    console.log("Collision with " + name + ".");
                    return true;
                }
            }
        }
        return false;
    }

    // Detect collision with walls and corners (method: OBB/AABB)
    wallAndCornerCollision(indices, offsets, orientation, obb, name) {
        const row = indices[0] + offsets[0];
        const column = indices[1] + offsets[1];
        if (this.map[row][column] === 2 - orientation || this.map[row][column] === 3) {
            if (obb.intersectsBox3(this.aabb[row][column][orientation])) {
                console.log("Collision with " + name + ".");
                return true;
            }
        }
        return false;
    }
    doorCollision(indices, offsets, orientation, position, delta, radius, name) {
        const row = indices[0] + offsets[0];
        const column = indices[1] + offsets[1];
    
        const isDoor = this.map[row][column] === 4 || this.map[row][column] === 5 || this.map[row][column] === 8 || this.map[row][column] === 9;

        if (isDoor) {
            const doorPosition = new THREE.Vector3(
                column - this.halfSize.width + 0.5,
                0.5,
                row - this.halfSize.depth
            );
            const distanceToDoor = position.distanceTo(doorPosition);

            //console.log("Near the " + name + ".");
            this.interactWithDoor(row, column, distanceToDoor);
            

        }
        return false;
    }

    interactWithDoor(row, column, distanceToDoor) {
        const currentDoor = this.doors.find(door => door.row === row && door.column === column);
        if (currentDoor && distanceToDoor < 7.5) {
            currentDoor.openAnimation(); 
        }

    }

    isPlayerInElevator = false;

    showElevatorPopup() {
        var elevatorPopup = document.getElementById("elevatorPopup");

        // Make sure the elevator popup exists
        if (elevatorPopup) {
            // Center the popup on the screen
            elevatorPopup.style.display = "block";

            // You can add additional logic or actions here if needed
        }
    }

    elevatorCollision(indices, offsets, orientation, position, delta, radius, name) {
        const row = indices[0] + offsets[0];
        const column = indices[1] + offsets[1];
    
        const isElevator = this.map[row][column] === 10 || this.map[row][column] === 11 || this.map[row][column] === 6 || this.map[row][column] === 7;
    
        if (isElevator) {
            const elevatorPosition = new THREE.Vector3(
                column - this.halfSize.width + 0.5,
                0.5,
                row - this.halfSize.depth
            );
            const distanceToDoor = position.distanceTo(elevatorPosition);
            console.log(distanceToDoor)

            if (distanceToDoor <0.52 && !this.isPlayerInElevator) {
                this.showElevatorPopup()
                this.isPlayerInElevator = true;
            } else if (distanceToDoor >= 0.52) {
                this.isPlayerInElevator = false;
            }

            if (distanceToDoor < 7.5) { //TODO
                this.interactWithElevator(row, column);
            }
        }

        return false;
    }


    interactWithElevator(row, column) {
        const currentElevator = this.elevators.find(door => door.row === row && door.column === column);
        //console.log('Row ' + row + ' Column ' + column);
        if (currentElevator) {
            currentElevator.openAnimation(); 
        }
    }

    passageCollision(indices, offsets, orientation, position, delta, radius, name) {
        const row = indices[0] + offsets[0];
        const column = indices[1] + offsets[1];

        if (this.map[row][column] >= 20) {
            const passagePosition = new THREE.Vector3(
                column - this.halfSize.width + 0.5,
                0.5,
                row - this.halfSize.depth
            );
            const distanceToPassage = position.distanceTo(passagePosition);

            if (distanceToPassage < 7.5) {
                return true;
            }
        }
        return false;
    }

    changeLevel(matrixValue) {
        const buildingIdentifier = Math.floor(matrixValue / 10) % 10;
        const floorIdentifier = matrixValue % 10;
        console.log(floorIdentifier + ' - bu: ' + buildingIdentifier);
        let floor;
        let building;
        switch (buildingIdentifier) {
            case 2:
                building = 'a';
                break;
            case 3:
                building = 'b';
                break;
            case 4:
                building = 'c';
                break;
            case 5:
                building = 'd';
                break;
            default:
                return;
                break;
        }
        switch (floorIdentifier) {
            case 0:
                floor = '1';
                break;
            case 1:
                floor = '2';
                break;
            case 2:
                floor = '3';
                break;
            case 3:
                floor = '4';
                break;
            default:
                return;
                break;
        }

        const nextFloor = `/floor_plans/building_${building}/floor${floor}.json`;

        const reloadEvent = new CustomEvent('reloadLevel', {
            detail: { building: building, floor: floor }
        });
        document.dispatchEvent(reloadEvent);
        return nextFloor;
    }
    nextLevelColision(method, position, halfSize, direction) {
        const indices = this.cartesianToCell(position);
        if (method !== "obb-aabb") {
            if( this.passageCollision(indices, [0, 0], 0, position, { x: 0.0, z: -0.475 }, halfSize, "north passage") || // Check for passages
                this.passageCollision(indices, [0, 0], 1, position, { x: -0.475, z: 0.0 }, halfSize, "west passage") ) {
                const row = indices[0];
                const column = indices[1];
                return this.changeLevel(this.map[row][column])
            }
        }
        return null;
    }
    // Detect collisions
    collision(method, position, halfSize, direction) {
        const indices = this.cartesianToCell(position);
        if (method !== "obb-aabb") {
            if (
                this.elevatorCollision(indices, [0, 0], 0, position, { x: 0.0, z: -0.475 }, halfSize, "north elevator") || // Collision with north door
                this.elevatorCollision(indices, [0, 0], 1, position, { x: -0.475, z: 0.0 }, halfSize, "west elevator") || // Collision with west door
                this.elevatorCollision(indices, [1, 0], 0, position, { x: 0.0, z: -0.525 }, halfSize, "south elevator") || // Collision with south door
                this.elevatorCollision(indices, [0, 1], 1, position, { x: -0.525, z: 0.0 }, halfSize, "east elevator") || 
                this.doorCollision(indices, [0, 0], 0, position, { x: 0.0, z: -0.475 }, halfSize, "north door") || // Collision with north door
                this.doorCollision(indices, [0, 0], 1, position, { x: -0.475, z: 0.0 }, halfSize, "west door") || // Collision with west door
                this.doorCollision(indices, [1, 0], 0, position, { x: 0.0, z: -0.525 }, halfSize, "south door") || // Collision with south door
                this.doorCollision(indices, [0, 1], 1, position, { x: -0.525, z: 0.0 }, halfSize, "east door")  ||
                this.wallCollision(indices, [0, 0], 0, position, { x: 0.0, z: -0.475 }, halfSize, "north wall") || // Collision with north wall
                this.wallCollision(indices, [0, 0], 1, position, { x: -0.475, z: 0.0 }, halfSize, "west wall") || // Collision with west wall
                this.wallCollision(indices, [1, 0], 0, position, { x: 0.0, z: -0.525 }, halfSize, "south wall") || // Collision with south wall
                this.wallCollision(indices, [0, 1], 1, position, { x: -0.525, z: 0.0 }, halfSize, "east wall") || // Collision with east wall
                this.cornerCollision(indices, [1, 0], 1, position, { x: -0.475, z: -0.5 }, halfSize, "southwest corner (NS-oriented wall)") || // Collision with southwest corner (NS-oriented wall)
                this.cornerCollision(indices, [1, 1], 0, position, { x: -0.5, z: -0.525 }, halfSize, "southeast corner (WE-oriented wall)") || // Collision with southeast corner (WE-oriented wall)
                this.cornerCollision(indices, [1, 1], 1, position, { x: -0.525, z: -0.5 }, halfSize, "southeast corner (NS-oriented wall)") || // Collision with southeast corner (NS-oriented wall)
                this.cornerCollision(indices, [0, 1], 0, position, { x: -0.5, z: -0.475 }, halfSize, "northeast corner (WE-oriented wall)") || // Collision with northeast corner (WE-oriented wall)

                indices[0] > 0 && (
                    this.cornerCollision(indices, [-1, 1], 1, position, { x: -0.525, z: 0.5 }, halfSize, "northeast corner (NS-oriented wall)") || // Collision with northeast corner (NS-oriented wall)
                    this.cornerCollision(indices, [-1, 0], 1, position, { x: -0.475, z: 0.5 }, halfSize, "northwest corner (NS-oriented wall)") // Collision with northwest corner (NS-oriented wall)
                ) ||
                indices[1] > 0 && (
                    this.cornerCollision(indices, [0, -1], 0, position, { x: 0.5, z: -0.475 }, halfSize, "northwest corner (WE-oriented wall)") || // Collision with northwest corner (WE-oriented wall)
                    this.cornerCollision(indices, [1, -1], 0, position, { x: 0.5, z: -0.525 }, halfSize, "southwest corner (WE-oriented wall)") // Collision with southwest corner (WE-oriented wall)
                )
            ) {
                return true;
            }
            // No collision
            return false;
        }
        else {
            // Create the object's oriented bounding box (OBB) in 3D space and set its orientation
            const obb = new OBB(position, halfSize);
            obb.applyMatrix4(new THREE.Matrix4().makeRotationY(direction));
            if (
                this.wallAndCornerCollision(indices, [0, 0], 0, obb, "north wall") || // Collision with north wall
                this.wallAndCornerCollision(indices, [0, 0], 1, obb, "west wall") || // Collision with west wall
                this.wallAndCornerCollision(indices, [1, 0], 0, obb, "south wall") || // Collision with south wall
                this.wallAndCornerCollision(indices, [0, 1], 1, obb, "east wall") || // Collision with east wall

                this.wallAndCornerCollision(indices, [1, 0], 1, obb, "southwest corner (NS-oriented wall)") || // Collision with southwest corner (NS-oriented wall)
                this.wallAndCornerCollision(indices, [1, 1], 0, obb, "southeast corner (WE-oriented wall)") || // Collision with southeast corner (WE-oriented wall)
                this.wallAndCornerCollision(indices, [1, 1], 1, obb, "southeast corner (NS-oriented wall)") || // Collision with southeast corner (NS-oriented wall)
                this.wallAndCornerCollision(indices, [0, 1], 0, obb, "northeast corner (WE-oriented wall)") || // Collision with northeast corner (WE-oriented wall)

                indices[0] > 0 && (
                    this.wallAndCornerCollision(indices, [-1, 1], 1, obb, "northeast corner (NS-oriented wall)") || // Collision with northeast corner (NS-oriented wall)
                    this.wallAndCornerCollision(indices, [-1, 0], 1, obb, "northwest corner (NS-oriented wall)") // Collision with northwest corner (NS-oriented wall)
                ) ||
                indices[1] > 0 && (
                    this.wallAndCornerCollision(indices, [0, -1], 0, obb, "northwest corner (WE-oriented wall)") || // Collision with northwest corner (WE-oriented wall)
                    this.wallAndCornerCollision(indices, [1, -1], 0, obb, "southwest corner (WE-oriented wall)") // Collision with southwest corner (WE-oriented wall)
                )
            ) {
                return true;
            }
            // No collision
            return false;
        }
    }
}