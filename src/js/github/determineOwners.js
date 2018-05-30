import ignore from "ignore";

export default function determineOwners(path, owners) {
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
