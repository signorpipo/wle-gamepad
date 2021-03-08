
## Description
A showcase of the gamepad.js utility for the Wonderland Engine that lets you easily retrieve controller button state, play a vibration effect, register to controller event and so on.

Left gamepad and right gamepad in game are handled differently to showcase different ways to use gamepad.js:
  - Left is managed by polling the status of the gamepad
  - Right is managed by registering to gamepad events

## How to import and use gamepad.js
To import gamepad.js you have to:
- Copy gamepad.js somewhere in your js folder
- Copy the pp folder into your main js folder, this folder contains the pp.js file with the PP namespace declaration in it
- This folder should only contain this item
- You must link this folder in the Java Script Sources list (under Project Settings) before any other folders that contain scripts that use the PP namespace
- If you put it as first (after /js/components/) you will be safe
- If you don't want to use the PP namespace just remove it from the gamepad.js class, in this case you won't need pp.js

To use gamepad.js you have to:
- Instantiate the Gamepad class somewhere for both left and right controller
- Call start and update on it 

At this point you can:
- Register/unregister to buttons and axes events
- Poll the button or axes state directly
- Add a pulse/vibration/rumble to the gamepad and stop it

## Credits
Oculus Quest Controller Models by Jezza3D on Sketchfab.
