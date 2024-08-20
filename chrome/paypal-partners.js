async function main() {
    const response = await fetch('https://www.paypal.com/myaccount/privacy/cookiePrefs')
    const html = await response.text()
    const parser = new DOMParser();
    const dom1 = parser.parseFromString(html, 'text/html');
    const serverData = JSON.parse(dom1.getElementById('server-data').textContent);
    const dom2 = parser.parseFromString(serverData.data.html, 'text/html');
    const consents = Array.from(
        dom2.querySelectorAll('.partnerContentLinkUrl')
    )
    .map((a) => {
        return {
            policyUrl: a.href,
            name: a.textContent.split(' ')[0].split('-').slice(0, -1).join('-')
        };
    })
    chrome.runtime.sendMessage(consents);
}

chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.target !== 'offscreen') {
        // Not meant for this offscreen document
        return false;
    }

    if (msg.type !== 'parse-paypal-partners') {
        console.warn('Unexpected message type', msg.type);
        return false;
    }

    main();
});
