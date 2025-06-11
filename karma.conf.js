module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/app/hello-world.component.spec.ts'
        ],
        preprocessors: {
            'src/app/hello-world.component.spec.ts': ['webpack']
        },
        reporters: ['progress'],
        browsers: ['Chrome'],
        singleRun: true
    });
};