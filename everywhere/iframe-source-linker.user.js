// ==UserScript==
// @name         iframe source linker
// @namespace    https://github.com/LukasKaufmannRelaxdays/UserScripts
// @version      1.0
// @description  Show the src of every iframe as a clickable link.
// @author       Lukas Kaufmann
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const marker = "iframealreadytamperedmarker653268734"
    setInterval(() => {
        document.querySelectorAll("iframe").forEach(iframe => {
            if(iframe.getAttribute(marker) != "true"){
                iframe.setAttribute(marker,true)
                var a = document.createElement("a");
                a.innerHTML = "Tamper: Iframe Source";
                a.setAttribute("href", iframe.src);
                iframe.parentElement.append(a);
            }
        })
    },1000);
})();
