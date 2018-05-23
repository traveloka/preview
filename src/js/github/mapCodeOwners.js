export default function mapCodeOwners(content) {
  return content
    .split("\n")
    .filter(Boolean)
    .map(entry => entry.trim())
    .filter(entry => entry && !entry.startsWith("#"))
    .map(entry => {
      const [path, ...owners] = entry.split(/\s+/);
      return {
        path,
        owners
      };
    });
}
