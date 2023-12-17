import * as THREE from "three";

export default class Animations {
    constructor(object) {
        this.states = ["SK_BoxyBoo.ao|A_Boxy_Idle", "SK_BoxyBoo.ao|A_Boxy_Walk", "SK_BoxyBoo.ao|A_Boxy_JumpAbilityAirborne", "SK_BoxyBoo.ao|A_Boxy_Dance", "SK_BoxyBoo.ao|A_Boxy_BoxTransitionOut", "Sitting", "Standing"];
        this.emotes = ["SK_BoxyBoo.ao|A_Boxy_Jump", "SK_BoxyBoo.ao|A_Boxy_DefaultPose", "SK_BoxyBoo.ao|A_Boxy_Flip", "SK_BoxyBoo.ao|A_Boxy_ToyBoxPoseA", "SK_BoxyBoo.ao|A_Boxy_AttackLeft", "ThumbsUp"];

        this.mixer = new THREE.AnimationMixer(object);
        this.actionInProgress = false;

        this.actions = {};
        for (let i = 0; i < object.animations.length; i++) {
            const clip = object.animations[i];
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
            if (this.states.indexOf(clip.name) >= 4 || this.emotes.indexOf(clip.name) >= 0) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }
        this.resetIdleTime();
        this.activeName = "SK_BoxyBoo.ao|A_Boxy_Idle";
        this.actions[this.activeName].play();
    }

    fadeToAction(name, duration) {
        if (this.activeName != name && !this.actionInProgress) {
            const previousName = this.activeName;
            this.activeName = name;
            this.actions[previousName].fadeOut(duration);
            this.actions[this.activeName]
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play();
            // Some actions must not be interrupted
            if (this.activeName != "SK_BoxyBoo.ao|A_Boxy_Idle" && this.activeName != "SK_BoxyBoo.ao|A_Boxy_JumpAbilityAirborne" && this.activeName != "SK_BoxyBoo.ao|A_Boxy_Walk") {
                this.mixer.addEventListener("finished", event => this.actionFinished(event));
                this.actionInProgress = true;
            }
            if (this.activeName != "SK_BoxyBoo.ao|A_Boxy_Idle") {
                this.resetIdleTime();
            }
        }
    }

    actionFinished() {
        if (this.actionInProgress) {
            this.actionInProgress = false;
            this.mixer.removeEventListener("finished", this.actionInProgress);
        }
    }

    resetIdleTime() {
        this.idleTime = 0.0;
        this.idleTimeLimit = THREE.MathUtils.randFloat(5.0, 10.0);
    }

    updateIdleTime(deltaT) {
        this.idleTime += deltaT;
    }

    idleTimeOut() {
        return this.idleTime > this.idleTimeLimit;
    }

    update(deltaT) {
        if (this.mixer) {
            this.mixer.update(deltaT);
        }
        if (this.activeName == "SK_BoxyBoo.ao|A_Boxy_Idle") {
            this.updateIdleTime(deltaT);
        }
    }
}