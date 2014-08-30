var provider = {
    localFolder: Windows.Storage.ApplicationData.current.localFolder,
    defaultMaxHubItems: 8,
    defaultUpdateInMilliseconds: 300000,
    getFileName: function (currentList) {
        var fileName = currentList.dataProvider + "-" + currentList.id + '.js';
        return fileName;
    },
    deleteGroup: function (currentList, globalList) {
        var toRemove = [];
        var calls = [];
        globalList.forEach(function (item, i) {
            var p = new WinJS.Promise(function (comp, err, prog) {
                if (item) {
                    if (item.group.key == currentList.key) {
                        toRemove.push(i);
                    }
                    comp();
                }
            })
            calls.push(p);
            return;
        })

        return WinJS.Promise.join(calls).then(function () {
            toRemove.sort(
                function (a, b) {
                    return b - a
                });
            for (var i = 0; i < toRemove.length; i++) {
                globalList.splice(toRemove[i], 1);
            }
        })
    },
    processItems: function (providerData, currentList, globalList, shouldSave, unshift) {

        var toSave = [];
        try {
            for (var x = 0; x < providerData.length; x++) {
                var item = providerData[x]
                item.group = currentList;
                var maxNumber = provider.defaultMaxHubItems;
                if (!isNaN(item.group.maxitems) && item.group.maxitems > 0) {
                    maxNumber = item.group.maxitems
                }
                item.showOnHub = x < maxNumber;
                item.title = item.title

                unshift ? globalList.unshift(item) : globalList.push(item);
                toSave.push(item);
            }

            if (shouldSave && toSave.length > 0) {
                var fileName = provider.getFileName(currentList);
                provider.saveFile(fileName, JSON.stringify(toSave));
            }
        }
        catch (e) {
            console.log("Processing Items Error", error);
            toSave = [];
        }
        return toSave.length;
    },

    process: function (lists, globalList) {
        for (var i = 0; i < lists.length; i++) {
            (function () {
                var currentList = lists[i];
                var fileName = provider.getFileName(currentList);
                provider.localFolder.getFileAsync(fileName)
                .done(function (file) { openLocal(file) }, failedLocal)

                function openLocal(sampleFile) {
                    //If there is a file in file system... Get it
                    Windows.Storage.FileIO.readTextAsync(sampleFile).then(function (contents) {
                        var providerData = JSON.parse(contents);
                        provider.processItems(providerData, currentList, globalList, false);
                    }).done(function () {
                        fetchFromLiveProvider(currentList, globalList);
                    }
                    )
                }

                function failedLocal(contents) {
                    //If Not get from the App Cache
                    provider.fetchFromCache(fileName)
                        .then(function (providerData) {
                            provider.processItems(providerData, currentList, globalList, true);
                        }).done(function () {
                            fetchFromLiveProvider(currentList, globalList);
                        });
                }

                function fetchFromLiveProvider(currentList, globalList) {

                    var f = provider.fetchFromZipApp;
                    var parameters = [currentList, globalList]

                    f.apply(this, parameters).then(
                        function (providerData) {
                            if (providerData != null && providerData.length > 0) {
                                var filename = provider.getFileName(currentList);
                                provider.deleteGroup(currentList, globalList).done(
                                    function () {
                                        provider.processItems(providerData, currentList, globalList, true);
                                    })
                            }
                        }
                        ).done(
                        function () {
                            setTimeout(function () { fetchFromLiveProvider(currentList, globalList) }, provider.defaultUpdateInMilliseconds);
                        })
                }

                return;
            })();
        };
    },
    doTwitterUpdate: function (currentList, globalList, refresh_url, filename, fireOnError) {
        if (filename == null) {
            filename = provider.getFileName(currentList);
        }
        var unshift = refresh_url != null;
        if (refresh_url == null) {
            var user = currentList.param1 ? currentList.param1 : "";
            var search = currentList.param2 ? " " + currentList.param2 : "";

            if (user) {
                user = "from:" + user;
            }
            refresh_url = "?q=" + user + search;
        }

        WinJS.xhr({
            url: "http://search.twitter.com/search.json" + refresh_url, responseType: 'json'
        })
            .done(function complete(result) {
                var formatted = provider.convertTwitterJson(result, currentList);
                var itemNumbers = provider.processItems(formatted, currentList, globalList, true, unshift);
                setTimeout(function () { provider.doTwitterUpdate(currentList, globalList, formatted.refresh_url, filename) }, provider.defaultUpdateInMilliseconds);

            }, function (error) {
                console.error("Error trying to contact twitter", error);
                if (fireOnError != null) {
                    fireOnError();
                }
            })
    },
    fetchFromCache: function (fileName) {
        return new WinJS.Promise(function (comp, err, prog) {
            WinJS.xhr({ url: "/js/cache/" + fileName }).done(
                function (contents) {
                    var providerData = JSON.parse(contents.responseText);
                    comp(providerData);
                }
              , function (error) {
                  console.error("Error fetching from cache?", error);
                  err(error);
              })
        });
    },
    fetchFromZipApp: function (currentList, globalList) {
        return new WinJS.Promise(function (comp, err, prog) {

            if (window.AppData == null) {
                WinJS.xhr({
                    url: "/js/appData.js", responseType: 'json'
                })
    .done(function complete(result) {
        var json = JSON.parse(result.response);
        WinJS.Namespace.define("AppData", {
            ApiKey: json.ApiKey,
            AppId: json.AppId,
        });
        fetch();
    })
            }
            else {
                fetch()
            }

            function fetch() {
                var key = AppData.ApiKey;
                var dataToPost = "ZipAuth key=\"" + key + "\", version=\"1\"";
                var appId = AppData.AppId;
                var listId = currentList.id;
                var apiUrl = "http://api.zipapp.co.uk/api/Application/" + appId + "/List/" + listId
                WinJS.xhr({ url: apiUrl, headers: { Authorization: dataToPost } }).done(
                    function (contents) {
                        var providerData = JSON.parse(contents.responseText);
                        comp(providerData.$values);
                    }
                  , function (error) {
                      var providerData = []; //{ "title": "Connection Failure or service failure", "key": "4", "dataProvider": null, "subtitle": null, "backgroundImage": "/images/", "content": "dsadd", "type": "articlefeature", "param1": null, "param2": null, "description": null, "url": null, "id": null, "providerid": null }]
                      comp(providerData);
                      console.error("Error fetching from cache?", error);
                  })
            };
        })

    },
    convertTwitterJson: function convertTwitterJson(twitterJson, group) {
        var tweets = [];
        try {
            var cleanUp = twitterJson.responseText.replace(/\\'/g, "'");
            var providerData = JSON.parse(cleanUp);
            tweets.refresh_url = providerData.refresh_url;
            for (var i = 0; i < providerData.results.length; i++) {
                var tweet = {};
                tweet.group = group;
                tweet.type = "tweet";
                tweet.title = providerData.results[i].from_user;
                tweet.subtitle = providerData.results[i].from_user_name;
                tweet.description = providerData.results[i].text;
                tweet.content = providerData.results[i].text;
                tweet.url = "https://twitter.com/" + providerData.results[i].from_user + "/status/" + providerData.results[i].id_str;
                // change _normal to _bigger to get a larger image from twitter
                tweet.backgroundImage = providerData.results[i].profile_image_url.replace('_normal', '_bigger');
                tweets.push(tweet);
            }
        }
        catch (e) {
            //catch and just suppress error
            console.error("Issues Parsing the JSON", e);
        }
        return tweets;
    },
    saveFile: function saveFile(fileName, content) {
        this.localFolder.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.replaceExisting)
           .done(function (sampleFile) {
               return Windows.Storage.FileIO.writeTextAsync(sampleFile, content);
           }, (function (error) {
               console.error("Error in the saveFile", error);
           }));
    }
}