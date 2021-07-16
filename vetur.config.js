// https://vuejs.github.io/vetur/reference/
module.exports = {
  settings: {
    "vetur.useWorkspaceDependencies": true,
    "vetur.experimental.templateInterpolationService": true,
    "vetur.completion.tagCasing": "initial",
  },
  projects: [
    {
      root: "./",
      tsconfig: "./src/tsconfig.json",
      globalComponents: ["./src/components/global/*.vue"],
    },
  ],
};
