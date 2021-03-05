WL.registerComponent('add-rumble', {
    myDuration: { type: WL.Type.Float, default: 1.0 },
}, {
    init: function () {
        this.myCollider = this.object.getComponent("collision");
        this.myTempVector = new Float32Array(3);

        this.myPosition = new Float32Array(3);
        this.object.getTranslationWorld(this.myPosition);
    },
    start: function () {
    },
    update: function (dt) {
        let collidingComps = this.myCollider.queryOverlaps();
        for (let i = 0; i < collidingComps.length; ++i) {
            let collidedObject = collidingComps[i].object;
            let handType = collidedObject.getComponent("hand-type");

            if (handType) {
                collidedObject.getTranslationWorld(this.myTempVector);
                let distance = glMatrix.vec3.distance(this.myTempVector, this.myPosition);
                distance = Math.min(distance, 0.3);

                //this is just magic numbers
                let pulseIntensity = (1 - Math.min(distance / 0.25, 1)) * 0.75;
                if (this.myDuration > 0) {
                    pulseIntensity = 0.5;
                }

                if (handType.myHandedness == 0) {
                    leftGamepad.pulse(pulseIntensity, this.myDuration);
                } else {
                    rightGamepad.pulse(pulseIntensity, this.myDuration);
                }
            }
        }

        if (this.myDuration > 0) {
            this.object.rotateAxisAngleRadObject([0, 1, 0], Math.PI * dt / 2);
        } else {
            this.object.rotateAxisAngleRadObject([0, 1, 0], -Math.PI * dt / 2);
        }
    },
});