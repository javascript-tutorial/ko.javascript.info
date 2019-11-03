# 커스텀 에러, 에러 확장하기

무언가 개발할 때, 종종 작업에서 잘못될 수 있는 특정한 것들을 반영하기 위해 자체적인 에러 클래스들이 필요합니다. 네트워크 동작시 에러들에 대해 `HttpError`, 데이터베이스 동작시에 `DbError`, 검색 동작시에 `NotFoundError` 등등이 필요할 수 있습니다.

우리의 에러는 `message`, `name` 같은 기본적인 에러 프로퍼티를 지원해야 하고, `stack`을 지원하는 것도 권장됩니다. 또한 그밖에 다른 프로퍼티도 가질 수 있습니다. 예를 들어 `HttpError` 객체들은 `statusCode` 프로퍼티로 `404` 또는 `403` 또는 `500` 같은 값을 가질 수 있습니다.

자바스크립트는 `throw` 를 아무 인수와 함께 사용할 수 있게 허용하므로, 기본적으로 커스텀 에러 클래스들은 `Error`를 상속할 필요가 없습니다. 그러나 상속을 하면 `obj instanceof Error`를 사용해서 에러 객체들을 식별하는 것이 가능해집니다. 따라서 상속받는 게 낫습니다.

애플리케이션의 크기가 점점 증가함에 따라, 자체 에러들은 자연스레 계층 구조를 형성합니다. 예를 들어 `HttpTimeoutError`는 `HttpError`를 상속받는 등입니다.

## 에러 확장하기

예를 들어, 사용자 데이터를 가진 JSON을 읽어야 하는 `readUser(json)`라는 함수를 생각해 봅시다.

다음은 유효한 `json`의 모습에 대한 예입니다.
```js
let json = `{ "name": "John", "age": 30 }`;
```

내부적으로 우리는 `JSON.parse`를 이용할 것입니다. 틀린 `json`을 받으면, `SyntaxError`를 던집니다. 그러나 `json`이 문법적으로 맞다고 하더라도, 유효한 사용자라는 의미는 아닙니다, 그렇죠? 필수 데이터를 빠뜨렸을 수도 있습니다. 예를 들어, 사용자들에게 필수인 `name`과 `age` 프로퍼티가 없을 수도 있습니다.

우리의 함수 `readUser(json)`는 JSON을 읽을뿐만 아니라, 데이터를 확인("검증")하기도 합니다. 필수 입력란이 없거나, 형식이 틀렸다면, 그것은 에러입니다. 그리고 데이터가 문법적으로 맞기 때문에 `SyntaxError`는 아니고, 다른 종류의 에러입니다. 이를 `ValidationError`라고 부를 것이고 이를 위한 클래스를 생성할 것입니다. 이런 종류의 에러는 또한 문제가 되는 필드에 대한 정보를 가지고 있어야 합니다.

우리의 `ValidationError` 클래스는 내장된 `Error` 클래스로부터 상속받아야 합니다.

그 클래스는 내장 클래스지만, 우리 눈 앞에 대략적인 코드가 있어야만 우리가 확장하고 있는 것에 대해 이해할 수 있겠죠. 아래 수도 코드를 살펴봅시다.

```js
// 자바스크립트 자체에서 정의한 내장 에러 클래스의 "수도코드"
class Error {
  constructor(message) {
    this.message = message;
    this.name = "Error"; // (서로 다른 내장 에러 클래스들의 서로 다른 이름들)
    this.stack = <call stack>;  // 표준은 아니지만, 대다수의 환경이 지원합니다
  }
}
```

이제 계속해서 `ValidationError`이 그걸 상속 받도록 해 봅시다.

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

`(1)` 줄에서 부모 생성자를 호출하고 있다는 것에 주목하시기 바랍니다. 자바스크립트에서는 자식 생성자 안에서 `super`를 호출해야 하므로 이는 필수입니다. 부모 생성자는 `message` 프로퍼티를 설정합니다.

부모 생성자는 또한 `name` 프로퍼티를 `"Error"`로 설정하기 때문에, `(2)` 쥴에서 올바른 값으로 재설정합니다.

`readUser(json)` 안에서 이를 사용해 봅시다.

```js run
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// 사용
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

// try..catch와 함께 사용한 동작 예제

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
    throw err; // 알려지지 않은 에러, 재던지기를 합니다 (**)
  }
}
```

위의 코드에서 `try..catch` 블록은 `JSON.parse`에서 우리가 만든 `ValidationError`와 내장된 `SyntaxError` 둘 다 처리합니다.

`instanceof`를 사용하여 `(*)` 줄에서 에러 유형을 확인하는 방법을 살펴 보세요. 

다음과 같이 `err.name`를 볼 수도 있습니다.

```js
// ...
// instead of (err instanceof SyntaxError)
} else if (err.name == "SyntaxError") { // (*)
// ...
```  

`instanceof`를 사용하는 게 훨씬 좋습니다. 왜냐하면 나중에 `ValidationError`를 확장하여 `PropertyRequiredError` 같은 서브 타입을 만들 것이기 때문입니다. 그리고 `instanceof` 검사는 상속받은 새로운 클래스들에서도 동작할 것입니다. 따라서 나중에 대비할 수 있게 됩니다.

또한 `catch`가 알려지지 않은 에러를 만나면 `(**)` 줄에서 재던지기를 한다는 것이 중요합니다. `catch` 블록은 유효성 검사와 문법 오류를 처리하는 방법만 알고 있으며, 다른 종류(코드 오타 등)는 빠져나가야 합니다. 

## 더 깊게 상속하기

`ValidationError` 클래스는 너무 추상적입니다. 많은 것들이 잘못될 수 있습니다. 프로퍼티가 없거나 잘못된 형식(가령 `age`에 문자열 값이 들어가는 것처럼)으로 될 수 있습니다. 프로퍼티가 없는 바로 그 경우에 대해서 더 구체적인 클래스인 `PropertyRequiredError`를 만들어 봅시다. 누락된 프로퍼티에 대한 추가 정보를 담을 것입니다.

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

// Usage
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

// try..catch와 함께 사용한 동작 예제

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
    throw err; // unknown error, rethrow it
  }
}
```

새로운 클래스 `PropertyRequiredError`는 사용하기 쉽습니다. 우리는 단지 프로퍼티 이름을 전달하기만 하면 됩니다. `new PropertyRequiredError(property)`. 사람이 읽기 쉬운 `message`는 생성자에 의해 생성됩니다.

Please note that `this.name` in `PropertyRequiredError` constructor is again assigned manually. That may become a bit tedious -- to assign `this.name = <class name>` in every custom error class. We can avoid it by making our own "basic error" class that assigns `this.name = this.constructor.name`. And then inherit all ours custom errors from it.

이 클래스를 `MyError`라고 부릅시다.

여기 `MyError`와 다른 커스텀 에러 클래스들의 간단한 코드가 있습니다.

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

// name is correct
alert( new PropertyRequiredError("field").name ); // PropertyRequiredError
```

이제 커스텀 에러들, 특히 `ValidationError`는, 생성자에서 `"this.name = ..."` 줄을 제거하여 훨씬 짧아졌습니다.

## 예외 감싸기

위의 코드에서 함수 `readUser`의 목적은 "사용자 데이터를 읽는 것"입니다. 그런데 그 과정에서 다른 오류들이 발생할 수 있습니다. 지금 당장은 `SyntaxError`와 `ValidationError`만 있지만, 앞으로 `readUser` 함수가 더 커지면 다른 오류들을 만들어 낼 수도 있습니다.

The code which calls `readUser` should handle these errors. Right now it uses multiple `if`s in the `catch` block, that check the class and handle known errors and rethrow the unknown ones. But if the `readUser` function generates several kinds of errors, then we should ask ourselves: do we really want to check for all error types one-by-one in every code that calls `readUser`?

보통 대답은 "아니요"입니다. 바깥쪽 코드는 "모든 것들의 한 수준 위"가 되고 싶어합니다. 바깥쪽 코드는 일종의 "data reading error"를 원합니다. 정확히 왜 그런 일이 발생했는지는 보통 무의미합니다. (에러 메시지가 그것을 설명합니다). 또는, 필요한 경우에만 오류 상세를 얻는 방법이 있으면 훨씬 좋습니다.

이런 오류들을 나타내는 새로운 `ReadError` 클래스를 만들어 봅시다. If an error occurs inside `readUser` 안에서 오류가 발생하면, 오류를 거기에서 잡아서 `ReadError`를 생성합니다. 우리는 또한  `cause` 프로퍼티에 실제 오류에 대한 참조도 보관할 것입니다. 그러면 바깥쪽 코드에서는 `ReadError`만 확인하면 됩니다..

여기에 `ReadError`를 정의하고 `readUser`와 `try..catch` 안에서 쓰임을 시연하는 코드가 있습니다.

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

위의 코드에서 `readUser`는 정확히 설명한대로 동작합니다. 문법 및 유효성 검사 오류들을 잡아서  `ReadError` 오류를 던집니다 (알려지지 않은 오류들은 보통처럼 다시 던져집니다).

따라서 바깥쪽 코드는 `instanceof ReadError`만 체크하면 끝입니다. 발생할 수 있는 모든 오류 유형들을 나열할 필요가 없습니다.

이런 접근법을 "예외 감싸기"라고 합니다. "로우레벨 예외"들을 가져다가 `ReadError` 안으로 "감싸서", 더 추상적이고 호출하는 코드에서 사용하기 편리하기 때문입니다. 객체지향 프로그래밍에서 보편적으로 사용됩니다.

## 요약

- `Error`나 다른 내장 오류 클래스로부터 상속받는 게 가능합니다. 이때 `name` 프로퍼티와 `super`를 호출하는 것만 잊지 않으시면 됩니다.
- 특정 오류를 확인하는데 `instanceof`를 사용할 수 있습니다. 상속된 클래스에도 마찬가지죠. 그러나 서드파티 라이브러리에서부터 온 오류 객체의 경우엔 클래스를 알아내는 것이 쉽지 않습니다. 이때는 `name` 프로퍼티를 사용해 확인할 수 있습니다.
- 예외 감싸기는 널리 사용되는 기법입니다. 함수는 로우-레벨 예외를 처리하고, 이때 로우-레벨 에러를 만드는 대신에 하이-레벨 에러를 만듭니다. 로우-레벨 예외는 위의 예시처럼 가끔 해당 객체의 프로퍼티가 되곤 합니다. `err.cause`처럼 말이죠. 다만 필수사항은 아닙니다.
