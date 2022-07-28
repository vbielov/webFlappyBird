// https://stackoverflow.com/questions/41892911/typescript-with-amd-and-require-js
// https://requirejs.org/docs/start.html

requirejs(["build/build.js"], function(build) {
    // build file is loaded
    require(['Main'], function (Main) {
        // starting Start component
    });
});