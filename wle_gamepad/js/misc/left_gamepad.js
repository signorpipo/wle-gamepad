//MANAGED WITH POLLING
//This code is more to debug the gamepad functionality, it's not the best to look at
//Especially when I start to rate and go nuts

WL.registerComponent('left_gamepad', {
    mesh: { type: WL.Type.Object, default: null },
    select: { type: WL.Type.Object, default: null },
    squeeze: { type: WL.Type.Object, default: null },
    thumbstick: { type: WL.Type.Object, default: null },
    bottomButton: { type: WL.Type.Object, default: null },
    topButton: { type: WL.Type.Object, default: null },
    squeezeValue: { type: WL.Type.Object, default: null },
    selectValue: { type: WL.Type.Object, default: null },
    xValue: { type: WL.Type.Object, default: null },
    yValue: { type: WL.Type.Object, default: null },
    thumbstickTilt: { type: WL.Type.Object, default: null },
    selectTilt: { type: WL.Type.Object, default: null }
}, {
    init: function () {
        this.mesh.scale([0, 0, 0]);
        this.meshEnabled = false;

        this.selectMaterial = this.select.getComponent("mesh").material.clone();
        this.select.getComponent("mesh").material = this.selectMaterial;
        this.selectPosition = new Float32Array(3);
        this.select.getTranslationLocal(this.selectPosition);
        this.selectMaterial.ambientColor = normalButtonColor;

        this.squeezeMaterial = this.squeeze.getComponent("mesh").material.clone();
        this.squeeze.getComponent("mesh").material = this.squeezeMaterial;
        this.squeezePosition = new Float32Array(3);
        this.squeeze.getTranslationLocal(this.squeezePosition);
        this.squeezeMaterial.ambientColor = normalButtonColor;

        this.thumbstickMaterial = this.thumbstick.getComponent("mesh").material.clone();
        this.thumbstick.getComponent("mesh").material = this.thumbstickMaterial;
        this.thumbstickPosition = new Float32Array(3);
        this.thumbstick.getTranslationLocal(this.thumbstickPosition);
        this.thumbstickMaterial.ambientColor = normalButtonColor;

        this.bottomButtonMaterial = this.bottomButton.getComponent("mesh").material.clone();
        this.bottomButton.getComponent("mesh").material = this.bottomButtonMaterial;
        this.bottomButtonPosition = new Float32Array(3);
        this.bottomButton.getTranslationLocal(this.bottomButtonPosition);
        this.bottomButtonMaterial.ambientColor = normalButtonColor;

        this.topButtonMaterial = this.topButton.getComponent("mesh").material.clone();
        this.topButton.getComponent("mesh").material = this.topButtonMaterial;
        this.topButtonPosition = new Float32Array(3);
        this.topButton.getTranslationLocal(this.topButtonPosition);
        this.topButtonMaterial.ambientColor = normalButtonColor;

        this.squeezeValueText = this.squeezeValue.getComponent("text");
        this.selectValueText = this.selectValue.getComponent("text");
        this.xValueText = this.xValue.getComponent("text");
        this.yValueText = this.yValue.getComponent("text");

        this.thumbstickUp = [0, 1, 0];
        this.selectUp = [0, 1, 0];
    },
    start: function () {
    },
    update: function (dt) {
        this.enableMeshInSession();

        //SELECT
        let button = leftGamepad.getButtonInfo(PP.ButtonType.SELECT);

        {
            //first reset rotation
            setLocalUp(this.selectTilt, this.selectUp, [0, 1, 0]);

            let angleToRotate = glMatrix.glMatrix.toRadian(-15 * button.myValue);
            let tiltDirection = [0, 1, 0];
            glMatrix.vec3.rotateX(tiltDirection, tiltDirection, [0, 0, 0], angleToRotate);
            glMatrix.vec3.normalize(tiltDirection, tiltDirection);

            setLocalUp(this.selectTilt, [0, 1, 0], tiltDirection);

            this.selectUp = tiltDirection;

            if (button.myPressed) {
                leftGamepad.stopPulse();
            }
        }

        if (button.myTouched) {
            this.selectMaterial.ambientColor = touchedButtonColor;
        } else {
            this.selectMaterial.ambientColor = normalButtonColor;
        }

        this.selectValueText.text = button.myValue.toFixed(3);

        //SQUEEZE
        button = leftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE);

        {
            let newPosition = new Float32Array(this.squeezePosition);
            newPosition[0] -= 0.0025 * button.myValue;
            this.squeeze.setTranslationLocal(newPosition);
        }

        if (button.myTouched) {
            this.squeezeMaterial.ambientColor = touchedButtonColor;
        } else {
            this.squeezeMaterial.ambientColor = normalButtonColor;
        }

        this.squeezeValueText.text = button.myValue.toFixed(3);

        //THUMBSTICK
        button = leftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK);

        if (button.myPressed) {
            let newPosition = new Float32Array(this.thumbstickPosition);
            newPosition[1] -= 0.0025;
            newPosition[2] += 0.001;
            this.thumbstick.setTranslationLocal(newPosition);
        } else {
            this.thumbstick.setTranslationLocal(this.thumbstickPosition);
        }

        if (button.myTouched) {
            this.thumbstickMaterial.ambientColor = touchedButtonColor;
        } else {
            this.thumbstickMaterial.ambientColor = normalButtonColor;
        }

        this.updateThumbstickValues();
        this.updateThumbstickTilt();

        //BOTTOM BUTTON
        button = leftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON);

        if (button.myPressed) {
            let newPosition = new Float32Array(this.bottomButtonPosition);
            newPosition[1] -= 0.002;
            newPosition[2] += 0.002;
            this.bottomButton.setTranslationLocal(newPosition);
        } else {
            this.bottomButton.setTranslationLocal(this.bottomButtonPosition);
        }

        if (button.myTouched) {
            this.bottomButtonMaterial.ambientColor = touchedButtonColor;
        } else {
            this.bottomButtonMaterial.ambientColor = normalButtonColor;
        }

        //TOP BUTTON
        button = leftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON);

        if (button.myPressed) {
            let newPosition = new Float32Array(this.topButtonPosition);
            newPosition[1] -= 0.002;
            newPosition[2] += 0.002;
            this.topButton.setTranslationLocal(newPosition);
        } else {
            this.topButton.setTranslationLocal(this.topButtonPosition);
        }

        if (button.myTouched) {
            this.topButtonMaterial.ambientColor = touchedButtonColor;
        } else {
            this.topButtonMaterial.ambientColor = normalButtonColor;
        }
    },
    updateThumbstickValues: function () {
        let axesInfo = leftGamepad.getAxesInfo();
        let text = "0.000";
        if (axesInfo.myAxes[0] >= 0.0) {
            text = "  ";
            text = text.concat(axesInfo.myAxes[0].toFixed(3));
        } else {
            text = axesInfo.myAxes[0].toFixed(3);
        }

        this.xValueText.text = text;

        text = "0.000";

        if (axesInfo.myAxes[1] >= 0.0) {
            text = "  ";
            text = text.concat(axesInfo.myAxes[1].toFixed(3));
        } else {
            text = axesInfo.myAxes[1].toFixed(3);
        }

        this.yValueText.text = text;

    },
    updateThumbstickTilt: function () {
        let axesInfo = leftGamepad.getAxesInfo();

        //first reset rotation
        setLocalUp(this.thumbstickTilt, this.thumbstickUp, [0, 1, 0]);

        let tiltDirection = new Float32Array(3);
        glMatrix.vec3.add(tiltDirection, [0, 1, 0], [axesInfo.myAxes[0], 0.0, -axesInfo.myAxes[1]]);
        glMatrix.vec3.normalize(tiltDirection, tiltDirection);
        setLocalUp(this.thumbstickTilt, [0, 1, 0], tiltDirection);

        this.thumbstickUp = tiltDirection;
    },
    enableMeshInSession: function () {
        if (this.meshEnabled) {
            if (!WL.xrSession) {
                this.mesh.scale([0, 0, 0]);
                this.meshEnabled = false;
            }
        } else {
            if (WL.xrSession) {
                this.mesh.resetScaling();
                this.meshEnabled = true;
            }
        }
    }
});

function setLocalUp(object, currentUp, newUp) {
    let rotationAxis = new Float32Array(3);
    glMatrix.vec3.cross(rotationAxis, currentUp, newUp);
    glMatrix.vec3.normalize(rotationAxis, rotationAxis);

    let angleToRotate = glMatrix.vec3.angle(currentUp, newUp);

    if (angleToRotate > 0.001) {
        object.rotateAxisAngleRadObject(rotationAxis, angleToRotate);
    }
}