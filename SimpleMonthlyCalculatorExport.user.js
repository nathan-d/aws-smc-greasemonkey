// ==UserScript==
// @name	        Simple Monthly Calculator Export
// @namespace	    Simple Monthly Calculator Export
// @description 	Greasemonkey script to allow AWS Simple Monthly Calculator content to be submitted to a customer API for later use.
// @version	        0.1.0
// @run-at 	        document-end
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

// add custom styling through directly inserting refernce in head
$("head").append (
    '<link '
  + 'href="https://s3-eu-west-1.amazonaws.com/jarvellis-css-share/aws-smc-greasemonkey.css" '
  + 'rel="stylesheet" type="text/css">'
);

var script_version = GM_info.script.version; // script version to keep track of releases
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

// we need to wait until the UI has been generated before we start querying it
setTimeout(run, timeout);

function createStrip() {
    // adds FAWS export strip
    var fawsNode       = document.createElement ('div');
    fawsNode.setAttribute("id", "fawsContainer")
    fawsNode.innerHTML = '<button id="fawsButton" type="button">Export</button>'; // TODO: Add input field for DDI
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
    fawsNode.innerHTML = 'The button was clicked.';
    document.getElementById ("fawsContainer").appendChild (fawsNode);
}

/* Start of data handling functions for AWS Calc page */

function gwtTextBoxHandler(field) {
    // handler for calc text box field
    entry = field.querySelector('gwt-TextBox')
    return entry.value
} //gwtTextBoxHandler()

function gwtListBoxHandler(field) {
    // handler for calc list box field
    entry = field.querySelector('gwt-ListBox')
    return entry.value
} // gwtListBoxHandler()

function gwtMiscHandler(field) {
    // handler for non-standard fields
    return 'Nothing to see here.'
} // getMiscHandler()

function rowHandler(rows) {
    // pulls user data from table rows

    invalid_field = 'label'

    sub_tables = rows.querySelectorAll('tables')
    rows.forEach(function(row) {
        field_name = row.className.split(/[ ]+/)[0]                 // initial class name dictates field name
        fields = row.querySelectorAll('td')
        fields.forEach(function(entry) {
            if (entry.className.indexOf(substring) === -1) {        // avoid label fields
                if (entry.className.indexOf('gwt-TextBox')) {
                    console.log(getTextBoxHandler(entry))           // TODO: Needs assignment 
                } else if (entry.className.indexOf('gwt-ListBox')) {
                    console.log(getListBoxHandler(entry))           // TODO: Needs assignment
                } else {
                    console.log(getMiscHandler(entry))              // TODO: Needs assignment
                }
            }
        })
    });

} // rowHandler()

function tableHandler(table) {
    // extracts data rows from table
    result_type = ''                
    result_set = []     

    substring = 'itemsTableDataRow' // string pattern for table data row match           

    rows = table.querySelectorAll("tr")
    rows.forEach(function(row) {
        if (row.className.indexOf(substring) !== -1) {       // check if table row classname is a data row 
            if (result_type === '') { 
                result_type = row.className.split(/[ ]+/)[0] // set the dataset type from the row class
            };
            content = rowHandler(row)
            result_set.push(content)
        }

    return (result_type, result_set);
    });

    return headers
} // tableHandler()

function collectDatasets(){
    // main handler for data collection from page
    var tables = document.querySelectorAll ("table.itemsTable")
    tables.forEach(function(table){
        type, set = tableHandler(table);
        
    });
} // collectDatasets()

/* End of data handling functions for AWS Calc page */

