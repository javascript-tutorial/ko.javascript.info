단어를 글자 단위로 쪼갠 후, 알파벳 순으로 정렬하면 애너그램을 찾을 수 있습니다. 이 과정을 거치면 같은 그룹에 속하는 애너그램이 동일한 단어가 되기 때문입니다.

예시:

```
nap, pan -> anp
ear, era, are -> aer
cheaters, hectares, teachers -> aceehrst
...
```

알파벳 순으로 정렬된 글자를 맵의 키로 사용해, 키 하나엔 값 하나만 저장되도록 하겠습니다.

```js run
function aclean(arr) {
  let map = new Map();

  for (let word of arr) {
    // 단어를 글자 단위로 쪼갠 후, 알파벳 순으로 정렬한 다음에 다시 합칩니다.
*!*
    let sorted = word.toLowerCase().split('').sort().join(''); // (*)
*/!*
    map.set(sorted, word);
  }

  return Array.from(map.values());
}

let arr = ["nap", "teachers", "cheaters", "PAN", "ear", "era", "hectares"];

alert( aclean(arr) );
```

`(*)`로 표시한 줄에서 여러 메서드를 체이닝 해 글자를 정렬해 보았습니다.

`(*)`로 표시한 줄을 여러 줄에 나눠서 작성하면 아래와 같은 코드가 됩니다.

```js
let sorted = word // PAN
  .toLowerCase() // pan
  .split('') // ['p','a','n']
  .sort() // ['a','n','p']
  .join(''); // anp
```

`'PAN'`과 `'nap'`은 동일하게 `'anp'`라는 글자로 정렬되죠.

아래 코드는 단어를 맵에 저장합니다.

```js
map.set(sorted, word);
```

정렬 이후의 글자 구성이 같은 단어를 또다시 만나게 되면, 키가 동일하므로 값이 덮어씌워 집니다. 따라서 맵엔 글자 구성이 같은 단어는 단 한 번만 저장됩니다.

함수 마지막 줄의 `map.values()`는 맵의 값을 담은 반복 가능한 객체를 반환하는데, `Array.from`은 이 반복 가능한 객체를 배열로 바꿔줍니다(키는 필요하지 않기 때문에 `map.values()`를 사용함).

이 문제에서 키는 문자형이므로 `맵` 대신 일반적인 객체를 사용할 수도 있습니다.

객체를 사용한 해답은 아래와 같습니다.

```js run demo
function aclean(arr) {
  let obj = {};

  for (let i = 0; i < arr.length; i++) {
    let sorted = arr[i].toLowerCase().split("").sort().join("");
    obj[sorted] = arr[i];
  }

  return Object.values(obj);
}

let arr = ["nap", "teachers", "cheaters", "PAN", "ear", "era", "hectares"];

alert( aclean(arr) );
```
