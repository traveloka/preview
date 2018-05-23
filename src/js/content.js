import getRepoInfoFromUrl from "./github/getRepoInfoFromUrl";
import getCodeOwners from "./github/getCodeOwners";
import getUserMentions from "./github/getUserMentions";

import reorderFiles from "./content/reorderFiles";

const execute = async prUrl => {
  const repo = getRepoInfoFromUrl(prUrl);

  const [owners, userMentions] = await Promise.all([
    getCodeOwners(repo),
    getUserMentions(repo)
  ]);

  reorderFiles(owners, userMentions);
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
