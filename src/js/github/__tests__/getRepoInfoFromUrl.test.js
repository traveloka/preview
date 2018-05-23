import getRepoInfoFromUrl from "../getRepoInfoFromUrl";

test("basic", () => {
  const repo = getRepoInfoFromUrl("https://github.com/traveloka/preview");
  expect(repo.owner).toBe("traveloka");
  expect(repo.name).toBe("preview");
});

test("details", () => {
  const repo = getRepoInfoFromUrl(
    "https://github.com/traveloka/preview/pull/123"
  );
  expect(repo.owner).toBe("traveloka");
  expect(repo.name).toBe("preview");
});

test("query string", () => {
  const repo = getRepoInfoFromUrl("https://github.com/traveloka/preview/?x=5");
  expect(repo.owner).toBe("traveloka");
  expect(repo.name).toBe("preview");
});
