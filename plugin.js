/*jslint nomen: true, browser: true, devel: true */
/*global XPathResult:false, _:false, ImpreciseWordList:false, chrome:false, $:false*/


var word_marker = {
    /**
     * Global object containg some configurations
     *
     * @type {Object}
     */
    g_configuration: {
        "xpath_selector": "//span[@class='comment']/font|//span/p/font[not(.//u)]",
        "imprecise_word_list_storage_key": "imprecise_word_list"
    },
    init: function() {
        var t = this;
        this.g_imprecise_word_list = new ImpreciseWordList(
            function() {
                t.markdown();
                t.track_imprecise_word_list_changes();
        });
    },
    track_imprecise_word_list_changes: function() {
        var that = this;
        chrome.storage.onChanged.addListener(function(changes) {
            var storage_key = that.g_configuration.imprecise_word_list_storage_key;
            if (changes.hasOwnProperty(storage_key)){
                that.g_imprecise_word_list.g_imprecise_word_list = changes[storage_key].newValue;
                that.remove_marking();
                that.markdown();
            }
        });
    },
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
            new_inner_html,
            t = this,
            mark_word_mapper = function(triplet) { 
                var is_white_space = triplet[0].match(/\s/),// || (triplet[0] === ">"),
                    is_null = triplet[0] === "",
                    trailing_space = triplet[2].match(/\s/);// || (triplet[2] === "<");
                if (is_white_space || is_null || trailing_space) {
                    triplet[1] = t.marked_word(triplet[1]);
                }
                return triplet[1];
            };

        for(paragraph_index = 0; paragraph_index < paragraph_list.length; ++paragraph_index) {
            current_node = paragraph_list[paragraph_index];
            current_html = current_node.innerHTML;
            current_html_words = this.word_list(current_html);
            current_marked_words = _.map(
                this.triplets(current_html_words),
                mark_word_mapper
            );
            new_inner_html = current_marked_words.join("");
            current_node.innerHTML = new_inner_html;
        }
    },

    /**
     * Split an innterHTML element to its words and returns a list
     */
    word_list: function(innerHTML) {
        return innerHTML.split(/\b/);
    },

    /**
     * Given a word returns it marked if appropiate
     */
    marked_word: function(word) {
        if (this.g_imprecise_word_list.is_word_listed(word)) {
            return "<span class=\"imprecise\">" + word + "</span>";
        } 
        return word;
    },

    /**
     * Remove markings
     */
    remove_marking: function() {
        var that = this;
        $.each( $("span.imprecise"), function () {
            console.log(this.innerText);
            var word = this.innerText;
            if (!that.g_imprecise_word_list.is_word_listed(word)) {
                $(this).removeClass("imprecise");
                $(this).addClass("precise");
            }
            return true;
        });
        $("span.precise").each( function () {
            var word = $(this).text();
            if (that.g_imprecise_word_list.is_word_listed(word)) {
                $(this).removeClass("precise");
                $(this).addClass("imprecise");
            }
            return true;
        });
    },

    /**
     * Array triplets
     */

    triplets: function(array) {
        var index,
            ret = [],
            null_character = "\u0000";
        if (array.length > 0) {
            if (array.length === 1) {
                ret.push([null_character, array[index], null_character ]);
                return ret;
            }
            ret.push([null_character, array[0], array[1]]);
            for (index = 1; index < array.length - 1; ++index) {
                ret.push([array[index-1], array[index], array[index + 1]]);
            }
            ret.push([array[array.length - 2], array[array.length - 1], null_character]);
        }

        return ret;
    },

};

word_marker.init();
chrome.extension.sendMessage("show_page_action");
// vim:tabstop=4 shiftwidth=4 sts=4 expandtab smartindent
