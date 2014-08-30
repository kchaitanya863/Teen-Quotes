// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/videoDetail/videoDetail.html", {
        ready: function (element, options) {
            var item = options.item;
            element.querySelector(".titlearea .pagetitle").textContent = item.title;
            document.getElementById("videoDetailDescription").innerHTML = item.description;            
            createYouTube(document.getElementById("videoDetailPlayer"), item.providerid);
        },

        unload: function () {
            callPlayer('youtube', 'stopVideo');
            document.getElementById("youtube").innerHTML = "";
            document.getElementById("youtube").src = "";
            document.getElementById("videoDetailPlayer").removeChild(document.getElementById("youtube"));
        },

        updateLayout: function (element, viewState, lastViewState) {    
        }
    });

    function createYouTube(element, youTubeId) {
        var iframe = document.createElement("iframe");
        iframe.src = "http://www.youtube.com/embed/" + youTubeId;
        iframe.width = 487;
        iframe.height = 310;
        iframe.id = "youtube";
        element.appendChild(iframe);  
    }

    function removeYouTube(element) {   
        element.innerHtml = "";
    }
})();

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'u1zgFlCw8Aw',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.setVolume(100);
    event.target.playVideo();
}

function callPlayer(frame_id, func, args) {
    var iframe = document.getElementById(frame_id);
    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }
    if (iframe) {
        // Frame exists, 
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": args || [],
            "id": frame_id
        }), "*");
    }
}
