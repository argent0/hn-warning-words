/*jslint nomen: true, browser: true, devel: true */
/*global XPathResult:false, _:false*/

/**
 * Global variable containing the default list of imprecise words
 *
 * @type {array}
 */
var g_imprecise_word_list = [
    "all",
    "some"
];

/**
 * Global object containg some configurations
 *
 * @type {Object}
 */

var g_configuration = {
    "xpath_selector": "//span/font|//span/p"
};

var word_marker = {
    nodes_mathing_xpath_: function(STR_XPATH) {
        var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres = xresult.iterateNext();
        while (xres) {
            xnodes.push(xres);
            xres = xresult.iterateNext();
        }

        return xnodes;
    },

    /**
     * Returns a list of all comments text in the current comments page.
     */
    paragraph_list_: function() {
        return this.nodes_mathing_xpath_(g_configuration.xpath_selector);
    },

    markdown: function() {
        var paragraph_index = 0,
            paragraph_list = this.paragraph_list_(),
            current_text,
            current_node;

        for(paragraph_index = 0; paragraph_index < paragraph_list.length; ++paragraph_index) {
            current_node = paragraph_list[paragraph_index];
            current_text = current_node.innerHTML;
            current_node.innerHTML = "<span class=\"imprecise\">" + current_text + "</span>";
        }
    }
};

console.log(word_marker.markdown());


// vim:tabstop=4 shiftwidth=4 sts=4 expandtab smartindent
