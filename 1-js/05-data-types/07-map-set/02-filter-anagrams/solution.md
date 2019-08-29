단어를 글자 단위로 쪼갠 후, 알파벳 순으로 정렬하면 애너그램을 찾을 수 있습니다. 이 과정을 거치면 같은 그룹에 속하는 애너그램이 동일한 단어가 되기 때문입니다.

예시:

```
nap, pan -> anp
ear, era, are -> aer
cheaters, hectares, teachers -> aceehrst
...
```

We'll use the letter-sorted variants as map keys to store only one value per each key:

```js run
function aclean(arr) {
  let map = new Map();

  for (let word of arr) {
    // split the word by letters, sort them and join back
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

Letter-sorting is done by the chain of calls in the line `(*)`.

For convenience let's split it into multiple lines:

```js
let sorted = arr[i] // PAN
  .toLowerCase() // pan
  .split('') // ['p','a','n']
  .sort() // ['a','n','p']
  .join(''); // anp
```

Two different words `'PAN'` and `'nap'` receive the same letter-sorted form `'anp'`.

The next line put the word into the map:

```js
map.set(sorted, word);
```

If we ever meet a word the same letter-sorted form again, then it would overwrite the previous value with the same key in the map. So we'll always have at maximum one word per letter-form.

At the end `Array.from(map.values())` takes an iterable over map values (we don't need keys in the result) and returns an array of them.

Here we could also use a plain object instead of the `Map`, because keys are strings.

That's how the solution can look:

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
