var hook = require("nativescript-hook")(__dirname);
hook.postinstall();

var fs = require("fs");
var path = require("path");

var projectDir = hook.findProjectDir();

if (projectDir) {
    const assetsFolder = [projectDir, "/app/assets"].join("");
    if (!fs.existsSync(assetsFolder)) {
        fs.mkdirSync(assetsFolder);
    }
}