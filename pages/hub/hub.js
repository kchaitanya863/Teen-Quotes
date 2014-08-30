// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var lh;
    var listBinding;
    
    
    WinJS.UI.Pages.define("/pages/hub/hub.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Application.addEventListener("dataChanged", dataChanged, false);
            function dataChanged() {
                hubs.BindGrid();
            }
            hubControl.onscroll = function (e) {
                if (Windows.UI.ViewManagement.ApplicationView.value == Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                    Data.HubScroll = 0;
                }
                else {
                    Data.HubScroll = e.target.scrollLeft;
                }
                
            }
           
            element.querySelector("header[role=banner] .pagetitle").textContent = Data.appName;

            var hubs = ZipGrid.createHub();
            hubs.dataToBind = Data.getHubItems.dataSource;
            hubs.BindGrid();

            function ListNotificationHandler() {
                this.endNotifications = function () {
                    WinJS.Application.queueEvent({ type: "dataChanged" });
                    return;
                };
            }

            lh = new ListNotificationHandler();
            listBinding = Data.getHubItems.dataSource.createListBinding(lh);            
            
            if (Data.HubScroll != null) {
                hubControl.scrollLeft = Data.HubScroll;
            }
        
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            lh = null;
            listBinding = null;
            ZipGrid.destroyHub();
        },

        updateLayout: function (element, viewState, lastViewState) {
            hubControl.scrollLeft = 0;
        }
    });
})();
