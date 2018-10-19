'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

module.exports = function () {
    function CreateSymlinkPlugin(options) {
        var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, CreateSymlinkPlugin);

        if (options instanceof Array) {
            this.options = options;
        } else {
            this.options = [options];
        }
        this.force = force;
    }

    _createClass(CreateSymlinkPlugin, [{
        key: 'apply',
        value: function apply(compiler) {
            var _this = this;

            compiler.hooks.done.tapAsync({
                name: 'CreateSymlinkPlugin',
                context: true
            }, function (context, compilation, callback) {

                var makeSymlinks = function makeSymlinks(option) {
                    var outputPath = compiler.options.output.path;
                    var originPath = path.join(outputPath, option.origin);
                    var reportProgress = context && context.reportProgress;

                    if (fs.existsSync(originPath) || _this.force) {
                        var baseDir = process.cwd();
                        process.chdir(outputPath);
                        var symlink = path.join(outputPath, option.symlink);
                        var origin = path.relative(path.dirname(symlink), originPath);

                        if (_this.force) {
                            try {
                                fs.unlinkSync(symlink);
                            } catch (err) {}
                        } else {
                            if (fs.existsSync(symlink)) fs.unlinkSync(symlink);
                        }
                        try {
                            fs.symlinkSync(origin, symlink);
                        } catch (err) {}
                        if (reportProgress) {
                            reportProgress(100.0, 'Created symlink from: ', origin, ' to: ', symlink);
                        }
                        process.chdir(baseDir);
                    }
                };

                _this.options.forEach(makeSymlinks);
                callback();
            });
        }
    }]);

    return CreateSymlinkPlugin;
}();
