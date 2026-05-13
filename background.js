chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url?.startsWith("https://music.youtube.com/")) {
    return;
  }

  await chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["styles.css"]
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["scripts.js"]
  });
});