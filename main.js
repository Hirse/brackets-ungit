define(function (require, exports, module) {
    "use strict";

    /* beautify preserve:start */
    var CommandManager  = brackets.getModule("command/CommandManager");
    var Menus           = brackets.getModule("command/Menus");
    var FileSystem      = brackets.getModule("filesystem/FileSystem");
    var ProjectManager  = brackets.getModule("project/ProjectManager");
    var AppInit         = brackets.getModule("utils/AppInit");
    var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils");
    var NodeDomain      = brackets.getModule("utils/NodeDomain");
    var MainViewManager = brackets.getModule("view/MainViewManager");

    var Dialog              = require("src/Dialog");
    var Strings             = require("strings");
    var ungitViewerTemplate = require("text!templates/ungit.html");
    if (typeof Promise !== "function") {
        var Promise         = require("src/Promise");
    }

    var BASE_URL          = "http://localhost:8448/#/repository?path=";
    var STATUS_ERROR      = 0;
    var STATUS_INITIAL    = 1;
    var STATUS_INSTALLING = 2;
    var STATUS_INSTALLED  = 3;
    var STATUS_RUNNING    = 4;
    var STATUS_OPEN       = 5;
    /* beautify preserve:end */

    var nodeDomain = new NodeDomain("hirseUngit", ExtensionUtils.getModulePath(module, "domain"));
    var npmDomain = new NodeDomain("hirseNpm", ExtensionUtils.getModulePath(module, "npmDomain"));
    var currentPath;
    var status = STATUS_INITIAL;
    var $viewer;
    var $toolbarButton;

    function installUngit() {
        status = STATUS_INSTALLING;
        $toolbarButton.removeClass();
        $toolbarButton.addClass("installing");
        $toolbarButton.attr("title", Strings.TOOLBAR_ICON_TOOLTIP_INSTALLING);
        npmDomain.exec("install");
        npmDomain.on("out", function (event, message) {
            Dialog.appendLog(message);
        });
        npmDomain.on("installComplete", function (event, code) {
            $toolbarButton.removeClass();
            if (code === 0) {
                Dialog.openInstallationCompleteDialog();
                $toolbarButton.attr("title", Strings.TOOLBAR_ICON_TOOLTIP);
                status = STATUS_INSTALLED;
            } else {
                Dialog.openInstallationErrorDialog();
                $toolbarButton.addClass("error");
                status = STATUS_ERROR;
            }
        });
    }

    function startUngit() {
        if (status === STATUS_RUNNING) {
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            $toolbarButton.addClass("starting");
            nodeDomain.exec("start");
            nodeDomain.on("error", function () {
                $toolbarButton.removeClass();
                $toolbarButton.addClass("error");
                status = STATUS_INSTALLED;
                reject();
            });
            nodeDomain.on("out", function (event, message) {
                if (message.indexOf("## Ungit started ##") !== -1 || message.indexOf("Ungit server already running") !== -1) {
                    $toolbarButton.removeClass();
                    $toolbarButton.addClass("enabled");
                    status = STATUS_RUNNING;
                    resolve();
                }
            });
        });
    }

    function killUngit() {
        if (status === STATUS_OPEN) {
            closeUngit();
        }
        nodeDomain.exec("kill");
        nodeDomain.on("close", function () {
            $toolbarButton.removeClass();
            status = STATUS_INSTALLED;
            $viewer.find("iframe").attr("src", "");
            currentPath = "";
        });
    }

    function openUngit() {
        startUngit().then(function () {
            var projectPath = ProjectManager.getProjectRoot().fullPath;
            if (currentPath !== projectPath) {
                currentPath = projectPath;
                $viewer.find("iframe").attr("src", BASE_URL + currentPath);
            }
            $viewer.fadeIn("fast");
            status = STATUS_OPEN;
        });
    }

    function closeUngit() {
        $viewer.fadeOut("fast");
        status = STATUS_RUNNING;
        CommandManager.execute("brackets-git.refreshAll");
    }

    $viewer = $(Mustache.render(ungitViewerTemplate, {
        Strings: Strings
    }));
    $viewer.find("button#hirse-ungit-close").click(closeUngit);
    $viewer.appendTo(".main-view .content");

    ExtensionUtils.loadStyleSheet(module, "styles/styles.css");

    MainViewManager.on("currentFileChange", function () {
        if (status === STATUS_OPEN) {
            closeUngit();
        }
    });

    CommandManager.register(Strings.OPEN_UNGIT_CMD, "hirse.ungit.open", openUngit);
    CommandManager.register(Strings.KILL_UNGIT_CMD, "hirse.ungit.kill", killUngit);
    var menu = Menus.getMenu(Menus.AppMenuBar.NAVIGATE_MENU);
    menu.addMenuDivider();
    menu.addMenuItem("hirse.ungit.open", "Ctrl-Alt-U");
    menu.addMenuItem("hirse.ungit.kill", "Ctrl-Alt-K");

    $toolbarButton = $(document.createElement("a"))
        .attr("id", "hirse-ungit-toolbar-icon")
        .addClass("warning")
        .attr("href", "#")
        .on("click", function () {
            if (status === STATUS_ERROR) {
                Dialog.openInstallationErrorDialog();
            } else if (status === STATUS_INSTALLING) {
                Dialog.openInstallDialog();
            } else if (status >= STATUS_INSTALLED) {
                if (status !== STATUS_OPEN) {
                    openUngit();
                } else {
                    closeUngit();
                }
            }
        })
        .appendTo($("#main-toolbar .buttons"));

    AppInit.appReady(function () {
        var nodeModules = FileSystem.getDirectoryForPath(ExtensionUtils.getModulePath(module, "node_modules"));
        nodeModules.exists(function (error, exists) {
            if (!exists) {
                installUngit();
            } else {
                $toolbarButton.removeClass();
                $toolbarButton.attr("title", Strings.TOOLBAR_ICON_TOOLTIP);
                status = STATUS_INSTALLED;
            }
        });
    });
});
