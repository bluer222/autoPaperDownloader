chrome.runtime.sendMessage({ action: 'isTab' }, (isTargetTab) => {

    if (isTargetTab == 1) {
        let firstResult = document.getElementsByClassName("gs_rt")[0].firstChild.href;
        if (firstResult === undefined) {
            //if it is a direct-pdf result then download
            firstResult = document.getElementsByClassName("gs_or_ggsm")[0].firstChild.href;
            //make sure its a pdf
            isUrlPdf(firstResult).then((isPdf) => {
                if (isPdf) {
                    chrome.runtime.sendMessage({ action: 'earlyDownload', url: firstResult });
                } else {
                    chrome.runtime.sendMessage({ action: 'openInteractUrl', url: firstResult });
                }
                window.close();
            });
        } else {
            //if it is a normal result then continue normally
            chrome.runtime.sendMessage({ action: 'openInteractUrl', tabUrl: firstResult });
            window.close();
        }

    } else if (isTargetTab == 2) {

        if (isTargetTab) {
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
                    if (element.innerHTML.includes("pdf") && !winnerContainsPdf) {
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
                alert("failed to find download button");
                chrome.runtime.sendMessage({ action: 'done' });
            } else {

                let url = bestElement.innerHTML.match(/href="([^"]+)"/)[1];
                //if its not a full url(just a path)
                if (url.charAt(0) == "/") {
                    url = window.location.origin + url;
                }
                //check if its a pdf
                isUrlPdf(url).then((isPdf) => {
                    if (isPdf) {
                        chrome.runtime.sendMessage({ action: 'download', url: url });
                        window.close();
                    } else {
                        alert("failed to find download button");
                        chrome.runtime.sendMessage({ action: 'done' });
                    }
                });
            }
        }

    }
});
async function isUrlPdf(url) {
    // Check for explicit .pdf extension or "pdf" in the URL
    if (url.endsWith(".pdf") || url.includes("/pdf/")) {
        return true;
    }

    // Check MIME type using a HEAD request
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        return contentType == 'application/pdf';
    }

    return false;
}