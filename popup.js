document.getElementById('search-button').addEventListener('click', () => {
    const searchQuery = document.getElementById('search-box').value;
    let searches = searchQuery.split(",");
  // tell the backround to open the tab instead of opening it then telling the backgound the tab id
  chrome.runtime.sendMessage({ action: 'startSearch', query: searches });
/*
    chrome.windows.create({
      url: searchUrl,
      type: 'popup',
      focused: true
    }, (window) => {
      // Send the tab ID to the background script
      chrome.runtime.sendMessage({ action: 'searchTab', tabId: window.tabs[0].id });
    });*/
  });