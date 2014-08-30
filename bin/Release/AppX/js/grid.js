(function () {
    var ZipGrid = {
        layout: function () {
            return {
                enableCellSpanning: true,
                cellWidth: 340,
                cellHeight: 20,
            };
        },
        notNull: function (string) {
            if (string != null) {
                return string;
            }

            return "";
            // For Debug
            return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean malesuada nisi non tellus euismod id ultricies lectus hendrerit. Ut congue consequat lectus, in tempor risus auctor sit amet. Donec et lacus non lacus ultrices egestas in vel est. Maecenas eu augue neque, vitae rutrum lacus. Fusce a sem est. Sed consectetur hendrerit ipsum ut venenatis. Donec a nisi nunc, id posuere ante. Sed quis orci vel ante volutpat pretium sed et odio. Nunc in elit elit, at fringilla ipsum. Nulla tincidunt nunc et lorem laoreet imperdiet. Quisque turpis neque, semper eget suscipit et, tincidunt ac purus. Curabitur nisi ipsum, accumsan quis tincidunt a, vestibulum iaculis massa. "

             + "Ut convallis imperdiet tellus a viverra. Donec quis velit felis, vel tristique neque. Cras felis lectus, ornare at blandit ac, dictum vitae tortor. Proin feugiat luctus mauris, eu sollicitudin neque dapibus vitae. Maecenas a quam magna. In hac habitasse platea dictumst. Curabitur euismod ultricies tincidunt. Etiam nec orci nisl, ut suscipit mauris. Donec commodo, sapien eget porttitor auctor, turpis nisi lacinia sem, et pellentesque elit lectus vel quam. Vestibulum purus justo, imperdiet sit amet ultrices sit amet, ultrices ut lacus. Nulla a sapien eu lacus facilisis pellentesque in ut magna. Sed sagittis congue gravida. Cras cursus, enim at varius sodales, massa lacus aliquet felis, eu lacinia velit ipsum et ligula. "

            + "Donec venenatis erat ac sapien rutrum id pellentesque mauris sodales. Aliquam erat volutpat. Quisque in nulla mauris, id sollicitudin velit. Nam eleifend tortor ut risus viverra non vulputate arcu eleifend. Suspendisse ante lacus, aliquam vitae adipiscing in, accumsan sit amet quam. Nam ac metus ac justo sodales porta ac quis augue. Curabitur ornare semper dolor quis luctus. Vivamus in fermentum erat. "

            + "Nam odio justo, hendrerit sed rhoncus ut, iaculis id orci. Praesent sit amet lacus nisl, eget viverra sapien. Nulla in sem eros, vitae condimentum erat. Vivamus aliquam tincidunt vulputate. Suspendisse placerat aliquet enim, in vestibulum sapien accumsan vel. Aenean quis ipsum nibh. Nullam sagittis scelerisque dui, id scelerisque lacus facilisis at. Nam sed sollicitudin lacus. Sed ut odio vitae lectus commodo commodo nec a arcu. Duis rutrum erat sed quam sollicitudin ut accumsan massa ultricies. Phasellus eget facilisis nisi. Proin imperdiet diam nec risus pulvinar cursus placerat urna varius. Praesent at diam magna, a suscipit nisi. Nullam dui nunc, consequat sed tristique quis, laoreet vitae lacus. "

            + "Integer ac urna orci, ut convallis augue. Nulla purus tellus, luctus ac mollis a, tincidunt eget ipsum. In sagittis sodales mauris, eu tempor purus faucibus quis. Donec porttitor euismod turpis, tincidunt congue orci sollicitudin eu. Maecenas vulputate placerat accumsan. Donec ornare posuere purus, sed convallis ligula ultricies cursus. Aenean semper urna non dolor laoreet in euismod elit vehicula. Etiam urna ante, posuere quis cursus a, ultricies facilisis ligula. ";
        },
        navigate: function (object) {
            switch (object.group.dataProvider) {
                case "youtube":
                    return GlobalNav.navigate('/pages/videoDetail/videoDetail.html', { item: object })
                    break
                case "twitter":
                    return GlobalNav.navigate('/pages/twitterDetail/twitterDetail.html', { item: object })
                    break
                default:
                    return GlobalNav.navigate('/pages/itemDetail/itemDetail.html', { item: object })
            }
        },
        validImage: function (imageName) {
            if (imageName.substr(0, 4) == "http"
                || imageName.substr(imageName.length - 4, 4) == ".png"
                || imageName.substr(imageName.length - 4, 4) == ".jpg"
                || imageName.substr(imageName.length - 4, 4) == ".gif") {
                //It's probably  a valid image
                return imageName;
            }
            return "/images/noimage.png"
        },
        getTemplateNew: function (templateName) {
            var t = document.createElement("div");
            t.className = templateName;
            var itemOverlay = document.createElement("div");
            itemOverlay.className = "item-overlay"

            var itemImageHolder = document.createElement("div");
            itemImageHolder.className = "item-image-holder";

            var itemImage = document.createElement("img");
            itemImage.className = "item-image";

            var itemTitle = document.createElement("h4");
            itemTitle.classList.add("item-title");
            itemTitle.innerText = "GRRRRR";
            var itemSubtitle = document.createElement("h5");
            itemSubtitle.classList.add("item-subtitle");

            var itemDescription = document.createElement("div");
            itemDescription.classList.add("item-description");

            var itemDate = document.createElement("div");
            itemDate.className = "item-date";

            itemDate.innerHTML = "12 Feb <span class=\"item-date-time\">18:55</span>";

            var likesNo = document.createElement("div");
            likesNo.className = "item-likesno";

            var itemLikesNo = document.createElement("div");
            itemLikesNo.className = "item-likes-no";
            var itemCommentsNo = document.createElement("div");
            itemCommentsNo.className = "item-comments-no";

            t.appendChild(itemOverlay);
            t.appendChild(itemTitle)
            t.appendChild(itemSubtitle);
            t.appendChild(itemImageHolder);
            itemImageHolder.appendChild(itemImage);
            t.appendChild(itemDescription);
            t.appendChild(itemDate);
            t.appendChild(itemLikesNo);
            t.appendChild(itemCommentsNo);

            t.itemTitle = itemTitle;
            t.itemSubtitle = itemSubtitle;
            t.itemImage = itemImage;
            t.itemDescription = itemDescription;
            t.itemCommentsNo = itemCommentsNo;
            t.itemLikesNo = itemLikesNo;
            return t;

        },
        getClass: function () {
            return ZipGrid.getTemplateNew("default");
        },
        templateNew: function (itemPromise) {
            return itemPromise.then(function (currentItem) {

                return ZipGrid.createGridItem(currentItem.data)
            }
                );
        },
        imageError: function (sender){
            sender.srcElement.classList.add("no-image");
            sender.srcElement.src = "/images/noimage.png";
            return true
        },
        imageLoad: function (sender) {
            return ZipGrid.centerImage(sender.srcElement);
        },
        createGridItem: function (data) {
            var result;
            result = ZipGrid.getClass();
            result.itemSubtitle.innerHTML = toStaticHTML(ZipGrid.notNull(data.subtitle));
            result.itemDescription.innerHTML = toStaticHTML(ZipGrid.notNull(data.description));
            result.itemTitle.innerHTML = toStaticHTML(ZipGrid.notNull(data.title));
            result.itemLikesNo.innerHTML = toStaticHTML(ZipGrid.notNull(data.likesno));
            result.itemCommentsNo.innerHTML = toStaticHTML(ZipGrid.notNull(data.commentsno));
            var localImage = ZipGrid.validImage(data.backgroundImage);
            result.itemImage.src = data.backgroundImage;
            result.itemImage.onerror = this.imageError;
            result.itemImage.onload = this.imageLoad;
            return result;
        },
        template: function (itemPromise) {
            return itemPromise.then(function (currentItem) {
                var content;
                var result;
                var theSwitch = currentItem.data.type.toLowerCase();
                if (currentItem.data.type == null || Windows.UI.ViewManagement.ApplicationView.value == Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                    switch (theSwitch) {
                        case "tweet":
                            {
                                var result = ZipGrid.createGridItem(currentItem.data);
                                result.classList.add("twitter-340x170");
                                break;
                            }
                        default:
                            {
                                var result = ZipGrid.createGridItem(currentItem.data);
                                result.classList.add("article-340x240");
                            }
                    }
                }
                else {
                    switch (theSwitch) {
                        case "tweet":
                            {
                                var result = ZipGrid.createGridItem(currentItem.data);
                                result.classList.add("twitter-340x170");
                                break;
                            }
                        default:
                            {
                                var result = ZipGrid.createGridItem(currentItem.data);
                                result.classList.add("article-340x240");
                            }
                    }
                }


                return result;
            });
        },
        centerImage: function (img) {
            var containerWidth = img.width;
            var containerHeight = img.height;
            var naturalWidth = img.naturalWidth;
            var naturalHeight = img.naturalHeight;

            var wr = (containerWidth - naturalWidth)
            var wpercent = (wr / naturalWidth);

            var hr = (containerHeight - naturalHeight)
            var hpercent = (hr / naturalHeight);

            var percentIncrease = Math.max(hpercent, wpercent);

            var newWidth = naturalWidth + (naturalWidth * percentIncrease);
            var newHeight = naturalHeight + (naturalHeight * percentIncrease);

            var tmiddleOfNewImage = newHeight / 2;
            var lHmiddleOfNewImage = newWidth / 2;

            var t = Math.round(tmiddleOfNewImage - (containerHeight / 2));
            var b = Math.round(t + containerHeight);
            var l = Math.round(lHmiddleOfNewImage - (containerWidth / 2));
            var r = Math.round(l + containerWidth);

            var top = t;
            var right = r;
            var bottom = b;
            var left = l;
            img.width = newWidth;
            img.height = newHeight;
            img.style.width = newWidth + "px";
            img.style.height = newHeight + "px";
            img.style.position = "absolute";

            img.style.clip = "rect(" + top + "px " + right + "px " + bottom + "px " + left + "px)";
            img.style.left = -Math.abs(l) + "px";
            img.style.top = -Math.abs(t) + "px";
            img.classList.add("loaded-image");
        },
        createHub: createHub,
        destroyHub: function () {
            hubControl.childNodes = null;            
        }
    }

    function createHub() {
        return {
            dataToBind: null,
            groupToKey: [],
            BindGrid: function () {
                this.resetGroup();

                if (hubControl.hasChildNodes()) {
                    while (hubControl.childNodes.length >= 1) {
                        hubControl.removeChild(hubControl.firstChild);
                    }
                }

                for (var i = 0; i < this.dataToBind._list._lastNotifyLength; i++) {
                    var item = this.dataToBind.itemFromIndex(i)._value;
                    var groupd = item.data.group;
                    var type = this.getType(groupd);
                    this.createGroup(groupd, type);
                    this.createItem(item, groupd, type);
                }
            },
            resetGroup: function () {
                this.groupToKey = [];
                this.groupToKey.hasGroup = function (groupId) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i].id == groupId) {
                            return true;
                        }
                    }
                    return false;
                }
                this.groupToKey.getGroupHolder = function (groupId) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i].id == groupId) {
                            return this[i].holder;
                        }
                    }
                    return null;
                }
                this.groupToKey.add = function (id, ref, holder) {
                    this.push({ id: id, ref: ref, holder: holder });
                }
            },
            getType: function (group) {
                if (group.type != null) {
                    return group.type;
                }

                switch (group.dataProvider) {
                    case "youtube":
                        return "video";
                    case "rss":
                        return "article";
                    case "twitter":
                        return "twitter";
                    case "static":
                        return "article";
                    default:
                        return "article";
                }
            },
            createGroup: function (groupd, type) {
                if (this.groupToKey.hasGroup(groupd.key)) {
                    return;
                }

                var group = document.createElement("div");
                group.className = "item-container";
                group.id = groupd.key;

                //<div class="item-container-header">
                //<h2>Article <span aria-hidden="true" class="icon-article"></span></h2>
                //</div>
                var header = document.createElement("div");
                header.className = "item-container-header";
                var title = document.createElement("h2");
                title.innerText = groupd.title + " ";
                var icon = document.createElement("span");
                icon.setAttribute("aria-hidden", "true");

                icon.className = "icon-" + type; //Based on Provider
                title.appendChild(icon);
                header.appendChild(title);
                group.appendChild(header);

                //<div class="article-container">
                var itemHolder = document.createElement("div");
                itemHolder.className = type + "-container"; //Based on Provider
                group.appendChild(itemHolder);
                this.groupToKey.add(group.id, group, itemHolder);
                hubControl.appendChild(group);

                header.onmspointerdown = this.pointerDown;
                header.onclick = function (html) {
                    WinJS.Navigation.navigate("/pages/groupDetail/groupDetail.html", { groupKey: groupd.key });
                    WinJS.UI.Animation.pointerUp(group);
                };
                header.onmspointerout = this.pointerUp;

                return;
            },
            pointerDown: function(sender){
                WinJS.UI.Animation.pointerDown(sender.currentTarget)
            },
            pointerUp: function (sender) {
                WinJS.UI.Animation.pointerUp(sender.currentTarget);
            },
            createItem: function (item, groupd, type) {
                var group = this.groupToKey.getGroupHolder(groupd.key);
                if (group == null) {
                    return;
                }

                // Stop rendering if the Hub contains more than 4 items
                if (type != "twitter" && group.childNodes.length > 3)
                {
                    return;
                }
                if (group.childNodes.length > 7) {
                    return;
                }
                
                var newItem = document.createElement("div")
                newItem.className = "container-item";
                if (type == "twitter") {
                    var bigTweet = item.data.content && item.data.content.length > 80;
                    if (bigTweet) {
                        newItem.classList.add("twitter");
                    } else {
                        newItem.classList.add("twitter-small");
                    }
                }

                newItem.onmspointerdown = this.pointerDown;

                newItem.onclick = function (html) {
                    ZipGrid.navigate(item.data);
                    WinJS.UI.Animation.pointerUp(newItem);
                };
                newItem.onmspointerout = this.pointerUp;

                group.appendChild(newItem)

                var result = ZipGrid.createGridItem(item.data)
                result.classList.add(type + "-" + newItem.clientWidth + "x" + newItem.clientHeight);
                newItem.appendChild(result);

            }
        };
    }

    window.ZipGrid = ZipGrid;
})();
