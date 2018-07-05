import determineOwners from "../determineOwners";

test("basic string matching", () => {
  const path = "src/js/index.js";
  const owners = [
    {
      path: "*js*",
      owners: ["@traveloka/web"]
    }
  ];

  expect(determineOwners(path, owners)).toEqual(["@traveloka/web"]);
});

test("basic path matching", () => {
  const path = "src/js/flight/index.js";
  const owners = [
    {
      path: "flight/",
      owners: ["@traveloka/web-flight"]
    }
  ];

  expect(determineOwners(path, owners)).toEqual(["@traveloka/web-flight"]);
});

test("match wildcard", () => {
  const path = "src/js/index.js";
  const owners = [
    {
      path: "*",
      owners: ["@traveloka/web"]
    }
  ];

  expect(determineOwners(path, owners)).toEqual(["@traveloka/web"]);
});

test("no match", () => {
  const path = "src/js/index.js";
  const owners = [
    {
      path: "flight/",
      owners: ["@traveloka/web-flight"]
    }
  ];
  expect(determineOwners(path, owners)).toEqual([]);
});

test("prioritize list backwards", () => {
  const path = "src/js/flight/index.js";
  const owners = [
    {
      path: "*",
      owners: ["@traveloka/web"]
    },
    {
      path: "flight/",
      owners: ["@traveloka/web-flight"]
    }
  ];
  expect(determineOwners(path, owners)).toEqual(["@traveloka/web-flight"]);
});
