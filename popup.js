/*global _:false, document:false */

var user_interface = {
    g_list_element_id_prefix: "wl-",
    g_word_list_id: "word-list",
    g_word_input_field_id: "word-input-text",
    g_imprecise_word_list: [
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
    remove_word_button: function(word) {
        var button_element = document.createElement('button'),
            t = this;
        button_element.innerText = 'X';
        button_element.onclick = function() {
            var word_element = this.parentElement,
                word_list_element = word_element.parentElement;
            t.remove_word(word);
            word_list_element.removeChild(word_element);
        };
        return button_element;
    },
    word_element: function(word) {
        var word_element = document.createElement('li'),
            remove_word_button = this.remove_word_button(word);
        word_element.innerText = word;
        word_element.id = this.g_list_element_id_prefix + word;
        word_element.appendChild(remove_word_button);
        return word_element;
    },
    refresh_current_word_list: function() {
        var word_index,
            word_list_element = document.createElement('ul'),
            word_element,
            word_text;

        this.remove_word_list();

        word_list_element.id = this.g_word_list_id;

        for(word_index = 0; word_index < this.g_imprecise_word_list.length; ++word_index) {
            word_text = this.g_imprecise_word_list[word_index];
            word_element = this.word_element(word_text);
            word_list_element.appendChild(word_element);
        }

        document.body.appendChild(word_list_element);
    },
    remove_word_list: function() {
        var word_list_element = document.getElementById(this.g_word_list_id);
        if (word_list_element) {
            word_list_element.parentElement.removeChild(word_list_element);
        }
    },
    init: function() {
        var add_btn = document.getElementById('btn-add');
        var t = this;
        add_btn.onclick = function () {
            var input_field_element = document.getElementById(t.g_word_input_field_id);
            t.add_word(input_field_element.value);
            t.refresh_current_word_list();
            console.log(t.g_imprecise_word_list);
        };
    },
    add_word: function(word) {
        var lower_case_word = word.toLowerCase();
        if (this.is_word_listed(lower_case_word)) {
            console.log("Word already listed!");
        } else {
            this.g_imprecise_word_list.push(lower_case_word);
            this.g_imprecise_word_list.sort();
        }
    },
    remove_word: function(word) {
        var lower_case_word = word.toLowerCase();
        if ( this.is_word_listed(lower_case_word) ) {
            var word_index = this.g_imprecise_word_list.indexOf(lower_case_word);
            this.g_imprecise_word_list.splice(word_index,1);
        } else {
            console.log("Removing non listed word: " + lower_case_word);
        }
    },
    is_word_listed: function(word) {
        return this.g_imprecise_word_list.indexOf(word.toLowerCase()) !== -1;
    }
};

document.addEventListener('DOMContentLoaded', function () {
	console.log("Loading popup");
    user_interface.init();
    user_interface.refresh_current_word_list();
});

// vim:tabstop=4 shiftwidth=4 sts=4 expandtab smartindent
