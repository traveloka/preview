import getRepoInfoFromUrl from "./github/getRepoInfoFromUrl";
import getCodeOwners from "./github/getCodeOwners";
import getUserMentions from "./github/getUserMentions";

import observe from "./content/utils/observe";
import reorderFiles from "./content/reorderFiles";

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

const isFilesSection = () => window.location.pathname.endsWith("/files");

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.preview == "background") {
    execute(request.location);
  }
});

// From URL
if (isFilesSection()) {
  execute(window.location.href);
}
