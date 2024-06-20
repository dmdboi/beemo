class InterpolationParser {
  parse(template, data) {
    return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      const value = data[key.trim()] !== undefined ? data[key.trim()] : match;
      return value;
    });
  }
}

module.exports = InterpolationParser;
