import { oneLineTrim } from "common-tags";

const template = oneLineTrim`
  <div class="BtnGroup d-flex flex-content-stretch">
    <label class="flex-auto btn btn-sm BtnGroup-item text-center">
      <input class="sr-only" value="filter" name="gh:preview" type="radio" />
      PReview Mode
    </label>
    <label class="flex-auto btn btn-sm BtnGroup-item text-center">
      <input class="sr-only" value="showall" name="gh:preview" type="radio" />
      Show All Files
    </label>
  </div>
`;

export default function injectToggle(enabled, handler) {
  const bar = document.querySelector(".diffbar");
  const toggle = bar.querySelector("#gh-preview-toggle");

  if (toggle === null) {
    /**
     * Place our toggle after diff stat
     * @see https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
     */
    const stat = document.querySelector(".diffstat");
    const toggle = document.createElement("div");
    toggle.id = "gh-preview-toggle";
    toggle.className = "diffbar-item";
    toggle.style.width = "200px";
    toggle.style.position = "relative";
    toggle.style.top = "-4px";
    toggle.innerHTML = template;

    const input = enabled
      ? toggle.querySelector('input[value="filter"]')
      : toggle.querySelector('input[value="showall"]');

    input.checked = "checked";
    input.parentNode.classList.add("selected");

    stat.parentNode.insertBefore(toggle, stat.nextSibling);

    toggle.querySelectorAll("input").forEach(input => {
      input.addEventListener("click", () => {
        const sibling =
          input.parentNode.nextSibling || input.parentNode.previousSibling;
        input.parentNode.classList.toggle("selected");
        sibling.classList.toggle("selected");
        handler(input.value);
      });
    });
  }
}
