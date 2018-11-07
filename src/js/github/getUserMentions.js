import fetchHtml from "./fetchHtml";
import domFind from "../content/utils/domFind";

export default async function getUserMentions(repo) {
  const html = await fetchHtml("/");
  const teams = domFind(html, root => {
    const betaDashboardTeamsNode = root.querySelector("#your-teams-filter")
      .parentNode.parentNode.children[2];
    if (betaDashboardTeamsNode) {
      return betaDashboardTeamsNode.innerText;
    }

    // user maybe still using old dashboard
    return root.querySelector("[data-filterable-for='your-teams-filter']")
      .innerText;
  })
    .split("\n")
    .filter(Boolean)
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `@${t}`);

  const user =
    "@" +
    domFind(html, root => {
      const betaDashboardAccountSwitcher = root.querySelector(
        ".account-switcher span"
      );
      if (betaDashboardAccountSwitcher) {
        return betaDashboardAccountSwitcher.innerText;
      }

      return root.querySelector(".account-switcher-truncate-override")
        .innerText;
    }).trim();

  return teams.concat([user]);
}
