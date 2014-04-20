chrome.extension.onMessage.addListener(function (request, sender) {
    if (request === "show_page_action") {
        chrome.pageAction.show(sender.tab.id);
    }
});
// vim:tabstop=4 shiftwidth=4 sts=4 expandtab smartindent
