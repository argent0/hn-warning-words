/*jslint nomen: true, browser: true, devel: true */
/*global XPathResult:false, _:false*/


var word_marker = {
    /**
     * Global object containg some configurations
     *
     * @type {Object}
     */
    g_configuration: {
        "xpath_selector": "//span[@class='comment']/font|//span/p/font[not(.//u)]"
    },
    /**
     * Global array containing the default list of imprecise words
     *
     * @type {array}
     */
    g_default_imprecise_word_list: [
        "all",
        "always",
        "bad",
        "best",
        "better",
        "correct",
        "difficult",
        "easy",
        "everybody",
        "good",
        "never",
        "new",
        "old",
        "nobody",
        "nothing",
        "some",
        "worst"
    ],
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
        return this.nodes_mathing_xpath_(this.g_configuration.xpath_selector);
    },

    /**
     * Marks the imprecise words
     */
    markdown: function() {
        var paragraph_index = 0,
            paragraph_list = this.paragraph_list_(),
            current_html,
            current_node,
            current_marked_words,
            current_html_words,
            new_inner_html;

        for(paragraph_index = 0; paragraph_index < paragraph_list.length; ++paragraph_index) {
            current_node = paragraph_list[paragraph_index];
            current_html = current_node.innerHTML;
            current_html_words = this.word_list(current_html);
            current_marked_words = _.map(
                current_html_words,
                this.marked_word
            );
            new_inner_html = current_marked_words.join("");
            current_node.innerHTML = new_inner_html;
        }
    },

    /**
     * Split an innterHTML element to its words and returns a list
     */
    word_list: function(innerHTML) {
        console.log("Splitig: " + innerHTML);
        return innerHTML.split(/\b/);
    },

    /**
     * Given a word returns it marked if appropiate
     */
    marked_word: function(word) {
        if (this.g_imprecise_word_list.indexOf(word.toLowerCase()) > -1) {
            return "<span class=\"imprecise\">" + word + "</span>";
        } 
        return word;
    }

};

console.log(word_marker.markdown());


// vim:tabstop=4 shiftwidth=4 sts=4 expandtab smartindent
