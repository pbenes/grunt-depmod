/*global node:true*/
var fs = require('fs'),
    esprima = require('esprima');

function traverseAST(r, ast, pattern) {
    if (!ast) return false;

    var same = false;
    if (pattern.type === ast.type) {
        same = true;
        for(key in pattern) {
            if (pattern.hasOwnProperty(key)) {
                same &= JSON.stringify(pattern[key]) === JSON.stringify(ast[key]);
            }
            if (!same) break;
        }
        same && r.push(ast);
    }

    switch(ast.type) {
        case 'Program':
        case 'BlockStatement':
            ast.body.forEach(function(e) {
                if (!same) same = traverseAST(r, e, pattern);
            });
            break;
        case 'IfStatement':
            same = traverseAST(r, ast.consequent, pattern);
            same = traverseAST(r, ast.alternate, pattern);
            break;
        case 'ExpressionStatement':
            same = traverseAST(r, ast.expression, pattern);
            break;
        case 'CallStatement':
            same = traverseAST(r, ast.callee, pattern);
            break;
    }
}

var YAHOO_REGISTER_AST = {
    "type": "CallExpression",
    "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
            "type": "Identifier",
            "name": "YAHOO"
        },
        "property": {
            "type": "Identifier",
            "name": "register"
        }
    }
};

var YUI_ADD_AST = {
    "type": "CallExpression",
    "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
            "type": "Identifier",
            "name": "YUI"
        },
        "property": {
            "type": "Identifier",
            "name": "add"
        }
    }
};

var DOJO_PROVIDE_AST = {
    "type": "CallExpression",
    "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
            "type": "Identifier",
            "name": "dojo"
        },
        "property": {
            "type": "Identifier",
            "name": "provide"
        }
    }
};

var DOJO_REQUIRE_AST = {
    "type": "CallExpression",
    "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
            "type": "Identifier",
            "name": "dojo"
        },
        "property": {
            "type": "Identifier",
            "name": "require"
        }
    }
};

var cssModuleName = /html\/styles\/(.*)\.css/;

function checkDojoRequire(filename, ast) {
    var matches;

    matches = [];
    traverseAST(matches, ast, DOJO_PROVIDE_AST);
    var name = filename;
    matches.forEach(function(s) {
        name = s['arguments'][0].value;
    });
    if (name === filename) return 0;

    matches = [];
    traverseAST(matches, ast, DOJO_REQUIRE_AST);

    var requires = [];
    matches.forEach(function(s) {
        requires.push( s['arguments'][0].value );
    });
    //console.log(name, requires ? ' ['+requires.join(',')+']' : '[]');
    return depmodEntry(name, filename, requires);

    // return 1;
}

function checkYUI(filename, ast) {
    var matches = [];
    traverseAST(matches, ast, YUI_ADD_AST);
    traverseAST(matches, ast, YAHOO_REGISTER_AST);

    // ###
    // console.log(filename);

    return matches.map(function(s) {
        var name = s['arguments'][0].value;
        var details = s['arguments'][3];
        var requires = details && details.properties.filter(function(p) {
            return p.key.name === 'requires';
        }).map(function(p) {
             return p.value.elements.map(function(e) { return e.value; });
         });

        //console.log(name, requires ? ' ['+requires.join(',')+']' : '[]');
        return depmodEntry(name, filename, requires);
    });
}

function processCSS(filename) {
    var name = "GDC-css-" + cssModuleName.exec(filename)[1];
    return depmodEntry(name, filename, []);
}

function depmodEntry(name, filename, requires) {
    var root = './';
    var m = {
        name: name,
        path: root + filename,
        ext: false,
        version: '1.0.0' // mod.version
    };

    if (requires && requires.length) m.requires = requires[0];
    // if (mod.details.after) m.after = mod.details.after;
    return { name: name, module: m };
}

function processFile(filename) {
    if (filename.search(/\.css$/) != -1) {
        return [ processCSS(filename) ];
    }

    var ast = esprima.parse(fs.readFileSync(filename, 'utf-8'));

    var yui = checkYUI(filename, ast);
    if (yui) { return yui };

    var dojo = checkDojoRequire(filename, ast);
    if (dojo) { return dojo };
}

exports.getDepmod = function(files) {
    return files.map(processFile).reduce(function(prev, current){
        current.forEach(function(file) {
            prev[file.name] = file.module;
        });
        return prev;
    }, {});
}
