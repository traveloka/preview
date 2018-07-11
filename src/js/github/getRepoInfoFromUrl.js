export default function getRepoInfoFromUrl(url) {
  const [protocol, path] = url.split("github.com");
  // eslint-disable-next-line no-unused-vars
  const [owner, name, _pull, prId, ...rest] = path.substr(1).split("/");

  return {
    owner,
    name,
    prId
  };
}
