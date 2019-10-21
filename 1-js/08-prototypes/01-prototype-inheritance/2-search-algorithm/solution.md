
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

2. 모던한 엔진에서는 성능 면에서, 객체에서 프로퍼티를 가져오는 것과 객체의 프로토타입에서 프로퍼티를 가져오는 것 사이에 차이가 없습니다. 프로퍼티가 어디서 발견됐는지 기억하고 다음 요청에서 재사용합니다.

    예를 들면, `pockets.glasses`의 경우에 `glasses`(`head`에 있습니다)가 발견된 곳을 기억하고, 다음번에 발견된 곳부터 바로 검색할 것입니다. 어떤 변화가 일어나면 내부 캐시를 업데이트할 만큼 충분히 똑똑해서, 최적화가 안전합니다.
