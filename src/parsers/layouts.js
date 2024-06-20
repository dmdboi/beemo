const fs = require("fs");
const path = require("path");

class LayoutParser {
  constructor(config) {
    this.config = config;
  }

  parse(template, sections) {
    return template.replace(/<x-layout name="(.*?)">(.*?)<\/x-layout>/gs, (match, layoutName, content) => {
      const layoutTemplate = this.loadTemplate(layoutName, "layouts");

      console.log({ layoutTemplate });

      // Replace placeholders in the layout with section content or defaults
      const filledTemplate = layoutTemplate
        .replace(/\{\{ \$title \?\? '(.*?)' \}\}/g, (match, defaultTitle) => {
          return sections["title"] || defaultTitle;
        })
        .replace(/\{\{ \$slot \}\}/g, content.trim());

      return filledTemplate;
    });
  }

  loadTemplate(templateName, dir = "layouts") {
    let thing = path.join(__dirname, "../", this.config.rootDir, dir, `${templateName}.html`);
    console.log(thing);

    const filePath = thing;
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    } else {
      throw new Error(`Template ${templateName} not found in ${dir}`);
    }
  }
}

module.exports = LayoutParser;
