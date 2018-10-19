const fs = require('fs');
const path = require('path');

module.exports = class CreateSymlinkPlugin {
    constructor(options, force = false) {
        if (options instanceof Array) {
            this.options = options;
        } else {
            this.options = [options];
        }
        this.force = force;
    }

    apply(compiler) {
        compiler.hooks.done.tapAsync(
            {
                name: 'CreateSymlinkPlugin',
                context: true
            },
            (context, compilation, callback) => {

                const makeSymlinks = (option) => {
                    const outputPath = compiler.options.output.path;
                    const originPath = path.join(outputPath, option.origin);
                    const reportProgress = context && context.reportProgress;

                    if (fs.existsSync(originPath) || this.force) {
                        const baseDir = process.cwd();
                        process.chdir(outputPath);
                        const symlink = path.join(outputPath, option.symlink);
                        const origin = path.relative(path.dirname(symlink), originPath);

                        if (this.force) {
                            try {
                                fs.unlinkSync(symlink);
                            } catch (err) {
                            }
                        } else {
                            if (fs.existsSync(symlink)) fs.unlinkSync(symlink);
                        }
                        try {
                            fs.symlinkSync(origin, symlink);
                        } catch (err) {
                        }
                        if (reportProgress) {
                            reportProgress(100.0, 'Created symlink from: ', origin, ' to: ', symlink);
                        }
                        process.chdir(baseDir);
                    }
                };

                this.options.forEach(makeSymlinks);
                callback();
            });
    }
};
