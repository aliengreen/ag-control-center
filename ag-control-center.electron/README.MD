# Alien Green Control Center

An Interactive Control Center of Alien Green IoT system. This is a admin panel for AG users and devices.

### How to create icns files ?

If you want to change application logo just overwrite existing `logo/logo.png` file with new one. Please, make sure image size should be 1024x1024 square.

Here's a script `create_icns.sh` to convert a 1024x1024 png (named `logo.png`) to the required icns file. Run script from terminal window:

`$ ./create_icns.sh` 

New icns file will be generated in `logo` folder with file name `icon.icns`.

If you change icon frequently, you need to clean Finder/macOS icon cache for the target application.
First close all Finder window and type command below in terminal window:

    touch out/ag-control-center-darwin-x64/ag-control-center.app
    touch out/ag-control-center-darwin-x64/ag-control-center.app/Contents/Info.plist

### Build macOS distribution

`$ npm run package`

### Packaging distribution of macOS in zip archive

`$ npm run make`

### Development

Jus run:

`$ npm run start`


## Electron Resources

- [awesome-electron](https://github.com/sindresorhus/awesome-electron) - Useful resources for creating apps with Electron
- [electron-about-window](https://github.com/rhysd/electron-about-window) - 'About This App' mini-window for Electron apps
- [electron-json-storage](https://github.com/electron-userland/electron-json-storage) - Easily write and read user settings in Electron apps.
- [got](https://github.com/sindresorhus/got) - Simplified HTTP requests
- [electron-util](https://github.com/sindresorhus/electron-util) - Useful utilities for developing Electron apps and modules
- [electron-store](https://github.com/sindresorhus/electron-store) - Simple data persistence for your Electron app or module - Save and load user preferences, app state, cache, etc
- [electron-serve](https://github.com/sindresorhus/electron-serve) - Static file serving for Electron apps
