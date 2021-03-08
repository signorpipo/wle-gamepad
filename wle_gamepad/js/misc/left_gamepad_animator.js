//MANAGED WITH POLLING
//This code is more to debug the gamepad functionality, it's not the best to look at
//Especially when I start to rate and go nuts

WL.registerComponent('left_gamepad_animator', {
    select: { type: WL.Type.Object, default: null },
    squeeze: { type: WL.Type.Object, default: null },
    thumbstick: { type: WL.Type.Object, default: null },
    bottomButton: { type: WL.Type.Object, default: null },
    topButton: { type: WL.Type.Object, default: null },
    squeezeValue: { type: WL.Type.Object, default: null },
    selectValue: { type: WL.Type.Object, default: null },
    xValue: { type: WL.Type.Object, default: null },
    yValue: { type: WL.Type.Object, default: null }
}, {
    init: function () {
        this.object.scale([0, 0, 0]);
        this.meshEnabled = false;

        this.selectMaterial = this.select.getComponent("mesh").material.clone();
        this.select.getComponent("mesh").material = this.selectMaterial;
        this.selectPosition = new Float32Array(3);
        this.select.getTranslationLocal(this.selectPosition);
        this.selectMaterial.diffuseColor = normalButtonColor;

        this.squeezeMaterial = this.squeeze.getComponent("mesh").material.clone();
        this.squeeze.getComponent("mesh").material = this.squeezeMaterial;
        this.squeezePosition = new Float32Array(3);
        this.squeeze.getTranslationLocal(this.squeezePosition);
        this.squeezeMaterial.diffuseColor = normalButtonColor;

        this.thumbstickMaterial = this.thumbstick.getComponent("mesh").material.clone();
        this.thumbstick.getComponent("mesh").material = this.thumbstickMaterial;
        this.thumbstickPosition = new Float32Array(3);
        this.thumbstick.getTranslationLocal(this.thumbstickPosition);
        this.thumbstickMaterial.diffuseColor = normalButtonColor;

        this.bottomButtonMaterial = this.bottomButton.getComponent("mesh").material.clone();
        this.bottomButton.getComponent("mesh").material = this.bottomButtonMaterial;
        this.bottomButtonPosition = new Float32Array(3);
        this.bottomButton.getTranslationLocal(this.bottomButtonPosition);
        this.bottomButtonMaterial.diffuseColor = normalButtonColor;

        this.topButtonMaterial = this.topButton.getComponent("mesh").material.clone();
        this.topButton.getComponent("mesh").material = this.topButtonMaterial;
        this.topButtonPosition = new Float32Array(3);
        this.topButton.getTranslationLocal(this.topButtonPosition);
        this.topButtonMaterial.diffuseColor = normalButtonColor;

        this.squeezeValueText = this.squeezeValue.getComponent("text");
        this.selectValueText = this.selectValue.getComponent("text");
        this.xValueText = this.xValue.getComponent("text");
        this.yValueText = this.yValue.getComponent("text");

        this.thumbstickInitialLocalForward = this.getLocalAxis(this.thumbstick, [0, 0, 1]);
        this.thumbstickForward = [0, 0, 1];
        this.selectForward = [0, 0, 1];
    },
    start: function () {
    },
    update: function (dt) {
        this.enableMeshInSession();

        //SELECT
        let button = LeftGamepad.getButtonInfo(PP.ButtonType.SELECT);

        {
            //first reset rotation to start position
            this.copyAlignRotation(this.select, this.selectForward, [0, 0, 1]);

            if (button.myValue != 0) {
                console.log(button.myValue);
            }
            let angleToRotate = glMatrix.glMatrix.toRadian(15 * button.myValue);
            let tiltDirection = [0, 0, 1];
            glMatrix.vec3.rotateX(tiltDirection, tiltDirection, [0, 0, 0], angleToRotate);
            glMatrix.vec3.normalize(tiltDirection, tiltDirection);

            this.copyAlignRotation(this.select, [0, 0, 1], tiltDirection);

            this.selectForward = tiltDirection;

            if (button.myIsPressed) {
                LeftGamepad.stopPulse();
            }
        }

        if (button.myIsTouched) {
            this.selectMaterial.diffuseColor = touchedButtonColor;
            this.selectMaterial.ambientColor = touchedButtonAmbientColor;
        } else {
            this.selectMaterial.diffuseColor = normalButtonColor;
            this.selectMaterial.ambientColor = normalButtonAmbientColor;
        }

        this.selectValueText.text = button.myValue.toFixed(3);

        //SQUEEZE
        button = LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE);

        this.squeeze.setTranslationLocal(this.squeezePosition);
        this.translateLocalAxis(this.squeeze, [1, 0, 0], 0.0015 * button.myValue);

        if (button.myIsTouched) {
            this.squeezeMaterial.diffuseColor = touchedButtonColor;
            this.squeezeMaterial.ambientColor = touchedButtonAmbientColor;
        } else {
            this.squeezeMaterial.diffuseColor = normalButtonColor;
            this.squeezeMaterial.ambientColor = normalButtonAmbientColor;
        }

        this.squeezeValueText.text = button.myValue.toFixed(3);

        //THUMBSTICK
        button = LeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK);

        this.thumbstick.setTranslationLocal(this.thumbstickPosition);
        if (button.myIsPressed) {
            //since thumbstick can rotate I need to specifically use its initial forward
            let tempVector = glMatrix.vec3.create();
            glMatrix.vec3.scale(tempVector, this.thumbstickInitialLocalForward, 0.0015);
            this.thumbstick.translate(tempVector);
        }

        if (button.myIsTouched) {
            this.thumbstickMaterial.diffuseColor = touchedButtonColor;
            this.thumbstickMaterial.ambientColor = touchedButtonAmbientColor;
        } else {
            this.thumbstickMaterial.diffuseColor = normalButtonColor;
            this.thumbstickMaterial.ambientColor = normalButtonAmbientColor;
        }

        this.updateThumbstickValues();
        this.updateThumbstickTilt();

        //BOTTOM BUTTON
        button = LeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON);

        this.bottomButton.setTranslationLocal(this.bottomButtonPosition);

        if (button.myIsPressed) {
            this.translateLocalAxis(this.bottomButton, [0, 0, 1], 0.002);
        }

        if (button.myIsTouched) {
            this.bottomButtonMaterial.diffuseColor = touchedButtonColor;
            this.bottomButtonMaterial.ambientColor = touchedButtonAmbientColor;
        } else {
            this.bottomButtonMaterial.diffuseColor = normalButtonColor;
            this.bottomButtonMaterial.ambientColor = normalButtonAmbientColor;
        }

        //TOP BUTTON
        button = LeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON);

        this.topButton.setTranslationLocal(this.topButtonPosition);
        if (button.myIsPressed) {
            this.translateLocalAxis(this.topButton, [0, 0, 1], 0.002);
        }

        if (button.myIsTouched) {
            this.topButtonMaterial.diffuseColor = touchedButtonColor;
            this.topButtonMaterial.ambientColor = touchedButtonAmbientColor;
        } else {
            this.topButtonMaterial.diffuseColor = normalButtonColor;
            this.topButtonMaterial.ambientColor = normalButtonAmbientColor;
        }
    },
    updateThumbstickValues: function () {
        let axesInfo = LeftGamepad.getAxesInfo();
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
        let axesInfo = LeftGamepad.getAxesInfo();

        //first reset rotation to start position
        this.copyAlignRotation(this.thumbstick, this.thumbstickForward, [0, 0, 1]);

        let tiltDirection = new Float32Array(3);
        glMatrix.vec3.add(tiltDirection, [0, 0, 1], [axesInfo.myAxes[0], -axesInfo.myAxes[1], 0.0]);
        glMatrix.vec3.normalize(tiltDirection, tiltDirection);

        this.copyAlignRotation(this.thumbstick, [0, 0, 1], tiltDirection);

        this.thumbstickForward = tiltDirection;
    },
    //Couldn't find a better name, basically find the rotation to align start axis to end, and apply that to object
    copyAlignRotation: function (object, startAxis, endAxis) {
        let rotationAxis = new Float32Array(3);
        glMatrix.vec3.cross(rotationAxis, startAxis, endAxis);
        glMatrix.vec3.normalize(rotationAxis, rotationAxis);

        let angleToRotate = glMatrix.vec3.angle(startAxis, endAxis);

        if (angleToRotate > 0.0001) {
            object.rotateAxisAngleRadObject(rotationAxis, angleToRotate);
        }
    },
    translateLocalAxis(object, axis, amount) {
        let tempVector = this.getLocalAxis(object, axis);
        glMatrix.vec3.scale(tempVector, tempVector, amount);
        object.translate(tempVector);
    },
    getLocalAxis(object, axis) {
        let tempVector = glMatrix.vec3.create();
        glMatrix.vec3.transformQuat(tempVector, axis, object.transformLocal);
        glMatrix.vec3.normalize(tempVector, tempVector);
        return tempVector;
    },
    enableMeshInSession: function () {
        if (!this.meshEnabled) {
            if (WL.xrSession) {
                this.object.resetScaling();
                this.meshEnabled = true;
            }
        }
    }
});