"use strict";

//var baseUrl = "http://dxhostedapps.azurewebsites.net/SampleApp";
//var baseUrl = "http://localhost:1337/www";
var baseUrl = "ms-appx-web://";

//if (window.Windows) {
    
    var fwa_options = {
        webView: false,
        baseUrl: baseUrl,
        JumpList: {
            enabled: true,
            items: [
                {
                    name: "Microsoft",
                    url: "http://www.microsoft.com",
                    description: "",
                    logo: "",
                },
                {
                    name: "MSN",
                    url: "http://www.msn.com",
                    description: "",
                    logo: "",
                }
            ],
            navigate: function (args) {
                window.location.href = args;
            }
        },
        LiveTiles: {
            enabled: true,
            periodicUpdate: Windows.UI.Notifications.PeriodicUpdateRecurrence.halfHour,
            enableQueue: false,
            tileUrl: "http://wat-docs.azurewebsites.net/feed"
        },
        Page: {
            customCSS: baseUrl +"/css/customstyles.css",
            customJS: baseUrl +"/js/customscript.js"
        },
        BackButton: {
            enabled: true,
            homeUrl: "/default.html"
        },
        TitleBar: {
            enabled: true,
            backgroundColor: { a: 255, r: 58, g: 74, b: 85 },
            buttonBackgroundColor: { a: 255, r: 58, g: 74, b: 85 },
            foregroundColor: Windows.UI.Colors.white,
            buttonForegroundColor: Windows.UI.Colors.white,
        },
        Inking: {
            enabled: true,
            context: "2d",
            lineWidth : 5,
            strokeStyle : "Red",
            lineCap : "round",
            lineJoin: "round",
            width: '1000px',
            height: '500px'

        },
        Cortana: {
            enabled: true,
            search: "http://www.bing.com/?{searchTerm}",
            phraseList: [
                {
                    name: "home",
                    url: "http://www.microsoft.com",
                    action: ""
                },
                {
                    name: "back",
                    url: "http://www.microsoft.com",
                    action: function () {
                        if (fwa_options.webView) {
                            wv.goBack();
                        } else {
                            history.back();
                        }
                    }
                },
            ],
            commandFile: "ms-appx:///vcd.xml",
            commandSet: "examplevcd",
            commandPhraseList: "navItems"
        },
        Notifications: {
            "enabled": true,
            "toastFile": "ms-appx:///toast.xml",
        },
        SecondaryTile: {
            enabled: true,
            tileActivationArguments: "Secondary Tile Activation Arguments",
            tileLogoUri: "ms-appx:///images/Square150x150Logo.scale-200.png",
            tileForegroundText: Windows.UI.StartScreen.ForegroundText.light,
            showNameOnTile: true
        },
    };
//}

