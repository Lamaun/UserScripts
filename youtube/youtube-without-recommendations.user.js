// ==UserScript==
// @name         Youtube without recommendations
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  You can still use youtube but only search for videos. You won't see as much clickbait anymore and you will suddenly have more time
// @author       Lukas Kaufmann
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const intv = setInterval(() => {
        if(document.URL.includes("https://www.youtube.com/results")
           ||document.URL.includes("https://www.youtube.com/feed/subscriptions")
           ||document.URL.includes("https://www.youtube.com/watch")
           ||document.URL.includes("https://www.youtube.com/c")){
            document.querySelector("#page-manager").hidden = false
        }else{
            document.querySelector("#page-manager").hidden = true
        }
        document.querySelector("#related").hidden = true
    },1000)

    // Your code here...
})();
