# 팝업창과 윈도우 메서드

팝업창은 사용자에게 추가 정보를 표시하는 가장 오래된 방법 중 하나입니다.

기본적으로 이렇게 작성하면 됩니다.
```js
window.open('https://javascript.info/')
```

그리고 작성한 URL로 새로운 창이 열릴 것입니다. 대부분의 최신 브라우저는 별도의 창 대신 새로운 탭에 열도록 구성되어 있습니다.

팝업은 아주 오래전부터 존재했습니다. 초기의 아이디어는 메인 창을 닫지 않고 다른 내용을 보여주는 것이었습니다. 현재로서는 그렇게 하는 다른 방법들이 있습니다. [fetch](info:fetch)로 동적으로 콘텐츠를 로딩하고 동적으로 생성되는 `<div>`를 통해 보여줄 수 있습니다. 그래서 팝업을 우리가 매일 사용하지는 않습니다.

또한, 여러 개의 창을 동시에 표시하지 않는 모바일 기기에서는 팝업이 까다롭습니다.

여전히 OAuth 인증(Google/Facebook/...에 로그인)과 같은 곳에 팝업은 아직도 사용되고 있습니다. 왜냐하면,

1. 팝업은 독립된 자바스크립트 환경을 가진 별도의 창입니다. 그래서 제 3자의 신뢰할 수 없는 사이트에서 팝업을 여는 것은 안전합니다.
2. 팝업을 여는 방법이 매우 쉽습니다.
3. 팝업은 다른 창에도 opener를 사용하여 메세지를 다루고 보낼 수 있습니다.

## 팝업 차단

과거에는, 악의적인 사이트들이 팝업을 많이 악용했습니다. 나쁜 페이지는 광고가 있는 많은 팝업창들을 열 수 있습니다. 그래서 현재 대부분의 브라우저는 팝업을 차단하고 사용자들을 보호하려 노력합니다.

**대부분의 브라우저가 `onclick`과 같이 사용자 트리거 이벤트 핸들러의 외부에서 호출되는 경우 팝업들을 차단합니다.**

예시:
```js
// 팝업 차단
window.open('https://javascript.info');

// 팝업 허용
button.onclick = () => {
  window.open('https://javascript.info');
};
```

이렇게 하면 사용자들은 어느정도 원하지 않는 팝업에 보호되지만, 기능이 완전히 비활성화된 것은 아닙니다.

`setTimeout`이 지난 뒤, `onclick`으로 팝업을 연다면 어떨까요? 그건 좀 까다롭습니다.

이 코드를 작성해보세요.

```js run
// 3초 뒤에 열립니다.
setTimeout(() => window.open('http://google.com'), 3000);
```

이 팝업은 Chrome에선 열리지만, Firefox에선 차단됩니다.

...지연 시간을 줄이면, Firefox에서도 작동합니다.

```js run
// 1초 뒤에 열립니다.
setTimeout(() => window.open('http://google.com'), 1000);
```

차이점은 Firefox가 2000ms 이하의 시간 초과가 허용되지만, 그 이후에는 '신뢰'를 제거한다는 것입니다. 이제는 '사용자 작업 외부'라고 추정합니다. 그래서 첫 번째는 차단되고, 두 번째는 차단되지 않습니다.

## window.open

The syntax to open a popup is: `window.open(url, name, params)`:

url
: An URL to load into the new window.

name
: A name of the new window. Each window has a `window.name`, and here we can specify which window to use for the popup. If there's already a window with such name -- the given URL opens in it, otherwise a new window is opened.

params
: The configuration string for the new window. It contains settings, delimited by a comma. There must be no spaces in params, for instance: `width:200,height=100`.

Settings for `params`:

- Position:
  - `left/top` (numeric) -- coordinates of the window top-left corner on the screen. There is a limitation: a new window cannot be positioned offscreen.
  - `width/height` (numeric) -- width and height of a new window. There is a limit on minimal width/height, so it's impossible to create an invisible window.
- Window features:
  - `menubar` (yes/no) -- shows or hides the browser menu on the new window.
  - `toolbar` (yes/no) -- shows or hides the browser navigation bar (back, forward, reload etc) on the new window.
  - `location` (yes/no) -- shows or hides the URL field in the new window. FF and IE don't allow to hide it by default.
  - `status` (yes/no) -- shows or hides the status bar. Again, most browsers force it to show.
  - `resizable` (yes/no) -- allows to disable the resize for the new window. Not recommended.
  - `scrollbars` (yes/no) -- allows to disable the scrollbars for the new window. Not recommended.


There is also a number of less supported browser-specific features, which are usually not used. Check <a href="https://developer.mozilla.org/en/DOM/window.open">window.open in MDN</a> for examples.

## Example: a minimalistic window   

Let's open a window with minimal set of features just to see which of them browser allows to disable:

```js run
let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;

open('/', 'test', params);
```

Here most "window features" are disabled and window is positioned offscreen. Run it and see what really happens. Most browsers "fix" odd things like zero `width/height` and offscreen `left/top`. For instance, Chrome open such a window with full width/height, so that it occupies the full screen.

Let's add normal positioning options and reasonable `width`, `height`, `left`, `top` coordinates:

```js run
let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=600,height=300,left=100,top=100`;

open('/', 'test', params);
```

Most browsers show the example above as required.

Rules for omitted settings:

- If there is no 3rd argument in the `open` call, or it is empty, then the default window parameters are used.
- If there is a string of params, but some `yes/no` features are omitted, then the omitted features assumed to have `no` value. So if you specify params, make sure you explicitly set all required features to yes.
- If there is no `left/top` in params, then the browser tries to open a new window near the last opened window.
- If there is no `width/height`, then the new window will be the same size as the last opened.

## Accessing popup from window

The `open` call returns a reference to the new window. It can be used to manipulate it's properties, change location and even more.

In this example, we generate popup content from JavaScript:

```js
let newWin = window.open("about:blank", "hello", "width=200,height=200");

newWin.document.write("Hello, world!");
```

And here we modify the contents after loading:

```js run
let newWindow = open('/', 'example', 'width=300,height=300')
newWindow.focus();

alert(newWindow.location.href); // (*) about:blank, loading hasn't started yet

newWindow.onload = function() {
  let html = `<div style="font-size:30px">Welcome!</div>`;
*!*
  newWindow.document.body.insertAdjacentHTML('afterbegin', html);
*/!*
};
```

Please note: immediately after `window.open`, the new window isn't loaded yet. That's demonstrated by `alert` in line `(*)`. So we wait for `onload` to modify it. We could also use `DOMContentLoaded` handler for `newWin.document`.

```warn header="Same origin policy"
Windows may freely access content of each other only if they come from the same origin (the same protocol://domain:port).

Otherwise, e.g. if the main window is from `site.com`, and the popup from `gmail.com`, that's impossible for user safety reasons. For the details, see chapter <info:cross-window-communication>.
```

## Accessing window from popup

A popup may access the "opener" window as well using `window.opener` reference. It is `null` for all windows except popups.

If you run the code below, it replaces the opener (current) window content with "Test":

```js run
let newWin = window.open("about:blank", "hello", "width=200,height=200");

newWin.document.write(
  "<script>window.opener.document.body.innerHTML = 'Test'<\/script>"
);
```

So the connection between the windows is bidirectional: the main window and the popup have a reference to each other.

## Closing a popup

To close a window: `win.close()`.

To check if a window is closed: `win.closed`.

Technically, the `close()` method is available for any `window`, but `window.close()` is ignored by most browsers if `window` is not created with `window.open()`. So it'll only work on a popup.

The `closed` property is `true` if the window is closed. That's useful to check if the popup (or the main window) is still open or not. A user can close it anytime, and our code should take that possibility into account.

This code loads and then closes the window:

```js run
let newWindow = open('/', 'example', 'width=300,height=300');

newWindow.onload = function() {
  newWindow.close();
  alert(newWindow.closed); // true
};
```


## Scrolling and resizing

There are methods to move/resize a window:

`win.moveBy(x,y)`
: Move the window relative to current position `x` pixels to the right and `y` pixels down. Negative values are allowed (to move left/up).

`win.moveTo(x,y)`
: Move the window to coordinates `(x,y)` on the screen.

`win.resizeBy(width,height)`
: Resize the window by given `width/height` relative to the current size. Negative values are allowed.

`win.resizeTo(width,height)`
: Resize the window to the given size.

There's also `window.onresize` event.

```warn header="Only popups"
To prevent abuse, the browser usually blocks these methods. They only work reliably on popups that we opened, that have no additional tabs.
```

```warn header="No minification/maximization"
JavaScript has no way to minify or maximize a window. These OS-level functions are hidden from Frontend-developers.

Move/resize methods do not work for maximized/minimized windows.
```

## Scrolling a window

We already talked about scrolling a window in the chapter <info:size-and-scroll-window>.

`win.scrollBy(x,y)`
: Scroll the window `x` pixels right and `y` down relative the current scroll. Negative values are allowed.

`win.scrollTo(x,y)`
: Scroll the window to the given coordinates `(x,y)`.

`elem.scrollIntoView(top = true)`
: Scroll the window to make `elem` show up at the top (the default) or at the bottom for `elem.scrollIntoView(false)`.

There's also `window.onscroll` event.

## Focus/blur on a window

Theoretically, there are `window.focus()` and `window.blur()` methods to focus/unfocus on a window.  Also there are `focus/blur` events that allow to focus a window and catch the moment when the visitor switches elsewhere.

In the past evil pages abused those. For instance, look at this code:

```js run
window.onblur = () => window.focus();
```

When a user attempts to switch out of the window (`blur`), it brings it back to focus. The intention is to "lock" the user within the `window`.

So, there are limitations that forbid the code like that. There are many limitations to protect the user from ads and evils pages. They depend on the browser.

For instance, a mobile browser usually ignores that call completely. Also focusing doesn't work when a popup opens in a separate tab rather than a new window.

Still, there are some things that can be done.

For instance:

- When we open a popup, it's might be a good idea to run a `newWindow.focus()` on it. Just in case, for some OS/browser combinations it ensures that the user is in the new window now.
- If we want to track when a visitor actually uses our web-app, we can track `window.onfocus/onblur`. That allows us to suspend/resume in-page activities, animations etc. But please note that the `blur` event means that the visitor switched out from the window, but they still may observe it. The window is in the background, but still may be visible.

## Summary   

Popup windows are used rarely, as there are alternatives: loading and displaying information in-page, or in iframe.

If we're going to open a popup, a good practice is to inform the user about it. An "opening window" icon near a link or button would allow the visitor to survive the focus shift and keep both windows in mind.

- A popup can be opened by the `open(url, name, params)` call. It returns the reference to the newly opened window.
- Browsers block `open` calls from the code outside of user actions. Usually a notification appears, so that a user may allow them.
- Browsers open a new tab by default, but if sizes are provided, then it'll be a popup window.
- The popup may access the opener window using the `window.opener` property.
- The main window and the popup can freely read and modify each other if they have the same origin. Otherwise, they can change location of each other and [exchange messages](info:cross-window-communication).

To close the popup: use `close()` call. Also the user may close them (just like any other windows). The `window.closed` is `true` after that.

- Methods `focus()` and `blur()` allow to focus/unfocus a window. But they don't work all the time.
- Events `focus` and `blur` allow to track switching in and out of the window. But please note that a  window may still be visible even in the background state, after `blur`.
