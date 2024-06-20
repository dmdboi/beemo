const fs = require("fs");
const path = require("path");

function loadTemplate(templateName, dir = "templates") {
  const filePath = path.join(__dirname, "../example/", dir, `${templateName}.html`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  } else {
    throw new Error(`Template ${templateName} not found in ${dir}`);
  }
}

function render(template, data = {}) {
  const sections = {};

  template = template.replace(/<x-section name="(.*?)">(.*?)<\/x-section>/gs, (match, sectionName, sectionContent) => {
    sections[sectionName.trim()] = sectionContent.trim();
    return "";
  });

  // Handle layout
  template = template.replace(/<x-layout name="(.*?)">(.*?)<\/x-layout>/gs, (match, layoutName, content) => {
    const layoutTemplate = loadTemplate(layoutName, "layouts");

    // Replace placeholders in the layout with section content or defaults
    const filledTemplate = layoutTemplate
      .replace(/\{\{ \$title \?\? '(.*?)' \}\}/g, (match, defaultTitle) => {
        return sections["title"] || defaultTitle;
      })
      .replace(/\{\{ \$slot \}\}/g, content.trim());

    return filledTemplate;
  });

  // Handle interpolation
  template = template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
    const value = data[key.trim()] !== undefined ? data[key.trim()] : match;
    return value;
  });

  // Handle loops
  template = template.replace(/\{% for (.*?) in (.*?) %\}(.*?)\{% endfor %\}/gs, (match, item, array, content) => {
    const arr = data[array.trim()];
    if (Array.isArray(arr)) {
      return arr.map(el => render(content, { ...data, [item.trim()]: el })).join("");
    }
    return "";
  });

  // Handle conditionals
  template = template.replace(/\{% if (.*?) %\}(.*?)\{% endif %\}/gs, (match, condition, content) => {
    const key = condition.trim();
    if (data[key]) {
      return content;
    }
    return "";
  });

  // Handle loops with @foreach syntax
  template = template.replace(/@foreach\((.*?) in (.*?)\)(.*?)@endforeach/gs, (match, item, array, content) => {
    const arr = data[array.trim()];
    if (Array.isArray(arr)) {
      return arr.map(el => render(content, { ...data, [item.trim()]: el })).join("");
    }
    return "";
  });

  return template;
}

// Example usage
const template = loadTemplate("main");
const data = { items: ["Apple", "Banana", "Cherry"] };
console.log(render(template, data));
