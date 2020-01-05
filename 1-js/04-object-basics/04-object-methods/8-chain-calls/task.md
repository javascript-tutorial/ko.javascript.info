importance: 2

---

# 체이닝

올라가기와 내려가기 메서드를 제공하는 객체 `ladder`가 있다고 합시다.

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

만일 메서드를 연이어 호출하고자 한다면 아래와 같이 코드를 작성할 수 있습니다.

```js
ladder.up();
ladder.up();
ladder.down();
ladder.showStep(); // 1
```

아래와 같이 메서드 호출 체이닝이 가능하도록 `up`, `down`, `showStep`을 수정해보세요.

```js
ladder.up().up().down().showStep(); // 1
```

이러한 방식은 자바스크립트 라이브러리에서 널리 사용됩니다.
