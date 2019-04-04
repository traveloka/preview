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
import isPullsSection from "./utils/isPullsSection";
import { HISTORY_STATE_UPDATE } from "./utils/events";
import { FILTER, HIDEOTHER, SHOWALL } from "./constants/toggleValueEnum";
import isChangeRequestUpdated from "./github/isChangeRequestUpdated";

import "./content.css";

let observer;
const STORAGE_KEY = "preview:mode";

const runFileFilter = async prUrl => {
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
    runFileFilter(window.location.href);
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

const runPullsSection = async prUrl => {
  const repo = getRepoInfoFromUrl(prUrl);
  const prItems = document.querySelectorAll(
    ".js-active-navigation-container > div"
  );

  const promises = Array.from(prItems).map(async node => {
    const statusNode = node.querySelector(".mt-1 > .d-inline-block > a");
    const status = statusNode ? statusNode.innerHTML.trim() : "";

    if (status.includes("Changes requested")) {
      const prNumber = node.id
        .toString()
        .substring(6)
        .trim();

      const changed = await isChangeRequestUpdated(prNumber, repo);
      return {
        changed,
        statusNode
      };
    }
    return {
      changed: false,
      statusNode
    };
  });

  Promise.all(promises).then(results => {
    results.forEach(({ changed, statusNode }) => {
      if (changed) {
        statusNode.innerText = "Changes requested • PR updated";
      }
    });
  });
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
