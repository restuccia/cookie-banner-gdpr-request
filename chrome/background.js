chrome.runtime.onInstalled.addListener(async () => {
    const done = await chrome.storage.session.set({ "cbgr": {} })
})

chrome.tabs.onUpdated.addListener(async (tabId) => {
    'use strict';

    const tab = await getCurrentTab();
    if (!tab) {
        return;
    }

    if (tab.url.startsWith('chrome://')) {
        return;
    }

    const { hostname } = new URL(tab.url)

    const { cbgr } = await chrome.storage.session.get(["cbgr"])
    
    if (cbgr[hostname]) {
        // Visited before. Use lastVisited to check again after some time.
    } else {
        cbgr[hostname] = {
            lastVisited: Date.now().valueOf()
        }

        switch (hostname) {
            case 'www.heise.de':
                const cmp = await handleHeise();
                const csv = cmp.vendors.map(({ name, policyUrl }) => { 
                    const { hostname } = new URL(policyUrl);
                    return [name, policyUrl, hostname ]
                });
                cbgr[hostname].vendors = csv;
                // TODO: Surface to human in a future version
                break;
            default:
                // Do nothing
        }

        await chrome.storage.session.set({ cbgr });
    }
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [ tab ] = await chrome.tabs.query(queryOptions);
  return tab;
}

// This might be refactored after handling more sites
async function handleHeise() {
    const response1 = await fetch("https://cmp.heise.de/mms/v2/message?message_id=756676")
    const consentManagementPlatform = await response1.json();
    const consentManagement = JSON.parse(consentManagementPlatform.message_json);
    const response2 = await fetch(`https://cmp.heise.de/consent/tcfv2/privacy-manager/privacy-manager-view?siteId=${consentManagementPlatform.site_id}&vendorListId=${consentManagement.settings.vendorList}`)
    const consents = await response2.json();

    return consents
}
