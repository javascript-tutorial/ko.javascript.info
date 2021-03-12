
# 객체를 원시형으로 변환하기

`obj1 + obj2` 처럼 객체끼리 더하는 연산을 하거나, `obj1 - obj2` 처럼 객체끼리 빼는 연산을 하면 어떤 일이 일어날까요? `alert(obj)`로 객체를 출력할 때는 무슨 일이 발생할까요?

이 모든 경우에 자동 형 변환이 일어납니다. 객체는 원시값으로 변환되고, 그 후 의도한 연산이 수행됩니다.

<info:type-conversions> 챕터에선 객체의 형 변환은 다루지 않았습니다. 원시형 자료가 어떻게 문자, 숫자, 논리형으로 변환되는지만 알아보았죠. 이젠 메서드와 심볼에 대한 지식을 갖추었으니 본격적으로 이 공백을 메꿔봅시다.

1. 객체는 논리 평가 시 `true`를 반환합니다. 단 하나의 예외도 없죠. 따라서 객체는 숫자형이나 문자형으로만 형 변환이 일어난다고 생각하시면 됩니다.
2. 숫자형으로의 형 변환은 객체끼리 빼는 연산을 할 때나 수학 관련 함수를 적용할 때 일어납니다. 객체 `Date`끼리 차감하면(`date1 - date2`) 두 날짜의 시간 차이가 반환됩니다. `Date`에 대해선 <info:date>에서 다룰 예정입니다.
3. 문자형으로의 형 변환은 대개 `alert(obj)`같이 객체를 출력하려고 할 때 일어납니다.  

## ToPrimitive

특수 객체 메서드를 사용하면 숫자형이나 문자형으로의 형 변환을 원하는 대로 조절할 수 있습니다.

객체 형 변환은 세 종류로 구분되는데, 'hint'라 불리는 값이 구분 기준이 됩니다. 'hint'가 무엇인지는 [명세서](https://tc39.github.io/ecma262/#sec-toprimitive)에 자세히 설명되어 있는데, '목표로 하는 자료형' 정도로 이해하시면 될 것 같습니다. 

`"string"`
: `alert` 함수같이 문자열을 기대하는 연산을 수행할 때는(객체-문자형 변환), hint가 `string`이 됩니다.

    ```js
    // 객체를 출력하려고 함
    alert(obj);

    // 객체를 프로퍼티 키로 사용하고 있음
    anotherObj[obj] = 123;
    ```

`"number"`
: 수학 연산을 적용하려 할 때(객체-숫자형 변환), hint는 `number`가 됩니다.

    ```js
    // 명시적 형 변환
    let num = Number(obj);

    // (이항 덧셈 연산을 제외한) 수학 연산 
    let n = +obj; // 단항 덧셈 연산
    let delta = date1 - date2;

    // 크고 작음 비교하기
    let greater = user1 > user2;
    ```

`"default"`
: 연산자가 기대하는 자료형이 '확실치 않을 때' hint는 `default`가 됩니다. 아주 드물게 발생합니다.

    이항 덧셈 연산자 `+`는 피연산자의 자료형에 따라 문자열을 합치는 연산을 할 수도 있고 숫자를 더해주는 연산을 할 수도 있습니다. 따라서 `+`의 인수가 객체일는 hint가 `default`가 됩니다.

    동등 연산자 `==`를 사용해 객체-문자형, 객체-숫자형, 객체-심볼형끼리 비교할 때도, 객체를 어떤 자료형으로 바꿔야 할지 확신이 안 서므로 hint는 default가 됩니다.

    ```js
    // 이항 덧셈 연산은 hint로 `default`를 사용합니다.
    let total = obj1 + obj2;

    // obj == number 연산은 hint로 `default`를 사용합니다.
    if (user == 1) { ... };
    ```

    크고 작음을 비교할 때 쓰이는 연산자 `<`, `>` 역시 피연산자에 문자형과 숫자형 둘 다를 허용하는데, 이 연산자들은 hint를 'number'로 고정합니다. hint가 'default'가 되는 일이 없죠. 이는 하위 호환성 때문에 정해진 규칙입니다.

    실제 일을 할 때는 이런 사항을 모두 외울 필요는 없습니다. `Date` 객체를 제외한 모든 내장 객체는 hint가 `"default"`인 경우와 `"number"`인 경우를 동일하게 처리하기 때문입니다. 우리도 커스텀 객체를 만들 땐 이런 규칙을 따르면 됩니다.

```smart header="`\"boolean\"` hint는 없습니다."
hint는 총 세 가지입니다. 아주 간단하죠.

'boolean' hint는 존재하지 않습니다. 모든 객체는 그냥 `true`로 평가됩니다. 게다가 우리도 내장 객체에 사용되는 규칙처럼 `"default"`와 `"number"`를 동일하게 처리하면, 결국엔 두 종류의 형 변환(객체-문자형, 객체-숫자형)만 남게 됩니다.
```

**자바스크립트는 형 변환이 필요할 때, 아래와 같은 알고리즘에 따라 원하는 메서드를 찾고 호출합니다.**

1. 객체에 `obj[Symbol.toPrimitive](hint)`메서드가 있는지 찾고, 있다면 메서드를 호출합니다. `Symbol.toPrimitive`는 시스템 심볼로, 심볼형 키로 사용됩니다.
2. 1에 해당하지 않고 hint가 `"string"`이라면,
    - `obj.toString()`이나 `obj.valueOf()`를 호출합니다(존재하는 메서드만 실행됨).
3. 1과 2에 해당하지 않고, hint가 `"number"`나 `"default"`라면
    - `obj.valueOf()`나 `obj.toString()`을 호출합니다(존재하는 메서드만 실행됨).

## Symbol.toPrimitive

첫 번째 메서드부터 살펴봅시다. 자바스크립트엔 `Symbol.toPrimitive`라는 내장 심볼이 존재하는데, 이 심볼은 아래와 같이 목표로 하는 자료형(hint)을 명명하는 데 사용됩니다.
```js
obj[Symbol.toPrimitive] = function(hint) {
  // 반드시 원시값을 반환해야 합니다.
  // hint는 "string", "number", "default" 중 하나가 될 수 있습니다.
};
```

실제 돌아가는 예시를 살펴보는 게 좋을 것 같네요. `user` 객체에 객체-원시형 변환 메서드 `obj[Symbol.toPrimitive](hint)`를 구현해보겠습니다.

```js run
let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`hint: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// 데모:
alert(user); // hint: string -> {name: "John"}
alert(+user); // hint: number -> 1000
alert(user + 500); // hint: default -> 1500
```

이렇게 메서드를 구현해 놓으면 `user`는 hint에 따라 (자기 자신을 설명해주는) 문자열로 변환되기도 하고 (가지고 있는 돈의 액수를 나타내는) 숫자로 변환되기도 합니다. `user[Symbol.toPrimitive]`를 사용하면 메서드 하나로 모든 종류의 형 변환을 다룰 수 있습니다.


## toString과 valueOf

`toString`과 `valueOf`는 심볼이 생기기 이전부터 존재해 왔던 '평범한' 메서드입니다. 이 메서드를 이용하면 '구식'이긴 하지만 형 변환을 직접 구현할 수 있습니다.

객체에 `Symbol.toPrimitive`가 없으면 자바스크립트는 아래 규칙에 따라 `toString`이나 `valueOf`를 호출합니다.

- hint가 'string'인 경우: `toString -> valueOf` 순(`toString`이 있다면 `toString`을 호출, `toString`이 없다면 `valueOf`를 호출함)
- 그 외: `valueOf -> toString` 순

이 메서드들은 반드시 원시값을 반환해야합니다. `toString`이나 `valueOf`가 객체를 반환하면 그 결과는 무시됩니다. 마치 메서드가 처음부터 없었던 것처럼 되어버리죠.

일반 객체는 기본적으로 `toString`과 `valueOf`에 적용되는 다음 규칙을 따릅니다.

- `toString`은 문자열 `"[object Object]"`을 반환합니다.
- `valueOf`는 객체 자신을 반환합니다.

데모를 살펴봅시다.

```js run
let user = {name: "John"};

alert(user); // [object Object]
alert(user.valueOf() === user); // true
```

이런 이유 때문에 `alert`에 객체를 넘기면 `[object Object]`가 출력되는 것입니다.   

여기서 `valueOf`는 튜토리얼의 완성도를 높이고 헷갈리는 것을 줄여주려고 언급했습니다. 앞서 본 바와 같이 `valueOf`는 객체 자신을 반환하기 때문에 그 결과가 무시됩니다. 왜 그런거냐고 이유를 묻지는 말아주세요. 그냥 역사적인 이유때문입니다. 우리는 그냥 이 메서드가 존재하지 않는다고 생각하면 됩니다.

이제 직접 이 메서드들을 사용한 예시를 구현해봅시다.

아래 `user`는 `toString`과 `valueOf`를 조합해 만들었는데, `Symbol.toPrimitive`를 사용한 위쪽 예시와 동일하게 동작합니다.

```js run
let user = {
  name: "John",
  money: 1000,

  // hint가 "string"인 경우
  toString() {
    return `{name: "${this.name}"}`;
  },

  // hint가 "number"나 "default"인 경우
  valueOf() {
    return this.money;
  }

};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
```

출력 결과가 `Symbol.toPrimitive`를 사용한 예제와 완전히 동일하다는 걸 확인할 수 있습니다.

그런데 간혹 모든 형 변환을 한 곳에서 처리해야 하는 경우도 생깁니다. 이럴 땐 아래와 같이 `toString`만 구현해 주면 됩니다. 

```js run
let user = {
  name: "John",

  toString() {
    return this.name;
  }
};

alert(user); // toString -> John
alert(user + 500); // toString -> John500
```

객체에 `Symbol.toPrimitive`와 `valueOf`가 없으면, `toString`이 모든 형 변환을 처리합니다.

## 반환 타입

위에서 소개해드린 세 개의 메서드는 'hint'에 명시된 자료형으로의 형 변환을 보장해 주지 않습니다.

`toString()`이 항상 문자열을 반환하리라는 보장이 없고, `Symbol.toPrimitive`의 hint가 `"number"`일 때 항상 숫자형 자료가 반환되리라는 보장이 없습니다.

확신할 수 있는 단 한 가지는 객체가 아닌 원시값을 반환해 준다는 것뿐입니다.

```smart header="과거의 잔재"
`toString`이나 `valueOf`가 객체를 반환해도 에러가 발생하지 않습니다. 다만 이때는 반환 값이 무시되고, 메서드 자체가 존재하지 않았던 것처럼 동작합니다. 이렇게 동작하는 이유는 과거 자바스크립트엔 '에러'라는 개념이 잘 정립되어있지 않았기 때문입니다. 

반면에 `Symbol.toPrimitive`는 *무조건* 원시자료를 반환해야 합니다. 그렇지 않으면 에러가 발생합니다.
```

## 추가 형 변환

지금까지 살펴본 바와 같이 상당수의 연산자와 함수가 피연산자의 형을 변환시킵니다. 곱셈을 해주는 연산자 `*`는 피연산자를 숫자형으로 변환시키죠.
 
객체가 피연산자일 때는 다음과 같은 단계를 거쳐 형 변환이 일어납니다.
1. 객체는 원시형으로 변화됩니다. 변환 규칙은 위에서 설명했습니다.
2. 변환 후 원시값이 원하는 형이 아닌 경우엔 또다시 형 변환이 일어납니다.

예시:

```js run
let obj = {
  // 다른 메서드가 없으면 toString에서 모든 형 변환을 처리합니다.
  toString() {
    return "2";
  }
};

alert(obj * 2); // 4, 객체가 문자열 "2"로 바뀌고, 곱셈 연산 과정에서 문자열 "2"는 숫자 2로 변경됩니다.
```

1. `obj * 2`에선 객체가 원시형으로 변화되므로 `toString`에의해 `obj`는 문자열 `"2"`가 됩니다.
2. 곱셈 연산은 문자열은 숫자형으로 변환시키므로 `"2" * 2`는 `2 * 2`가 됩니다.

그런데 이항 덧셈 연산은 위와 같은 상황에서 문자열을 연결합니다.

```js run
let obj = {
  toString() {
    return "2";
  }
};

alert(obj + 2); // 22("2" + 2), 문자열이 반환되기 때문에 문자열끼리의 병합이 일어났습니다.
```

## 요약

원시값을 기대하는 내장 함수나 연산자를 사용할 때 객체-원시형으로의 형 변환이 자동으로 일어납니다.

객체-원시형으로의 형 변환은 hint를 기준으로 세 종류로 구분할 수 있습니다.
- `"string"` (`alert` 같이 문자열을 필요로 하는 연산)
- `"number"` (수학 연산)
- `"default"` (드물게 발생함)

연산자별로 어떤 hint가 적용되는지는 명세서에서 찾아볼 수 있습니다. 연산자가 기대하는 피연산자를 '확신할 수 없을 때'에는 hint가 `"default"`가 됩니다. 이런 경우는 아주 드물게 발생합니다. 내장 객체는 대개 hint가 `"default"`일 때와 `"number"`일 때를 동일하게 처리합니다. 따라서 실무에선 hint가 `"default"`인 경우와 `"number"`인 경우를 합쳐서 처리하는 경우가 많습니다.

객체-원시형 변환엔 다음 알고리즘이 적용됩니다.

1. 객체에 `obj[Symbol.toPrimitive](hint)`메서드가 있는지 찾고, 있다면 호출합니다.
2. 1에 해당하지 않고 hint가 `"string"`이라면,
    - `obj.toString()`이나 `obj.valueOf()`를 호출합니다.
3. 1과 2에 해당하지 않고, hint가 `"number"`나 `"default"`라면
    - `obj.valueOf()`나 `obj.toString()`을 호출합니다.

`obj.toString()`만 사용해도 '모든 변환'을 다 다룰 수 있기 때문에, 실무에선 `obj.toString()`만 구현해도 충분한 경우가 많습니다. 반환 값도 '사람이 읽고 이해할 수 있는' 형식이기 때문에 실용성 측면에서 다른 메서드에 뒤처지지 않습니다. `obj.toString()`은 로깅이나 디버깅 목적으로도 자주 사용됩니다.
