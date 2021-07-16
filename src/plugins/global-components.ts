import type { App } from "vue";

export default async function install(app: App): Promise<void> {
  const components = import.meta.glob("../components/global/*.vue");
  await Promise.all(
    Object.entries(components).map(async ([, v]) => {
      const component = (await v()).default;
      app.component(component.name, component);
    })
  );
}
