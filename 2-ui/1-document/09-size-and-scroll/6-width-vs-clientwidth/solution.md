Differences:

1. `getComputedStyle(elem).width`가 끝에 `px`과 함께 스트링값을 반환하는 반면에, `clientWidth`는 숫자값을 반환합니다.
2. `getComputedStyle` 은 아마 인라인 요소(inline element)의 `“auto”`와 같은 숫자가 아닌 너비 값을 반환할 것입니다.
3. CSS 너비 표준과 `box-sizing`은 *패딩을 제외한* 내부 콘텐츠 공간을 가리키는 것에 비해 `clientWidth`는 요소와 패딩이 합쳐진 내부 콘텐츠 공간을 가리킵니다.
4. 스크롤바와 브라우저가 자신을 위한 영역을 따로 둔다면, 몇 브라우저는 CSS 너비(왜냐하면, 더는 콘텐츠에 사용할 수 없기 때문이겠죠.)로부터 해당 영역을 뺄 것이며 몇 브라우저는 빼지 않을 것입니다. `clientWidth` 프로퍼티는 항상 같을 것입니다: 스크롤바 사이즈는 영역이 있으면 제외됩니다.
