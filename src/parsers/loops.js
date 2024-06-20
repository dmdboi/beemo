const InterpolationParser = require("./interpolation");

class LoopParser {
  constructor(config) {
    this.config = config;
  }

  parse(template, data) {
    return template.replace(/@foreach\((.*?) in (.*?)\)(.*?)@end/gs, (match, item, array, content) => {
      const arr = data[array.trim()];
      if (Array.isArray(arr)) {
        return arr.map(el => LoopParser.render(content, { ...data, [item.trim()]: el })).join("");
      }
      return "";
    });
  }

  static render(template, data) {
    const interpolationParser = new InterpolationParser();
    return interpolationParser.parse(template, data);
  }
}

module.exports = LoopParser;
