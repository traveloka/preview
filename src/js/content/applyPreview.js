import determineOwners from "../github/determineOwners";
import injectOwnerLabel from "./injectOwnerLabel";
import { FILTER, HIDEOTHER, SHOWALL } from "../constants/toggleValueEnum";

export default function applyPreview(mode, owners, userMentions) {
  if (owners.length === 0) {
    return;
  }

  const fileHeaders = document.querySelectorAll(".file");

  for (const fileHeader of fileHeaders) {
    const path = fileHeader.querySelector(".file-header").dataset.path;
    const pathOwners = determineOwners(path, owners);
    const isOwner = pathOwners.some(mention => userMentions.includes(mention));
    switch (mode) {
      case FILTER:
        if (!isOwner) {
          fileHeader.classList.remove("Details--on");
          fileHeader.style.display = "block";
          fileHeader.style.opacity = 0.3;
        }
        break;
      case HIDEOTHER:
        if (!isOwner) {
          fileHeader.style.display = "none";
        }
        break;
      case SHOWALL:
        fileHeader.classList.add("Details--on");
        fileHeader.style.display = "block";
        fileHeader.style.opacity = 1;
        break;
    }

    injectOwnerLabel(fileHeader, pathOwners);
  }
}
