const fs = require('fs');
const path = require('path');
const each = require('async-each');
const utils = require('./utils');

module.exports = function ($logger, $projectData, hookArgs) {
    return new Promise((resolve, reject) => {
        if (utils.isAndroid) {
            let androidAppAssetsFolderPath = [$projectData.platformsDir, "/android/src/main/assets/app/assets"].join("");
            rmFolderRecursively(androidAppAssetsFolderPath).then(() => {
                $logger.info("Successfully removed useless android platform app assets");
                resolve();
            }, (error) => {
                $logger.info("Error while deleting useless platform app assets:  ", error);
                reject();
            });
        } else {
            let iosAppAssetsFolderPath = [$projectData.platformsDir, "/ios/demo/app/assets"].join("");
            rmFolderRecursively(iosAppAssetsFolderPath).then((error) => {
                if (error) {
                    $logger.info("Error while deleting useless ios platform app assets: ", error);
                } else {
                    $logger.info("Successfully removed useless ios platform app assets");
                    resolve();
                }
            });
        }
    });
};

function rmFolderRecursively(folderPath) {
    return new Promise((resolve, reject) => {
        fs.exists(folderPath, (exists) => {
            if (exists) {
                utils.isFolder(folderPath).then((result) => {
                    if (result) {
                        utils.getFolderFiles(folderPath).then((files) => {
                            rmLoop(files, folderPath).then(() => {
                                resolve();
                            }, (error) => {
                                reject(error);
                            });
                        }, (error) => {
                            reject(error);
                        });
                    } else {
                        rmFile(folderPath).then(() => {
                            resolve();
                        }, (error) => {
                            reject(error);
                        });
                    }
                }, (error) => {
                    reject(error);
                });
            } else {
                resolve();
            }
        });
    });
}

function rmLoop(files, folderPath) {
    return new Promise((resolve, reject) => {
        each(files, (file, next) => {
            let currentFilePath = path.join(folderPath, file);
            utils.isFolder(currentFilePath).then((result) => {
                if (result) {
                    rmFolderRecursively(currentFilePath).then(() => {
                        next();
                    }, (error) => {
                        reject(error);
                    });
                } else {
                    rmFile(currentFilePath).then(() => {
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

function rmFolder(folderPath) {
    return new Promise((resolve, reject) => {
        fs.rmdir(folderPath, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

function rmFile(sourceFile) {
    return new Promise((resolve, reject) => {
        fs.unlink(sourceFile, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}