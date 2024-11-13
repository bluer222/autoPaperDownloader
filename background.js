
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
            chrome.windows.create({
                url: searchUrl + encodeURIComponent(search),
                type: 'popup',
                focused: true
            }, (window) => {
                searchTabId.push(window.tabs[0].id);
            });
        });
    }
    if (request.action === 'openInteractUrl') {
        //remove item from search tabs
        searchTabId.splice(searchTabId.indexOf(sender.tab.id), 1);

        console.log("opening interact url");
        chrome.windows.create({
            url: request.tabUrl,
            type: 'popup',
            focused: true
        }, (window) => {
            interactTabId.push(window.tabs[0].id);
        });
    }
    if (request.action === 'openDownloadUrl') {
        //remove item from interact tabs
        //remove item from search tabs
        interactTabId.splice(interactTabIdv.indexOf(sender.tab.id), 1);

        console.log("opening download url");
        chrome.windows.create({
            url: request.tabUrl,
            type: 'popup',
            focused: true
        }, (window) => {
            // interactTabId = window.tabs[0].id;
        });
    }
    /*
if (request.action === 'searchTab') {
  searchTabId = request.tabId;
}*/
    if (request.action === 'isTab') {
        if (searchTabId.includes(sender.tab.id)) {
            sendResponse(1);
        }
        if (interactTabId.includes(sender.tab.id)) {
            sendResponse(2);
        }
    }
});