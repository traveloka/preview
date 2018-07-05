export default function shouldEnable() {
  // We only enable this extension on login
  // No point of filtering files for public access
  return document.querySelector(".user-nav") !== null;
}
