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
// @resource        CustomCSS https://s3-eu-west-1.amazonaws.com/jarvellis-css-share/aws-smc-greasemonkey.css
// @include         https://calculator.s3.amazonaws.com/index.html
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @updateURL	    http://gitlab.jarvellis.com/AWS/aws-smc-greasemonkey.user.js
// @downloadURL	    http://gitlab.jarvellis.com/AWS/aws-smc-greasemonkey.user.js
// ==/UserScript==

// http://wiki.greasespot.net/Metadata_Block
// http://wiki.greasespot.net/Include_and_exclude_rules
// https://stackoverflow.com/questions/11275378/cross-domain-post-with-greasemonkey

$("head").append (
    '<link '
  + 'href="https://s3-eu-west-1.amazonaws.com/jarvellis-css-share/aws-smc-greasemonkey.css" '
  + 'rel="stylesheet" type="text/css">'
);

var script_version = GM_info.script.version; //script version to keep track of releases
var timeout = 2000;

// Add custom styling
var fawsCSS = GM_getResourceText ("CustomCSS");
GM_addStyle (fawsCSS);

function run() {
    $(document).ready(function() {
        console.log('Script version: ' + script_version);
        var selectedProduct = document.querySelector("div.gwt-HTML.tab.selected").textContent;
        console.log('Selected tab: ' + selectedProduct);
        createStrip();
    });
}

// We need to wait until the UI has been generated before we start querying it
setTimeout(run, timeout);

function createStrip() {
    // Add FAWS export strip
    var fawsNode       = document.createElement ('div');
    fawsNode.setAttribute("id", "fawsContainer")
    fawsNode.innerHTML = '<button id="fawsButton" type="button">Export</button>';
    var parentNode = document.getElementById("aws-calculator").parentNode;
    var refNode = document.getElementById("aws-calculator");
    parentNode.insertBefore(fawsNode, refNode);
    //--- Activate the newly added button.
    document.getElementById ("fawsButton").addEventListener (
        "click", ButtonClickAction, false
    );
}

function ButtonClickAction (fawsEvent) {
    var fawsNode       = document.createElement ('p');
    var selectedProduct = document.querySelector("div.gwt-HTML.tab.selected").textContent;
    // alert('Selected tab: ' + selectedProduct);
    fawsNode.innerHTML = 'The button was clicked.';
    document.getElementById ("fawsContainer").appendChild (fawsNode);
}

function AmazonEC2Instances(headers){
    var headers = {
        description:    {3: 'input'},
        instances:      {6: 'input'},
        usage_value:    {9: 'input'},
        usage_type:     {10: 'select'},
        instance_type:  {12: 'div'},
        billing_option: {14: 'div'},
        monthly_cost:   {17: 'div'}
    }
    row = tables[0].querySelector("tr").querySelectorAll('td')
    // d = tables[0].querySelectorAll("tr")[1].querySelectorAll("td");
    // d[9].querySelector("input").value
    row.forEach(function(entry){
        entry = entry.replace(/\s/g, "");
        if (entry.length > 0) {
            headers.push(row.innerText);
        }
    });
    return headers
}

function collectDatasets(){
    var tables = document.querySelectorAll ("table.itemsTable")
    tables.forEach(function(entry){
        console.log(entry);
    });
}

