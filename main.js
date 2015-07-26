define(function (require, exports, module) {
    "use strict";

    /* beautify preserve:start */
    var CommandManager  = brackets.getModule("command/CommandManager");
    var Menus           = brackets.getModule("command/Menus");
    var ProjectManager  = brackets.getModule("project/ProjectManager");
    var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils");
    var NodeDomain      = brackets.getModule("utils/NodeDomain");
    var MainViewManager = brackets.getModule("view/MainViewManager");

    var ungitViewerTemplate = require("text!templates/ungit.html");
    var Strings             = require("strings");
    /* beautify preserve:end */

    var BASE_URL = "http://localhost:8448/#/repository?path=";

    var nodeDomain = new NodeDomain("hirse.ungit", ExtensionUtils.getModulePath(module, "domain"));
    var isRunning = false;
    var isOpen = false;
    var currentPath;
    var $viewer;
    var $toolbarButton;

    function startUngit() {
        nodeDomain.exec("start");
        nodeDomain.on("stderr", function () {
            $toolbarButton.addClass("error");
            isRunning = false;
        });
        isRunning = true;
    }

    function killUngit() {
        if (isOpen) {
            closeUngit();
        }
        nodeDomain.exec("kill");
        $toolbarButton.removeClass("enabled");
        isRunning = false;
    }

    function openUngit() {
        if (!isRunning) {
            startUngit();
        }
        var projectPath = ProjectManager.getProjectRoot().fullPath;
        if (currentPath !== projectPath) {
            currentPath = projectPath;
            $viewer.find("iframe").attr("src", BASE_URL + currentPath);
        }
        $viewer.fadeIn("fast");
        isOpen = true;
    }

    function closeUngit() {
        $viewer.fadeOut("fast");
        isOpen = false;
        CommandManager.execute("brackets-git.refreshAll");
    }

    $viewer = $(Mustache.render(ungitViewerTemplate, {
        Strings: Strings
    }));
    $viewer.find("button#hirse-ungit-close").click(closeUngit);
    $viewer.appendTo(".main-view .content");

    ExtensionUtils.loadStyleSheet(module, "styles/styles.css");

    MainViewManager.on("currentFileChange", function () {
        if (isOpen) {
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
        .attr("href", "#")
        .attr("title", Strings.TOOLBAR_ICON_TOOLTIP)
        .on("click", function () {
            if (!isOpen) {
                $(this).addClass("enabled");
                openUngit();
            } else {
                closeUngit();
            }
        })
        .appendTo($("#main-toolbar .buttons"));
});
