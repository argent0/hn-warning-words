/*global _:false, document:false */

var user_interface = {
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
    list_current_words: function() {
        var word_index,
            word_list_element = document.createElement('ul'),
            word_element;
        for(word_index = 0; word_index < this.g_imprecise_word_list.length; ++word_index) {
            word_element = document.createElement('li');
            word_element.innerText = this.g_imprecise_word_list[word_index];
            word_list_element.appendChild(word_element);
        }

        document.body.appendChild(word_list_element);
    }
};

document.addEventListener('DOMContentLoaded', function () {
	console.log("Loading popup");
    user_interface.list_current_words();
});

// vim:tabstop=4 shiftwidth=4 sts=4 expandtab smartindent
