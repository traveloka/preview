import getRepoInfoFromUrl from "./github/getRepoInfoFromUrl";
import getCodeOwners from "./github/getCodeOwners";
import getUserMentions from "./github/getUserMentions";

import observe from "./content/utils/observe";
import reorderFiles from "./content/reorderFiles";
import isFilesSection from "./utils/isFilesSection";
import isPullsSection from "./utils/isPullsSection";
import { HISTORY_STATE_UPDATE } from "./utils/events";
import isChangeRequestUpdated from "./github/isChangeRequestUpdated";

import "./content.css";

let observer;

const runFileFilter = async prUrl => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  const repo = getRepoInfoFromUrl(prUrl);

  const [owners, userMentions] = await Promise.all([
    getCodeOwners(repo),
    getUserMentions(repo)
  ]);

  const callback = () => reorderFiles(owners, userMentions);
  observer = observe("#files", callback, { childList: true, subtree: true });
};

const runPullsSection = async prUrl => {
  const repo = getRepoInfoFromUrl(prUrl);
  const prItems = document.querySelectorAll(
    ".js-active-navigation-container > li"
  );
  for (const node of prItems) {
    const statusNode = node.querySelector(".mt-1 > .d-inline-block > a");
    const status = statusNode ? statusNode.innerHTML.trim() : "";
    if (status.includes("Changes requested")) {
      const prNumber = node.id
        .toString()
        .substring(6)
        .trim();
      const changed = await isChangeRequestUpdated(prNumber, repo);
      if (changed) {
        node.classList.add("request-updated");
      }
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.event === HISTORY_STATE_UPDATE) {
    if (isFilesSection(request.url)) {
      runFileFilter(request.url);
    } else if (isPullsSection(request.url)) {
      runPullsSection(request.url);
    }
  }
});

// From URL
if (isFilesSection(window.location.href)) {
  runFileFilter(window.location.href);
} else if (isPullsSection(window.location.href)) {
  runPullsSection(window.location.href);
}
