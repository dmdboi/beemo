const fs = require("fs");
const path = require("path");

class Beemo {
  config = {
    rootDir: "../views",
    parsersDir: "parsers",
  };

  parsers = [];

  constructor(options = {}) {
    this.config = { ...this.config, ...options };

    this.parsers = [];
    this.loadParsers();
  }

  // Load regex handlers from tags directory
  loadParsers() {
    const parsersDir = path.join(__dirname, this.config.parsersDir);
    const files = fs.readdirSync(parsersDir);

    files.forEach(file => {
      const parserClass = require(path.join(parsersDir, file));
      this.parsers[file.split(".")[0]] = new parserClass(this.config, this.render);
    });
  }

  // Load template from file
  loadTemplate(templateName, dir = "templates") {
    const filePath = path.join(__dirname, this.config.rootDir, dir, `${templateName}.html`);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    } else {
      throw new Error(`Template ${templateName} not found in ${dir}`);
    }
  }

  // Render a template
  render(templateName, data = {}) {
    let template = this.loadTemplate(templateName);

    // Handle layout
    template = this.parsers.layouts.parse(template, data);

    // Handle interpolation
    template = this.parsers.interpolation.parse(template, data);

    // Handle loops
    template = this.parsers.loops.parse(template, data);

    // Handle conditionals
    template = this.parsers.conditionals.parse(template, data);

    return template;
  }

  // Register a new parser
  use(parser) {
    this.parsers.push(parser);
  }
}

module.exports = Beemo;
