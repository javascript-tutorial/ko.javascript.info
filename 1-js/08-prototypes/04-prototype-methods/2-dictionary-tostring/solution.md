
이 메서드는 `Object.keys`를 사용하여 열거 가능한 모든 키를 가져와서 목록으로 출력할 수 있습니다.

`toString`을 열거할 수 없도록 하기 위해 프로퍼티 설명자를 사용하여 `toString`을 정의하겠습니다. `Object.create` 문법을 사용하면 프로퍼티 설명자를 두 번째 인수로 사용하여 객체를 제공할 수 있습니다.

```js run
*!*
let dictionary = Object.create(null, {
  toString: { // toString 프로퍼티를 정의합니다.
    value() { // value는 함수입니다.
      return Object.keys(this).join();
    }
  }
});
*/!*

dictionary.apple = "Apple";
dictionary.__proto__ = "test";

// apple과 __proto__는 반복문 안에 있습니다.
for(let key in dictionary) {
  alert(key); // "apple" 다음 "__proto__"가 있습니다.
}  

// toString에 의해 쉼표로 구분된 프로퍼티 목록
alert(dictionary); // "apple,__proto__"
```

설명자를 사용하여 프로퍼티를 만들면 기본적으로 플래그가 `false`입니다. 따라서 위 코드에서 `dictionary.toString`은 열거할 수 없습니다.

다음 챕터 [](info:property-descriptors)를 참고하시기 바랍니다.
