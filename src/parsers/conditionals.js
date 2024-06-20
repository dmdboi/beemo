class ConditionalParser {
  parse(template, data) {
    return template.replace(/@if\((.*?)\)(.*?)(@else(.*?))?@endif/gs, (match, condition, trueContent, elseGroup, falseContent) => {
      const key = condition.trim();
      if (data[key]) {
        return trueContent;
      } else {
        return falseContent || "";
      }
    });
  }
}

module.exports = ConditionalParser;
