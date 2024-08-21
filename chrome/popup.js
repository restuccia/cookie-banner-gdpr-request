async function populateTableFromStore() {
  const { cbgr } = await chrome.storage.session.get(["cbgr"])
  const tab = await getCurrentTab();

  if (!tab) {
     return;
   }

   if (tab.url.startsWith('chrome://')) {
     return;
   }

   const { hostname } = new URL(tab.url)
   if (!cbgr[hostname]) {
     return;
   }

   populateTable(cbgr[hostname].vendors)
}

function populateTable(vendors) {
  const status = document.getElementById('status');
  const table = document.querySelector('table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  thead.innerHTML = '';
  tbody.innerHTML = '';

  if (vendors.length > 0) {
    status.textContent = vendors.length + ' partners found.';
    chrome.action.setBadgeText({ text: vendors.length.toString() });

    const theadTr = document.createElement('tr');
    const nameTh = document.createElement('th');
    const policyUrlTh = document.createElement('th');

    nameTh.scope = 'col';
    nameTh.textContent = 'Name';

    policyUrlTh.scope = 'col';
    policyUrlTh.textContent = 'Policy URL';

    theadTr.appendChild(nameTh);
    theadTr.appendChild(policyUrlTh);
    thead.appendChild(theadTr);
  } else {
    status.textContent = 'Nothing found. Reload the page and try again.';
    chrome.action.setBadgeText({ text: '0' });
  }

  vendors.forEach((vendor) => {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    const policyUrl = document.createElement('td');
    const anchor = document.createElement('a');

    name.textContent = vendor[0];
    anchor.textContent = vendor[1];
    anchor.href = vendor[1];
    anchor.target = '_blank';

    policyUrl.appendChild(anchor);
    tr.appendChild(name);
    tr.appendChild(policyUrl);
    tbody.appendChild(tr);
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [ tab ] = await chrome.tabs.query(queryOptions);
  return tab;
}

document.addEventListener('DOMContentLoaded', async function () {
    await chrome.action.setBadgeText({text: '🔁'});
    const tab = await getCurrentTab();
    await chrome.runtime.sendMessage({
        msg: 'popup-get-partners',
        data: tab?.url
    });
    await populateTableFromStore();
})
