define(function (require, exports, module) {
    "use strict";

    /* beautify preserve:start *//* eslint-disable no-multi-spaces */
    var Dialogs         = brackets.getModule("widgets/Dialogs");

    var Strings         = require("strings");
    /* eslint-enable no-multi-spaces *//* beautify preserve:end */

    var Dialog;
    var installLog = "";

    function openInstallDialog() {
        var dialogBody = "<pre>" + installLog + "</pre>";
        Dialog = Dialogs.showModalDialog("hirse-ungit-progress", Strings.INSTALL_DIALOG_PROGRESS_TITLE, dialogBody, [{
            className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
            id: "hide",
            text: Strings.INSTALL_DIALOG_BUTTON_HIDE
        }]);
        Dialog.done(function () {
            Dialog = null;
        });
    }

    function openInstallationCompleteDialog() {
        if (Dialog) {
            Dialog.close();
        }
        var dialogBody = Strings.INSTALL_DIALOG_FINISHED_CONTENT;
        dialogBody += "<pre>" + installLog + "</pre>";
        Dialogs.showModalDialog("hirse-ungit-finished", Strings.INSTALL_DIALOG_FINISHED_TITLE, dialogBody, [{
            className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
            id: Dialogs.DIALOG_BTN_OK,
            text: Strings.INSTALL_DIALOG_BUTTON_OK
        }]);
    }

    function openInstallationErrorDialog() {
        if (Dialog) {
            Dialog.close();
        }
        var dialogBody = Strings.INSTALL_DIALOG_ERROR_CONTENT;
        dialogBody += "<pre>" + installLog + "</pre>";
        Dialogs.showModalDialog("hirse-ungit-error", Strings.INSTALL_DIALOG_ERROR_TITLE, dialogBody, [{
            className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
            id: "close",
            text: Strings.INSTALL_DIALOG_BUTTON_CLOSE
        }]);
    }

    function appendLog(message) {
        installLog += message;
        if (Dialog) {
            $(Dialog.getElement()).find(".dialog-message pre").text(installLog);
        }
    }

    module.exports = {
        openInstallDialog: openInstallDialog,
        openInstallationCompleteDialog: openInstallationCompleteDialog,
        openInstallationErrorDialog: openInstallationErrorDialog,
        appendLog: appendLog
    };
});
