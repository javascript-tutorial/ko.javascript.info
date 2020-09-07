# CSS 애니메이션

CSS 애니메이션을 사용하면 자바스크립트 없이도 간단한 애니메이션을 만들 수 있습니다.

자바스크립트는 CSS 애니메이션을 제어하고 보다 짧은 코드로 훨씬 더 효과적인 애니메이션을 만듭니다.

## CSS 트랜지션 [#css-transition]

CSS 트랜지션의 원리는 간단합니다. 프로퍼티에 어떻게 애니메이션 시킬지에 대한 값을 입력하면 됩니다. 입력한 프로퍼티가 변할 때, 브라우저에 애니메이션이 보이게 됩니다.

즉, 프로퍼티를 변하게 해야 합니다. 그래야 브라우저를 통해 자연스러운 전환이 됩니다.

예를 들어 아래에 있는 CSS는 3초 동안 `background-color`를 변하게 합니다.

```css
.animated {
  transition-property: background-color;
  transition-duration: 3s;
}
```

이제 어떤 요소가 `.animated` 클래스를 가지고 있다면,  `background-color`는 3초 동안 변하게 됩니다.

아래 버튼을 클릭해 배경을 변화시켜보세요.

```html run autorun height=60
<button id="color">클릭하기</button>

<style>
  #color {
    transition-property: background-color;
    transition-duration: 3s;
  }
</style>

<script>
  color.onclick = function() {
    this.style.backgroundColor = 'red';
  };
</script>
```

CSS 프로퍼티와 관련된 프로퍼티 네 가지는 다음과 같습니다.

- `transition-property`
- `transition-duration`
- `transition-timing-function`
- `transition-delay`

이 네 가지 프로퍼티는 잠시 후에 다루도록 하고, 지금은 흔히 쓰이는 `transition` 프로퍼티가 어떤 순서대로 네 가지 프로퍼티를 선언하는지 알아봅시다. `property duration timing-function delay`의 순서로 한 번에 선언이 가능합니다.

예를 들어 아래의 버튼은 `color`와 `font-size`에 애니메이션 효과가 나타납니다.

```html run height=80 autorun no-beautify
<button id="growing">클릭하기</button>

<style>
#growing {
*!*
  transition: font-size 3s, color 2s;
*/!*
}
</style>

<script>
growing.onclick = function() {
  this.style.fontSize = '36px';
  this.style.color = 'red';
};
</script>
```

이제 애니메이션 프로퍼티에 대해 하나씩 살펴봅시다.

## 'transition-property' 프로퍼티

`transition-property` 프로퍼티를 통해 `left`, `margin-left`, `height`, `color`와 같은 애니메이션을 위한 프로퍼티 목록을 작성할 수 있습니다.

모든 프로퍼티가 애니메이션 효과를 나타낼 순 없지만, [많은 프로퍼티](http://www.w3.org/TR/css3-transitions/#animatable-properties-)가 가능합니다. 프로퍼티의 값인 `all`은 모든 프로퍼티가 전환될 수 있음을 의미합니다.

## 'transition-duration' 프로퍼티

`transition-duration` 프로퍼티를 통해 애니메이션 시간이 얼마나 걸릴지 설정할 수 있습니다. 시간은 [CSS 시간 단위](http://www.w3.org/TR/css3-values/#time)인 초 단위를 나타내는 `s` 또는 밀리초 단위를 나타내는 `ms`를 사용해야 합니다.

## 'transition-delay' 프로퍼티

`transition-delay` 프로퍼티를 통해 애니메이션 *시작 전*의 지연 시간을 설정할 수 있습니다. 예를 들어 `transition-delay: 1s`이면, 애니메이션은 1초 후에 나타나게 됩니다.

음의 값도 가능합니다. 그러면 애니메이션은 중간부터 시작하게 됩니다. 예를 들어 `transition-duration`이 `2s`이고, 지연 시간은 `-1s`일 때, 애니메이션은 1초가 걸리고 딱 중간부터 시작합니다.

여기 CSS `translate` 프로퍼티를 사용하여 `0`부터 `9`까지 숫자가 변하는 애니메이션이 있습니다.

[codetabs src="digits"]

`transform` 프로퍼티는 다음과 같이 작성되었습니다.

```css
#stripe.animate {
  transform: translate(-90%);
  transition-property: transform;
  transition-duration: 9s;
}
```

위의 예시에서 자바스크립트는 요소에 `.animate`라는 이름의 클래스를 추가했습니다. 그리고 애니메이션이 나타납니다.

```js
stripe.classList.add('animate');
```

또한 `transition-delay`에서 음의 값을 사용하여, 특정 숫자에서(예: 현재 2초에 해당하는 숫자) '중간부터' 시작할 수 있다.

여기 숫자를 클릭하면 현재 2초에 해당하는 숫자부터 애니메이션이 시작될 것입니다.

[codetabs src="digits-negative-delay"]

자바스크립트에서는 위의 내용을 별도의 행으로 실행합니다.

```js
stripe.onclick = function() {
  let sec = new Date().getSeconds() % 10;
*!*
  // 예를 들어, 여기에서의 -3s는 3초부터 애니메이션을 시작합니다.
  stripe.style.transitionDelay = '-' + sec + 's';
*/!*
  stripe.classList.add('animate');
};
```

## transition-timing-function

Timing function describes how the animation process is distributed along the time. Will it start slowly and then go fast or vise versa.

That's the most complicated property from the first sight. But it becomes very simple if we devote a bit time to it.

That property accepts two kinds of values: a Bezier curve or steps. Let's start from the curve, as it's used more often.

### Bezier curve

The timing function can be set as a [Bezier curve](/bezier-curve) with 4 control points that satisfies the conditions:

1. First control point: `(0,0)`.
2. Last control point: `(1,1)`.
3. For intermediate points values of `x` must be in the interval `0..1`, `y` can be anything.

The syntax for a Bezier curve in CSS: `cubic-bezier(x2, y2, x3, y3)`. Here we need to specify only 2nd and 3rd control points, because the 1st one is fixed to `(0,0)` and the 4th one is `(1,1)`.

The timing function describes how fast the animation process goes in time.

- The `x` axis is the time: `0` -- the starting moment, `1` -- the last moment of `transition-duration`.
- The `y` axis specifies the completion of the process: `0` -- the starting value of the property, `1` -- the final value.

The simplest variant is when the animation goes uniformly, with the same linear speed. That can be specified by the curve `cubic-bezier(0, 0, 1, 1)`.

Here's how that curve looks:

![](bezier-linear.svg)

...As we can see, it's just a straight line. As the time (`x`) passes, the completion (`y`) of the animation steadily goes from `0` to `1`.

The train in the example below goes from left to right with the permanent speed (click it):

[codetabs src="train-linear"]

The CSS `transition` is based on that curve:

```css
.train {
  left: 0;
  transition: left 5s cubic-bezier(0, 0, 1, 1);
  /* JavaScript sets left to 450px */
}
```

...And how can we show a train slowing down?

We can use another Bezier curve: `cubic-bezier(0.0, 0.5, 0.5 ,1.0)`.

The graph:

![](train-curve.svg)

As we can see, the process starts fast: the curve soars up high, and then slower and slower.

Here's the timing function in action (click the train):

[codetabs src="train"]

CSS:
```css
.train {
  left: 0;
  transition: left 5s cubic-bezier(0, .5, .5, 1);
  /* JavaScript sets left to 450px */
}
```

There are several built-in curves: `linear`, `ease`, `ease-in`, `ease-out` and `ease-in-out`.

The `linear` is a shorthand for `cubic-bezier(0, 0, 1, 1)` -- a straight line, we saw it already.

Other names are shorthands for the following `cubic-bezier`:

| <code>ease</code><sup>*</sup> | <code>ease-in</code> | <code>ease-out</code> | <code>ease-in-out</code> |
|-------------------------------|----------------------|-----------------------|--------------------------|
| <code>(0.25, 0.1, 0.25, 1.0)</code> | <code>(0.42, 0, 1.0, 1.0)</code> | <code>(0, 0, 0.58, 1.0)</code> | <code>(0.42, 0, 0.58, 1.0)</code> |
| ![ease, figure](ease.svg) | ![ease-in, figure](ease-in.svg) | ![ease-out, figure](ease-out.svg) | ![ease-in-out, figure](ease-in-out.svg) |

`*` -- by default, if there's no timing function, `ease` is used.

So we could use `ease-out` for our slowing down train:


```css
.train {
  left: 0;
  transition: left 5s ease-out;
  /* transition: left 5s cubic-bezier(0, .5, .5, 1); */
}
```

But it looks a bit differently.

**A Bezier curve can make the animation "jump out" of its range.**

The control points on the curve can have any `y` coordinates: even negative or huge. Then the Bezier curve would also jump very low or high, making the animation go beyond its normal range.

In the example below the animation code is:
```css
.train {
  left: 100px;
  transition: left 5s cubic-bezier(.5, -1, .5, 2);
  /* JavaScript sets left to 400px */
}
```

The property `left` should animate from `100px` to `400px`.

But if you click the train, you'll see that:

- First, the train goes *back*: `left` becomes less than `100px`.
- Then it goes forward, a little bit farther than `400px`.
- And then back again -- to `400px`.

[codetabs src="train-over"]

Why it happens -- pretty obvious if we look at the graph of the given Bezier curve:

![](bezier-train-over.svg)

We moved the `y` coordinate of the 2nd point below zero, and for the 3rd point we made put it over `1`, so the curve goes out of the "regular" quadrant. The `y` is out of the "standard" range `0..1`.

As we know, `y` measures "the completion of the animation process". The value `y = 0` corresponds to the starting property value and `y = 1` -- the ending value. So values `y<0` move the property lower than the starting `left` and `y>1` -- over the final `left`.

That's a "soft" variant for sure. If we put `y` values like `-99` and `99` then the train would jump out of the range much more.

But how to make the Bezier curve for a specific task? There are many tools. For instance, we can do it on the site <http://cubic-bezier.com/>.

### 단계(Steps)

함수 Timing의 값 `steps(number of steps[, start/end])`를 통해 애니메이션을 여러 단계로 나눌 수 있습니다.

아래 숫자로 된 예시를 봅시다.

애니메이션이 없는 숫자의 나열이죠.

[codetabs src="step-list"]

빨간 '네모박스'밖에 있는 부분은 눈에 보이지 않게 만들고 단계별로 숫자 목록을 왼쪽으로 이동 시켜 숫자가 하나씩 나타나게 해봅시다.

숫자가 하나씩 이동하기에 총 9단계로 나타납니다.

```css
#stripe.animate  {
  transform: translate(-90%);
  transition: transform 9s *!*steps(9, start)*/!*;
}
```

동작:

[codetabs src="step"]

`steps(9, start)`의 첫 번째 인수는 단계 수입니다. 각 10%씩 9단계로 분할되어 변환됩니다. 시간 간격도 자동으로 9단계로 나뉘어, `transition: 9s`는 전체 애니메이션에 대해 9초(숫자 당 1초)를 줍니다.

두 번째 인수는 `start` 또는 `end` 둘 중 하나입니다.

`start`는 애니메이션이 바로 첫 번째 단계부터 시작함을 의미합니다.

숫자를 클릭하면 바로 첫 단계인 `1`로 바뀌고, 그다음 초가 되면 다음 단계로 바뀌는 것을 볼 수 있습니다.

애니메이션 과정은 아래와 같이 진행됩니다.

- `0s` -- `-10%` (첫 번째 초에 바로 첫 변화 생김)
- `1s` -- `-20%`
- ...
- `8s` -- `-80%`
- (마지막 초에 최종값 나타남).

`end`는 애니메이션이 바로 시작하지 않고 각 초가 끝날 때 시작함을 의미합니다.

애니메이션 과정은 다음과 같습니다.

- `0s` -- `0`
- `1s` -- `-10%` (첫 번째 초가 끝날 때 첫 변화 생김)
- `2s` -- `-20%`
- ...
- `9s` -- `-90%`

첫 번째 숫자 변화 사이의 일시 중지를 참고하여 `steps(9, end)`의 동작을 봅시다.

[codetabs src="step-end"]

단축 구문 값도 있습니다.

- `step-start`는 `steps(1, start)`와 같습니다. 즉, 애니메이션의 첫 단계가 바로 시작되죠. 그래서 애니메이션이 없었던 것처럼 바로 시작하고 끝납니다.
- `step-end`는 `steps(1, end)`와 같으며, `transition-duration`의 끝에서 애니메이션의 한 단계가 진행됩니다.

위의 값들은 거의 사용되지 않는데, 실제 애니메이션이 아니라 한 단계마다 변화하기 때문입니다.

## Event transitionend

When the CSS animation finishes the `transitionend` event triggers.

It is widely used to do an action after the animation is done. Also we can join animations.

For instance, the ship in the example below starts to swim there and back on click, each time farther and farther to the right:

[iframe src="boat" height=300 edit link]

The animation is initiated by the function `go` that re-runs each time when the transition finishes and flips the direction:

```js
boat.onclick = function() {
  //...
  let times = 1;

  function go() {
    if (times % 2) {
      // swim to the right
      boat.classList.remove('back');
      boat.style.marginLeft = 100 * times + 200 + 'px';
    } else {
      // swim to the left
      boat.classList.add('back');
      boat.style.marginLeft = 100 * times - 200 + 'px';
    }

  }

  go();

  boat.addEventListener('transitionend', function() {
    times++;
    go();
  });
};
```

The event object for `transitionend` has few specific properties:

`event.propertyName`
: The property that has finished animating. Can be good if we animate multiple properties simultaneously.

`event.elapsedTime`
: The time (in seconds) that the animation took, without `transition-delay`.

## Keyframes

We can join multiple simple animations together using the `@keyframes` CSS rule.

It specifies the "name" of the animation and rules: what, when and where to animate. Then using the `animation` property we attach the animation to the element and specify additional parameters for it.

Here's an example with explanations:

```html run height=60 autorun="no-epub" no-beautify
<div class="progress"></div>

<style>
*!*
  @keyframes go-left-right {        /* give it a name: "go-left-right" */
    from { left: 0px; }             /* animate from left: 0px */
    to { left: calc(100% - 50px); } /* animate to left: 100%-50px */
  }
*/!*

  .progress {
*!*
    animation: go-left-right 3s infinite alternate;
    /* apply the animation "go-left-right" to the element
       duration 3 seconds
       number of times: infinite
       alternate direction every time
    */
*/!*

    position: relative;
    border: 2px solid green;
    width: 50px;
    height: 20px;
    background: lime;
  }
</style>
```

There are many articles about `@keyframes` and a [detailed specification](https://drafts.csswg.org/css-animations/).

Probably you won't need `@keyframes` often, unless everything is in the constant move on your sites.

## Summary

CSS animations allow to smoothly (or not) animate changes of one or multiple CSS properties.

They are good for most animation tasks. We're also able to use JavaScript for animations, the next chapter is devoted to that.

Limitations of CSS animations compared to JavaScript animations:

```compare plus="CSS animations" minus="JavaScript animations"
+ Simple things done simply.
+ Fast and lightweight for CPU.
- JavaScript animations are flexible. They can implement any animation logic, like an "explosion" of an element.
- Not just property changes. We can create new elements in JavaScript for purposes of animation.
```

The majority of animations can be implemented using CSS as described in this chapter. And  `transitionend` event allows to run JavaScript after the animation, so it integrates fine with the code.

But in the next chapter we'll do some JavaScript animations to cover more complex cases.
