import fetchHtml from "./fetchHtml";
import domFind from "../content/utils/domFind";

export default async function getDefaultBranch(repo) {
  try {
    const html = await fetchHtml("/", repo);
    const result = domFind(
      html,
      root => root.querySelector(".file-navigation .select-menu span").innerText
    );
    return result.trim();
  } catch (err) {
    // default fallback
    return "master";
  }
}
