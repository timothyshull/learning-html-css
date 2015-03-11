/*jslint browser: true*/
///*global console */

window.addEventListener("scroll", function(){
    "use strict";
    var elem = document.getElementById('title_bar'),
    	elem2 = document.body,
        elem3 = document.getElementById('main_nav'),
        titleBarHeight = elem.getBoundingClientRect().height,
    	winTop = -elem2.getBoundingClientRect().top,
        compTops = titleBarHeight > winTop;
        // console.log(titleBarHeight + ", " + winTop + ", " + compTops + "\n");
        if (compTops) {
            elem.style.visiblity = "visible";
            elem3.style.position = "relative";
        }
        else {
           elem.style.visiblity = "hidden";
           elem3.style.position = "fixed";
           elem3.style.top = "0"; 
        }
});