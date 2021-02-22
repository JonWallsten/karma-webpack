const fs = require('fs');

class KW_WebpackPlugin {
  constructor(options) {
    this.karmaEmitter = options.karmaEmitter;
    this.controller = options.controller;
  }

  apply(compiler) {
    this.compiler = compiler;

    // webpack bundles are finished
    compiler.hooks.done.tap('KW_WebpackPlugin', (stats) => {
      // read generated file content and store for karma preprocessor
      this.controller.bundlesContent = {};
      stats.toJson().assets.forEach((webpackFileObj) => {
        // If webpackFileObj.name has an absolute path on Windows we need to clean up the drive letter to avoid getting an error when a dir is created for this path
        console.error('1.', compiler.options.output.path);
        console.error('2.', webpackFileObj.name);
        const filePath = `${compiler.options.output.path}/${webpackFileObj.name.replace(/(a-z):/gi, '$1')}`;
        this.controller.bundlesContent[webpackFileObj.name] = fs.readFileSync(
          filePath,
          'utf-8'
        );
      });

      // karma refresh
      this.karmaEmitter.refreshFiles();
    });
  }
}

module.exports = KW_WebpackPlugin;
