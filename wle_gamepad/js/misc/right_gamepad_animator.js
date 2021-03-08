//MANAGED WITH EVENTS
//This code is more to debug the gamepad functionality, it's not the best to look at
//Especially when I start to rotate and go nuts

WL.registerComponent('right_gamepad_animator', {
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

        //PRESSED
        rightGamepad.registerButtonEvent(PP.ButtonType.SELECT, PP.ButtonEvent.PRESSED_START, this, this.selectPressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.SELECT, PP.ButtonEvent.PRESSED_END, this, this.selectPressedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESSED_START, this, this.squeezePressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESSED_END, this, this.squeezePressedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.PRESSED_START, this, this.thumbstickPressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.PRESSED_END, this, this.thumbstickPressedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.PRESSED_START, this, this.bottomButtonPressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.PRESSED_END, this, this.bottomButtonPressedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.PRESSED_START, this, this.topButtonPressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.PRESSED_END, this, this.topButtonPressedEnd.bind(this));

        //TOUCHED
        rightGamepad.registerButtonEvent(PP.ButtonType.SELECT, PP.ButtonEvent.TOUCHED_START, this, this.selectTouchedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.SELECT, PP.ButtonEvent.TOUCHED_END, this, this.selectTouchedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.SQUEEZE, PP.ButtonEvent.TOUCHED_START, this, this.squeezeTouchedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.SQUEEZE, PP.ButtonEvent.TOUCHED_END, this, this.squeezeTouchedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.TOUCHED_START, this, this.thumbstickTouchedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.TOUCHED_END, this, this.thumbstickTouchedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.TOUCHED_START, this, this.bottomButtonTouchedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.TOUCHED_END, this, this.bottomButtonTouchedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.TOUCHED_START, this, this.topButtonTouchedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.TOUCHED_END, this, this.topButtonTouchedEnd.bind(this));

        //VALUE CHANGED
        rightGamepad.registerButtonEvent(PP.ButtonType.SQUEEZE, PP.ButtonEvent.VALUE_CHANGED, this, this.squeezeValueChanged.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.SELECT, PP.ButtonEvent.VALUE_CHANGED, this, this.selectValueChanged.bind(this));

        //AXES CHANGED
        rightGamepad.registerAxesEvent(PP.AxesEvent.X_CHANGED, this, this.xValueChanged.bind(this));
        rightGamepad.registerAxesEvent(PP.AxesEvent.Y_CHANGED, this, this.yValueChanged.bind(this));
        rightGamepad.registerAxesEvent(PP.AxesEvent.AXES_CHANGED, this, this.axesValueChanged.bind(this));

        this.thumbstickInitialLocalForward = this.getLocalAxis(this.thumbstick, [0, 0, 1]);
        this.thumbstickForward = [0, 0, 1];
        this.selectForward = [0, 0, 1];

    },
    start: function () {
    },
    update: function (dt) {
        this.enableMeshInSession();
    },
    //PRESSED
    selectPressedStart: function (buttonInfo, gamepad) {
        //first reset rotation to start position
        this.copyAlignRotation(this.select, this.selectForward, [0, 0, 1]);

        let angleToRotate = glMatrix.glMatrix.toRadian(15);
        let tiltDirection = [0, 0, 1];
        glMatrix.vec3.rotateX(tiltDirection, tiltDirection, [0, 0, 0], angleToRotate);
        glMatrix.vec3.normalize(tiltDirection, tiltDirection);

        this.copyAlignRotation(this.select, [0, 0, 1], tiltDirection);

        this.selectForward = tiltDirection;

        rightGamepad.stopPulse();
    },
    selectPressedEnd: function (buttonInfo, gamepad) {
        this.copyAlignRotation(this.select, this.selectForward, [0, 0, 1]);
        this.selectForward = [0, 0, 1];
    },
    squeezePressedStart: function (buttonInfo, gamepad) {
        this.translateLocalAxis(this.squeeze, [1, 0, 0], -0.0015);
    },
    squeezePressedEnd: function (buttonInfo, gamepad) {
        this.translateLocalAxis(this.squeeze, [1, 0, 0], 0.0015);
    },
    thumbstickPressedStart: function (buttonInfo, gamepad) {
        //since thumbstick can rotate I need to specifically use its initial forward
        let tempVector = glMatrix.vec3.create();
        glMatrix.vec3.scale(tempVector, this.thumbstickInitialLocalForward, 0.0015);
        this.thumbstick.translate(tempVector);
    },
    thumbstickPressedEnd: function (buttonInfo, gamepad) {
        let tempVector = glMatrix.vec3.create();
        glMatrix.vec3.scale(tempVector, this.thumbstickInitialLocalForward, -0.0015);
        this.thumbstick.translate(tempVector);
    },
    bottomButtonPressedStart: function (buttonInfo, gamepad) {
        this.translateLocalAxis(this.bottomButton, [0, 0, 1], 0.002);
    },
    bottomButtonPressedEnd: function (buttonInfo, gamepad) {
        this.translateLocalAxis(this.bottomButton, [0, 0, 1], -0.002);
    },
    topButtonPressedStart: function (buttonInfo, gamepad) {
        this.translateLocalAxis(this.topButton, [0, 0, 1], 0.002);
    },
    topButtonPressedEnd: function (buttonInfo, gamepad) {
        this.translateLocalAxis(this.topButton, [0, 0, 1], -0.002);
    },
    //TOUCHED
    selectTouchedStart: function (buttonInfo, gamepad) {
        this.selectMaterial.diffuseColor = touchedButtonColor;
        this.selectMaterial.ambientColor = touchedButtonAmbientColor;
    },
    selectTouchedEnd: function (buttonInfo, gamepad) {
        this.selectMaterial.diffuseColor = normalButtonColor;
        this.selectMaterial.ambientColor = normalButtonAmbientColor;
    },
    squeezeTouchedStart: function (buttonInfo, gamepad) {
        this.squeezeMaterial.diffuseColor = touchedButtonColor;
        this.squeezeMaterial.ambientColor = touchedButtonAmbientColor;
    },
    squeezeTouchedEnd: function (buttonInfo, gamepad) {
        this.squeezeMaterial.diffuseColor = normalButtonColor;
        this.squeezeMaterial.ambientColor = normalButtonAmbientColor;
    },
    thumbstickTouchedStart: function (buttonInfo, gamepad) {
        this.thumbstickMaterial.diffuseColor = touchedButtonColor;
        this.thumbstickMaterial.ambientColor = touchedButtonAmbientColor;
    },
    thumbstickTouchedEnd: function (buttonInfo, gamepad) {
        this.thumbstickMaterial.diffuseColor = normalButtonColor;
        this.thumbstickMaterial.ambientColor = normalButtonAmbientColor;
    },
    bottomButtonTouchedStart: function (buttonInfo, gamepad) {
        this.bottomButtonMaterial.diffuseColor = touchedButtonColor;
        this.bottomButtonMaterial.ambientColor = touchedButtonAmbientColor;
    },
    bottomButtonTouchedEnd: function (buttonInfo, gamepad) {
        this.bottomButtonMaterial.diffuseColor = normalButtonColor;
        this.bottomButtonMaterial.ambientColor = normalButtonAmbientColor;
    },
    topButtonTouchedStart: function (buttonInfo, gamepad) {
        this.topButtonMaterial.diffuseColor = touchedButtonColor;
        this.topButtonMaterial.ambientColor = touchedButtonAmbientColor;
    },
    topButtonTouchedEnd: function (buttonInfo, gamepad) {
        this.topButtonMaterial.diffuseColor = normalButtonColor;
        this.topButtonMaterial.ambientColor = normalButtonAmbientColor;
    },
    squeezeValueChanged: function (buttonInfo, gamepad) {
        this.squeezeValueText.text = buttonInfo.myValue.toFixed(3);
    },
    selectValueChanged: function (buttonInfo, gamepad) {
        this.selectValueText.text = buttonInfo.myValue.toFixed(3);
    },
    xValueChanged: function (axesInfo, gamepad) {
        let text = "0.000";
        if (axesInfo.myAxes[0] >= 0.0) {
            text = "  ";
            text = text.concat(axesInfo.myAxes[0].toFixed(3));
        } else {
            text = axesInfo.myAxes[0].toFixed(3);
        }

        this.xValueText.text = text;
    },
    yValueChanged: function (axesInfo, gamepad) {
        let text = "0.000";
        if (axesInfo.myAxes[1] >= 0.0) {
            text = "  ";
            text = text.concat(axesInfo.myAxes[1].toFixed(3));
        } else {
            text = axesInfo.myAxes[1].toFixed(3);
        }

        this.yValueText.text = text;
    },
    axesValueChanged: function (axesInfo, gamepad) {
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