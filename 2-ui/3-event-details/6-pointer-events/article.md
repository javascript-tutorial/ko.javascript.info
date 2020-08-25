# 포인터 이벤트

포인터 이벤트는 마우스, 펜·스타일러스, 터치스크린 등과 같은 다양한 포인팅 장치에서 나오는 입력을 다루기 위한 최신 방법입니다.

## 역사

일반적으로 다른 이벤트 타입 사이에서 포인터 이벤트가 처한 상황을 이해할 수 있도록 간략하게 살펴보겠습니다.

- 꽤 오래전 과거에는 마우스 이벤트만 있었습니다.

    그러다 터치 기기가 등장합니다. 기존 코드가 동작하기 위해서 새로운 기기도 마우스 이벤트를 일으키도록 했습니다. 두드리는 동작(tapping)이 `mousedown`을 생성하는 것처럼 말이죠. 하지만 터치 기기가 여러 측면에서 더 강력한 점이 있기 때문에 마우스 이벤트만으로는 충분하지 않았습니다. 예를 들어 터치 기기는 한 번에 여러 지점을 터치할 수 있지만 마우스 이벤트에는 이런 동작을 위한 프로퍼티가 없습니다.

- 그래서 터치 관련 프로퍼티를 가지는 `touchstart`, `touchend`, `touchmove`가 도입되었습니다. (포인터 이벤트가 더 낫기 때문에 여기서 자세히 다루지 않습니다)

    그런데도 펜과 같이 다른 장치들은 자신만의 특징을 지니고 있기 때문에 터치 이벤트로는 충분하지 않았습니다. 또한 터치 이벤트와 마우스 이벤트에 모두 반응하는 코드를 작성하는 것도 번거로웠습니다.

- 이러한 문제를 해결하기 위해 새로운 표준 포인터 이벤트가 도입되었습니다. 포인터 이벤트는 모든 종류의 포인팅 기기에 대한 단일 이벤트 집합을 제공합니다.

현재 [포인터 이벤트 레벨2](https://www.w3.org/TR/pointerevents2/) 사양은 모든 주요 브라우저에서 지원되는 반면, [포인터 이벤트 레벨3](https://w3c.github.io/pointerevents/)은 작업이 진행되고 있습니다. Internet Explorer, Safari 12 또는 그 이하 버전에 맞게끔 코딩하지 않는 한 더는 마우스나 터치 이벤트를 사용할 필요가 없습니다. 포인터 이벤트로 전환할 수 있습니다.

말하자면, 올바르게 사용하고 놀라지 않기 위해 알아야 할 몇 가지 중요한 특성이 있습니다. 이번 글에서 이 특성들을 다루겠습니다.

## 포인터 이벤트 타입

포인터 이벤트는 마우스 이벤트와 유사하게 명명되었습니다.

| 포인터 이벤트 | 마우스 이벤트 |
|---------------|-------------|
| `pointerdown` | `mousedown` |
| `pointerup` | `mouseup` |
| `pointermove` | `mousemove` |
| `pointerover` | `mouseover` |
| `pointerout` | `mouseout` |
| `pointerenter` | `mouseenter` |
| `pointerleave` | `mouseleave` |
| `pointercancel` | - |
| `gotpointercapture` | - |
| `lostpointercapture` | - |

표에서 볼 수 있듯이 모든 `mouse<event>`와 유사한 역할을 하는 `pointer<event>`가 있습니다. 또한 연관된 `mouse...`가 없는 포인터 이벤트도 세 개 더 있습니다. 해당 이벤트들은 곧 설명하겠습니다.

```smart header="코드에서 `mouse<event>`를 `pointer<event>`로 바꾸기"
코드에서 `mouse<event>` 이벤트를 `pointer<event>`로 대체할 수 있고 마우스에서 문제가 없을 것으로 예상할 수 있습니다.

터치 기기에 대한 지원도 '마법처럼' 향상되지만, 아마도 CSS에 `touch-action: none`을 추가해야 합니다. `pointercancel`에 대한 자세한 내용은 아래 절에서 확인할 수 있습니다.
```

## Pointer event properties

Pointer events have the same properties as mouse events, such as `clientX/Y`, `target`, etc., plus some others:

- `pointerId` - the unique identifier of the pointer causing the event.
    
    Allows us to handle multiple pointers, such as a touchscreen with stylus and multi-touch (explained below).
- `pointerType` - the pointing device type. Must be a string, one of: "mouse", "pen" or "touch". 

    We can use this property to react differently on various pointer types.
- `isPrimary` - `true` for the primary pointer (the first finger in multi-touch).

For pointers that measure contact area and pressure, e.g. a finger on the touchscreen, the additional properties can be useful:

- `width` - the width of the area where the pointer touches the device. Where unsupported, e.g. for a mouse, it's always `1`. 
- `height` - the height of the area where the pointer touches the device. Where unsupported, it's always `1`.
- `pressure` - the pressure of the pointer tip, in range from 0 to 1. For devices that don't support pressure must be either `0.5` (pressed) or `0`.
- `tangentialPressure` - the normalized tangential pressure.
- `tiltX`, `tiltY`, `twist` - pen-specific properties that describe how the pen is positioned relative the surface.

These properties aren't very well supported across devices, so they are rarely used. You can find the details in the [specification](https://w3c.github.io/pointerevents/#pointerevent-interface) if needed.

## Multi-touch

One of the things that mouse events totally don't support is multi-touch: a user can touch in several places at once on their phone or tablet, or perform special gestures.

Pointer Events allow handling multi-touch with the help of the `pointerId` and `isPrimary` properties.

Here's what happens when a user touches a screen in one place, then puts another finger somewhere else on it:

1. At the first touch:
    - `pointerdown` with `isPrimary=true` and some `pointerId`.
2. For the second finger and further touches:
    - `pointerdown` with `isPrimary=false` and a different `pointerId` for every finger.

Please note: the `pointerId` is assigned not to the whole device, but for each touching finger. If we use 5 fingers to simultaneously touch the screen, we have 5 `pointerdown` events, each with their respective coordinates and a different `pointerId`.

The events associated with the first finger always have `isPrimary=true`.

We can track multiple touching fingers using their `pointerId`. When the user moves and then removes a finger, we get `pointermove` and `pointerup` events with the same `pointerId` as we had in `pointerdown`.

```online
Here's the demo that logs `pointerdown` and `pointerup` events:

[iframe src="multitouch" edit height=200]

Please note: you must be using a touchscreen device, such as a phone or a tablet, to actually see the difference. For single-touch devices, such as a mouse, there'll be always same `pointerId` with `isPrimary=true`, for all pointer events.
```

## Event: pointercancel

We've mentioned the importance of `touch-action: none` before. Now let's explain why, as skipping this may cause our interfaces to malfunction.

The `pointercancel` event fires when there's an ongoing pointer interaction, and then something happens that causes it to be aborted, so that no more pointer events are generated. 

Such causes are: 
- The pointer device hardware was disabled.
- The device orientation changed (tablet rotated). 
- The browser decided to handle the interaction on its own, considering it a mouse gesture or zoom-and-pan action or something else.

We'll demonstrate `pointercancel` on a practical example to see how it affects us.

Let's say we're impelementing drag'n'drop for a ball, just as in the beginning of the article <info:mouse-drag-and-drop>.

Here is the flow of user actions and the corresponding events:

1) The user presses the mouse button on an image, to start dragging
    - `pointerdown` event fires
2) Then they start dragging the image
    - `pointermove` fires, maybe several times
3) Surprise! The browser has native drag'n'drop support for images, that kicks in and takes over the drag'n'drop process, thus generating `pointercancel` event.
    - The browser now handles drag'n'drop of the image on its own. The user may even drag the ball image out of the browser, into their Mail program or a File Manager.
    - No more `pointermove` events for us.

So the issue is that the browser "hijacks" the interaction: `pointercancel` fires and no more `pointermove` events are generated.

```online
Here's the demo with pointer events (only `up/down`, `move` and `cancel`) logged in the textarea: 

[iframe src="ball" height=240 edit]
```

We'd like to implement our own drag'n'drop, so let's tell the browser not to take it over.

**Prevent default browser actions to avoid `pointercancel`.**

We need to do two things:

1. Prevent native drag'n'drop from happening:
    - We can do this by setting `ball.ondragstart = () => false`, just as described in the article <info:mouse-drag-and-drop>.
    - That works well for mouse events.
2. For touch devices, there are also touch-related browser actions. We'll have problems with them too.
    - We can prevent them by setting `#ball { touch-action: none }` in CSS. 
    - Then our code will start working on touch devices.

After we do that, the events will work as intended, the browser won't hijack the process and doesn't emit `pointercancel`.

```online
This demo adds these lines:

[iframe src="ball-2" height=240 edit]

As you can see, there's no `pointercancel` any more.
```

Now we can add the code to actually move the ball, and our drag'n'drop will work for mouse devices and touch devices.

## Pointer capturing

Pointer capturing is a special feature of pointer events.

The idea is that we can "bind" all events with a particular `pointerId` to a given element. Then all subsequent events with the same `pointerId` will be retargeted to the same element. That is: the browser sets that element as the target and trigger associated handlers, no matter where it actually happened.

The related methods are:
- `elem.setPointerCapture(pointerId)` - binds the given `pointerId` to `elem`.
- `elem.releasePointerCapture(pointerId)` - unbinds the given `pointerId` from `elem`.

Such binding doesn't hold long. It's automatically removed after `pointerup` or `pointercancel` events, or when the target `elem` is removed from the document. 

Now when do we need this?

**Pointer capturing is used to simplify drag'n'drop kind of interactions.**

Let's recall the problem we met while making a custom slider in the article <info:mouse-drag-and-drop>.

1) First, the user presses `pointerdown` on the slider thumb to start dragging it.
2) ...But then, as they move the pointer, it may leave the slider: go below or over it.

But we continue tracking track `pointermove` events and move the thumb until `pointerup`, even though the pointer is not on the slider any more.

[Previously](info:mouse-drag-and-drop), to handle `pointermove` events that happen outside of the slider, we listened for `pointermove` events on the whole `document`. 

Pointer capturing provides an alternative solution: we can call `thumb.setPointerCapture(event.pointerId)` in `pointerdown` handler, and then all future pointer events until `pointerup` will be retargeted to `thumb`.

That is: events handlers on `thumb` will be called, and `event.target` will always be `thumb`, even if the user moves their pointer around the whole document. So we can listen at `thumb` for `pointermove`, no matter where it happens.

Here's the essential code:

```js
thumb.onpointerdown = function(event) {
  // retarget all pointer events (until pointerup) to me
  thumb.setPointerCapture(event.pointerId);
};

thumb.onpointermove = function(event) {
  // move the slider: listen at thumb, as all events are retargeted to it
  let newLeft = event.clientX - slider.getBoundingClientRect().left;
  thumb.style.left = newLeft + 'px';
};

// note: no need to call thumb.releasePointerCapture, 
// it happens on pointerup automatically
```

```online
The full demo:

[iframe src="slider" height=100 edit]
```

**As a summary: the code becomes cleaner as we don't need to add/remove handlers on the whole `document` any more. That's what pointer capturing does.**

There are two associated pointer events:

- `gotpointercapture` fires when an element uses `setPointerCapture` to enable capturing.
- `lostpointercapture` fires when the capture is released: either explicitly with `releasePointerCapture` call, or automatically on `pointerup`/`pointercancel`.

## Summary

Pointer events allow handling mouse, touch and pen events simultaneously.

Pointer events extend mouse events. We can replace `mouse` with `pointer` in event names and expect our code to continue working for mouse, with better support for other device types.

Remember to set `touch-events: none` in CSS for elements that we engage, otherwise the browser will hijack many types of touch interactions, and pointer events won't be generated.

Additional abilities of Pointer events are:

- Multi-touch support using `pointerId` and `isPrimary`.
- Device-specific properties, such as `pressure`, `width/height`, and others.
- Pointer capturing: we can retarget all pointer events to a specific element until `pointerup`/`pointercancel`.

As of now, pointer events are supported in all major browsers, so we can safely switch to them, as long as IE10- and Safari 12- are not needed. And even with those browsers, there are polyfills that enable the support of pointer events.
