# Promise

Imagine that you're a top singer, and fans ask day and night for your upcoming single.
당신이 탑 가수라고 상상해 보세요, 그리고 곧 나올 싱글 엘범에 대해 밤낮으로 물어 보는 팬들을 상상해 보세요. 

To get some relief, you promise to send it to them when it's published. You give your fans a list to which they can subscribe for updates. They can fill in their email addresses, so that when the song becomes available, all subscribed parties instantly receive it. And even if something goes very wrong, say, if plans to publish the song are cancelled, they will still be notified.
당신은 안심을 시키기위해, 엘범이 출시 될 때 그들에게 보내겠다고 약속을 합니다. 당신은 업데이트을 구독할 수 있는 리스트를 팬들에게 건냅니다. 팬들의 이메일을 적을 수 있어서 노래가 나오면 모든 구독자들이 즉시로 이것을 받을 수 있도록 합니다. 그리고 뭔가 심하게 잘 못 되어도, 말하자면, 노래 출시가 취소되더라도 여전히 팬들은 알림을 받을 수 있을 것 입니다.

Everyone is happy, because the people don't crowd you any more, and fans, because they won't miss the single.
더 이상 당신에게 많은 인파가 몰리지도 않고 팬들은 앨범을 놓치지도 않을 것이기에 모두가 행복합니다. 

This is a real-life analogy for things we often have in programming:
이것이 다음과 같이 프로그래밍에서 주로 겪는 것들의 실생활 비유입니다: 

1. A "producing code" that does something and takes time. For instance, the code loads a remote script. That's a "singer".
1. 
2. A "consuming code" that wants the result of the "producing code" once it's ready. Many functions  may need that result. These are the "fans".
3. A *promise* is a special JavaScript object that links the "producing code" and the "consuming code" together. In terms of our analogy: this is the "subscription list". The "producing code" takes whatever time it needs to produce the promised result, and the "promise" makes that result available to all of the subscribed code when it's ready.

The analogy isn't terribly accurate, because JavaScript promises are more complex than a simple subscription list: they have additional features and limitations. But it's fine to begin with.

The constructor syntax for a promise object is:

```js
let promise = new Promise(function(resolve, reject) {
  // executor (the producing code, "singer")
});
```

The function passed to `new Promise` is called the *executor*. When the promise is created, this executor function runs automatically. It contains the producing code, that should eventually produce a result. In terms of the analogy above: the executor is the "singer".

The resulting `promise` object has internal properties:

- `state` — initially "pending", then changes to either "fulfilled" or "rejected",
- `result` — an arbitrary value of your choosing, initially `undefined`.

When the executor finishes the job, it should call one of the functions that it gets as arguments:

- `resolve(value)` — to indicate that the job finished successfully:
    - sets `state` to `"fulfilled"`,
    - sets `result` to `value`.
- `reject(error)` — to indicate that an error occurred:
    - sets `state` to `"rejected"`,
    - sets `result` to `error`.

![](promise-resolve-reject.png)

Later we'll see how these changes become known to "fans".

Here's an example of a Promise constructor and a simple executor function with its "producing code" (the `setTimeout`):

```js run
let promise = new Promise(function(resolve, reject) {
  // the function is executed automatically when the promise is constructed

  // after 1 second signal that the job is done with the result "done!"
  setTimeout(() => *!*resolve("done!")*/!*, 1000);
});
```

We can see two things by running the code above:

1. The executor is called automatically and immediately (by the `new Promise`).
2. The executor receives two arguments: `resolve` and `reject` — these functions are pre-defined by the JavaScript engine. So we don't need to create them. Instead, we should write the executor to call them when ready.

After one second of "processing" the executor calls `resolve("done")` to produce the result:

![](promise-resolve-1.png)

That was an example of a successful job completion, a "fulfilled promise".

And now an example of the executor rejecting the promise with an error:

```js
let promise = new Promise(function(resolve, reject) {
  // after 1 second signal that the job is finished with an error
  setTimeout(() => *!*reject(new Error("Whoops!"))*/!*, 1000);
});
```

![](promise-reject-1.png)

To summarize, the executor should do a job (something that takes time usually) and then call `resolve` or `reject` to change the state of the corresponding Promise object.

The Promise that is either resolved or rejected is called "settled", as opposed to a "pending" Promise.

````smart header="There can be only a single result or an error"
The executor should call only one `resolve` or `reject`. The promise's state change is final.

All further calls of `resolve` and `reject` are ignored:

```js
let promise = new Promise(function(resolve, reject) {
  resolve("done");

  reject(new Error("…")); // ignored
  setTimeout(() => resolve("…")); // ignored
});
```

The idea is that a job done by the executor may have only one result or an error.

Further, `resolve`/`reject` expect only one argument and will ignore additional arguments.
````

```smart header="Reject with `Error` objects"
In case if something goes wrong, we can call `reject` with any type of argument (just like `resolve`). But it is recommended to use `Error` objects (or objects that inherit from `Error`). The reasoning for that will soon become apparent.
```

````smart header="Immediately calling `resolve`/`reject`"
In practice, an executor usually does something asynchronously and calls `resolve`/`reject` after some time, but it doesn't have to. We also can call `resolve` or `reject` immediately, like this:

```js
let promise = new Promise(function(resolve, reject) {
  // not taking our time to do the job
  resolve(123); // immediately give the result: 123
});
```

For instance, this might happen when we start to do a job but then see that everything has already been completed.

That's fine. We immediately have a resolved Promise, nothing wrong with that.
````

```smart header="The `state` and `result` are internal"
The properties `state` and `result` of the Promise object are internal. We can't directly access them from our "consuming code". We can use the methods `.then`/`.catch` for that. They are described below.
```

## Consumers: "then" and "catch"

A Promise object serves as a link between the executor (the "producing code" or "singer") and the consuming functions (the "fans"), which will receive the result or error. Consuming functions can be registered (subscribed) using the methods `.then` and `.catch`.

The syntax of `.then` is:

```js
promise.then(
  function(result) { *!*/* handle a successful result */*/!* },
  function(error) { *!*/* handle an error */*/!* }
);
```

The first argument of `.then` is a function that:

1. runs when the Promise is resolved, and
2. receives the result.

The second argument of `.then` is a function that:

1. runs when the Promise is rejected, and
2. receives the error.

For instance, here's the reaction to a successfuly resolved promise:

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done!"), 1000);
});

// resolve runs the first function in .then
promise.then(
*!*
  result => alert(result), // shows "done!" after 1 second
*/!*
  error => alert(error) // doesn't run
);
```

The first function was executed.

And in the case of a rejection -- the second one:

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});

// reject runs the second function in .then
promise.then(
  result => alert(result), // doesn't run
*!*
  error => alert(error) // shows "Error: Whoops!" after 1 second
*/!*
);
```

If we're interested only in successful completions, then we can provide only one function argument to `.then`:

```js run
let promise = new Promise(resolve => {
  setTimeout(() => resolve("done!"), 1000);
});

*!*
promise.then(alert); // shows "done!" after 1 second
*/!*
```

If we're interested only in errors, then we can use `null` as the first argument: `.then(null, errorHandlingFunction)`. Or we can use `.catch(errorHandlingFunction)`, which is exactly the same:


```js run
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});

*!*
// .catch(f) is the same as promise.then(null, f)
promise.catch(alert); // shows "Error: Whoops!" after 1 second
*/!*
```

The call `.catch(f)` is a complete analog of `.then(null, f)`, it's just a shorthand.

````smart header="On settled promises `then` runs immediately"
If a promise is pending, `.then/catch` handlers wait for the result. Otherwise, if a promise has already settled, they execute immediately:

```js run
// an immediately resolved promise
let promise = new Promise(resolve => resolve("done!"));

promise.then(alert); // done! (shows up right now)
```

Some tasks may sometimes require time and sometimes finish immediately. The good thing is: the `.then` handler is guaranteed to run in both cases.
````

````smart header="Handlers of `.then`/`.catch` are always asynchronous"
Even when the Promise is immediately resolved, code which occurs on lines *below* your `.then`/`.catch` may still execute first.

The JavaScript engine has an internal execution queue which gets all `.then/catch` handlers.

But it only looks into that queue when the current execution is finished.

In other words, `.then/catch` handlers are pending execution until the engine is done with the current code.

For instance, here:

```js run
// an "immediately" resolved Promise
const executor = resolve => resolve("done!");
const promise = new Promise(executor);

promise.then(alert); // this alert shows last (*)

alert("code finished"); // this alert shows first
```

The promise becomes settled immediately, but the engine first finishes the current code, calls `alert`, and only *afterwards* looks into the queue to run `.then` handler.

So the code *after* `.then` ends up always running *before* the Promise's subscribers, even in the case of an immediately-resolved Promise.

Usually that's unimportant, but in some scenarios the order may matter a great deal.
````

Next, let's see more practical examples of how promises can help us to write asynchronous code.

## Example: loadScript

We've got the `loadScript` function for loading a script from the previous chapter.

Here's the callback-based variant, just to remind us of it:

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error ` + src));

  document.head.append(script);
}
```

Let's rewrite it using Promises.

The new function `loadScript` will not require a callback. Instead, it will create and return a Promise object that resolves when the loading is complete. The outer code can add handlers (subscribing functions) to it using `.then`:

```js run
function loadScript(src) {  
  return new Promise(function(resolve, reject) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error("Script load error: " + src));

    document.head.append(script);
  });
}
```

Usage:

```js run
let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js");

promise.then(
  script => alert(`${script.src} is loaded!`),
  error => alert(`Error: ${error.message}`)
);

promise.then(script => alert('One more handler to do something else!'));
```

We can immediately see a few benefits over the callback-based pattern:

```compare minus="Callbacks" plus="Promises"
- We must have a ready `callback` function when calling `loadScript`. In other words, we must know what to do with the result *before* `loadScript` is called.
- There can be only one callback.
+ Promises allow us to do things in the natural order. First, we run `loadScript`, and `.then` we write what to do with the result.
+ We can call `.then` on a Promise as many times as we want. Each time, we're adding a new "fan", a new subscribing function, to the "subscription list". More about this in the next section: [Promise Chaining](/promise-chaining).
```

So Promises already give us better code flow and flexibility. But there's more. We'll see that in the next chapters.
