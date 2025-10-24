import fs from "fs";

export const meta = {
  type: "problem",
  docs: {
    description:
      "Require each logic file to have a colocated test file (.test.ts)",
  },
  messages: {
    missingTest:
      "Logic file '{{filename}}' is missing a colocated test file '{{expected}}'",
  },
};

export function create(context) {
  return {
    Program(node) {
      const filename = context.getFilename();

      // Ignore files outside relevant folders
      if (!/src\/(services|domain|infrastructure)\//.test(filename)) return;

      // Skip test files
      if (filename.endsWith(".test.ts") || filename.endsWith(".test.tsx"))
        return;

      const expectedTest = filename.replace(/\.ts$/, ".test.ts");
      const expectedTestx = filename.replace(/\.tsx$/, ".test.tsx");

      if (!fs.existsSync(expectedTest) && !fs.existsSync(expectedTestx)) {
        context.report({
          node,
          messageId: "missingTest",
          data: { filename, expected: expectedTest },
        });
      }
    },
  };
}
