# rollover.js

## Installation

```console
$ bower install rollover
```

## Usage

```html
<script src="rollover.min.js"></script>
```

define `rollover` by `define()` if using AMD loader.

otherwise `rollover` export to global.

## Example

```js
function onEnter(event) {
  // onmouseenter
}

function onLeave(event) {
  // onmouseleave
}

rollover.set('img.rollover', onEnter, onLeave);
```

## Functions

### set(selector, enter, leave)

- `selector`
  - `String` - CSS selector for `document.querySelectorAll`
  - `*` - pass to jQuery if can use it.
- `enter`
  - `Function` - event handler for `onmouseenter`
- `leave`
  - `Function` - event handler for `onmouseleave`

add event handler to elements.

use `jQuery.on` if can use jQuery.

### unset(selector, enter, leave)

- `selector`
  - `String` - CSS selector for `document.querySelectorAll`
  - `*` - pass to jQuery if can use it.
- `enter`
  - `Function` - event handler for `onmouseenter`
- `leave`
  - `Function` - event handler for `onmouseleave`

remove event handler from elements.

use `jQuery.off` if can use jQuery.

## License

The MIT license. Please see LICENSE file.
