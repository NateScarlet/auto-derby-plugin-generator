import withBrowserCheck from "@/browser-check";

withBrowserCheck(async () => {
  await import("./app");
});
