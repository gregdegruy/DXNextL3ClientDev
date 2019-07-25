(function () {
    'use strict';
    
    var wv, webViewLoaded, webViewNavStart, webViewNavComplete;
    
    //fwa.Page.injectCSS = function (options) {
    //    var _options = {};
    //    fwa.options.Page = Object.assign(_options, fwa.options.Page, (options || {}));
        
    //    if (_options.customCSS === "")
    //        return;
        
    //    var xhttp = new XMLHttpRequest();
        
    //    xhttp.onreadystatechange = function () {
    //        if (xhttp.readyState == 4 && xhttp.status == 200) {
    //            var exec, scriptString;
    //            scriptString = "var cssFileString = '" + xhttp.responseText.replace(/\r\n/gm, " ") + "';" +
    //                "var cssFileStyleEl = document.createElement('style');" +
    //                "document.body.appendChild(cssFileStyleEl);" +
    //                "cssFileStyleEl.innerHTML = cssFileString;";
                
    //            exec = wv.invokeScriptAsync("eval", scriptString);
    //            exec.start();
    //        }
    //    };
    //    xhttp.open("GET", _options.customCSS, true);
    //    xhttp.send();
    //};
    
    //fwa.Page.injectJS = function (options) {
    //    var _options = {};
    //    fwa.options.Page = Object.assign(_options, fwa.options.Page, (options || {}));
    //    var xhttp = new XMLHttpRequest();
        
    //    xhttp.onreadystatechange = function () {
    //        if (xhttp.readyState == 4 && xhttp.status == 200) {
    //            var header = document.getElementsByTagName("head")[0];
    //            var styleEl = document.createElement("script");
    //            styleEl.innerHTML = xhttp.responseText;
    //            header.appendChild(styleEl);
    //        }
    //    };
    //    xhttp.open("GET", _options.customCSS, true);
    //    xhttp.send();
    //};
    
    
    
    //fwa.BackButton.configure = function (options, handler) {
    //    this.options = Object.assign({}, this.options, (options || {}));
        
    //    if (!handler) {
    //        handler = function (args) {
    //            args.handled = true;
    //            if (wv.canGoBack)
    //                wv.goBack();
    //        };
    //    }
        
    //    var _systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
    //    _systemNavigationManager.addEventListener("backrequested", handler.bind(this));
    
    //};
    
    
    fwa.Cortana.handleVoiceCommand = function (input) {
        // Get the name of the voice command. 
        // For this example, we declare only one command.
        var command = input.rulePath[0];
        // Get the actual text spoken.
        var textSpoken = input.text.toLowerCase(); // !== undefined ? input.text : "EXCEPTION";
        //var details = input.semanticInterpretation.properties.section[0];
        
        var url = "";
        
        if (command == "search") {
            wv.navigate(fwa.options.Cortana.search);
        } else {
            for (var i = 0; i < fwa.options.Cortana.phraseList.length; i++) {
                if (textSpoken === fwa.options.Cortana.phraseList[i].name) {
                    fwa.options.Cortana.phraseList[i].action();
                    break;
                }
            }
        }
    }
    
    function webViewNavStart(args) {

    };
    
    function webViewLoaded(args) {
        if (wv.src !== fwa.BackButton.options.homeUrl) {
            fwa.BackButton.show();
        } else {
            fwa.BackButton.hide();
        }
        
        fwa.Page.injectCSS({ customCSS: "http://localhost:1337/www/css/myusps.css" });
    };
    
    function webViewNavComplete(args) {

    };
    
    window.addEventListener("load", function () {
        wv = document.getElementById("webview");
        wv.addEventListener("MSWebViewNavigationStarting", webViewNavStart);
        wv.addEventListener("MSWebViewDOMContentLoaded", webViewLoaded);
        wv.addEventListener("MSWebViewNavigationCompleted", webViewNavComplete);
    });

})();