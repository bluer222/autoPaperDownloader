
let searchTabId = [];
let interactTabId = [];


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "download") {
        chrome.downloads.download({
            url: request.url
        });
    }
    if (request.action === 'startSearch') {
        const searchUrl = 'https://scholar.google.com/scholar?q=';

        request.query.forEach(search => {
            chrome.tabs.create({
                url: searchUrl + encodeURIComponent(search),
            }, (tab) => {
                searchTabId.push(tab.id);
            });
        });
    }
    if (request.action === 'openInteractUrl') {
        //remove item from search tabs
        searchTabId.splice(searchTabId.indexOf(sender.tab.id), 1);

        console.log("opening interact url");
        chrome.tabs.create({
            url: request.tabUrl,
        }, (tab) => {
            interactTabId.push(tab.id);
        });
    }
    if (request.action === 'isTab') {
        if (searchTabId.includes(sender.tab.id)) {
            sendResponse(1);
        }
        if (interactTabId.includes(sender.tab.id)) {
            sendResponse(2);
        }
    }
});