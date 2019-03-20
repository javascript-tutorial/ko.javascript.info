# 구조 분해 할당(destructuring assignment)

`객체` 와 `배열`은 자바스크립트에서 가장 많이 쓰이는 자료구조입니다.

객체를 이용하면 다양한 정보 조각을 하나의 엔티티에 넣을 수 있습니다. 배열은 순서가 있는 컬렉션을 저장할 수 있게 해줍니다. 이렇게 객체와 배열을 이용하면 다양한 데이터를 하나의 엔티티로 다룰 수 있습니다. 이를 이용하면 다양한 정보를 객체나 배열에 담아 함수의 매개변수로 전달해 줄 수도 있습니다.

*구조 분해 할당*은 객체나 배열을 변수로 "분해"할 수 있게 해주는 유용한 문법입니다. 구조 분해 할당은 매개변수가 많고, 매개변수 기본값(default values)도 설정해 줘야하는 복잡한 함수에서 그 진가를 발휘합니다. 이 용례는 뒤에서 살펴보도록 하겠습니다.

## 배열 분해하기

배열이 어떻게 변수로 분해되는지 예제를 통해 살펴봅시다:

```js
// 이름과 성을 요소로 가진 배열
let arr = ["Ilya", "Kantor"]

*!*
// 구조 분해 할당
let [firstName, surname] = arr;
*/!*

alert(firstName); // Ilya
alert(surname);  // Kantor
```

배열 분해를 이용해 배열에 담긴 이름과 성을 변수에 할당했습니다.

`split`과 같이 배열을 반환해주는 메서드를 배열 분해와 함께 사용하는것도 좋습니다:

```js
let [firstName, surname] = "Ilya Kantor".split(' ');
```

````smart header="\"분해(Destructuring)\"와 \"파괴(destructive)\"는 다릅니다."
구조 분해 할당이란 명칭은 분해하고자 하는 배열을 복사해서 변수로 "분해(destructurizes)"해주는 특징 때문에 생겼습니다. 이 과정에서 기존 배열은 수정되지 않습니다.

구조 분해 할당은 간결한 문법으로 배열의 요소를 변수로 저장할 수 있게 해주는 방법 일 뿐입니다:
```js
// let [firstName, surname] = arr;
let firstName = arr[0];
let surname = arr[1];
```
````

````smart header="첫번째 요소 무시하기"
여분의 쉼표를 사용하면 필요하지 않은 배열 요소를 버릴 수 있습니다:

```js run
*!*
// 첫번째, 두 번째 요소는 불필요함
let [, , title] = ["Julius", "Caesar", "Consul", "of the Roman Republic"];
*/!*

alert( title ); // Consul
```

위 코드에서 첫번째, 두 번쨰 요소는 걸러졌지만, 세 번째 요소는 `title`이라는 변수에 저장된 것을 확인할 수 있습니다. 그 이외 요소도 역시 걸러졌습니다.
````

````smart header="오른쪽 피연산자에 이터러블 객체가 있는 경우"

배열 분해는 배열 뿐만 아니라 모든 이터러블(iterable) 객체에 사용할 수 있습니다:

```js
let [a, b, c] = "abc"; // ["a", "b", "c"]
let [one, two, three] = new Set([1, 2, 3]);
```

````


````smart header="왼쪽 피연산자엔 모든지 들어갑니다"

왼쪽 피 연산자엔 "할당할 수 있는"것이라면 모든 걸 넣을 수 있습니다.

아래와 같이 객체 프로퍼티도 가능합니다:
```js run
let user = {};
[user.name, user.surname] = "Ilya Kantor".split(' ');

alert(user.name); // Ilya
```

````

````smart header=".entries()로 반복하기"

[Object.entries(obj)](mdn:js/Object/entries)메서드는 이전 챕터에서 학습한 바 있습니다. 

이 메서드를 활용하면 객체를 순회 해 키와 값을 변수로 분해할 수 있습니다.

```js run
let user = {
  name: "John",
  age: 30
};

// keys-and-values 순회하기
*!*
for (let [key, value] of Object.entries(user)) {
*/!*
  alert(`${key}:${value}`); // name:John, then age:30
}
```

맵에도 물론 적용할 수 있습니다:

```js run
let user = new Map();
user.set("name", "John");
user.set("age", "30");

*!*
for (let [key, value] of user.entries()) {
*/!*
  alert(`${key}:${value}`); // name:John, then age:30
}
```
````
### '...'로 나머지 값 가져오기

배열의 앞쪽에 위치한 요소 뿐만 아니라, 특정 요소 이후 이어지는 나머지 값들을 모두 가져와야 하는 경우가 있습니다. 이럴때 `"..."`같이 세개의 점이 이어지는 연산자(역주: 확산 연산자 또는 전개 연산자)를 매개변수 앞에 붙여주면 "나머지(rest)" 값들을 모두 가져올 수 있습니다.

```js run
let [name1, name2, *!*...rest*/!*] = ["Julius", "Caesar", *!*"Consul", "of the Roman Republic"*/!*];

alert(name1); // Julius
alert(name2); // Caesar

*!*
// `rest`의 타입은 배열(Array)입니다.
alert(rest[0]); // Consul
alert(rest[1]); // of the Roman Republic
alert(rest.length); // 2
*/!*
```

`rest`는 나머지 배열 요소가 모두 들어있는 배열입니다. 이제 `rest`에 있는 모든 요소를 index를 이용해 참조할 수 있게 되었습니다. 나머지 값을 가져올 땐, `rest`앞에는 확산 연산자  `"..."`를 붙이고, `...rest`를 가장 마지막에 써줘야 한다는 점을 잊지 마시기 바랍니다.

### 기본값(default values)

할당하고자 하는 변수의 갯수가 분해하고자 하는 배열의 요소갯수보다 많더라도, 에러가 발생하지 않습니다. 값이 없는 경우는 undefined 으로 취급되기 때문입니다.

```js run
*!*
let [firstName, surname] = [];
*/!*

alert(firstName); // undefined
alert(surname); // undefined
```

값이 없을 때 할당해 줄 "기본" 값을 설정해주려면, `=`을 이용하면 됩니다:

```js run
*!*
// 기본 값
let [name = "Guest", surname = "Anonymous"] = ["Julius"];
*/!*

alert(name);    // Julius (배열로부터 받아온 값)
alert(surname); // Anonymous (기본값)
```

배열의 요소 뿐만 아니라, 복잡한 표현식이나 함수도 기본값이 될 수 있습니다. 이 경우는, 값이 없다고 판단된 이후 표현식이 평가되거나 함수가 호출됩니다.

아래는 기본값으로 두개의 `prompt` 함수를 할당 해 주었습니다. 하지만 값이 없는 경우만 함수가 호출 되므로, 함수는 한번만 호출 됩니다:

```js run
// surname의 prompt만 실행됨
let [name = prompt('name?'), surname = prompt('surname?')] = ["Julius"];

alert(name);    // Julius (배열로 부터 받아온 값)
alert(surname); // prompt로부터 받아온 값
```



## 객체 분해하기

구조 분해 할당으로 객체도 분해할 수 있습니다.

기본 문법은 다음과 같습니다:

```js
let {var1, var2} = {var1:…, var2…}
```

오른쪽 피 연산자엔 분해하고자 하는 객체를 써줍니다. 왼쪽 피 연산자엔 객체의 프로퍼티가 할당 될 변수 "패턴(pattern)"을 써줍니다. 가장 간단한 패턴은 `{...}`안에 객체의 프로퍼티 이름과 일치하는 변수 이름을 적어주는 것 입니다.

예:

```js run
let options = {
  title: "Menu",
  width: 100,
  height: 200
};

*!*
let {title, width, height} = options;
*/!*

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
```

프로퍼티 `options.title`, `options.width`, `options.height`의 값은 상응하는 변수에 할당됩니다. 이 때, 순서는 중요하지 않습니다. 아래 코드는 위 코드와 동일하게 동작합니다. 

```js
// let {...} 안의 프로퍼티 순서가 변경됨
let {height, width, title} = { title: "Menu", height: 200, width: 100 }
```

왼쪽 피 연산자의 패턴은 좀 더 복잡해 질 수 있습니다. 프로퍼티와 변수 매핑을 구체적으로 해줄 수 있습니다.

프로퍼티를 프로퍼티 이름과 다른이름을 가진 변수에 저장하고 싶은 경우가 있다 가정해 봅시다. 아래 코드는 `options.width`를 `w`라는 변수에 저장됩니다. 이렇게 변수 이름과 객체의 프로퍼티 이름이 다른 경우는 좌측 피연산사 패턴에 콜론(:)을 사용합니다:

```js run
let options = {
  title: "Menu",
  width: 100,
  height: 200
};

*!*
// { sourceProperty: targetVariable }
let {width: w, height: h, title} = options;
*/!*

// width -> w
// height -> h
// title -> title

alert(title);  // Menu
alert(w);      // 100
alert(h);      // 200
```

콜론은 "sourceProperty: targetVariable"과 같은 형태로 사용합니다. 위 예제에선 프로퍼티 `width`를 변수 `w`에, 프로퍼티 `height`를 변수 `h`에 저장했습니다. `title`은 같은 이름의 변수에 저장됩니다. 

`"="`을 사용하면 누락된 프로퍼티에 대한 기본값을 설정할 수도 있습니다. 아래와 같이 말이죠:

```js run
let options = {
  title: "Menu"
};

*!*
let {width = 100, height = 200, title} = options;
*/!*

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
```

배열이나 함수의 매개변수에서 한 것 처럼, 객체 분해 기본값에도 표현식이나 함수 호출을 할당할 수 있습니다. 이 때, 기본값이 없는 경우에만 표현식이나 함수호출이 평가됩니다.   

아래 코드를 실행하면 width 값만 물어보고, title은 물어보지 않습니다.

```js run
let options = {
  title: "Menu"
};

*!*
let {width = prompt("width?"), title = prompt("title?")} = options;
*/!*

alert(title);  // Menu
alert(width);  // (whatever you the result of prompt is)
```

콜론과 등호를 동시에 사용하는 패턴도 있습니다:

```js run
let options = {
  title: "Menu"
};

*!*
let {width: w = 100, height: h = 200, title} = options;
*/!*

alert(title);  // Menu
alert(w);      // 100
alert(h);      // 200
```

### 나머지 연산자(rest operator)

만약 객체의 프로퍼티 객수가 변수의 갯수보다 많다면 어떨까요? "나머지"를 가져다 어딘가에 할당할 수 있지 않을까요?

생략 부호처럼 생긴 세개의 점으로 만들 수 있는 나머지 연산자는 자바스크립트 명세에서 지원하는 표준이지만, 아직까지 대부분의 브라우저는 이를 지원하지 않습니다.

나머지 연산자는 아래와 같이 생겼습니다:

```js run
let options = {
  title: "Menu",
  height: 200,
  width: 100
};

*!*
let {title, ...rest} = options;
*/!*

// now title="Menu", rest={height: 200, width: 100}
alert(rest.height);  // 200
alert(rest.width);   // 100
```



````smart header="`let`없이 사용하기"
위의 예제에서 변수는 할당 `let {…} = {…}` 바로 직전에 선언되었습니다. 물론, 이미 존재하는 변수를 사용할 수도 있지만, 이때는 주의할 점이 있습니다.

아래 코드는 동작하지 않습니다:
```js run
let title, width, height;

// 이 줄에서 에러가 발생함
{title, width, height} = {title: "Menu", width: 200, height: 100};
```

문제는 자바스크립트가 주요 코드 흐름상에 있는(다른 표현식 안에 있지 않은) `{...}`를 코드 블록으로 다루면서 발생합니다. 이런 코드 블록은 아래와 같이 그룹 문(group statements)처럼 사용됩니다:

```js run
{
  // 코드 블록
  let message = "Hello";
  // ...
  alert( message );
}
```

자바스크립트가 이를 코드블록으로 해석하지 않도록 하게 하려면, 모든 할당문을 `(...)`로 감싸주면 됩니다:

```js run
let title, width, height;

// okay now
*!*(*/!*{title, width, height} = {title: "Menu", width: 200, height: 100}*!*)*/!*;

alert( title ); // Menu
```

````

## 중첩 분해

객체나 배열이 다른 객체나 배열을 포함하는 경우, 중첩 구조 분해를 사용하면 안쪽의 객체나 배열을 추출해 낼 수 있습니다. 

아래 코드에서 `options`은 size 프로퍼티에 다른 객체를 값으로 가지고 있고, `items` 프로퍼티엔 배열이 값으로 저장되어 있습니다. 등호 왼쪽의 구조 분해 패턴은 분해하려는 객체 `options`와 같은 구조를 갖고 있습니다.

```js run
let options = {
  size: {
    width: 100,
    height: 200
  },
  items: ["Cake", "Donut"],
  extra: true    // 분해의 대상이 아닌 기타 요소들
};

// 가시성을 위해 여러 줄에 거쳐 구조 분해 할당 패턴을 작성함
destructuring assignment on multiple lines for clarity
let {
  size: { // put size here
    width,
    height
  },
  items: [item1, item2], // assign items here
  title = "Menu" // 분해 대상 객체엔 없는 값임 (기본 값을 사용함)
} = options;

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
alert(item1);  // Cake
alert(item2);  // Donut
```

`extra`를 제외한 모든 `options`객체 요소가 상응하는 변수에 할당되었습다.

`size`와 `items` 자체는 분해되지 않았다는 점에 유의하길 바랍니다. 

![](destructuring-complex.png)

중첩 구조 분해를 사용해 마침내 `width`, `height`, `item1`, `item2` 변수에 값을 저장하였고, `title`에는 기본값이 할당되었습니다.

That often happens with destructuring assignments. We have a complex object with many properties and want to extract only what we need.

Even here it happens:
```js
// take size as a whole into a variable, ignore the rest
let { size } = options;
```

## Smart function parameters

There are times when a function may have many parameters, most of which are optional. That's especially true for user interfaces. Imagine a function that creates a menu. It may have a width, a height, a title, items list and so on.

Here's a bad way to write such function:

```js
function showMenu(title = "Untitled", width = 200, height = 100, items = []) {
  // ...
}
```

In real-life, the problem is how to remember the order of arguments. Usually IDEs try to help us, especially if the code is well-documented, but still... Another problem is how to call a function when most parameters are ok by default.

Like this?

```js
showMenu("My Menu", undefined, undefined, ["Item1", "Item2"])
```

That's ugly. And becomes unreadable when we deal with more parameters.

Destructuring comes to the rescue!

We can pass parameters as an object, and the function immediately destructurizes them into variables:

```js run
// we pass object to function
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

// ...and it immediately expands it to variables
function showMenu(*!*{title = "Untitled", width = 200, height = 100, items = []}*/!*) {
  // title, items – taken from options,
  // width, height – defaults used
  alert( `${title} ${width} ${height}` ); // My Menu 200 100
  alert( items ); // Item1, Item2
}

showMenu(options);
```

We can also use more complex destructuring with nested objects and colon mappings:

```js run
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

*!*
function showMenu({
  title = "Untitled",
  width: w = 100,  // width goes to w
  height: h = 200, // height goes to h
  items: [item1, item2] // items first element goes to item1, second to item2
}) {
*/!*
  alert( `${title} ${w} ${h}` ); // My Menu 100 200
  alert( item1 ); // Item1
  alert( item2 ); // Item2
}

showMenu(options);
```

The syntax is the same as for a destructuring assignment:
```js
function({
  incomingProperty: parameterName = defaultValue
  ...
})
```

Please note that such destructuring assumes that `showMenu()` does have an argument. If we want all values by default, then we should specify an empty object:

```js
showMenu({});


showMenu(); // this would give an error
```

We can fix this by making `{}` the default value for the whole destructuring thing:


```js run
// simplified parameters a bit for clarity
function showMenu(*!*{ title = "Menu", width = 100, height = 200 } = {}*/!*) {
  alert( `${title} ${width} ${height}` );
}

showMenu(); // Menu 100 200
```

In the code above, the whole arguments object is `{}` by default, so there's always something to destructurize.

## Summary

- Destructuring assignment allows for instantly mapping an object or array onto many variables.
- The object syntax:
    ```js
    let {prop : varName = default, ...} = object
    ```

    This means that property `prop` should go into the variable `varName` and, if no such property exists, then the `default` value should be used.

- The array syntax:

    ```js
    let [item1 = default, item2, ...rest] = array
    ```

    The first item goes to `item1`; the second goes into `item2`, all the rest makes the array `rest`.

- For more complex cases, the left side must have the same structure as the right one.
