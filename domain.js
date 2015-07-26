/* jshint node:true */

(function () {
    "use strict";

    var DOMAIN_NAME = "hirse.ungit";

    var childProcess = require("child_process");

    var _domainManager;
    var child;

    function start() {
        child = childProcess.exec("node " + __dirname + "/node_modules/ungit/bin/ungit --no-b", function (stdout, stderr, error) {
            console.log(arguments);
//            if (error) {
//                console.log(error);
//            }
        });
        child.stdout.on("data", function (data) {
            _domainManager.emitEvent(DOMAIN_NAME, "stdout", data);
        });
        child.stderr.on("data", function (data) {
            _domainManager.emitEvent(DOMAIN_NAME, "stderr", data);
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
            true, // this command is synchronous in Node
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
            "stdout", // event name
            [{
                name: "mesage",
                type: "string",
                description: "message body"
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
