export default function isFilesSection(url) {
  const u = new URL(url);
  return u.pathname.endsWith("/files");
}
