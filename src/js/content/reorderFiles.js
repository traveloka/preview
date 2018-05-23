import isOwner from "../github/isOwner";

export default function reorderFiles(owners, userMentions) {
  if (owners.length === 0) {
    return;
  }

  const fileHeaders = document.querySelectorAll(".file");

  for (const fileHeader of fileHeaders) {
    const path = fileHeader.querySelector(".file-header").dataset.path;
    if (!isOwner(path, owners, userMentions)) {
      fileHeader.classList.add("Details--on");
    }
  }

  // TODO add mutation observer
}
