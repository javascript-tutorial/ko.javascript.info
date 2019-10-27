importance: 5

---

# 왜 햄스터 두 마리의 배가 꽉 찰까요?

두 마리의 햄스터가 있습니다. 일반적인 `hamster` 객체로부터 상속받은 `speedy`와 `lazy` 입니다.

둘 중 한 마리에게 먹이를 줬을 때, 다른 한 마리도 배가 꽉 찹니다. 왜 그럴까요? 어떻게 고칠까요?

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

// 햄스터 한 마리가 음식을 찾았습니다.
speedy.eat("apple");
alert( speedy.stomach ); // apple

// 이 햄스터도 같은 음식을 가지고 있습니다. 왜 그럴까요? 고쳐주세요.
alert( lazy.stomach ); // apple
```

