const fs = require('fs');
const path = require('path');
const each = require('async-each');
const utils = require('./utils');

module.exports = function ($logger, $projectData, hookArgs) {
    return new Promise(function (resolve, reject) {
        if (utils.isAndroid(hookArgs)) {
            //source
            const pathToAppAssets = path.join($projectData.appDirectoryPath, "/assets");
            //target
            const pathToAndroidPlatformAssets = path.join($projectData.platformsDir, "/android/src/main/assets");

            if (fs.existsSync(pathToAppAssets)) {
                if (fs.existsSync(pathToAndroidPlatformAssets)) {
                    copyFolderRecursively(pathToAppAssets, pathToAndroidPlatformAssets).then(() => {
                        $logger.info('Successfully transferred all assets files.');
                        resolve();
                    }, (error) => {
                        $logger.info('Error while transferring assets files. Error: ', error);
                        reject();
                    });
                } else {
                    $logger.info(["No assets folder found in Android platform at: ", pathToAndroidPlatformAssets].join(""));
                    reject();
                }
            } else {
                $logger.info(["No assets folder found in your app folder at: ", pathToAppAssets].join(""));
                reject();
            }
        } else {
            resolve();
        }
    });
}

function copyFile(sourceFile, targetFile) {
    return new Promise((resolve, reject) => {
        fs.exists(targetFile, (exists) => {
            if (!exists) {
                fs.readFile(sourceFile, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        fs.writeFile(targetFile, data, (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve();
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

function copyFolder(folderPath) {
    return new Promise((resolve, reject) => {
        fs.exists(folderPath, (exists) => {
            if (!exists) {
                fs.mkdir(folderPath, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    });
}

function iterateOverFolder(files, sourceFolder, targetFolder) {
    return new Promise((resolve, reject) => {
        each(files, (file, next) => {
            let currentSource = path.join(sourceFolder, file),
                currentTarget = path.join(targetFolder, file);
            utils.isFolder(currentSource).then((result) => {
                if (result) {
                    copyFolderRecursively(currentSource, currentTarget).then(() => {
                        next();
                    }, (error) => {
                        reject(error);
                    });
                } else {
                    copyFile(currentSource, currentTarget).then(() => {
                        next();
                    }, (error) => {
                        reject(error);
                    });
                }
            }, (error) => {
                reject(error);
            });
        }, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

function copyFolderRecursively(sourceFolder, targetFolder) {
    return new Promise((resolve, reject) => {
        utils.isFolder(sourceFolder).then((result) => {
            if (result) {
                copyFolder(targetFolder).then(() => {
                    utils.getFolderFiles(sourceFolder).then((files) => {
                        iterateOverFolder(files, sourceFolder, targetFolder).then(() => {
                            resolve();
                        }, (error) => {
                            reject(error);
                        })
                    }, (error) => {
                        reject(error);
                    });

                }, (error) => {
                    reject(error);
                });
            } else {
                copyFile(sourceFolder, targetFolder).then(() => {
                    resolve();
                }, (error) => {
                    reject(error);
                });
            }
        }, (error) => {
            reject(error);
        });
    });
}