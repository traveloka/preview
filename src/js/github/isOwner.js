import ignore from "ignore";

function determineOwners(path, owners) {
  // orders are important, execute it backwards
  for (let i = owners.length - 1; i >= 0; i--) {
    const co = owners[i];
    const ig = ignore();
    ig.add([co.path]);
    if (ig.ignores(path)) {
      return co.owners;
    }
  }

  return [];
}
export default function isOwner(path, owners, userMentions) {
  const pathOwners = determineOwners(path, owners);
  return pathOwners.some(mention => userMentions.includes(mention));
}
