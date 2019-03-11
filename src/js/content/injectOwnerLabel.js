const LABEL_IDENTIFIER = "gh-preview-owner";

export default function injectOwnerLabel(header, owners) {
  if (owners.length === 0) {
    return;
  }

  const label = header.querySelector(`.${LABEL_IDENTIFIER}`);

  if (!label) {
    const labelContainer = document.createElement("div");
    labelContainer.className = LABEL_IDENTIFIER;

    // inject list of owners inside fragments to prevent page reflow
    const fragment = document.createDocumentFragment();
    const title = document.createElement("strong");
    title.textContent = owners.length === 1 ? "Owner: " : "Owners: ";
    fragment.appendChild(title);

    owners.forEach((owner, index) => {
      const reviewer = document.createElement("a");
      const separator = document.createTextNode(", ");
      const reviewerLink = owner.includes("/")
        ? "orgs/" +
          owner
            .replace("@", "")
            .split("/")
            .join("/teams/")
        : owner.replace("@", "");
      reviewer.textContent = owner;
      reviewer.href = "https://github.com/" + reviewerLink;
      fragment.appendChild(reviewer);
      if (index < owners.length - 1) {
        fragment.appendChild(separator);
      }
    });

    labelContainer.appendChild(fragment);
    header.querySelector(".file-info").appendChild(labelContainer);
  }
}
