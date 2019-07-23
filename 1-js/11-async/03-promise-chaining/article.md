
# 프라미스 체이닝

<info:callbacks>에서 언급한 문제를 다시 집어보도록 합시다. 현재 순차적으로 처리해야 하는 비동기 작업이 여러 개 있다고 가정해 봅시다. 스크립트를 불러오는 예시같이 말이죠. 이런 상황을 어떻게 코드로 잘 풀어낼 수 있을까요?

프라미스를 사용하면 이런 상황에 대한 여러 가지 해결책을 도출해낼 수 있습니다.

이번 챕터에선 프라미스 체이닝(promise chaining)을 이용한 비동기 처리에 대해 다루도록 하겠습니다.

프라미스 체이닝은 아래와 같이 만들 수 있습니다.

```js run
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // (*)

}).then(function(result) { // (**)

  alert(result); // 1
  return result * 2;

}).then(function(result) { // (***)

  alert(result); // 2
  return result * 2;

}).then(function(result) {

  alert(result); // 4
  return result * 2;

});
```

프라미스 체이닝은 `.then` 핸들러의 체인(사슬)을 통해 결과를 전달할 수 있다는 점에서 착안한 아이디어입니다.

위 코드는 아래와 같은 흐름을 갖습니다.
1. 1초 후 최초 프라미스가 이행되고(`(*)`),
2. `.then` 핸들러가 호출됩니다(`(**)`).
3. 2에서 반환한 값은 다음 `.then` 핸들러에 전달됩니다(`(***)`).
4. 이런 과정이 계속 이어집니다.

결과가 핸들러의 사슬을 통해 전달되므로, `alert` 창에 `1` -> `2` -> `4`가 순서대로 출력되는것을 확인할 수 있습니다.

![](promise-then-chain.png)

이렇게 체이닝이 가능한 이유는 `promise.then`을 호출하면 프라미스가 반환되기 때문입니다. 프라미스가 반환되기 때문에 이 프라미스에 다시 `.then`을 호출할 수 있는 거죠.

핸들러가 값을 반환할 땐, 이 값이 프라미스의 result가 됩니다. 따라서 체인 상의 다음 `.then`은 이 값을 이용해 호출됩니다.  

설명이 조금 복잡해 보이지만 예제를 통해 이해해 보도록 합시다. 아래는 체인의 시작부입니다.

```js run
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000);

}).then(function(result) {

  alert(result);
  return result * 2; // <-- (1)

}) // <-- (2)
// .then…
```

`.then`을 호출하면 프라미스가 반환됩니다. `(2)`에서 또 다른 `.then`을 추가할 수 있는 이유가 바로 이 때문이죠. `(1)`에서 값이 반환되면, 프라미스는 이행상태가 됩니다. 따라서 다음 핸들러는 반환값을 가지고 실행됩니다. 

**초보자가 많이 하는 실수: 프라미스 하나에 `.then`을 원하는 만큼 추가할 순 있지만, 이는 체이닝이 아닙니다.**

예시:
```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});
```

위 코드에서 한 것은, 프라미스 하나에 여러 개의 핸들러를 등록한 것뿐입니다. 이 핸들러들은 결과를 순차적으로 전달하지 않고, 독립적으로 결과를 처리합니다.

그림으로 표현하면 다음과 습니다. 프라미스 체이닝을 묘사한 위 그림과 비교해 보세요.

![](promise-then-many.png)

한 프라미스에 등록된 모든 `.then`은 해당 프라미스의 result라는 동일한 결과를 받습니다. 따라서 위 코드에서 모든 `alert` 창은 `1`을 출력합니다.

이런 식으로 한 프라미스에 여러 개의 핸들러를 등록해서 사용하는 경우는 거의 없습니다. 프라미스 체이닝이 더 많이 쓰이죠.

## 프라미스 반환하기

`.then` 핸들러에 의해 반환된 값은 보통 다음 핸들러에 바로 전달됩니다. 하지만 예외상황이 하나 있습니다.

반환값이 프라미스인 경우가 그렇습니다. 이때는 프라미스가 처리될 때(settled)까지 추가 실행이 중지됩니다. 프라미스가 처리되면 해당 프라미스의 결과가 다음 핸들러로 전달됩니다.

예시:

```js run
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000);

}).then(function(result) {

  alert(result); // 1

*!*
  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });
*/!*

}).then(function(result) { // (**)

  alert(result); // 2

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) {

  alert(result); // 4

});
```

위 코드에서 첫 번째 `.then`은 `1`을 보여주고 `(*)`로 표시한 줄에서 `new Promise(…)`를 반환합니다. 1초 후 이 프라미스가 이행되고, 그 결과(`resolve`의 인수, 여기선 `result*2`)가 `(**)`로 표시한 두 번째 `.then` 핸들러에 전달됩니다. 두 번째 `.then` 핸들러에선 `2`가 출력되고, 앞의 작업과 동일한 작업이 수행됩니다.

따라서 1 -> 2 -> 4가 순차적으로 출력됩니다. 다만 `alert` 창 사이에 1초의 간격이 생기죠.

이렇게 프라미스를 반환하는 것도 비동기 작업의 체이닝을 가능하게 해줍니다.

## 예제: loadScript

이제 지금까지 배운 내용을 응용해 `loadScript`가 복수의 스크립트를 순차적으로 하나씩 불러오도록 해봅시다.

```js run
loadScript("/article/promise-chaining/one.js")
  .then(function(script) {
    return loadScript("/article/promise-chaining/two.js");
  })
  .then(function(script) {
    return loadScript("/article/promise-chaining/three.js");
  })
  .then(function(script) {
    // 불러온 스크립트 안에 정의된 함수를 호출해
    // 실제로 스크립트들이 정상적으로 로드되었는지 확인합니다.
    one();
    two();
    three();
  });
```

화살표 함수를 사용하면 코드 길이를 좀 더 줄일 수 있습니다.

```js run
loadScript("/article/promise-chaining/one.js")
  .then(script => loadScript("/article/promise-chaining/two.js"))
  .then(script => loadScript("/article/promise-chaining/three.js"))
  .then(script => {
    // 스크립트를 정상적으로 불러왔기 때문에, 스크립트 내의 함수를 호출할 수 있습니다.
    one();
    two();
    three();
  });
```


위 코드에서 각 `loadScript`는 호출될 때마다 프라미스를 반환합니다. 다음 `.then`은 이 프라미스가 이행된 경우 실행되죠. 이어지는 `.then`은 다음 스크립트를 부르는 작업을 시작합니다. 이런 작업을 거쳐 스크립트가 순차적으로 로드됩니다.

체이닝을 이런 식으로 응용하면 더 많은 비동기 작업을 추가할 수 있습니다. 추가 작업이 많아져도 코드가 오른쪽으로 길어지지 않기 때문에 멸망의 피라미드가 만들어 지지 않고 코드의 전체적인 모양이 "편평"해집니다.

한편, 아래와 같이 각 `loadScript`에 `.then`을 바로 붙일 수도 있습니다.

```js run
loadScript("/article/promise-chaining/one.js").then(script1 => {
  loadScript("/article/promise-chaining/two.js").then(script2 => {
    loadScript("/article/promise-chaining/three.js").then(script3 => {
      // 여기서 script1, script2, script3에 정의된 함수를 사용할 수 있습니다.
      one();
      two();
      three();
    });
  });
});
```

이렇게 `.then`을 바로 붙여도 동일한 동작(스크립트 3개를 순차적으로 불러오는 작업)을 수행합니다. 하지만 코드가 "오른쪽으로" 길어졌네요. 콜백 기반 비동기 요청에서 발생한 문제와 유사한 문제가 발생했습니다.  

프라미스를 이제 막 배우기 시작해 체이닝에 대해 잘 모른다면 위처럼 코드를 작성할 확률이 있습니다. 위 방법보다 체이닝을 이용한 방법을 더 선호하므로 프라미스 체이닝을 잘 익혀두도록 합시다.

그런데 가끔은 `.then`을 바로 쓰는 게 괜찮은 경우도 있습니다. 중첩 함수가 외부 스코프에 접근할 수 있기 때문이죠. 위 예제에서 가장 깊은 곳에 있는 중첩 콜백은  `script1`, `script2`, `script3` 안에 있는 모든 변수에 접근할 수 있습니다. 이런 예외 상황이 있다는 정도만 알아두도록 합시다. 


````smart header="Thenables"
`.then`에 대해 정확히 짚고 넘어가도록 합시다. `.then`은 "thenable"이라 불리는 객체를 반환할 수 있습니다. "thenable"객체는 `.then` 메서드를 가지고 있고, 프라미스와 같은 방식으로 처리됩니다.

"thenable" 객체에 대한 아이디어는 서드파티 라이브러리가 "프라미스와 호환 가능한" 자체 객체를 구현할 수 있다는 점에서 출발했습니다. 이 객체는 추가 메서드를 가질 수 있으면서 `.then`을 구현하고 있기 때문에 네이티브 프라미스와도 호환 가능합니다.

아래는 thenable 객체에 대한 예시입니다.

```js run
class Thenable {
  constructor(num) {
    this.num = num;
  }
  then(resolve, reject) {
    alert(resolve); // function() { 네이티브 코드 }
    // 1초 후 this.num*2와 함께 이행됨
    setTimeout(() => resolve(this.num * 2), 1000); // (**)
  }
}

new Promise(resolve => resolve(1))
  .then(result => {
    return new Thenable(result); // (*)
  })
  .then(alert); // 1000 밀리 초 후 2를 보여줌
```

자바스크립트는 `(*)`로 표시한 줄에서 `.then` 핸들러가 반환한 객체를 확인합니다. 이 객체가 호출 가능한 메서드, `then`을 가지고 있다면 `then`이 호출됩니다. `then`은 `resolve`와 `reject`를 인수로 받는데, `then` 안에 구현된 네이티브 함수는 `resolve`와 `reject` 중 하나가 호출될 때까지 기다립니다. 위 예시에서 `resolve(2)`는 1초 후에 호출됩니다(`(**)`). 호출 후 결과는 체인을 따라 아래까지 전달됩니다.

이렇게 `Promise`를 상속하지 않는 커스텀 thenable 객체를 사용해도 프라미스 체이닝이 가능합니다.
````


## fetch와 체이닝 함께 응용하기

프론트 단에선 네트워크 요청을 할 때 프라미스를 자주 사용합니다. 이에 관련된 예시를 좀 더 살펴봅시다. 

원격 서버에서 사용자 정보를 가져오기 위해 [fetch](mdn:api/WindowOrWorkerGlobalScope/fetch) 메서드를 사용하겠습니다. `fetch`는 선택할 수 있는 매개변수가 많기 때문에 꽤 복잡하지만, 기본 문법은 아주 간단한 메서드입니다.

```js
let promise = fetch(url);
```

위 코드를 실행하면 `url`에 네트워크 요청이 가고 프라미스가 반환됩니다. 원격 서버가 헤더와 함께 응답을 보내면, 프라미스는 `response` 객체와 함께 이행됩니다. *response 전체가 완전히 다운로드되기 전*에 말이죠. 

응답 전체를 읽으려면 `response.text()` 메서드를 호출해야 합니다. `response.text()` 메서드는 원격 서버에서 텍스트 전체를 다운로드하면, 다운로드받은 텍스트를 result 값으로 사용하는 이행된 프라미스를 반환합니다.

아래 코드는 `user.json`을 요청하고, 서버에서 해당 텍스트를 불러오는 예제입니다.

```js run
fetch('/article/promise-chaining/user.json')
  // 아래 .then은 원격 서버가 응답할 때 실행됩니다.
  .then(function(response) {
    // response.text()는 다운로드 완료 시, 
    // 응답받은 텍스트 전체를 이용해 새로운 이행 프라미스를 반환합니다. 
    return response.text();
  })
  .then(function(text) {
    // 원격에서 받아온 파일의 내용을 출력해줍니다.
    alert(text); // {"name": "iliakan", isAdmin: true}
  });
```

`response.json()` 메서드를 쓰면 원격에서 받아온 데이터를 읽고, JSON으로 파싱할 수 있습니다. 우리 예제엔 이 메서드가 더 적합하므로 기존에 작성한 코드를 약간 변경해 보도록 하겠습니다.

화살표 함수도 함께 써서 코드를 간결하게 바꿔봅시다.

```js run
// 위 코드와 동일한 기능을 하지만, response.json()은 원격 서버에서 불러온 내용을 JSON으로 변경해줍니다.
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => alert(user.name)); // iliakan
```

자, 이제 사용자 정보를 불러왔으니 이걸 가지고 무언가를 더 해봅시다.

GitHub에 요청을 보내 사용자 프로필을 불러오고 아바타를 출력해봅시다.

```js run
// user.json을 요청합니다.
fetch('/article/promise-chaining/user.json')
  // 응답받은 내용을 json 형태로 불러옵니다.
  .then(response => response.json())
  // GitHub에 요청을 보냅니다.
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  // 응답받은 내용을 json 형태로 불러옵니다.
  .then(response => response.json())
  // 아바타 이미지(githubUser.avatar_url)를 3초간 보여줍니다.
  .then(githubUser => {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => img.remove(), 3000); // (*)
  });
```

코드는 의도한 대로 잘 동작합니다. 주석을 보면 어떤 일이 일어나는지 상세히 알 수 있죠. 그런데 위 코드엔 잠재적 문제가 하나 내재되어 있습니다. 프로미스를 다루는데 서툰 개발자가 자주 저지르는 문제죠. 

`(*)`로 표시한 줄을 보세요. 만약 아바타가 사라진 *이후에* 비동기 작업을 하나 더 추가해야 한다면 어떻게 해야 할까요? 유저 정보를 수정할 수 있게 해주는 폼을 보여주는 등의 작업을 추가하려는 경우같이 말이죠. 지금으로선 방법이 없습니다.

체인을 언제든 확장 할 수 있도록 하려면 아바타가 사라졌을 때 이행되는 프라미스를 반환해 줘야 합니다.

아래와 같이 말이죠.

```js run
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
*!*
  .then(githubUser => new Promise(function(resolve, reject) {
*/!*
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
*!*
      resolve(githubUser);
*/!*
    }, 3000);
  }))
  // 3초 후 아래 체인이 실행됩니다.
  .then(githubUser => alert(`Finished showing ${githubUser.name}`));
```

이제 `setTimeout`에서 `img.remove()`와 `resolve(githubUser)`가 연속으로 실행됩니다. 이후 `.then` 체인으로 흐름이 이어지면서 사용자 데이터가 전달됩니다.

이처럼 비동기 작업은 항상 프라미스를 반환하도록 하는 게 좋습니다.

지금은 체인을 확장할 계획이 없더라도 이렇게 구현해 놓으면 나중에 체인 확장이 필요한 경우 손쉽게 체인을 확장할 수 있습니다.

이제 코드를 재사용 가능한 함수 단위로 리팩토링한 후 마무리하도록 하겠습니다.

```js run
function loadJson(url) {
  return fetch(url)
    .then(response => response.json());
}

function loadGithubUser(name) {
  return fetch(`https://api.github.com/users/${name}`)
    .then(response => response.json());
}

function showAvatar(githubUser) {
  return new Promise(function(resolve, reject) {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  });
}

// 함수를 이용하여 다시 동일 작업 수행
loadJson('/article/promise-chaining/user.json')
  .then(user => loadGithubUser(user.name))
  .then(showAvatar)
  .then(githubUser => alert(`Finished showing ${githubUser.name}`));
  // ...
```

## 요약

`.then` (혹은 `catch/finally`) 핸들러가 프라미스를 반환하면, 이어지는 체인은 이 프라미스가 처리될 때까지 대기합니다. 처리가 완료되면 결과나 에러가 다음 체인으로 전달됩니다.

아래는 이 과정을 그림으로 나타낸 것입니다.

![](promise-handler-variants.png)
