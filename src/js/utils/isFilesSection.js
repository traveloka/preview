export default function isFilesSection(url) {
  const u = new URL(url);
  return u.pathname.includes("/pull") && u.pathname.includes("/files");
}
