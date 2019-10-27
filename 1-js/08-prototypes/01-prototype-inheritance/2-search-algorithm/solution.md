
1. `__proto__`를 추가해봅시다.

    ```js run
    let head = {
      glasses: 1
    };

    let table = {
      pen: 3,
      __proto__: head
    };

    let bed = {
      sheet: 1,
      pillow: 2,
      __proto__: table
    };

    let pockets = {
      money: 2000,
      __proto__: bed
    };

    alert( pockets.pen ); // 3
    alert( bed.glasses ); // 1
    alert( table.money ); // undefined
    ```

2. 모던 엔진에선 객체에서 프로퍼티를 가져오는 것과 객체의 프로토타입에서 프로퍼티를 가져오는 것 사이에 성능적인 차이가 없습니다. 모던 엔진은 프로퍼티가 어디서 발견됐는지 기억하고 있다가 다음 요청 시 이 정보를 재사용합니다.

    `pockets.glasses`을 예시로 들어봅시다. 엔진은 `glasses`가 발견된 곳(`head`)을 기억하고 있다가, 다음 요청부턴 이 프로퍼티가 발견된 곳에서 검색을 시작할 겁니다. 모던 엔진은 뭔가 변화가 생기면 내부 캐시를 변경해줄 정도로 똑똑하기 때문에 최적화를 안전하게 수행해줍니다.
