const fs = require('fs-extra');
const path = require("path");

function errorResponse(reject, callback, error){
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
        var list = fs.readdirSync(path.join(excludedPath, includedPath));
        list.forEach(function(file) {
            var stat = fs.statSync(path.join(path.join(excludedPath, includedPath), file));
            if (stat && stat.isDirectory() && (depth > 1 || depth === 0)) // is a directory and depth ok?
                results = results.concat(listSync(excludedPath, path.join(includedPath, file), (depth > 1 ? depth-1 : depth)));
            else if (stat && !stat.isDirectory())
                results.push(path.join(includedPath, file))
        });
        return results;
    },
    list: function list(excludedPath, includedPath, depth, callback){
        return new Promise(function(resolve, reject){
            var paths = [];
            var recursivePromises = [];
            fs.readdir(path.join(excludedPath, includedPath), function(err, folderItems){
                if(err){
                    errorResponse(reject, callback, err);
                }else{
                    folderItems.forEach(function(file) {
                        fs.stat(path.join(path.join(excludedPath, includedPath), file), function(err, stat){
                            if(err){
                                recursivePromises.push(new Promise(function(resolve, reject){reject(err);}));
                            }else{
                                if (stat && stat.isDirectory() && (depth > 1 || depth === 0)){ // is a directory and depth ok?
                                    recursivePromises.push(list(excludedPath, path.join(includedPath, file), (depth > 1 ? depth-1 : depth)));
                                }else if (stat && !stat.isDirectory()){
                                    paths.push(path.join(includedPath, file));
                                }
                            }
                        });
                    });
                    Promise.all(recursivePromises).then(function(results){
                        paths = paths.concat(results);
                        successResponse(resolve, callback, paths);
                    }).catch(function(err){
                        errorResponse(reject, callback, err);
                    });
                }
            });
        })
    },
    treeSync : function(excludedPath, includedPath, depth){
        var folderItems = fs.readdirSync(path.join(excludedPath, includedPath));
        var tree = {};
        folderItems.forEach(function(file){
            var stat = fs.statSync(path.join(path.join(excludedPath, includedPath), file));
            if (stat && stat.isDirectory() && (depth > 1 || depth === 0)) // is a directory and depth ok?
                tree[path.join(includedPath, file)] = treeSync(excludedPath, path.join(includedPath, file), (depth > 1 ? depth-1 : depth));
            else if (stat && !stat.isDirectory())
                tree[path.join(includedPath, file)] = true;
        });
        return tree;
    }
};