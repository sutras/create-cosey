import { log, isCancel, cancel, intro, text, outro } from "@clack/prompts";
import { red, green, bold, dim } from "picocolors";
import fs from "node:fs";

import cliPackageJson from "./package.json" with { type: "json" };
import { parseArgs } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import renderTemplate from "./utils/renderTemplate";
import getCommand from "./utils/getCommand";

async function unwrapPrompt<T>(
  maybeCancelPromise: Promise<T | symbol>,
): Promise<T> {
  const result = await maybeCancelPromise;

  if (isCancel(result)) {
    cancel(red("✖") + ` 操作取消`);
    process.exit(0);
  }
  return result;
}

function canSkipEmptying(dir: string) {
  if (!fs.existsSync(dir)) {
    return true;
  }

  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    return true;
  }
  if (files.length === 1 && files[0] === ".git") {
    return true;
  }

  return false;
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName,
  );
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9-~]+/g, "-");
}

type PromptResult = {
  projectName?: string;
  packageName?: string;
};

const helpMessage = `\
Usage: create-cosey [OPTIONS...] [DIRECTORY]

Create a new Cosey project.
Start the CLI in interactive mode when the DIRECTORY argument is not a valid package name.

Options:
  --help
    Display this help message.
  --version
    Display the version number of this CLI.
`;

async function bootstrap() {
  const cwd = process.cwd();
  const args = process.argv.slice(2);

  const flags = ["help", "version"] as const;

  type CLIOptions = {
    [key in (typeof flags)[number]]: { readonly type: "boolean" };
  };

  const options = Object.fromEntries(
    flags.map((key) => [key, { type: "boolean" }]),
  ) as CLIOptions;

  const { values: argv, positionals } = parseArgs({
    args,
    options,
    strict: true,
    allowPositionals: true,
  });

  if (argv.help) {
    console.log(helpMessage);
    process.exit(0);
  }

  if (argv.version) {
    console.log(`${cliPackageJson.name} v${cliPackageJson.version}`);
    process.exit(0);
  }

  let targetDir = positionals[0];
  const defaultProjectName = targetDir || "cosey-project";

  const result: PromptResult = {
    projectName: defaultProjectName,
    packageName: defaultProjectName,
  };

  intro(`Cosey - 助你极速搭建后台管理框架`);

  if (!targetDir) {
    const _result = await unwrapPrompt(
      text({
        message: "请输入项目名称：",
        placeholder: defaultProjectName,
        validate: (value) => (value.trim().length > 0 ? undefined : "不能为空"),
      }),
    );
    targetDir = result.projectName = result.packageName = _result.trim();
  }

  if (!canSkipEmptying(targetDir)) {
    cancel(red("✖") + ` 当前目录非空`);
    process.exit(0);
  }

  if (!isValidPackageName(targetDir)) {
    result.packageName = await unwrapPrompt(
      text({
        message: "请输入包名称：",
        initialValue: toValidPackageName(targetDir),
        validate: (value) =>
          isValidPackageName(value) ? undefined : "无效的 package.json 名称",
      }),
    );
  }

  const root = path.join(cwd, targetDir);

  fs.mkdirSync(root);

  console.log(`\n正在初始化项目...`);

  const dataStore = {
    packageName: result.packageName,
  };

  const templateRoot = fileURLToPath(new URL("./template", import.meta.url));
  const render = (templateName: string) => {
    const templateDir = path.resolve(templateRoot, templateName);
    renderTemplate(templateDir, root, dataStore);
  };
  render("base");

  const packageManager = "pnpm";

  let outroMessage = `项目初始化完成，可执行以下命令：\n\n`;
  if (root !== cwd) {
    const cdProjectName = path.relative(cwd, root);
    outroMessage += `   ${bold(green(`cd ${cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName}`))}\n`;
  }
  outroMessage += `   ${bold(green(getCommand(packageManager, "install")))}\n`;
  outroMessage += `   ${bold(green(getCommand(packageManager, "format")))}\n`;
  outroMessage += `   ${bold(green(getCommand(packageManager, "dev")))}\n`;

  outroMessage += `\n${dim("|")} 可选：使用以下命令在项目目录中初始化 Git：\n\n`;
  outroMessage += `   ${bold(green('git init && git add -A && git commit -m "initial commit"'))}`;

  outro(outroMessage);
}

bootstrap().catch((e) => {
  log.error(e);
  process.exit(1);
});
