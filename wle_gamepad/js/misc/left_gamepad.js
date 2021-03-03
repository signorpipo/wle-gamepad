WL.registerComponent('left_gamepad', {
    mesh: { type: WL.Type.Object, default: null },
}, {
    init: function () {
        this.mesh.scale([0, 0, 0]);
        this.meshEnabled = false;
    },
    start: function () {
    },
    update: function (dt) {
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
    },
});