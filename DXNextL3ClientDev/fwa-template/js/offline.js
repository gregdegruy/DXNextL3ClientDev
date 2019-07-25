if (window.Windows) {

    function reportConnectionEvent(e) {
        if (!e) e = window.event;

        var wv = document.getElementById("webview");

        if ('online' == e.type) {
            console.log('The browser is ONLINE.');
            FWA.BackButton.toggle();
            wv.navigate('https://www.github.com/personal');
        }
        else if ('offline' == e.type) {
            console.log('The browser is OFFLINE.');
            wv.navigate('ms-appx-web:///msapp-error.html');
        }
        else {
            console.log('Unexpected event: ' + e.type);
            wv.navigate('ms-appx-web:///msapp-error.html');
        }
    };

    window.onload = function () {
        window.ononline = reportConnectionEvent;
        window.onoffline = reportConnectionEvent;
    };
}
