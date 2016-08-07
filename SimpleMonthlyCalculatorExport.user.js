// ==UserScript==
// @name	        Simple Monthly Calculator Export
// @namespace	    Simple Monthly Calculator Export
// @description 	Greasemonkey script to allow AWS Simple Monthly Calculator content to be submitted to a customer API for later use.    
// @version	    0.1.0
// @run-at 	    document-end
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @resource        CustomCSS http://gitlab.jarvellis.com/AWS/aws-smc-greasemonkey.css
// @include         https://calculator.s3.amazonaws.com/index.html
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @updateURL	    http://gitlab.jarvellis.com/AWS/aws-smc-greasemonkey.user.js
// @downloadURL	    http://gitlab.jarvellis.com/AWS/aws-smc-greasemonkey.user.js
// ==/UserScript==

// http://wiki.greasespot.net/Metadata_Block
// http://wiki.greasespot.net/Include_and_exclude_rules
// https://stackoverflow.com/questions/11275378/cross-domain-post-with-greasemonkey

var script_version = GM_info.script.version; //script version to keep track of releases
var timeout = 2000;

var zNode       = document.createElement ('div');
fawsNode.innerHTML = '<button id="fawsButton" type="button">'
                + 'Export</button>'
                ;
fawsNode.setAttribute ('id', 'fawsContainer');
document.body.appendChild (fawsNode);

//--- Activate the newly added button.
document.getElementById ("fawsButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (fawsEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    var zNode       = document.createElement ('p');
    fawsNode.innerHTML = 'The button was clicked.';
    document.getElementById ("fawsContainer").appendChild (fawsNode);
}

function run() {
    $(document).ready(function() {
        console.log('Script version: ' + script_version);
        var selectedProduct = document.querySelector("div.gwt-HTML.tab.selected").textContent;
        console.log('Selected tab: ' + selectedProduct);
    });

}

// We need to wait until the UI has been generated before we start querying it
setTimeout(run, timeout);