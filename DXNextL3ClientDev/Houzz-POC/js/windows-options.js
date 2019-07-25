"use strict";

//if (window.Windows) {

var baseUrl = "ms-appx-web://";

var fwa_options = {
    webView: true,
    baseUrl: baseUrl,
    JumpList: {
        enabled: true,
        items: [
            {
                name: "Houzz",
                url: "http://www.houzz.com/",
                description: "",
                logo: "",
            },
        ],
        navigate: function (args) {
            // window.location.href = args;
            wv.navigate(args);
        }
    },
    LiveTiles: {
        enabled: true,
        periodicUpdate: Windows.UI.Notifications.PeriodicUpdateRecurrence.halfHour,
        enableQueue: false,
        tileUrl: "http://wat-docs.azurewebsites.net/feed"
    },
    Page: {
        customCSS: baseUrl + "/css/customstyles.css",
        customJS: baseUrl + "/js/customscript.js"
    },
    BackButton: {
        enabled: true,
        homeUrl: "/webview.html"
    },
    TitleBar: {
        enabled: true,
        backgroundColor: { a: 255, r: 255, g: 255, b: 255 },
        buttonBackgroundColor: { a: 255, r: 255, g: 255, b: 255 },
        foregroundColor: Windows.UI.Colors.black,
        buttonForegroundColor: Windows.UI.Colors.black,
    },
    Inking: {
        enabled: true,
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
        tileForegroundText: Windows.UI.StartScreen.ForegroundText.dark,
        showNameOnTile: true
    },
};
//}

