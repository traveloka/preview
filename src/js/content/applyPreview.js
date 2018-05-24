import isOwner from "../github/isOwner";

export default function applyPreview(enabled, owners, userMentions) {
  if (owners.length === 0) {
    return;
  }

  const fileHeaders = document.querySelectorAll(".file");

  for (const fileHeader of fileHeaders) {
    const path = fileHeader.querySelector(".file-header").dataset.path;
    if (enabled && !isOwner(path, owners, userMentions)) {
      fileHeader.classList.add("Details--on");
      fileHeader.style.opacity = 0.3;
    } else if (!enabled) {
      fileHeader.classList.remove("Details--on");
      fileHeader.style.opacity = 1;
    }
  }
}
