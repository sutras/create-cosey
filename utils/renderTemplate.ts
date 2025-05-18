import fs from "node:fs";
import path from "node:path";
import ejs from "ejs";

function renderTemplate(
  src: string,
  dest: string,
  dataStore: Record<string, unknown>,
) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    // skip node_module
    if (path.basename(src) === "node_modules") {
      return;
    }

    // if it's a directory, render its subdirectories and files recursively
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      renderTemplate(
        path.resolve(src, file),
        path.resolve(dest, file),
        dataStore,
      );
    }
    return;
  }

  const filename = path.basename(src);

  if (filename.startsWith("_")) {
    // rename `_file` to `.file`
    dest = path.resolve(path.dirname(dest), filename.replace(/^_/, "."));
  }

  if (filename.endsWith(".ejs")) {
    const template = fs.readFileSync(src, "utf-8");
    dest = dest.replace(/\.ejs$/, "");
    const content = ejs.render(template, dataStore);

    fs.writeFileSync(dest, content);
  } else {
    fs.copyFileSync(src, dest);
  }
}

export default renderTemplate;
