const fs = require("fs");
const path = require("path");

const cjsPackageJson = { type: "commonjs" };
const mjsPackageJson = { type: "module" };

const cjsDir = path.join(__dirname, "dist/cjs");
const mjsDir = path.join(__dirname, "dist/mjs");

if (!fs.existsSync(cjsDir)) {
  fs.mkdirSync(cjsDir, { recursive: true });
}
fs.writeFileSync(path.join(cjsDir, "package.json"), JSON.stringify(cjsPackageJson, null, 2));

if (!fs.existsSync(mjsDir)) {
  fs.mkdirSync(mjsDir, { recursive: true });
}
fs.writeFileSync(path.join(mjsDir, "package.json"), JSON.stringify(mjsPackageJson, null, 2));
