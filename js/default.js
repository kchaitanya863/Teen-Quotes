// For an introduction to the Grid template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232446
(function () {
    "use strict";
    WinJS.Binding.optimizeBindingReferences = true;
    
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    WinJS.Application.onerror = function (e) {
        console.error(e.detail.exception.message, e.detail.exception.stack);
        var dialog = new Windows.UI.Popups.MessageDialog(
        e.detail.exception.stack, e.detail.exception.message);
        dialog.showAsync().done();
        return true;

    };

    WinJS.Application.onsettings = function (e) {
        var handler = function () {
            var uriToLaunch = Data.privacyUrl;
            var uri = new Windows.Foundation.Uri(uriToLaunch);
            Windows.System.Launcher.launchUriAsync(uri).then(
               function (success) {
                   if (success) {
                       // URI launched 
                   } else {
                       // URI launch failed 
                   }
               });
        }

        var settingsCommand = new Windows.UI.ApplicationSettings.SettingsCommand("Privacy", "Privacy", handler);
        //e.detail.applicationcommands = { "about": { title: "About", href: "/pages/settings/about.html" } };
        e.detail.e.request.applicationCommands.append(settingsCommand);
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.addEventListener("activated", function (args) {

        WinJS.Namespace.define("GlobalNav", nav);
        

        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                document.body.classList.add("loaded");
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();
