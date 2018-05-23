export default function getTargetBranch(repo) {
  try {
    // we're in the files tab which already contains branch target
    // we can determine which CODEOWNERS to use using this heuristic
    const ref = document.querySelector(".commit-ref").innerText;

    // forked PR contains `:` character
    if (ref.includes(":")) {
      // eslint-disable-next-line no-unused-vars
      const [owner, branch] = ref.split(":");
      return branch.trim();
    } else {
      return ref.trim();
    }
  } catch (err) {
    // default fallback
    return "master";
  }
}
