import determineOwners from "../github/determineOwners";
import injectOwnerLabel from "./injectOwnerLabel";

export default function applyPreview(enabled, owners, userMentions) {
  if (owners.length === 0) {
    return;
  }

  const fileHeaders = document.querySelectorAll(".file");

  for (const fileHeader of fileHeaders) {
    const path = fileHeader.querySelector(".file-header").dataset.path;
    const pathOwners = determineOwners(path, owners);
    const isOwner = pathOwners.some(mention => userMentions.includes(mention));
    if (enabled && !isOwner) {
      fileHeader.classList.add("Details--on");
      fileHeader.style.opacity = 0.3;
    } else if (!enabled) {
      fileHeader.classList.remove("Details--on");
      fileHeader.style.opacity = 1;
    }

    injectOwnerLabel(fileHeader, pathOwners);
  }
}
