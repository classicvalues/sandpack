import { addPackageJSONIfNeeded } from "./utils";

const files = {
  "/package.json": {
    code: `{
  "name": "custom-package",
  "main": "old-entry.js",
  "dependencies": { "baz": "*" },
  "devDependencies": { "baz": "*" }
}`,
  },
};

describe(addPackageJSONIfNeeded, () => {
  test("it merges the package.json - dependencies", () => {
    const output = addPackageJSONIfNeeded(files, { foo: "*" });

    expect(JSON.parse(output["/package.json"].code).dependencies).toEqual({
      baz: "*",
      foo: "*",
    });
  });

  test("it merges the package.json - dev-dependencies", () => {
    const output = addPackageJSONIfNeeded(files, undefined, { foo: "*" });

    expect(JSON.parse(output["/package.json"].code).devDependencies).toEqual({
      baz: "*",
      foo: "*",
    });
  });

  test("it merges the package.json - entry", () => {
    const output = addPackageJSONIfNeeded(
      files,
      undefined,
      undefined,
      "new-entry.js"
    );

    expect(JSON.parse(output["/package.json"].code).main).toEqual(
      "new-entry.js"
    );
  });

  test("it returns an error when there is not dependencies at all", () => {
    try {
      addPackageJSONIfNeeded({ "/package.json": { code: `{}` } });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.message).toBe(
        "No dependencies specified, please specify either a package.json or dependencies."
      );
    }
  });

  test("it supports package.json without leading slash", () => {
    const output = addPackageJSONIfNeeded(
      {
        "package.json": {
          code: `{
  "main": "old-entry.js",
  "dependencies": { "baz": "*" },
  "devDependencies": { "baz": "*" }
}`,
        },
      },
      { foo: "*" },
      { foo: "*" },
      "new-entry.ts"
    );

    expect(JSON.parse(output["package.json"].code)).toEqual({
      main: "new-entry.ts",
      dependencies: { baz: "*", foo: "*" },
      devDependencies: { baz: "*", foo: "*" },
    });
  });
});
