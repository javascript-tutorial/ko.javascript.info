# 브라우저 창 사이즈와 스크롤

브라우저 창이 차지하는 너비와 높이를 어떻게 구할 수 있을까요? 스크롤 때문에 보이지 않는 영역을 포함하여 문서 전체가 차지하는 너비와 높이는 어떻게 구할 수 있을까요? 자바스크립트를 사용해서 페이지를 스크롤 할 수 있을까요?

<<<<<<< HEAD
이번 챕터에선 위와 같은 물음에 답을 주는 루트 문서 요소인 `document.documentElement`를 살펴볼 예정입니다. `document.documentElement`는 `<html>` 태그와 상응하는 요소로 다양한 메서드를 지원합니다. 유용한 메서드이긴 하지만 몇 가지 주의할 점이 있어 같이 살펴봅시다.
=======
For this type of information, we can use the root document element `document.documentElement`, that corresponds to the `<html>` tag. But there are additional methods and peculiarities to consider.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

## 브라우저 창의 너비와 높이

<<<<<<< HEAD
창이 차지하는 너비와 높이를 알려면 `document.documentElement`의 `clientWidth`와 `clientHeight`를 사용하면 됩니다.
=======
To get window width and height, we can use the `clientWidth/clientHeight` of `document.documentElement`:
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

![](document-client-width-height.svg)

```online
아래 버튼을 눌러 직접 창 높이를 출력해보세요.

<button onclick="alert(document.documentElement.clientHeight)">alert(document.documentElement.clientHeight)</button>
```

<<<<<<< HEAD
````warn header="`window` 객체가 아닌 `document.documentElement`를 쓰는 이유"
브라우저의 `window` 객체 역시 `innerWidth`와 `innerHeight` 프로퍼티를 지원합니다. 이 프로퍼티를 써도 원하는 대로 창 크기를 구할 수 있을 것 같은데 왜 `document.documentElement`의 `clientWidth`나 `clientHeight`를 쓰는 걸까요?

스크롤바가 생기면 스크롤바 역시 공간을 차지하는데, `clientWidth`나 `clientHeight`는 스크롤바가 차지하는 공간을 제외해서 너비나 높이 값을 계산합니다. 눈에 보이는 문서에서 콘텐츠가 실제로 들어가게 될 영역의 너비와 높이 값을 반환하는 것이죠.

그런데 `window.innerWidth/innerHeight`는 스크롤바가 차지하는 영역을 포함해 값을 계산합니다.
=======
````warn header="Not `window.innerWidth/innerHeight`"
Browsers also support properties like `window.innerWidth/innerHeight`. They look like what we want, so why not to use them instead?

If there exists a scrollbar, and it occupies some space, `clientWidth/clientHeight` provide the width/height without it (subtract it). In other words, they return the width/height of the visible part of the document, available for the content.

`window.innerWidth/innerHeight` includes the scrollbar.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

스크롤바가 있는 경우 스크롤 바 역시 공간을 차지하는데, 이럴 때 `window`객체와 `document.documentElement`의 해당 프로퍼티들은 다른 값을 반환합니다.
```js run
alert( window.innerWidth ); // 전체 창 너비
alert( document.documentElement.clientWidth ); // 스크롤바가 차지하는 영역을 제외한 창 너비
```

<<<<<<< HEAD
창 사이즈가 필요한 경우는 스크롤 바 안쪽에 무언가를 그리거나 위치시킬 때가 대다수입니다. 따라서 `documentElement`의 `clientHeight/clientWidth`를 써야 합니다.
=======
In most cases, we need the *available* window width in order to draw or position something within scrollbars (if there are any), so we should use `documentElement.clientHeight/clientWidth`.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c
````

```warn header="`DOCTYPE`을 꼭 써주세요."
기하 관련 프로퍼티는 HTML에 문서에 `<!DOCTYPE HTML>`이 명시되어있지 않으면 이상하게 동작할 때가 있습니다. 정확하지 않거나 근거를 알 수 없는 값이 툭 튀어나올 수 있죠.

그러니 앞으로는 항상 HTML에 `DOCTYPE`을 명시하도록 합시다.
```

## 문서의 너비와 높이

<<<<<<< HEAD
이론상 `document.documentElement`는 문서의 루트 요소에 상응하고, 루트 요소엔 콘텐츠 전부가 들어가기 때문에 우리는 문서의 전체 크기를 `document.documentElement`의 `scrollWidth`와 `scrollHeight`를 사용해 재면 되지 않냐고 생각합니다.

그런데 전체 페이지를 대상으로 했을 때, `document.documentElement`의 프로피터들은 우리가 예상한 대로 동작하지 않습니다. Chrome이나 Safari, Opera에서 스크롤이 없는 경우 `documentElement.scrollHeight`는 `documentElement.clientHeight`보다 작을 때가 있죠. 예상하기엔 같은 값이어야 하는데도 말입니다.
=======
Theoretically, as the root document element is `document.documentElement`, and it encloses all the content, we could measure the document's full size as `document.documentElement.scrollWidth/scrollHeight`.

But on that element, for the whole page, these properties do not work as intended. In Chrome/Safari/Opera, if there's no scroll, then `documentElement.scrollHeight` may be even less than `documentElement.clientHeight`! Weird, right?
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

정확한 문서 전체 높이 값을 얻으려면 아래 여섯 프로퍼티가 반환하는 값 중 최댓값을 골라야 합니다.

```js run
let scrollHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);

alert('스크롤에 의해 가려진 분을 포함한 전체 문서 높이: ' + scrollHeight);
```

그렇다면 왜 이런 방식으로 문서 전체 높이를 구해야 하는 걸까요? 이유는 알아보지 않는 게 낫습니다. 이런 이상한 계산법은 아주 오래 전부터 있었고 그다지 논리적이지 않은 이유로 만들어졌기 때문입니다.

## 스크롤 정보 얻기 [#page-scroll]

<<<<<<< HEAD
DOM 요소의 현재 스크롤 상태(스크롤에 의해 가려진 영역에 대한 정보)는 `scrollLeft`와 `scrollTop` 프로퍼티를 통해 구할 수 있습니다.

대부분의 브라우저에서 문서의 스크롤 상태는 `document.documentElement`의 `scrollLeft`나 `scrollTop`을 이용해 구할 수 있습니다. 다만 구버전 WebKit을 기반으로 하는 브라우저에선 버그([5991](https://bugs.webkit.org/show_bug.cgi?id=5991)) 때문에 `document.documentElement`가 아닌 `document.body`를 사용해야 원하는 값을 구할 수 있습니다.

이쯤 되면 스크롤 포지션 정보를 구하기 위해 브라우저별 예외처리까지 다 해야 하나 라는 생각이 들 수 있을 겁니다. 다행히도 `window`객체의 `pageXOffset`과 `pageYOffset`을 사용하면 브라우저 상관없이 스크롤 정보를 구할 수 있어서 이런 예외 상황을 외워두지 않아도 됩니다.
=======
DOM elements have their current scroll state in their `scrollLeft/scrollTop` properties.

For document scroll, `document.documentElement.scrollLeft/scrollTop` works in most browsers, except older WebKit-based ones, like Safari (bug [5991](https://bugs.webkit.org/show_bug.cgi?id=5991)), where we should use `document.body` instead of `document.documentElement`.

Luckily, we don't have to remember these peculiarities at all, because the scroll is available in the special properties, `window.pageXOffset/pageYOffset`:
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

```js run
alert('세로 스크롤에 의해 가려진 위쪽 영역 높이: ' + window.pageYOffset);
alert('가로 스크롤에 의해 가려진 왼쪽 영역 너비: ' + window.pageXOffset);
```

참고로 이 두 프로퍼티는 읽기만 가능합니다.

<<<<<<< HEAD
## scrollTo, scrollBy로 스크롤 상태 변경하기 [#window-scroll]

```warn
자바스크립트를 사용해 스크롤을 움직이려면 DOM이 완전히 만들어진 상태이어야 합니다.

`<head>`에 있는 스크립트에서 페이지 전체의 스크롤을 움직이려 하면 잘 동작하지 않을 수 있습니다.
=======
```smart header="Also available as `window` properties `scrollX` and `scrollY`"
For historical reasons, both properties exist, but they are the same:
- `window.pageXOffset` is an alias of `window.scrollX`.
- `window.pageYOffset` is an alias of `window.scrollY`.
```

## Scrolling: scrollTo, scrollBy, scrollIntoView [#window-scroll]

```warn
To scroll the page with JavaScript, its DOM must be fully built.

For instance, if we try to scroll the page with a script in `<head>`, it won't work.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c
```

일반 요소의 스크롤 상태는 `scrollTop`이나 `scrollLeft`로 쉽게 변경할 수 있습니다.

<<<<<<< HEAD
페이지 전체의 스크롤 상태 역시 `document.documentElement`의 `scrollTop/scrollLeft`를 사용해 변경 가능하죠(다만, Safari는 `document.body`의 `scrollTop/scrollLeft`를 써야 합니다).

그런데 이보다 더 편하고 브라우저 상관없이 쓸 수 있는 대안이 있긴합니다. 바로 [window.scrollBy(x,y)](mdn:api/Window/scrollBy)와 [window.scrollTo(pageX,pageY)](mdn:api/Window/scrollTo)입니다.
=======
We can do the same for the page using `document.documentElement.scrollTop/scrollLeft` (except Safari, where `document.body.scrollTop/Left` should be used instead).

Alternatively, there's a simpler, universal solution: special methods [window.scrollBy(x,y)](mdn:api/Window/scrollBy) and [window.scrollTo(pageX,pageY)](mdn:api/Window/scrollTo).
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

- `scrollBy(x,y)`메서드를 사용하면 페이지의 스크롤 상태를 현재 포지션을 기준으로 상대적으로 조정합니다. `scrollBy(0,10)`는 문서의 스크롤 상태를 현재를 기준으로 스크롤을 `10px`아래로 내린것 처럼 움직여주죠.

    ```online
    아래 버튼을 눌러 직접 실습해봅시다.

    <button onclick="window.scrollBy(0,10)">window.scrollBy(0,10)</button>
    ```
- 반면 `scrollTo(pageX,pageY)`메서드는 *절대 좌표*를 기준으로 페이지 스크롤 상태를 변경합니다. 따라서 눈에 보이는 영역의 왼쪽 위 모서리의 좌표가 문서 전체의 왼쪽 위 모서리를 기준으로 `(pageX, pageY)`가 됩니다. 마치 `scrollLeft`와 `scrollTop` 값을 변경한 것처럼 움직이는 거죠.

    그래서 `scrollTo(0,0)`을 호출하면 문서 스크롤 상태를 처음 상태로 되돌릴 수 있습니다.

    ```online
    <button onclick="window.scrollTo(0,0)">window.scrollTo(0,0)</button>
    ```

그리고 이 두 메서드는 브라우저 종류에 상관없이 동일한 동작을 보장합니다.

## scrollIntoView

<<<<<<< HEAD
추가 메서드 [elem.scrollIntoView(top)](mdn:api/Element/scrollIntoView)를 머릿속에 추가해 스크롤 상태를 완벽히 마스터 해봅시다.
=======
For completeness, let's cover one more method: [elem.scrollIntoView(top)](mdn:api/Element/scrollIntoView).
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

`elem.scrollIntoView(top)`를 호출하면 전체 페이지 스크롤이 움직여 `elem`이 눈에 보이는 상태로 변경됩니다. `elem.scrollIntoView`는 인수를 하나 받는데, 인수에 따라 다음과 같이 동작합니다.

<<<<<<< HEAD
- `top`이 `true`(디폴트)인 경우, `elem`이 창 제일 위에 보이도록 스크롤 상태가 변경됩니다. `elem`의 위쪽 모서리가 창의 위쪽 모서리와 일치하게 되죠.
- `top`이 `false`인 경우, `elem`이 창 가장 아래에 보이도록 스크롤 상태가 변경됩니다. `elem`의 아래쪽 모서리가 창의 아래쪽 모서리와 일치하게 변합니다.

```online
버튼을 눌러 직접 실습해봅시다. 첫 번째 버튼을 누르면 버튼 상단이 창 제일 꼭대기로 붙는 것을 확인할 수 있습니다.

<button onclick="this.scrollIntoView()">this.scrollIntoView()</button>

두 번째 버튼을 누르면 버튼의 아래 모서리가 창 밑으로 붙는 것을 확인할 수 있습니다.
=======
- If `top=true` (that's the default), then the page will be scrolled to make `elem` appear on the top of the window. The upper edge of the element will be aligned with the window top.
- If `top=false`, then the page scrolls to make `elem` appear at the bottom. The bottom edge of the element will be aligned with the window bottom.

```online
The button below scrolls the page to position itself at the window top:

<button onclick="this.scrollIntoView()">this.scrollIntoView()</button>

And this button scrolls the page to position itself at the bottom:
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

<button onclick="this.scrollIntoView(false)">this.scrollIntoView(false)</button>
```

## 스크롤 막기

<<<<<<< HEAD
때에 따라 문서 스크롤바를 '고정' 해야 하는 경우가 생기곤 합니다. 사용자에게 반드시 전달해야 하는 중요한 메시지가 있어서 이 메시지를 화면에 크게 띄우고, 사용자가 스크롤을 움직여 다른 콘텐츠를 보지 못하게 한 상태에서 메시지를 읽게 하려는 경우가 대표적인 예가 될 수 있습니다.

이럴 때 `document.body.style.overflow = "hidden"`를 사용할 수 있습니다. 해당 스크립트가 동작하면 페이지의 스크롤바 위치가 '고정' 됩니다.
=======
Sometimes we need to make the document "unscrollable". For instance, when we need to cover the page with a large message requiring immediate attention, and we want the visitor to interact with that message, not with the document.

To make the document unscrollable, it's enough to set `document.body.style.overflow = "hidden"`. The page will "freeze" at its current scroll position.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

```online
직접 실습해봅시다.

<button onclick="document.body.style.overflow = 'hidden'">document.body.style.overflow = 'hidden'</button>

<button onclick="document.body.style.overflow = ''">document.body.style.overflow = ''</button>

<<<<<<< HEAD
위쪽 버튼을 누르면 스크롤바가 고정되었다가, 아래 버튼을 누르면 고정이 해제되는 것을 확인할 수 있습니다.
```

이 방법은 `document.body`요소 뿐만 아니라 다른 요소의 스크롤을 고정시킬 때도 사용할 수 있습니다.

그런데 이 방법은 스크롤바가 사라진다는 단점이 있습니다. 스크롤바는 일정 공간을 차지하는데, 스크롤바가 사라지면 해당 공간을 채우기 위해 콘텐츠가 갑자기 '움직이는' 현상이 발생합니다.  

이렇게 페이지 전체의 스크롤 상태가 갑자기 변경되면 사용자 입장에선 이상해 보일 수 있기 때문에 개발자는 스크롤바를 고정시키기 전과 후의 `clientWidth`값을 비교해서 해당 증상을 보정해야 합니다. 스크롤바가 사라질 땐 `clientWidth`값이 커지는데 이때 스크롤바가 차지했던 영역만큼 `document.body`에 `padding`을 줘서 콘텐츠 전체의 너비를 스크롤바가 사라지기 전과 같은 값으로 유지할 수 있습니다.
=======
The first button freezes the scroll, while the second one releases it.
```

We can use the same technique to freeze the scroll for other elements, not just for `document.body`.

The drawback of the method is that the scrollbar disappears. If it occupied some space, then that space is now free and the content "jumps" to fill it.

That looks a bit odd, but can be worked around if we compare `clientWidth` before and after the freeze. If it increased (the scrollbar disappeared), then add `padding` to `document.body` in place of the scrollbar to keep the content width the same.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

## 요약

기하 프로퍼티:

<<<<<<< HEAD
- 사용자 눈에 보이는 문서(콘텐츠가 실제 보여지는 영역)의 너비와 높이: `document.documentElement.clientWidth/clientHeight`
- 스크롤에 의해 가려진 영역을 포함한 문서 전체의 너비와 높이:
=======
- Width/height of the visible part of the document (content area width/height): `document.documentElement.clientWidth/clientHeight`
- Width/height of the whole document, with the scrolled out part:
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

    ```js
    let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    ```

스크롤 관련 프로퍼티:

- 현재 스크롤 정보 읽기: `window.pageYOffset/pageXOffset`.
- 스크롤 상태 변경시키기:

    - `window.scrollTo(pageX,pageY)` -- 절대 좌표
    - `window.scrollBy(x,y)` -- 현재 스크롤 상태를 기준으로 상대적으로 스크롤 정보 변경
    - `elem.scrollIntoView(top)` -- `elem`이 눈에 보이도록 스크롤 상태 변경(인수에 따라 창 최상단, 최하단에 해당 요소가 노출되도록 처리)
