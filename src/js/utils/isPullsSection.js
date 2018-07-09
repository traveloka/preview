export default function isPullsSection(url) {
  const u = new URL(url);
  return u.pathname.endsWith("/pulls");
}
