import { message } from "@/message";
import { mdiUpdate } from "@mdi/js";
import { registerSW } from "virtual:pwa-register";
import { h } from "vue";

export default function install(): void {
  const updateSW = registerSW({
    onNeedRefresh() {
      message(() =>
        h(
          "li",
          {
            class:
              "rounded-sm w-64 mx-2 my-1 bg-gray-100 text-black break-all flex items-center",
          },
          [
            h("p", { class: "m-2 flex-auto" }, "New version available"),
            h(
              "button",
              {
                class: "form-button inline-flex flex-center",
                onClick: () => updateSW(),
              },
              h(
                "svg",
                { viewBox: "0 0 24 24", class: "fill-current h-6" },
                h("path", { d: mdiUpdate })
              )
            ),
          ]
        )
      );
    },
  });
}
