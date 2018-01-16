const fs = require('fs');
const path = require('path');
const each = require('async-each');
const utils = require('./utils');

module.exports = function ($logger, $projectData, hookArgs) {
    return new Promise((resolve, reject) => {
        transferAssetFiles($logger, $projectData, hookArgs).then(() => {
            cleanAfterTransfer($logger, $projectData, hookArgs).then(() => {
                resolve();
            }, (error) => {
                reject();
            })
        });
    }, (error) => {
        reject();
    });
};

function transferAssetFiles($logger, $projectData, hookArgs) {
    return new Promise(function (resolve, reject) {
        //source
        const pathToAppAssets = path.join($projectData.appDirectoryPath, "/assets");

        if (fs.existsSync(pathToAppAssets)) {
            //target
            let pathToPlatformAssets = utils.getPathToPlatformAssets(hookArgs, $projectData);
            if (fs.existsSync(pathToPlatformAssets)) {
                utils.copyFolderRecursively(pathToAppAssets, pathToPlatformAssets).then(() => {
                    $logger.info('Successfully transferred all assets files.');
                    resolve();
                }, (error) => {
                    $logger.info('Error while transferring assets files. Error: ', error);
                    reject();
                });
            } else {
                $logger.info(["No assets folder found in platform at: ", pathToPlatformAssets].join(""));
                reject();
            }
        } else {
            $logger.info(["No assets folder found in your app folder at: ", pathToAppAssets].join(""));
            reject();
        }
    });
}

function cleanAfterTransfer($logger, $projectData, hookArgs) {
    return new Promise((resolve, reject) => {
        let platformAppAssetsFolderPath = utils.getPathToAppPlatformAssets(hookArgs, $projectData);
        rmFolderRecursively(platformAppAssetsFolderPath).then(() => {
            $logger.info("Successfully removed useless platform app assets");
            resolve();
        }, (error) => {
            $logger.info("Error while deleting useless platform app assets:  ", error);
            reject();
        });
    });
}

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