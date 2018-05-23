import domFind from "../content/utils/domFind";
import fetchHtml from "./fetchHtml";
import mapCodeOwners from "./mapCodeOwners";
import getTargetBranch from "./getTargetBranch";

export default async function getCodeOwners(repo) {
  try {
    const branch = getTargetBranch();
    const html = await fetchHtml(`/blob/${branch}/.github/CODEOWNERS`, repo);
    const codeowners = domFind(
      html,
      root => root.querySelector(".blob-wrapper table").innerText
    );
    return mapCodeOwners(codeowners);
  } catch (err) {
    return [];
  }
}
