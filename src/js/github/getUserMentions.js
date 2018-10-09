import fetchHtml from "./fetchHtml";
import domFind from "../content/utils/domFind";

export default async function getUserMentions(repo) {
  const html = await fetchHtml("/");
  const teams = domFind(
    html,
    root =>
      root.querySelector("#your-teams-filter").parentNode.parentNode.children[2]
        .innerText
  )
    .split("\n")
    .filter(Boolean)
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `@${t}`);

  const user =
    "@" +
    domFind(
      html,
      root => root.querySelector(".account-switcher span").innerText
    ).trim();

  return teams.concat([user]);
}
