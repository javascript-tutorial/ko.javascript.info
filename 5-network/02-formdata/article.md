
# FormData

This chapter is about sending HTML forms: with or without files, with additional fields and so on.

[FormData](https://xhr.spec.whatwg.org/#interface-formdata) objects can help with that. As you might have guessed, it's the object to represent HTML form data.

The constructor is:
```js
let formData = new FormData([form]);
```

HTMLì— `form` ìš”ì†Œê°€ ìˆëŠ” ê²½ìš°, ìœ„ì™€ ê°™ì€ ì½”ë“œë¥¼ ì‘ì„±í•˜ë©´ í•´ë‹¹ í¼ ìš”ì†Œì˜ í•„ë“œ ì „ì²´ê°€ ìë™ ë°˜ì˜ë©ë‹ˆë‹¤.

The special thing about `FormData` is that network methods, such as `fetch`, can accept a `FormData` object as a body. It's encoded and sent out with `Content-Type: multipart/form-data`.

From the server point of view, that looks like a usual form submission.

## ê°„ë‹¨í•œ í¼ ì „ì†¡í•˜ê¸°

ì•„ì£¼ ê°„ë‹¨í•œ í¼ì„ ì „ì†¡í•œë‹¤ê³  ê°€ì •í•´ë´…ì‹œë‹¤.

ë³´ì‹œë‹¤ì‹œí”¼ ì•„ì£¼ ì§§ì€ ì½”ë“œë¡œë„ ì „ì†¡ ì²˜ë¦¬ê°€ ê°€ëŠ¥í•©ë‹ˆë‹¤.

```html run autorun
<form id="formElem">
  <input type="text" name="name" value="John">
  <input type="text" name="surname" value="Smith">
  <input type="submit">
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch('/article/formdata/post/user', {
      method: 'POST',
*!*
      body: new FormData(formElem)
*/!*
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

ìš”ì²­ì„ ë°›ì•„ ì²˜ë¦¬í•˜ëŠ” ì„œë²„ ì¸¡ ì½”ë“œëŠ” íŠœí† ë¦¬ì–¼ ë²”ìœ„ë¥¼ ë„˜ì–´ì„œì„œ ì¶”ê°€í•˜ì§„ ì•Šì•˜ëŠ”ë°, ì„œë²„ëŠ” POST ìš”ì²­ì„ ë°›ì•„ 'ì €ì¥ ì„±ê³µ'ì´ë¼ëŠ” ì‘ë‹µì„ ë³´ë‚´ì¤€ë‹¤ê³  ì •ë„ë§Œ ì•Œê³  ê³„ì‹œë©´ ë©ë‹ˆë‹¤.

## FormData ë©”ì„œë“œ

`FormData`ì— ì†í•˜ëŠ” í•„ë“œëŠ” ì•„ë˜ì™€ ê°™ì€ ë©”ì„œë“œë¡œ ìˆ˜ì •í•  ìˆ˜ ìˆìŠµë‹ˆë‹¤.

- `formData.append(name, value)` - add a form field with the given `name` and `value`,
- `formData.append(name, blob, fileName)` - add a field as if it were `<input type="file">`, the third argument `fileName` sets file name (not form field name), as it were a name of the file in user's filesystem,
- `formData.delete(name)` - remove the field with the given `name`,
- `formData.get(name)` - `name`ì— í•´ë‹¹í•˜ëŠ” í•„ë“œì˜ ê°’ì„ ê°€ì ¸ì˜´
- `formData.has(name)` - if there exists a field with the given `name`, returns `true`, otherwise `false`

A form is technically allowed to have many fields with the same `name`, so multiple calls to `append` add more same-named fields.

`append` ¸Ş¼­µå ÀÌ¿Ü¿¡ ÇÊµå Ãß°¡ ½Ã »ç¿ëÇÒ ¼ö ÀÖ´Â ¸Ş¼­µå·Î `set`µµ ÀÖ½À´Ï´Ù. `set`ÀÌ `append` ¸Ş¼­µå¿Í ´Ù¸¥ Á¡Àº `set`Àº `name`°ú µ¿ÀÏÇÑ ÀÌ¸§À» °¡Áø ÇÊµå¸¦ ¸ğµÎ Á¦°ÅÇÏ°í »õ·Î¿î ÇÊµå ÇÏ³ª¸¦ Ãß°¡ÇÑ´Ù´Â µ¥ ÀÖ½À´Ï´Ù. µû¶ó¼­ `set` ¸Ş¼­µå¸¦ ¾²¸é `name`À» °¡Áø ÇÊµå°¡ ´Ü ÇÑ °³¸¸ ÀÖ°Ô²û º¸ÀåÇÒ ¼ö ÀÖ½À´Ï´Ù. ÀÌ ¿Ü¿¡ ´Ù¸¥ ±â´ÉÀº `append` ¸Ş¼­µå¿Í µ¿ÀÏÇÕ´Ï´Ù.

- `formData.set(name, value)`,
- `formData.set(name, blob, fileName)`.

Âü°í·Î Æû µ¥ÀÌÅÍ ÇÊµå¿¡ ¹İº¹ ÀÛ¾÷À» ÇÒ¶© `for..of` ·çÇÁ¸¦ »ç¿ëÇÒ ¼ö ÀÖ½À´Ï´Ù.

```js run
let formData = new FormData();
formData.append('key1', 'value1');
formData.append('key2', 'value2');

// List key/value pairs
for(let [name, value] of formData) {
  alert(`${name} = ${value}`); // key1=value1, then key2=value2
}
```

## Sending a form with a file

The form is always sent as `Content-Type: multipart/form-data`, this encoding allows to send files. So, `<input type="file">` fields are sent also, similar to a usual form submission.

íŒŒì¼ì´ ìˆëŠ” í¼ ì˜ˆì‹œë¥¼ ì‚´í´ë´…ì‹œë‹¤.

```html run autorun
<form id="formElem">
  <input type="text" name="firstName" value="John">
  Picture: <input type="file" name="picture" accept="image/*">
  <input type="submit">
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch('/article/formdata/post/user-avatar', {
      method: 'POST',
*!*
      body: new FormData(formElem)
*/!*
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

## Sending a form with Blob data

<info:fetch> ì±•í„°ì—ì„œ ì‚´í´ë³¸ ë°”ì™€ ê°™ì´ ì´ë¯¸ì§€ ê°™ì€ ë™ì ìœ¼ë¡œ ìƒì„±ëœ ë°”ì´ë„ˆë¦¬ íŒŒì¼ì€ `Blob` ê°ì²´ë¥¼ ì‚¬ìš©í•´ ì‰½ê²Œ ì „ì†¡í•  ìˆ˜ ìˆìŠµë‹ˆë‹¤. ì´ë•Œ `Blob` ê°ì²´ëŠ” `fetch` ë©”ì„œë“œì˜ `body` ë§¤ê°œë³€ìˆ˜ì— ë°”ë¡œ ë„˜ê²¨ì¤„ ìˆ˜ ìˆì£ .

In practice though, it's often convenient to send an image not separately, but as a part of the form, with additional fields, such as "name" and other metadata.

ì„œë²„ ì…ì¥ì—ì„œë„ ì›ì‹œ ë°”ì´ë„ˆë¦¬ ë°ì´í„°ë¥¼ ë°›ëŠ” ê²ƒë³´ë‹¤ multipart-encoded í¼ì„ ë°›ëŠ”ê²Œ ì¢€ ë” ì í•©í•˜ì£ .

This example submits an image from `<canvas>`, along with some other fields, as a form, using `FormData`:

```html run autorun height="90"
<body style="margin:0">
  <canvas id="canvasElem" width="100" height="80" style="border:1px solid"></canvas>

  <input type="button" value="ì´ë¯¸ì§€ ì „ì†¡" onclick="submit()">

  <script>
    canvasElem.onmousemove = function(e) {
      let ctx = canvasElem.getContext('2d');
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };

    async function submit() {
      let imageBlob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));

*!*
      let formData = new FormData();
      formData.append("firstName", "Bora");
      formData.append("image", imageBlob, "image.png");
*/!*    

      let response = await fetch('/article/formdata/post/image-form', {
        method: 'POST',
        body: formData
      });
      let result = await response.json();
      alert(result.message);
    }

  </script>
</body>
```

Please note how the image `Blob` is added:

```js
formData.append("image", imageBlob, "image.png");
```

ì´ ì½”ë“œëŠ” í¼ì— `<input type="file" name="image">` íƒœê·¸ê°€ ìˆê³ , ì‚¬ìš©ì ê¸°ê¸°ì˜ íŒŒì¼ ì‹œìŠ¤í…œì—ì„œ íŒŒì¼ëª…ì´ `"image.png"`(3ë²ˆì§¸ ì¸ìˆ˜ ì°¸ê³ )ì¸ `imageBlob` ë°ì´í„°(2ë²ˆì§¸ ì¸ìˆ˜ ì°¸ê³ )ë¥¼ ì¶”ê°€í•œ ê²ƒê³¼ ë™ì¼í•œ íš¨ê³¼ë¥¼ ì¤ë‹ˆë‹¤.

¿äÃ»À» ¹ŞÀº ¼­¹ö´Â ÀÏ¹İ Æû°ú µ¿ÀÏÇÏ°Ô Æû µ¥ÀÌÅÍ¿Í ÆÄÀÏÀ» ÀĞ°í Ã³¸®ÇÕ´Ï´Ù.

## Summary

[FormData](https://xhr.spec.whatwg.org/#interface-formdata) ê°ì²´ëŠ” `fetch` ë“±ì˜ ë„¤íŠ¸ì›Œí¬ ë©”ì„œë“œë¥¼ í†µí•´ HTML í¼ì„ ë³´ë‚´ëŠ”ë° ì‚¬ìš©ë©ë‹ˆë‹¤.

We can either create `new FormData(form)` from an HTML form, or create a object without a form at all, and then append fields with methods:

- `formData.append(name, value)`
- `formData.append(name, blob, fileName)`
- `formData.set(name, value)`
- `formData.set(name, blob, fileName)`

ë©”ì„œë“œë¥¼ ì‚¬ìš©í•  ë•Œ ì£¼ì˜í•  ì  2ê°€ì§€ê°€ ìˆìŠµë‹ˆë‹¤.

1. The `set` method removes fields with the same name, `append` doesn't. That's the only difference between them.
2. To send a file, 3-argument syntax is needed, the last argument is a file name, that normally is taken from user filesystem for `<input type="file">`.

Other methods are:

- `formData.delete(name)`
- `formData.get(name)`
- `formData.has(name)`

That's it!
