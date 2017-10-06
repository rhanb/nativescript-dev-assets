const fs = require('fs');

module.exports = {
    isAndroid(hookArgs) {
        let platform;
        if (hookArgs.platform) {
            platform = hookArgs.platform.toLowerCase();
        }
        return platform === 'android';
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
    }
}