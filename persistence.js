const crypto = require("crypto");
const JSONfn = require("json-fn");

let Cache;

if (process.browser) {
  Cache = class {
    constructor(persistenceKey = "persistent_cache") {
      this.persistenceKey = persistenceKey;

      if (!localStorage.getItem(this.persistenceKey)) {
        this.invalidate();
      }
    }

    invalidate() {
      localStorage.setItem(this.persistenceKey, "{}");
    }

    has(key) {
      return this.getData().hasOwnProperty(key);
    }

    get(key) {
      return this.getData()[key];
    }

    set(key, value) {
      localStorage.setItem(
        this.persistenceKey,
        JSONfn.stringify(Object.assign(this.getData(), { [key]: value }))
      );
    }

    getData() {
      return JSONfn.parse(localStorage.getItem(this.persistenceKey));
    }
  };
} else {
  const fs = require("fs");
  const path = require("path");

  Cache = class {
    constructor(fileName = ".persistent_cache") {
      this.persistenceFile = path.join(__dirname, fileName);

      if (!fs.existsSync(this.persistenceFile)) {
        this.invalidate();
      }
    }

    invalidate() {
      fs.writeFileSync(this.persistenceFile, "{}", { encoding: "utf8" });
    }

    has(key) {
      return this.getData().hasOwnProperty(key);
    }

    get(key) {
      return this.getData()[key];
    }

    set(key, value) {
      fs.writeFileSync(
        this.persistenceFile,
        JSONfn.stringify(Object.assign(this.getData(), { [key]: value })),
        { encoding: "utf8" }
      );
    }

    getData() {
      return JSONfn.parse(fs.readFileSync(this.persistenceFile));
    }
  };
}

const generateKey = (fn, args) => {
  const fnHash = crypto
    .createHash("md5")
    .update(fn.toString())
    .digest("hex");

  const argsHash = crypto
    .createHash("md5")
    .update(JSONfn.stringify(args))
    .digest("hex");

  return `${fnHash}:${argsHash}`;
};

module.exports = { generateKey, Cache };
