// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/twitterDetail/twitterDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var item = options && options.item ? options.item : Data.items.getAt(0);
            var tweet = ZipGrid.createGridItem(item);
            tweet.classList.add("twitter-340x170");
            document.getElementById("mainContent").appendChild(tweet);
            twitterUserImage.src = item.backgroundImage;
            twitterUserImage.onload = function (item) {
                //CachedIMage will load. Now load larger image
                item.target.src = item.target.src.replace("_bigger", "");
                item.onload = null;                
            };
            btnViewOnTwitter.onclick = function () {
                var uriToLaunch = item.url;
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
            twitterHandle.innerText = item.title;
            twitterUserName.innerText = item.subtitle;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
