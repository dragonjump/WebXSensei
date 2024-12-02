
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));


const DEFAULT_DELAY = 1200; // use delay intentionally to allow user see transition of navigation
const tabContentList = []


//LISTEN TO

function handleHighlightedText(tab, actionMode) {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    chrome.runtime.sendMessage({
      action: actionMode,
      text: selectedText
    })

    chrome.sidePanel.open({ windowId: tab.windowId });

  }
}
/**
 * Sends a message to the background script to handle navigation wisdom
 * @param {tabs.Tab} tab The tab that triggered the context menu
 * @param {string} actionMode The action mode (e.g. "navigation-wisdom")
 */
function handleNavigationWisdom(tab, actionMode) {

  chrome.runtime.sendMessage({
    action: actionMode,
  })
}


chrome.contextMenus.create({
  id: "navigationWisdom2",
  title: "Web X Sensei - Browsing Mentor",
  contexts: ["all"],
});

chrome.contextMenus.create({
  id: "highlightForEnlightment",
  title: "Enlighten Me",
  contexts: ["selection"],// Show only when text is selected,
});

chrome.contextMenus.create({
  id: "highlightForContribution",
  title: "Insightful Response",
  contexts: ["selection"],// Show only when text is selected,
});

// chrome.contextMenus.create({
//   id: "navigationWisdom",
//   title: "Summon Navigation & Wisdom ",
//   contexts: ["selection"],// Show only when text is selected,
// });

chrome.contextMenus.onClicked.addListener((info, tab) => {


  if (info.menuItemId === "highlightForEnlightment") {
    chrome.sidePanel.open({ windowId: tab.windowId });
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: handleHighlightedText,
        args: [tab, 'higlightTextForEnlightment']
      });

    }, DEFAULT_DELAY);
  }

  if (info.menuItemId === 'highlightForContribution') {
    chrome.sidePanel.open({ windowId: tab.windowId });
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: handleHighlightedText,
        args: [tab, 'higlightTextForContribution']
      });
    }, DEFAULT_DELAY);
  }

  if (info.menuItemId === 'navigationWisdom' || info.menuItemId === 'navigationWisdom2') {
    chrome.sidePanel.open({ windowId: tab.windowId });
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: handleNavigationWisdom,
        args: [tab, 'navigationWisdom']
      });
    }, DEFAULT_DELAY);
  }

});

chrome.runtime.onInstalled.addListener(() => {


});