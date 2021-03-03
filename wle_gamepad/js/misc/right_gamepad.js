//MANAGED WITH EVENTS
//This code is more to debug the gamepad functionality, it's not the best to look at
//Especially when I start to rate and go nuts

WL.registerComponent('right_gamepad', {
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
        this.selectMaterial.ambientColor = [0.75, 0, 0, 1];

        this.squeezeMaterial = this.squeeze.getComponent("mesh").material.clone();
        this.squeeze.getComponent("mesh").material = this.squeezeMaterial;
        this.squeezePosition = new Float32Array(3);
        this.squeeze.getTranslationLocal(this.squeezePosition);
        this.squeezeMaterial.ambientColor = [0.75, 0, 0, 1];

        this.thumbstickMaterial = this.thumbstick.getComponent("mesh").material.clone();
        this.thumbstick.getComponent("mesh").material = this.thumbstickMaterial;
        this.thumbstickPosition = new Float32Array(3);
        this.thumbstick.getTranslationLocal(this.thumbstickPosition);
        this.thumbstickMaterial.ambientColor = [0.75, 0, 0, 1];

        this.bottomButtonMaterial = this.bottomButton.getComponent("mesh").material.clone();
        this.bottomButton.getComponent("mesh").material = this.bottomButtonMaterial;
        this.bottomButtonPosition = new Float32Array(3);
        this.bottomButton.getTranslationLocal(this.bottomButtonPosition);
        this.bottomButtonMaterial.ambientColor = [0.75, 0, 0, 1];

        this.topButtonMaterial = this.topButton.getComponent("mesh").material.clone();
        this.topButton.getComponent("mesh").material = this.topButtonMaterial;
        this.topButtonPosition = new Float32Array(3);
        this.topButton.getTranslationLocal(this.topButtonPosition);
        this.topButtonMaterial.ambientColor = [0.75, 0, 0, 1];

        this.squeezeValueText = this.squeezeValue.getComponent("text");
        this.selectValueText = this.selectValue.getComponent("text");
        this.xValueText = this.xValue.getComponent("text");
        this.yValueText = this.yValue.getComponent("text");

        this.thumbstickUp = [0, 1, 0];
        this.selectUp = [0, 1, 0];

        //PRESSED
        rightGamepad.registerButtonEvent(PP.ButtonType.SELECT, PP.ButtonEvent.PRESSED_START, this, this.selectPressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.SELECT, PP.ButtonEvent.PRESSED_END, this, this.selectPressedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESSED_START, this, this.squeezePressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESSED_END, this, this.squeezePressedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.PRESSED_START, this, this.thumbStickPressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.PRESSED_END, this, this.thumbStickPressedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.PRESSED_START, this, this.bottomButtonPressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.BOTTOM_BUTTON, PP.ButtonEvent.PRESSED_END, this, this.bottomButtonPressedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.PRESSED_START, this, this.topButtonPressedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.TOP_BUTTON, PP.ButtonEvent.PRESSED_END, this, this.topButtonPressedEnd.bind(this));

        //TOUCHED
        rightGamepad.registerButtonEvent(PP.ButtonType.SELECT, PP.ButtonEvent.TOUCHED_START, this, this.selectTouchedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.SELECT, PP.ButtonEvent.TOUCHED_END, this, this.selectTouchedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.SQUEEZE, PP.ButtonEvent.TOUCHED_START, this, this.squeezeTouchedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.SQUEEZE, PP.ButtonEvent.TOUCHED_END, this, this.squeezeTouchedEnd.bind(this));

        rightGamepad.registerButtonEvent(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.TOUCHED_START, this, this.thumbStickTouchedStart.bind(this));
        rightGamepad.registerButtonEvent(PP.ButtonType.THUMBSTICK, PP.ButtonEvent.TOUCHED_END, this, this.thumbStickTouchedEnd.bind(this));

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
    },
    start: function () {
    },
    update: function (dt) {
        this.enableMeshInSession();
    },
    //PRESSED
    selectPressedStart: function (buttonInfo, gamepad) {
        //first reset rotation
        setLocalUp(this.selectTilt, this.selectUp, [0, 1, 0]);

        let angleToRotate = glMatrix.glMatrix.toRadian(-15);
        let tiltDirection = [0, 1, 0];
        glMatrix.vec3.rotateX(tiltDirection, tiltDirection, [0, 0, 0], angleToRotate);
        glMatrix.vec3.normalize(tiltDirection, tiltDirection);

        setLocalUp(this.selectTilt, [0, 1, 0], tiltDirection);

        this.selectUp = tiltDirection;
    },
    selectPressedEnd: function (buttonInfo, gamepad) {
        setLocalUp(this.selectTilt, this.selectUp, [0, 1, 0]);
        this.selectUp = [0, 1, 0];
    },
    squeezePressedStart: function (buttonInfo, gamepad) {
        let newPosition = new Float32Array(this.squeezePosition);
        newPosition[0] += 0.0025;
        this.squeeze.setTranslationLocal(newPosition);
    },
    squeezePressedEnd: function (buttonInfo, gamepad) {
        this.squeeze.setTranslationLocal(this.squeezePosition);
    },
    thumbStickPressedStart: function (buttonInfo, gamepad) {
        let newPosition = new Float32Array(this.thumbstickPosition);
        newPosition[1] -= 0.0025;
        newPosition[2] += 0.001;
        this.thumbstick.setTranslationLocal(newPosition);
    },
    thumbStickPressedEnd: function (buttonInfo, gamepad) {
        this.thumbstick.setTranslationLocal(this.thumbstickPosition);
    },
    bottomButtonPressedStart: function (buttonInfo, gamepad) {
        let newPosition = new Float32Array(this.bottomButtonPosition);
        newPosition[1] -= 0.002;
        newPosition[2] += 0.002;
        this.bottomButton.setTranslationLocal(newPosition);
    },
    bottomButtonPressedEnd: function (buttonInfo, gamepad) {
        this.bottomButton.setTranslationLocal(this.bottomButtonPosition);
    },
    topButtonPressedStart: function (buttonInfo, gamepad) {
        let newPosition = new Float32Array(this.topButtonPosition);
        newPosition[1] -= 0.002;
        newPosition[2] += 0.002;
        this.topButton.setTranslationLocal(newPosition);
    },
    topButtonPressedEnd: function (buttonInfo, gamepad) {
        this.topButton.setTranslationLocal(this.topButtonPosition);
    },
    //TOUCHED
    selectTouchedStart: function (buttonInfo, gamepad) {
        this.selectMaterial.ambientColor = [0, 0, 75, 1];
    },
    selectTouchedEnd: function (buttonInfo, gamepad) {
        this.selectMaterial.ambientColor = [0.75, 0, 0, 1];
    },
    squeezeTouchedStart: function (buttonInfo, gamepad) {
        this.squeezeMaterial.ambientColor = [0, 0, 75, 1];
    },
    squeezeTouchedEnd: function (buttonInfo, gamepad) {
        this.squeezeMaterial.ambientColor = [0.75, 0, 0, 1];
    },
    thumbStickTouchedStart: function (buttonInfo, gamepad) {
        this.thumbstickMaterial.ambientColor = [0, 0, 75, 1];
    },
    thumbStickTouchedEnd: function (buttonInfo, gamepad) {
        this.thumbstickMaterial.ambientColor = [0.75, 0, 0, 1];
    },
    bottomButtonTouchedStart: function (buttonInfo, gamepad) {
        this.bottomButtonMaterial.ambientColor = [0, 0, 75, 1];
    },
    bottomButtonTouchedEnd: function (buttonInfo, gamepad) {
        this.bottomButtonMaterial.ambientColor = [0.75, 0, 0, 1];
    },
    topButtonTouchedStart: function (buttonInfo, gamepad) {
        this.topButtonMaterial.ambientColor = [0, 0, 75, 1];
    },
    topButtonTouchedEnd: function (buttonInfo, gamepad) {
        this.topButtonMaterial.ambientColor = [0.75, 0, 0, 1];
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
            text = " ";
            text = text.concat(axesInfo.myAxes[0].toFixed(3));
        } else {
            text = axesInfo.myAxes[0].toFixed(3);
        }

        this.xValueText.text = text;
    },
    yValueChanged: function (axesInfo, gamepad) {
        let text = "0.000";
        if (axesInfo.myAxes[1] >= 0.0) {
            text = " ";
            text = text.concat(axesInfo.myAxes[1].toFixed(3));
        } else {
            text = axesInfo.myAxes[1].toFixed(3);
        }

        this.yValueText.text = text;
    },
    axesValueChanged: function (axesInfo, gamepad) {
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