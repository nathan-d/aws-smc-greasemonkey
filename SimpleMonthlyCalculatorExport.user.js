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
// @include         http://calculator.s3.amazonaws.com/*
// @updateURL	    http://gitlab.jarvellis.com/AWS/aws-smc-greasemonkey.user.js
// @downloadURL	    http://gitlab.jarvellis.com/AWS/aws-smc-greasemonkey.user.js
// ==/UserScript==

// http://wiki.greasespot.net/Metadata_Block
// http://wiki.greasespot.net/Include_and_exclude_rules
// https://stackoverflow.com/questions/11275378/cross-domain-post-with-greasemonkey

var script_version = GM_info.script.version; //script version to keep track of releases
var timeout = 10000;

// The page title element currently looks like this: <title>151030-ord-0000577: Test ticket - please ignore</title>

function run() {
    $(document).ready(function() {
	console.log('Script version: ' + script_version);
    var selectedProduct = div.gwt-HTML.tab.selected
    console.log('Selected tab: ' + selectedProduct);
	// sendPingRequest(username, ticketNum);
    });
}