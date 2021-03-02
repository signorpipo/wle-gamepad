WL.registerComponent('manager', {
    param: { type: WL.Type.Float, default: 1.0 },
}, {
    init: function () {
    },
    start: function () {
        leftGamepad.start();
        rightGamepad.start();
    },
    update: function (dt) {
        leftGamepad.update(dt);
        rightGamepad.update(dt);
    },
});

//You can instantiate them anytime/everywhere you wish, they don't need to be global or singleton
//I personally store them inside a sort of singleton manager
//But you need to call start and update on them
var leftGamepad = new PP.Gamepad(PP.Handedness.LEFT);
var rightGamepad = new PP.Gamepad(PP.Handedness.RIGHT);