libs:
  - d3
  - domtree

---

# DOM 트리(tree)

HTML의 근간은 태그(tags)입니다.

DOM(문서 객체 모델, Document Object Model)에선 모든 HTML 태그가 객체입니다. 중첩 태그(nested tag)들은 그 태그를 감싸고 있는 태그의 "자식들(children)"이라 불립니다.

태그 사이의 문자(text) 역시 객체입니다.

이런 모든 객체는 자바스크립트를 통해 접근 가능합니다.

## DOM 예제

아래 문서의 DOM을 탐색해 봅시다.

```html run no-beautify
<!DOCTYPE HTML>
<html>
<head>
  <title>사슴에 관하여</title>
</head>
<body>
  사슴에 관한 진실.
</body>
</html>
```

DOM은 HTML을 태그의 트리구조로 나타냅니다. 아래 그림을 통해 확인해 봅시다:

<div class="domtree"></div>

<script>
let node1 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n    "},{"name":"TITLE","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"사슴에 관하여"}]},{"name":"#text","nodeType":3,"content":"\n  "}]},{"name":"#text","nodeType":3,"content":"\n  "},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n  사슴에 관한 진실."}]}]}

drawHtmlTree(node1, 'div.domtree', 690, 320);
</script>

```online
위 그림에서 요소 노드를 클릭하면 그 자식들을 보거나 숨길 수 있습니다.
```

태그는 *요소 노드*(혹은 그냥 요소)라고 불립니다. 중첩 태그는 그 태그를 감싸는 상위 태그의 자식이 됩니다. 이런 규칙에 따라 `<html>`은 요소 트리의 가장 꼭대기에 위치하고, `<head>`와 `<body>`등을 자식으로 갖습니다. 

요소 안쪽의 문자(text)는 *텍스트(text) 노드*가 되고, `#text`로 표시됩니다. 텍스트 노드는 오로지 문자열만 담습니다. 자식을 가질 수 없고 트리의 끝에서 잎 노드(leaf node)로만 존재합니다.

예를 들어 `<title>` 태그는 `"사슴에 관하여"`라는 문자 노드를 자식으로 갖습니다

텍스트 노드에 있는 특수문자를 눈여겨보세요:

- 새 줄(newline): `↵` (자바스크립트에선 `\n`로 표시)
- 공백(space): `␣`

공백과 새 줄 -- 이 두 가지는 명백한 문자입니다. 그래서 텍스트 노드가 되고, DOM의 일부를 구성합니다. 위 예제 HTML에서 `<head>`과 `<title>`사이의 공백은 문자이기 때문에 `#text` 노드가 됩니다(이 노드는 새 줄과 몇 개의 공백만을 포함합니다).

텍스트 노드 생성엔 두가지 예외가 있습니다:
1. 역사적인 이유로 `<head>`이전의 공백과 새 줄은 무시됩니다.
2. HTML  명세는 모든 콘텐츠가 `body` 안쪽에 있어야 한다고 명시하기 떄문에 `</body>`뒤에 뭔갈 넣더라도 그 콘텐츠는 자동으로 `body` 안쪽으로 옮겨집니다. 따라서 `</body>`뒤엔 어느 공백도 있을 수 없습니다.

두 예외를 제외하곤 아주 간단합니다 -- 문서 내에 공백이 있다면 다른 문자처럼 DOM의 텍스트 노드가 되고 공백을 지우면 그 노드는 사라집니다. 

아래는 공백 없는 텍스트 노드만으로 구성된 HTML입니다.:

```html no-beautify
<!DOCTYPE HTML>
<html><head><title>사슴에 관하여</title></head><body>사슴에 관한 진실.</body></html>
```

<div class="domtree"></div>

<script>
let node2 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[{"name":"TITLE","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"사슴에 관하여"}]}]},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"사슴에 관한 진실."}]}]}

drawHtmlTree(node2, 'div.domtree', 690, 210);
</script>

```smart header="가장자리 공백이나 중간의 비어있는 텍스트는 개발자 도구에서 보이지 않습니다"
브라우저 개발자 도구(곧 다룰 예정임)에선 문자 맨 앞이나 끝쪽의 공백과 태그 사이의 새 줄이 만들어내는 비어있는 텍스트 노드는 보여주지 않습니다.

이런 노드들은 주로 HTML의 가시성을 위해 사용되는 것이지, 실제 문서가 어떻게 보이는지엔지엔 (대개) 영향을 끼치지 않기 때문입니다.

이 튜토리얼에서도 단순화를 위해 뒤에 나타나는 DOM 그림부터 이런 텍스트 노드를 생략하도록 하겠습니다.
```


## 자동 교정(Autocorrection)

브라우저는 규칙에 어긋나는 HTML을 만나면, DOM 생성 시 잘못된 부분을 자동으로 교정해줍니다.

For instance, the top tag is always `<html>`. Even if it doesn't exist in the document -- it will exist in the DOM, the browser will create it. The same goes for `<body>`.

As an example, if the HTML file is a single word `"Hello"`, the browser will wrap it into `<html>` and `<body>`, add the required `<head>`, and the DOM will be:


<div class="domtree"></div>

<script>
let node3 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[]},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"Hello"}]}]}

drawHtmlTree(node3, 'div.domtree', 690, 150);
</script>

While generating the DOM, browsers automatically process errors in the document, close tags and so on.

Such an "invalid" document:

```html no-beautify
<p>Hello
<li>Mom
<li>and
<li>Dad
```

...Will become a normal DOM, as the browser reads tags and restores the missing parts:

<div class="domtree"></div>

<script>
let node4 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[]},{"name":"BODY","nodeType":1,"children":[{"name":"P","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"Hello"}]},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"Mom"}]},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"and"}]},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"Dad"}]}]}]}

drawHtmlTree(node4, 'div.domtree', 690, 360);
</script>

````warn header="Tables always have `<tbody>`"
An interesting "special case" is tables. By the DOM specification they must have `<tbody>`, but HTML text may (officially) omit it. Then the browser creates `<tbody>` in DOM automatically.

For the HTML:

```html no-beautify
<table id="table"><tr><td>1</td></tr></table>
```

DOM-structure will be:
<div class="domtree"></div>

<script>
let node5 = {"name":"TABLE","nodeType":1,"children":[{"name":"TBODY","nodeType":1,"children":[{"name":"TR","nodeType":1,"children":[{"name":"TD","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"1"}]}]}]}]};

drawHtmlTree(node5,  'div.domtree', 600, 200);
</script>

You see? The `<tbody>` appeared out of nowhere. You should keep this in mind while working with tables to avoid surprises.
````

## Other node types

Let's add more tags and a comment to the page:

```html
<!DOCTYPE HTML>
<html>
<body>
  The truth about elks.
  <ol>
    <li>An elk is a smart</li>
*!*
    <!-- comment -->
*/!*
    <li>...and cunning animal!</li>
  </ol>
</body>
</html>
```

<div class="domtree"></div>

<script>
let node6 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[]},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n  The truth about elks.\n    "},{"name":"OL","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n      "},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"An elk is a smart"}]},{"name":"#text","nodeType":3,"content":"\n      "},{"name":"#comment","nodeType":8,"content":"comment"},{"name":"#text","nodeType":3,"content":"\n      "},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"...and cunning animal!"}]},{"name":"#text","nodeType":3,"content":"\n    "}]},{"name":"#text","nodeType":3,"content":"\n  \n"}]}]};

drawHtmlTree(node6, 'div.domtree', 690, 500);
</script>

Here we see a new tree node type -- *comment node*, labeled as `#comment`.

We may think -- why a comment is added to the DOM? It doesn't affect the visual representation in any way. But there's a rule -- if something's in HTML, then it also must be in the DOM tree.

**Everything in HTML, even comments, becomes a part of the DOM.**

Even the `<!DOCTYPE...>` directive at the very beginning of HTML is also a DOM node. It's in the DOM tree right before `<html>`. We are not going to touch that node, we even don't draw it on diagrams for that reason, but it's there.

The `document` object that represents the whole document is, formally, a DOM node as well.

There are [12 node types](https://dom.spec.whatwg.org/#node). In practice we usually work with 4 of them:

1. `document` -- the "entry point" into DOM.
2. element nodes -- HTML-tags, the tree building blocks.
3. text nodes -- contain text.
4. comments -- sometimes we can put the information there, it won't be shown, but JS can read it from the DOM.

## See it for yourself

To see the DOM structure in real-time, try [Live DOM Viewer](http://software.hixie.ch/utilities/js/live-dom-viewer/). Just type in the document, and it will show up DOM at an instant.

## In the browser inspector

Another way to explore the DOM is to use the browser developer tools. Actually, that's what we use when developing.

To do so, open the web-page [elks.html](elks.html), turn on the browser developer tools and switch to the Elements tab.

It should look like this:

![](elks.png)

You can see the DOM, click on elements, see their details and so on.

Please note that the DOM structure in developer tools is simplified. Text nodes are shown just as text. And there are no "blank" (space only) text nodes at all. That's fine, because most of the time we are interested in element nodes.

Clicking the <span class="devtools" style="background-position:-328px -124px"></span> button in the left-upper corner allows to choose a node from the webpage using a mouse (or other pointer devices) and "inspect" it (scroll to it in the Elements tab). This works great when we have a huge HTML page (and corresponding huge DOM) and would like to see the place of a particular element in it.

Another way to do it would be just right-clicking on a webpage and selecting "Inspect" in the context menu.

![](inspect.png)

At the right part of the tools there are the following subtabs:
- **Styles** -- we can see CSS applied to the current element rule by rule, including built-in rules (gray). Almost everything can be edited in-place, including the dimensions/margins/paddings of the box below.
- **Computed** -- to see CSS applied to the element by property: for each property we can see a rule that gives it (including CSS inheritance and such).
- **Event Listeners** -- to see event listeners attached to DOM elements (we'll cover them in the next part of the tutorial).
- ...and so on.

The best way to study them is to click around. Most values are editable in-place.

## Interaction with console

As we explore the DOM, we also may want to apply JavaScript to it. Like: get a node and run some code to modify it, to see how it looks. Here are few tips to travel between the Elements tab and the console.

- Select the first `<li>` in the Elements tab.
- Press `key:Esc` -- it will open console right below the Elements tab.

Now the last selected element is available as `$0`, the previously selected is `$1` etc.

We can run commands on them. For instance, `$0.style.background = 'red'` makes the selected list item red, like this:

![](domconsole0.png)

From the other side, if we're in console and have a variable referencing a DOM node, then we can use the command `inspect(node)` to see it in the Elements pane.

Or we can just output it in the console and explore "at-place", like `document.body` below:

![](domconsole1.png)

That's for debugging purposes of course. From the next chapter on we'll access and modify DOM using JavaScript.

The browser developer tools are a great help in development: we can explore the DOM, try things and see what goes wrong.

## Summary

An HTML/XML document is represented inside the browser as the DOM tree.

- Tags become element nodes and form the structure.
- Text becomes text nodes.
- ...etc, everything in HTML has its place in DOM, even comments.

We can use developer tools to inspect DOM and modify it manually.

Here we covered the basics, the most used and important actions to start with. There's an extensive documentation about Chrome Developer Tools at <https://developers.google.com/web/tools/chrome-devtools>. The best way to learn the tools is to click here and there, read menus: most options are obvious. Later, when you know them in general, read the docs and pick up the rest.

DOM nodes have properties and methods that allow to travel between them, modify, move around the page and more. We'll get down to them in the next chapters.
