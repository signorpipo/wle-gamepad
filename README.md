
## Description
A showcase of the gamepad.js utility for the Wonderland Engine that lets you easily retrieve controller button state, play a vibration effect, register to controller event and so on.

Left gamepad and right gamepad in game are handled differently to showcase different ways to use gamepad.js:
  - Left is managed by polling the status of the gamepad
  - Right is managed by registering to gamepad events

## How to use gamepad.js
You just need to instantiate somewhere the Gamepad class for both left and right controller (this is an argument for the constructor), and call start on it and then update for every frame.

If you want to register, you can find two register functions, once for buttons and one for thumbstick axes.
You need to pass them the ButtonType and the Button event you want to register, as an ID (I use the object that wants to register as ID) and the callback.
For axes you just need to specify the Axes event. These are all enums you can find in the gamepad.js file, that is all you need.
You should remember to unregister to the gamepad when you are done with it (like in a destruction phase of the object that has registered itself to the gamepad).

Otherwise, you can just pool the gamepad by asking the button/axes you want.

You can also add a pulse/vibration/rumble to the pad through the pulse method.

I've used a namespace PP for all the classes, if you don't want it just find and replace PP. with empty string.

## Credits
Oculus Quest Controller Models by Jezza3D on Sketchfab.
