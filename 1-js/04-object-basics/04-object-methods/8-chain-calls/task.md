importance: 2

---

# 체이닝

<<<<<<< HEAD
올라가기(`up`)와 내려가기(`down`) 메서드를 제공하는 객체 `ladder`가 있습니다.
=======
There's a `ladder` object that allows you to go up and down:
>>>>>>> 34a80e70f8cce5794be259d25f815d7a7db7cbe3

```js
let ladder = {
  step: 0,
  up() { 
    this.step++;
  },
  down() { 
    this.step--;
  },
  showStep: function() { // 사다리에서 몇 번째 단에 올라와 있는지 보여줌
    alert( this.step );
  }
};
```

<<<<<<< HEAD
메서드를 연이어 호출하고자 한다면 아래와 같이 코드를 작성할 수 있습니다.
=======
Now, if we need to make several calls in sequence, we can do it like this:
>>>>>>> 34a80e70f8cce5794be259d25f815d7a7db7cbe3

```js
ladder.up();
ladder.up();
ladder.down();
ladder.showStep(); // 1
ladder.down();
ladder.showStep(); // 0
```

<<<<<<< HEAD
`up`, `down`, `showStep`을 수정해 아래처럼 메서드 호출 체이닝이 가능하도록 해봅시다.
=======
Modify the code of `up`, `down`, and `showStep` to make the calls chainable, like this:
>>>>>>> 34a80e70f8cce5794be259d25f815d7a7db7cbe3

```js
ladder.up().up().down().showStep().down().showStep(); // shows 1 then 0
```

<<<<<<< HEAD
참고로 이런 방식은 자바스크립트 라이브러리에서 널리 사용됩니다.
=======
Such an approach is widely used across JavaScript libraries.
>>>>>>> 34a80e70f8cce5794be259d25f815d7a7db7cbe3
