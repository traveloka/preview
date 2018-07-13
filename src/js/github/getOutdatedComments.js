import domFind from "../content/utils/domFind";
import fetchHtml from "./fetchHtml";

export default async function getOutdatedComments(repo) {
  try {
    const html = await fetchHtml(
      `/${repo.owner}/${repo.name}/pull/${repo.prId}`
    );
    // type Comment = { line: number, content: string }
    // type comments = Map<string, CommentEntry>
    const comments = domFind(html, root => {
      const map = {};
      const allComments = root.querySelectorAll(".outdated-comment");
      for (const c of allComments) {
        const fileDom = c.querySelector(".file-info");
        const filename = fileDom.getAttribute("title");
        const line = c
          .querySelector(
            ".diff-table tr:last-child td.blob-num:not(.empty-cell)"
          )
          .getAttribute("data-line-number");
        const ln = Number(line);
        let content = c.querySelector(".js-comments-holder");
        if (!map[filename]) {
          map[filename] = [
            {
              line: ln,
              content
            }
          ];
        } else {
          map[filename].push({ line: ln, content });
        }
      }
      return map;
    });
    return comments;
  } catch (err) {
    console.error(err.stack);
    return {};
  }
}
