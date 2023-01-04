// ==UserScript==
// @name         SiteUsageLimiter
// @namespace    https://github.com/Lamaun/UserScripts
// @version      1.0
// @description  Configure a list of Domains you can only use if you planned (in your google calendar) to do so
// @author       Lukas Kaufmann
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    const websites_to_block = ["youtube.com", "reddit.com", "facebook.com"]
  
    function isCharNumber(c) {
        return c >= '0' && c <= '9';
    }
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    'use strict';
    const hacky_get_param = "userScriptUsageAllowance"
    if(document.URL.includes("https://calendar.google.com/calendar")){
        setInterval(()=>{
            const first_description_link = document.evaluate('//a[starts-with(@href,"https://www.google.com/url?q=")]',
                                                             document,null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
            websites_to_block.some((website) => {
                if(first_description_link.href.includes(website)){
                    // set usage quota
                    const meetingText = document.evaluate('//*[contains(text(),"SiteUsageLimiter") and @role="heading"]/parent::*/parent::*',
                                                          document,null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText.split("\n")[1]
                    //'Friday, 11 November⋅23:30 – 23:45','Friday, 27 January 2023⋅22:00 – 22:45' or '13 November 2022, 23:00 – 14 November 2022, 06:30'
                    var startTime, endTime
                    if(meetingText.includes("⋅")){
                        var hasYYYY = isCharNumber(meetingText.split("⋅")[0].at(-1))
                        startTime = Date.parse(meetingText.split("–")[0].replace("⋅"," ") + (hasYYYY?"":new Date().getFullYear()))
                        endTime = Date.parse(meetingText.split("⋅")[0] + (hasYYYY?"":new Date().getFullYear()) + " " + meetingText.split("–")[1])
                    }
                    else{
                        startTime = Date.parse(meetingText.split("–")[0])
                        endTime = Date.parse(meetingText.split("–")[1])
                    }
                    if(new Date() - startTime > 1000 * 60 * -10 && //allow starting 10 min early
                       endTime - new Date() > 0){
                        first_description_link.href = "https://" + website + "?" + hacky_get_param + "=" + endTime + "," + btoa(endTime)
                    }
                    return true;
                }
            })
        },1000)
    }
    if(websites_to_block.some((website) => {
            return document.URL.includes(website)
        })
    ){
        //transfer to cookie
        let url = new URL(document.URL);
        let params = new URLSearchParams(url.search);
        let allowance = params.get(hacky_get_param)
        if(allowance !== null){
            document.cookie = hacky_get_param + "=" + allowance
            window.location = url.origin
        }
        //check usage quota
        const intv= setInterval(()=>{
            if(getCookie(hacky_get_param) == null){
                alert("This site can only be used via a link from google calendar")
                window.location = "https://calendar.google.com/calendar"
                clearInterval(intv)
            }
            const endTime = getCookie(hacky_get_param).split(",")[0]
            if(endTime != atob(getCookie(hacky_get_param).split(",")[1])
               || endTime - new Date() < 1000 * 60 * -10){ // 10 min tolerance
                alert("closing because you have other things to do")
                window.location = "https://calendar.google.com/calendar"
                clearInterval(intv)
            }

        },1000)
    }
})();
