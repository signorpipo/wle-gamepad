WL.registerComponent('manager', {
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

var normalButtonColor = [183 / 255, 46 / 255, 35 / 255, 1];
var touchedButtonColor = [110 / 255, 35 / 255, 157 / 255, 1];