importance: 5

---

# 왜 햄스터 두 마리 모두 배가 꽉 찼을까요

`hamster` 객체를 상속받는 햄스터 `speedy`와 `lazy`가 있다고 가정해봅시다.

둘 중 한 마리에게만 먹이를 줘도, 다른 한 마리의 배 역시 꽉 찹니다. 왜 그럴까요? 어떻게 하면 이런 이상한 일이 일어나지 않게 할 수 있을까요?

```js run
let hamster = {
  stomach: [],

  eat(food) {
    this.stomach.push(food);
  }
};

let speedy = {
  __proto__: hamster
};

let lazy = {
  __proto__: hamster
};

// 햄스터 speedy가 음식을 먹습니다.
speedy.eat("apple");
alert( speedy.stomach ); // apple

// 햄스터 lazy는 음식을 먹지 않았는데 배에 apple이 있다고 나오네요. 왜 그럴까요? lazy는 배가 비어있도록 고쳐주세요.
alert( lazy.stomach ); // apple
```

