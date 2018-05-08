function ManifestJsonPlugin(options) {
    const path = options.path;

    this.manifest = require(path);

}

ManifestJsonPlugin.prototype.apply = function (compiler) {
    compiler.plugin('emit', (comp, done) => {
        let source = JSON.stringify(this.manifest);
        comp.assets['manifest.json'] = {
            source: () => source,
            size: () => source.length
        };
        return done();
    });
};

exports.ManifestJsonPlugin = ManifestJsonPlugin;