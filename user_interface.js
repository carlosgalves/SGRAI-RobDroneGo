import * as THREE from "three";
import Orientation from "./orientation.js";
import CubeTexture from "./cube_textures/cubetexture.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export default class UserInterface extends GUI {
    constructor(floorPlan) {
        super();

        const audioCallback = function (enabled) {
            if (!enabled) {
                floorPlan.audio.stopAll();
            }
        }

        const textureCallback = function (options, name) {
            floorPlan.cubeTexture = new CubeTexture(floorPlan.cubeTexturesParameters.skyboxes[options.indexOf(name)]);
            floorPlan.buildCreditsPanel();
        }

        const createEmoteCallback = function (animations, name) {
            callbacks[name] = function () {
                animations.fadeToAction(name, 0.2);
            };
            emotesFolder.add(callbacks, name);
        }

        const positionCallback = function (light, distance, orientation) {
            const position = light.orientationToPosition(distance, orientation);
            light.position.set(position.x, position.y, position.z);
        }

        this.resetUserInterface = function () {
            this.reset();
            floorPlan.fixedViewCamera.fogDensity = floorPlan.fixedViewCamera.initialFogDensity;
            floorPlan.firstPersonViewCamera.fogDensity = floorPlan.firstPersonViewCamera.initialFogDensity;
            floorPlan.thirdPersonViewCamera.fogDensity = floorPlan.thirdPersonViewCamera.initialFogDensity;
            floorPlan.topViewCamera.fogDensity = floorPlan.topViewCamera.initialFogDensity;
            this.fogParameters.density = floorPlan.activeViewCamera.fogDensity;
        }

        const fontSize = "1.5vmin";

        this.domElement.style.position = "absolute";
        this.domElement.style.right = "0.5vw";
        this.domElement.style.top = "1.0vh";
        this.domElement.style.fontSize = fontSize;

        // Create the audio folder
        const audioFolder = this.addFolder("Audio");
        audioFolder.domElement.style.fontSize = fontSize;
        audioFolder.add(floorPlan.audio, "enabled").onChange(enabled => audioCallback(enabled));
        audioFolder.add(floorPlan.audio, "volume", floorPlan.audio.volumeMin, floorPlan.audio.volumeMax, floorPlan.audio.volumeStep).onChange(volume => floorPlan.audio.listener.setMasterVolume(volume));
        audioFolder.close();

        // Create the skyboxes folder and add cube textures
        const skyboxesFolder = this.addFolder("Skyboxes");
        skyboxesFolder.domElement.style.fontSize = fontSize;
        const cubeTexturesParameters = { name: floorPlan.cubeTexturesParameters.skyboxes[floorPlan.cubeTexturesParameters.selected].name };
        const cubeTexturesOptions = [];
        for (let i = 0; i < floorPlan.cubeTexturesParameters.skyboxes.length; i++) {
            cubeTexturesOptions[i] = floorPlan.cubeTexturesParameters.skyboxes[i].name;
        }
        skyboxesFolder.add(cubeTexturesParameters, "name").options(cubeTexturesOptions).onChange(name => textureCallback(cubeTexturesOptions, name));
        skyboxesFolder.close();

        // Create the character folder
        const characterFolder = this.addFolder("Character");
        characterFolder.domElement.style.fontSize = fontSize;

        // Create the emotes folder and add emotes
        /*const emotesFolder = characterFolder.addFolder("Emotes");
        emotesFolder.domElement.style.fontSize = fontSize;
        const callbacks = [];
        for (let i = 0; i < floorPlan.animations.emotes.length; i++) {
            createEmoteCallback(floorPlan.animations, floorPlan.animations.emotes[i]);
        }
        emotesFolder.close();*/

        // Create the expressions folder and add expressions
        /*const expressionsFolder = characterFolder.addFolder("Expressions");
        expressionsFolder.domElement.style.fontSize = fontSize;
        const expressions = Object.keys(floorPlan.player.face.morphTargetDictionary);
        for (let i = 0; i < expressions.length; i++) {
            expressionsFolder.add(floorPlan.player.face.morphTargetInfluences, i, 0.0, 1.0, 0.01).name(expressions[i]);
        }
        expressionsFolder.close();*/

        characterFolder.close();

        // Create the lights folder
        const lightsFolder = this.addFolder("Lights");
        lightsFolder.domElement.style.fontSize = fontSize;

        // Create the ambient light folder
        const ambientLightFolder = lightsFolder.addFolder("Ambient light");
        ambientLightFolder.domElement.style.fontSize = fontSize;
        const ambientLightParameters = { color: "#" + new THREE.Color(floorPlan.ambientLight.color).getHexString() };
        ambientLightFolder.add(floorPlan.ambientLight, "visible").listen();
        ambientLightFolder.addColor(ambientLightParameters, "color").onChange(color => floorPlan.ambientLight.color.set(color));
        ambientLightFolder.add(floorPlan.ambientLight, "intensity", floorPlan.ambientLight.intensityMin, floorPlan.ambientLight.intensityMax, floorPlan.ambientLight.intensityStep);
        ambientLightFolder.close();

        // Create the directional light folder
        const directionalLightFolder = lightsFolder.addFolder("Directional light");
        directionalLightFolder.domElement.style.fontSize = fontSize;
        const directionalLightParameters = { color: "#" + new THREE.Color(floorPlan.directionalLight.color).getHexString() };
        directionalLightFolder.add(floorPlan.directionalLight, "visible").listen();
        directionalLightFolder.addColor(directionalLightParameters, "color").onChange(color => floorPlan.directionalLight.color.set(color));
        directionalLightFolder.add(floorPlan.directionalLight, "intensity", floorPlan.directionalLight.intensityMin, floorPlan.directionalLight.intensityMax, floorPlan.directionalLight.intensityStep);
        directionalLightFolder.add(floorPlan.directionalLight.orientation, "h", floorPlan.directionalLight.orientationMin.h, floorPlan.directionalLight.orientationMax.h, floorPlan.directionalLight.orientationStep.h).onChange(h => positionCallback(floorPlan.directionalLight, floorPlan.directionalLight.distance, new Orientation(h, floorPlan.directionalLight.orientation.v)));
        directionalLightFolder.add(floorPlan.directionalLight.orientation, "v", floorPlan.directionalLight.orientationMin.v, floorPlan.directionalLight.orientationMax.v, floorPlan.directionalLight.orientationStep.v).onChange(v => positionCallback(floorPlan.directionalLight, floorPlan.directionalLight.distance, new Orientation(floorPlan.directionalLight.orientation.h, v)));
        directionalLightFolder.close();

        // Create the spotlight folder
        const spotLightFolder = lightsFolder.addFolder("Spotlight");
        spotLightFolder.domElement.style.fontSize = fontSize;
        const spotLightParameters = { color: "#" + new THREE.Color(floorPlan.spotLight.color).getHexString(), angle: THREE.MathUtils.radToDeg(floorPlan.spotLight.angle) };
        spotLightFolder.add(floorPlan.spotLight, "visible").listen();
        spotLightFolder.addColor(spotLightParameters, "color").onChange(color => floorPlan.spotLight.color.set(color));
        spotLightFolder.add(floorPlan.spotLight, "intensity", floorPlan.spotLight.intensityMin, floorPlan.spotLight.intensityMax, floorPlan.spotLight.intensityStep);
        spotLightFolder.add(floorPlan.spotLight, "distance", floorPlan.spotLight.distanceMin, floorPlan.spotLight.distanceMax, floorPlan.spotLight.distanceStep);
        spotLightFolder.add(spotLightParameters, "angle", floorPlan.spotLight.angleMin, floorPlan.spotLight.angleMax, floorPlan.spotLight.angleStep).onChange(angle => floorPlan.spotLight.angle = THREE.MathUtils.degToRad(angle));
        spotLightFolder.add(floorPlan.spotLight, "penumbra", floorPlan.spotLight.penumbraMin, floorPlan.spotLight.penumbraMax, floorPlan.spotLight.penumbraStep);
        spotLightFolder.add(floorPlan.spotLight.position, "x", floorPlan.spotLight.positionMin.x, floorPlan.spotLight.positionMax.x, floorPlan.spotLight.positionStep.x);
        spotLightFolder.add(floorPlan.spotLight.position, "y", floorPlan.spotLight.positionMin.y, floorPlan.spotLight.positionMax.y, floorPlan.spotLight.positionStep.y);
        spotLightFolder.add(floorPlan.spotLight.position, "z", floorPlan.spotLight.positionMin.z, floorPlan.spotLight.positionMax.z, floorPlan.spotLight.positionStep.z);
        spotLightFolder.close();

        // Create the flashlight folder
        const flashLightFolder = lightsFolder.addFolder("Flashlight");
        flashLightFolder.domElement.style.fontSize = fontSize;
        const flashLightParameters = { color: "#" + new THREE.Color(floorPlan.flashLight.color).getHexString(), angle: THREE.MathUtils.radToDeg(floorPlan.flashLight.angle) };
        flashLightFolder.add(floorPlan.flashLight, "visible").listen();
        flashLightFolder.addColor(flashLightParameters, "color").onChange(color => floorPlan.flashLight.color.set(color));
        flashLightFolder.add(floorPlan.flashLight, "intensity", floorPlan.flashLight.intensityMin, floorPlan.flashLight.intensityMax, floorPlan.flashLight.intensityStep);
        flashLightFolder.add(floorPlan.flashLight, "distance", floorPlan.flashLight.distanceMin, floorPlan.flashLight.distanceMax, floorPlan.flashLight.distanceStep);
        flashLightFolder.add(flashLightParameters, "angle", floorPlan.flashLight.angleMin, floorPlan.flashLight.angleMax, floorPlan.flashLight.angleStep).onChange(angle => floorPlan.flashLight.angle = THREE.MathUtils.degToRad(angle));
        flashLightFolder.add(floorPlan.flashLight, "penumbra", floorPlan.flashLight.penumbraMin, floorPlan.flashLight.penumbraMax, floorPlan.flashLight.penumbraStep);
        flashLightFolder.add(floorPlan.flashLight.orientation, "h", floorPlan.flashLight.orientationMin.h, floorPlan.flashLight.orientationMax.h, floorPlan.flashLight.orientationStep.h).onChange(h => positionCallback(floorPlan.flashLight, floorPlan.flashLight.distance, new Orientation(h, floorPlan.flashLight.orientation.v)));
        flashLightFolder.add(floorPlan.flashLight.orientation, "v", floorPlan.flashLight.orientationMin.v, floorPlan.flashLight.orientationMax.v, floorPlan.flashLight.orientationStep.v).onChange(v => positionCallback(floorPlan.flashLight, floorPlan.flashLight.distance, new Orientation(floorPlan.flashLight.orientation.h, v)));
        flashLightFolder.close();

        lightsFolder.close();

        // Create the shadows folder
        const shadowsFolder = this.addFolder("Shadows");
        shadowsFolder.domElement.style.fontSize = fontSize;
        shadowsFolder.add(floorPlan.shadowsParameters, "enabled").listen();
        shadowsFolder.close();

        // Create the fog folder
        const fogFolder = this.addFolder("Fog");
        fogFolder.domElement.style.fontSize = fontSize;
        this.fogParameters = { color: "#" + new THREE.Color(floorPlan.fog.color).getHexString(), density: floorPlan.activeViewCamera.fogDensity };
        fogFolder.add(floorPlan.fog, "enabled").listen();
        fogFolder.addColor(this.fogParameters, "color").onChange(color => floorPlan.fog.color.set(color));
        fogFolder.add(this.fogParameters, "density", floorPlan.fog.densityMin, floorPlan.fog.densityMax, floorPlan.fog.densityStep).onChange(density => floorPlan.activeViewCamera.fogDensity = density).listen();
        fogFolder.close();

        // Create the collision detection folder
        const collisionDetectionFolder = this.addFolder("Collision detection");
        collisionDetectionFolder.domElement.style.fontSize = fontSize;
        const collisionDetectionParameters = { method: floorPlan.collisionDetectionParameters.method == "bc-aabb" ? "BC / AABB" : "OBB / AABB" };
        const collisionDetectionOptions = ["BC / AABB", "OBB / AABB"];
        collisionDetectionFolder.add(collisionDetectionParameters, "method").options(collisionDetectionOptions).onChange(name => floorPlan.setCollisionDetectionMethod(["bc-aabb", "obb-aabb"][collisionDetectionOptions.indexOf(name)]));
        collisionDetectionFolder.add(floorPlan.collisionDetectionParameters.boundingVolumes, "visible").onChange(visible => floorPlan.setBoundingVolumesVisibility(visible)).listen();
        collisionDetectionFolder.close();

        // Create the reset button
        this.add({ reset: () => this.resetUserInterface() }, "reset");

        this.close();
    }

    setVisibility(visible) {
        if ("show" in this && "hide" in this) {
            if (visible) {
                this.show();
            }
            else {
                this.hide();
            }
        }
        else { // Some lil-gui versions do not implement show() / hide() methods
            if (visible) {
                this.domElement.style.display = "block";
            }
            else {
                this.domElement.style.display = "none";
            }
        }
    }
}