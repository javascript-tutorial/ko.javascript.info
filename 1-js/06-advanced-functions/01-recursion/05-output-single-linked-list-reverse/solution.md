# Using a recursion
# 재귀 사용하기

The recursive logic is a little bit tricky here.

We need to first output the rest of the list and *then* output the current one:
재귀 논리는 여기에서 약간 까다 롭습니다.

먼저 나머지리스트를 출력 한 *다음* 현재리스트를 출력해야합니다 :

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

function printReverseList(list) {

  if (list.next) {
    printReverseList(list.next);
  }

  alert(list.value);
}

printReverseList(list);
```

# Using a loop
# 루프 사용하기

The loop variant is also a little bit more complicated then the direct output.

There is no way to get the last value in our `list`. We also can't "go back".

So what we can do is to first go through the items in the direct order and remember them in an array, and then output what we remembered in the reverse order:


루프 변형은 직접 출력보다 약간 더 복잡합니다.

`list`에서 마지막 값을 얻는 방법은 없습니다. 우리는 또한 "돌아갈"수 없습니다.

따라서 우리가 할 수있는 일은 먼저 직접 순서대로 항목을 살펴보고 배열로 기억 한 다음 기억 한 것을 역순으로 출력하는 것입니다.

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

function printReverseList(list) {
  let arr = [];
  let tmp = list;

  while (tmp) {
    arr.push(tmp.value);
    tmp = tmp.next;
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    alert( arr[i] );
  }
}

printReverseList(list);
```

Please note that the recursive solution actually does exactly the same: it follows the list, remembers the items in the chain of nested calls (in the execution context stack), and then outputs them. 
재귀 솔루션은 실제로 정확히 동일합니다. 이는 목록을 따르고 (실행 컨텍스트 스택에서) 중첩 호출 체인의 항목을 기억 한 다음 출력합니다.