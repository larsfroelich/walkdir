const fs = require('fs-extra');
function errorResponse(resolve, reject, callback, error){
    resolve = null;
    reject(error);
    if(callback && typeof(callback) === 'function'){
        callback(error, null);
    }
}
function successResponse(resolve, callback, result){
    if(resolve !== null){
        resolve(result);
        if(callback && typeof(callback) === 'function'){
            callback(null, result);
        }
    }
}
module.exports = {
    listSync: function listSync(excludedPath, includedPath, depth){
        var results = [];
        var list = fs.readdirSync(excludedPath + includedPath);
        list.forEach(function(file) {
            var stat = fs.statSync(excludedPath + includedPath + '/' + file);
            if (stat && stat.isDirectory() && (depth > 1 || depth === -1))
                results = results.concat(listSync(excludedPath, includedPath + '/' + file, (depth > 1 ? depth-1 : depth)));
            else if (stat && !stat.isDirectory()) results.push(includedPath + '/' + file)
        });
        return results;
    },
    list: function list(excludedPath, includedPath, depth, callback){
        return new Promise(function(resolve, reject){
            var paths = [];
            var recursivePromises = [];
            fs.readdir(excludedPath + includedPath, function(err, folderItems){
                if(err){
                    errorResponse(resolve, reject, callback, err);
                }else{
                    folderItems.forEach(function(file) {
                        fs.stat(excludedPath + includedPath + '/' + file, function(err, stat){
                            if(err){
                                recursivePromises.push(new Promises(function(resolve, reject){reject(err);}));
                            }else{
                                if (stat && stat.isDirectory() && (depth > 1 || depth === 0)){ // is a directory and depth ok?
                                    recursivePromises.push(list(excludedPath, includedPath + '/' + file, (depth > 1 ? depth-1 : depth)));
                                }else if (stat && !stat.isDirectory()){
                                    paths.push(includedPath + '/' + file)
                                }
                            }
                        });
                    });
                    Promise.all(recursivePromises).then(function(results){
                        paths = paths.concat(results);
                    }).catch(function(err){
                        errorResponse(resolve, reject, callback, err);
                    });
                    successResponse(resolve, callback, paths);
                }
            });
        })
    }
};