# 루프를 이용한 방법

루프를 기반에 두고 변형한 해결방법은 다음과 같습니다.

```js run
let list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};

function printList(list) {
  let tmp = list;

  while (tmp) {
    alert(tmp.value);
    tmp = tmp.next;
  }

}

printList(list);
```

Please note that we use a temporary variable `tmp` to walk over the list. Technically, we could use a function parameter `list` instead:
목록을 살펴보기 위해 임시 변수 `tmp`를 사용한다는 점에 유의하십시오. 기술적으로 함수 매개 변수 `list` 를 대신 사용할 수 있습니다.

```js
function printList(list) {

  while(*!*list*/!*) {
    alert(list.value);
    list = list.next;
  }

}
```

...But that would be unwise. In the future we may need to extend a function, do something else with the list. If we change `list`, then we lose such ability.

Talking about good variable names, `list` here is the list itself. The first element of it. And it should remain like that. That's clear and reliable.

From the other side, the role of `tmp` is exclusively a list traversal, like `i` in the `for` loop.


그러나 그것은 현명하지 않을 것입니다. 앞으로 함수를 확장하고 목록으로 다른 작업을 수행해야 할 수도 있습니다. `list` 을 바꾸면 그러한 능력을 잃게됩니다.

좋은 변수 이름에 대해 이야기하면 여기에 `list` 가 있습니다. 그것의 첫 번째 요소. 그리고 그렇게 남아 있어야합니다. 명확하고 신뢰할 수 있습니다.

다른면에서 `tmp` 의 역할은 전적으로 `for` 루프의 `i` 와 같은 목록 순회입니다.

# Recursive solution
# 재귀적인 해결방법

The recursive variant of `printList(list)` follows a simple logic: to output a list we should output the current element `list`, then do the same for `list.next`:
`printList (list)`의 재귀 변형은 간단한 논리를 따릅니다.리스트를 출력하려면 현재 요소 `list` 를 출력 한 다음` list.next` 에 대해서도 동일하게 수행해야합니다.

```js run
let list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};

function printList(list) {

  alert(list.value); // 현재 아이템을 출력합니다

  if (list.next) {
    printList(list.next); // list 안의 나머지 값들에 대해 똑같은 처리를 합니다
  }

}

printList(list);
```

Now what's better?

Technically, the loop is more effective. These two variants do the same, but the loop does not spend resources for nested function calls.

From the other side, the recursive variant is shorter and sometimes easier to understand.

이제 더 좋은게 뭐야?

기술적으로 루프가 더 효과적입니다. 이 두 변형은 동일하지만 루프는 중첩 된 함수 호출에 자원을 소비하지 않습니다.

반면에 재귀 변형은 더 짧고 때로는 이해하기 쉽습니다.
