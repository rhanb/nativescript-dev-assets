const fs = require('fs');
const path = require('path');
const each = require('async-each');

module.exports = {
    isAndroid(hookArgs) {
        let platform;
        if (hookArgs.platform) {
            platform = hookArgs.platform.toLowerCase();
        }
        return platform === 'android';
    },
    getNativeScriptVersion($projectData) {
        // [3, 4, 1]
        const version = $projectData.$projectHelper.$staticConfig.version;
        return parseInt(version.replace(/(\.)/g, ""));
    },
    getPathToPlatformAssets(hookArgs, $projectData) {
        const version = this.getNativeScriptVersion($projectData);
        const assetsDir = `android/${ version >= 341 ? "app/src" : "src" }/main/assets`;
        const pathToPlatformAssets = path.join($projectData.platformsDir, assetsDir);
        
        return pathToPlatformAssets;
    },
    getPathToAppPlatformAssets(hookArgs, $projectData) {
        let platformAppAssetsFolderPath,
            pathToPlatformAssets = this.getPathToPlatformAssets(hookArgs, $projectData);
        if (this.isAndroid(hookArgs)) {
            //platformAppAssetsFolderPath = [$projectData.platformsDir, "/android/src/main/assets/app/assets"].join("");
            platformAppAssetsFolderPath = path.join(pathToPlatformAssets, "app/assets");
        } else {
            pathToPlatformAssets = pathToPlatformAssets.split("/");
            pathToPlatformAssets.pop();
            pathToPlatformAssets = pathToPlatformAssets.join("/");
            platformAppAssetsFolderPath = [pathToPlatformAssets, "/app/assets"].join("");
        }
        return platformAppAssetsFolderPath;
    },
    isFolder(folderPath) {
        return new Promise((resolve, reject) => {
            fs.lstat(folderPath, (error, stats) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stats.isDirectory());
                }
            });
        });
    },
    getFolderFiles(folderPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(folderPath, (error, files) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(files);
                }
            });
        });
    },
    copyFile(sourceFile, targetFile) {
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
    },
    copyFolder(folderPath) {
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
    },
    iterateOverFolder(files, sourceFolder, targetFolder) {
        return new Promise((resolve, reject) => {
            each(files, (file, next) => {
                let currentSource = path.join(sourceFolder, file),
                    currentTarget = path.join(targetFolder, file);
                this.isFolder(currentSource).then((result) => {
                    if (result) {
                        this.copyFolderRecursively(currentSource, currentTarget).then(() => {
                            next();
                        }, (error) => {
                            reject(error);
                        });
                    } else {
                        this.copyFile(currentSource, currentTarget).then(() => {
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
    },
    copyFolderRecursively(sourceFolder, targetFolder) {
        return new Promise((resolve, reject) => {
            this.isFolder(sourceFolder).then((result) => {
                if (result) {
                    this.copyFolder(targetFolder).then(() => {
                        this.getFolderFiles(sourceFolder).then((files) => {
                            this.iterateOverFolder(files, sourceFolder, targetFolder).then(() => {
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
                    this.copyFile(sourceFolder, targetFolder).then(() => {
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
}
