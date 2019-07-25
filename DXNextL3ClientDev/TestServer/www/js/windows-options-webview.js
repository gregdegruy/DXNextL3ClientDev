//(function (FWA) {
    'use strict';
    
var fwa_options = {
    webView: true,
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
        customCSS: "http://localhost:1337/www/css/customstyles.css",
        customJS: ""
    },
    BackButton: {
        enabled: true,
        homeUrl: "http://localhost:1337/www/pages/webviewpage1.html"
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
                    //history.back();
                    wv.goBack();
                }
            },
            ],
            commandFile: "http://localhost:1337/www/vcd.xml",
            commandSet: "examplevcd",
            commandPhraseList: "navItems"
        },
        Notifications: {
            "enabled": true,
            "toastFile": "http://localhost:1337/www/toast.xml",
        },
        SecondaryTile: {
            enabled: true,
            tileActivationArguments: "Secondary Tile Activation Arguments",
            tileLogoUri: "ms-appx:///images/Square150x150Logo.scale-200.png",
            tileForegroundText: Windows.UI.StartScreen.ForegroundText.light,
            showNameOnTile: true
        },
    };
    
    //if (!window.fwa)
    //    window.fwa = new FWA(options);


//})(window.FWA);
