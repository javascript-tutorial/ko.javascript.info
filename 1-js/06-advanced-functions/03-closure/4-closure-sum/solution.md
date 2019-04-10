For the second parentheses to work, the first ones must return a function.

Like this:

```js run
function sum(a) {

  return function(b) {
    return a + b; // takes "a" from the outer 렉시컬 환경
  };

}

alert( sum(1)(2) ); // 3
alert( sum(5)(-1) ); // 4
```

