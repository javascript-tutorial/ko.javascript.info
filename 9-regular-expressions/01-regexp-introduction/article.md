# 패턴과 플래그

Regular expressions is a powerful way to search and replace in text.

In JavaScript, they are available as `RegExp` object, and also integrated in methods of strings.

## 정규 표현식

정규 표현식("regexp" 또는 그냥 "reg"라고도 합니다)은 *패턴*과 선택적인 *플래그*로 구성됩니다

정규식 객체를 만드는 데에는 두 가지 문법이 있습니다.

긴 문법입니다.

```js
regexp = new RegExp("pattern", "flags");
```

그리고 짧게는, 슬래시 ``/ "`를 사용합니다.

```js
regexp = /pattern/; // 플래그 없음
regexp = /pattern/gmi; // 플래그 g, m, i가 있는 경우 (곧 다룰 예정)
```

슬래시``/ "`는 자바스크립트에 정규 표현식을 생성하고 있다는 것을 알려줍니다. 문자열에 따옴표를 쓰는 것과 동일한 역할을 합니다.

## 사용법

문자열 안에서 검색하려면 [search](mdn:js/String/search) 메서드를 사용할 수 있습니다.

다음은 그 예입니다.

```js run
let str = "I love JavaScript!"; // 여기에서 검색할 것입니다.

let regexp = /love/;
alert( str.search(regexp) ); // 2
```

`str.search` 메서드는 `pattern:/love/` 패턴을 찾고 문자열 안의 위치를 ​​돌려줍니다. 추측할 수 있듯이 `pattern:/love/` 는 가능한 패턴 중에 가장 단순한 것입니다. 이것이 하는 일은 간단한 부분 문자열 검색입니다.

위의 코드는 다음과 동일합니다.

```js run
let str = "I love JavaScript!"; // will search here

let substr = 'love';
alert( str.search(substr) ); // 2
```

그러니까 `pattern:/love/` 를 찾는 건 `"love"` 를 찾는 것과 같습니다

하지만 단지 지금만 그렇습니다. 곧 더 많은 검색 파워를 가진 더 복잡한 정규 표현식을 만들어낼 것입니다.

```smart header="색상"
여기에서 색상 구성은 다음과 같습니다.

- 정규표현식 -- `pattern:빨강`
- (검색할) 문자열  -- `subject:파랑`
- 결과 -- `match:초록`
```


````smart header="언제 `new RegExp`을 사용할까요?"
보통 우리는 짧은 구문 `/.../`을 사용합니다. 그러나 이것은 변수 삽입 `$ {...}`을 지원하지 않습니다.

반면에, `new RegExp` 는 문자열로부터 패턴을 동적으로 생성할 수 있게 해주므로, 보다 유연합니다

다음은 동적으로 생성 된 정규 표현식의 예입니다.

```js run
let tag = prompt("어떤 태그를 검색하고 싶습니까?", "h2");
let regexp = new RegExp(`<${tag}>`);

// <h2>를 기본적으로 찾습니다
alert( "<h1> <h2> <h3>".search(regexp));
```
````


## 플래그

정규 표현식에는 검색에 영향을 주는 플래그가 있을 수 있습니다.

자바스크립트에는 딱 6개가 있습니다.

`i`
: 이 플래그를 사용하면 대소문자 구분 없이 검색합니다. `A`와 `a`는 차이가 없습니다 (아래 예 참조).

`g`
: 이 플래그를 사용하면 일치하는 처음 항목 뿐만 아니라 일치하는 모든 항목을 검색합니다. (다음 챕터에 예시가 있습니다).

`m`
다중 행 모드 (<info:regexp-multiline-mode> 챕터 참조).

`s`
: "Dotall" 모드는 `.` 문자가 개행 문자도 포함하도록 합니다 (<info:regexp-character-classes> 챕터 참조).

`u`
: 유니코드를 완벽하게 지원합니다. 이 플래그를 사용하면 surrogate pair를 올바르게 처리할 수 있습니다. 자세한 내용은 <info:regexp-unicode> 챕터를 참조하세요.

`y`
: Sticky Mode (<info:regexp-sticky> 챕터 참조)

튜토리얼에서 이 모든 플래그를 더 자세히 다루겠습니다.

지금은, 가장 간단한 플래그 `i`의 예제를 살펴봅시다.

```js run
let str = "I love JavaScript!";

alert( str.search(/LOVE/i) ); // 2 (소문자를 찾았습니다)

alert( str.search(/LOVE/) ); // -1 ('i' 플래그 없이는 아무것도 찾지 못했습니다)
```

이미 `i` 플래그가 단순한 부분 문자열 검색보다는 정규 표현식을 더 강력한 것으로 만듭니다. 하지만 훨씬 더 많은 것이 있습니다. 다음 챕터들에서 다른 플래그와 기능에 대해 다룰 것입니다.


## 요약

- 정규 표현식은 패턴과 선택적인 플래그 `g`,`i`,`m`,`u`,`s`,`y` 로 구성됩니다.
- 플래그와 나중에 공부할 특수 기호가 없으면, 정규 표현식을 사용한 검색은 부분 문자열 검색과 동일합니다.
-`str.search(regexp` 메서드는 일치 항목의 인덱스를 반환하고, 만약 일치하는 것이 없다면 `-1`을 반환합니다. 다음 챕터에서는 다른 메서드를 살펴보겠습니다.
