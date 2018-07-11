import getOutdatedComments from "../github/getOutdatedComments";
import { oneLineTrim } from "common-tags";

const COMMENT_TEMPLATE = oneLineTrim`
    <td class="blob-num empty-cell"></td>
    <td class="empty-cell"></td>
    <td class="line-comments" colspan="2">
      <div class="review-thread comment-holder">
      </div>
    </td>
`;

export default async function insertOutdatedComments(repo) {
  try {
    const comments = await getOutdatedComments(repo);
    const fileHeaders = document.querySelectorAll(".file");

    for (const fileHeader of fileHeaders) {
      const path = fileHeader.querySelector(".file-header").dataset.path;
      if (comments[path]) {
        comments[path].forEach(({ line, content }) => {
          console.log("insert to line %s", line);
          if (content === null) {
            return;
          }

          const parent = fileHeader.querySelector(
            `[data-line-number="${line}"]`
          );

          if (!parent) {
            return;
          }

          if (
            parent.parentElement.nextElementSibling.classList.contains(
              "inline-comment"
            )
          ) {
            // there's existing comment already
            // TODO compare comments
            return;
          }

          const entry = document.createElement("tr");
          entry.className = "inline-comment";
          entry.innerHTML = COMMENT_TEMPLATE;
          entry.querySelector(".review-thread").appendChild(content);
          parent.parentElement.insertAdjacentElement("afterend", entry);
        });
      }
    }
  } catch (err) {
    console.error("Failed to insert outdated comments");
    console.error(err.stack);
  }
}
