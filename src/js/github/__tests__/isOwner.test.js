import isOwner from "../isOwner";

test("basic string matching", () => {
  const path = "src/js/index.js";
  const owners = [
    {
      path: "*js*",
      owners: ["@traveloka/web"]
    }
  ];
  const userMentions = ["@pveyes", "@traveloka/web"];

  expect(isOwner(path, owners, userMentions)).toBe(true);
});

test("basic path matching", () => {
  const path = "src/js/flight/index.js";
  const owners = [
    {
      path: "flight/",
      owners: ["@traveloka/web-flight"]
    }
  ];
  const userMentions = ["@pveyes", "@traveloka/web"];

  expect(isOwner(path, owners, userMentions)).toBe(false);
});

test("match wildcard", () => {
  const path = "src/js/index.js";
  const owners = [
    {
      path: "*",
      owners: ["@traveloka/web"]
    }
  ];
  const userMentions = ["@pveyes", "@traveloka/web"];

  expect(isOwner(path, owners, userMentions)).toBe(true);
});

test("no match", () => {
  const path = "src/js/index.js";
  const owners = [
    {
      path: "flight/",
      owners: ["@traveloka/web-flight"]
    }
  ];
  const userMentions = ["@pveyes", "@traveloka/web-flight"];

  expect(isOwner(path, owners, userMentions)).toBe(false);
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
  const userMentions = ["@pveyes", "@traveloka/web"];
  expect(isOwner(path, owners, userMentions)).toBe(false);
});
