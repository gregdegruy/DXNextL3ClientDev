"use strict";

/**
* Grab the Houzz feed
*/
var wv = document.getElementById("webview");
var HZFeedTopics = document.querySelectorAll(".feed-content");
var HZFeedTopicLinks = document.querySelectorAll(".feedItem.home-feed .feed-topic-container .feed-topic");

for (var i = 0; i < 10; i++) {
    /**
* Construct pin button element
*/
    var feedFooterPinButtonClearfix = document.createElement("div");
    feedFooterPinButtonClearfix.className = "feed-footer-buttons clearfix tile-pin-button";
    feedFooterPinButtonClearfix.style.cursor = "pointer";
    feedFooterPinButtonClearfix.onclick = function () {
        pin();
    };

    var feedFooterPinButtonLeft = document.createElement("div");
    feedFooterPinButtonLeft.className = "feed-footer-buttons-right tile-pin-button";
    feedFooterPinButtonLeft.style.width = "100%";

    var feedFooterPinButtonAnchor = document.createElement("a");
    feedFooterPinButtonAnchor.className = "feed-footer-buttons-email text-bold tile-pin-button";
    feedFooterPinButtonAnchor.innerHTML = "Pin";

    var feedFooterPinButtonIcon = document.createElement("span");
    feedFooterPinButtonIcon.className = "hzi-font hzi-Email-Small";

    /**
    * Append pin button element
    * feedFooterPinButtonAnchor.appendChild(feedFooterPinButtonIcon);
    */
    feedFooterPinButtonLeft.appendChild(feedFooterPinButtonAnchor);
    feedFooterPinButtonClearfix.appendChild(feedFooterPinButtonLeft);

    /**
    * Capture pin button click event
    */
    var topicIndex = i;
    HZFeedTopics[topicIndex].appendChild(feedFooterPinButtonClearfix);
    var HZFeedTopicAnchorLinkOne = HZFeedTopics[topicIndex].childNodes[3].childNodes[1].childNodes[1].href;
    var HZFeedTopicAnchorNameOne = HZFeedTopics[topicIndex].childNodes[3].childNodes[1].childNodes[1].innerHTML;;

    function pin() {
        console.log("Clicked");
        window.external.notify("SecondaryTile," + HZFeedTopicAnchorNameOne + "," + HZFeedTopicAnchorLinkOne);
    }
}


/**
* Remove site menu drop down on mobile
*/
