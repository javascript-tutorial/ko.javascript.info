# 커스텀 에러와 에러 확장

개발을 하다 보면 자체 에러 클래스가 필요한 경우가 종종 생깁니다. 네트워크 관련 작업 중 에러가 발생했다면 `HttpError`, 데이터베이스 관련 작업 중 에러가 발생했다면 `DbError`, 검색 관련 작업 중 에러가 발생했다면 `NotFoundError`를 사용하는 것이 직관적이기 때문이죠.

직접 에러 클래스를 만든 경우, 이 에러들은 `message`이나 `name`, 가능하다면 `stack` 프로퍼티를 지원해야 합니다. 물론 이런 프로퍼티 이외에도 다른 프로퍼티를 지원할 수 있습니다. `HttpError` 클래스의 객체에 `statusCode` 프로퍼티를 만들고 `404`나 `403`, `500`같은 숫자를 값으로 지정할 수 있을 겁니다.

앞서 배운 바와 같이 `throw`의 인수엔 아무런 제약이 없기 때문에 커스텀 에러 클래스는 반드시 `Error`를 상속할 필요가 없습니다. 그렇지만 `Error`를 상속받아 커스텀 에러 클래스를 만들게 되면 `obj instanceof Error`를 사용해서 에러 객체를 식별할 수 있다는 장점이 생깁니다. 이런 장점 때문에 맨땅에서 커스텀 에러 객체를 만드는 것보다 `Error`를 상속받아 에러 객체를 만드는 것이 낫습니다.

애플리케이션 크기가 점점 커지면 우리가 만들게 될 커스텀 에러 클래스들은 자연스레 계층 구조를 형성하게 됩니다. `HttpTimeoutError`는 `HttpError`를 상속받는 식으로 말이죠.

## 에러 확장하기

사용자 데이터가 저장된 JSON을 읽는 함수 `readUser(json)`가 있다고 해봅시다.

유효한 `json`은 다음과 같은 형태이어야 합니다.
```js
let json = `{ "name": "John", "age": 30 }`;
```

`readUser` 내부에선 `JSON.parse`를 이용하게 됩니다. 따라서 잘못된 형식의 `json`이 들어오면 `SyntaxError`가 발생하겠죠. 그런데 인수로 받은 데이터가 JSON 형식이긴 하지만, 유효한 사용자일 것이라는 보장은 없습니다. 사용자 데이터라면 필수적으로 있어야 할 `name`이나 `age`가 누락되었을 수 있죠.

따라서 `readUser(json)`은 JSON 형식의 데이터를 읽을 수 있을 뿐만 아니라, 데이터를 '검증'할 수 있어야 합니다. 필수 프로퍼티가 없거나, 위 형식에 맞지 않으면 에러를 발생시킬 수 있어야 하죠. 그런데 이때 발생하는 에러는 `SyntaxError`가 아닙니다. JSON 형식은 맞지만, 자체 기준에 맞지 않기 때문에 발생한 에러이므로 전혀 다른 종류의 에러이죠. 지금부턴 이 에러를 `ValidationError`라고 부르겠습니다. 자 이제 `ValidationError`를 위한 클래스를 만들어봅시다.

`ValidationError` 클래스엔 문제가 되는 필드 정보가 저장되어야 합니다. 내장 클래스 `Error`를 상속받아 `ValidationError` 클래스를 만들어봅시다.

그 전에 먼저 잠시 슈도 코드로 `Error` 클래스가 어떻게 생겼는지 살펴보겠습니다.

```js
// 자바스크립트 자체 내장 에러 클래스 Error의 '슈도 코드'
class Error {
  constructor(message) {
    this.message = message;
    this.name = "Error"; // (name은 내장 에러 클래스마다 다릅니다.)
    this.stack = <call stack>;  // stack은 표준은 아니지만, 대다수 환경이 지원합니다.
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

`(1)`에서 부모 생성자를 호출하고 있다는 것에 주목해 주시기 바랍니다. 자바스크립트에서는 자식 생성자 안에서 `super`를 반드시 호출해야 합니다. `message` 프로퍼티는 부모 생성자에서 설정됩니다.

부모 생성자에선 `message`뿐만 아니라 `name` 프로퍼티도 설정(`"Error"`)하기 때문에, `(2)`에서 원하는 값으로 재설정해주었습니다.

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

// try..catch와 readUser를 함께 사용한 예시

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

이제 `try..catch` 블록에서 커스텀 에러 `ValidationError`와 `JSON.parse`에서 발생하는 `SyntaxError` 둘 다를 처리할 수 있게 되었습니다.

이 과정에서 `instanceof`로 에러 유형을 확인(`(*)`)하였습니다.

에러 유형 확인은 `instanceof` 말고 다음과 같이 `err.name`을 사용해도 가능합니다.

```js
// ...
// (err instanceof SyntaxError) 대신 사용 가능
} else if (err.name == "SyntaxError") { // (*)
// ...
```  

그런데 에러 유형 확인은 `err.name`보다는 `instanceof`를 사용하는 게 훨씬 좋습니다. 나중에 `ValidationError`를 확장하여 `PropertyRequiredError` 같은 새로운 확장 에러를 만들게 될 텐데, `instanceof`는 새로운 상속 클래스에서도 동작하기 때문입니다. 

`catch`에 알려지지 않은 에러가 있을 때 이 에러는 재 던지기 된다는 점(`(**)`) 또한 주목해서 봐주시기 바랍니다. `catch` 블록에선 유효성 검사와 문법 오류만 처리하고, 다른 종류의 에러는 밖으로 던져야 합니다.

## 더 깊게 상속하기

앞서 만든 `ValidationError` 클래스는 너무 포괄적이어서 뭔가 잘못될 확률이 있습니다. 꼭 필요한 프로퍼티가 누락되거나 `age`에 문자열 값이 들어가는 것처럼 형식이 잘못된 경우를 처리할 수 없죠. 필수 프로퍼티가 없는 경우에 대응할 수 있도록 좀 더 구체적인 클래스 `PropertyRequiredError`를 만들어 봅시다. `PropertyRequiredError`엔 누락된 프로퍼티에 대한 추가 정보가 담겨야 합니다.

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

새롭게 만든 클래스 `PropertyRequiredError`는 사용하기 쉽습니다. `new PropertyRequiredError(property)`처럼 프로퍼티 이름을 전달하기만 하면 되죠. 사람이 읽을 수 있는 `message`는 생성자가 알아서 만들어줍니다.

여기서 주목할 점은 `PropertyRequiredError` 생성자 안에서 `this.name`을 수동으로 할당해 주었다는 것입니다. 그런데 이렇게 매번 커스텀 에러 클래스의 생성자 안에서 `this.name`를 할당해 주는 것은 귀찮은 작업입니다. 이런 번거로운 작업은 '기본 에러' 클래스를 만들고 커스텀 에러들이 이 클래스를 상속받게 하면 피할 수 있습니다. 기본 에러의 생성자에 `this.name = this.constructor.name`를 추가하면 되죠.

기본 에러 클래스를 `MyError`라고 부르겠습니다.

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

`"this.name = ..."` 이 사라졌기 때문에 `ValidationError`같은 커스텀 에러의 생성자가 더 깔끔해진 것을 확인할 수 있습니다.

## 예외 감싸기

함수 `readUser`는 '사용자 데이터를 읽기' 위한 용도로 만들어졌습니다. 그런데 사용자 데이터를 읽는 과정에서 다른 오류가 발생할 수 있습니다. 지금 당장은 `SyntaxError`와 `ValidationError`를 사용해 에러를 처리하고 있는데, 앞으로 `readUser`가 더 커지면 다른 커스텀 에러 클래스를 만들어야 할 겁니다.

`readUser`를 호출하는 곳에선 새롭게 만들어질 커스텀 에러들을 처리할 수 있어야 합니다. 그런데 지금은 `catch` 블록 안에 `if`문 여러 개를 넣어 종류를 알 수 있는 에러를 처리하고, 그렇지 않은 에러는 다시 던지기를 해 처리하고 있는 실정입니다.

현재 에러 처리 스키마는 다음과 같습니다.

```js
try {
  ...
  readUser()  // 잠재적 에러 발생처
  ...
} catch (err) {
  if (err instanceof ValidationError) {
    // validation 에러 처리
  } else if (err instanceof SyntaxError) {
    // 문법 에러 처리
  } else {
    throw err; // 알 수 없는 에러는 다시 던지기 함
  }
}
``` 
 
위 스키마엔 두 종류의 에러만 나와 있네요. 그런데 에러의 종류는 더 추가될 수 있습니다.

이쯤 되면 "미래에 `readUser` 기능이 커지면서 에러 종류가 많아질 텐데 그때마다 에러 종류에 따라 에러 처리 분기문을 매번 추가해야 하나?"라는 의문이 생길 수 있습니다.

보통은 그렇지 '않습니다'. 실제 우리가 필요로 하는 정보는 '데이터를 읽을 때' 에러가 발생했는지에 대한 여부입니다. 왜 에러가 발생했는지와 자세한 설명은 대부분의 경우 필요하지 않습니다. 필요할 때 에러 세부사항에 대한 정보를 얻을 수 있는 방법이 있다면 더 좋겠지만 말이죠.

이런 에러 처리 기술은 '예외 감싸기(wrapping exception)'라고 부릅니다. 예외 감싸기는 다음과 같은 순서로 진행됩니다.

1. '데이터 읽기'와 같은 포괄적인 에러를 대변하는 새로운 클래스 `ReadError`를 만듭니다.
2. 함수 `readUser` 발생한 `ValidationError`, `SyntaxError` 등의 에러는 `readUser` 내부에서 잡고 이때 `ReadError`를 생성합니다.
3. `ReadError` 객체의 `cause` 프로퍼티엔 실제 에러에 대한 참조가 저장됩니다.

이렇게 예외 감싸기 기술을 써 스키마를 변경하면 `readUser`를 호출하는 코드에선 `ReadError`만 확인하면 됩니다. 데이터를 읽을 때 발생하는 에러 종류 전체를 확인하지 않아도 되죠. 추가 정보가 필요한 경우엔 `cause` 프로퍼티를 확인하면 됩니다.

이제 실제로 `ReadError`를 정의하고 이를 사용해보도록 합시다. `ReadError`는`readUser`와 `try..catch` 안에서 다음과 같은 형태로 사용할 수 있습니다.

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
  readUser('{잘못된 형식의 json}');
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

이제 `readUser`는 위에서 설명한 것처럼 동작합니다. Syntax 에러나 Validation 에러가 발생한 경우 해당 에러 자체를 다시 던지기 하지 않고 `ReadError`를 던지게 됩니다.

이렇게 되면, `readUser`를 호출하는 바깥 코드에선 `instanceof ReadError` 딱 하나만 확인하면 됩니다. 에러 처리 분기문을 여러 개 만들 필요가 없어집니다.  

'예외 감싸기'란 이름은 종류별 에러를 좀 더 추상적인 에러, `ReadError`에 하나로 모아(wrap) 처리하기 때문에 붙여졌습니다. 이런 기법은 객체 지향 프로그래밍에서 널리 쓰이는 패턴입니다.

## 요약

- 커스텀 클래스는 `Error`나 다른 내장 에러 클래스를 상속받아 만들 수 있습니다. 이때 `super`를 호출해야 한다는 점과 `name` 프로퍼티를 신경 써야 한다는 점을 잊지 마세요.
- `instanceof`를 사용하면 에러 종류를 판별할 수 있습니다. 상속된 클래스에도 마찬가지죠. 그런데 서드파티 라이브러리에서 온 에러 객체는 클래스를 알아내는 것이 쉽지 않습니다. 이럴 땐 `name` 프로퍼티를 사용해 오류 종류를 확인할 수 있습니다.
- 예외 감싸기는 널리 알려진 예외 처리 기술입니다. 예외 감싸기를 적용한 함수에선 모든 에러를 종류별로 처리하지 않습니다. 대신 모든 에러를 포함할 수 있는 추상 에러를 하나 만들고, 에러가 발생하면 이 추상 에러를 던지도록 합니다. 추상 에러를 던질 때 실제 발생한 에러를 추상 에러의 프로퍼티(`err.cause`)로 넘기면 구체적인 에러 정보를 함께 넘겨줄 수 있는데, 반드시 이 프로퍼티가 있어야 하는 것은 아닙니다.
