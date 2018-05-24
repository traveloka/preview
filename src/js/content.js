import getRepoInfoFromUrl from "./github/getRepoInfoFromUrl";
import getCodeOwners from "./github/getCodeOwners";
import getUserMentions from "./github/getUserMentions";

import observe from "./content/utils/observe";
import reorderFiles from "./content/reorderFiles";
import isFilesSection from "./utils/isFilesSection";
import { HISTORY_STATE_UPDATE } from "./utils/events";

let observer;

const execute = async prUrl => {
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

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.event === "historyStateUpdated") {
    execute(request.url);
  }
});

// From URL
if (isFilesSection(window.location.href)) {
  execute(window.location.href);
}
