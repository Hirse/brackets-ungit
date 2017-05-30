/* global module */

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        compress: {
            main: {
                options: {
                    archive: "hirse.ungit.zip"
                },
                files: [
                    {
                        src: [
                            "nls/**",
                            "src/**",
                            "styles/**",
                            "templates/*",
                            "thirdparty/*",
                            "CHANGELOG.md",
                            "domain.js",
                            "LICENSE",
                            "main.js",
                            "npmDomain.js",
                            "package.json",
                            "README.md",
                            "strings.js"
                        ]
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-compress");

    grunt.registerTask("default", [
        "compress"
    ]);
};
