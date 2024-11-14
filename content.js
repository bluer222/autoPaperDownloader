chrome.runtime.sendMessage({ action: 'isTab' }, (isTargetTab) => {

    if (isTargetTab == 1) {

        chrome.runtime.sendMessage({ action: 'openInteractUrl', tabUrl: document.getElementsByClassName("gs_rt")[0].firstChild.href });
        window.close();

    } else if (isTargetTab == 2) {

        if (isTargetTab) {
            // Wait for the page to load completely before clicking
            window.addEventListener('load', () => {
                //search for elements
                const elements = document.querySelectorAll('*'); //get all elements
                var bestElement = "";//classlist of product
                //if your webpage has all of the elements longer than this fuxk you
                var length = 1000000000000000000000000;
                winnerContainsPdf = false;
                //for each element
                for (const element of elements) {
                    //make sure it has children, has a link, has an image, has multiple classes, has a $, also avoid carousel's because of ebay
                    if ((element.innerHTML.includes("download") || element.innerHTML.includes("pdf")) && element.innerHTML.includes("href")) {
                        if(element.innerHTML.includes("pdf") && !winnerContainsPdf){
                            bestElement = element;
                            winnerContainsPdf = true;
                        }
                        if (element.innerHTML.length < length && (!winnerContainsPdf || element.innerHTML.includes("pdf"))) {
                            length = element.innerHTML.length;
                            bestElement = element;
                        }
                        console.log(element);
                    }
                }
                if (bestElement == "") {
                    alert("download identification failed");
                    chrome.runtime.sendMessage({ action: 'done'});
                } else {
                    let url = bestElement.innerHTML.match(/href="([^"]+)"/)[1];
                    //if its not a full url(just a path)
                    if (url.charAt(0) == "/") {
                        url = window.location.origin + url;
                    }
                    chrome.runtime.sendMessage({ action: 'download', url: url });
                    window.close();
                }
            });
        }

    }
});
