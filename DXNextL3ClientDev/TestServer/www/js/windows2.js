(function () {
'use strict';

if (window.Windows) {

var FWA = {

    var options: {};
        
        var JumpList = function () { };
        //this.BackButton = function () {};
        //this.Page = function () {};
        //this.TitleBar = function () {};
        //this.Notifications = function () {};
        //this.LiveTiles = function () {};
        //this.SecondaryTile = function () {};
        //this.Cortana = function () {};
        //this.Inking = function () {};
        
        
        var.startup = function () {
            this.LiveTiles.configure();
            this.Cortana.configure();
            this.TitleBar.configure();
            this.JumpList.configure();
        }

        return this;
    };
    
    if (!window.fwa) {
        window.fwa = new FWA();
    }

            
        FWA.JumpList.prototype = {
            configure: function (options) {
                var _options = {};
                fwa.options.JumpList = Object.assign(_options, fwa.options.JumpList, (options || {}));
                
                if (!_options.enabled)
                    return;
                
                var jumpList = Windows.UI.StartScreen.JumpList;
                jumpList.loadCurrentAsync().done(function (jumpList) {
                    jumpList.systemGroupKind = Windows.UI.StartScreen.JumpListSystemGroupKind.none;
                    jumpList.items.clear();
                    
                    _options.items.forEach(function (i) {
                        var item = Windows.UI.StartScreen.JumpListItem.createWithArguments(i.url, i.name);
                        jumpList.items.append(item);
                    });
                    jumpList.saveAsync();
                });
            }
        }
            
        FWA.prototype.Page = {
            injectCSS: function (options) {
                var _options = {};
                fwa.options.Page = Object.assign(_options, fwa.options.Page, (options || {}));
                
                if (!_options.customCSS || _options.customCSS === "")
                    return;
                
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        var header = document.getElementsByTagName("head")[0];
                        var styleEl = document.createElement("style");
                        styleEl.innerHTML = xhttp.responseText;
                        header.appendChild(styleEl);
                    }
                };
                xhttp.open("GET", _options.customCSS, true);
                xhttp.send();
            },
            
            injectJS: function (options) {
                var _options = {};
                fwa.options.Page = Object.assign(_options, fwa.options.Page, (options || {}));
                
                if (!_options.customCSS || _options.customJS === "")
                    return;
                
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        var header = document.getElementsByTagName("head")[0];
                        var styleEl = document.createElement("script");
                        styleEl.innerHTML = xhttp.responseText;
                        header.appendChild(styleEl);
                    }
                };
                xhttp.open("GET", _options.customJS, true);
                xhttp.send();
            },
            
            load: function () {
                fwa.Page.injectCSS();
                fwa.Inking.configure();
                fwa.BackButton.configure();
            } 
        }

        FWA.prototype.BackButton = {
            configure: function (options, handler) {
                var _options = {};
                fwa.options.BackButton = Object.assign(_options, fwa.options.BackButton, (options || {}));
                if (!_options.enabled)
                    return;
                
                if (!handler) {
                    handler = function (args) {
                        args.handled = true;
                        history.back();
                    };
                }
                
                var _systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                _systemNavigationManager.addEventListener("backrequested", handler.bind(this));
                
                //window.addEventListener('load', function () {
                //Read from manifest
                if (window.location.href != _options.homeUrl) { //fwa.options.BackButton.homeUrl) {
                    fwa.BackButton.show();
                } else {
                    fwa.BackButton.hide();
                }
                //});
            },
            
            show: function () {
                var _systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                _systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
            },
            
            hide: function () {
                var _systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                _systemNavigationManager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
            },
            
            handle: function () {
                
            }
        }

        FWA.prototype.TitleBar = {
            configure: function (options) {
                var _options = {};
                fwa.options.TitleBar = Object.assign(_options, fwa.options.TitleBar, (options || {}));
                
                if (!_options.enabled)
                    return;
                
                var titleBar = Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar;
                titleBar.backgroundColor = _options.backgroundColor;
                titleBar.buttonBackgroundColor = _options.buttonBackgroundColor;
                titleBar.foregroundColor = _options.foregroundColor;
                titleBar.buttonForegroundColor = _options.buttonForegroundColor;
            }
        }
        
        FWA.prototype.LiveTiles = {
            // These match the values in Windows.UI.Notifications.PeriodicUpdateRecurrence
            //_periodicUpdateRecurrence: [30, 60, 360, 720, 1440],
            
            
            // Used to setup options
            configure: function (options, setupHandler) {
                var _options = {};
                fwa.options.LiveTiles = Object.assign(_options, fwa.options.LiveTiles, (options || {}));
                
                if (!_options.enabled)
                    return;
                
                if (setupHandler)
                    setupHandler(_options);
                else
                    _setupLiveTile(_options);
            },
            
            update: function (options) {
                //TODO:  Allow application to send local updates.
            },
        }
        
        FWA.prototype.Notifications = {
            displayLocalToast: function (options) {
                var _options = {};
                fwa.options.Notifications = Object.assign(_options, fwa.options.Notifications, (options || {}));
                
                if (!_options.enabled)
                    return;
                
                var notificationManager = Windows.UI.Notifications.ToastNotificationManager;
                var uri = new Windows.Foundation.Uri(_options.toastFile);
                
                if (_options.toastFile.indexOf("ms-appx:") > -1) {
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
            },
            
            HideNotification: function () {
                console.log('hiding notification')
            }
        }
        
        FWA.prototype.SecondaryTile = {
            pin: function (options) {
                var _options = {};
                
                FWA.options.SecondaryTile = Object.assign(_options, FWA.options.SecondaryTile, (options || {}));;
                
                var tileId = "Secondary Tile ID";
                var tileDisplayName = "Secondary Tile Display Name";
                var tileActivationArguments = "Secondary Tile Activation Arguments";
                
                var tile = new Windows.UI.StartScreen.SecondaryTile("tileId",
                                                                    "tileDisplayName",
                                                                    _options.tileActivationArguments,
                                                                    new Windows.Foundation.Uri(_options.tileLogoUri),
                                                                    Windows.UI.StartScreen.TileSize.square150x150);
                
                tile.visualElements.foregroundText = _options.tileForegroundText;
                tile.visualElements.showNameOnSquare150x150Logo = _options.showNameOnTile;
                
                tile.requestCreateAsync().then(function (isCreated) {
                    if (isCreated) {
                        // handle tile pinned.
                    } else {
                        // handle failed pin.
                    }
                });
            }
        }
        
        FWA.prototype.Cortana = {
            configure: function (options) {
                var _options = {};
                fwa.options.Cortana = Object.assign(_options, fwa.options.Cortana, (options || {}));
                
                var phraseList = [];
                
                if (!_options.enabled)
                    return;
                
                
                // Add 
                _options.phraseList.forEach(function (item) {
                    phraseList.push(item.name);
                });
                
                var uri = new Windows.Foundation.Uri(_options.commandFile);
                var vcdManager = Windows.ApplicationModel.VoiceCommands.VoiceCommandDefinitionManager;
                //var storageFile = Windows.Storage.StorageFile.getFileFromApplicationUriAsync(uri).then(
                var storageFile = Windows.Storage.StorageFile.createStreamedFileFromUriAsync("vcd.xml", uri, null).then(
                    function (vcd) {
                        vcdManager.installCommandDefinitionsFromStorageFileAsync(vcd).then(
                            function () {
                                var installedCommandSets = vcdManager.installedCommandDefinitions;
                                if (installedCommandSets.hasKey(_options.commandSet)) {
                                    var commandSet = installedCommandSets.lookup(_options.commandSet);
                                    commandSet.setPhraseListAsync(_options.commandPhraseList, phraseList);
                                }
                            });
                    });
            },
            
            handleVoiceCommand: function (input) {
                // Get the name of the voice command. 
                // For this example, we declare only one command.
                var command = input.rulePath[0];
                // Get the actual text spoken.
                var textSpoken = input.text.toLowerCase(); // !== undefined ? input.text : "EXCEPTION";
                //var details = input.semanticInterpretation.properties.section[0];
                
                var url = "";
                
                if (command == "search") {
                    window.location.href = fwa.options.Cortana.search;
                } else {
                    for (var i = 0; i < fwa.options.Cortana.phraseList.length; i++) {
                        if (textSpoken === fwa.options.Cortana.phraseList[i].name) {
                            fwa.options.Cortana.phraseList[i].action();
                            break;
                        }
                    }
                }
            }
        }
        
        FWA.prototype.Inking = {
            configure: function (options) {
                var _options = {};
                fwa.options.Inking = Object.assign(_options, fwa.options.Inking, (options || {}));
                
                if (!_options.enabled)
                    return;
                
                //window.addEventListener('load', function () {
                // WAT.options.inkCanvas.width = WAT.options.webView.offsetWidth;
                // WAT.options.inkCanvas.height = WAT.options.webView.offsetHeight;
                inkManager = new Windows.UI.Input.Inking.InkManager();
                var drawingAttributes = new Windows.UI.Input.Inking.InkDrawingAttributes();
                drawingAttributes.fitToCurve = true;
                inkManager.setDefaultDrawingAttributes(drawingAttributes);
                inkManager.mode = Windows.UI.Input.Inking.InkManipulationMode.inking;
                
                inkCanvas = document.getElementById("ink");
                inkCanvas.setAttribute("width", _options.width);
                inkCanvas.setAttribute("height", _options.height);
                
                _setStrokeStyle(_options);
                
                inkCanvas.addEventListener("pointerdown", _handlePointerDown, false);
                inkCanvas.addEventListener("pointerup", _handlePointerUp, false);
                inkCanvas.addEventListener("pointermove", _handlePointerMove, false);
                inkCanvas.addEventListener("pointerout", _handlePointerOut, false);

                //});
            }
        }
       


        //
        // Private Functions
        //
        
        function _setupLiveTile(options) {
            if (!options.enabled || options.enabled !== true) {
                return;
            }
            
            options.enableQueue = !!options.enableQueue;
            
            // Enable Notifications Queue - The tile will cycle through the multple tile notifications
            var notifications = Windows.UI.Notifications;
            notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueue(options.enableQueue);
            
            if (options.tileUrl) {
                _setupTileFeed(options);
            }
        }
        
        function _setupTileFeed(options) {
            var urisToPoll = [];
            
            if (options.tileUrl.splice) {
                // we already have an array of feeds, use it!
                urisToPoll = option.tileUrl;
            } else {
                for (var n = 0; n < 5; ++n) {
                    var url = 'http://notifications.buildmypinnedsite.com/?feed=' + encodeURIComponent(options.tileUrl) + '&id=' + n.toString();
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
                updater.startPeriodicUpdateBatch(urisToPoll, options.periodicUpdate);
            } catch (e) {
                // Tile APIs are flaky.. they sometimes fail for no readily apparent reason
                // but that's no reason to crash and risk a 1-star
            }
        }
       
        
        //inking
        var _inkContext, inkManager, inkCanvas, penID = -1;
        function _setStrokeStyle(options) {
            _inkContext = inkCanvas.getContext(options.context);
            _inkContext.lineWidth = options.lineWidth;
            _inkContext.strokeStyle = options.strokeStyle;
            _inkContext.lineCap = options.lineCap;
            _inkContext.lineJoin = options.lineJoin;
        }
        
        function _renderAllStrokes() {
            _inkContext.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
            inkManager.getStrokes().forEach(function (stroke) {
                var att = stroke.drawingAttributes;
                var strokeSize = att.size;
                var ctx = _inkContext;
                _renderStroke(stroke, ctx);
            });
        }
        
        function _renderStroke(stroke, ctx) {
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
        }
        
        function _toColorString(color) {
            return "#" + byteHex(color.r) + byteHex(color.g) + byteHex(color.b);
        }
        function _byteHex(num) {
            var hex = num.toString(16);
            if (hex.length === 1) {
                hex = "0" + hex;
            }
            return hex;
        }
        function _handlePointerDown(evt) {
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
        }
        function _handlePointerMove(evt) {
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
        }
        function _handlePointerUp(evt) {
            if (evt.pointerId === penID) {
                penID = -1;
                var pt = evt.currentPoint;
                _inkContext.lineTo(pt.rawPosition.x, pt.rawPosition.y);
                _inkContext.stroke();
                _inkContext.closePath();
                
                var rect = inkManager.processPointerUp(pt);
                
                _renderAllStrokes();
            }
        }
        function _handlePointerOut(evt) {
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
        }
       
        
        window.onload = fwa.Page.load;
        
        var phraseList = []; //cortana phrases
        var activation = Windows.ApplicationModel.Activation;
        Windows.UI.WebUI.WebUIApplication.addEventListener('activated', function (args) {  //event listener   
            fwa.startup();
            switch (args.kind) {
                case activation.ActivationKind.launch:
                    if (args.arguments) {
                        fwa.options.JumpList.navigate(args.arguments);
                    }
                    if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                        // TODO: This application has been newly launched. Initialize your application here.
                    } else {
                        // TODO: This application was suspended and then terminated.
                        // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
                    }
                    break;

                case activation.ActivationKind.voiceCommand:
                    var cortana = fwa.Cortana;
                    cortana.handleVoiceCommand(args.detail[0].result);
                    break;
            }
        });
    }
})();