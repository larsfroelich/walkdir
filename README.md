# walk-Dir
NPM-Module used to "walk" through a directory, revealing the contained folders and files in a practical way.

## Why
Oftentimes when working with a node.js application, it is necessary to retrieve the structure of a certain folder in an easy-to-parse form.
This is useful e.g. when building an express.js-router or for bootstrapping child-modules automatically.

##Setup
Install walkDir via `npm install walk-dir --save`

Make sure not to confuse this module with "walkdir", this is "walk-dir"!


## Usage
1) Require walkDir using  `var walkDir = require("walkdir");`
2) Choose one of the following methods it provides:

    2.1 **List**
    
        `walkDir.list(excludedPath, includedPath, depth)`
        
    + `excludedPath`: beginning of your search-path which should **not** be included in the results.
    
    + `includedPath`: end of your search-path which **should** be included in the results.
    
    + `depth`: At what level of depth should the recursive search end?
        
        + 0: Never. End when all subdirectories have been found and listed.
        + x: End after peeking into x levels of folders, 1 being the provided path

    + **returns**: Array of Strings representing the paths to found folders and files

    2.2 **Tree**

            `walkDir.tree(excludedPath, includedPath, depth)`

    + `excludedPath`: beginning of your search-path which should **not** be included in the results.
    + `includedPath`: end of your search-path which **should** be included in the results.
    + `depth`: At what level of depth should the recursive search end?
        + 0: Never. End when all subdirectories have been found and listed.
        + x: End after peeking into x levels of folders, 1 being the provided path
    + **returns**: JS-Object-tree where folders are branches and leaves are "true". -> Full paths are built from object-keys.

3) Decide on using the *synchronous*, *promise*-based or *callback*-based version
    
    3.1 **Synchronous**
    + All methods are available as Synchronous versions by simply appending "Sync" to it
    + e.g. list**Sync**, tree**Sync**
    
    3.2 **Promises**
    + All methods return [*promises*]("https://developers.google.com/web/fundamentals/primers/promises")
    + simply use them to react to success/failure of the given method
    + e.g. `list(...).then(function(result){/** do sth with result **/ }).catch(function(err){/** react to error **/)`
    
    3.3 **Callbacks**
    + All methods accept a *callback*-function as optional last argument
    + simply pass this function using the signature `function(err, result){...}`
    + e.g. `list(..., function(err, result){/** do sth with result if !err */})`