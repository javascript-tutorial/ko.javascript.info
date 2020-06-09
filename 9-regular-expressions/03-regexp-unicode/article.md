# 유니코드: 'u' 플래그와 \p{...} 클래스

자바스크립트는 문자열에 [유니코드 인코딩](https://en.wikipedia.org/wiki/Unicode)을 사용합니다. 대부분의 문자는 2바이트로 인코딩되어있는데 2바이트로는 최대 65,536개의 글자밖에 표현할 수 없습니다.

65,536자는 모든 글자를 인코딩하기에는 부족한 숫자입니다. 그래서 일부 문자는 4바이트로 인코딩되어있습니다. 예를 들면 `𝒳`(수학에서 사용하는 X)나 `😄`(웃는 표정), 일부 상형 문자 등이 있죠.

다음은 일부 문자의 유니코드 값입니다.

| 문자  | 유니코드 | 유니코드의 바이트 수  |
|------------|---------|--------|
| a | `0x0061` |  2 |
| ≈ | `0x2248` |  2 |
|𝒳| `0x1d4b3` | 4 |
|𝒴| `0x1d4b4` | 4 |
|😄| `0x1f604` | 4 |

보다시피 `a`나 `≈`같은 문자는 2바이트를 차지하고 `𝒳`, `𝒴`, `😄`같은 문자는 코드값이 더 길고 4바이트를 차지합니다.

오래전에 자바스크립트 언어가 탄생했을 때는 유니코드 인코딩은 지금보다 단순했습니다. 4바이트 문자가 없었죠. 그래서 일부 언어 기능은 아직도 이런 문자들을 정확하게 다루지 못합니다.

그중 하나로 `length`는 다음 경우에서 문자가 두 개 있다고 봅니다.

```js run
alert('😄'.length); // 2
alert('𝒳'.length); // 2
```

하지만 분명 문자는 하나잖아요? 여기서 중요한 것은 `length`는 4바이트 문자를 2바이트 문자 2개로 취급한다는 것입니다. 4바이트를 하나로 묶어서 취급해야 하므로 올바르지 않은 결과입니다.(이런 문자를 '서로게이트 쌍'이라고 합니다. <info:string>에서 서로게이트 쌍에 대해 읽어볼 수 있습니다.)

기본적으로는 정규 표현식도 4바이트의 '긴 문자'를 2바이트 문자 2개로 취급합니다. 문자열의 경우처럼 이런 방식은 잘못된 결과로 이어질 수 있습니다. 나중에 <info:regexp-character-sets-and-ranges>에서 다시 알아볼 것입니다.

문자열과 다르게 정규 표현식에는 이런 문제를 해결할 수 있는 `pattern:u` 플래그가 있습니다. `pattern:u` 플래그를 사용하면 정규식은 4바이트 문자를 올바르게 처리합니다. 그리고 유니코드 프로퍼티(Unicode property)를 사용한 검색이 가능해집니다. 바로 알아보죠.

## 유니코드 프로퍼티 \p{...}

```warn header="Firefox와 Edge에서 미지원"
2018년부터 표준에 포함되었지만 Firefox([버그](https://bugzilla.mozilla.org/show_bug.cgi?id=1361876))와 Edge([버그](https://github.com/Microsoft/ChakraCore/issues/2969))는 유니코드 프로퍼티를 아직 지원하지 않습니다.

유니코드 프로퍼티의 크로스 브라우저 지원을 포함한 정규 표현식의 '확장' 기능을 제공하는 [XRegExp](http://xregexp.com) 라이브러리가 있습니다.
```

유니코드의 모든 문자는 다양한 프로퍼티를 가집니다. 프로퍼티는 문자가 어떤 '범주'에 속하는지 설명하기도 하고 그 외에도 문자의 여러 가지 정보를 담고 있습니다.

예를 들어 문자에 `Letter` 프로퍼티가 있다면 그 문자는 어떠한 언어의 글자라는 뜻입니다. `Number` 프로퍼티가 있다면 아라비아 숫자든 한자 숫자든 숫자라는 뜻이죠.

`pattern:\p{…}`를 사용하면 프로퍼티를 통해 문자를 찾을 수 있습니다. `pattern:\p{…}`를 사용하기 위해서는 정규 표현식에 `pattern:u` 플래그가 반드시 있어야 합니다.

예시로 `p{Letter}`는 언어의 글자를 표기하는 방법입니다. `p{L}`을 대신 사용할 수도 있습니다. 여기서 `L`은 `Letter`의 약자입니다. 거의 모든 프로퍼티에 이렇게 짧게 쓸 수 있는 약자가 있습니다.

아래 예시에서는 영문자, 조지아 문자, 한글 3종류의 글자를 검색합니다. 

```js run
let str = "A ბ ㄱ";

alert( str.match(/\p{L}/gu) ); // A,ბ,ㄱ
alert( str.match(/\p{L}/g) ); // null ('u' 플래그가 없어서 일치 결과 없음)
```

다음은 주요 문자 범주와 각각의 하위 범주 목록입니다.

- 문자(Letter) `L`:
  - 소문자(lowercase) `Ll`
  - 조정(modifier) `Lm`
  - 단어의 첫 글자를 대문자로(titlecase) `Lt` 
  - 대문자(uppercase) `Lu`
  - 기타(other) `Lo`
- 숫자(Number) `N`:
  - 10진수(decimal digit) `Nd`
  - 문자(letter number) `Nl`
  - 기타(other) `No`
- 문장 부호(Punctuation) `P`:
  - 연결선(connector) `Pc`
  - 대시(dash) `Pd`
  - 처음 따옴표(initial quote) `Pi`
  - 마지막 따옴표(final quote) `Pf`
  - 열기(open) `Ps`
  - 닫기(close) `Pe`
  - 기타(other) `Po`
- 표시(Mark) `M` (강세 등):
  - 간격 결합(spacing combining) `Mc`
  - 묶음(enclosing) `Me`
  - 비공백(non-spacing) `Mn`
- 기호(Symbol) `S`:
  - 통화(currency) `Sc`
  - 수정(modifier) `Sk`
  - 수학(math) `Sm`
  - 기타(other) `So`
- 구분 기호(Separator) `Z`:
  - 줄(line) `Zl`
  - 단락(paragraph) `Zp`
  - 공백(space) `Zs`
- 기타(Other) `C`:
  - 제어(control) `Cc`
  - 형식(format) `Cf`
  - 할당되지 않음(not assigned) `Cn`
  - 사용자 지정(private use) `Co`
  - 서로게이트(surrogate) `Cs`


예를 들어 소문자를 찾아야 한다면 `pattern:\p{Ll}`을, 문장 부호를 찾아야 한다면 `pattern:\p{P}`를 사용하는 식으로 검색할 수 있습니다.

또한 다음과 같이 파생된 범주도 있습니다.
- `Alphabetic`(`Alpha`)는 Letters `L`와 로마 숫자 Ⅻ같이 문자로 된 숫자 `Nl`에 더해서 `Other_Alphabetic`(`OAlpha`)에 속한 문자들을 모두 포함합니다.
- `Hex_digit`은 16진수 숫자인 `0-9`, `a-f`를 포함합니다.
- 이것 말고도 더 있죠.

유니코드는 정말 다양한 프로퍼티를 지원합니다. 모든 걸 나열하려면 공간이 너무 많이 필요하니 참고할 수 있는 문서를 알려드립니다.

- 문자별 프로퍼티 목록: <https://unicode.org/cldr/utility/character.jsp>
- 프로퍼티별 문자 목록: <https://unicode.org/cldr/utility/list-unicodeset.jsp>
- 프로퍼티별 줄임말: <https://www.unicode.org/Public/UCD/latest/ucd/PropertyValueAliases.txt>
- 텍스트 형식으로 정리된 유니코드 문자와 각 문자의 모든 프로퍼티: <https://www.unicode.org/Public/UCD/latest/ucd/>

### 예시: 16진수

실제 사례로 16진수를 찾아봅시다. `xFF` 형식으로 쓰고 `F` 자리에는 16진수의 숫자(0..1이나 A..F)가 들어갑니다.

16진수 숫자는 `pattern:\p{Hex_Digit}`로 표기합니다.

```js run
let regexp = /x\p{Hex_Digit}\p{Hex_Digit}/u;

alert("number: xAF".match(regexp)); // xAF
```

### 예시: 한자

한자를 검색해봅시다.

`Script`(표기 체계)라는 유니코드 프로퍼티가 있습니다. `Script`는 `Cyrillic`(키릴 문자), `Greek`(그리스 문자), `Arabic`(아라비아 문자), `Han`(한자) 등의 값을 가질 수 있습니다. Script 값의 전체 목록은 [여기서 볼 수 있습니다](https://en.wikipedia.org/wiki/Script_(Unicode)).

특정 표기 체계의 문자를 찾으려면 `pattern:Script=<value>`를 사용해야 합니다. 키릴 문자는 `\p{sc=Cyrillic}`, 한자는 `pattern:\p{sc=Han}`로 검색하는 식으로 쓸 수 있습니다.

```js run
let regexp = /\p{sc=Han}/gu; // 한자를 반환

let str = `Hello Привет 你好 123_456`;

alert( str.match(regexp) ); // 你,好
```

### 예시: 통화

`$`, `€`, `¥` 등 통화 단위를 나타내는 문자는 유니코드 프로퍼티 `pattern:\p{Currency_Symbol}`를 가지고 있습니다. 짧게는 `pattern:\p{Sc}`로 사용합니다.

`pattern:\p{Sc}`를 사용해서 '통화 단위 바로 뒤 숫자' 형태의 가격 표시를 찾아봅시다.

```js run
let regexp = /\p{Sc}\d/gu;

let  str = `Prices: $2, €1, ¥9`;

alert( str.match(regexp) ); // $2,€1,¥9
```

나중에 <info:regexp-quantifiers>에서 자릿수가 여러 개인 수를 찾는 방법을 알아볼 것입니다.

## 요약

`pattern:u` 플래그로 정규 표현식에서 유니코드 관련 기능을 활성화할 수 있습니다.

즉, 다음 두 기능이 사용 가능해집니다.

1. 4바이트 문자를 2바이트 문자 두 개로 처리하지 않고 문자 한 개로 올바르게 처리합니다.
2. `\p{…}`를 이용해 유니코드 프로퍼티를 검색에 사용할 수 있습니다.

유니코드 프로퍼티를 사용하면 특정 언어의 단어, 따옴표나 통화 단위같은 특수 문자 등을 모두 검색할 수 있습니다.
