var libmodule = require('libmodule');
// Doesn't depend on libutil!
libmodule.mergeExports(module.exports,
    require('./src/Clock.js')
);