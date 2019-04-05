import fetchHtml from "./fetchHtml";
import domFind from "../content/utils/domFind";
import Cache from "../content/utils/Cache";

function generateCacheKey(user) {
  return `user:mentions:${user}`;
}

const cache = new Cache();

export default async function getUserMentions(repo) {
  const user = document.querySelector("img.avatar").alt;
  const cacheKey = generateCacheKey(user);
  const cacheData = cache.get(cacheKey);

  if (cacheData) {
    return cacheData;
  }

  const html = await fetchHtml("/");
  const teams = domFind(html, root => {
    // I think the most reliable way to get list of teams is by using text node
    // selector instead of class / data attributes. They may change their attribute
    // as they wish and we still need to update it everytime. Searching text node
    // should minimize this necessary adjustment
    const treeWalker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let textNode;
    while ((textNode = treeWalker.nextNode())) {
      if (textNode.textContent === "Your teams") {
        break;
      }
    }

    let node = textNode.parentNode;
    do {
      // By using while loop, we can use single logic for both beta dashboard
      // and old dashboard
      node = node.parentNode;
      // we still rely on element selector in the end, but ul is less fragile
      // than data-filterable-for attribute selector
    } while (node.querySelector("ul") == null);

    return node.textContent;
  })
    .split("\n")
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `@${t}`);

  const result = teams.concat([user]);
  cache.set(cacheKey, result);
  return result;
}
