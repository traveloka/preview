export default function fetchHtml(path, repo) {
  const url =
    repo == null
      ? `https://github.com${path}`
      : `https://github.com/${repo.owner}/${repo.name}${path}`;

  return fetch(url, { credentials: "same-origin" }).then(res => res.text());
}
