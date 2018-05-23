import domFind from "../content/utils/domFind";
import fetchHtml from "./fetchHtml";
import mapCodeOwners from "./mapCodeOwners";

export default async function getCodeOwners(repo) {
  try {
    const html = await fetchHtml("/blob/master/.github/CODEOWNERS", repo);
    const codeowners = domFind(
      html,
      root => root.querySelector(".blob-wrapper table").innerText
    );
    return mapCodeOwners(codeowners);
  } catch (err) {
    return [];
  }
}
