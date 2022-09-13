// ==UserScript==
// @name         Search in Calender
// @namespace    https://github.com/Lamaun/UserScripts
// @version      0.1
// @description  Shows only matching events
// @author       You
// @match        https://calendar.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const forEachDivWithSameColorAs = (coloredElement, fn) => {
        const divs = document.evaluate(`//div[contains(@style,'background-color: ${coloredElement.style["background-color"]}')]`,document,null,XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        let divList = []
        let div = null
        while (div = divs.iterateNext()) {
            divList.push(div)
        }
        console.log(divs)
        divList.forEach(fn)
    }
    setInterval(()=>{
        const colorthing = document.evaluate('//i/div',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        colorthing.parentElement.parentElement.onclick = () => {
            const header = document.querySelector("header")
            const search = document.createElement('input')
            const undoColorthing = colorthing.cloneNode()
            header.append(undoColorthing)
            header.append(search)
            undoColorthing.onclick = () => {
                forEachDivWithSameColorAs(undoColorthing, (el) => {el.style.display = "block"})
                undoColorthing.remove()
                search.remove()
            }
            search.onchange = () => {
                if(search.value !== ""){
                    forEachDivWithSameColorAs(undoColorthing, (el) => {
                        if(el.role == "button" && !el.innerText.toLowerCase().includes(search.value.toLowerCase())){
                            el.style.display = "none"
                        }
                    })
                }else{
                    forEachDivWithSameColorAs(undoColorthing, (el) => {el.style.display = "block"})
                }

            }
        }

    },1000)

})();
