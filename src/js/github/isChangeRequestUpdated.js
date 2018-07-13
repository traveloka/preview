import fetchHtml from "./fetchHtml";
import domFind from "../content/utils/domFind";

/**
 * Check if the PR have updated commits from author after request change from reviewer
 * Notes : This method assume the prNumber have request change on it
 * @param {int} prNumber The PR number
 * @param {Object} repo The repository containing the PR
 */
export default async function isChangeRequestUpdated(prNumber, repo) {
  try {
    const html = await fetchHtml("/pull/" + prNumber, repo);
    const events = domFind(html, root =>
      root.querySelectorAll(".discussion-item-header")
    );
    for (var i = events.length - 1; i >= 0; i--) {
      if (isRequestChangeEvent(events[i])) {
        return false;
      } else if (isAuthorCommitEvent(events[i])) {
        return true;
      }
    }
  } catch (err) {
    return false;
  }
}

function isRequestChangeEvent(node) {
  if (node.innerText.includes("requested changes")) return true;
  return false;
}

//Notes : only author commit will return true
function isAuthorCommitEvent(node) {
  if (
    node.innerText.includes("added some commit") ||
    node.innerText.includes("New changes since you last viewed")
  )
    return true;
  return false;
}
