import isOwner from "../github/isOwner";
import { FILTER, HIDEOTHER, SHOWALL } from "../constants/toggleValueEnum";

export default function applyPreview(enabled, owners, userMentions) {
  if (owners.length === 0) {
    return;
  }

  const fileHeaders = document.querySelectorAll(".file");

  for (const fileHeader of fileHeaders) {
    const path = fileHeader.querySelector(".file-header").dataset.path;
    const own = isOwner(path, owners, userMentions);
    switch (enabled) {
      case FILTER:
        if (!own) {
          fileHeader.classList.add("Details--on");
          fileHeader.style.display = "block";
          fileHeader.style.opacity = 0.3;
        }
        break;
      case HIDEOTHER:
        if (!own) {
          fileHeader.style.display = "none";
        }
        break;
      case SHOWALL:
        fileHeader.classList.remove("Details--on");
        fileHeader.style.display = "block";
        fileHeader.style.opacity = 1;
        break;
    }
  }
}
