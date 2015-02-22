/*!
 * @license rollover.js Copyright(c) 2015 sasa+1
 * https://github.com/sasaplus1/rollover.js
 * Released under the MIT license.
 */


/**
 * export to AMD/global.
 *
 * @param {Object} global global object.
 * @param {Function} factory factory method.
 */
(function(global, factory) {
  'use strict';

  if (typeof define === 'function' && !!define.amd) {
    define(function(require) {
      var jQuery;

      // optional require
      if (!!require.defined && require.defined('jquery')) {
        jQuery = require('jquery');
      }

      return factory(jQuery);
    });
  } else {
    global.rollover = factory(global.jQuery);
  }
}(this, function(jQuery) {
  'use strict';

  var $ = jQuery || null,
      hasEvent = (
          'onmouseleave' in window ||
          'onmouseleave' in document.createElement('div')
      ),
      addedEvents = [],
      addEvent_, removeEvent_;

  if (typeof addEventListener === 'function') {
    // for modern browsers
    addEvent_ = function(element, type, fn) {
      element.addEventListener(type, fn, false);
    };
    removeEvent_ = function(element, type, fn) {
      element.removeEventListener(type, fn, false);
    };
  } else {
    // for old IE
    addEvent_ = function(element, type, fn) {
      element.attachEvent('on' + type, fn);
    };
    removeEvent_ = function(element, type, fn) {
      element.detachEvent('on' + type, fn);
    };
  }

  /**
   * generate polyfill function.
   *
   * @private
   * @param {HTMLElement} element target element.
   * @param {Function} fn callback function.
   */
  function generatePolyfillEvent_(element, fn) {
    return function(event) {
      var parent = event.relatedTarget;

      // find me
      while (parent !== element) {
        parent = parent.parentNode;
      }

      // return if find me from parent
      if (parent === element) {
        return;
      }

      // TODO:
      //   createEvent()
      //   event.type is 'mouseover' or 'mouseout'.
      fn(event);
    };
  }

  /**
   * set rollover to elements.
   *
   * @param {String} selector CSS selector.
   * @param {Function} enter add event handler for mouseenter.
   * @param {Function} leave add event handler for mouseleave.
   */
  function set(selector, enter, leave) {
    var elements, i, len, polyfillEnter, polyfillLeave;

    if (!!$) {
      // use jQuery
      $(selector)
        .on('mouseenter', enter)
        .on('mouseleave', leave);

      return;
    }

    elements = document.querySelectorAll(selector);

    if (hasEvent) {
      // for IE and modern browsers
      for (i = 0, len = elements.length; i < len; ++i) {
        if (typeof enter === 'function') {
          addEvent_(elements[i], 'mouseenter', enter);
        }
        if (typeof leave === 'function') {
          addEvent_(elements[i], 'mouseleave', leave);
        }
      }
    } else {
      // for old Firefox, Chrome, etc
      for (i = 0, len = elements.length; i < len; ++i) {
        if (typeof enter === 'function') {
          polyfillEnter = generatePolyfillEvent_(elements[i], enter);
          addEvent_(elements[i], 'mouseover', polyfillEnter);
        }

        if (typeof leave === 'function') {
          polyfillLeave = generatePolyfillEvent_(elements[i], leave);
          addEvent_(elements[i], 'mouseout', polyfillLeave);
        }

        // push reference for unset
        addedEvents.push({
          element: elements[i],
          polyfillEnter: polyfillEnter,
          polyfillLeave: polyfillLeave,
          enter: enter,
          leave: leave
        });
      }
    }
  }

  /**
   * unset rollover from elements.
   *
   * @param {String} selector CSS selector.
   * @param {Function} enter remove event handler for mouseenter.
   * @param {Function} leave remove event handler for mouseleave.
   */
  function unset(selector, enter, leave) {
    var elements, i, ilen, n, nlen;

    if (!!$) {
      $(selector)
        .off('mouseenter', enter)
        .off('mouseleave', leave);

      return;
    }

    elements = document.querySelectorAll(selector);

    if (hasEvent) {
      // for IE and modern browsers
      for (i = 0, len = elements.length; i < len; ++i) {
        if (typeof enter === 'function') {
          removeEvent_(elements[i], 'mouseenter', enter);
        }
        if (typeof leave === 'function') {
          removeEvent_(elements[i], 'mouseleave', leave);
        }
      }
    } else {
      // for old Firefox, Chrome, etc
      for (i = 0, ilen = elements.length; i < ilen; ++i) {
        for (n = 0, nlen = addedEvents.length; n < nlen; ++n) {
          if (addedEvents[n].element !== elements[i]) {
            continue;
          }

          if (addedEvents[n].enter === enter) {
            removeEvent_(
                elements[i], 'mouseenter', addedEvents[n].polyfillEnter);
          }
          if (addedEvents[n].leave === leave) {
            removeEvent_(
                elements[i], 'mouseleave', addedEvents[n].polyfillLeave);
          }

          addedEvent.splice(n, 1);

          break;
        }
      }
    }
  }

  return {
    set: set,
    unset: unset
  };
}));
