[![npm](https://img.shields.io/npm/v/nativescript-dev-assets.svg)](https://www.npmjs.com/package/nativescript-dev-assets)
[![npm](https://img.shields.io/npm/dt/nativescript-dev-assets.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-dev-assets)
[![twitter: @_rhanb](https://img.shields.io/badge/twitter-%40rhanb-2F98C1.svg)](https://twitter.com/_rhanb)

[![NPM](https://nodei.co/npm/nativescript-dev-assets.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nativescript-dev-assets/)

# nativescript-dev-assets

This simple `before-prepare` hook will make an `assets` folder in your app folder, all files in it will be synced in the `platforms/android/src/main/assets` folder. 

Basically to fix this [issue](https://github.com/NativeScript/android-runtime/issues/700) and to ease [nativescript-lottie](https://github.com/bradmartin/nativescript-lottie) usage under android.

# Installation

`tns install nativescript-dev-assets`

# Usage

Just put files in the `app/assets` folder
