export default function getRepoInfoFromUrl(url) {
  const [protocol, path] = url.split("github.com");
  const [owner, name, ...rest] = path.substr(1).split("/");
  return {
    owner,
    name
  };
}
