var fs = require('fs');

exports.loadFile = loadFile;
exports.node = node;
exports.writeFile = writeFile;

function node(message, yes, no) {
    return {
        message: message,
        yes: yes,
        no: no
    };
}

function loadFile(filename, callback) {
    fs.readFile(filename, 'utf8', function (err, contents) {
        if (err) return callback(err);
        
        try {
            var root = JSON.parse(contents);
            callback(null, root);
        }
        catch (error) {
            callback(error);
        }
    });
}

function writeFile(filename, object, callback) {
    try {
        var json = JSON.stringify(object, null, 2);
        fs.writeFile(filename, json, callback);
    }
    catch (error) {
        callback(error);
    }
}