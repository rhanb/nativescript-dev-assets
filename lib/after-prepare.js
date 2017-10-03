const fs = require('fs');
const path = require('path');
const each = require('async-each');

module.exports = function ($logger, $projectData, hookArgs) {
    return new Promise(function (resolve, reject) {
        if (isAndroid(hookArgs)) {
            //source
            const pathToAppAssets = path.join($projectData.appDirectoryPath, "/assets");
            //target
            const pathToAndroidPlatformAssets = path.join($projectData.platformsDir, "/android/src/main/assets");

            if (fs.existsSync(pathToAppAssets)) {
                if (fs.existsSync(pathToAndroidPlatformAssets)) {
                    copyFolderRecursive(pathToAppAssets, pathToAndroidPlatformAssets).then(() => {
                        $looper.info('Successfully transferred all assets files.');
                        resolve();
                    }, (error) => {
                        $looger.info('Error while transferring assets files.');
                        reject();
                    });
                } else {
                    $looger.info(["No assets folder found in Android platform at: ", pathToAndroidPlatformAssets].join(""));
                    reject();
                }
            } else {
                $looger.info(["No assets folder found in your app folder at: ", pathToAppAssets].join(""));
                reject();
            }
        } else {
            resolve();
        }
    });
}

function isAndroid(hookArgs) {
    return hookArgs.platform === 'android';
}

function copyFolderRecursive(sourceFolder, targetFolder) {
    return Promise(function (resolve, reject) {
        let files = [];
        fs.exists(targetFolder, (exists) => {
            if (!exists) {
                fs.mkdir(targetFolder, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        fs.lstat(sourceFolder, (error, stats) => {
                            if (error) {
                                reject(error);
                            } else {
                                if (stats.isDirectory()) {
                                    fs.readdir(sourceFolder, (error, files) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            each(files, (file, next) => {

                                                let currentSource = path.join(sourceFolder, file),
                                                    currentTarget = path.join(targetFolder, file);

                                                fs.lstat(currentSource, (error, stats) => {
                                                    if (error) {
                                                        reject(error);
                                                    } else {
                                                        if (stats.isDirectory) {
                                                            copyFolderRecursive(currentSource, currentTarget).then(() => {
                                                                next();
                                                            }, (error) => {
                                                                reject(error);
                                                            });
                                                        } else {
                                                            fs.exists(currentTarget, (exists) => {
                                                                if (exists) {
                                                                    fs.readFile(currentSource, (error, data) => {
                                                                        if (error) {
                                                                            reject(error);
                                                                        } else {
                                                                            fs.writeFile(currentTarget, data, (error) => {
                                                                                if (error) {
                                                                                    reject(error);
                                                                                } else {
                                                                                    next();
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }, (error) => {
                                                if (error) {
                                                    reject(error);
                                                } else {
                                                    resolve();
                                                }
                                            });
                                        }
                                    });

                                } else {
                                    $logger.info(["'assets' should be folder, at: ", sourceFolder].join(""));
                                    reject(new Error("should be a folder"));
                                }
                            }
                        });

                    }
                });
            } else {
                resolve();
            }
        });

    });
}