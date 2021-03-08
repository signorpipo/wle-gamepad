
## Description
A showcase of the gamepad.js utility for the Wonderland Engine that lets you easily retrieve controller button state, play a pulse effect, register to controller event and so on.

Left gamepad and right gamepad in game are handled differently to showcase different ways to use gamepad.js:
  - Left is managed by polling the status of the gamepad
  - Right is managed by registering to gamepad events

## How to import and use gamepad.js
To import gamepad.js you have to:
- Import gamepad.js somewhere in your js folder
- Import the pp folder into your main js folder, this folder contains the pp.js file with the PP namespace declaration in it
- This folder should only contain this item
- You must link this folder in the Java Script Sources list (under Project Settings) before any other folders that contain scripts that use the PP namespace
- If you put it as first (after /js/components/) you will be safe
- If you don't want to use the PP namespace just remove it from the gamepad.js class, in this case you won't need pp.js

To use gamepad.js you have to:
- Instantiate the Gamepad class somewhere for both left and right controller
- Call start and update on it 
- You could import gamepad_manager_component.js component and add it to the Player object to have a simple way to instantiate/start/update the gamepads
  - In this case LeftGamepad and RightGamepad will be global variables

At this point you can:
- Register/unregister to buttons and axes events
- Poll the buttons or axes state directly
- Add a pulse/vibration/rumble to the gamepad and stop it

## How to import the animated gamepads
If you want to import the gamepad models with the animation of the buttons you have to:
- Import gamepad.js as shown above
- Import gamepad_animator.js
- Inside gamepad_animator.js you can search for @EDIT tags where you can/have to make modifications
  - You have to specify how to retrieve the left and right gamepad instances
  - If you are using the gamepad_manager_component.js component you just have to specify LeftGamepad or RightGamepad
  - You can also specify different colors for normal/touched button state, null means the colors will not be changed
- Import the quest_controllers_credits_Jezza3D.glb inside your assets folder
- Drop them on the Player object
- On both of them you have to
  - Add input component
  - Add the gamepad-animator component
  - Fill the gamepad-animator component with the objects from the linked gamepad

## Credits
Oculus Quest Controller Models by Jezza3D on Sketchfab with small adjustments made by me.
