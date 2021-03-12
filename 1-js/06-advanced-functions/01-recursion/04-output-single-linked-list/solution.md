# 반복문을 기반으로 하는 방법

반복문을 사용한 답안은 다음과 같습니다.

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

여기서 주목해야 할 점은 리스트를 임시 변수 `tmp`에 저장하고 사용했다는 것입니다. 아래처럼 매개변수 `list`를 그대로 사용해도 되는데 말이죠.

```js
function printList(list) {

  while(*!*list*/!*) {
    alert(list.value);
    list = list.next;
  }

}
```

그런데 매개변수 `list`를 바로 사용하는 건 그다지 현명한 선택은 아닙니다. 나중에 함수를 확장할 때 `list`를 가지고 뭔가 해야 하는 경우가 생길 수 있기 때문이죠. 어떤 일 때문인지는 몰라도 `while`문 앞에서 `list`가 변경되면 우리가 짠 코드는 제대로 동작하지 않을 겁니다.

좋은 변수명이 무엇인가를 생각해 봤을 때도 리스트를 임시 변수 `tmp`에 저장하는 게 좋습니다. `list`에는 리스트 그 자체가 저장되어있는 게 좋죠.

`tmp`는 리스트를 순회하기 위한 용도로 쓰였기 때문에 `tmp`라고 명명하는 게 좋습니다. `for`문의 `i`처럼 말이죠.

# 재귀를 기반으로 하는 방법

재귀를 사용해 만든 `printList(list)`는 아주 간단한 로직을 기반으로 합니다. "리스트를 출력할 때는 현재 요소 `list`를 출력하고, 같은 방법을 사용해 `list.next`를 출력한다."라는 로직이죠.

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

  alert(list.value); // 현재 요소를 출력합니다.

  if (list.next) {
    printList(list.next); // 같은 방법을 사용해 나머지 요소를 출력합니다.
  }

}

printList(list);
```

이제 두 방법을 비교해봅시다.

반복문을 사용하면 리소스를 좀 더 효율적으로 사용합니다. 두 방법의 반환 값은 같지만, 반복문을 사용한 방법에선 중첩 함수를 호출하는데 추가적인 리소스를 쓰지 않기 때문입니다. 

반면 재귀를 사용한 방법은 코드 길이가 짧고 이해하기 쉽다는 장점이 있습니다.
