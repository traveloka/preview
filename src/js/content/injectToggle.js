import { oneLineTrim } from "common-tags";
import { FILTER, HIDEOTHER, SHOWALL } from "../constants/toggleValueEnum";

const template = oneLineTrim`
  <div class="BtnGroup d-flex flex-content-stretch">
    <label class="flex-auto btn btn-sm BtnGroup-item text-center">
      <input class="sr-only" value="${FILTER}" name="gh:preview" type="radio" />
      PReview Mode
    </label>
    <label class="flex-auto btn btn-sm BtnGroup-item text-center">
      <input class="sr-only" value="${HIDEOTHER}" name="gh:preview" type="radio" />
      Compact mode
    </label>
    <label class="flex-auto btn btn-sm BtnGroup-item text-center">
      <input class="sr-only" value="${SHOWALL}" name="gh:preview" type="radio" />
      Show All Files
    </label>
  </div>
`;

const selectInput = input => {
  input.parentNode.classList.add("selected");
};

export default function injectToggle(mode, handler) {
  const bar = document.querySelector(".diffbar");
  const toggle = bar.querySelector("#gh-preview-toggle");

  if (toggle === null) {
    /**
     * Place our toggle after diff stat
     * @see https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
     */
    const stat = document.querySelector(".toc-select + .diffbar-item");
    const toggle = document.createElement("div");
    toggle.id = "gh-preview-toggle";
    toggle.className = "diffbar-item";
    toggle.style.width = "300px";
    toggle.style.position = "relative";
    toggle.style.top = "-4px";
    toggle.innerHTML = template;

    const defaultSelectedInput = toggle.querySelector(`input[value="${mode}"]`);
    selectInput(defaultSelectedInput);

    stat.parentNode.insertBefore(toggle, stat.nextSibling);

    toggle.querySelectorAll("input").forEach(input => {
      input.addEventListener("click", () => {
        toggle.querySelector(".selected").classList.remove("selected");
        selectInput(input);
        handler(input.value);
      });
    });
  }
}
