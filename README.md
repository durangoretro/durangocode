# Durango Code

[![.github/workflows/ci.yml](https://github.com/durangoretro/durangocode/actions/workflows/ci.yml/badge.svg)](https://github.com/durangoretro/durangocode/actions/workflows/ci.yml)

Durango Code is a Visual Studio Code extension, for use to development for [Durango Retro Project](https://durangoretro.com) this extension allows to configure and works for create new software for the Durango Platform.

This extension uses the Durango Development Tools and CC65 suite for create new software; you can check all the documentation for these tools on the next address:

* CC65 suite: [https://cc65.github.io/](https://cc65.github.io/)
* Durango Development Tools: [http://durangoretro.com/tools/development/](http://durangoretro.com/tools/development/)


## Features

This extension adds the next commands; to see the commands press <kbd>ctrl</kbd>+<kbd>shift</kbd>+<kbd>p</kbd> and select the command starting with ```Durango Code:```:

* ```Create Project```: Create a new Project for Durango on specific location.
* ```Compile Project```: Compile an existing Durango project.
* ```Clean project```: Clean the current Durango Project.
* ```Run on Emulator```: Run the current Durango Project using Durango-x Emulator (perdita).
* ```Run using NanoBoot```: Run the current Durango Project on a Durango-x Machine using nanoboot Rom (Only for Raspberry Pi Versions).
* ```Compile And Run```: Compile the current Project and then Run the project using Durango-x Emulator (perdita).

## Requirements

To use this extension you will need the CC65 suite, the DurangoLib library and the Rescomp Java Application.

In addition, you can use the Durango Dev Kit Docker Image.

For more information about the Durango Development Tools or the CC65, you can check the next links:

* Durango Lib: [http://durangoretro.com/dev/lang/durangolib/](http://durangoretro.com/dev/lang/durangolib/).
* Rescomp: [http://durangoretro.com/tools/tools/#rescomp](http://durangoretro.com/tools/tools/#rescomp)
* Durango Dev Kit Docker Image: [http://durangoretro.com/tools/docker/](http://durangoretro.com/tools/docker/)

## Extension Settings

This extension adds some needed configuration to custom all the Durango Development Tools configuration.

* ```Perdita Path```: The current Durango-x Emulator executable Path.
* ```NanoBoot Path```: The current NanoBoot executable Path.
* ```DDK```: Overrides the current ```DDK``` environment Variable.
* ```Custom Rescomp Jar```: Custom Rescomp Jar application path. By default is on ```$DDK/rescomp/rescomp.jar```.
* ```romLocation```: Location where the Rom is generated after compilation.
* ```DockerImageName```: Durango Dev Kit Docker Image Name; by default ```zerasul/durangodevkit```.
* ```toolchain Type```: Select the current Toolchain type:
    * ```Native```: Use Native Commands (Depends on Operating System).
    * ```Docker```: Use Docker Image implementation. 

## Known Issues

This extension is still on development and can have some issues; please send us the issues or improvements using issues tab on the Durango Retro Github Repository:

[https://github.com/durangoretro/durangocode/issues](https://github.com/durangoretro/durangocode/issues)

**NOTE:** On windows Systems you need to select as default terminal command Prompt (cmd). You can select this using the terminal panel and select the default profile on the down arrow button at the right of the "plus" button.

## Release Notes

### 1.0.0

Initial release of the extension. Adds the current commands:

* Compile Project.
* Clean Project.
* Run on Emulator.
* Run using NanoBoot.
* Compile And Run.

---

