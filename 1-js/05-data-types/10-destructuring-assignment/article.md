# 구조 분해 할당

`객체`와 `배열`은 자바스크립트에서 가장 많이 쓰이는 자료 구조입니다.

객체를 이용하면 키를 가진 데이터 여러개를 하나의 엔티티에 넣을 수 있습니다. 배열은 컬렉션에 데이터를 순서대로 저장할 수 있게 해주죠. 

그런데 함수에 객체나 배열을 전달할 때, 객체나 배열에 저장된 데이터 전체를 사용하는 것이 아니라 일부만 사용하는 경우가 있습니다.

이럴 때 *구조 분해 할당(destructuring assignment)* 을 사용하면 객체나 배열을 변수로 "분해"할 수 있습니다. 이 외에도 매개변수가 많거나 매개변수의 기본값이 필요한 경우 등에서 구조 분해는 그 진가를 발휘합니다.

## 배열 분해하기

배열이 어떻게 변수로 분해되는지 예제를 통해 살펴봅시다.

```js
// 이름과 성을 요소로 가진 배열
let arr = ["Ilya", "Kantor"]

*!*
// 구조 분해 할당을 이용해
// firstName엔 arr[0]을(firstName = arr[0]),
// surname엔 arr[1]을(surname = arr[1]) 할당하였습니다.
let [firstName, surname] = arr;
*/!*

alert(firstName); // Ilya
alert(surname);  // Kantor
```

배열 분해를 이용해 배열에 담긴 이름과 성을 변수에 할당했습니다.

`split`과 같이 배열을 반환해주는 메서드를 배열 분해와 함께 사용하는 것도 좋습니다.

```js
let [firstName, surname] = "Ilya Kantor".split(' ');
```

````smart header="\"분해(destructuring)\"는 \"파괴(destructive)\"를 수반하지 않습니다."
구조 분해 할당이란 명칭은 분해하고자 하는 배열을 복사해서 변수로 "분해(destructurizes)"해주는 특징 때문에 생겼습니다. 이 과정에서 기존 배열은 수정(또는 파괴)되지 않습니다.

배열 요소를 직접 변수에 할당하는 것보다 코드가 짧다는 점만 다릅니다.
```js
// let [firstName, surname] = arr;
let firstName = arr[0];
let surname = arr[1];
```
````

````smart header="쉼표를 사용하여 요소 무시하기"
여분의 쉼표를 사용하면 필요하지 않은 배열 요소를 버릴 수 있습니다.

```js run
*!*
// 두 번째 요소는 불필요함
let [firstName, , title] = ["Julius", "Caesar", "Consul", "of the Roman Republic"];
*/!*

alert( title ); // Consul
```

위 코드에서 두 번째 요소는 걸러졌지만, 세 번째 요소는 `title`이라는 변수에 저장된 것을 확인할 수 있습니다. (할당할 변수가 없기 때문에) 그 이외 요소도 역시 걸러졌습니다.
````

````smart header="우측엔 모든 이터러이 올 수 있습니다."

배열뿐만 아니라 모든 이터러블(iterable) 객체에 구조 분해 할당을 적용할 수 있습니다.

```js
let [a, b, c] = "abc"; // ["a", "b", "c"]
let [one, two, three] = new Set([1, 2, 3]);
```

````


````smart header="왼쪽 피연산자엔 뭐든지 들어갑니다"

좌측엔 "할당할 수 있는(assignables)" 것이라면 모든 걸 넣을 수 있습니다.

아래와 같이 객체 프로퍼티도 가능합니다.
```js run
let user = {};
[user.name, user.surname] = "Ilya Kantor".split(' ');

alert(user.name); // Ilya
```

````

````smart header=".entries()로 반복하기"

[Object.entries(obj)](mdn:js/Object/entries) 메서드는 이전 챕터에서 학습한 바 있습니다. 

이 메서드를 활용하면 객체의 키와 값을 순회하여, 키와 값을 변수로 분해할 수 있습니다.

```js run
let user = {
  name: "John",
  age: 30
};

// 객체의 키와 값 순회하기
*!*
for (let [key, value] of Object.entries(user)) {
*/!*
  alert(`${key}:${value}`); // name:John 출력, 그다음 age:30 출력
}
```

맵에도 물론 이 메서드를 활용할 수 있습니다:

```js run
let user = new Map();
user.set("name", "John");
user.set("age", "30");

*!*
for (let [key, value] of user) {
*/!*
  alert(`${key}:${value}`); // name:John, then age:30
}
```
````
### '...'로 나머지 값 가져오기

배열의 앞쪽에 위치한 요소 몇 개를 변수에 저장하고, 그 이후 이어지는 나머지 요소들을 한데 모아서 저장해야 할 경우가 있습니다. 이럴 때 `"..."`같이 세 개의 점이 이어지는 연산자(역주: 확산 연산자 또는 전개 연산자)가 앞에 붙은 매개변수를 사용하면 "나머지(rest)" 요소들을 가져올 수 있습니다.

```js run
let [name1, name2, *!*...rest*/!*] = ["Julius", "Caesar", *!*"Consul", "of the Roman Republic"*/!*];

alert(name1); // Julius
alert(name2); // Caesar

*!*
// `rest`는 배열(Array)타입 입니다.
alert(rest[0]); // Consul
alert(rest[1]); // of the Roman Republic
alert(rest.length); // 2
*/!*
```

나머지 배열 요소들은 `rest`라는 변수에 배열 형태로 저장됩니다. `rest` 대신에 다른 이름의 변수를 사용해도 됩니다. 다만, 변수 앞에 확산 연산자  `"..."`가 있어야 하고, 이 변수를 가장 마지막에 써줘야 한다는 점을 잊지 마시기 바랍니다

### 기본값

할당하고자 하는 변수의 개수가 분해하고자 하는 배열의 요소 개수보다 많더라도, 에러가 발생하지 않습니다. 값이 없는 경우는 undefined로 취급되기 때문입니다.

```js run
*!*
let [firstName, surname] = [];
*/!*

alert(firstName); // undefined
alert(surname); // undefined
```

값이 없을 때 할당해 줄 "기본값(default values)"을 설정해주려면, `=`을 이용하면 됩니다.

```js run
*!*
// 기본 값
let [name = "Guest", surname = "Anonymous"] = ["Julius"];
*/!*

alert(name);    // Julius (배열로부터 받아온 값)
alert(surname); // Anonymous (기본값)
```

복잡한 표현식이나 함수 호출도 기본값으로 설정할 수 있습니다. 값이 없는 경우 표현식이 평가되거나 함수가 호출됩니다.

아래는 기본값으로 두 개의 `prompt` 함수를 할당해 주었습니다. 값이 제공되지 않은 경우만 함수가 호출되므로, 함수 호출은 한 번만 이뤄집니다.

```js run
// surname의 prompt만 실행됨
let [name = prompt('name?'), surname = prompt('surname?')] = ["Julius"];

alert(name);    // Julius (배열로 부터 받아온 값)
alert(surname); // prompt로부터 받아온 값
```



## 객체 분해하기

구조 분해 할당으로 객체도 분해할 수 있습니다.

기본 문법은 다음과 같습니다.

```js
let {var1, var2} = {var1:…, var2…}
```

우측엔 분해하고자 하는 객체를 써줍니다. 좌측엔 상응하는 객체 프로퍼티의 "패턴(pattern)"을 써줍니다. 아래 예시에선 `{...}`안에 객체 프로퍼티 키와 동일한 변수 이름을 패턴으로 사용했습니다.

예시:

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

프로퍼티 `options.title`, `options.width`, `options.height`는 상응하는 변수에 할당되었습니다. 이때, 순서는 중요하지 않습니다. 아래 코드는 위 코드와 동일하게 동작합니다. 

```js
// let {...} 안의 순서가 변경됨
let {height, width, title} = { title: "Menu", height: 200, width: 100 }
```

좌측에 사용되는 패턴은 좀 더 복잡해질 수 있습니다. 또한 프로퍼티와 변수 매핑을 구체적으로 해줄 수 있습니다.

객체 프로퍼티를 프로퍼티 키와 다른 이름을 가진 변수에 저장하고 싶은 경우가 있다고 가정해 봅시다. 가령 `options.width`를 `w`라는 변수에 저장하고 싶은 경우 말이죠. 이럴 땐, 좌측 피연산자 패턴에 콜론(:)을 사용하면 됩니다.

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

콜론은 "해당 프로퍼티: 저장하려는 변수 이름" 같은 형태로 사용합니다. 위 예제에선 프로퍼티 `width`를 변수 `w`에, 프로퍼티 `height`를 변수 `h`에 저장했습니다. `title`은 동일한 이름을 가진 변수에 저장됩니다. 

`"="`을 사용하면 프로퍼티가 없을 경우에 대한 기본값을 설정할 수도 있습니다. 아래와 같이 말이죠.

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

배열이나 함수의 매개변수처럼, 표현식이나 함수 호출을 기본값에 할당할 수 있습니다. 이때, 기본값이 없는 경우에만 표현식이나 함수 호출이 평가됩니다.   

아래 코드를 실행하면 width 값만 물어보고, title 값은 물어보지 않습니다.

```js run
let options = {
  title: "Menu"
};

*!*
let {width = prompt("width?"), title = prompt("title?")} = options;
*/!*

alert(title);  // Menu
alert(width);  // prompt로부터 받아온 값
```

콜론과 등호를 동시에 사용하여 패턴을 만들 수도 있습니다.

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

### 나머지 패턴 "..."

만약 분해하려는 객체의 프로퍼티 개수가 할당하려는 변수의 개수보다 많다면 어떨까요? "나머지"를 어딘가에 할당하면 좋지 않겠냐는 라는 생각이 들지 않으시나요?

세 개의 점으로 만들 수 있는 나머지 패턴(rest pattern)를 사용하면 가능합니다. 다만, 모던 브라우저는 이 패턴을 지원하지만 몇몇 구식 브라우저(IE, 바벨(Babel)을 이용해 폴리필 할 수 있음)는 이를 지원하지 않는다는 점에 유의하셔야 합니다.

나머지 연산자는 아래와 같이 생겼습니다.

```js run
let options = {
  title: "Menu",
  height: 200,
  width: 100
};

*!*
// title = 이름이 title인 프로퍼티
// rest = 나머지 프로퍼티들
let {title, ...rest} = options;
*/!*

// now title="Menu", rest={height: 200, width: 100}
alert(rest.height);  // 200
alert(rest.width);   // 100
```



````smart header="`let` 없이 사용하기"
위 예제에서 변수들은 할당 연산 `let {…} = {…}` 안에서 선언되었습니다. `let`을 사용하지 않고 기존에 있던 변수에 분해한 값을 할당할 수도 있는데, 이때는 주의할 점이 있습니다.

아래 코드는 동작하지 않습니다.
```js run
let title, width, height;

// 아래 줄에서 에러가 발생합니다.
{title, width, height} = {title: "Menu", width: 200, height: 100};
```

문제는 자바스크립트가 (표현식 안에 있지 않으면서) 주요 코드 흐름상에 있는 `{...}`를 코드 블록으로 인식하기 때문에 발생합니다. 코드 블록은 아래와 같이 구문(statement)을 묶는 데 사용됩니다.

```js run
{
  // 코드 블록
  let message = "Hello";
  // ...
  alert( message );
}
```

자바스크립트가 이를 코드 블록으로 해석하지 않도록 하게 하려면, 할당문을 괄호`(...)`로 감싸 자바스크립트가 이를 표현식의 일부라고 생각하도록 만들면 됩니다.

```js run
let title, width, height;

// 에러가 발생하지 않습니다.
*!*(*/!*{title, width, height} = {title: "Menu", width: 200, height: 100}*!*)*/!*;

alert( title ); // Menu
```

````

## 중첩 구조 분해(Nested Destructuring)

객체나 배열이 다른 객체나 배열을 포함하는 경우, 좌측에 좀 더 복잡한 패턴을 사용하면 안쪽의 객체나 배열을 추출할 수 있습니다. 

아래 코드에서 `options`는 size 프로퍼티에 다른 객체를 값으로 가지고 있고, `items` 프로퍼티엔 배열을 값으로 가지고 있습니다. 대입 연산자 좌측의 패턴은 분해하려는 객체 `options`와 같은 구조를 갖고 있습니다.

```js run
let options = {
  size: {
    width: 100,
    height: 200
  },
  items: ["Cake", "Donut"],
  extra: true    // 분해의 대상이 아닌 기타 요소
};

// 여러 줄에 걸쳐 구조 분해 할당을 사용해 의도하는 바를 명확히 드러냄
let {
  size: { // size는 여기,
    width,
    height
  },
  items: [item1, item2], // items는 여기에 할당함
  title = "Menu" // 분해하려는 객체엔 없음 (기본값을 사용함)
} = options;

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
alert(item1);  // Cake
alert(item2);  // Donut
```

패턴에 없는 `extra`를 제외한 모든 `options` 객체의 프로퍼티가 상응하는 변수에 할당된 것을 확인할 수 있습니다.

여기서 주의할 점은 `size`와 `items`는 분해되지 않았다는 점입니다.

![](destructuring-complex.png)

변수 `width`, `height`, `item1`, `item2`에 값이 저장되었습니다. 변수 `title`은 기본값을 통해 그 값을 할당받았습니다.

이렇게 객체 프로퍼티 일부에만 구조분해 할당을 적용하는 것은 꽤 자주 있는 일입니다. 프로퍼티가 많은 복잡한 객체에서 일부 필요한 프로퍼티만 사용하고 싶을 때가 있기 때문입니다.  

```js
// size만 변수에 할당하고 나머지 프로퍼티들은 전부 무시함
let { size } = options;
```

## 똑똑한 함수 매개변수

함수에 매개변수가 많은데, 이중 상당수는 선택적으로 쓰이는 경우가 있습니다. 사용자 인터페이스에 관한 함수에서 이런 상황을 자주 볼 수 있죠. 메뉴를 만들어주는 함수가 있다고 가정해 봅시다. 메뉴엔 너비, 높이, 제목, 항목 리스트 등이 필요하기 때문에 이 정보는 매개변수로 받습니다.

아래 메뉴를 만들어주는 함수는 좋지 방법으로 작성되었습니다.

```js
function showMenu(title = "Untitled", width = 200, height = 100, items = []) {
  // ...
}
```

이렇게 함수를 작성하면 인수의 순서 때문에 문제가 발생합니다. 문서화가 잘 되어있는 코드의 경우, IDE가 인수의 순서가 틀리지 않도록 도움을 주긴 합니다. 하지만 대부분의 매개변수에 기본값이 설정되어 있어서 인수가 없어도 되는 경우 문제가 발생합니다.  

아래 코드가 보이시나요?

```js
showMenu("My Menu", undefined, undefined, ["Item1", "Item2"])
```

꽤나 깔끔하지 못해보이네요. 매개변수 개수가 더 많았다면 가독성은 더 떨어졌을 겁니다. 

구조 분해는 이럴 때 구세주가 됩니다.

매개변수를 객체로 전달하면 되죠. 함수는 전달받은 객체를 즉시 분해하여 변수에 할당합니다.  

```js run
// 함수에 전달할 객체
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

// 전달받은 객체를 즉시 변수에 할당함
function showMenu(*!*{title = "Untitled", width = 200, height = 100, items = []}*/!*) {
  // title, items – 객체 options 에서 가져옴
  // width, height – 기본값
  alert( `${title} ${width} ${height}` ); // My Menu 200 100
  alert( items ); // Item1, Item2
}

showMenu(options);
```

중첩 객체와 콜론을 함께 사용하면 좀 더 복잡한 구조분해도 가능합니다.

```js run
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

*!*
function showMenu({
  title = "Untitled",
  width: w = 100,  // width는 w로,
  height: h = 200, // height는 h로,
  items: [item1, item2] // items의 첫번째 요소는 item1으로, 두번째 요소는 item2로
}) {
*/!*
  alert( `${title} ${w} ${h}` ); // My Menu 100 200
  alert( item1 ); // Item1
  alert( item2 ); // Item2
}

showMenu(options);
```

매개변수 구조 분해 문법은 구조분해 할당과 같습니다.
```js
function({
  객체프로퍼티: 매개변수이름 = 기본값
  ...
})
```

구조분해시 `showMenu()`에는 인수가 전달된다고 가정되는것에 유의해 주셔야 합니다. 만약 모든 인수에 기본값을 할당해 주려면 빈 객체를 명시적으로 전달하면 됩니다.

```js
showMenu({});


showMenu(); // 에러가 발생할 수 있습니다
```

전체 구조 분해에 `{}`를 기본값으로 만들면 이 문제를 해결할 수 있습니다.


```js run
// 설명의 명료성을 위해 매개변수를 단순화 함
function showMenu(*!*{ title = "Menu", width = 100, height = 200 } = {}*/!*) {
  alert( `${title} ${width} ${height}` );
}

showMenu(); // Menu 100 200
```

위 코드에서 전체 인수 객체의 기본값은 `{}`입니다. 어떤 경우든 분해할 것이 있기 때문에 함수에 인수를 하나도 전달하지 않아도 에러가 발생하지 않습니다.

## 요약

- 구조 분해 할당을 사용하면 객체나 배열을 변수로 매핑할 수 있습니다.
- 객체 분해하기:
    ```js
    let {prop : varName = default, ...rest} = object
    ```

    객체 object의 프로퍼티 `prop`은 변수 `varName`으로 매핑되고, 만약 객체에 이 프로퍼티가 없는 경우엔 `default` 값이 쓰입니다.

    매핑할 변수가 없는 나머지 프로퍼티들은 객체 `rest`에 복사됩니다.

- 배열 분해하기:

    ```js
    let [item1 = default, item2, ...rest] = array
    ```

    배열 array의 첫 번째 요소는 변수 `item1`으로, 두 번째 요소는 변수 `item2`으로 매핑되고, 배열의 나머지 요소들은 `rest`라는 배열에 저장됩니다.

- 구조가 복잡한 경우엔, 좌측과 우측의 구조 패턴이 같아야 합니다.