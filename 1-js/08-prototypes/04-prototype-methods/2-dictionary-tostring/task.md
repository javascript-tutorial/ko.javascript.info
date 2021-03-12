importance: 5

---

# 사전에 toString 추가하기

`key/value` 쌍을 저장하기 위해 `Object.create(null)`로 생성된 `dictionary` 객체가 있습니다.

그 안에 쉼표로 구분된 키 목록을 반환하는 `dictionary.toString()`메서드를 추가하십시오. `toString`은 객체 위의 `for..in`에 나타나서는 안 됩니다.

작동 방식은 다음과 같습니다.

```js
let dictionary = Object.create(null);

*!*
// dictionary.toString 메서드를 추가하는 코드
*/!*

// 데이터를 추가합니다.
dictionary.apple = "Apple";
dictionary.__proto__ = "test"; // __proto__는 여기서 일반적인 프로퍼티 키입니다.

// 반복문에는 apple과 __proto__ 만 있습니다.
for(let key in dictionary) {
  alert(key); // "apple" 다음 "__proto__"입니다.
}  

// toString이 동작하는 부분입니다.
alert(dictionary); // "apple,__proto__"
```
