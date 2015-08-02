/* jshint node:true */

(function () {
    "use strict";

    var DOMAIN_NAME = "hirseUngit";

    var childProcess = require("child_process");

    var _domainManager;
    var child;

    function start() {
        child = childProcess.fork("node_modules/ungit/bin/ungit", ["--no-b"], {
            cwd: __dirname,
            silent: true
        });
        child.stdout.on("data", function (buffer) {
            _domainManager.emitEvent(DOMAIN_NAME, "out", buffer.toString());
        });
        child.stderr.on("data", function (buffer) {
            _domainManager.emitEvent(DOMAIN_NAME, "stderr", buffer.toString());
        });
        child.on("error", function (code) {
            _domainManager.emitEvent(DOMAIN_NAME, "error", code);
        });
        child.on("close", function (code) {
            child = null;
            _domainManager.emitEvent(DOMAIN_NAME, "close", code);
        });
    }

    function kill() {
        if (child) {
            if (/^win/.test(process.platform)) {
                childProcess.spawn("taskkill", ["/pid", child.pid, "/t", "/f"]);
            } else {
                child.kill();
            }
        }
    }

    function init(domainManager) {
        _domainManager = domainManager;
        if (!domainManager.hasDomain(DOMAIN_NAME)) {
            domainManager.registerDomain(DOMAIN_NAME, {
                major: 0,
                minor: 1
            });
        }
        domainManager.registerCommand(
            DOMAIN_NAME, // domain name
            "start", // command name
            start, // command handler function
            false, // this command is synchronous in Node
            "Starts the ungit process"
        );
        domainManager.registerCommand(
            DOMAIN_NAME, // domain name
            "kill", // command name
            kill, // command handler function
            false, // this command is synchronous in Node
            "Kills the ungit process"
        );

        domainManager.registerEvent(
            DOMAIN_NAME, // domain name
            "out", // event name
            [{
                name: "mesage",
                type: "string",
                description: "Message body"
            }]
        );

        domainManager.registerEvent(
            DOMAIN_NAME, // domain name
            "stderr", // event name
            [{
                name: "mesage",
                type: "string",
                description: "message body"
            }]
        );

        domainManager.registerEvent(
            DOMAIN_NAME, // domain name
            "error", // event name
            [{
                name: "code",
                type: "string",
                description: "Exit code"
            }]
        );

        domainManager.registerEvent(
            DOMAIN_NAME, // domain name
            "close", // event name
            [{
                name: "code",
                type: "string",
                description: "Exit code"
            }]
        );
    }

    exports.init = init;
}());
