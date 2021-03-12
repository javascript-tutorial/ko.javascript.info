# 재귀를 기반으로 하는 방법

재귀를 사용한 방법은 조금 까다롭습니다.

리스트의 나머지 요소들을 출력한 *다음에* 현재 요소를 출력해야 하죠.

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

# 반복문을 기반으로 하는 방법

리스트를 원래 순서대로 출력하는 방법보다 역시 까다롭습니다.

`list`의 마지막 값을 바로 구할 수 있는 방법이 없기 때문입니다. 마지막 값을 시작으로 '역행'할 수 없는 상황이죠.

따라서 우리는 원래 순서대로 요소들을 하나씩 거슬러 올라가면서 각 요소를 배열에 저장해 놓고, 마지막 요소에 도달했을 때 배열에 저장된 요소들을 거꾸로 출력하는 방법을 사용할 수 있을 겁니다.

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

여기서 주목할 점은 재귀를 사용한 방법과 반복문을 사용한 방법이 완전히 동일한 접근 방식을 취했다는 것입니다. 리스트를 앞에서부터 따라가면서 각 요소를 실행 컨텍스트 스택에 저장해 놓았다가 스택 맨 위에서부터 요소를 차례대로 출력하였습니다.
