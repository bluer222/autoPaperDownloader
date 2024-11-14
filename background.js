
let searchTabId = [];
let interactTabId = [];
let urlsToDownload = [];


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.action);
    if (request.action === "download" || request.action === "done") {
        interactTabId.splice(interactTabId.indexOf(sender.tab.id), 1);
        if (request.action === "download") {
            urlsToDownload.push(request.url)
        }
        console.log(urlsToDownload);
        if (interactTabId.length === 0) {
                download(urlsToDownload, 0);
        
        }

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
async function download(urls, index) {
    console.log(urls);
    console.log(index);
    chrome.downloads.download({
        url: urls[index]
    }).then(() => {
        if(index+1 !== urls.length){
        download(urls, index+1);
        }
    });
}