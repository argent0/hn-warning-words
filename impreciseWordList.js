/*global chrome: false */

var ImpreciseWordList = (function() {
    "use strict";

    function ImpreciseWordList(onDone) {
        this.g_configuration = {
            "default_imprecise_word_list": [
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
            "imprecise_word_list_storage_key": "imprecise_word_list"
        };
        this.g_imprecise_word_list = [];
        this.ready = false;
        this.onReady = onDone;

        var t = this;

        this.after_loading_local_storage_imprecise_word_list(
            function(stored_imprecise_word_list) {
            if (stored_imprecise_word_list.length > 0) {
                t.g_imprecise_word_list = stored_imprecise_word_list;
            } else {
                t.g_imprecise_word_list = t.g_configuration.default_imprecise_word_list;
            }
            t.ready = true;
            t.onReady();
        });
    }

    /**
     * Retrieves the list of user-defined imprecise words from local storage
     * @method after_loading_local_storage_imprecise_word_list 
     *
     * @param {function(Array stored_imprecise_word_list)} onDone - to be 
     * called after attempting to load the word list from local storage
     *
     */
    ImpreciseWordList.prototype.after_loading_local_storage_imprecise_word_list = function(onDone) {
        var t = this;
        chrome.storage.sync.get(
            this.g_configuration.imprecise_word_list_storage_key,
            function(items) {
                var stored_imprecise_word_list = items[t.g_configuration.imprecise_word_list_storage_key];
                if (stored_imprecise_word_list === undefined) {
                    stored_imprecise_word_list = [];
                }
                onDone(stored_imprecise_word_list);
            });
    };


    ImpreciseWordList.prototype.store_imprecise_word_list = function() {
        var object = {};
        object[this.g_configuration.imprecise_word_list_storage_key] = this.g_imprecise_word_list;
        chrome.storage.sync.set(
            object,
            function() {
                console.log("Saved imprecise word list");
        });
    };

    ImpreciseWordList.prototype.add_word = function(word) {
        console.assert(this.ready, "Not ready");
        var lower_case_word = word.toLowerCase();
        if (this.is_word_listed(lower_case_word)) {
            console.log("Word already listed!");
        } else {
            this.g_imprecise_word_list.push(lower_case_word);
            this.g_imprecise_word_list.sort();
        }
    };

    ImpreciseWordList.prototype.remove_word = function(word) {
        console.assert(this.ready, "Not ready");
        var lower_case_word = word.toLowerCase();
        if ( this.is_word_listed(lower_case_word) ) {
            var word_index = this.g_imprecise_word_list.indexOf(lower_case_word);
            this.g_imprecise_word_list.splice(word_index,1);
        } else {
            console.log("Removing non listed word: " + lower_case_word);
        }
    };

    ImpreciseWordList.prototype.is_word_listed = function(word) {
        console.assert(this.ready, "Not ready");
        var lower_case_word = word.toLowerCase();
        return this.g_imprecise_word_list.indexOf(lower_case_word) !== -1;
    };

    ImpreciseWordList.prototype.list = function() {
        //_TODO: Return a copy instead
        console.assert(this.ready, "Not ready");
        return this.g_imprecise_word_list;
    };

    ImpreciseWordList.prototype.length = function() {
        console.assert(this.ready, "Not ready");
        return this.g_imprecise_word_list.length;
    };

    ImpreciseWordList.prototype.at = function(index) {
        console.assert(this.ready, "Not ready");
        console.assert(index < this.length());
        return this.g_imprecise_word_list[index];
    };

    return ImpreciseWordList;
}());

// vim:tabstop=4 shiftwidth=4 sts=4 expandtab smartindent
