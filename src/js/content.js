import storage from "./chrome/storage";
import getRepoInfoFromUrl from "./github/getRepoInfoFromUrl";
import getCodeOwners from "./github/getCodeOwners";
import getUserMentions from "./github/getUserMentions";
import shouldEnable from "./github/shouldEnable";

import observe from "./content/utils/observe";
import insertOutdatedComments from "./content/insertOutdatedComments";
import applyPreview from "./content/applyPreview";
import injectToggle from "./content/injectToggle";
import isFilesSection from "./utils/isFilesSection";
import { HISTORY_STATE_UPDATE } from "./utils/events";
import { FILTER, HIDEOTHER, SHOWALL } from "./constants/toggleValueEnum";

let observer;

const STORAGE_KEY = "preview:mode";

const execute = async prUrl => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (!shouldEnable()) {
    return;
  }

  let mode = await storage.get(STORAGE_KEY);
  if (![FILTER, HIDEOTHER, SHOWALL].includes(mode)) {
    mode = FILTER;
  }

  const repo = getRepoInfoFromUrl(prUrl);

  const [owners, userMentions] = await Promise.all([
    getCodeOwners(repo),
    getUserMentions(repo)
  ]);

  const toggleSwitchCallback = async value => {
    await storage.set(STORAGE_KEY, value);
    execute(window.location.href);
  };

  injectToggle(mode, toggleSwitchCallback);
  const observeCallback = () => {
    insertOutdatedComments(repo);
    applyPreview(mode, owners, userMentions);
  };
  observer = observe("#files", observeCallback, {
    childList: true,
    subtree: true
  });
};

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.event === HISTORY_STATE_UPDATE) {
    execute(request.url);
  }
});

// From URL
if (isFilesSection(window.location.href)) {
  execute(window.location.href);
}
