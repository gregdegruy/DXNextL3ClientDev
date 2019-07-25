// this can be hosted in the Houzz website
<script type="text/javascript">
$(document).ready(function() {
    if(HZ.intlRedirectBanner && HZ.intlRedirectBanner.dismiss) {
        HZ.intlRedirectBanner.dismiss('intl-banner');
    }
    console.log('Enabling Windows Hosted Web App Module');
    HZ.ns('HZ.Windows');
    HZ.Windows = {};
    if(window.Windows !== 'undefined') {
        function reportConnectionEvent(e) {
            if (!e) e = window.event;

            if ('online' == e.type) {
                console.log('The app is ONLINE.');
                if (history.length === 0) {
                    window.location.href = 'http://www.houzz.com';
                } else if (history.length >= 1) {
                    history.back();
                }
            }
            else if ('offline' == e.type) {
                console.log('The app is OFFLINE.');
                window.location.href = 'ms-appx-web:///my-error-page.html';
            } else {
                console.log('Unexpected event: ' + e.type);
                window.location.href = 'ms-appx-web:///my-error-page.html';
            }
        };

        window.onload = function () {
            window.ononline = reportConnectionEvent;
            window.onoffline = reportConnectionEvent;
        };

        if(Windows.Networking !== 'undefined' && Windows.Networking.PushNotifications !== 'undefined') {
            HZ.Windows.getPushToken = function(callback) {
                var channel;
                var pushNotifications = Windows.Networking.PushNotifications;
                var channelOperation = pushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync();

                return channelOperation.then(function (newChannel) {
                        channel = newChannel;
                        // Success. The channel URI is found in newChannel.uri.
                        console.log("Retrieved WNS Channel/Token:", channel.uri);
                        if(callback) {
                            callback(true, channel);
                        }
                    },
                    function (error) {
                        console.log("Could not create a channel. Error #:" + error.number);
                        if(callback) {
                            callback(false, error);
                        }
                    }
                );
            }
        }

        if(Windows.UI !== 'undefined' &&
        Windows.UI.Notifications !== 'undefined') {

            HZ.Windows.showToast = function(message) {
                if(!message) {
                    message = 'No message specified! Hi there!';
                }
                var notifications = Windows.UI.Notifications;
                //Get the XML template where the notification content will be suplied
                var template = notifications.ToastTemplateType.toastImageAndText01;
                var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
                //Supply the text to the XML content
                var toastTextElements = toastXml.getElementsByTagName("text");
                toastTextElements[0].appendChild(toastXml.createTextNode(message));
                //Supply an image for the notification
                var toastImageElements = toastXml.getElementsByTagName("image");
                //Set the image this could be the background of the note, get the image from the web
                toastImageElements[0].setAttribute("src", "https://raw.githubusercontent.com/seksenov/grouppost/master/images/logo.png");
                toastImageElements[0].setAttribute("alt", "red graphic");
                //Specify a long duration
                var toastNode = toastXml.selectSingleNode("/toast");
                toastNode.setAttribute("duration", "long");
                //Specify the audio for the toast notification
                var toastNode = toastXml.selectSingleNode("/toast");
                var audio = toastXml.createElement("audio");
                audio.setAttribute("src", "ms-winsoundevent:Notification.IM");
                //Specify launch paramater
                toastXml.selectSingleNode("/toast").setAttribute("launch", '{"type":"toast","param1":"12345","param2":"67890"}');
                //Create a toast notification based on the specified XML
                var toast = new notifications.ToastNotification(toastXml);
                //Send the toast notification
                var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
                toastNotifier.show(toast);
            }
        }
    }
    if(document.location.href.match(/\/jobs\?gh_jid/) && $('#grnhse_app').children().length == 0 && Grnhse && Grnhse.Iframe && Grnhse.Iframe.load) {
        console.log("Fixing Greenhouse...");
        Grnhse.Iframe.load();
    }


});

if(window.Windows !== 'undefined' && Windows.UI !== 'undefined' && Windows.UI.WebUI !== 'undefined') {
    function suspending(eventObj) {
        // console.log('Suspending', arguments);
    }
    function resuming(eventObj) {
        // console.log('Resuming', arguments);
    }
    console.log('Creating application event listeners');
    Windows.UI.WebUI.WebUIApplication.addEventListener("activated", function(eventObj) {
        // FWA.startup();
        // console.log('Activating', arguments);
        if(!eventObj.prelaunchActivated) {
            // Take care of user actively launching the app
            console.log('Not Prelaunched');
        } else {
            console.log('PRELAUNCHED');
        }
    });
    Windows.UI.WebUI.WebUIApplication.addEventListener("suspending", suspending, false);
    Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", resuming, false);
}

if(window.Windows != 'undefined' && Windows.UI !== 'undefined' && Windows.UI.Core !== 'undefined') {
    //this is the windows apis for the back button as well as an event handler for it
    var systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
    systemNavigationManager.addEventListener("backrequested", handleSystemNavigationEvent.bind(this));
    var systemNavigation = Windows.UI.Core.SystemNavigationManager.getForCurrentView();

    // function to handle the system Navigation Event
    function handleSystemNavigationEvent(args) {
       args.handled = true; //cancels the default behavior of the system back button
       history.back()
    }

    //if it on the home page we don't want to show the back button
    var homeURL = 'http://www.houzz.com/';
    var curURL = window.location.href;

    //set up event to show if it should be shown

    window.addEventListener('load', function(){
       if (curURL !== homeURL) {
          systemNavigation.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;

       }
       else{
          systemNavigation.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
       }
    });
}

if(window.Windows != 'undefined' && Windows.UI !== 'undefined' && Windows.UI.Notifications !== 'undefined') {
    // Enable Notifications Queue - The tile will cycle through the multple tile notifications
    // console.log('Starting live tile polling');
    try {
        var notifications = Windows.UI.Notifications;
        var updater = notifications.TileUpdateManager.createTileUpdaterForApplication();
        // updater.enableNotificationQueue(true);
        // updater.clear();
        // updater.stopPeriodicUpdate();
        // updater.startPeriodicUpdate(new Windows.Foundation.Uri('http://www.houzz.com/windowsLiveTile/'), Windows.UI.Notifications.PeriodicUpdateRecurrence.halfHour);
        // console.log('Started live tile polling');
    } catch(e) {
        console.log('Live tile polling error', e);
    }
}
</script>
