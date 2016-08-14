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
    fawsNode.setAttribute("id", "fawsContainer");
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
    collectDatasets(ButtonCallback);
    // var fawsNode       = document.createElement ('p');
    // var selectedProduct = document.querySelector("div.gwt-HTML.tab.selected").textContent;
    // fawsNode.innerHTML = 'The button was clicked.';
    // document.getElementById ("fawsContainer").appendChild (fawsNode);
}

function ButtonCallback(content) {
    // temporary callback to display JSON strcture 
    //TODO: Remove this when API present
    alert(JSON.stringify(content));
}

function extend(obj, src) {
    // basic function to merge two hash objects
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}

/* Start of data handling functions for AWS Calc page */

 function gwtMiscHandler(field) {
     // handler for non-standard fields
     console.log('Misc handler called');
     var match_regex = /(SF_[^\s]+)/;
     if (field.className.match(match_regex)) {
       var result = {};
       var fname = field.className.match(match_regex)[0];
       result[fname] = field.innerHTML;
       return result;
     }
     return false;
 } // getMiscHandler()

function rowHandler(rows, form) {
    // pulls user data from table rows
    form = form || false;                   // default form param to false if not passed
    var dataset = {};
    var substring = 'label';
    console.log(rows);

    // collect non-standard table field content
    if (form === false) {
        var selectable_text = rows.querySelectorAll('div');
        selectable_text.forEach(function(e) {
        var tmp = gwtMiscHandler(e);
        if (tmp) { dataset = extend(tmp, dataset); }
        });
    }

    // create array from html collection
    if (form) {
        var subtables = [].slice.call(rows.querySelectorAll('td > div > table'));
    } else {
        var subtables = [].slice.call(rows.querySelectorAll('td > table')); 
    }

    subtables.forEach(function(row) {
        var field_name = row.className.split(/[ ]+/)[0];                        // initial class name dictates field name
        console.log(field_name);
        var cell = [].slice.call(row.querySelectorAll("td"));
        cell.forEach(function(tcell) {
          var fields = [].slice.call(tcell.querySelectorAll('input, select, div'));
          fields.forEach(function(entry) {
            if (entry.className.indexOf(substring) === -1) {                    // avoid label fields
              if (entry.className.split(' ')[0] === 'gwt-TextBox') {
                dataset[field_name] = entry.value;
              } else if (entry.className.split(' ')[0] === 'gwt-ListBox') {
                if (dataset[field_name]) {
                  dataset[field_name] += (' ' + entry.options[entry.selectedIndex].text);
                } else {
                  dataset[field_name] = entry.options[entry.selectedIndex].text;
                }
              }
            }
          });
        });
    });
    return dataset;
} // rowHandler()

function tableHandler(table) {
    // extracts data rows from table
    var result_type = '';
    var result_set = {};

    if (table.className === 'subSection') {                         // table form structure
        console.log('In subsection');
        result_type = table.querySelector('div').textContent.replace(/:/g,'');      // section title is first div element
        console.log(result_type);
        var rows = [].slice.call(table.querySelectorAll("tr"));     // convert html collection to array
        result_set[result_type] = [];
        result_set[result_type].push(rowHandler(rows[1], true)); 
    }  else {                                                       // nested table structure
        console.log('In tables');
        var substring = 'itemsTableDataRow';                        // string pattern for table data row match
        var rows = [].slice.call(table.querySelectorAll("tr"));     // convert html collection to array
        rows.forEach(function(row) {
            if (row.className.indexOf(substring) !== -1) {          // check if table row classname is a data row
                if (result_type === '') {
                    result_type = row.className.split(/[ ]+/)[0];   // set the dataset type from the row class
                    result_set[result_type] = [];
                }
                result_set[result_type].push(rowHandler(row));
            }
        });
        // console.log(result_set);
    }

    return result_set;
} // tableHandler()

function collectDatasets(callback) {
    // main handler for data collection from page
    var set = {};
    var page_content = [];
    var selected_tab = document.querySelector("div.gwt-HTML.tab.selected").textContent;
    
    // find parsable data structures
    page_content.push(document.querySelectorAll("table.itemsTable"));
    page_content.push(document.querySelectorAll("table.subSection")); 
    
    // pull content from parsable data structures
    set[selected_tab] = {};
    page_content.forEach(function(element) {
        [].slice.call(element).forEach(function(entry) {
            extend(set[selected_tab], tableHandler(entry));
        });
    });
    
    console.log(set);
    callback(set);
} // collectDatasets()

/* End of data handling functions for AWS Calc page */

