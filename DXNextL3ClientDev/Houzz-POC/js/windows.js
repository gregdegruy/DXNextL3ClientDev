(function () {
    'use strict';

    if (window.Windows) {

        var default_options = {
            webView: false,
            baseUrl: "",
            JumpList: {
                enabled: false,
                items: [
                    {
                        name: "",
                        url: "",
                        description: "",
                        logo: "",
                    }
                ],
                navigate: function (args) {
                    window.location.href = args;
                }
            },
            LiveTiles: {
                enabled: false,
                periodicUpdate: Windows.UI.Notifications.PeriodicUpdateRecurrence.halfHour,
                enableQueue: false,
                tileUrl: ""
            },
            Page: {
                customCSS: "",
                customJS: ""
            },
            BackButton: {
                enabled: false,
                homeUrl: ""
            },
            TitleBar: {
                enabled: false,
                backgroundColor: { a: 255, r: 58, g: 74, b: 85 },
                buttonBackgroundColor: { a: 255, r: 58, g: 74, b: 85 },
                foregroundColor: Windows.UI.Colors.white,
                buttonForegroundColor: Windows.UI.Colors.white,
            },
            Inking: {
                enabled: false,
                context: "2d",
                lineWidth: 5,
                strokeStyle: "Red",
                lineCap: "round",
                lineJoin: "round",
                width: '1000px',
                height: '500px'

            },
            Cortana: {
                enabled: false,
                search: "",
                phraseList: [
                    {
                        name: "",
                        action: function () {
                        }
                    }
                ],
                commandFile: "",
                commandSet: "",
                commandPhraseList: ""
            },
            Notifications: {
                "enabled": false,
                "toastFile": "",
            },
            SecondaryTile: {
                enabled: false,
                tileActivationArguments: "",
                tileLogoUri: "",
                tileForegroundText: Windows.UI.StartScreen.ForegroundText.light,
                showNameOnTile: true
            },
        };

        var FWA = window.FWA = new function () {

            if (window.FWA) {
                return window.FWA;
            }

            // Private   
            var defaultOptions = Object.assign({}, default_options, fwa_options || {});
            var that = this;

            // Public instance and constructors

            this.baseUrl = defaultOptions.baseUrl;

            /***************************************************************************
            * BackButton
            * 
            * @param {}
            ****************************************************************************/
            this.BackButton = new function (options) {
                this.options = Object.assign({}, defaultOptions.BackButton, (options || {}));
                if (!this.options.enabled)
                    return;

                var handler;

                if (!this.options.handler) {
                    if (defaultOptions.webView) {
                        handler = function (args) {
                            args.handled = true;
                            if (wv.canGoBack)  // TO-DO - change how we handle reference to webview
                                wv.goBack();
                        }
                    } else {
                        handler = function (args) {
                            args.handled = true;
                            history.back();
                        }
                    }
                } else {
                    handler = this.options.handler;
                }

                var _systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                _systemNavigationManager.addEventListener("backrequested", handler.bind(this));
            };

            this.BackButton.__proto__.show = function () {
                var _systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                _systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
            };

            this.BackButton.__proto__.hide = function () {
                var _systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                _systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
            };

            this.BackButton.__proto__.toggle = function () {
                if (defaultOptions.webView) {
                    if (wv.src.indexOf(this.options.homeUrl) === -1) {
                        that.BackButton.show();
                    } else {
                        that.BackButton.hide();
                    }
                } else {
                    if (window.location.href.indexOf(this.options.homeUrl) === -1) {
                        that.BackButton.show();
                    } else {
                        that.BackButton.hide();
                    }
                }
            };



            /***************************************************************************
            * Cortana
            * 
            * @param {}
            ****************************************************************************/
            this.Cortana = new function (options) {
                var that = this;
                this.options = Object.assign({}, defaultOptions.Cortana, (options || {}));
            };

            this.Cortana.__proto__.registerCommands = function () {
                var phraseList = [];

                if (!this.options.enabled)
                    return;

                // Add 
                that.Cortana.options.phraseList.forEach(function (item) {
                    phraseList.push(item.name);
                });

                var uri = new Windows.Foundation.Uri(that.Cortana.options.commandFile);
                var vcdManager = Windows.ApplicationModel.VoiceCommands.VoiceCommandDefinitionManager;
                var storageFile = Windows.Storage.StorageFile.getFileFromApplicationUriAsync(uri).then(
                //var storageFile = Windows.Storage.StorageFile.createStreamedFileFromUriAsync("vcd.xml", uri, null).then(
                    function (vcd) {
                        vcdManager.installCommandDefinitionsFromStorageFileAsync(vcd).then(
                            function () {
                                var installedCommandSets = vcdManager.installedCommandDefinitions;
                                if (installedCommandSets.hasKey(that.Cortana.options.commandSet)) {
                                    var commandSet = installedCommandSets.lookup(that.Cortana.options.commandSet);
                                    commandSet.setPhraseListAsync(that.Cortana.options.commandPhraseList, phraseList);
                                }
                            });
                    });
            }

            this.Cortana.__proto__.handleVoiceCommand = function (input) {
                // Get the name of the voice command. 
                // For this example, we declare only one command.
                var command = input.rulePath[0];
                // Get the actual text spoken.
                var textSpoken = input.text.toLowerCase(); // !== undefined ? input.text : "EXCEPTION";
                //var details = input.semanticInterpretation.properties.section[0];

                var searchTerm = "";

                if (command == "search") {
                    var searchUrl = that.Cortana.options.search;

                    if (textSpoken.indexOf("...") > -1) {
                        searchTerm = input.semanticInterpretation.properties.searchTerm['0'];
                        searchUrl = searchUrl.replace("{searchTerm}", searchTerm);
                    } else {
                        searchTerm = textSpoken;
                        searchUrl = searchUrl.replace("{searchTerm}", searchTerm.substr(searchTerm.indexOf(" ") + 1));
                    }
                    window.location.href = searchUrl;
                } else {
                    for (var i = 0; i < that.Cortana.options.phraseList.length; i++) {
                        if (textSpoken.indexOf(that.Cortana.options.phraseList[i].name) > -1) {
                            if (that.Cortana.options.phraseList[i].action && that.Cortana.options.phraseList[i] != "")
                                that.Cortana.options.phraseList[i].action();
                            else {
                                if (defaultOptions.webView) {
                                    wv.navigate(that.Cortana.options.phraseList[i].url);
                                } else {
                                    location.href = that.Cortana.options.phraseList[i].url;
                                }
                            }

                            break;
                        }
                    }
                }
            };



            /***************************************************************************
            * JumpList
            * 
            * @param {}
            ****************************************************************************/
            this.JumpList = new function (options) {
                this.options = Object.assign({}, defaultOptions.JumpList, (options || {}));
                var that = this;

                if (!that.options.enabled)
                    return;

                var jumpList = Windows.UI.StartScreen.JumpList;
                jumpList.loadCurrentAsync().done(function (jumpList) {
                    jumpList.systemGroupKind = Windows.UI.StartScreen.JumpListSystemGroupKind.none;
                    jumpList.items.clear();

                    that.options.items.forEach(function (i) {
                        // that.addItem(jumpList, i.url, i.name, i.logo, i.description);
                    });

                    jumpList.saveAsync().done(function () {
                        //Example of how to delete a jump list item
                        //FWA.JumpList.removeItem(jumpList, "Microsoft");
                        //jumpList.saveAsync();
                    });
                });
            }

            this.JumpList.__proto__.addItem = function (jumpList, url, name, logo, description) {
                if (!jumpList) {
                    jumpList = Windows.UI.StartScreen.JumpList;
                    jumpList.loadCurrentAsync().done(function (jumpList) {
                        jumpList.systemGroupKind = Windows.UI.StartScreen.JumpListSystemGroupKind.none;
                        var item = Windows.UI.StartScreen.JumpListItem.createWithArguments(url, name);
                        if (logo != "")
                            item.logo = new Windows.Foundation.Uri(logo);
                        item.description = description;
                        jumpList.items.append(item);
                    })
                } else {
                    var item = Windows.UI.StartScreen.JumpListItem.createWithArguments(url, name);
                    if (logo != "")
                        item.logo = new Windows.Foundation.Uri(logo);
                    item.description = description;
                    jumpList.items.append(item);
                }
            };

            this.JumpList.__proto__.removeItem = function (jumpList, name) {
                if (!jumpList) {
                    jumpList = Windows.UI.StartScreen.JumpList;
                    jumpList.loadCurrentAsync().done(function (jumpList) {
                        jumpList.systemGroupKind = Windows.UI.StartScreen.JumpListSystemGroupKind.none;
                        _removeItem(jumpList, name);
                    });
                } else {
                    _removeItem(jumpList, name);
                }
            };

            this.JumpList.__proto__.navigate = function (url) {
                if (url != "") {
                    if (defaultOptions.webView) {
                        wv.navigate(url);
                    } else {
                        location.href = url;
                    }

                }
            };

            // private method to remove jumplist item
            var _removeItem = function (jumpList, name) {
                jumpList.items.forEach(function (i) {
                    if (i.displayName === name) {
                        var itemPos = jumpList.items.indexOf(i);
                        jumpList.items.removeAt(itemPos.index);
                    }
                });
            };



            /***************************************************************************
            * Page
            * 
            * @param {}
            ****************************************************************************/
            this.Page = new function (options) {
                var that = this;
                this.options = Object.assign({}, defaultOptions.Page, (options || {}));

                //window.addEventListener('load', function () {
                //    that.load();
                //});
            };

            this.Page.__proto__.injectCSS = function (options) {
                var _options = Object.assign({}, this.options, (options || {}));

                if (!_options.customCSS || _options.customCSS === "")
                    return;

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        _injectCSS(xhttp.responseText);
                    }
                };
                xhttp.open("GET", _options.customCSS, true);
                xhttp.send();
            };


            this.Page.__proto__.injectJS = function (options) {
                var _options = Object.assign({}, this.options, (options || {}));

                if (!_options.customCSS || _options.customJS === "")
                    return;

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        _injectJS(xhttp.responseText);
                    }
                };
                xhttp.open("GET", _options.customJS, true);
                xhttp.send();
            };

            this.Page.__proto__.load = function () {
                that.Page.injectCSS();
                that.Page.injectJS();
                that.BackButton.toggle();
            };

            var _injectCSS = function (content) {
                if (defaultOptions.webView) {
                    var exec, scriptString;
                    scriptString = "var cssFileString = '" + content.replace(/\r\n/gm, " ") + "';" +
                    "var cssFileStyleEl = document.createElement('style');" +
                    "document.body.appendChild(cssFileStyleEl);" +
                    "cssFileStyleEl.innerHTML = cssFileString;";

                    scriptString = scriptString.replace(/\n/gm, " ")
                    exec = wv.invokeScriptAsync("eval", scriptString);
                    exec.start();
                } else {
                    var header = document.getElementsByTagName("body")[0];
                    if (!header) {
                        header = document.getElementsByTagName("head")[0];
                        if (!header)
                            return;
                    }
                    var styleEl = document.createElement("style");
                    styleEl.innerHTML = content;
                    header.appendChild(styleEl);

                }
            };

            var _injectJS = function (content) {
                if (defaultOptions.webView) {
                    var exec, scriptString;
                    scriptString = "var scriptFileString = '" + content.replace(/\r\n/gm, " ") + "';" +
                        "var scriptFileStyleEl = document.createElement('script');" +
                        "if (document.body) {" +
                            "document.body.appendChild(scriptFileStyleEl);" +
                            "scriptFileStyleEl.innerHTML = scriptFileString;" +
                        "}";

                    scriptString = scriptString.replace(/\n/gm, " ");

                    exec = wv.invokeScriptAsync("eval", scriptString);
                    exec.start();
                } else {
                    var header = document.getElementsByTagName("body")[0];
                    if (!header) {
                        header = document.getElementsByTagName("head")[0];
                        if (!header)
                            return;
                    }
                    var styleEl = document.createElement("script");
                    styleEl.innerHTML = xhttp.responseText;
                    header.appendChild(styleEl);
                }
            };



            /***************************************************************************
            * Tile Pinning
            * 
            * @param {}
            ****************************************************************************/
            this.SecondaryTile = new function (options) {
                this.options = Object.assign({}, defaultOptions.SecondaryTile, (options || {}));
            };

            this.SecondaryTile.__proto__.pin = function (options) {
                this.options = Object.assign({}, defaultOptions.SecondaryTile, (options || {}));

                // TO-DO: Add this to the 
                var tileId = "SecondaryTileID";
                var tileDisplayName = "Secondary Tile Display Name";

                var tile = new Windows.UI.StartScreen.SecondaryTile(
                        tileId,
                        tileDisplayName,
                        this.options.tileActivationArguments,
                        new Windows.Foundation.Uri(this.options.tileLogoUri),
                        Windows.UI.StartScreen.TileSize.square150x150);

                tile.visualElements.foregroundText = this.options.tileForegroundText;
                tile.visualElements.showNameOnSquare150x150Logo = this.options.showNameOnTile;

                tile.requestCreateAsync().then(function (isCreated) {
                    if (isCreated) {
                        console.log("Tile pinned.");
                    } else {
                        console.log("Failed to pin tile.");
                    }
                });
            };

            this.SecondaryTile.__proto__.update = function (options) {
                //TODO:  Allow application to send local updates.
            };



            /***************************************************************************
            * LiveTiles
            * 
            * @param {}
            ****************************************************************************/
            this.LiveTiles = new function (options) {
                this.options = Object.assign({}, defaultOptions.LiveTiles, (options || {}));

                //if (!this.options.enabled)
                //    return;

                //if (setupHandler)
                //    setupHandler(this.options);
                //else
                //_setupLiveTile(this.options);
            };

            this.LiveTiles.__proto__.enableLiveTileByFeed = function (feedUrl, enableQueue, updateInterval) {
                //var _setupLiveTile = function (options) {
                //if (!this.options.enabled)
                //    return;


                // Enable Notifications Queue - The tile will cycle through the multple tile notifications
                var notifications = Windows.UI.Notifications;
                notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueue(enableQueue);

                _setupTileFeed(feedUrl, updateInterval);
            };

            var _setupTileFeed = function (feedUrl, updateInterval) {
                var urisToPoll = [];

                if (feedUrl.splice) {
                    // we already have an array of feeds, use it!
                    urisToPoll = feedUrl;
                } else {
                    for (var n = 0; n < 5; ++n) {
                        var url = 'http://notifications.buildmypinnedsite.com/?feed=' + encodeURIComponent(feedUrl) + '&id=' + n.toString();
                        try {
                            urisToPoll.push(new Windows.Foundation.Uri(url));
                        } catch (err) {
                            // Bad Url
                        }
                    }
                }

                try {
                    var updater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
                    updater.clear();
                    updater.stopPeriodicUpdate();
                    updater.startPeriodicUpdateBatch(urisToPoll, updateInterval);
                } catch (e) {
                    // Tile APIs are flaky.. they sometimes fail for no readily apparent reason
                    // but that's no reason to crash and risk a 1-star
                }
            };



            /***************************************************************************
            * Notifications
            * 
            * @param {}
            ****************************************************************************/
            this.Notifications = new function (options) {
                this.options = Object.assign({}, defaultOptions.Notifications, (options || {}));
            };

            this.Notifications.__proto__.displayLocalToast = function (options) {
                this.options = Object.assign({}, defaultOptions.Notifications, (options || {}));

                if (!this.options.enabled)
                    return;

                var notificationManager = Windows.UI.Notifications.ToastNotificationManager;
                var uri = new Windows.Foundation.Uri(this.options.toastFile);

                if (this.options.toastFile.indexOf("ms-appx:") > -1) {
                    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(uri).then(function (file) {
                        Windows.Data.Xml.Dom.XmlDocument.loadFromFileAsync(file).done(function (toastDOM) {
                            var toast = new Windows.UI.Notifications.ToastNotification(toastDOM);
                            notificationManager.createToastNotifier().show(toast);
                        });
                    });
                } else {
                    Windows.Data.Xml.Dom.XmlDocument.loadFromUriAsync(uri).done(function (toastDOM) {
                        var toast = new Windows.UI.Notifications.ToastNotification(toastDOM);
                        notificationManager.createToastNotifier().show(toast);
                    });
                }
            };

            this.Notifications.__proto__.hideNotification = function (options) {
                console.log('hiding notification');
            }


            /***************************************************************************
            * TitleBar
            * 
            * @param {}
            ****************************************************************************/
            this.TitleBar = new function (options) {
                this.options = Object.assign({}, defaultOptions.TitleBar, (options || {}));


                if (!this.options.enabled)
                    return;

                var titleBar = Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar;
                titleBar.backgroundColor = this.options.backgroundColor;
                titleBar.buttonBackgroundColor = this.options.buttonBackgroundColor;
                titleBar.foregroundColor = this.options.foregroundColor;
                titleBar.buttonForegroundColor = this.options.buttonForegroundColor;
            };


            /***************************************************************************
            * Inking
            * 
            * @param {}
            ****************************************************************************/
            this.Inking = new function (options) {
                this.options = Object.assign({}, defaultOptions.Inking, (options || {}));
                var that = this;

                if (!this.options.enabled)
                    return;

                window.addEventListener('load', function () {
                    // WAT.options.inkCanvas.width = WAT.options.webView.offsetWidth;
                    // WAT.options.inkCanvas.height = WAT.options.webView.offsetHeight;
                    inkManager = new Windows.UI.Input.Inking.InkManager();
                    var drawingAttributes = new Windows.UI.Input.Inking.InkDrawingAttributes();
                    drawingAttributes.fitToCurve = true;
                    inkManager.setDefaultDrawingAttributes(drawingAttributes);
                    inkManager.mode = Windows.UI.Input.Inking.InkManipulationMode.inking;

                    inkCanvas = document.getElementById("ink");
                    if (inkCanvas) {
                        inkCanvas.setAttribute("width", that.options.width);
                        inkCanvas.setAttribute("height", that.options.height);

                        _setStrokeStyle(that.options);

                        inkCanvas.addEventListener("pointerdown", _handlePointerDown, false);
                        inkCanvas.addEventListener("pointerup", _handlePointerUp, false);
                        inkCanvas.addEventListener("pointermove", _handlePointerMove, false);
                        inkCanvas.addEventListener("pointerout", _handlePointerOut, false);
                    };
                });
            };

            //inking
            var _inkContext, inkManager, inkCanvas, penID = -1;
            var _setStrokeStyle = function (options) {
                _inkContext = inkCanvas.getContext(options.context);
                _inkContext.lineWidth = options.lineWidth;
                _inkContext.strokeStyle = options.strokeStyle;
                _inkContext.lineCap = options.lineCap;
                _inkContext.lineJoin = options.lineJoin;
            };
            var _renderAllStrokes = function () {
                _inkContext.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
                inkManager.getStrokes().forEach(function (stroke) {
                    var att = stroke.drawingAttributes;
                    var strokeSize = att.size;
                    var ctx = _inkContext;
                    _renderStroke(stroke, ctx);
                });
            };
            var _renderStroke = function (stroke, ctx) {
                ctx.save();
                ctx.beginPath();

                var first = true;
                stroke.getRenderingSegments().forEach(function (segment) {
                    if (first) {
                        ctx.moveTo(segment.position.x, segment.position.y);
                        first = false;
                    } else {
                        ctx.bezierCurveTo(segment.bezierControlPoint1.x, segment.bezierControlPoint1.y,
                                segment.bezierControlPoint2.x, segment.bezierControlPoint2.y,
                                segment.position.x, segment.position.y);
                    }
                });

                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            };
            var _toColorString = function (color) {
                return "#" + byteHex(color.r) + byteHex(color.g) + byteHex(color.b);
            };
            var _byteHex = function (num) {
                var hex = num.toString(16);
                if (hex.length === 1) {
                    hex = "0" + hex;
                }
                return hex;
            };
            var _handlePointerDown = function (evt) {
                if ((evt.pointerType === "pen") || (evt.pointerType === "touch") || ((evt.pointerType === "mouse") && (evt.button === 0))) {
                    // Anchor and clear any current selection.
                    var pt = { x: 0.0, y: 0.0 };
                    inkManager.selectWithLine(pt, pt);

                    pt = evt.currentPoint;

                    _inkContext.beginPath();
                    _inkContext.moveTo(pt.rawPosition.x, pt.rawPosition.y);

                    inkManager.processPointerDown(pt);
                    penID = evt.pointerId;
                }
            };
            var _handlePointerMove = function (evt) {
                if (evt.pointerId === penID) {
                    var pt = evt.currentPoint;
                    _inkContext.lineTo(pt.rawPosition.x, pt.rawPosition.y);
                    _inkContext.stroke();
                    // Get all the points we missed and feed them to inkManager.
                    // The array pts has the oldest point in position length-1; the most recent point is in position 0.
                    // Actually, the point in position 0 is the same as the point in pt above (returned by evt.currentPoint).
                    var pts = evt.intermediatePoints;
                    for (var i = pts.length - 1; i >= 0 ; i--) {
                        inkManager.processPointerUpdate(pts[i]);
                    }
                }
            };
            var _handlePointerUp = function (evt) {
                if (evt.pointerId === penID) {
                    penID = -1;
                    var pt = evt.currentPoint;
                    _inkContext.lineTo(pt.rawPosition.x, pt.rawPosition.y);
                    _inkContext.stroke();
                    _inkContext.closePath();

                    var rect = inkManager.processPointerUp(pt);

                    _renderAllStrokes();
                }
            };
            var _handlePointerOut = function (evt) {
                // We treat the event of the pen leaving the canvas as the same as the pen lifting;
                // it completes the stroke.
                if (evt.pointerId === penID) {
                    var pt = evt.currentPoint;
                    _inkContext.lineTo(pt.rawPosition.x, pt.rawPosition.y);
                    _inkContext.stroke();
                    _inkContext.closePath();
                    inkManager.processPointerUp(pt);
                    penID = -1;
                    _renderAllStrokes();
                }
            };


            /***************************************************************************
            * 
            * startup
            * 
            ****************************************************************************/

            this.__proto__.startup = function (options) {
                if (defaultOptions.webView) {
                    //window.addEventListener("load", function () {
                    wv = document.getElementById("webview");
                    if (wv) {
                        wv.addEventListener("MSWebViewNavigationStarting", webViewNavStart);
                        wv.addEventListener("MSWebViewDOMContentLoaded", webViewLoaded);
                        wv.addEventListener("MSWebViewNavigationCompleted", webViewNavComplete);
                        wv.addEventListener("MSWebViewScriptNotify", webViewScriptNotify);
                    }
                    //});
                } else {
                    //window.addEventListener("load", that.Page.load);
                    that.Page.load();
                }
            };

            this.startup();
            return this;
        }



        /***************************************************************************
        *
        *  Activation
        * 
        ****************************************************************************/

        var phraseList = []; //cortana phrases
        var activation = Windows.ApplicationModel.Activation;
        var wv;

        Windows.UI.WebUI.WebUIApplication.addEventListener('activated', function (args) {  //event listener   
            FWA.startup();

            switch (args.kind) {
                case activation.ActivationKind.launch:
                    if (args.arguments) {
                        FWA.JumpList.navigate(args.arguments);
                        
                    }
                    if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                        // TODO: This application has been newly launched. Initialize your application here.
                        FWA.Cortana.registerCommands();

                        if (FWA.LiveTiles.options.tileUrl && FWA.LiveTiles.options.tileUrl != "") {
                            FWA.LiveTiles.enableLiveTileByFeed(FWA.LiveTiles.options.tileUrl, !!FWA.LiveTiles.options.enableQueue, FWA.LiveTiles.options.periodicUpdate);
                        }
                    } else {
                        // TODO: This application was suspended and then terminated.
                        // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
                    }
                    break;

                case activation.ActivationKind.voiceCommand:
                    FWA.Cortana.handleVoiceCommand(args.detail[0].result);
                    break;
            }
        });

        /***************************************************************************
        * 
        * Webview Specific Event Handlers
        * 
        ****************************************************************************/

        function webViewNavStart(args) {

            //if (args.uri.toString() === "") {
            //    extendedSplashScreen.classList.remove('hidden');
            //    wv.classList.remove('full-size');
            //    wv.classList.add('min-size');
            //    setTimeout(function () {
            //        wv.classList.remove('min-size');
            //        wv.classList.add('full-size');
            //        setTimeout(function () {
            //            extendedSplashScreen.classList.add('hidden');
            //        }, 100);
            //    }, 1000);
            //}
        };

        function webViewLoaded(args) {
            FWA.Page.load();
        };

        function webViewNavComplete(args) {

        };

        function webViewScriptNotify(args) {
            if (args.value.indexOf("SecondaryTile") > -1) {
                var argsArray = args.value.split(",");
                var tileName = argsArray[1];
                var tileUrl = argsArray[2];
                console.log(tileUrl);
                setTimeout(function () {
                    // TO-DO: Add this to the 
                    var tileId = "SecondaryTileID";
                    var tileDisplayName = tileName;

                    var tile = new Windows.UI.StartScreen.SecondaryTile(
                            tileId,
                            tileDisplayName,
                            tileUrl,
                            new Windows.Foundation.Uri("ms-appx:///images/Square150x150Logo.scale-200.png"),
                            Windows.UI.StartScreen.TileSize.square150x150);

                    tile.visualElements.foregroundText = Windows.UI.StartScreen.ForegroundText.dark;
                    tile.visualElements.showNameOnSquare150x150Logo = true;

                    tile.requestCreateAsync().then(function (isCreated) {
                        if (isCreated) {
                            console.log("Tile pinned.");
                        } else {
                            console.log("Failed to pin tile.");
                        }
                    });
                }, 5);
            }
            else {
                console.log("Error with script notify args");
            }
        };
    }

})();
