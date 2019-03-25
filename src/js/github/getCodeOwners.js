import domFind from "../content/utils/domFind";
import fetchHtml from "./fetchHtml";
import getTargetBranch from "./getTargetBranch";

export function mapCodeOwners(content) {
  return content
    .split("\n")
    .filter(Boolean)
    .map(entry => entry.trim())
    .filter(entry => entry && !entry.startsWith("#"))
    .map(entry => {
      const [path, ...owners] = entry.split(/\s+/);
      return {
        path,
        owners
      };
    });
}

export default async function getCodeOwners(repo) {
  try {
    const branch = getTargetBranch();
    const html = await fetchHtml(`/blob/${branch}/.github/CODEOWNERS`, repo);
    const codeownerContent = domFind(
      html,
      root => root.querySelector(".blob-wrapper table").innerText
    );
    return mapCodeOwners(codeownerContent);
  } catch (err) {
    return [];
  }
}
