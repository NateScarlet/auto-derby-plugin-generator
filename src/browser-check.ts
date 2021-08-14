export default async function withBrowserCheck(
  fn: () => Promise<void>
): Promise<void> {
  try {
    if (Object.entries === undefined) {
      throw new Error("Object.entries is not supported");
    }
    if (Array.prototype.flatMap === undefined) {
      throw new Error("Array.prototype.flatMap is not supported");
    }
    if (window.fetch === undefined) {
      throw new Error("fetch is not supported");
    }
    await fn();
  } catch (err) {
    const el = document.getElementById("app");
    if (!el) {
      throw new Error("missing app element");
    }
    el.innerHTML = "";

    const h = <K extends keyof HTMLElementTagNameMap>(
      tag: K,
      text: string
    ): HTMLElementTagNameMap[K] => {
      const ret = document.createElement(tag);
      ret.innerText = text;
      return ret;
    };

    const title = h("h1", "");
    el.appendChild(title);
    title.appendChild(h("p", "Please use a newer browser"));
    title.appendChild(h("p", "请使用更新的浏览器"));
    title.setAttribute("style", "font-size: 24px; font-weight: bold;");

    el.appendChild(
      h(
        "p",
        "All versions of IE is not supported, chrome or firefox is recommended."
      )
    );
    el.appendChild(h("p", "不支持所有版本的 IE，推荐使用谷歌或者火狐浏览器。"));
    el.appendChild(
      h(
        "p",
        "If you see this message in recent browsers, please ensure not using IE compatibility mode of your browser."
      )
    );
    el.appendChild(
      h("p", "如果较新的浏览器看到此信息，请确保未启用您浏览器的 IE 兼容模式。")
    );
    const errText =
      err instanceof Error ? err.stack ?? err.message : String(err);

    // https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue#creating-an-issue-from-a-url-query
    const newIssueURL = `https://github.com/natescarlet/auto-derby-plugin-generator/issues/new?title=${encodeURIComponent(
      err instanceof Error ? err.message : String(err).slice(0, 80)
    )}&body=${encodeURIComponent(`\
## Version

${__VERSION__}

## URL

${document.location.href}

## User Agent

${navigator.userAgent}

## Error

\`\`\`
${errText}
\`\`\`
`)}&labels=bug`;
    {
      const p = h("p", "");
      p.appendChild(h("span", "If the error still cannot be resolved."));
      const a = p.appendChild(h("a", "Click here to report"));
      a.href = newIssueURL;
      a.setAttribute("style", "color: #60A5FA; margin: 0 12px;");
      el.appendChild(p);
    }
    {
      const p = h("p", "");
      p.appendChild(h("span", "如果错误依旧无法解决。"));
      const a = p.appendChild(h("a", "请点此汇报"));
      a.href = newIssueURL;
      a.setAttribute("style", "color: #60A5FA; margin: 0 12px;");
      el.appendChild(p);
    }
    const pre = el.appendChild(h("pre", errText));
    pre.setAttribute("style", "margin: 24px 0;");
    throw err;
  }
}
