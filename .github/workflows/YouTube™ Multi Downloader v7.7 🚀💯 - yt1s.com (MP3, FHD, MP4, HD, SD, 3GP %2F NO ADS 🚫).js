// ==UserScript==
// @name YouTube™ Multi Downloader v7.7 🚀💯 - yt1s.com 
// @author Punisher
// @version 7.7
// @date 2022-02-27
// @icon https://i.imgur.com/InuDDVK.png
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @antifeature referral-link
// @license CC-BY-NC-ND-4.0
// @match *://*.youtube.com/*
// ==/UserScript==

(function() {
    if (document.getElementById("browser-app") || document.getElementById("masthead") || window.Polymer) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("meta-contents") && document.getElementById("punisher") === null) {
            AddYT();
        }
    }, 1);

    setElement = function(url) {
       var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
       var match = String(url).match(regExp);
       return (match&&match[7].length==11)? match[7]: false;
    };
}

function AddYT() {
    var buttonDiv = document.createElement("span");
    buttonDiv.id = "punisher";
    buttonDiv.style.width = "100%";
    buttonDiv.style.marginTop = "3px";
    buttonDiv.style.padding = "10px 0";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("DOWNLOAD"));
    addButton.style.width = "100%";
    addButton.style.cursor = "pointer";
    addButton.style.height = "inherit";
    addButton.style.backgroundColor = "#393939";
    addButton.style.color = "#ffffff";
    addButton.style.padding = "10px 22px";
    addButton.style.margin = "0px 0px";
    addButton.style.border = "0";
    addButton.style.borderRadius = "2px";
    addButton.style.fontSize = "1.4rem";
    addButton.style.fontFamily = "inherit";
    addButton.style.textAlign = "center";
    addButton.style.textDecoration = "none";
    addButton.href = "//yt1s.com/en/youtube-to-mp3?q=" + encodeURIComponent(location.href);
    addButton.target = "_blank";
    buttonDiv.appendChild(addButton);
    var targetElement = document.querySelectorAll("[id='subscribe-button']");
    if(targetElement){
      for(var i = 0; i < targetElement.length; i++){
        if(targetElement[i].className.indexOf("ytd-video-secondary-info-renderer") > -1){
            targetElement[i].appendChild(buttonDiv);
        }
      }
    }
    var descriptionBox = document.querySelectorAll("ytd-video-secondary-info-renderer");
    if(descriptionBox[0].className.indexOf("loading") > -1){
        descriptionBox[0].classList.remove("loading");
    }
}
})();