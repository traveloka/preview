export default function domFind(text, callback) {
  const root = document.createElement("div");
  root.innerHTML = text;
  return callback(root);
}
