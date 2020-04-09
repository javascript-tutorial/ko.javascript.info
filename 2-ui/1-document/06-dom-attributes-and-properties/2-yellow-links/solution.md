
먼저 외부 참조를 모두 찾아야 합니다.

두 가지 방법을 사용해 외부 참조를 찾을 수 있습니다.

첫 번째 방법은 `document.querySelectorAll('a')`를 사용해 모든 링크를 찾은 후 필요한 것만 걸러내는 것입니다.

```js
let links = document.querySelectorAll('a');

for (let link of links) {
*!*
  let href = link.getAttribute('href');
*/!*
  if (!href) continue; // 속성이 존재하지 않음

  if (!href.includes('://')) continue; // 프로토콜이 존재하지 않음

  if (href.startsWith('http://internal.com')) continue; // 내부 링크

  link.style.color = 'orange';
}
```

참고: HTML의 값이 필요하기 때문에 `link.href`가 아니라 `link.getAttribute('href')`를 사용합니다.

더 간단한 방법은 CSS 선택자에 조건을 명시해 주는 것입니다.

```js
// href에 :// 가 포함된 모든 링크를 찾습니다.
// 그 중 http://internal.com으로 시작하지 않는 링크를 찾습니다.
let selector = 'a[href*="://"]:not([href^="http://internal.com"])';
let links = document.querySelectorAll(selector);

links.forEach(link => link.style.color = 'orange');
```
