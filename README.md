# Beemo

A simple templating engine that supports custom components

## Example

**Input**

```html
<x-layout name="layout">
  <ul>
    @foreach(item in items)
    <li>{{ item }}</li>
    @end
  </ul>
</x-layout>
```

**Javascript**

```js
const beemo = new Beemo();
const data = {
  title: "Beemo",
  items: ["Apple", "Banana", "Cherry"],
};

const result = beemo.render("main", data);
fs.writeFileSync(path.join(__dirname, "output.html"), result);
```

**Output**

```html
<html>
  <head>
    <title>Beemo</title>
  </head>

  <body>
    <h1>Todos</h1>
    <hr />
    <ul>
      <li>Apple</li>
      <li>Banana</li>
      <li>Cherry</li>
    </ul>
  </body>
</html>
```
