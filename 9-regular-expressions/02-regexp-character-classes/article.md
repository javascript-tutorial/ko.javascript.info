# 문자 클래스

실제 업무 상황을 생각해봅시다. `"+7(903)-123-45-67"`같은 전화번호에서 `79035419441`처럼 숫자만 남겨야 합니다.

이렇게 하려면 숫자가 아닌 문자를 모두 찾아서 지우면 되겠죠. 여기서 문자 클래스를 사용할 수 있습니다.

*문자 클래스(character class)* 는 특정 집합에 포함된 모든 기호에 일치하는 특별한 표현입니다.

가장 먼저 숫자 클래스부터 알아봅시다. 숫자(digit) 클래스는 `pattern:\d`라고 쓰고 '아무 숫자 하나'에 대응합니다.

<<<<<<< HEAD
앞에서 나온 전화번호 예시에서 첫 번째 숫자를 찾아봅시다.
=======
For instance, let's find the first digit in the phone number:
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b

```js run
let str = "+7(903)-123-45-67";

let regexp = /\d/;

alert( str.match(regexp) ); // 7
```

`pattern:g` 플래그가 없으면 정규 표현식은 패턴과 일치하는 첫 문자만 찾습니다. 여기서는 `pattern:\d`에 일치하는 첫 번째 숫자이죠.

이제 `pattern:g` 플래그를 추가해 모든 숫자를 찾아봅시다.

```js run
let str = "+7(903)-123-45-67";

let regexp = /\d/g;

alert( str.match(regexp) ); // 일치하는 문자의 배열: 7,9,0,3,1,2,3,4,5,6,7

// 이 배열로 숫자만 있는 전화번호를 만듭시다.
alert( str.match(regexp).join('') ); // 79035419441
```

여기까지 숫자를 찾는 문자 클래스였습니다. 물론 다른 문자 클래스도 있습니다.

자주 사용하는 문자 클래스에는 다음 클래스가 있습니다.

`pattern:\d` ('digit(숫자)'의 'd')
: 숫자: `0`에서 `9` 사이의 문자

`pattern:\s` ('space(공백)'의 's')
: 스페이스, 탭(`\t`), 줄 바꿈(`\n`)을 비롯하여 아주 드물게 쓰이는 `\v`, `\f`, `\r` 을 포함하는 공백 기호

`pattern:\w` ('word(단어)'의 'w')
: '단어에 들어가는' 문자로 라틴 문자나 숫자, 밑줄 `_`을 포함합니다. 키릴 문자나 힌디 문자같은 비 라틴 문자는 `pattern:\w`에 포함되지 않습니다.

예를 들어 `pattern:\d\s\w`는 `match:1 a`처럼 '숫자' 뒤에 '공백 문자' 뒤에 '단어에 들어가는 문자'를 의미합니다.

**정규 표현식에 일반 기호와 문자 클래스를 같이 사용할 수 있습니다.**

예시로, `pattern:CSS\d`는 `match:CSS` 뒤에 숫자 하나가 있는 문자열과 일치합니다.

```js run
let str = "Is there CSS4?";
let regexp = /CSS\d/;

alert( str.match(regexp) ); // CSS4
```

또한 문자 클래스를 여러 개 사용할 수도 있습니다.

```js run
alert( "I love HTML5!".match(/\s\w\w\w\w\d/) ); // ' HTML5'
```

일치 결과(각각의 문자 클래스에 글자 하나씩 일치):

![](love-html5-classes.svg)

## 반대 클래스

모든 문자 클래스에는 '반대 클래스'가 있습니다. 같은 글자로 표기하지만 대문자로 사용합니다.

'반대'란 다음 예시들처럼 해당 문자를 제외한 모든 문자에 일치한다는 뜻입니다.

`pattern:\D`
: 숫자가 아닌 문자: `pattern:\d`와 일치하지 않는 일반 글자 등의 모든 문자

`pattern:\S`
: 공백이 아닌 문자: `pattern:\s`와 일치하지 않는 일반 글자 등의 모든 문자

`pattern:\W`
: 단어에 들어가지 않는 문자: `pattern:\w`와 일치하지 않는 비 라틴 문자나 공백 등의 모든 문자

이번 챕터의 첫 부분에서 `subject:+7(903)-123-45-67`같은 문자열에서 숫자를 모두 찾아 합쳐서 숫자만 남은 전화번호를 만드는 방법을 알아봤습니다.

```js run
let str = "+7(903)-123-45-67";

alert( str.match(/\d/g).join('') ); // 79031234567
```

더 짧게 할 수 있는 다른 방법은 `pattern:\D`로 숫자가 아닌 문자를 찾아 문자열에서 없애버리는 것입니다.

```js run
let str = "+7(903)-123-45-67";

alert( str.replace(/\D/g, "") ); // 79031234567
```

## 점은 '아무 문자'에나 일치

점`pattern:.`은 줄 바꿈 문자를 제외한 모든 문자와 일치하는 특별한 문자 클래스입니다.

예시:

```js run
alert( "Z".match(/./) ); // Z
```

정규 표현식 안에서도 사용 가능합니다.

```js run
let regexp = /CS.4/;

alert( "CSS4".match(regexp) ); // CSS4
alert( "CS-4".match(regexp) ); // CS-4
alert( "CS 4".match(regexp) ); // CS 4 (공백도 문자예요.)
```

<<<<<<< HEAD
점은 아무 문자에나 일치하지만 '문자의 부재'와 일치하지는 않습니다. 반드시 일치하는 문자가 있어야 합니다.
=======
Please note that a dot means "any character", but not the "absence of a character". There must be a character to match it:
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b

```js run
alert( "CS4".match(/CS.4/) ); // null, 점과 일치하는 문자가 없기 때문에 일치 결과가 없습니다.
```

### 's' 플래그와 점을 사용해 정말로 모든 문자 찾기

기본적으로는 점은 줄 바꿈 문자 `\n`와는 일치하지 않습니다.

즉, 정규 표현식 `pattern:A.B`는 `match:A`와 `match:B` 사이에 `\n`을 제외한 어떤 문자든 들어간 문자열과 일치합니다.

```js run
alert( "A\nB".match(/A.B/) ); // null (일치하지 않음)
```

실제로는 점이 줄 바꿈 문자를 포함한 정말로 모든 문자와 일치해야 하는 상황이 자주 있습니다.

이럴 때 사용하는 것이 `pattern:s`입니다. 정규 표현식에 `pattern:s`를 사용했을 때 점`pattern:.`은 모든 문자와 일치합니다.

```js run
alert( "A\nB".match(/A.B/s) ); // A\nB (일치!)
```

<<<<<<< HEAD
````warn header="Firefox, IE, Edge에서 지원하지 않음"
<https://caniuse.com/#search=dotall>에서 지원 여부의 최신 상황을 확인해보세요. 이 글을 작성하는 시점에 `pattern:s` 플래그는 Firefox, IE, Edge에서 아직 지원하지 않습니다.

다행히도 어느 브라우저에서나 쓸 수 있는 대안이 있습니다. `pattern:[\s\S]`같은 정규 표현식을 사용해 '모든 문자'와 일치시킬 수 있습니다.
=======
````warn header="Not supported in IE"
The `pattern:s` flag is not supported in IE.

Luckily, there's an alternative, that works everywhere. We can use a regexp like `pattern:[\s\S]` to match "any character" (this pattern will be covered in the article <info:regexp-character-sets-and-ranges>).
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b

```js run
alert( "A\nB".match(/A[\s\S]B/) ); // A\nB (일치!)
```

`pattern:[\s\S]` 패턴의 문자 그대로의 뜻은 '공백 문자 또는 공백 문자가 아닌 문자'입니다. 결국은 모든 문자라는 뜻이죠. 이런 식으로 반대되는 클래스를 같이 사용하는 다른 패턴, 예를 들면 `pattern:[\d\D]`을 사용할 수도 있습니다. 또는 아무 문자도 없는 경우를 제외하는 `pattern:[^]`을 사용할 수도 있습니다.

그리고 이 기술을 이용해 같은 정규 표현식 안에서 점의 두 가지 패턴을 모두 사용할 수 있습니다. 줄 바꿈 문자를 포함하지 않는 원래의 점 `pattern:.`과 모든 문자와 일치하는 `pattern:[\s\S]`같은 패턴을 동시에 사용 가능합니다.
````

````warn header="공백을 주의하세요."
사람은 보통 공백을 크게 의식하지 않습니다. 사람에게는 문자열 `subject:1-5`나 `subject:1 - 5`나 거의 같으니까요.

하지만 정규 표현식에서 공백을 염두하지 않으면 원하는 결과를 얻지 못할 수 있습니다.

하이픈으로 구분된 숫자를 찾아봅시다.

```js run
alert( "1 - 5".match(/\d-\d/) ); // null, 일치 결과 없음!
```

정규 표현식에 공백을 넣어서 `pattern:\d - \d`로 바꿔봅시다. 

```js run
alert( "1 - 5".match(/\d - \d/) ); // 1 - 5, 이제 제대로 되네요.
// \s 클래스를 사용해도 됩니다.
alert( "1 - 5".match(/\d\s-\s\d/) ); // 1 - 5, 이것도 됩니다.
```

**공백 역시 문자입니다. 다른 문자만큼이나 중요합니다.**

<<<<<<< HEAD
정규 표현식에 공백을 추가하거나 지우면 다르게 작동합니다.
=======
We can't add or remove spaces from a regular expression and expect it to work the same.
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b

즉, 정규 표현식에서는 모든 문자가 중요합니다. 공백도 마찬가지로요.
````

## 요약

문자 클래스에는 다음 클래스들이 있습니다.

- `pattern:\d` -- 숫자
- `pattern:\D` -- 숫자가 아닌 문자
- `pattern:\s` -- 스페이스, 탭, 줄 바꿈 문자
- `pattern:\S` -- `pattern:\s`를 제외한 모든 문자
- `pattern:\w` -- 라틴 문자, 숫자, 밑줄 `'_'`
- `pattern:\W` -- `pattern:\w`를 제외한 모든 문자
- `pattern:.` -- 정규 표현식 `'s'` 플래그가 있으면 모든 문자, 없으면 줄 바꿈 `\n`을 제외한 모든 문자

하지만 이게 전부가 아닙니다!

<<<<<<< HEAD
자바스크립트에서 문자열에 사용하는 유니코드 인코딩은 문자에 여러 프로퍼티를 제공합니다. 어떤 언어에 속하는 글자인지 또는 글자가 아닌 구두점인지 알려주는 프로퍼티처럼요.
=======
Unicode encoding, used by JavaScript for strings, provides many properties for characters, like: which language the letter belongs to (if it's a letter), is it a punctuation sign, etc.
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b

이런 프로퍼티를 기준으로 문자를 찾을 수도 있습니다. `pattern:u` 플래그를 사용하면 되는데요. 다음 글에서 알아보도록 하죠.
