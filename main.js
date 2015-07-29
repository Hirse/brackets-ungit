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

    var ungitViewerTemplate = require("text!templates/ungit.html");
    var Strings             = require("strings");

    var BASE_URL          = "http://localhost:8448/#/repository?path=";
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

    function startUngit() {
        nodeDomain.exec("start");
        nodeDomain.on("error", function () {
            $toolbarButton.addClass("error");
            status = STATUS_INSTALLED;
        });
        status = STATUS_RUNNING;
    }

    function killUngit() {
        if (status === STATUS_OPEN) {
            closeUngit();
        }
        nodeDomain.exec("kill");
        nodeDomain.on("close", function () {
            $toolbarButton.removeClass("enabled");
            status = STATUS_INSTALLED;
            $viewer.find("iframe").attr("src", "");
            currentPath = "";
        });
    }

    function openUngit() {
        if (status === STATUS_INSTALLED) {
            startUngit();
        }
        var projectPath = ProjectManager.getProjectRoot().fullPath;
        if (currentPath !== projectPath) {
            currentPath = projectPath;
            $viewer.find("iframe").attr("src", BASE_URL + currentPath);
        }
        $viewer.fadeIn("fast");
        status = STATUS_OPEN;
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
            if (status >= STATUS_INSTALLED) {
                if (status !== STATUS_OPEN) {
                    $(this).addClass("enabled");
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
                npmDomain.exec("install");
                status = STATUS_INSTALLING;
                $toolbarButton.attr("title", Strings.TOOLBAR_ICON_TOOLTIP_INSTALLING);
                npmDomain.on("installComplete", function (event, code) {
                    if (code === 0) {
                        $toolbarButton.removeClass("warning");
                        $toolbarButton.attr("title", Strings.TOOLBAR_ICON_TOOLTIP);
                        status = STATUS_INSTALLED;
                    } else {
                        $toolbarButton.addClass("error");
                    }
                });
            } else {
                $toolbarButton.removeClass("warning");
                $toolbarButton.attr("title", Strings.TOOLBAR_ICON_TOOLTIP);
                status = STATUS_INSTALLED;
            }
        });
    });
});
