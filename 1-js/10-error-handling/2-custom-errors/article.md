# 커스텀 에러와 에러 확장

개발을 하다 보면 자체 에러 클래스가 필요한 경우가 종종 생깁니다. 네트워크 관련 작업 중 에러가 발생했다면 `HttpError`, 데이터베이스 관련 작업 중 에러가 발생했다면 `DbError`, 검색 관련 작업 중 에러가 발생했다면 `NotFoundError`를 사용하는 것이 직관적이기 때문이죠.

직접 에러 클래스를 만든 경우, 이 에러들은 `message`이나 `name`, 가능하다면 `stack` 프로퍼티를 지원해야 합니다. 물론 이런 필수 프로퍼티 이외에도 다른 프로퍼티를 명시할 수 있습니다. `HttpError` 클래스의 객체에 `statusCode` 프로퍼티를 만들고 `404`나 `403`, `500`같은 숫자를 값으로 지정할 수 있을 겁니다.

앞서 배운 바와 같이 `throw`의 인수엔 아무런 제약이 없기 때문에 커스텀 에러 클래스는 반드시 `Error`를 상속할 필요가 없습니다. 그렇지만 `Error`를 상속받아 커스텀 에러 클래스를 만들게 되면 `obj instanceof Error`를 사용해서 에러 객체를 식별할 수 있다는 장점이 생깁니다. 이런 장점 때문에 맨땅에서 커스텀 에러 객체를 만드는 것보다 `Error`를 상속받아 에러 객체를 만드는 것이 낫습니다.

애플리케이션 크기가 점점 커지면 우리가 만들게 될 커스텀 에러 클래스들은 자연스레 계층 구조를 형성하게 됩니다. `HttpTimeoutError`는 `HttpError`를 상속받는 식으로 말이죠.

## 에러 확장하기

사용자 데이터가 저장된 JSON을 읽는 함수 `readUser(json)`가 있다고 해봅시다.

유효한 `json`은 다음과 같은 형태를 띄워야 합니다.
```js
let json = `{ "name": "John", "age": 30 }`;
```

`readUser` 내부에선 `JSON.parse`를 이용할 겁니다. 잘못된 형식의 `json`이 들어오면 `SyntaxError`가 발생하겠죠. 그러나 인수로 받은 데이터가 JSON 형식이긴 하지만, 유효한 사용자일 것이라는 보장은 없습니다. 사용자 데이터라면 필수적으로 있어야 할 `name`이나 `age`가 없을 수 있죠.

따라서 `readUser(json)`은 JSON을 읽을 수 있을 뿐만 아니라, 데이터를 검증할 수도 있어야 합니다. 필수 프로퍼티가 없거나, 위 형식에 맞지 않으면 에러를 발생시킬 수 있어야 하죠. 그런데 이때 발생하는 에러는 `SyntaxError`가 아닙니다. JSON 형식은 맞지만, 자체 기준에 맞지 않기 때문에 발생한 에러이므로 전혀 다른 종류의 에러이죠. 여기선 이 에러를 `ValidationError`라고 부르겠습니다. 그리고 `ValidationError`를 위한 클래스를 만들어보겠습니다.  

`ValidationError` 클래스엔 문제가 되는 필드 정보가 저장될 수 있어야합니다. 내장 클래스인 `Error`를 상속받아 `ValidationError` 클래스를 만들어봅시다. 

먼저 슈도 코드를 통해 `Error` 클래스가 어떻게 생겼는지 알아봅시다.

```js
// 자바스크립트에서 자체적으로 정의한 내장 에러 클래스의 "슈도 코드"
class Error {
  constructor(message) {
    this.message = message;
    this.name = "Error"; // (내장 에러 클래스마다 이름이 다릅니다.)
    this.stack = <call stack>;  // 표준은 아니지만, 대다수의 환경이 지원합니다.
  }
}
```

이제 `ValidationError`에서 `Error`를 상속받아보겠습니다.

```js run untrusted
*!*
class ValidationError extends Error {
*/!*
  constructor(message) {
    super(message); // (1)
    this.name = "ValidationError"; // (2)
  }
}

function test() {
  throw new ValidationError("에러 발생!");
}

try {
  test();
} catch(err) {
  alert(err.message); // 에러 발생!
  alert(err.name); // ValidationError
  alert(err.stack); // 각 행 번호가 있는 중첩된 호출들의 목록
}
```

`(1)`에서 부모 생성자를 호출하고 있다는 것에 주목해 주시기 바랍니다. 자바스크립트에서는 자식 생성자 안에서 `super`를 반드시 호출해야 합니다. 부모 생성자에서 `message` 프로퍼티가 설정됩니다.

부모 생성자에서 `name` 프로퍼티가 `"Error"`로 설정되기 때문에, `(2)`에서 원하는 값으로 재설정해주었습니다.

이제 `readUser(json)` 안에서 `ValidationError`를 사용해 봅시다.

```js run
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// 사용법
function readUser(json) {
  let user = JSON.parse(json);

  if (!user.age) {
    throw new ValidationError("No field: age");
  }
  if (!user.name) {
    throw new ValidationError("No field: name");
  }

  return user;
}

// try..catch와 readUser를 함께 사용하면 다음과 같습니다.

try {
  let user = readUser('{ "age": 25 }');
} catch (err) {
  if (err instanceof ValidationError) {
*!*
    alert("Invalid data: " + err.message); // Invalid data: No field: name
*/!*
  } else if (err instanceof SyntaxError) { // (*)
    alert("JSON Syntax Error: " + err.message);
  } else {
    throw err; // 알려지지 않은 에러는 재던지기 합니다. (**)
  }
}
```

이제 `try..catch` 블록에서 우리가 만든 커스텀 에러인 `ValidationError`와  `JSON.parse`에서 발생하는 `SyntaxError` 둘 다를 처리할 수 있게 되었네요.

이 과정에서 `instanceof`로 에러 유형을 확인(`(*)`)하였습니다.

`instanceof` 말고 `err.name`을 사용해 에러 종류를 확인하는 것도 가능합니다.

```js
// ...
// (err instanceof SyntaxError) 대신 사용 가능
} else if (err.name == "SyntaxError") { // (*)
// ...
```  

그런데 `err.name`보다는 `instanceof`를 사용하는 게 훨씬 좋습니다. 나중에 `ValidationError`를 확장하여 `PropertyRequiredError` 같은 새로운 확장 에러를 만들게 될 경우, `instanceof`는 상속받은 새로운 클래스에서도 동작하기 때문입니다. 

알려지지 않은 에러를 만났을 때 `catch`에서 재 던지기를 한다는 점(`(**)`) 또한 주목해서 봐주시기 바랍니다. `catch` 블록에선 유효성 검사와 문법 오류만 처리하고, 다른 종류의 에러는 밖으로 던져야 합니다.

## 더 깊게 상속하기

앞서 만든 `ValidationError` 클래스는 너무 포괄적이어서 뭔가 잘못될 확률이 있습니다. 꼭 필요한 프로퍼티가 누락되거나 `age`에 문자열 값이 들어가는 것처럼 형식이 잘못된 경우를 처리할 수 없습니다. 필수 프로퍼티가 없는 경우에 대응할 수 있도록 좀 더 구체적인 클래스 `PropertyRequiredError`를 만들어 봅시다. `PropertyRequiredError`엔 누락된 프로퍼티에 대한 추가 정보가 담겨야 합니다.

```js run
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

*!*
class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super("No property: " + property);
    this.name = "PropertyRequiredError";
    this.property = property;
  }
}
*/!*

// 사용법
function readUser(json) {
  let user = JSON.parse(json);

  if (!user.age) {
    throw new PropertyRequiredError("age");
  }
  if (!user.name) {
    throw new PropertyRequiredError("name");
  }

  return user;
}

// try..catch와 readUser를 함께 사용하면 다음과 같습니다.

try {
  let user = readUser('{ "age": 25 }');
} catch (err) {
  if (err instanceof ValidationError) {
*!*
    alert("Invalid data: " + err.message); // Invalid data: No property: name
    alert(err.name); // PropertyRequiredError
    alert(err.property); // name
*/!*
  } else if (err instanceof SyntaxError) {
    alert("JSON Syntax Error: " + err.message);
  } else {
    throw err; // 알려지지 않은 에러는 재던지기 합니다.
  }
}
```

새롭게 만든 클래스 `PropertyRequiredError`는 사용하기 쉽습니다. `new PropertyRequiredError(property)`처럼 프로퍼티 이름을 전달하기만 하면 됩니다. 사람이 읽을 수 있는 `message`는 생성자가 알아서 만들어줍니다.

여기서 주목할 점은 `PropertyRequiredError` 생성자 안에서 `this.name`을 수동으로 할당해 주었다는 것입니다. 이렇게 매번 커스텀 에러 클래스의 생성자 안에서 `this.name`를 할당해 주는 것은 귀찮아 보이긴 합니다. 이런 번거로운 작업은 '기본 에러' 클래스를 만들고 커스텀 에러들이 이 클래스를 상속받게 하면 피할 수 있습니다. 기본 에러의 생성자에 `this.name = this.constructor.name`를 추가하면 되죠.

이 클래스를 `MyError`라고 부르겠습니다.

`MyError`를 사용하면 다음과 같이 커스텀 에러 클래스를 간결하게 할 수 있습니다.

```js run
class MyError extends Error {
  constructor(message) {
    super(message);
*!*
    this.name = this.constructor.name;
*/!*
  }
}

class ValidationError extends MyError { }

class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super("No property: " + property);
    this.property = property;
  }
}

// 제대로 된 이름이 출력됩니다.
alert( new PropertyRequiredError("field").name ); // PropertyRequiredError
```

이제 커스텀 에러들, 특히 `ValidationError`는, 생성자에서 `"this.name = ..."` 줄을 제거하여 훨씬 짧아졌습니다.

## 예외 감싸기

함수 `readUser`는 '사용자 데이터를 읽기' 위해 만들어졌습니다. 그런데 사용자 데이터를 읽는 과정에서 다른 오류들이 발생할 수 있습니다. 지금 당장은 `SyntaxError`와 `ValidationError`만 있지만, 앞으로 `readUser` 함수가 더 커지면 다른 커스텀 에러 클래스를 만들어야 할 수 있습니다.

<<<<<<< HEAD
물론 `readUser`는 이런 에러를 모두 처리할 수 있어야 합니다. 그런데 지금은 `catch` 블록 안에 `if`문 여러 개를 넣어 에러를 처리하고 있죠. 미래에 커스텀 에러 클래스가 더 추가될 텐데 앞으로도 이렇게 `readUser`를 호출하는 곳에서 모든 에러를 종류에 따라 하나하나 처리해야만 할까요?
=======
The code which calls `readUser` should handle these errors. Right now it uses multiple `if`s in the `catch` block, that check the class and handle known errors and rethrow the unknown ones.
>>>>>>> 62299ed853674c4fd1427cd310516d5535bce648

The scheme is like this:

```js
try {
  ...
  readUser()  // the potential error source
  ...
} catch (err) {
  if (err instanceof ValidationError) {
    // handle validation errors
  } else if (err instanceof SyntaxError) {
    // handle syntax errors
  } else {
    throw err; // unknown error, rethrow it
  }
}
```

In the code above we can see two types of errors, but there can be more.

If the `readUser` function generates several kinds of errors, then we should ask ourselves: do we really want to check for all error types one-by-one every time?

Often the answer is "No": we'd like to be "one level above all that". We just want to know if there was a "data reading error" -- why exactly it happened is often irrelevant (the error message describes it). Or, even better, we'd like to have a way to get the error details, but only if we need to.

The technique that we describe here is called "wrapping exceptions".

1. We'll make a new class `ReadError` to represent a generic "data reading" error.
2. The function `readUser` will catch data reading errors that occur inside it, such as `ValidationError` and `SyntaxError`, and generate a `ReadError` instead.
3. The `ReadError` object will keep the reference to the original error in its `cause` property.

Then the code that calls `readUser` will only have to check for `ReadError`, not for every kind of data reading errors. And if it needs more details of an error, it can check its `cause` property.

Here's the code that defines `ReadError` and demonstrates its use in `readUser` and `try..catch`:

```js run
class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = 'ReadError';
  }
}

class ValidationError extends Error { /*...*/ }
class PropertyRequiredError extends ValidationError { /* ... */ }

function validateUser(user) {
  if (!user.age) {
    throw new PropertyRequiredError("age");
  }

  if (!user.name) {
    throw new PropertyRequiredError("name");
  }
}

function readUser(json) {
  let user;

  try {
    user = JSON.parse(json);
  } catch (err) {
*!*
    if (err instanceof SyntaxError) {
      throw new ReadError("Syntax Error", err);
    } else {
      throw err;
    }
*/!*
  }

  try {
    validateUser(user);
  } catch (err) {
*!*
    if (err instanceof ValidationError) {
      throw new ReadError("Validation Error", err);
    } else {
      throw err;
    }
*/!*
  }

}

try {
  readUser('{bad json}');
} catch (e) {
  if (e instanceof ReadError) {
*!*
    alert(e);
    // Original error: SyntaxError: Unexpected token b in JSON at position 1
    alert("Original error: " + e.cause);
*/!*
  } else {
    throw e;
  }
}
```

In the code above, `readUser` works exactly as described -- catches syntax and validation errors and throws `ReadError` errors instead (unknown errors are rethrown as usual).

So the outer code checks `instanceof ReadError` and that's it. No need to list all possible error types.

The approach is called "wrapping exceptions", because we take "low level" exceptions and "wrap" them into `ReadError` that is more abstract. It is widely used in object-oriented programming.

## 요약

- 커스텀 클래스는 `Error`나 다른 내장 오류 클래스를 상속받아 만들 수 있습니다. 이때 `super`를 호출해야 한다는 점과 `name` 프로퍼티를 신경써야 한다는 점을 잊지 마세요.
- `instanceof`를 사용하면 오류 종류를 판별할 수 있습니다. 상속된 클래스에도 마찬가지죠. 그러나 서드파티 라이브러리에서 온 오류 객체는 클래스를 알아내는 것이 쉽지 않습니다. 이때는 `name` 프로퍼티를 사용해 오류 종류를 확인할 수 있습니다.
- Wrapping exceptions is a widespread technique: a function handles low-level exceptions and creates higher-level errors instead of various low-level ones. Low-level exceptions sometimes become properties of that object like `err.cause` in the examples above, but that's not strictly required.
