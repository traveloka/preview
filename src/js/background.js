import "../img/icon-128.png";
import isFilesSection from "./utils/isFilesSection";
import { HISTORY_STATE_UPDATE } from "./utils/events";

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  if (isFilesSection(details.url)) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        event: HISTORY_STATE_UPDATE,
        url: details.url
      });
    });
  }
});
