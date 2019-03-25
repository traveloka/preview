import { mapCodeOwners } from "../getCodeOwners";

test("basic", () => {
  const codeowners = `
    * @traveloka/web
    shared/* @traveloka/web-infra
  `;

  expect(mapCodeOwners(codeowners)).toEqual([
    {
      path: "*",
      owners: ["@traveloka/web"]
    },
    {
      path: "shared/*",
      owners: ["@traveloka/web-infra"]
    }
  ]);
});

test("multi owners", () => {
  const codeowners = `
    shared/* @traveloka/web @traveloka/web-infra
  `;

  expect(mapCodeOwners(codeowners)).toEqual([
    {
      path: "shared/*",
      owners: ["@traveloka/web", "@traveloka/web-infra"]
    }
  ]);
});

test("ignore comments", () => {
  const codeowners = `
    # all code must be reviewed by web eng
    * @traveloka/web
  `;

  expect(mapCodeOwners(codeowners)).toEqual([
    {
      path: "*",
      owners: ["@traveloka/web"]
    }
  ]);
});
