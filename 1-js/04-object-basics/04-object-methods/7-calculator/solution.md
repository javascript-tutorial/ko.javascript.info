
```js run demo solution
let calculator = {
  sum() {
    return this.a + this.b;
  },

  mul() {
    return this.a * this.b;
  },

  read() {
    this.a = +prompt('첫 번째 값:', 0);
    this.b = +prompt('두 번째 값:', 0);
  }
};

calculator.read();
alert( calculator.sum() );
alert( calculator.mul() );
```
