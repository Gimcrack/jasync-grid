/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var cls = __webpack_require__(6);
var defaultSettings = __webpack_require__(47);
var dom = __webpack_require__(4);
var EventManager = __webpack_require__(48);
var guid = __webpack_require__(49);

var instances = {};

function Instance(element) {
  var i = this;

  i.settings = _.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = dom.css(element, 'direction') === "rtl";
  i.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  function focus() {
    cls.add(element, 'ps-focus');
  }

  function blur() {
    cls.remove(element, 'ps-focus');
  }

  i.scrollbarXRail = dom.appendTo(dom.e('div', 'ps-scrollbar-x-rail'), element);
  i.scrollbarX = dom.appendTo(dom.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
  i.scrollbarX.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarX, 'focus', focus);
  i.event.bind(i.scrollbarX, 'blur', blur);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = _.toInt(dom.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : _.toInt(dom.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = _.toInt(dom.css(i.scrollbarXRail, 'borderLeftWidth')) + _.toInt(dom.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  dom.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = dom.appendTo(dom.e('div', 'ps-scrollbar-y-rail'), element);
  i.scrollbarY = dom.appendTo(dom.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
  i.scrollbarY.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarY, 'focus', focus);
  i.event.bind(i.scrollbarY, 'blur', blur);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = _.toInt(dom.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : _.toInt(dom.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? _.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = _.toInt(dom.css(i.scrollbarYRail, 'borderTopWidth')) + _.toInt(dom.css(i.scrollbarYRail, 'borderBottomWidth'));
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));
  dom.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  return element.getAttribute('data-ps-id');
}

function setId(element, id) {
  element.setAttribute('data-ps-id', id);
}

function removeId(element) {
  element.removeAttribute('data-ps-id');
}

exports.add = function (element) {
  var newId = guid();
  setId(element, newId);
  instances[newId] = new Instance(element);
  return instances[newId];
};

exports.remove = function (element) {
  delete instances[getId(element)];
  removeId(element);
};

exports.get = function (element) {
  return instances[getId(element)];
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var cls = __webpack_require__(6);
var dom = __webpack_require__(4);

var toInt = exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

var clone = exports.clone = function (obj) {
  if (!obj) {
    return null;
  } else if (obj.constructor === Array) {
    return obj.map(clone);
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = clone(original);
  for (var key in source) {
    result[key] = clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return dom.matches(el, "input,[contenteditable]") ||
         dom.matches(el, "select,[contenteditable]") ||
         dom.matches(el, "textarea,[contenteditable]") ||
         dom.matches(el, "button,[contenteditable]");
};

exports.removePsClasses = function (element) {
  var clsList = cls.list(element);
  for (var i = 0; i < clsList.length; i++) {
    var className = clsList[i];
    if (className.indexOf('ps-') === 0) {
      cls.remove(element, className);
    }
  }
};

exports.outerWidth = function (element) {
  return toInt(dom.css(element, 'width')) +
         toInt(dom.css(element, 'paddingLeft')) +
         toInt(dom.css(element, 'paddingRight')) +
         toInt(dom.css(element, 'borderLeftWidth')) +
         toInt(dom.css(element, 'borderRightWidth'));
};

exports.startScrolling = function (element, axis) {
  cls.add(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.add(element, 'ps-' + axis);
  } else {
    cls.add(element, 'ps-x');
    cls.add(element, 'ps-y');
  }
};

exports.stopScrolling = function (element, axis) {
  cls.remove(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.remove(element, 'ps-' + axis);
  } else {
    cls.remove(element, 'ps-x');
    cls.remove(element, 'ps-y');
  }
};

exports.env = {
  isWebKit: 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: window.navigator.msMaxTouchPoints !== null
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var cls = __webpack_require__(6);
var dom = __webpack_require__(4);
var instances = __webpack_require__(0);
var updateScroll = __webpack_require__(3);

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = {width: i.railXWidth};
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  dom.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  dom.css(i.scrollbarYRail, yRailOffset);

  dom.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
  dom.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
}

module.exports = function (element) {
  var i = instances.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, _.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = _.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, _.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = _.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    cls.add(element, 'ps-active-x');
  } else {
    cls.remove(element, 'ps-active-x');
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    updateScroll(element, 'left', 0);
  }
  if (i.scrollbarYActive) {
    cls.add(element, 'ps-active-y');
  } else {
    cls.remove(element, 'ps-active-y');
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    updateScroll(element, 'top', 0);
  }
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var instances = __webpack_require__(0);

var lastTop;
var lastLeft;

var createDOMEvent = function (name) {
  var event = document.createEvent("Event");
  event.initEvent(name, true, true);
  return event;
};

module.exports = function (element, axis, value) {
  if (typeof element === 'undefined') {
    throw 'You must provide an element to the update-scroll function';
  }

  if (typeof axis === 'undefined') {
    throw 'You must provide an axis to the update-scroll function';
  }

  if (typeof value === 'undefined') {
    throw 'You must provide a value to the update-scroll function';
  }

  if (axis === 'top' && value <= 0) {
    element.scrollTop = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-y-reach-start'));
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-x-reach-start'));
  }

  var i = instances.get(element);

  if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
    // don't allow scroll past container
    value = i.contentHeight - i.containerHeight;
    if (value - element.scrollTop <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollTop;
    } else {
      element.scrollTop = value;
    }
    element.dispatchEvent(createDOMEvent('ps-y-reach-end'));
  }

  if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
    // don't allow scroll past container
    value = i.contentWidth - i.containerWidth;
    if (value - element.scrollLeft <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollLeft;
    } else {
      element.scrollLeft = value;
    }
    element.dispatchEvent(createDOMEvent('ps-x-reach-end'));
  }

  if (!lastTop) {
    lastTop = element.scrollTop;
  }

  if (!lastLeft) {
    lastLeft = element.scrollLeft;
  }

  if (axis === 'top' && value < lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-up'));
  }

  if (axis === 'top' && value > lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-down'));
  }

  if (axis === 'left' && value < lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-left'));
  }

  if (axis === 'left' && value > lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-right'));
  }

  if (axis === 'top') {
    element.scrollTop = lastTop = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-y'));
  }

  if (axis === 'left') {
    element.scrollLeft = lastLeft = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-x'));
  }

};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DOM = {};

DOM.e = function (tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
};

DOM.appendTo = function (child, parent) {
  parent.appendChild(child);
  return child;
};

function cssGet(element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

function cssSet(element, styleName, styleValue) {
  if (typeof styleValue === 'number') {
    styleValue = styleValue.toString() + 'px';
  }
  element.style[styleName] = styleValue;
  return element;
}

function cssMultiSet(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val.toString() + 'px';
    }
    element.style[key] = val;
  }
  return element;
}

DOM.css = function (element, styleNameOrObject, styleValue) {
  if (typeof styleNameOrObject === 'object') {
    // multiple set with object
    return cssMultiSet(element, styleNameOrObject);
  } else {
    if (typeof styleValue === 'undefined') {
      return cssGet(element, styleNameOrObject);
    } else {
      return cssSet(element, styleNameOrObject, styleValue);
    }
  }
};

DOM.matches = function (element, query) {
  if (typeof element.matches !== 'undefined') {
    return element.matches(query);
  } else {
    if (typeof element.matchesSelector !== 'undefined') {
      return element.matchesSelector(query);
    } else if (typeof element.webkitMatchesSelector !== 'undefined') {
      return element.webkitMatchesSelector(query);
    } else if (typeof element.mozMatchesSelector !== 'undefined') {
      return element.mozMatchesSelector(query);
    } else if (typeof element.msMatchesSelector !== 'undefined') {
      return element.msMatchesSelector(query);
    }
  }
};

DOM.remove = function (element) {
  if (typeof element.remove !== 'undefined') {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

DOM.queryChildren = function (element, selector) {
  return Array.prototype.filter.call(element.childNodes, function (child) {
    return DOM.matches(child, selector);
  });
};

module.exports = DOM;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};




	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.3.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc, node );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		div.style.position = "absolute";
		scrollboxSizeVal = div.offsetWidth === 36 || "absolute";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) );
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),
		val = curCSS( elem, dimension, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox;

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = valueIsBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ dimension ] );

	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	if ( val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) {

		val = elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ];

		// offsetWidth/offsetHeight provide border-box values
		valueIsBorderBox = true;
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),
				isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra && boxModelAdjustment(
					elem,
					dimension,
					extra,
					isBorderBox,
					styles
				);

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && support.scrollboxSize() === styles.position ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = Date.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function oldAdd(element, className) {
  var classes = element.className.split(' ');
  if (classes.indexOf(className) < 0) {
    classes.push(className);
  }
  element.className = classes.join(' ');
}

function oldRemove(element, className) {
  var classes = element.className.split(' ');
  var idx = classes.indexOf(className);
  if (idx >= 0) {
    classes.splice(idx, 1);
  }
  element.className = classes.join(' ');
}

exports.add = function (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    oldAdd(element, className);
  }
};

exports.remove = function (element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    oldRemove(element, className);
  }
};

exports.list = function (element) {
  if (element.classList) {
    return Array.prototype.slice.apply(element.classList);
  } else {
    return element.className.split(' ');
  }
};


/***/ }),
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__jApp_jApp_class__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__jUtility_jUtility_class__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__jInput_jInput_class__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__jForm_jForm_class__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__jGrid_jGrid_class__ = __webpack_require__(74);
// prereqs








if (!window.$ || !window.jQuery) {
    window.$ = window.jQuery = __WEBPACK_IMPORTED_MODULE_0_jquery___default.a;
}
$.validator = __webpack_require__(13);
$.fn.bootpag = __webpack_require__(14);

// vendor libraries
__webpack_require__(15);
__webpack_require__(16);
__webpack_require__(43);
__webpack_require__(59);

// functions
__webpack_require__(17);

window.jApp = new __WEBPACK_IMPORTED_MODULE_1__jApp_jApp_class__["a" /* default */]();
window.jUtility = __WEBPACK_IMPORTED_MODULE_2__jUtility_jUtility_class__["a" /* default */];
window.jInput = __WEBPACK_IMPORTED_MODULE_3__jInput_jInput_class__["a" /* default */];
window.jForm = __WEBPACK_IMPORTED_MODULE_4__jForm_jForm_class__["a" /* default */];
window.jGrid = __WEBPACK_IMPORTED_MODULE_5__jGrid_jGrid_class__["a" /* default */];

// test form
window.editFrm = {
    model: 'Group',
    table: 'groups',
    pkey: 'id',
    tableFriendly: 'Group',
    atts: { method: 'PATCH' }
};

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 *  jquery.validator.js - Custom Form Validation JS class
 *
 *  Client-side form validation class
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *
 */

module.exports = function(frm) {

		//initialize values
		this.errMsg = {
			'Anything'		: 'Please enter something.',
			'file' 			: 'Please select a file.',
			'Number' 		: 'Please enter a number.',
			'Integer' 		: 'Please enter an integer.',
			'Email Address' : 'Please enter an email address.',
			'Zip Code'		: 'Please enter a valid 5-digit or 9-digit US zip code.',
			'Phone Number'	: 'Please enter a valid 10-digit phone number.',
			'US State'		: 'Please enter a valid US State abbreviation.',
			'Credit Card'	: 'Please enter a valid credit card number.',
			'IPV4'			: 'Please enter a valid IPV4 IP address',
			'base64'		: 'Please enter a valid base64 encoded string.',
			'SSN'			: 'Please enter a valid social security number.',
			'color'			: 'Please emter a valid 6-digit hex color code or color keyword.',
			'checkbox'		: 'Please check the box',
			'radio'			: 'Please check one of the options.',
			'select'		: 'Please select a value from the dropdown.',
			'min>='			: 'Field value must be at least [val] characters long.',
			'max<='			: 'Field value must be at most [val] characters long.',
			'min_val>='		: 'Field value must be >= [val].',
			'max_val<='		: 'Field value must be <= [val].',
			'exact=='		: 'Field value must be exactly [val] characters long.',
			'between=='		: 'Field value must be between [val]',
			'date_gt_'		: 'Date must be after [val].',
			'date_lt_'		: 'Date must be before [val].',
			'date_eq_'		: 'Date must match [val]',
			'datetime_gt_'	: 'Date and Time must be after [val].',
			'datetime_lt_'	: 'Date and Time must be before [val].',
			'datetime_eq_'	: 'Date and Time must match [val]',
			'field=='		: 'Field must match [val]',
			'default'		: 'Please correct this field.'
		};

		this.regExp = {
			'Anything'		: /^.+$/,
			'file'			: /^.+$/,
			'Number' 		: /^[0-9.]+$/,
			'Integer'		: /^[0-9]+$/,
			'Email Address' : /^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+.)+([a-zA-Z0-9]{2,4})+$/,
			'Zip Code' 		: /^\d{5}([\-]\d{4})?$/,
			'Phone Number'	: /^\(?(\d{3})\)?[\- ]?(\d{3})[\- ]?(\d{4})$/,
			'IPV4'			: /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/,
			'base64'		: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
			'SSN'			: /^\d{3}-\d{2}-\d{4}$/,
			'color'			: /^#[0-9A-F]{6}$/i

		};

		//this.frm = frm;
		this.$frm = frm;
		this.$elms = this.$frm.find('[data-validType]');
		this.errorState = false;
		this.errorClass = 'has-error';
		this.validClass = 'has-success';


		//declare vars
		var self = this;
		var $frm = this.$frm;
		var elm_valid;
		var checkedFields = [];

		// declare functions
		this.fn = {

			/**  **  **  **  **  **  **  **  **  **
			 *   validateForm
			 *
			 *  Iterates through all the form
			 *  elements with a data-validType defined
			 *
			 **  **  **  **  **  **  **  **  **  **/
			validateForm : function() {
				// reset errorState
				self.errorState = false;
				$.noty.closeAll()

				$.each(self.$elms, function($i,elm) {
					console.log('validating ' + $(elm).attr('name'));
					if ($.inArray( $(elm).attr('name'), checkedFields) === -1) {
						elm_valid = self.fn.validateField( $(elm) );
						if ( elm_valid ) { // field is valid
							console.log('valid ' + $(elm).attr('name'));
							self.fn.removeError( $(elm) );
						}
					}
					else {
						console.log($(elm).attr('name') + ' has been checked already.');
					}
				});

				if (self.errorState === true) {
					var n = noty( {
						text: '<strong>Error </strong> Please correct the errors before continuing.',
						layout: 'top',
						type: 'error',
						//timeout: 5000
					});
				}
			}, //end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   validateField
			 *
			 *  Checks element value against
			 *  valid pattern and determines
			 *  if it validates.
			 *
			 **  **  **  **  **  **  **  **  **  **/
			validateField : function($elm) {

				var cats  = $elm.attr('data-validType').split(', ');
				var type = $elm.attr('type');
				var elmValid = false;
				var val = $.isArray( $elm.val() ) ? $elm.val() : !! $elm.val() ? $elm.val().trim() : '';
				var required = $elm.attr('required') != 'required' ? false : true;

				// check some conditions before validating input: if element is disabled or blank and not required, then return valid
				if ( $elm.prop('disabled') || $elm.hasClass('disabled') || ( !required && !val ) ) {
					return true;
				}

				$.each(cats, function(i,cat) {
					console.log('Testing element data-validType=' + cat);
					switch (cat) {

						case 'Anything' :
						case 'file' :
						case 'Number' :
						case 'Integer' :
						case 'Email Address' :
						case 'Zip Code' :
						case 'Phone Number' :
						case 'IPV4' :
						case 'base64' :
						case 'SSN' :
							elmValid = Boolean( val.match( self.regExp[cat] ) || ( !required && !val ) );
						break;

						case 'color' :
							var colorNames = [
								// Colors start with A
								'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
								// B
								'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood',
								// C
								'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
								// D
								'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta',
								'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
								'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray',
								'dimgrey', 'dodgerblue',
								// F
								'firebrick', 'floralwhite', 'forestgreen', 'fuchsia',
								// G
								'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
								// H
								'honeydew', 'hotpink',
								// I
								'indianred', 'indigo', 'ivory',
								// K
								'khaki',
								// L
								'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
								'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen',
								'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen',
								'linen',
								// M
								'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
								'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
								'mistyrose', 'moccasin',
								// N
								'navajowhite', 'navy',
								// O
								'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid',
								// P
								'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink',
								'plum', 'powderblue', 'purple',
								// R
								'red', 'rosybrown', 'royalblue',
								// S
								'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue',
								'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue',
								// T
								'tan', 'teal', 'thistle', 'tomato', 'transparent', 'turquoise',
								// V
								'violet',
								// W
								'wheat', 'white', 'whitesmoke',
								// Y
								'yellow', 'yellowgreen'
							];

							elmValid = Boolean( val.match( self.regExp[cat] ) || $.inArray(val,colorNames) != -1 || ( !required && !val ) );
						break;

						case 'Credit Card' :
							if (/[^0-9-\s]+/.test(val)) {
								return false;
							}
							val = val.replace(/\D/g, '');

							// Validate the card number based on prefix (IIN ranges) and length
							var cards = {
								AMERICAN_EXPRESS: {
									length: [15],
									prefix: ['34', '37']
								},
								DINERS_CLUB: {
									length: [14],
									prefix: ['300', '301', '302', '303', '304', '305', '36']
								},
								DINERS_CLUB_US: {
									length: [16],
									prefix: ['54', '55']
								},
								DISCOVER: {
									length: [16],
									prefix: ['6011', '622126', '622127', '622128', '622129', '62213',
											 '62214', '62215', '62216', '62217', '62218', '62219',
											 '6222', '6223', '6224', '6225', '6226', '6227', '6228',
											 '62290', '62291', '622920', '622921', '622922', '622923',
											 '622924', '622925', '644', '645', '646', '647', '648',
											 '649', '65']
								},
								JCB: {
									length: [16],
									prefix: ['3528', '3529', '353', '354', '355', '356', '357', '358']
								},
								LASER: {
									length: [16, 17, 18, 19],
									prefix: ['6304', '6706', '6771', '6709']
								},
								MAESTRO: {
									length: [12, 13, 14, 15, 16, 17, 18, 19],
									prefix: ['5018', '5020', '5038', '6304', '6759', '6761', '6762', '6763', '6764', '6765', '6766']
								},
								MASTERCARD: {
									length: [16],
									prefix: ['51', '52', '53', '54', '55']
								},
								SOLO: {
									length: [16, 18, 19],
									prefix: ['6334', '6767']
								},
								UNIONPAY: {
									length: [16, 17, 18, 19],
									prefix: ['622126', '622127', '622128', '622129', '62213', '62214',
											 '62215', '62216', '62217', '62218', '62219', '6222', '6223',
											 '6224', '6225', '6226', '6227', '6228', '62290', '62291',
											 '622920', '622921', '622922', '622923', '622924', '622925']
								},
								VISA: {
									length: [16],
									prefix: ['4']
								}
							};

							var type, i;
							loop1:
							for (type in cards) {
								loop2:
								for (i in cards[type].prefix) {
									if (value.substr(0, cards[type].prefix[i].length) === cards[type].prefix[i]     // Check the prefix
										&& $.inArray(value.length, cards[type].length) !== -1)                      // and length
									{
										elmValid = true;
										break loop1;
									}
								}
							}

						break;


						case 'US State'	:
							var stateAbbrevs = ["AL","AK","AS","AZ","AR",
												"CA","CO","CT","DE","DC",
												"FM","FL","GA","GU","HI",
												"ID","IL","IN","IA","KS",
												"KY","LA","ME","MH","MD",
												"MA","MI","MN","MS","MO",
												"MT","NE","NV","NH","NJ",
												"NM","NY","NC","ND","MP",
												"OH","OK","OR","PW","PA",
												"PR","RI","SC","SD","TN",
												"TX","UT","VT","VI","VA",
												"WA","WV","WI","WY"];
							elmValid = Boolean( $.inArray(val.toUpperCase(), stateAbbrevs) !== -1 );
						break;

						case 'checkbox' :
							var min = Number( $elm.attr('min') );
							var max = Number( $elm.attr('max') );
							var numSelected = Number( $frm.find('input[name="' + $elm.attr('name') + '"]').filter(':checked').length );
							if (!min && !max) {
								elmValid = Boolean( !!numSelected || !required );
								self.errMsg.checkbox = 'Please check the box.';
							} else {

								console.log
								console.log('selected ' + numSelected);
								if (min > 0 && max > 0) {
									if ( min==max ) {
										elmValid = Boolean( numSelected === min );
										self.errMsg.checkbox = (min == 1) ? 'Please check an option.' : 'Please check exactly ' + min + ' options.';
									}
									else {
										elmValid = Boolean( numSelected >= min && numSelected <= max);
										self.errMsg.checkbox = 'Please check ' + min + '-' + max + ' options.';
									}
								} else if (min > 0) {
									elmValid = Boolean( numSelected >= min );
									self.errMsg.checkbox = 'Please check at least ' + min + ' options.';
								} else if (max > 0) {
									elmValid = Boolean( numSelected <= max );
									self.errMsg.checkbox = 'Please check at most ' + max + ' options.';
								}
							}

						break;

						case 'radio' :
							var name = $elm.attr('name');
							elmValid = Boolean(!required || $frm.find('[name='+name+']:checked').length > 0 );
						break;

						case 'select' :
							var min = Number( $elm.attr('min') );
							var max = Number( $elm.attr('max') );

							if (!min && !max) {
								elmValid = Boolean(!required || Number($elm.prop('selectedIndex') ) );
								self.errMsg.select = 'Please select a value from the dropdown.';
							}
							else {
								var numSelected = $elm.find('option').filter(':selected').length;
								console.log('selected ' + numSelected);
								if (min > 0 && max > 0) {
									if ( min==max ) {
										elmValid = Boolean( numSelected === min );
										self.errMsg.select = (min == 1) ? 'Please select a value from the dropdown.' : 'Please select exactly ' + min + ' values from the dropdown';
									}
									else {
										elmValid = Boolean( numSelected >= min && numSelected <= max);
										self.errMsg.select = 'Please select ' + min + '-' + max + ' values from the dropdown';
									}
								} else if (min > 0) {
									elmValid = Boolean( numSelected >= min );
									self.errMsg.select = 'Please select at least ' + min + ' values from the dropdown';
								} else if (max > 0) {
									elmValid = Boolean( numSelected <= max );
									self.errMsg.select = 'Please select at most ' + max + ' values from the dropdown';
								}
							}

						break;

						default :

							// minimum characters.
							if (cat.indexOf('min>=') != -1) {
								var min_chars = Number(cat.replace('min>=',''));
								elmValid = Boolean(val.length >= min_chars);
							}

							// maxiumum characters.
							else if (cat.indexOf('max<=') != -1) {
								var max_chars = Number(cat.replace('max<=',''));
								elmValid = required ? Boolean(val.length <= max_chars && val.length > 0) : Boolean(val.length <= max_chars);
							}

							// minimum value.
							else if (cat.indexOf('min_val>=') != -1) {
								var min_val = Number(cat.replace('min_val>=',''));
								elmValid = Boolean( Number(val ) >= min_val);
							}

							// maximum value.
							else if (cat.indexOf('max_val<=') != -1) {
								var max_val = Number(cat.replace('max_val<=',''));
								elmValid = required ? Boolean( Number(val) <= max_val && val.length > 0) : Boolean( Number(val) <= max_val);
							}

							// exact number of characters.
							else if (cat.indexOf('exact==') != -1) {
								var ex_chars = Number(cat.replace('exact==','') );
								elmValid = Boolean(val.length == ex_chars);
							}

							// between two values
							else if (cat.indexOf('between==') != -1) {
								var lo_hi = cat.replace('between==','');
								var lo = Number( lo_hi.split(',')[0] );
								var hi = Number( lo_hi.split(',')[1] );
								var $val = Number(val);
								elmValid = Boolean( $val >= lo && $val <= hi);
							}

							// field must be equal/greater/less than date.
							else if (cat.indexOf('date_gt_') != -1 || cat.indexOf('date_lt_') != -1 || cat.indexOf('date_eq_') != -1 ) {
								var yr,mo,da,hr,mn,date2midnight,date1midnight,date1,date1_val;
								var date2 = cat.replace('date_gt_','').replace('date_lt_','').replace('date_eq_','');
								console.log(date2);
								var date2_val = ( $frm.find(date2).length > 0 ) ? $frm.find(date2).val().trim() : date2.trim();

								switch(date2_val) {
									case 'today' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = today.getDate();
										hr = "00";
										mn = "00";
									break;

									case 'yesterday' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()-1);
										hr = "00";
										mn = "00";
									break;

									case 'tomorrow' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()+1);
										hr = "00";
										mn = "00";
									break;

									default :
										yr = date2_val.substr(0,4);
										mo = Number(date2_val.substr(5,2)-1);
										da = date2_val.substr(8,2);
										hr = "00";
										mn = "00";
									break;
								}

								// Calculate date2 - YYYY-MM-DD HH:II
								date2 = Date.UTC(yr,mo,da,hr,mn);
								console.log(date2midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);

								date1_val = val;
								// Calculate date1
								yr = date1_val.substr(0,4);
								mo = Number(date1_val.substr(5,2)-1);
								da = date1_val.substr(8,2);
								hr = "00";
								mn = "00";
								date1 = Date.UTC(yr,mo,da,hr,mn);
								console.log(date1midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);


								var date2_required = ( $frm.find(date2).length == 0 || $frm.find(date2).attr('required') != 'required' ) ? false : true;
								if (cat.indexOf('_gt_') !== -1 ) {
									// >
									elmValid = Boolean(date1 > date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else if (cat.indexOf('_lt_') !== -1 ) {
									// <
									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else {
									// ==

									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) );
								}

								//elmValid = $is_gt ? Boolean(date1 > date2 || ( $frm.find(date2).attr('required') != 'required' && String(val.trim()) != '' && String( date2_val.trim() ) == '') ) : Boolean(date2 > date1 || ( $frm.find(date2).attr('required') != 'required' && String( val.trim() ) != '' && String( date2_val.trim() ) == '') );
							}

							// field must be equal/greater/less than date with time.
							else if (cat.indexOf('datetime_gt_') != -1 || cat.indexOf('datetime_lt_') != -1 || cat.indexOf('datetime_eq_') != -1 ) {
								var yr,mo,da,hr,mn,date2midnight,date1midnight,date1,date1_val;
								var date2 = cat.replace('datetime_gt_','').replace('datetime_lt_','').replace('datetime_eq_','');
								console.log(date2);
								var date2_val = ( $frm.find(date2).length > 0 ) ? $frm.find(date2).val().trim() : date2.trim();

								switch(date2_val) {
									case 'today' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = today.getDate();
										hr = today.getHours();
										mn = today.getMinutes();
									break;

									case 'yesterday' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()-1);
										hr = today.getHours();
										mn = today.getMinutes();
									break;

									case 'tomorrow' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()+1);
										hr = today.getHours();
										mn = today.getMinutes();
									break;

									default :
										yr = date2_val.substr(0,4);
										mo = Number(date2_val.substr(5,2)-1);
										da = date2_val.substr(8,2);
										hr = date2_val.substr(11,2);
										mn = date2_val.substr(14,2);
									break;
								}

								// Calculate date2 - YYYY-MM-DD HH:II
								date2 = Date.UTC(yr,mo,da,hr,mn);
								date2midnight = Date.UTC(yr,mo,da,0,0);
								console.log(date2midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);

								date1_val = val;
								// Calculate date1
								yr = date1_val.substr(0,4);
								mo = Number(date1_val.substr(5,2)-1);
								da = date1_val.substr(8,2);
								hr = date1_val.substr(11,2);
								mn = date1_val.substr(14,2);
								date1 = Date.UTC(yr,mo,da,hr,mn);
								date1midnight = Date.UTC(yr,mo,da,0,0)
								console.log(date1midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);


								var date2_required = ( $frm.find(date2).length == 0 || $frm.find(date2).attr('required') != 'required' ) ? false : true;
								if (cat.indexOf('_gt_') !== -1 ) {
									// >
									elmValid = Boolean(date1 > date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else if (cat.indexOf('_lt_') !== -1 ) {
									// <
									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else {
									// ==
									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) );
								}

								//elmValid = $is_gt ? Boolean(date1 > date2 || ( $frm.find(date2).attr('required') != 'required' && String(val.trim()) != '' && String( date2_val.trim() ) == '') ) : Boolean(date2 > date1 || ( $frm.find(date2).attr('required') != 'required' && String( val.trim() ) != '' && String( date2_val.trim() ) == '') );
							}

							// field must match other field.
							else if (cat.indexOf('field==') != -1) {
								var pw1_name = cat.replace('field==','');
								var $pw1 = $frm.find( pw1_name );
								elmValid = Boolean(val == $pw1.val() );
							}

							// must be in list.
							else {
								var patterns = cat.toLowerCase().split('|');
								elmValid = Boolean( $.inArray(val.toLowerCase(), patterns) !== -1 );
							}
						break;
					} // end switch

					// put this element in the checkedFields array so it won't be checked again this iteration.
					checkedFields.push( $elm.attr('name')  );

					// report error if necessary
					if (!elmValid) {
						self.fn.raiseError( $elm, cat );
						self.errorState = true;
						return false;
					}

				}); // end each

				return elmValid;
			}, // end fn


			/**  **  **  **  **  **  **  **  **  **
			 *   isArray
			 *  @obj - object to check
			 *
			 *  Determines if input object is
			 *  an array
			 **  **  **  **  **  **  **  **  **  **/
			isArray : function(obj) {
				return Boolean( obj.constructor.toString().indexOf("Array") !== -1 );
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   oc
			 *  @arrayOrArgs - object/argument list
			 *
			 *  Creates a single-dimensional array
			 *  from the input array/object/args
			 **  **  **  **  **  **  **  **  **  **/
			oc : function(arrayOrArgs) {
				var o = {};
				var a = ( self.fn.isArray(arrayOrArgs)) ? arrayOrArgs : arguments;
				var i;
				for(i=0;i<a.length;i++) {
					o[a[i]]='';
				}
				return o;
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   raiseError
			 *  @elm - Form Element
			 *
			 *  Raises an error message for an invalid
			 *  form element.
			 **  **  **  **  **  **  **  **  **  **/
			raiseError : function($elm,$cat) {
				var $err_msg, $search, $replace;
				var $elmid = $elm.attr('id');
				var $label = $("label[for='"+$elmid+"']").html();
				var val = $.isArray( $elm.val() ) ? $elm.val() : !! $elm.val() ? $elm.val().trim() : '';
				//var $cat = arguments[1] || $elm.attr('data-validType');
				var $err_index = -1;
				console.log($elm[0].nodeName + ' ' + $elm.attr('name') + ' invalid ');
				console.log($elm.closest('.form_element'));
				$elm.closest('.form_element').addClass( self.errorClass );
				$elm.psiblings('.form-control-feedback').addClass('glyphicon-remove').removeClass('glyphicon-ok').show();
				$.each( self.errMsg, function($i,$val) {
					if ($cat.indexOf($i) !== -1) {
						$err_index = $i;
					}
				});

				if ($err_index == -1) {
					$err_index = 'default';
				}
				$err_msg = ($elm.attr('required') == 'required' && !val && $cat != 'select' && $cat != 'file' && $cat != 'checkbox' && $cat != 'radio') ?
					'[' + $label + '] : ' + 'Please enter something.' :
					'[' + $label + '] : ' + self.errMsg[$err_index];
				$search = '[val]';
				$replace = $cat.replace($err_index,'');

				try {
					if ( $($replace).length > 0 ) {
						$replace = $("label[for='" + $replace.substr(1) + "']").html();
					}
				} catch(e) {
					console.warn('Validator Class : Exception Caught')
				}
				$err_msg = $err_msg.replace($search,$replace);

				/* var n = noty( {
					text: '<strong>Error </strong> ' + $err_msg,
					layout: 'top',
					type: 'error',
					//timeout: 5000
				});  */
				$elm.psiblings('.help-block').html( $err_msg.replace('[' + $label + '] : ','') ).fadeIn('fast');
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   removeError
			 *  @elm - Form Element
			 *
			 *  Removes an error message for an invalid
			 *  form element.
			 **  **  **  **  **  **  **  **  **  **/
			removeError : function($elm) {
				$elm.closest('.form_element').removeClass( self.errorClass )
				$elm.psiblings('.form-control-feedback').removeClass('glyphicon-remove');
				$elm.psiblings('.help-block').html('').hide();

				//add success class if not a disabled element.
				if (!( $elm.prop('disabled') || $elm.hasClass('disabled') ) ) {
					$elm.psiblings('.form-control-feedback').addClass('glyphicon-ok').show().end()
						.closest('.form_element').addClass( self.validClass );
				}
			} //end fn

		}; //end fns


		// perform the validation
		//$.noty.closeAll(); // close all notifications
		this.fn.validateForm();

	}


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * @preserve
 * bootpag - jQuery plugin for dynamic pagination
 *
 * Copyright (c) 2015 botmonster@7items.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://botmonster.com/jquery-bootpag/
 *
 * Version:  1.0.7
 *
 */
(function ($, window) {

    $.fn.bootpag = function (options) {

        var $owner = this,
            settings = $.extend({
            total: 0,
            page: 1,
            maxVisible: null,
            leaps: true,
            href: 'javascript:void(0);',
            hrefVariable: '{{number}}',
            next: '&raquo;',
            prev: '&laquo;',
            firstLastUse: false,
            first: '<span aria-hidden="true">&larr;</span>',
            last: '<span aria-hidden="true">&rarr;</span>',
            wrapClass: 'pagination',
            activeClass: 'active',
            disabledClass: 'disabled',
            nextClass: 'next',
            prevClass: 'prev',
            lastClass: 'last',
            firstClass: 'first'
        }, $owner.data('settings') || {}, options || {});

        if (settings.total <= 0) return this;

        if (!$.isNumeric(settings.maxVisible) && !settings.maxVisible) {
            settings.maxVisible = parseInt(settings.total, 10);
        }

        $owner.data('settings', settings);

        function renderPage($bootpag, page) {

            page = parseInt(page, 10);
            var lp,
                maxV = settings.maxVisible == 0 ? 1 : settings.maxVisible,
                step = settings.maxVisible == 1 ? 0 : 1,
                vis = Math.floor((page - 1) / maxV) * maxV,
                $page = $bootpag.find('li');
            settings.page = page = page < 0 ? 0 : page > settings.total ? settings.total : page;
            $page.removeClass(settings.activeClass);
            lp = page - 1 < 1 ? 1 : settings.leaps && page - 1 >= settings.maxVisible ? Math.floor((page - 1) / maxV) * maxV : page - 1;

            if (settings.firstLastUse) {
                $page.first().toggleClass(settings.disabledClass, page === 1);
            }

            var lfirst = $page.first();
            if (settings.firstLastUse) {
                lfirst = lfirst.next();
            }

            lfirst.toggleClass(settings.disabledClass, page === 1).attr('data-lp', lp).find('a').attr('href', href(lp));

            var step = settings.maxVisible == 1 ? 0 : 1;

            lp = page + 1 > settings.total ? settings.total : settings.leaps && page + 1 < settings.total - settings.maxVisible ? vis + settings.maxVisible + step : page + 1;

            var llast = $page.last();
            if (settings.firstLastUse) {
                llast = llast.prev();
            }

            llast.toggleClass(settings.disabledClass, page === settings.total).attr('data-lp', lp).find('a').attr('href', href(lp));

            $page.last().toggleClass(settings.disabledClass, page === settings.total);

            var $currPage = $page.filter('[data-lp=' + page + ']');

            var clist = "." + [settings.nextClass, settings.prevClass, settings.firstClass, settings.lastClass].join(",.");
            if (!$currPage.not(clist).length) {
                var d = page <= vis ? -settings.maxVisible : 0;
                $page.not(clist).each(function (index) {
                    lp = index + 1 + vis + d;
                    $(this).attr('data-lp', lp).toggle(lp <= settings.total).find('a').html(lp).attr('href', href(lp));
                });
                $currPage = $page.filter('[data-lp=' + page + ']');
            }
            $currPage.not(clist).addClass(settings.activeClass);
            $owner.data('settings', settings);
        }

        function href(c) {

            return settings.href.replace(settings.hrefVariable, c);
        }

        return this.each(function () {

            var $bootpag,
                lp,
                me = $(this),
                p = ['<ul class="', settings.wrapClass, ' bootpag">'];

            if (settings.firstLastUse) {
                p = p.concat(['<li data-lp="1" class="', settings.firstClass, '"><a href="', href(1), '">', settings.first, '</a></li>']);
            }
            if (settings.prev) {
                p = p.concat(['<li data-lp="1" class="', settings.prevClass, '"><a href="', href(1), '">', settings.prev, '</a></li>']);
            }
            for (var c = 1; c <= Math.min(settings.total, settings.maxVisible); c++) {
                p = p.concat(['<li data-lp="', c, '"><a href="', href(c), '">', c, '</a></li>']);
            }
            if (settings.next) {
                lp = settings.leaps && settings.total > settings.maxVisible ? Math.min(settings.maxVisible + 1, settings.total) : 2;
                p = p.concat(['<li data-lp="', lp, '" class="', settings.nextClass, '"><a href="', href(lp), '">', settings.next, '</a></li>']);
            }
            if (settings.firstLastUse) {
                p = p.concat(['<li data-lp="', settings.total, '" class="last"><a href="', href(settings.total), '">', settings.last, '</a></li>']);
            }
            p.push('</ul>');
            me.find('ul.bootpag').remove();
            me.append(p.join(''));
            $bootpag = me.find('ul.bootpag');

            me.find('li').click(function paginationClick() {

                var me = $(this);
                if (me.hasClass(settings.disabledClass) || me.hasClass(settings.activeClass)) {
                    return;
                }
                var page = parseInt(me.attr('data-lp'), 10);
                $owner.find('ul.bootpag').each(function () {
                    renderPage($(this), page);
                });

                $owner.trigger('page', page);
            });
            renderPage($bootpag, settings.page);
        });
    };
})(jQuery, window);

/***/ }),
/* 15 */
/***/ (function(module, exports) {

/** jQuery md5()
  * Encodes a string in MD5
  * @author Gabriele Romanato <http://blog.gabrieleromanato.com>
  * @requires jQuery 1.4+
  * Usage $.md5(string)
  */

(function ($) {

        $.md5 = function (string) {

                function RotateLeft(lValue, iShiftBits) {
                        return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
                }

                function AddUnsigned(lX, lY) {
                        var lX4, lY4, lX8, lY8, lResult;
                        lX8 = lX & 0x80000000;
                        lY8 = lY & 0x80000000;
                        lX4 = lX & 0x40000000;
                        lY4 = lY & 0x40000000;
                        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                        if (lX4 & lY4) {
                                return lResult ^ 0x80000000 ^ lX8 ^ lY8;
                        }
                        if (lX4 | lY4) {
                                if (lResult & 0x40000000) {
                                        return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
                                } else {
                                        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
                                }
                        } else {
                                return lResult ^ lX8 ^ lY8;
                        }
                }

                function F(x, y, z) {
                        return x & y | ~x & z;
                }
                function G(x, y, z) {
                        return x & z | y & ~z;
                }
                function H(x, y, z) {
                        return x ^ y ^ z;
                }
                function I(x, y, z) {
                        return y ^ (x | ~z);
                }

                function FF(a, b, c, d, x, s, ac) {
                        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
                        return AddUnsigned(RotateLeft(a, s), b);
                };

                function GG(a, b, c, d, x, s, ac) {
                        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
                        return AddUnsigned(RotateLeft(a, s), b);
                };

                function HH(a, b, c, d, x, s, ac) {
                        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
                        return AddUnsigned(RotateLeft(a, s), b);
                };

                function II(a, b, c, d, x, s, ac) {
                        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
                        return AddUnsigned(RotateLeft(a, s), b);
                };

                function ConvertToWordArray(string) {
                        var lWordCount;
                        var lMessageLength = string.length;
                        var lNumberOfWords_temp1 = lMessageLength + 8;
                        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
                        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                        var lWordArray = Array(lNumberOfWords - 1);
                        var lBytePosition = 0;
                        var lByteCount = 0;
                        while (lByteCount < lMessageLength) {
                                lWordCount = (lByteCount - lByteCount % 4) / 4;
                                lBytePosition = lByteCount % 4 * 8;
                                lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
                                lByteCount++;
                        }
                        lWordCount = (lByteCount - lByteCount % 4) / 4;
                        lBytePosition = lByteCount % 4 * 8;
                        lWordArray[lWordCount] = lWordArray[lWordCount] | 0x80 << lBytePosition;
                        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                        return lWordArray;
                };

                function WordToHex(lValue) {
                        var WordToHexValue = "",
                            WordToHexValue_temp = "",
                            lByte,
                            lCount;
                        for (lCount = 0; lCount <= 3; lCount++) {
                                lByte = lValue >>> lCount * 8 & 255;
                                WordToHexValue_temp = "0" + lByte.toString(16);
                                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                        }
                        return WordToHexValue;
                };

                function Utf8Encode(string) {
                        string = string.replace(/\r\n/g, "\n");
                        var utftext = "";

                        for (var n = 0; n < string.length; n++) {

                                var c = string.charCodeAt(n);

                                if (c < 128) {
                                        utftext += String.fromCharCode(c);
                                } else if (c > 127 && c < 2048) {
                                        utftext += String.fromCharCode(c >> 6 | 192);
                                        utftext += String.fromCharCode(c & 63 | 128);
                                } else {
                                        utftext += String.fromCharCode(c >> 12 | 224);
                                        utftext += String.fromCharCode(c >> 6 & 63 | 128);
                                        utftext += String.fromCharCode(c & 63 | 128);
                                }
                        }

                        return utftext;
                };

                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11 = 7,
                    S12 = 12,
                    S13 = 17,
                    S14 = 22;
                var S21 = 5,
                    S22 = 9,
                    S23 = 14,
                    S24 = 20;
                var S31 = 4,
                    S32 = 11,
                    S33 = 16,
                    S34 = 23;
                var S41 = 6,
                    S42 = 10,
                    S43 = 15,
                    S44 = 21;

                string = Utf8Encode(string);

                x = ConvertToWordArray(string);

                a = 0x67452301;b = 0xEFCDAB89;c = 0x98BADCFE;d = 0x10325476;

                for (k = 0; k < x.length; k += 16) {
                        AA = a;BB = b;CC = c;DD = d;
                        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                        a = AddUnsigned(a, AA);
                        b = AddUnsigned(b, BB);
                        c = AddUnsigned(c, CC);
                        d = AddUnsigned(d, DD);
                }

                var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

                return temp.toLowerCase();
        };
})(jQuery);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(root, factory) {
	 if (true) {
		 !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	 } else if (typeof exports === 'object') {
		 module.exports = factory(require('jquery'));
	 } else {
		 factory(root.jQuery);
	 }
}(this, function($) {

/*!
 @package noty - jQuery Notification Plugin
 @version version: 2.4.1
 @contributors https://github.com/needim/noty/graphs/contributors

 @documentation Examples and Documentation - http://needim.github.com/noty/

 @license Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php
 */

if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {
    }

    F.prototype = o;
    return new F();
  };
}

var NotyObject = {

  init: function (options) {

    // Mix in the passed in options with the default options
    this.options = $.extend({}, $.noty.defaults, options);

    this.options.layout = (this.options.custom) ? $.noty.layouts['inline'] : $.noty.layouts[this.options.layout];

    if ($.noty.themes[this.options.theme]) {
      this.options.theme = $.noty.themes[this.options.theme];
      if (this.options.theme.template)
        this.options.template = this.options.theme.template;

      if (this.options.theme.animation)
        this.options.animation = this.options.theme.animation;
    }
    else {
      this.options.themeClassName = this.options.theme;
    }

    this.options = $.extend({}, this.options, this.options.layout.options);

    if (this.options.id) {
      if ($.noty.store[this.options.id]) {
        return $.noty.store[this.options.id];
      }
    } else {
      this.options.id = 'noty_' + (new Date().getTime() * Math.floor(Math.random() * 1000000));
    }

    // Build the noty dom initial structure
    this._build();

    // return this so we can chain/use the bridge with less code.
    return this;
  }, // end init

  _build: function () {

    // Generating noty bar
    var $bar = $('<div class="noty_bar noty_type_' + this.options.type + '"></div>').attr('id', this.options.id);
    $bar.append(this.options.template).find('.noty_text').html(this.options.text);

    this.$bar = (this.options.layout.parent.object !== null) ? $(this.options.layout.parent.object).css(this.options.layout.parent.css).append($bar) : $bar;

    if (this.options.themeClassName)
      this.$bar.addClass(this.options.themeClassName).addClass('noty_container_type_' + this.options.type);

    // Set buttons if available
    if (this.options.buttons) {

      var $buttons;
      // Try find container for buttons in presented template, and create it if not found
      if (this.$bar.find('.noty_buttons').length > 0) {
        $buttons = this.$bar.find('.noty_buttons');
      } else {
        $buttons = $('<div/>').addClass('noty_buttons');
        (this.options.layout.parent.object !== null) ? this.$bar.find('.noty_bar').append($buttons) : this.$bar.append($buttons);
      }

      var self = this;

      $.each(this.options.buttons, function (i, button) {
        var $button = $('<button/>').addClass((button.addClass) ? button.addClass : 'gray').html(button.text).attr('id', button.id ? button.id : 'button-' + i)
            .attr('title', button.title)
            .appendTo($buttons)
            .on('click', function (event) {
              if ($.isFunction(button.onClick)) {
                button.onClick.call($button, self, event);
              }
            });
      });
    } else {
      // If buttons is not available, then remove containers if exist
      this.$bar.find('.noty_buttons').remove();
    }

    if (this.options.progressBar && this.options.timeout) {
      var $progressBar = $('<div/>').addClass('noty_progress_bar');
      (this.options.layout.parent.object !== null) ? this.$bar.find('.noty_bar').append($progressBar) : this.$bar.append($progressBar);
    }

    // For easy access
    this.$message     = this.$bar.find('.noty_message');
    this.$closeButton = this.$bar.find('.noty_close');
    this.$buttons     = this.$bar.find('.noty_buttons');
    this.$progressBar = this.$bar.find('.noty_progress_bar');

    $.noty.store[this.options.id] = this; // store noty for api

  }, // end _build

  show: function () {

    var self = this;

    (self.options.custom) ? self.options.custom.find(self.options.layout.container.selector).append(self.$bar) : $(self.options.layout.container.selector).append(self.$bar);

    if (self.options.theme && self.options.theme.style)
      self.options.theme.style.apply(self);

    ($.type(self.options.layout.css) === 'function') ? this.options.layout.css.apply(self.$bar) : self.$bar.css(this.options.layout.css || {});

    self.$bar.addClass(self.options.layout.addClass);

    self.options.layout.container.style.apply($(self.options.layout.container.selector), [self.options.within]);

    self.showing = true;

    if (self.options.theme && self.options.theme.style)
      self.options.theme.callback.onShow.apply(this);

    if ($.inArray('click', self.options.closeWith) > -1)
      self.$bar.css('cursor', 'pointer').on('click', function (evt) {
        self.stopPropagation(evt);
        if (self.options.callback.onCloseClick) {
          self.options.callback.onCloseClick.apply(self);
        }
        self.close();
      });

    if ($.inArray('hover', self.options.closeWith) > -1)
      self.$bar.one('mouseenter', function () {
        self.close();
      });

    if ($.inArray('button', self.options.closeWith) > -1)
      self.$closeButton.one('click', function (evt) {
        self.stopPropagation(evt);
        self.close();
      });

    if ($.inArray('button', self.options.closeWith) == -1)
      self.$closeButton.remove();

    if (self.options.callback.beforeShow)
      self.options.callback.beforeShow.apply(self);

    if (typeof self.options.animation.open == 'string') {
      self.animationTypeOpen = 'css';
      self.$bar.css('min-height', self.$bar.innerHeight());
      self.$bar.on('click', function (e) {
        self.wasClicked = true;
      });
      self.$bar.show();

      if (self.options.callback.onShow)
        self.options.callback.onShow.apply(self);

      self.$bar.addClass(self.options.animation.open).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        if (self.options.callback.afterShow) self.options.callback.afterShow.apply(self);
        self.showing = false;
        self.shown   = true;
        self.bindTimeout();
        if (self.hasOwnProperty('wasClicked')) {
          self.$bar.off('click', function (e) {
            self.wasClicked = true;
          });
          self.close();
        }
      });

    } else if (typeof self.options.animation.open == 'object' && self.options.animation.open == null) {
      self.animationTypeOpen = 'none';
      self.showing           = false;
      self.shown             = true;
      self.$bar.show();
      self.bindTimeout();

      if (self.options.callback.onShow)
        self.options.callback.onShow.apply(self);

      self.$bar.queue(function () {
        if (self.options.callback.afterShow)
          self.options.callback.afterShow.apply(self);
      });

    } else {
      self.animationTypeOpen = 'anim';

      if (self.options.callback.onShow)
        self.options.callback.onShow.apply(self);

      self.$bar.animate(
          self.options.animation.open,
          self.options.animation.speed,
          self.options.animation.easing,
          function () {
            if (self.options.callback.afterShow) self.options.callback.afterShow.apply(self);
            self.showing = false;
            self.shown   = true;
            self.bindTimeout();
          });
    }

    return this;

  }, // end show

  bindTimeout: function () {
    var self = this;

    // If noty is have a timeout option
    if (self.options.timeout) {

      if (self.options.progressBar && self.$progressBar) {
        self.$progressBar.css({
          transition: 'all ' + self.options.timeout + 'ms linear',
          width: '0%'
        });
      }

      self.queueClose(self.options.timeout);
      self.$bar.on('mouseenter', self.dequeueClose.bind(self));
      self.$bar.on('mouseleave', self.queueClose.bind(self, self.options.timeout));
    }

  },

  dequeueClose: function () {
    var self = this;

    if (self.options.progressBar) {
      this.$progressBar.css({
        transition: 'none',
        width: '100%'
      });
    }

    if (!this.closeTimer) return;
    clearTimeout(this.closeTimer);
    this.closeTimer = null;
  },

  queueClose: function (timeout) {
    var self = this;

    if (self.options.progressBar) {
      self.$progressBar.css({
        transition: 'all ' + self.options.timeout + 'ms linear',
        width: '0%'
      });
    }

    if (this.closeTimer) return;
    self.closeTimer = window.setTimeout(function () {
      self.close();
    }, timeout);
    return self.closeTimer;
  },

  close: function () {
    if (this.$progressBar) {
      this.$progressBar.remove();
    }

    if (this.closeTimer) this.dequeueClose();

    if (this.closed) return;
    if (this.$bar && this.$bar.hasClass('i-am-closing-now')) return;

    var self = this;

    if (this.showing && (this.animationTypeOpen == 'anim' || this.animationTypeOpen == 'none')) {
      self.$bar.queue(
          function () {
            self.close.apply(self);
          }
      );
      return;
    } else if (this.showing && this.animationTypeOpen == 'css') {
      self.$bar.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        self.close();
      });
    }

    if (!this.shown && !this.showing) { // If we are still waiting in the queue just delete from queue
      var queue = [];
      $.each($.noty.queue, function (i, n) {
        if (n.options.id != self.options.id) {
          queue.push(n);
        }
      });
      $.noty.queue = queue;
      return;
    }

    self.$bar.addClass('i-am-closing-now');

    if (self.options.callback.onClose) {
      self.options.callback.onClose.apply(self);
    }

    if (typeof self.options.animation.close == 'string') {
      self.$bar.removeClass(self.options.animation.open).addClass(self.options.animation.close).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        if (self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
        self.closeCleanUp();
      });

    } else if (typeof self.options.animation.close == 'object' && self.options.animation.close == null) {
      self.$bar.dequeue().hide(0, function () {
        if (self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
        self.closeCleanUp();
      });

    } else {
      self.$bar.clearQueue().stop().animate(
          self.options.animation.close,
          self.options.animation.speed,
          self.options.animation.easing,
          function () {
            if (self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
          })
          .promise().done(function () {
        self.closeCleanUp();
      });
    }

  }, // end close

  closeCleanUp: function () {

    var self = this;

    // Modal Cleaning
    if (self.options.modal) {
      $.notyRenderer.setModalCount(-1);
      if ($.notyRenderer.getModalCount() == 0 && !$.noty.queue.length) $('.noty_modal').fadeOut(self.options.animation.fadeSpeed, function () {
        $(this).remove();
      });
    }

    // Layout Cleaning
    $.notyRenderer.setLayoutCountFor(self, -1);
    if ($.notyRenderer.getLayoutCountFor(self) == 0) $(self.options.layout.container.selector).remove();

    // Make sure self.$bar has not been removed before attempting to remove it
    if (typeof self.$bar !== 'undefined' && self.$bar !== null) {

      if (typeof self.options.animation.close == 'string') {
        self.$bar.css('transition', 'all 10ms ease').css('border', 0).css('margin', 0).height(0);
        self.$bar.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
          self.$bar.remove();
          self.$bar   = null;
          self.closed = true;

          if (self.options.theme.callback && self.options.theme.callback.onClose) {
            self.options.theme.callback.onClose.apply(self);
          }

          self.handleNext();
        });
      } else {
        self.$bar.remove();
        self.$bar   = null;
        self.closed = true;

        self.handleNext();
      }
    } else {
      self.handleNext();
    }

  }, // end close clean up

  handleNext: function () {
    var self = this;

    delete $.noty.store[self.options.id]; // deleting noty from store

    if (self.options.theme.callback && self.options.theme.callback.onClose) {
      self.options.theme.callback.onClose.apply(self);
    }

    if (!self.options.dismissQueue) {
      // Queue render
      $.noty.ontap = true;

      $.notyRenderer.render();
    }

    if (self.options.maxVisible > 0 && self.options.dismissQueue) {
      $.notyRenderer.render();
    }
  },

  setText: function (text) {
    if (!this.closed) {
      this.options.text = text;
      this.$bar.find('.noty_text').html(text);
    }
    return this;
  },

  setType: function (type) {
    if (!this.closed) {
      this.options.type = type;
      this.options.theme.style.apply(this);
      this.options.theme.callback.onShow.apply(this);
    }
    return this;
  },

  setTimeout: function (time) {
    if (!this.closed) {
      var self             = this;
      this.options.timeout = time;
      self.$bar.delay(self.options.timeout).promise().done(function () {
        self.close();
      });
    }
    return this;
  },

  stopPropagation: function (evt) {
    evt = evt || window.event;
    if (typeof evt.stopPropagation !== "undefined") {
      evt.stopPropagation();
    }
    else {
      evt.cancelBubble = true;
    }
  },

  closed : false,
  showing: false,
  shown  : false

}; // end NotyObject

$.notyRenderer = {};

$.notyRenderer.init = function (options) {

  // Renderer creates a new noty
  var notification = Object.create(NotyObject).init(options);

  if (notification.options.killer)
    $.noty.closeAll();

  (notification.options.force) ? $.noty.queue.unshift(notification) : $.noty.queue.push(notification);

  $.notyRenderer.render();

  return ($.noty.returns == 'object') ? notification : notification.options.id;
};

$.notyRenderer.render = function () {

  var instance = $.noty.queue[0];

  if ($.type(instance) === 'object') {
    if (instance.options.dismissQueue) {
      if (instance.options.maxVisible > 0) {
        if ($(instance.options.layout.container.selector + ' > li').length < instance.options.maxVisible) {
          $.notyRenderer.show($.noty.queue.shift());
        }
        else {

        }
      }
      else {
        $.notyRenderer.show($.noty.queue.shift());
      }
    }
    else {
      if ($.noty.ontap) {
        $.notyRenderer.show($.noty.queue.shift());
        $.noty.ontap = false;
      }
    }
  }
  else {
    $.noty.ontap = true; // Queue is over
  }

};

$.notyRenderer.show = function (notification) {

  if (notification.options.modal) {
    $.notyRenderer.createModalFor(notification);
    $.notyRenderer.setModalCount(+1);
  }

  // Where is the container?
  if (notification.options.custom) {
    if (notification.options.custom.find(notification.options.layout.container.selector).length == 0) {
      notification.options.custom.append($(notification.options.layout.container.object).addClass('i-am-new'));
    }
    else {
      notification.options.custom.find(notification.options.layout.container.selector).removeClass('i-am-new');
    }
  }
  else {
    if ($(notification.options.layout.container.selector).length == 0) {
      $('body').append($(notification.options.layout.container.object).addClass('i-am-new'));
    }
    else {
      $(notification.options.layout.container.selector).removeClass('i-am-new');
    }
  }

  $.notyRenderer.setLayoutCountFor(notification, +1);

  notification.show();
};

$.notyRenderer.createModalFor = function (notification) {
  if ($('.noty_modal').length == 0) {
    var modal = $('<div/>').addClass('noty_modal').addClass(notification.options.theme).data('noty_modal_count', 0);

    if (notification.options.theme.modal && notification.options.theme.modal.css)
      modal.css(notification.options.theme.modal.css);

    modal.prependTo($('body')).fadeIn(notification.options.animation.fadeSpeed);

    if ($.inArray('backdrop', notification.options.closeWith) > -1)
      modal.on('click', function () {
        $.noty.closeAll();
      });
  }
};

$.notyRenderer.getLayoutCountFor = function (notification) {
  return $(notification.options.layout.container.selector).data('noty_layout_count') || 0;
};

$.notyRenderer.setLayoutCountFor = function (notification, arg) {
  return $(notification.options.layout.container.selector).data('noty_layout_count', $.notyRenderer.getLayoutCountFor(notification) + arg);
};

$.notyRenderer.getModalCount = function () {
  return $('.noty_modal').data('noty_modal_count') || 0;
};

$.notyRenderer.setModalCount = function (arg) {
  return $('.noty_modal').data('noty_modal_count', $.notyRenderer.getModalCount() + arg);
};

// This is for custom container
$.fn.noty = function (options) {
  options.custom = $(this);
  return $.notyRenderer.init(options);
};

$.noty         = {};
$.noty.queue   = [];
$.noty.ontap   = true;
$.noty.layouts = {};
$.noty.themes  = {};
$.noty.returns = 'object';
$.noty.store   = {};

$.noty.get = function (id) {
  return $.noty.store.hasOwnProperty(id) ? $.noty.store[id] : false;
};

$.noty.close = function (id) {
  return $.noty.get(id) ? $.noty.get(id).close() : false;
};

$.noty.setText = function (id, text) {
  return $.noty.get(id) ? $.noty.get(id).setText(text) : false;
};

$.noty.setType = function (id, type) {
  return $.noty.get(id) ? $.noty.get(id).setType(type) : false;
};

$.noty.clearQueue = function () {
  $.noty.queue = [];
};

$.noty.closeAll = function () {
  $.noty.clearQueue();
  $.each($.noty.store, function (id, noty) {
    noty.close();
  });
};

var windowAlert = window.alert;

$.noty.consumeAlert = function (options) {
  window.alert = function (text) {
    if (options)
      options.text = text;
    else
      options = {text: text};

    $.notyRenderer.init(options);
  };
};

$.noty.stopConsumeAlert = function () {
  window.alert = windowAlert;
};

$.noty.defaults = {
  layout      : 'topRight',
  theme       : 'relax',
  type        : 'alert',
  text        : '',
  progressBar : false,
  dismissQueue: true,
  template    : '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
  animation   : {
    open     : {height: 'toggle'},
    close    : {height: 'toggle'},
    easing   : 'swing',
    speed    : 500,
    fadeSpeed: 'fast'
  },
  timeout     : false,
  force       : false,
  modal       : false,
  maxVisible  : 5,
  killer      : false,
  closeWith   : ['click'],
  callback    : {
    beforeShow  : function () {
    },
    onShow      : function () {
    },
    afterShow   : function () {
    },
    onClose     : function () {
    },
    afterClose  : function () {
    },
    onCloseClick: function () {
    }
  },
  buttons     : false
};

$(window).on('resize', function () {
  $.each($.noty.layouts, function (index, layout) {
    layout.container.style.apply($(layout.container.selector));
  });
});

// Helpers
window.noty = function noty(options) {
  return $.notyRenderer.init(options);
};

$.noty.layouts.bottom = {
    name     : 'bottom',
    options  : {},
    container: {
        object  : '<ul id="noty_bottom_layout_container" />',
        selector: 'ul#noty_bottom_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 0,
                left         : '5%',
                position     : 'fixed',
                width        : '90%',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 9999999
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none'
    },
    addClass : ''
};

$.noty.layouts.bottomCenter = {
    name     : 'bottomCenter',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_bottomCenter_layout_container" />',
        selector: 'ul#noty_bottomCenter_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 20,
                left         : 0,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            $(this).css({
                left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px'
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};


$.noty.layouts.bottomLeft = {
    name     : 'bottomLeft',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_bottomLeft_layout_container" />',
        selector: 'ul#noty_bottomLeft_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 20,
                left         : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    left: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.bottomRight = {
    name     : 'bottomRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_bottomRight_layout_container" />',
        selector: 'ul#noty_bottomRight_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 20,
                right        : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.center = {
    name     : 'center',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_center_layout_container" />',
        selector: 'ul#noty_center_layout_container',
        style   : function() {
            $(this).css({
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            // getting hidden height
            var dupe = $(this).clone().css({visibility: "hidden", display: "block", position: "absolute", top: 0, left: 0}).attr('id', 'dupe');
            $("body").append(dupe);
            dupe.find('.i-am-closing-now').remove();
            dupe.find('li').css('display', 'block');
            var actual_height = dupe.height();
            dupe.remove();

            if($(this).hasClass('i-am-new')) {
                $(this).css({
                    left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px',
                    top : ($(window).height() - actual_height) / 2 + 'px'
                });
            }
            else {
                $(this).animate({
                    left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px',
                    top : ($(window).height() - actual_height) / 2 + 'px'
                }, 500);
            }

        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.centerLeft = {
    name     : 'centerLeft',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_centerLeft_layout_container" />',
        selector: 'ul#noty_centerLeft_layout_container',
        style   : function() {
            $(this).css({
                left         : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            // getting hidden height
            var dupe = $(this).clone().css({visibility: "hidden", display: "block", position: "absolute", top: 0, left: 0}).attr('id', 'dupe');
            $("body").append(dupe);
            dupe.find('.i-am-closing-now').remove();
            dupe.find('li').css('display', 'block');
            var actual_height = dupe.height();
            dupe.remove();

            if($(this).hasClass('i-am-new')) {
                $(this).css({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                });
            }
            else {
                $(this).animate({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                }, 500);
            }

            if(window.innerWidth < 600) {
                $(this).css({
                    left: 5
                });
            }

        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};

$.noty.layouts.centerRight = {
    name     : 'centerRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_centerRight_layout_container" />',
        selector: 'ul#noty_centerRight_layout_container',
        style   : function() {
            $(this).css({
                right        : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            // getting hidden height
            var dupe = $(this).clone().css({visibility: "hidden", display: "block", position: "absolute", top: 0, left: 0}).attr('id', 'dupe');
            $("body").append(dupe);
            dupe.find('.i-am-closing-now').remove();
            dupe.find('li').css('display', 'block');
            var actual_height = dupe.height();
            dupe.remove();

            if($(this).hasClass('i-am-new')) {
                $(this).css({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                });
            }
            else {
                $(this).animate({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                }, 500);
            }

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }

        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.inline = {
    name     : 'inline',
    options  : {},
    container: {
        object  : '<ul class="noty_inline_layout_container" />',
        selector: 'ul.noty_inline_layout_container',
        style   : function() {
            $(this).css({
                width        : '100%',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 9999999
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none'
    },
    addClass : ''
};
$.noty.layouts.top = {
    name     : 'top',
    options  : {},
    container: {
        object  : '<ul id="noty_top_layout_container" />',
        selector: 'ul#noty_top_layout_container',
        style   : function() {
            $(this).css({
                top          : 0,
                left         : '5%',
                position     : 'fixed',
                width        : '90%',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 9999999
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none'
    },
    addClass : ''
};
$.noty.layouts.topCenter = {
    name     : 'topCenter',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topCenter_layout_container" />',
        selector: 'ul#noty_topCenter_layout_container',
        style   : function() {
            $(this).css({
                top          : 20,
                left         : 0,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            $(this).css({
                left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px'
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};

$.noty.layouts.topLeft = {
    name     : 'topLeft',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topLeft_layout_container" />',
        selector: 'ul#noty_topLeft_layout_container',
        style   : function() {
            $(this).css({
                top          : 20,
                left         : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    left: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.topRight = {
    name     : 'topRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topRight_layout_container" />',
        selector: 'ul#noty_topRight_layout_container',
        style   : function() {
            $(this).css({
                top          : 20,
                right        : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.themes.bootstrapTheme = {
  name    : 'bootstrapTheme',
  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0,
      wordBreak      : 'break-all'
    }
  },
  style   : function () {

    var containerSelector = this.options.layout.container.selector;
    $(containerSelector).addClass('list-group');

    this.$closeButton.append('<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>');
    this.$closeButton.addClass('close');

    this.$bar.addClass("list-group-item").css('padding', '0px').css('position', 'relative');

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    switch (this.options.type) {
      case 'alert':
      case 'notification':
        this.$bar.addClass("list-group-item-info");
        break;
      case 'warning':
        this.$bar.addClass("list-group-item-warning");
        break;
      case 'error':
        this.$bar.addClass("list-group-item-danger");
        break;
      case 'information':
        this.$bar.addClass("list-group-item-info");
        break;
      case 'success':
        this.$bar.addClass("list-group-item-success");
        break;
    }

    this.$message.css({
      textAlign: 'center',
      padding  : '8px 10px 9px',
      width    : 'auto',
      position : 'relative'
    });
  },
  callback: {
    onShow : function () { },
    onClose: function () { }
  }
};


$.noty.themes.defaultTheme = {
  name    : 'defaultTheme',
  helpers : {
    borderFix: function () {
      if (this.options.dismissQueue) {
        var selector = this.options.layout.container.selector + ' ' + this.options.layout.parent.selector;
        switch (this.options.layout.name) {
          case 'top':
            $(selector).css({borderRadius: '0px 0px 0px 0px'});
            $(selector).last().css({borderRadius: '0px 0px 5px 5px'});
            break;
          case 'topCenter':
          case 'topLeft':
          case 'topRight':
          case 'bottomCenter':
          case 'bottomLeft':
          case 'bottomRight':
          case 'center':
          case 'centerLeft':
          case 'centerRight':
          case 'inline':
            $(selector).css({borderRadius: '0px 0px 0px 0px'});
            $(selector).first().css({'border-top-left-radius': '5px', 'border-top-right-radius': '5px'});
            $(selector).last().css({'border-bottom-left-radius': '5px', 'border-bottom-right-radius': '5px'});
            break;
          case 'bottom':
            $(selector).css({borderRadius: '0px 0px 0px 0px'});
            $(selector).first().css({borderRadius: '5px 5px 0px 0px'});
            break;
          default:
            break;
        }
      }
    }
  },
  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0
    }
  },
  style   : function () {

    this.$bar.css({
      overflow  : 'hidden',
      background: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAQAAAClM0ndAAAAhklEQVR4AdXO0QrCMBBE0bttkk38/w8WRERpdyjzVOc+HxhIHqJGMQcFFkpYRQotLLSw0IJ5aBdovruMYDA/kT8plF9ZKLFQcgF18hDj1SbQOMlCA4kao0iiXmah7qBWPdxpohsgVZyj7e5I9KcID+EhiDI5gxBYKLBQYKHAQoGFAoEks/YEGHYKB7hFxf0AAAAASUVORK5CYII=') repeat-x scroll left top #fff",
      position  : 'relative'
    });

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    this.$message.css({
      textAlign: 'center',
      padding  : '8px 10px 9px',
      width    : 'auto',
      position : 'relative'
    });

    this.$closeButton.css({
      position  : 'absolute',
      top       : 4, right: 4,
      width     : 10, height: 10,
      background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAxUlEQVR4AR3MPUoDURSA0e++uSkkOxC3IAOWNtaCIDaChfgXBMEZbQRByxCwk+BasgQRZLSYoLgDQbARxry8nyumPcVRKDfd0Aa8AsgDv1zp6pYd5jWOwhvebRTbzNNEw5BSsIpsj/kurQBnmk7sIFcCF5yyZPDRG6trQhujXYosaFoc+2f1MJ89uc76IND6F9BvlXUdpb6xwD2+4q3me3bysiHvtLYrUJto7PD/ve7LNHxSg/woN2kSz4txasBdhyiz3ugPGetTjm3XRokAAAAASUVORK5CYII=)",
      display   : 'none',
      cursor    : 'pointer'
    });

    this.$buttons.css({
      padding        : 5,
      textAlign      : 'right',
      borderTop      : '1px solid #ccc',
      backgroundColor: '#fff'
    });

    this.$buttons.find('button').css({
      marginLeft: 5
    });

    this.$buttons.find('button:first').css({
      marginLeft: 0
    });

    this.$bar.on({
      mouseenter: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 1);
      },
      mouseleave: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 0);
      }
    });

    switch (this.options.layout.name) {
      case 'top':
        this.$bar.css({
          borderRadius: '0px 0px 5px 5px',
          borderBottom: '2px solid #eee',
          borderLeft  : '2px solid #eee',
          borderRight : '2px solid #eee',
          boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
      case 'topCenter':
      case 'center':
      case 'bottomCenter':
      case 'inline':
        this.$bar.css({
          borderRadius: '5px',
          border      : '1px solid #eee',
          boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        this.$message.css({textAlign: 'center'});
        break;
      case 'topLeft':
      case 'topRight':
      case 'bottomLeft':
      case 'bottomRight':
      case 'centerLeft':
      case 'centerRight':
        this.$bar.css({
          borderRadius: '5px',
          border      : '1px solid #eee',
          boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        this.$message.css({textAlign: 'left'});
        break;
      case 'bottom':
        this.$bar.css({
          borderRadius: '5px 5px 0px 0px',
          borderTop   : '2px solid #eee',
          borderLeft  : '2px solid #eee',
          borderRight : '2px solid #eee',
          boxShadow   : "0 -2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
      default:
        this.$bar.css({
          border   : '2px solid #eee',
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
    }

    switch (this.options.type) {
      case 'alert':
      case 'notification':
        this.$bar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'});
        break;
      case 'warning':
        this.$bar.css({backgroundColor: '#FFEAA8', borderColor: '#FFC237', color: '#826200'});
        this.$buttons.css({borderTop: '1px solid #FFC237'});
        break;
      case 'error':
        this.$bar.css({backgroundColor: 'red', borderColor: 'darkred', color: '#FFF'});
        this.$message.css({fontWeight: 'bold'});
        this.$buttons.css({borderTop: '1px solid darkred'});
        break;
      case 'information':
        this.$bar.css({backgroundColor: '#57B7E2', borderColor: '#0B90C4', color: '#FFF'});
        this.$buttons.css({borderTop: '1px solid #0B90C4'});
        break;
      case 'success':
        this.$bar.css({backgroundColor: 'lightgreen', borderColor: '#50C24E', color: 'darkgreen'});
        this.$buttons.css({borderTop: '1px solid #50C24E'});
        break;
      default:
        this.$bar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'});
        break;
    }
  },
  callback: {
    onShow : function () {
      $.noty.themes.defaultTheme.helpers.borderFix.apply(this);
    },
    onClose: function () {
      $.noty.themes.defaultTheme.helpers.borderFix.apply(this);
    }
  }
};

$.noty.themes.metroui = {
  name    : 'metroui',
  helpers : {},
  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0
    }
  },
  style   : function () {

    this.$bar.css({
      overflow    : 'hidden',
      margin      : '4px 0',
      borderRadius: '0',
      position    : 'relative'
    });

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    this.$message.css({
      textAlign: 'center',
      padding  : '1.25rem',
      width    : 'auto',
      position : 'relative'
    });

    this.$closeButton.css({
      position  : 'absolute',
      top       : '.25rem', right: '.25rem',
      width     : 10, height: 10,
      background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAxUlEQVR4AR3MPUoDURSA0e++uSkkOxC3IAOWNtaCIDaChfgXBMEZbQRByxCwk+BasgQRZLSYoLgDQbARxry8nyumPcVRKDfd0Aa8AsgDv1zp6pYd5jWOwhvebRTbzNNEw5BSsIpsj/kurQBnmk7sIFcCF5yyZPDRG6trQhujXYosaFoc+2f1MJ89uc76IND6F9BvlXUdpb6xwD2+4q3me3bysiHvtLYrUJto7PD/ve7LNHxSg/woN2kSz4txasBdhyiz3ugPGetTjm3XRokAAAAASUVORK5CYII=)",
      display   : 'none',
      cursor    : 'pointer'
    });

    this.$buttons.css({
      padding        : 5,
      textAlign      : 'right',
      borderTop      : '1px solid #ccc',
      backgroundColor: '#fff'
    });

    this.$buttons.find('button').css({
      marginLeft: 5
    });

    this.$buttons.find('button:first').css({
      marginLeft: 0
    });

    this.$bar.on({
      mouseenter: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 1);
      },
      mouseleave: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 0);
      }
    });

    switch (this.options.layout.name) {
      case 'top':
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        break;
      case 'topCenter':
      case 'center':
      case 'bottomCenter':
      case 'inline':
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        this.$message.css({textAlign: 'center'});
        break;
      case 'topLeft':
      case 'topRight':
      case 'bottomLeft':
      case 'bottomRight':
      case 'centerLeft':
      case 'centerRight':
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        this.$message.css({textAlign: 'left'});
        break;
      case 'bottom':
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        break;
      default:
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        break;
    }

    switch (this.options.type) {
      case 'alert':
      case 'notification':
        this.$bar.css({backgroundColor: '#fff', border: 'none', color: '#1d1d1d'});
        break;
      case 'warning':
        this.$bar.css({backgroundColor: '#FA6800', border: 'none', color: '#fff'});
        this.$buttons.css({borderTop: '1px solid #FA6800'});
        break;
      case 'error':
        this.$bar.css({backgroundColor: '#CE352C', border: 'none', color: '#fff'});
        this.$message.css({fontWeight: 'bold'});
        this.$buttons.css({borderTop: '1px solid #CE352C'});
        break;
      case 'information':
        this.$bar.css({backgroundColor: '#1BA1E2', border: 'none', color: '#fff'});
        this.$buttons.css({borderTop: '1px solid #1BA1E2'});
        break;
      case 'success':
        this.$bar.css({backgroundColor: '#60A917', border: 'none', color: '#fff'});
        this.$buttons.css({borderTop: '1px solid #50C24E'});
        break;
      default:
        this.$bar.css({backgroundColor: '#fff', border: 'none', color: '#1d1d1d'});
        break;
    }
  },
  callback: {
    onShow : function () {

    },
    onClose: function () {

    }
  }
};
$.noty.themes.relax = {
  name    : 'relax',
  helpers : {},
  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0
    }
  },
  style   : function () {

    this.$bar.css({
      overflow    : 'hidden',
      margin      : '4px 0',
      borderRadius: '2px',
      position    : 'relative'
    });

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    this.$message.css({
      textAlign: 'center',
      padding  : '10px',
      width    : 'auto',
      position : 'relative'
    });

    this.$closeButton.css({
      position  : 'absolute',
      top       : 4, right: 4,
      width     : 10, height: 10,
      background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAxUlEQVR4AR3MPUoDURSA0e++uSkkOxC3IAOWNtaCIDaChfgXBMEZbQRByxCwk+BasgQRZLSYoLgDQbARxry8nyumPcVRKDfd0Aa8AsgDv1zp6pYd5jWOwhvebRTbzNNEw5BSsIpsj/kurQBnmk7sIFcCF5yyZPDRG6trQhujXYosaFoc+2f1MJ89uc76IND6F9BvlXUdpb6xwD2+4q3me3bysiHvtLYrUJto7PD/ve7LNHxSg/woN2kSz4txasBdhyiz3ugPGetTjm3XRokAAAAASUVORK5CYII=)",
      display   : 'none',
      cursor    : 'pointer'
    });

    this.$buttons.css({
      padding        : 5,
      textAlign      : 'right',
      borderTop      : '1px solid #ccc',
      backgroundColor: '#fff'
    });

    this.$buttons.find('button').css({
      marginLeft: 5
    });

    this.$buttons.find('button:first').css({
      marginLeft: 0
    });

    this.$bar.on({
      mouseenter: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 1);
      },
      mouseleave: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 0);
      }
    });

    switch (this.options.layout.name) {
      case 'top':
        this.$bar.css({
          borderBottom: '2px solid #eee',
          borderLeft  : '2px solid #eee',
          borderRight : '2px solid #eee',
          borderTop   : '2px solid #eee',
          boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
      case 'topCenter':
      case 'center':
      case 'bottomCenter':
      case 'inline':
        this.$bar.css({
          border   : '1px solid #eee',
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        this.$message.css({textAlign: 'center'});
        break;
      case 'topLeft':
      case 'topRight':
      case 'bottomLeft':
      case 'bottomRight':
      case 'centerLeft':
      case 'centerRight':
        this.$bar.css({
          border   : '1px solid #eee',
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        this.$message.css({textAlign: 'left'});
        break;
      case 'bottom':
        this.$bar.css({
          borderTop   : '2px solid #eee',
          borderLeft  : '2px solid #eee',
          borderRight : '2px solid #eee',
          borderBottom: '2px solid #eee',
          boxShadow   : "0 -2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
      default:
        this.$bar.css({
          border   : '2px solid #eee',
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
    }

    switch (this.options.type) {
      case 'alert':
      case 'notification':
        this.$bar.css({backgroundColor: '#FFF', borderColor: '#dedede', color: '#444'});
        break;
      case 'warning':
        this.$bar.css({backgroundColor: '#FFEAA8', borderColor: '#FFC237', color: '#826200'});
        this.$buttons.css({borderTop: '1px solid #FFC237'});
        break;
      case 'error':
        this.$bar.css({backgroundColor: '#FF8181', borderColor: '#e25353', color: '#FFF'});
        this.$message.css({fontWeight: 'bold'});
        this.$buttons.css({borderTop: '1px solid darkred'});
        break;
      case 'information':
        this.$bar.css({backgroundColor: '#78C5E7', borderColor: '#3badd6', color: '#FFF'});
        this.$buttons.css({borderTop: '1px solid #0B90C4'});
        break;
      case 'success':
        this.$bar.css({backgroundColor: '#BCF5BC', borderColor: '#7cdd77', color: 'darkgreen'});
        this.$buttons.css({borderTop: '1px solid #50C24E'});
        break;
      default:
        this.$bar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'});
        break;
    }
  },
  callback: {
    onShow : function () {

    },
    onClose: function () {

    }
  }
};

$.noty.themes.semanticUI = {
  name: 'semanticUI',

  template: '<div class="ui message"><div class="content"><div class="header"></div></div></div>',

  animation: {
    open : {
      animation: 'fade',
      duration : '800ms'
    },
    close: {
      animation: 'fade left',
      duration : '800ms'
    }
  },

  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0
    }
  },
  style   : function () {
    this.$message = this.$bar.find('.ui.message');

    this.$message.find('.header').html(this.options.header);
    this.$message.find('.content').append(this.options.text);

    this.$bar.css({
      margin  : '0.5em',
      position: 'relative'
    });

    if (this.options.icon) {
      this.$message.addClass('icon').prepend($('<i/>').addClass(this.options.icon));
    }

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    switch (this.options.size) {
      case 'mini':
        this.$message.addClass('mini');
        break;
      case 'tiny':
        this.$message.addClass('tiny');
        break;
      case 'small':
        this.$message.addClass('small');
        break;
      case 'large':
        this.$message.addClass('large');
        break;
      case 'big':
        this.$message.addClass('big');
        break;
      case 'huge':
        this.$message.addClass('huge');
        break;
      case 'massive':
        this.$message.addClass('massive');
        break;
    }

    switch (this.options.type) {
      case 'info':
        this.$message.addClass('info');
        break;
      case 'warning':
        this.$message.addClass('warning');
        break;
      case 'error':
        this.$message.addClass('error');
        break;
      case 'negative':
        this.$message.addClass('negative');
        break;
      case 'success':
        this.$message.addClass('success');
        break;
      case 'positive':
        this.$message.addClass('positive');
        break;
      case 'floating':
        this.$message.addClass('floating');
        break;
    }
  },
  callback: {
    onShow : function () {
      // Enable transition
      this.$bar.addClass('transition');
      // Actual transition
      this.$bar.transition(this.options.animation.open);
    },
    onClose: function () {
      this.$bar.transition(this.options.animation.close);
    }
  }
};


return window.noty;

});

/***/ }),
/* 17 */
/***/ (function(module, exports) {

;(function (window) {

  if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  }

  if (!Array.prototype.last) {
    Array.prototype.last = function () {
      return this[this.length - 1];
    };
  }

  _.findKeyWhere = function (list, properties) {
    var k;
    var filter = _.matches(properties);
    _.some(list, function (value, key) {
      return filter(value) && (k = key);
    });
    return k;
  };

  $.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if ($(this).prop('disabled')) return false;

      if (!!$(this).attr('data-tokens')) {
        jApp.log($(this).tokenInput('get'));
        o[this.name] = _.pluck($(this).tokenInput('get'), 'name');
        return o;
      }

      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  $.fn.clearForm = function () {
    return this.each(function () {
      if (!!$(this).prop('disabled') || !!$(this).prop('readonly')) return false;

      var type = this.type,
          tag = this.tagName.toLowerCase();
      if (tag == 'form') return $(':input', this).clearForm();
      if (type == 'text' || type == 'password' || tag == 'textarea') this.value = '';else if (type == 'checkbox' || type == 'radio') this.checked = false;else if (tag == 'select') this.selectedIndex = !!$(this).prop('multiple') ? -1 : 0;
      $(this).psiblings('.form-control-feedback').removeClass('glyphicon-remove').removeClass('glyphicon-ok').hide();
      $(this).closest('.form_element').removeClass('has-error').removeClass('has-success');
    });
  };

  $.fn.psiblings = function (search) {
    // Get the current element's siblings
    var siblings = this.siblings(search);

    if (siblings.length != 0) {
      // Did we get a hit?
      return siblings.eq(0);
    }

    // Traverse up another level
    var parent = this.parent();
    if (parent === undefined || parent.get(0).tagName.toLowerCase() == 'body') {
      // We reached the body tag or failed to get a parent with no result.
      // Return the empty siblings tag so as to return an empty jQuery object.
      return siblings;
    }
    // Try again
    return parent.psiblings(search);
  };

  String.prototype.ucfirst = function () {
    return this.toString().charAt(0).toUpperCase() + this.slice(1);
  };

  String.prototype.ucwords = function () {
    return this.toString().replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
})(window);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 *  jApp.class.js - Custom Grid App container
 *
 *
 *  Defines the properties and methods of the
 *  custom app class.
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 */


/**
 * Configure the export
 * @method function
 * @return {[type]} [description]
 */

/* harmony default export */ __webpack_exports__["a"] = (function (options) {

    var self = this,
        $ = window.$;

    options = options || {};

    /**
     * Configuration
     * @type {Object}
     */
    $.extend(true, this, __webpack_require__(19), __webpack_require__(21)(self), __webpack_require__(22)(self), __webpack_require__(23), options);

    /**
     * Warn about debug mode if it's on
     */
    if (this.debug) {
        console.warn('DEBUG MODE ON ');
        //$.jStorage.flush();
    }
});;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * defaults.js
 *
 * Default app configuration
 */

;module.exports = {

  /**
   * Debug mode, set to false to supress messages
   * @type {Boolean}
   */
  debug: false,

  /**
   * Placeholder for the activeGrid object
   * @type {Object}
   */
  activeGrid: {},

  /**
   * Api route prefix
   *
   * automatically prepended to any api url
   * @type {String}
   */
  apiRoutePrefix: 'api/v1',

  /**
   * Storage object
   * @type {[type]}
   */
  store: $.jStorage,

  /**
   * Column parameters
   *
   * Form definitions
   * @type {Object}
   */
  colparams: __webpack_require__(20),

  /**
   * Grid object container
   * @type {Object}
   */
  oG: {
    admin: {}
  },

  /**
   * Views object container
   * @type {Object}
   */
  views: {
    admin: {}
  },

  /**
   * Grids object container
   * @type {Object}
   */
  grids: {
    admin: {}
  },

  /**
   * Array placeholder for tracking open forms
   * @type {Array}
   */
  openForms: []

};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * colparams.js
 *
 * Specify any default column parameters here
 */
;module.exports = {
  Group: [{ // fieldset
    label: 'Group Details',
    helpText: 'Please fill out the following information about the group.',
    class: 'col-lg-4',
    fields: [{
      name: 'name',
      placeholder: 'e.g. Administrators',
      _label: 'Group Name',
      _enabled: true,
      required: true,
      'data-validType': 'Anything'
    }, {
      name: 'description',
      type: 'textarea',
      _label: 'Description',
      _enabled: true
    }, {
      name: 'modules',
      type: 'select',
      _label: 'Assign roles/permissions to this group',
      _enabled: true,
      _labelssource: 'a|b|c|d',
      _optionssource: '1|2|3|4',
      multiple: true
    }]
  }, {
    class: 'col-lg-8',
    fields: [{
      name: 'users',
      type: 'array',
      _label: 'Add Users to this Group',
      _enabled: true,
      fields: [{
        name: 'users',
        type: 'select',
        _label: 'Select Users',
        _labelssource: 'a|b|c|d',
        _optionssource: '1|2|3|4',
        _enabled: true,
        multiple: true
      }, {
        name: 'comment[]',
        placeholder: 'Optional Comment',
        _enabled: true
      }]
    }]
  }]
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

/**
 * methods.js
 *
 * jApp method definitions
 *
 */

;module.exports = function (self) {

  return {

    /**
     * Convenience function to access the active grid object
     * @method function
     * @return {[type]} [description]
     */
    aG: function aG() {
      return self.activeGrid;
    }, // end fn

    /**
     * Add a view
     * @method function
     * @return {[type]} [description]
     */
    addView: function addView(name, viewDefinition, colparams) {
      var viewTarget = self.views,
          gridTarget = self.oG,
          tmp_name = name.split('.'),
          tmp_name_part,
          viewName;

      // drill down if applicable
      while (tmp_name.length > 1) {

        tmp_name_part = tmp_name.shift();
        jApp.log('name part ' + tmp_name_part);

        if (typeof viewTarget[tmp_name_part] === 'undefined') {
          viewTarget[tmp_name_part] = {};
        }

        if (typeof gridTarget[tmp_name_part] === 'undefined') {
          gridTarget[tmp_name_part] = {};
        }

        viewTarget = viewTarget[tmp_name_part];
        gridTarget = gridTarget[tmp_name_part];
      }

      // get the viewName
      viewName = tmp_name[0];

      // add the view function
      viewTarget[viewName] = function () {
        gridTarget[viewName] = new jGrid(viewDefinition);
      };

      // add the colparams
      self.colparams[viewDefinition.model] = colparams;
    }, // end fn

    /**
     * Prefix url with api route prefix
     * @method function
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    prefixURL: function prefixURL(url) {
      var parser,
          path = url;

      // handle well-formed urls
      if (url.indexOf('http:') === 0) {
        parser = document.createElement('a');
        parser.href = url;
        path = parser.pathname;
      }
      // remove the route prefix
      path = path.toString().replace(self.apiRoutePrefix, '');

      // add the route prefix
      path = self.apiRoutePrefix + '/' + path;

      // trim trailing and leading slashes and remove any double slashes
      path = path.split('/').filter(function (str) {
        if (!!str) return str;
      }).join('/');

      // add the location origin and return it
      return location.origin + '/' + path;
    }, // end fn

    /**
     * Get url relative to current url
     * @method function
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    getRelativeUrl: function getRelativeUrl(url) {
      var parser,
          path = url;

      // handle well-formed urls
      if (url.indexOf('http:') === 0) {
        parser = document.createElement('a');
        parser.href = url;
        path = parser.pathname;
      }
      // remove the route prefix
      path = path.toString().replace(self.apiRoutePrefix, '');

      // trim trailing and leading slashes and remove any double slashes
      path = path.split('/').filter(function (str) {
        if (!!str) return str;
      }).join('/');

      // add the location origin and return it
      return location.origin + '/' + path;
    }, // end fn

    /**
     * Get the table from the corresponding model
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    model2table: function model2table(model) {

      var RuleExceptions = {
        Person: 'people'
      };

      return RuleExceptions[model] == null ? (model + 's').toLowerCase() : RuleExceptions[model];
    }, // end fn

    /**
     * Convenience function to access the $grid object
     * in the active grid
     * @method function
     * @return {[type]} [description]
     */
    tbl: function tbl() {
      return self.activeGrid.DOM.$grid;
    }, // end fn


    /**
     * Convenience function to access the options
     * of the active grid
     * @method function
     * @return {[type]} [description]
     */
    opts: function opts() {
      return self.activeGrid.options;
    }, // end fn

    /**
     * Log a message
     * @method function
     * @param  {[type]} msg   [description]
     * @param  {[type]} force [description]
     * @return {[type]}       [description]
     */
    log: function log(msg, force) {
      if (!!self.debug || !!force) {
        console.log(msg);
      }
    }, // end fn

    /**
     * Log a warning message
     * @method function
     * @param  {[type]} msg   [description]
     * @param  {[type]} force [description]
     * @return {[type]}       [description]
     */
    warn: function warn(msg, force) {
      if (!!self.debug || !!force) {
        console.warn(msg);
      }
    } // end fn


  };
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * cellTemplate.js
 *
 * Cell template formatting functions
 */

;module.exports = function (self) {

  _.nameButton = function (value, icon) {
    var iconString = !!icon ? '<i class="fa fa-fw ' + icon + '"></i>' : '';
    return '<button style="padding:4px" class="btn btn-link btn-chk">' + iconString + value + '</button>';
  };

  _.link = function (value, icon, external) {
    var row = self.activeGrid.currentRow,
        id = row.id,
        href = window.location.href.trim('/');

    switch (true) {
      case !!icon && !!external:
        value = '<span><i class="fa fa-fw ' + icon + '"></i>' + value + '<i class="fa fa-fw fa-external-link"></i></span>';
        break;

      case !!icon:
        value = '<span><i class="fa fa-fw ' + icon + '"></i>' + value + '</span>';
        break;

      case !!external:
        value = '<span>' + value + '<i class="fa fa-fw fa-external-link"></i></span>';
        break;
    }

    return value.link(href + '/' + id);
  };

  _.email = function (value, icon) {

    var row = self.activeGrid.currentRow,
        id = row.id,
        href = window.location.href.trim('/'),
        text = !!icon ? '<span><i class="fa fa-fw ' + icon + '"></i>' + value + '<i class="fa fa-fw fa-external-link"></span>' : '<span><i class="fa fa-fw fa-envelope"></i>' + value + '<i class="fa fa-fw fa-external-link"></span>';

    return text.link('mailto:' + value);
  };

  _.getTags = function (arr) {
    return _.map(arr, function (o, i) {
      return '<div class="label label-primary" style="margin-right:3px">' + o.name + '</div>';
    }).join(' ');
  };

  _.getFlag = function (value, trueLabel, falseLabel, trueClass, falseClass) {
    var label = !!+value ? trueLabel || 'Yes' : falseLabel || 'No',
        className = !!+value ? trueClass || 'success' : falseClass || 'danger';

    return '<span style="margin:3px;" class="label label-' + className + '">' + label + '</span>';
  };

  _.getLabel = function (value, icon, bgColor, color) {
    var iconString = !!icon ? '<i class="fa fa-fw ' + icon + '"></i> ' : '',
        style = 'style="padding:2px 4px; color:' + (color || 'black') + ' ; background:' + (bgColor || 'white') + '"';

    return '<div ' + style + '>' + iconString + value + '</div>';
  };

  _.get = function (key, target, callback, icon, model) {
    var tmpKeyArr = key.split('.'),
        tmpKeyNext,
        returnArr;

    // move variables around
    if (typeof target === 'string') {
      icon = target;
      target = null;
    }

    if (typeof callback === 'string') {
      if (callback.indexOf('fa-') === 0) {
        model = icon;
        icon = callback;
      } else {
        model = callback;
        icon = null;
      }
      callback = null;
    }

    if (typeof target !== 'undefined') {
      if (target === null) return '';

      var target_array = typeof target.push === 'function' ? target : [target];

      return _.map(target_array, function (row, i) {
        var iconString = !!icon ? '<i class="fa fa-fw ' + icon + '"></i>' : '';

        if (row[key] == null) {
          return '';
        }

        if (model != null) {
          return '<button style="padding:4px" class="btn btn-link btn-editOther" data-id="' + row.id + '" data-model="' + model + '">' + iconString + row[key] + '</button>';
        } else {
          return '<div style="padding:4px">' + iconString + row[key] + '</div>';
        }
      });
    } else {

      target = self.activeGrid.currentRow;

      while (tmpKeyArr.length > 1) {
        tmpKeyNext = tmpKeyArr.shift();

        if (target[tmpKeyNext] != null) {
          target = target[tmpKeyNext];
        } else {
          console.warn(key + ' is not a valid key of ');
          console.warn(target);
          return false;
        }
      }

      switch (_typeof(target[tmpKeyArr[0]])) {
        case 'undefined':
          return false;
          break;

        case 'string':
          returnArr = [target[tmpKeyArr[0]]];
          break;

        default:
          returnArr = target[tmpKeyArr[0]];
      }
    }

    if (!!callback) {
      returnArr = returnArr.map(callback);
    }

    if (!!icon) {
      returnArr = returnArr.map(function (val) {
        return '<span><i class="fa fa-fw ' + icon + '"></i>' + val + '</span>';
      });
    }

    console.log(returnArr);

    return returnArr.join(' ');
  };

  /**
   * pivotExtract
   *
   *	Pulls a unique, flattened list out of the specified
   *	target or the current row. Optionally, you can
   *	specify a callback function which will be applied
   *	to the list using .map. You can also specify a
   *	font-awesome icon to be applied to each item in the list.
   *
   * @method function
   * @param  {[type]}   target   [description]
   * @param  {Function} callback [description]
   * @param  {[type]}   icon     [description]
   * @return {[type]}            [description]
   */
  _.pivotExtract = function (target, callback, icon) {

    // find the target. If it's a string it's a key of the currentRow
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
      target = self.activeGrid.currentRow[target];
    }

    var a = _.uniq( // return unique values
    _.compact( // remove falsy values
    _.flatten( // flatten multi-dimensional array
    _.map( // map currentRow.users return list of group names
    target, callback))));

    // add the icons if applicable
    if (icon != null) {
      a = a.map(function (val) {
        return '<span><i class="fa fa-fw ' + icon + '"></i>' + val + '</span>';
      });
    }

    return a.join(' '); // join the list and return
  };

  return {
    cellTemplates: {

      id: function id(value) {
        return ('0000' + value).slice(-4);
      },

      name: function name(value) {
        return _.nameButton(value, self.opts().gridHeader.icon);
      },

      hostname: function hostname(value) {
        return _.nameButton(value, 'fa-building-o');
      },

      databaseName: function databaseName(value) {
        var r = jApp.aG().currentRow,
            flags = [];

        if (+r.inactive_flag == 1) {
          flags.push('<div class="label label-danger label-sm" style="margin-right:3px">Inactive</div>');
        }

        if (+r.ignore_flag == 1) {
          flags.push('<div class="label label-warning label-sm" style="margin-right:3px">Ignored</div>');
        }

        if (+r.production_flag == 1) {
          flags.push('<div class="label label-primary label-sm" style="margin-right:3px">Prod</div>');
        }

        return _.nameButton(r.name, 'fa-database') + flags.join(' ');
      },

      serverName: function serverName(value) {
        var r = jApp.aG().currentRow,
            flags = [],
            cname = '';

        if (r.cname != null && r.cname.trim() != '') {
          cname = ' (' + r.cname + ') ';
        }

        if (+r.inactive_flag == 1) {
          flags.push('<div class="label label-danger label-sm" style="margin:0 3px">Inactive</div>');
        }

        if (+r.production_flag == 1) {
          flags.push('<div class="label label-primary label-sm" style="margin:0 3px">Prod</div>');
        }

        return _.nameButton(r.name.toUpperCase(), 'fa-building-o') + cname + flags.join(' ');
      },

      username: function username(value) {
        return _.nameButton(value, 'fa-user');
      },

      person_name: function person_name() {
        return _.get('person.name', 'fa-male');
      },

      email: function email(value) {
        return _.email(value);
      },

      users: function users(arr) {
        return _.get('username', arr, 'fa-user', 'User');
      },

      roles: function roles(arr) {
        return _.get('name', arr, 'fa-briefcase', 'Role');
      },

      groups: function groups(arr) {
        return _.get('name', arr, 'fa-users', 'Group');
      },

      people: function people(arr) {
        return _.get('name', arr, 'fa-user', 'Person');
      },

      tags: function tags(arr) {
        return _.getTags(arr);
      },

      profile_groups: function profile_groups(arr) {
        return _.get('name', arr, 'fa-users');
      },

      group_roles: function group_roles(arr) {
        return _.pivotExtract('groups', function (row, i) {
          return row.roles.length ? _.get('name', row.roles, 'fa-briefcase', 'Role') : false;
        });
      },

      profile_group_roles: function profile_group_roles(arr) {
        return _.pivotExtract('groups', function (row, i) {
          return row.roles.length ? _.get('name', row.roles, 'fa-briefcase') : false;
        });
      },

      group_users: function group_users(arr) {
        return _.pivotExtract('groups', function (row, i) {
          return row.users.length ? _.get('username', row.users, 'fa-user', 'User') : false;
        });
      },

      user_groups: function user_groups(arr) {
        return _.pivotExtract('users', function (row, i) {
          return row.groups.length ? _.get('name', row.groups, 'fa-users', 'Group') : false;
        });
      },

      created_at: function created_at(value) {
        return date('Y-m-d', strtotime(value));
      },

      updated_at: function updated_at(value) {
        return date('Y-m-d', strtotime(value));
      },

      permissions: function permissions() {
        var row = jApp.aG().currentRow,
            p = [];

        if (!!Number(row.create_enabled)) p.push('Create');
        if (!!Number(row.read_enabled)) p.push('Read');
        if (!!Number(row.update_enabled)) p.push('Update');
        if (!!Number(row.delete_enabled)) p.push('Delete');

        return p.join(', ');
      }

    }
  };
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * routing.js
 *
 * configures the routing patterns for the app
 */

;module.exports = {
  routing: {

    /**
     * Get the route for the specified parameters
     * @method function
     * @param  {[type]} route     [description]
     * @param  {[type]} model     [description]
     * @param  {[type]} optionKey [description]
     * @param  {[type]} labelKey  [description]
     * @return {[type]}           [description]
     */
    get: function get(route, model, optionKey, labelKey) {
      if (typeof jApp.routing[route] === 'function') {
        return jApp.prefixURL(jApp.routing[route](model, optionKey, labelKey));
      } else {
        return jApp.prefixURL(jApp.routing.default(route || model, model || null));
      }
    },

    /**
     * Inspect the selected model
     * @method function
     * @param  {[type]} model [description]
     * @param  {[type]} id    [description]
     * @return {[type]}       [description]
     */
    inspect: function inspect(model, id) {
      return model + '/' + id + '/_inspect';
    }, // end fn

    /**
     * Checked out records route
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    checkedOut: function checkedOut(model) {
      return model + '/_checkedOut';
    },

    /**
     * Checkout a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    checkout: function checkout(model, id) {
      return model + '/' + id + '/_checkout';
    },

    /**
     * Checkin a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    checkin: function checkin(model, id) {
      return model + '/' + id + '/_checkin';
    },

    /**
     * Get permissions for a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    getPermissions: function getPermissions(model) {
      return model + '/_getPermissions';
    },

    /**
     * get select options for a model
     * @method function
     * @param  {[type]} model [description]
     * @param  {[type]}       [description]
     * @return {[type]}       [description]
     */
    selectOptions: function selectOptions(model, optionKey, labelKey) {
      return model + '/_selectOptions/' + optionKey + '_' + labelKey;
    },

    /**
     * get token options for a model
     * @method function
     * @param  {[type]} model [description]
     * @param  {[type]}       [description]
     * @return {[type]}       [description]
     */
    tokenOptions: function tokenOptions(model, optionKey, labelKey) {
      return model + '/_tokenOptions/' + optionKey + '_' + labelKey;
    },

    /**
     * Get the route for a mass update for a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    massUpdate: function massUpdate(model) {
      return model + '/_massUpdate';
    },

    /**
     * default route for a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    default: function _default(model, id) {
      return !!id ? model + '/' + id : model;
    }
  }
};

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 *  jUtility.class.js - Custom Data Grid JS utility class
 *
 *  Contains helper functions used by jGrid
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 *  Prereqs: 	jQuery, jApp
 *
 */
;'use strict';

/* harmony default export */ __webpack_exports__["a"] = (window.$.extend(__webpack_require__(25), __webpack_require__(28), __webpack_require__(29), __webpack_require__(30), __webpack_require__(31), __webpack_require__(32), __webpack_require__(34), __webpack_require__(38), __webpack_require__(39), __webpack_require__(40), __webpack_require__(41)));

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * bindings.js
 * @type {Object}
 *
 * methods dealing with events, bindings, and delegation
 */
;module.exports = {

  /**  **  **  **  **  **  **  **  **  **
   *   bind
   *
   *  binds event handlers to the various
   *  DOM elements.
   **  **  **  **  **  **  **  **  **  **/
  bind: function bind() {
    jUtility.setupBootpag();
    jUtility.setupSortButtons();
    jUtility.turnOffOverlays();
    jUtility.loadBindings();
    jUtility.setupHeaderFilters();
    jUtility.processGridBindings();
    jUtility.processFormBindings();
  }, // end bind fn

  /**
   * Load event bindings for processing
   * @method function
   * @return {[type]} [description]
   */
  loadBindings: function loadBindings() {
    // form bindings
    jApp.opts().events.form = $.extend(true, __webpack_require__(26), jApp.opts().events.form);

    // grid events
    jApp.opts().events.grid = $.extend(true, __webpack_require__(27), jApp.opts().events.grid);
  }, //end fn

  /**
   * Process the event bindings for the grid
   * @method function
   * @return {[type]} [description]
   */
  processGridBindings: function processGridBindings() {
    _.each(jApp.opts().events.grid, function (events, target) {
      _.each(events, function (fn, event) {
        if (typeof fn === 'function') {
          jUtility.setCustomBinding(target, fn, event);
        }
      });
    });
  }, //end fn

  /**
   * Process the event bindings for the form
   * @method function
   * @return {[type]} [description]
   */
  processFormBindings: function processFormBindings() {

    _.each(jApp.opts().events.form, function (events, target) {
      _.each(events, function (fn, event) {
        jUtility.setCustomBinding(target, fn, event, '.div-form-panel-wrapper', 'force');
      });
    });
  }, //end fn

  /**
   * Set up a custom event binding
   * @method function
   * @param  {[type]}   event [description]
   * @param  {Function} fn    [description]
   * @return {[type]}         [description]
   */
  setCustomBinding: function setCustomBinding(target, fn, event, scope, force) {
    var eventKey = event + '.custom-' + $.md5(fn.toString()),
        $scope = $(scope || document),
        scope_text = scope || 'document';

    if (event === 'boot') {
      return typeof fn === 'function' ? fn() : false;
    }

    // we cannot use event bubbling for scroll
    // events, we must use capturing
    if (event !== 'scroll') {
      if (!!$(window[target]).length) {
        //jApp.log('Found target within global scope ' + target);
        //jApp.log('Binding event ' + eventKey + ' to target ' + target);
        $(window[target]).off(eventKey).on(eventKey, fn);
      } else if (!jUtility.isEventDelegated(target, eventKey, scope_text) || force) {

        //jApp.log('Binding event ' + event + ' to target ' + target + ' within scope ' + scope_text);
        $scope.undelegate(target, eventKey).delegate(target, eventKey, fn);
        jUtility.eventIsDelegated(target, eventKey, scope_text);
      }
    } else {
      document.addEventListener(event, fn, true);
    }
  }, // end fn

  /**
   * Has the event been delegated for the target?
   * @method function
   * @param  {[type]} target   [description]
   * @param  {[type]} eventKey [description]
   * @return {[type]}          [description]
   */
  isEventDelegated: function isEventDelegated(target, eventKey, scope) {
    return _.indexOf(jApp.aG().delegatedEvents, scope + '-' + target + '-' + eventKey) !== -1;
  }, // end fn

  /**
   * Mark event delegated
   * @method function
   * @param  {[type]} target   [description]
   * @param  {[type]} eventKey [description]
   * @param  {[type]} scope    [description]
   * @return {[type]}          [description]
   */
  eventIsDelegated: function eventIsDelegated(target, eventKey, scope) {
    return jApp.aG().delegatedEvents.push(scope + '-' + target + '-' + eventKey);
  }, // end fn

  /**
   * Attempt to locate jQuery target
   * @method function
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  locateTarget: function locateTarget(target, scope) {
    // first look in the grid scope,
    // then the document scope,
    // then look through the window object
    // to see if the target is a member
    // of the global scope e.g. $(window)
    if (typeof scope === 'undefined') {
      return jApp.aG().$().find(target) || $(target) || $(window[target]);
    } else {
      return jApp.aG().$().find(target, scope) || $(target, scope) || $(window[target], scope);
    }
  } //end fn

};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

/**
 * formBindings.js
 * @type {Object}
 *
 * Event bindings related to forms
 */
;module.exports = {
  // the bind function will assume the scope is relative to the current form
  // unless the key is found in the global scope
  // boot functions will be automatically called at runtime
  "[data-validType='Phone Number']": {
    keyup: function keyup() {
      $(this).val(jUtility.formatPhone($(this).val()));
    }
  },

  "[data-validType='Zip Code']": {
    keyup: function keyup() {
      $(this).val(jUtility.formatZip($(this).val()));
    }
  },

  "[data-validType='SSN']": {
    keyup: function keyup() {
      var This = $(this);
      setTimeout(function () {
        This.val(jUtility.formatSSN(jApp.aG().val()));
      }, 200);
    }
  },

  "[data-validType='color']": {
    keyup: function keyup() {
      $(this).css('background-color', $(this).val());
    }
  },

  "[data-validType='Number']": {
    change: function change() {
      $(this).val(jUtility.formatNumber($(this).val()));
    }
  },

  "[data-validType='Integer']": {
    change: function change() {
      $(this).val(jUtility.formatInteger($(this).val()));
    }
  },

  "[data-validType='US State']": {
    change: function change() {
      $(this).val(jUtility.formatUC($(this).val()));
    }
  },

  "button.close, .btn-cancel": {
    click: jUtility.exitCurrentForm
  },

  ".btn-go": {
    click: jUtility.saveCurrentFormAndClose
  },

  ".btn-save": {
    click: jUtility.saveCurrentForm
  },

  ".btn-reset": {
    click: jUtility.resetCurrentForm
  },

  ".btn-refreshForm": {
    click: jUtility.refreshCurrentForm
  },

  ".btn-array-add": {
    click: jUtility.jInput().fn.arrayAddRow
  },

  ".btn-array-remove": {
    click: jUtility.jInput().fn.arrayRemoveRow
  },

  "input": {
    keyup: function keyup(e) {
      e.preventDefault();
      if (e.which === 13) {
        if (jUtility.isConfirmed()) {
          jUtility.saveCurrentFormAndClose();
        }
      } else if (e.which === 27) {
        jUtility.closeCurrentForm();
      }
    }
  },

  "input[type=file]": {
    change: function change(e) {
      e.preventDefault();
      jUtility.uploadFile(this);
    }
  },

  "#confirmation": {
    keyup: function keyup() {
      if ($(this).val().toString().toLowerCase() === 'yes') {
        jUtility.$currentForm().find('.btn-go').removeClass('disabled');
      } else {
        jUtility.$currentForm().find('.btn-go').addClass('disabled');
      }
    }
  },

  "[_linkedElmID]": {
    change: function change() {
      var This = $(this),
          $col = This.attr('_linkedElmFilterCol'),
          $id = This.val(),
          $labels = This.attr('_linkedElmLabels'),
          $options = This.attr('_linkedElmOptions'),
          oFrm = jUtility.oCurrentForm(),
          oElm = oFrm.fn.getElmById(This.attr('_linkedElmID'));

      // set data to always expire;
      oElm.fn.setTTL(-1);
      oElm.jApp.opts().hideIfNoOptions = true;
      oElm.jApp.opts().cache = false;

      oElm.fn.attr({
        '_optionsFilter': $col + '=' + $id,
        '_firstoption': 0,
        '_firstlabel': '-Other-',
        '_labelsSource': $labels,
        '_optionsSource': $options
      });

      oElm.fn.initSelectOptions(true);
    }
  }
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

/**
 * gridBindings.js
 * @type {Object}
 *
 * Event bindings related to the grid
 */
;module.exports = {

  // the bind function will assume the scope is relative to the grid
  // unless the key is found in the global scope
  // boot functions will be automatically called at runtime
  window: {
    resize: function resize() {
      jUtility.timeout({
        key: 'resizeTimeout',
        fn: jUtility.DOM.updateColWidths,
        delay: 500
      });
    },

    beforeunload: jUtility.unloadWarning
  },

  ".table-grid": {
    "scroll": function scroll() {
      jUtility.timeout({
        key: 'tableGridScroll',
        fn: jUtility.DOM.pageWrapperScrollHandler,
        delay: 300
      });
    }
  },

  ".header-filter": {
    keyup: function keyup() {
      jUtility.toggleDeleteIcon($(this));

      jUtility.timeout({
        key: 'applyHeaderFilters',
        fn: jUtility.DOM.applyHeaderFilters,
        delay: 300
      });
    },

    boot: jUtility.DOM.applyHeaderFilters
  },

  ".tbl-sort": {
    click: function click() {
      var $btn, $btnIndex, $desc;

      //button
      $btn = $(this);
      //index
      $btnIndex = $btn.closest('.table-header').index() + 1;

      //tooltip
      $btn.attr('title', $btn.attr('title').indexOf('Descending') !== -1 ? 'Sort Ascending' : 'Sort Descending').attr('data-original-title', $btn.attr('title')).tooltip({ delay: 300 });

      //ascending or descending
      $desc = $btn.find('i').hasClass('fa-sort-amount-desc');

      //other icons
      jApp.tbl().find('.tbl-sort i.fa-sort-amount-desc').removeClass('fa-sort-amount-desc').addClass('fa-sort-amount-asc').end().find('.tbl-sort.btn-primary').removeClass('btn-primary');

      //btn style
      $btn.addClass('btn-primary');

      //icon
      $btn.find('i').removeClass($desc ? 'fa-sort-amount-desc' : 'fa-sort-amount-asc').addClass($desc ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc');

      jApp.tbl().find('.table-body .table-row').show();

      // perform the sort on the table rows
      jUtility.DOM.sortByCol($btnIndex, $desc);
    }
  },

  ".btn-clear-search": {
    click: function click() {
      var $search = $(this).closest('div').find('#search');

      $search.val('').keyup();
    }
  },

  "#search": {

    blur: function blur() {
      var val = $(this).val();

      if (!!val.length) {
        $(this).closest('div').find('.btn-clear-search').show();
      } else {
        $(this).animate({ width: 100 }, 'slow').closest('div').find('.btn-clear-search').hide();
      }
    },

    keyup: function keyup(e) {
      var delay = e.which === 13 ? 70 : 700,
          val = $(this).val();

      jApp.activeGrid.dataGrid.requestOptions.data['q'] = val;

      if (!!val.length) {
        $(this).animate({ width: 300 }, 'slow').closest('div').find('.btn-clear-search').show();
      } else {
        $(this).animate({ width: 100 }, 'slow').closest('div').find('.btn-clear-search').hide();
      }

      jUtility.timeout({
        key: 'updateGridSearch',
        delay: delay,
        fn: function fn() {
          $(this).focus();
          jUtility.executeGridDataRequest(true);
        }
      });
    }
  },

  "[title]": {
    boot: function boot() {
      $('[title]').tooltip({ delay: 300 });
    }
  },

  ".btn-readmore": {
    click: function click() {
      $(this).toggleClass('btn-success btn-warning');
      $(this).siblings('.readmore').toggleClass('active');
    }
  },

  "[name=RowsPerPage]": {
    change: function change() {
      jApp.tbl().find('[name=RowsPerPage]').val($(this).val());
      jUtility.DOM.rowsPerPage($(this).val());
    },
    boot: function boot() {
      if (jUtility.isPagination()) {
        $('[name=RowsPerPage]').parent().show();
      } else {
        $('[name=RowsPerPage]').parent().hide();
      }
    }
  },

  ".deleteicon": {
    boot: function boot() {
      $(this).remove();
    },
    click: function click() {
      $(this).prev('input').val('').focus().trigger('keyup');
      jUtility.DOM.applyHeaderFilters();
    }
  },

  ".chk_all": {
    change: function change() {
      var num_checked = jApp.aG().$().find('.chk_cid:visible:checked').length,
          num_unchecked = jApp.aG().$().find('.chk_cid:visible:not(:checked)').length;

      jApp.aG().$().find('.chk_cid:visible').prop('checked', num_checked <= num_unchecked);
      $('.chk_cid').eq(0).change();
    }
  },

  ".chk_cid": {
    change: function change() {
      var $chk_all = jApp.tbl().find('.chk_all'),
          // $checkall checkbox
      $checks = jApp.tbl().find('.chk_cid'),
          // $checkboxes
      total_num = $checks.length,
          // total checkboxes
      num_checked = jApp.tbl().find('.chk_cid:checked').length; // number of checkboxes checked

      jUtility.DOM.updateRowMenu(num_checked);

      // set the state of the checkAll checkbox
      $chk_all.prop('checked', total_num === num_checked ? true : false).prop('indeterminate', num_checked > 0 && num_checked < total_num ? true : false);

      if (!!num_checked) {
        $('.btn-editOther.active').removeClass('btn-default active').addClass('btn-link');
      }
    }
  },

  ".btn-chk": {
    click: function click() {
      $('.chk_cid:checked').prop('checked', false).eq(0).change();
      $(this).closest('.table-row').find('.chk_cid').click();
    }
  },

  ".btn-new": {
    click: function click() {
      jUtility.actionHelper('new');
    }
  },

  ".btn-edit": {
    click: function click() {
      if (jUtility.isOtherButtonChecked()) {
        return jUtility.actionHelper('edit' + jUtility.getOtherButtonModel());
      }
      return jUtility.actionHelper('edit');
    }
  },

  ".btn-firstPage": {
    click: function click() {
      var data = jApp.activeGrid.dataGrid.requestOptions.data;

      data.page = 1;
      jUtility.executeGridDataRequest();
    }
  },

  ".btn-prevPage": {
    click: function click() {
      var data = jApp.activeGrid.dataGrid.requestOptions.data;

      data.page = isNaN(data.page) || data.page < 2 ? 1 : data.page - 1;
      jUtility.executeGridDataRequest();
    }
  },

  ".btn-nextPage": {
    click: function click() {
      var data = jApp.activeGrid.dataGrid.requestOptions.data,
          last_page = jApp.activeGrid.dataGrid.last_page;

      data.page = isNaN(data.page) || data.page < 2 ? 2 : +data.page + 1;
      data.page = data.page > last_page ? last_page : data.page;
      jUtility.executeGridDataRequest();
    }
  },

  ".btn-lastPage": {
    click: function click() {
      var data = jApp.activeGrid.dataGrid.requestOptions.data,
          last_page = jApp.activeGrid.dataGrid.last_page;

      data.page = last_page;
      jUtility.executeGridDataRequest();
    }
  },

  ".btn-collapseText": {
    click: function click() {
      jApp.opts().toggles.ellipses = !jApp.opts().toggles.ellipses;
      $(this).toggleClass('active', jApp.opts().toggles.ellipses);
      jUtility.DOM.refreshGrid();
    }
  },

  ".btn-editOther": {
    click: jUtility.DOM.editOtherButtonHandler
  },

  ".btn-inspect": {
    click: function click() {
      jUtility.actionHelper('inspect');
    }
  },

  ".btn-headerFilters": {
    click: jUtility.DOM.toggleHeaderFilters
  },

  ".btn-delete": {
    click: function click() {
      jUtility.withSelected('delete');
    }
  },

  ".btn-clear": {
    click: jUtility.DOM.clearSelection
  },

  ".btn-refresh": {
    click: jUtility.DOM.refreshGrid
  },

  // ".btn-showMenu" : {
  //   click : jUtility.DOM.toggleRowMenu
  // },

  ".table-body": {
    mouseover: function mouseover() {
      $(this).focus();
    }
  }
};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

/**
 * booleans.js
 *
 * methods for checking boolean values
 */

;module.exports = {
  /**
   * Does the form need confirmation
   * @method function
   * @return {[type]} [description]
   */
  isConfirmed: function isConfirmed() {
    var conf = jUtility.$currentFormWrapper().find('#confirmation');
    if (!!conf.length && conf.val().toString().toLowerCase() !== 'yes') {
      jUtility.msg.warning('Type yes to continue');
      return false;
    }
    return true;
  }, //end fn

  /**
   * Is an "other" button checked?
   * @method function
   * @return {[type]} [description]
   */
  isOtherButtonChecked: function isOtherButtonChecked() {
    return !!$('.btn-editOther.active').length;
  }, // end fn

  /**
   * Initialize scrollbar
   * @method function
   * @return {[type]} [description]
   */
  initScrollbar: function initScrollbar() {
    $('.table-grid').perfectScrollbar();
  }, //end fn

  /**
   * Is autoupdate enabled
   * @method function
   * @return {[type]} [description]
   */
  isAutoUpdate: function isAutoUpdate() {
    return !!jApp.opts().toggles.autoUpdate;
  }, //end fn

  /**
   * Is data caching enabled
   * @method function
   * @return {[type]} [description]
   */
  isCaching: function isCaching() {
    return !!jApp.opts().toggles.caching;
  }, // end fn

  /**
   * Is record checkout enabled
   * @method function
   * @return {[type]} [description]
   */
  isCheckout: function isCheckout() {
    return !!jApp.opts().toggles.checkout && jUtility.isEditable();
  }, // end fn

  /**
   * Is the grid data editable
   * @method function
   * @return {[type]} [description]
   */
  isEditable: function isEditable() {
    return !!jApp.opts().toggles.editable;
  }, //end fn

  /**
   * Are ellipses enabled
   * @method function
   * @return {[type]} [description]
   */
  isEllipses: function isEllipses() {
    return !!jApp.opts().toggles.ellipses;
  }, // end fn

  /**
   * Is pagination enabled
   * @method function
   * @return {[type]} [description]
   */
  isPagination: function isPagination() {
    return !!jApp.opts().toggles.paginate;
  }, // end fn

  /**
   * Is sorting by column enabled
   * @method function
   * @return {[type]} [description]
   */
  isSort: function isSort() {
    return !!jApp.opts().toggles.sort;
  }, // end fn

  /**
   * Is toggle mine enabled
   * @method function
   * @return {[type]} [description]
   */
  isToggleMine: function isToggleMine() {
    return window.location.href.indexOf('/my') !== -1;
  }, // end fn

  /**
   * Is header filters enabled
   * @method function
   * @return {[type]} [description]
   */
  isHeaderFilters: function isHeaderFilters() {
    return !!jApp.opts().toggles.headerFilters;
  }, // end fn

  /**
   * Are header filters currently displayed
   * @method function
   * @return {[type]} [description]
   */
  isHeaderFiltersDisplay: function isHeaderFiltersDisplay() {
    return !!jApp.opts().toggles.headerFiltersDisplay;
  }, // end fn

  /**
   * Is the button with name 'key' enabled
   * @method function
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  isButtonEnabled: function isButtonEnabled(key) {
    return typeof jApp.opts().toggles[key] === 'undefined' || !!jApp.opts().toggles[key];
  }, //end fn

  /**
   * Is data cache available
   * @method function
   * @return {[type]} [description]
   */
  isDataCacheAvailable: function isDataCacheAvailable() {
    return jUtility.isCaching() && !!jApp.aG().store.get('data_' + jApp.opts().table, false);
  }, // end fn

  /**
   * Are there errors in the response
   * @method function
   * @return {[type]} [description]
   */
  isResponseErrors: function isResponseErrors(response) {
    return typeof response.errors !== 'undefined' && !!response.errors;
  }, // end fn

  /**
   * Is the data
   * @method function
   * @return {[type]} [description]
   */
  isDataEmpty: function isDataEmpty(response) {
    return typeof response.data === 'undefined' || typeof response.data.length === 'undefined' || response.data.length == 0;
  }, // end fn

  /**
   * Does the form exist
   * @param  {[type]} key [description]
   * @return {[type]}          [description]
   */
  isFormExists: function isFormExists(key) {
    return typeof jApp.aG().forms['$' + key] !== 'undefined' || typeof jApp.aG().forms['o' + key.ucfirst()] !== 'undefined' || typeof jApp.aG().forms[key] !== 'undefined';
  }, // end fn

  /**
   * Is a form container maximized
   * @method function
   * @return {[type]} [description]
   */
  isFormOpen: function isFormOpen() {
    return !!jApp.aG().$().find('.div-form-panel-wrapper.max').length;
  }, // end fn

  /**
   * Is row menu open
   * @method function
   * @return {[type]} [description]
   */
  isRowMenuOpen: function isRowMenuOpen() {
    return !!$('.table-rowMenu-row:visible').length;
  }, // end fn

  /**
   * Check permission on the button parameters
   * @method function
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  isPermission: function isPermission(params) {
    if (!params['data-permission']) return true;
    return !!jApp.activeGrid.permissions[params['data-permission']];
  }, // end fn

  /**
   * Does the current action require a form?
   * @method function
   * @return {[type]} [description]
   */
  needsForm: function needsForm() {
    if (jApp.aG().action !== 'inspect') return true;
    return false;
  }, // end fn

  /**
   * The row needs to be checked out
   * @method function
   * @return {[type]} [description]
   */
  needsCheckout: function needsCheckout() {
    var action = jApp.aG().action;
    return jUtility.isCheckout() && (action === 'edit' || action === 'delete' || action.indexOf('edit') === 0);
  }, //end fn

  /**
   * The row needs to be checked in
   * @method function
   * @return {[type]} [description]
   */
  needsCheckin: function needsCheckin() {
    return jUtility.needsCheckout();
  }, //end fn

  /**
   * Are Header Filters Non-empty
   * @method function
   * @return {[type]} [description]
   */
  areHeaderFiltersNonempty: function areHeaderFiltersNonempty() {
    return !!jApp.tbl().find('.header-filter').filter(function () {
      return !!this.value;
    }).length;
  } //end fn
};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

/**
 * callback.js
 *
 * callback functions
 */
;module.exports = {

  /**  **  **  **  **  **  **  **  **  **
   *   CALLBACK
   *
   *  Defines the callback functions
   *  used by the various AJAX calls
   **  **  **  **  **  **  **  **  **  **/
  callback: {

    inspectSelected: function inspectSelected(response) {
      $('#div_inspect').find('.panel-body .target').html(response);
      jUtility.maximizeCurrentForm();
    }, // end fn

    /**
     * Process the result of the form submission
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    submitCurrentForm: function submitCurrentForm(response) {
      if (jUtility.isResponseErrors(response)) {
        jUtility.msg.error(jUtility.getErrorMessage(response));
      } else {
        jUtility.msg.success('Operation Completed Successfully!');
        if (jApp.opts().closeOnSave) {
          if (jUtility.needsCheckin()) {
            jUtility.checkin(jUtility.getCurrentRowId());
          } else {
            jUtility.closeCurrentForm();
          }
        }
        jUtility.getGridData();
        jUtility.DOM.clearSelection();
      }
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   update
     *
     *  @response (obj) The JSON object
     *  returned by the ajax request
     *
     *  processes the result of the AJAX
     *  request
     **  **  **  **  **  **  **  **  **  **/
    update: function update(response) {
      var responseData, self;

      jApp.log('6.6 data received. processing...');

      jUtility.DOM.setupGridHeaders();

      $('.table-cell.no-data').remove();

      if (jUtility.isResponseErrors(response)) {
        return jUtility.DOM.dataErrorHandler();
      }

      // init vars
      self = jApp.aG();

      // extract the data from the response;
      responseData = response.data;

      // TODO - handle pagination of api data and lazy loading

      // detect changes in data;
      self.dataGrid.delta = !$.isEmptyObject(self.dataGrid.data) ? jUtility.deltaData(self.dataGrid.data, responseData) : responseData;

      self.dataGrid.from = response.from;
      self.dataGrid.to = response.to;
      self.dataGrid.total = response.total;
      self.dataGrid.current_page = response.current_page;
      self.dataGrid.last_page = response.last_page;

      jUtility.DOM.updateGridFooter();

      self.dataGrid.data = responseData;

      if (jUtility.isDataEmpty(response)) {
        return jUtility.DOM.dataEmptyHandler();
      }

      // abort if no changes to the data
      if (!self.dataGrid.delta) {
        return false;
      }

      // remove all rows, if needed
      if (self.options.removeAllRows) {
        jUtility.DOM.removeRows(true);
      }

      jUtility.DOM.updateGrid();

      // show the preloader, then update the contents
      jUtility.DOM.togglePreloader();

      // remove the rows that may have been removed from the data
      jUtility.DOM.removeRows();
      jUtility.buildMenus();
      jUtility.DOM.togglePreloader(true);
      self.options.removeAllRows = false;

      if (!self.loaded) {
        // custom init fn
        if (self.fn.customInit && typeof self.fn.customInit === 'function') {
          self.fn.customInit();
        }
        self.loaded = true;
      }

      // adjust permissions
      jUtility.callback.getPermissions(jApp.aG().permissions);

      // adjust column widths
      jUtility.DOM.updateColWidths();

      // perform sort if needed
      jUtility.DOM.sortByCol();
    }, // end fn

    /**
     * Update panel header from row data
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    updateDOMFromRowData: function updateDOMFromRowData(response) {
      var data = response,
          self = jApp.aG();
      self.rowData = response;
      jUtility.DOM.updatePanelHeader(data[self.options.columnFriendly]);
    }, // end fn

    /**
     * Check out row
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    checkout: function checkout(response) {
      if (!jUtility.isResponseErrors(response)) {
        jUtility.msg.success('Record checked out for editing.');
        jApp.activeGrid.temp.checkedOut = true;
        jUtility.setupFormContainer();
        jUtility.getCheckedOutRecords();
      }
    }, //end fn

    /**
     * Check in row
     * @method function
     * @return {[type]} [description]
     */
    checkin: function checkin(response) {
      if (jUtility.isResponseErrors(response)) {
        console.warn(jUtility.getErrorMessage(response));
      }
      jUtility.getCheckedOutRecords();
      jUtility.closeCurrentForm();
    }, //end fn

    /**
     * Display response errors
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    displayResponseErrors: function displayResponseErrors(res) {

      var response = res.responseJSON || res;

      jApp.log('Checking is response has errors.');
      if (jUtility.isResponseErrors(response)) {
        jApp.log('Response has errors. Displaying error.');
        console.warn(jUtility.getErrorMessage(response));
        jUtility.msg.clear();
        jUtility.msg.error(jUtility.getErrorMessage(response));
      } else {
        jApp.log('Response does not have errors.');
      }
    }, //end fn

    /**
     * Get Checked out records
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    getCheckedOutRecords: function getCheckedOutRecords(response) {
      /**
       * To do
       */

      var $tr,
          $i = $('<i/>', { class: 'fa fa-lock fa-fw checkedOut' }),
          self = jApp.aG();

      self.DOM.$grid.find('.chk_cid').parent().removeClass('disabled').show();
      self.DOM.$grid.find('.rowMenu-container').removeClass('disabled');
      self.DOM.$grid.find('.checkedOut').remove();

      _.each(response, function (o) {

        if (!!o && !!o.lockable_id) {
          $tr = $('.table-row[data-identifier="' + o.lockable_id + '"]');

          $tr.find('.chk_cid').parent().addClass('disabled').hide().closest('.table-cell').append($('<span/>', { class: 'btn btn-default btn-danger pull-right checkedOut' }).html($i.prop('outerHTML')).clone().attr('title', 'Locked By ' + o.user.person.name));
          $tr.find('.rowMenu-container').addClass('disabled').find('.rowMenu.expand').removeClass('expand');
        }
      });
    }, //end fn

    /**
     * Process the grid link tables
     * @method function
     * @param  {[type]} colParams [description]
     * @return {[type]}           [description]
     */
    linkTables: function linkTables(colParams) {
      var self = jApp.aG();

      // add the colParams to the linkTable store
      self.linkTables = _.union(self.linkTables, colParams);

      // count the number of completed requests
      if (!self.linkTableRequestsComplete) {
        self.linkTableRequestsComplete = 1;
      } else {
        self.linkTableRequestsComplete++;
      }

      // once all linkTable requests are complete, apply the updates to the forms
      if (self.linkTableRequestsComplete == self.options.linkTables.length) {
        // update the edit form
        self.forms.oEditFrm.options.colParamsAdd = self.linkTables;
        self.forms.oEditFrm.fn.processColParams();
        self.forms.oEditFrm.fn.processBtns();

        // update the new form
        self.forms.oNewFrm.options.colParamsAdd = self.linkTables;
        self.forms.oNewFrm.fn.processColParams();
        self.forms.oNewFrm.fn.processBtns();
      }
    }, //end fn

    /**
     * Show or hide controls based on permissions.
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    getPermissions: function getPermissions(response) {

      jApp.log('Setting activeGrid permissions');
      jApp.activeGrid.permissions = response;

      jApp.log(jApp.aG().permissions);

      _.each(response, function (value, key) {
        jApp.log('12.1 Setting Permission For ' + key + ' to ' + value);
        if (value !== 1) {
          $('[data-permission=' + key + ']').remove();
        }
      });
    } // end fn

    // end callback defs
  } };

/***/ }),
/* 30 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * dom.js
 *
 * DOM manipulation functions
 */

;module.exports = {
  /**
   * DOM Manipulation Functions
   * @type {Object}
   */
  DOM: {

    /**
     * Build form
     * @method function
     * @param  {[type]} params [description]
     * @param  {[type]} key    [description]
     * @return {[type]}        [description]
     */
    buildForm: function buildForm(params, key, htmlKey, tableFriendly) {
      var $frmHandle = '$' + key,
          oFrmHandle = 'o' + key.ucfirst(),
          oFrm;

      htmlKey = htmlKey != null ? htmlKey : key;

      // make sure the form template exists
      if (typeof jApp.aG().html.forms[htmlKey] === 'undefined') return false;

      // create form object
      jApp.aG().forms[oFrmHandle] = {}; // initialize it with a placeholder
      jApp.aG().forms[oFrmHandle] = oFrm = new jForm(params);

      // create form container
      jApp.aG().forms[$frmHandle] = {}; // initialize it with a placeholder
      jApp.aG().forms[$frmHandle] = $('<div/>', { 'class': 'gridFormContainer' }).html(jUtility.render(jApp.aG().html.forms[htmlKey], { tableFriendly: tableFriendly || jApp.opts().model })).find('.formContainer').append(oFrm.fn.handle()).end().appendTo(jApp.aG().$());

      return oFrm;
    }, // end fn

    /**
     * Hide header filters
     * @method function
     * @return {[type]} [description]
     */
    hideHeaderFilters: function hideHeaderFilters() {
      jApp.aG().$().find('.table-head .tfilters').hide();
      $('#btn_toggle_header_filters').removeClass('active');
    }, // end fn

    /**
     * Show header filters
     * @method function
     * @return {[type]} [description]
     */
    showHeaderFilters: function showHeaderFilters() {
      jUtility.DOM.headerFilterDeleteIcons();
      jApp.aG().$().find('.table-head .tfilters').show();
      $('#btn_toggle_header_filters').addClass('active');
    }, // end fn

    /**
     * Updates the grid when there is
     * or is not any data
     * @method function
     * @return {[type]}              [description]
     */

    dataEmptyHandler: function dataEmptyHandler() {
      $('.table-cell.no-data').remove();
      jApp.aG().$().find('.table-body .table-row').remove();
      $('<div/>', { class: 'table-cell no-data' }).html('<div class="alert alert-warning"> <i class="fa fa-fw fa-warning"></i> I did not find anything matching your query.</div>').appendTo(jApp.tbl().find('#tbl_grid_body'));

      jUtility.DOM.updateColWidths();
    }, // end fn

    /**
     * Updates the grid when is or is not errors
     * in the response
     * @method function
     * @param  {Boolean} isDataEmpty [description]
     * @return {[type]}              [description]
     */
    dataErrorHandler: function dataErrorHandler() {
      $('.table-cell.no-data').remove();
      $('<div/>', { class: 'table-cell no-data' }).html('<div class="alert alert-danger"> <i class="fa fa-fw fa-warning"></i> There was an error retrieving the data.</div>').appendTo(jApp.tbl().find('#tbl_grid_body'));
      jUtility.DOM.updateColWidths();
    }, // end fn


    /**
     * Update the header title
     * @param  {[type]} newTitle [description]
     * @return {[type]}          [description]
     */
    updateHeaderTitle: function updateHeaderTitle(newTitle) {
      jApp.opts().gridHeader.headerTitle = newTitle;
      jApp.tbl().find('span.header-title').html(newTitle);
    }, // end fn

    /**
     * Toggle column visibility
     * @param  {[type]} elm [description]
     * @return {[type]}     [description]
     */
    toggleColumnVisibility: function toggleColumnVisibility(elm) {
      var i = +elm.closest('li').index() + 2;

      if (elm.find('i').hasClass('fa-check-square-o')) {
        elm.find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        jApp.tbl().find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i + '), .table-body .table-cell:nth-child(' + i + ')').hide();
      } else {
        elm.find('i').addClass('fa-check-square-o').removeClass('fa-square-o');
        jApp.tbl().find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i + '), .table-body .table-cell:nth-child(' + i + ')').show();
      }

      jUtility.DOM.updateColWidths();
    }, //end fn

    /**  **  **  **  **  **  **  **  **  **
     *   rowsPerPage
     *
     *  @rowsPerPage (int) hide the preloader
     *
     *  show/hide the preload animation
     **  **  **  **  **  **  **  **  **  **/
    rowsPerPage: function rowsPerPage(_rowsPerPage) {
      if (isNaN(_rowsPerPage)) return false;

      jApp.aG().store.set('pref_rowsPerPage', _rowsPerPage);
      jApp.opts().pageNum = 1;
      jApp.aG().dataGrid.pagination.rowsPerPage = Math.floor(_rowsPerPage);
      jUtility.updatePagination();
      jUtility.DOM.page(1);
      jUtility.DOM.updateColWidths();
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   preload
     *
     *  @hide (bool) hide the preloader
     *
     *  show/hide the preload animation
     **  **  **  **  **  **  **  **  **  **/
    togglePreloader: function togglePreloader(hide) {
      if (typeof hide === 'undefined') {
        hide = false;
      }

      if (!hide) {
        jApp.tbl().css('background', 'url("/images/tbody-preload.gif") no-repeat center 175px rgba(0,0,0,0.15)').find('[name=RowsPerPage],[name=q]').prop('disabled', true).end().find('.table-body').css('filter', 'blur(1px) grayscale(100%)').css('-webkit-filter', 'blur(2px) grayscale(100%)').css('-moz-filter', 'blur(2px) grayscale(100%)');
        //.find('.table-cell, .table-header').css('border','1px solid transparent').css('background','none');
      } else {
        jApp.tbl().css('background', '').find('[name=RowsPerPage],[name=q]').prop('disabled', false).end().find('.table-body').css('filter', '').css('-webkit-filter', '').css('-moz-filter', '');
        //.find('.table-cell, .table-header').css('border','').css('background','');
      }
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   page
     *
     *  @pageNum (int) the new page number
     *  				to display
     *
     *  jumps to the desired page number
     **  **  **  **  **  **  **  **  **  **/
    page: function page(pageNum) {
      var first, last;

      jUtility.DOM.togglePreloader();

      if (isNaN(pageNum)) return false;
      pageNum = Math.floor(pageNum);

      jApp.opts().pageNum = pageNum;
      first = +((pageNum - 1) * jApp.aG().dataGrid.pagination.rowsPerPage);
      last = +(first + jApp.aG().dataGrid.pagination.rowsPerPage);
      jApp.tbl().find('.table-body .table-row').hide().slice(first, last).show();

      // set col widths
      setTimeout(jUtility.DOM.updateColWidths, 100);
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   updatePanelHeader
     *
     *  @text	(string) text to display
     *
     *  updates the text display in the
     *  header of the form wrapper
     *
     **  **  **  **  **  **  **  **  **  **/
    updatePanelHeader: function updatePanelHeader(text) {
      jUtility.$currentFormWrapper().find('.spn_editFriendlyName').html(text);
    }, // end fn

    /**
     * Remove rows from the DOM that do not have corresponding data
     * @param  {[type]} all [description]
     * @return {[type]}     [description]
     */
    removeRows: function removeRows(all) {
      var identifiers = _.pluck(jApp.aG().dataGrid.data, jApp.opts().pkey);

      if (typeof all !== 'undefined' && all) {
        jApp.tbl().find('.table-body .table-row').remove();
      } else {
        //--jApp.aG().DOM.$rowMenu.detach();

        jApp.tbl().find('.table-row[data-identifier]').filter(function (i, row) {
          return _.indexOf(identifiers, Number($(row).attr('data-identifier'))) === -1;
        }).remove();
      }
    }, // end fn

    /**
     * Apply the header filters
     * @method function
     * @return {[type]} [description]
     */
    applyHeaderFilters: function applyHeaderFilters() {
      var matchedRows = [];

      jApp.log('Applying Header Filters');

      if (!jUtility.areHeaderFiltersNonempty()) {
        return jUtility.DOM.removeHeaderFilters();
      }

      jUtility.DOM.hidePaginationControls();

      jApp.log('Getting matched rows');
      matchedRows = jUtility.getHeaderFilterMatchedRows();

      jUtility.setVisibleRows(matchedRows);

      jApp.tbl().find('.filter-showing').html(jUtility.render(jApp.aG().html.tmpFilterShowing, {
        'totalVis': matchedRows.length,
        'totalRows': jApp.tbl().find('.table-body .table-row').length
      }));

      // update column widths
      jUtility.DOM.updateColWidths();
    }, // end fn

    /**
     * Remove the header filters
     * @method function
     * @return {[type]} [description]
     */
    removeHeaderFilters: function removeHeaderFilters() {
      if (jUtility.isPagination()) {
        jUtility.DOM.showPaginationControls();
        jUtility.DOM.updateFilterText('');
        jUtility.DOM.page(jApp.opts().pageNum);
      }
    }, // end fn

    /**
     * Update the Showing x/x filter text
     * @method function
     * @param  {[type]} text [description]
     * @return {[type]}      [description]
     */
    updateFilterText: function updateFilterText(text) {
      jApp.tbl().find('.filter-showing').html(text);
    }, // end fn

    /**
     * Show the pagination controls
     * @method function
     * @return {[type]} [description]
     */
    showPaginationControls: function showPaginationControls() {
      jApp.tbl().find('.divRowsPerPage, .paging').show();
    }, // end fn

    /**
     * Hide the pagination controls
     * @method function
     * @return {[type]} [description]
     */
    hidePaginationControls: function hidePaginationControls() {
      jApp.tbl().find('.divRowsPerPage, .paging').hide();
    }, // end fn

    /**
     * Header Filter Delete Icons
     * @method function
     * @return {[type]} [description]
     */
    headerFilterDeleteIcons: function headerFilterDeleteIcons() {
      if (!$('.table-header .deleteicon').length) {
        jApp.log('Adding header filter delete icons');
        $('.header-filter').after($('<span/>', { 'class': 'deleteicon', 'style': 'display:none' }).html(jUtility.render(jApp.aG().html.tmpClearHeaderFilterBtn)));
      } else {
        jApp.log('Delete icons already added');
      }
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   sortByCol
     *
     *  @colNum (int) the 1-indexed html
     *  			column to sort by
     *
     *  @desc 	(bool) sort descending
     *
     *  sorts the table rows in the DOM
     *  according the the input column
     *  and direction (asc default)
     **  **  **  **  **  **  **  **  **  **/
    sortByCol: function sortByCol(colNum, desc) {
      var $col;

      if (typeof colNum === 'undefined' && typeof jApp.aG().temp.sortOptions === 'undefined') {
        return false;
      }

      if (typeof colNum === 'undefined') {
        colNum = jApp.aG().temp.sortOptions.colNum;
        desc = jApp.aG().temp.sortOptions.desc;
      } else {
        jApp.aG().temp.sortOptions = { colNum: colNum, desc: desc };
      }

      //col
      $col = jApp.tbl().find('.table-body .table-row .table-cell:nth-child(' + colNum + ')').map(function (i, elm) {
        return [[$(elm).clone().text().toLowerCase(), $(elm).parent()]];
      }).sort(function (a, b) {

        if ($.isNumeric(a[0]) && $.isNumeric(b[0])) {
          return a[0] - b[0];
        }

        if (a[0] > b[0]) {
          return 1;
        }

        if (a[0] < b[0]) {
          return -1;
        }

        // a must be equal to b
        return 0;
      });

      // iterate through col
      $col.each(function (i, elm) {
        var $e = $(elm[1]);

        // detach the row from the DOM
        $e.detach();

        // attach the row in the correct order
        if (!desc) {
          jApp.tbl().find('.table-body').append($e);
        } else {
          jApp.tbl().find('.table-body').prepend($e);
        }
      });

      // go to the appropriate page to refresh the view
      jUtility.DOM.page(jApp.opts().pageNum);

      // apply header filters
      jUtility.DOM.applyHeaderFilters();
    }, // end fn

    /**
     * Hide or show the activity preloader
     * @method function
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    activityPreloader: function activityPreloader(action) {
      if (action !== 'hide') {
        $('.ajax-activity-preloader').show();
      } else {
        $('.ajax-activity-preloader').hide();
      }
    }, //end fn

    /**
     * Empty the page wrapper div
     * @method function
     * @return {[type]} [description]
     */
    emptyPageWrapper: function emptyPageWrapper() {
      $('#page-wrapper').empty();
    }, //end fn

    /**
     * Toggle header filters
     * @method function
     * @return {[type]} [description]
     */
    toggleHeaderFilters: function toggleHeaderFilters() {
      jApp.log('headerFilters toggled');

      jApp.opts().toggles.headerFiltersDisplay = !jApp.opts().toggles.headerFiltersDisplay;

      if ($('.tfilters:visible').length) {
        jUtility.DOM.hideHeaderFilters();
      } else {
        jUtility.DOM.showHeaderFilters();
      }

      jUtility.DOM.updateColWidths();
    }, //end fn

    /**
     * Update the grid position
     * @return {[type]} [description]
     */
    updateGridPosition: function updateGridPosition() {
      var p = jUtility.calculateGridPosition();
      if (!p) return false;

      $('.grid-panel-body').css({ 'marginTop': p.marginTop }).find('.table').css({ 'height': p.height });

      $('.table-grid').perfectScrollbar('update');
    }, // end fn

    /**
     * Handles the page wrapper after scrolling
     * @return {[type]} [description]
     */
    pageWrapperScrollHandler: function pageWrapperScrollHandler() {

      var pw = $('#page-wrapper'),
          isScrolled = pw.hasClass('scrolled'),
          offsetTop = $('.table-body').offset().top,
          lowerBound = 150,
          upperBound = 180;

      if (!isScrolled && offsetTop < lowerBound) {
        pw.addClass('scrolled');
        jUtility.DOM.updateGridPosition();
      } else if (isScrolled && offsetTop > upperBound) {
        pw.removeClass('scrolled');
        jUtility.DOM.updateGridPosition();
      }
    }, // end fn

    /**
     * Clear the column widths
     * @return {[type]} [description]
     */
    clearColumnWidths: function clearColumnWidths() {
      $('.grid-panel-body .table-row').find('.table-cell, .table-header').css('width', '');
    }, //end fn

    /**
     * Update column widths
     * @method function
     * @return {[type]} [description]
     */
    updateColWidths: function updateColWidths() {

      jUtility.DOM.updateGridPosition();
      jUtility.setupSortButtons();

      jUtility.DOM.clearColumnWidths();

      // perfect scrollbar
      $('.table-grid').perfectScrollbar('update');

      jApp.opts().maxColWidth = +500 / 1920 * +$(window).innerWidth();

      //visible columns
      var visCols = +$('.table-head .table-row.colHeaders').find('.table-header:visible').length - 1;

      for (var ii = 1; ii <= visCols; ii++) {

        var colWidth = Math.max.apply(Math, $('.grid-panel-body .table-row').map(function (i) {
          return $(this).find('.table-cell:visible,.table-header-text:visible').eq(ii).innerWidth();
        }).get());

        if (+colWidth > jApp.opts().maxColWidth && ii < visCols) {
          colWidth = jApp.opts().maxColWidth;
        }

        if (ii == visCols) {
          colWidth = +$(window).innerWidth() - $('.table-head .table-row.colHeaders').find('.table-header:visible').slice(0, -1).map(function (i) {
            return $(this).innerWidth();
          }).get().reduce(function (p, c) {
            return p + c;
          }) - 40;
        }

        var nindex = +ii + 1;

        // set widths of each cell
        $('.grid-panel-body .table-row:not(.tr-no-data) .table-cell:visible:nth-child(' + nindex + '),' + '.grid-panel-body .table-row:not(.tr-no-data) .table-header:nth-child(' + nindex + ')').css('width', +colWidth + 14);
      }

      //hide preload mask
      jUtility.DOM.togglePreloader(true);
    }, // end fn

    /**
     * Attach Row Menu To The DOM
     * @method function
     * @return {[type]} [description]
     */
    attachRowMenu: function attachRowMenu() {
      $('.table-rowMenu-row').empty().append(jApp.aG().DOM.$rowMenu.wrap('<div class="table-header"></div>').parent());
    }, //end fn

    /**
     * Handler that triggers when an "other" button is clicked
     * @method function
     * @return {[type]} [description]
     */
    editOtherButtonHandler: function editOtherButtonHandler() {
      var id = $(this).attr('data-id'),
          model = $(this).attr('data-model'),
          icon = _.without($(this).find('i').attr('class').split(' '), 'fa', 'fa-fw')[0],
          options;

      $('.btn-editOther.active').not(this).removeClass('btn-default active').addClass('btn-link');

      $(this).toggleClass('btn-link btn-default active');

      options = !!$('.btn-editOther.active').length ? { id: id, model: model, icon: icon } : null;

      jUtility.DOM.updateRowMenuExternalItem(options);

      jUtility.DOM.toggleRowMenu(!!$('.btn-editOther.active').length);

      return true;
    }, // end fn

    /**
     * Update the row menu when an external item is checked
     * @method function
     * @return {[type]} [description]
     */
    updateRowMenuExternalItem: function updateRowMenuExternalItem(options) {
      var $row = $('.table-rowMenu-row'),
          iconClass = $row.find('.btn-rowMenu i').attr('data-tmpClass');

      if (!!options) {
        $('.chk_cid:checked,.chk_all').prop('checked', false).prop('indeterminate', false);

        $row.addClass('other').find('[data-custom]').hide().end().find('[data-custom-menu] .btn').hide().end().find('.btn-rowMenu').addClass('other').find('i').attr('data-tmpClass', options.icon).removeClass(iconClass).removeClass('fa-check-square-o').addClass(options.icon).end().end().find('.btn-primary').removeClass('btn-primary').addClass('btn-warning').end().find('.btn-history').hide().end();

        jUtility.DOM.toggleRowMenuItems(false);
      } else {

        $row.removeClass('other').find('[data-custom]').show().end().find('[data-custom-menu] .btn').show().end().find('.btn-rowMenu').removeClass('other').find('i').removeClass(iconClass).addClass('fa-check-square-o').removeAttr('data-tmpClass').end().end().find('.btn-warning').removeClass('btn-warning').addClass('btn-primary').end().find('.btn-history').show().end();
      }
    }, // end fn

    /**
     * Inspect the selected item
     * @method function
     * @return {[type]} [description]
     */
    inspectSelected: function inspectSelected() {
      jUtility.get({
        url: jUtility.getCurrentRowInspectUrl(),
        success: jUtility.callback.inspectSelected
      });
    }, // end fn

    /**
     * Update the row menu
     * @method function
     * @return {[type]} [description]
     */
    updateRowMenu: function updateRowMenu(num_checked) {
      switch (num_checked) {
        case 0:
          jUtility.DOM.toggleRowMenu(false);

          break;

        case 1:
          jUtility.DOM.toggleRowMenu(true);
          jUtility.DOM.toggleRowMenuItems(false);
          break;

        default:
          jUtility.DOM.toggleRowMenu(true);
          jUtility.DOM.toggleRowMenuItems(true);
          break;
      }

      // reset the row menu back to normal
      jUtility.DOM.updateRowMenuExternalItem();
    }, // end fn

    /**
     * Toggle Row Menu Items
     * @method function
     * @param  {[type]} hideNonMultiple [description]
     * @return {[type]}                 [description]
     */
    toggleRowMenuItems: function toggleRowMenuItems(disableNonMultiple) {
      if (disableNonMultiple) {
        $('.table-row.table-rowMenu-row .btn[data-multiple=false]').addClass('disabled').prop('disabled', true);
      } else {
        var p = jApp.aG().permissions;
        $('.table-row.table-rowMenu-row .btn').each(function () {
          if ($(this).attr('data-permission') == null || !!p[$(this).attr('data-permission')]) {
            $(this).removeClass('disabled').prop('disabled', false);
          }
        });
      }
    }, //end fn

    /**
     * Toggle Row Menu visibility
     * @method function
     * @return {[type]} [description]
     */
    toggleRowMenu: function toggleRowMenu(on) {
      if (on != null) {
        $('.table-row.table-rowMenu-row').toggle(on);
        $('.table-row.table-menu-row').toggle(!on);
      } else {
        $('.table-row.table-rowMenu-row').toggle();
        $('.table-row.table-menu-row').toggle();
      }
      jUtility.DOM.updateColWidths();
    }, // end fn

    /**
     * Clear the selected items
     * @method function
     * @return {[type]} [description]
     */
    clearSelection: function clearSelection() {
      jApp.aG().$().find('.chk_cid').prop('checked', false).end().find('.btn-editOther.active').removeClass('active btn-default').addClass('btn-link');

      $('.chk_cid').eq(0).change();
    }, // end fn

    /**
     * Initialize grid
     * @method function
     * @return {[type]} [description]
     */
    initGrid: function initGrid() {
      var id = jApp.opts().table + '_' + Date.now();

      jApp.aG().DOM.$grid = $('<div/>', { id: id }).html(jUtility.render(jApp.aG().html.tmpMainGridBody, jApp.opts().gridHeader)).find('select#RowsPerPage').val(jApp.aG().dataGrid.pagination.rowsPerPage).end().appendTo('#page-wrapper');

      jApp.aG().DOM.$tblMenu = jApp.aG().DOM.$grid.find('.table-btn-group');

      if (!jApp.opts().gridHeader.helpText) {
        jApp.tbl().find('.helpText').hide();
      }
    }, // end fn

    /**
     * Refresh the grid
     * @method function
     * @return {[type]} [description]
     */
    refreshGrid: function refreshGrid() {
      $(this).addClass('disabled').prop('disabled', true).find('i').addClass('fa-spin').end();
      // .delay(2000)
      // .removeClass('disabled')
      // .prop('disabled',false)
      // .find('i').removeClass('fa-spin').end();
      jUtility.updateAll();
    }, // end fn

    updateServerPagination: function updateServerPagination(total_pages) {
      $('.btn-firstPage,.btn-prevPage,.btn-nextPage,.btn-lastPage').toggle(total_pages > 1);
    }, // end fn

    /**
     * iterates through changed data and updates the DOM
     * @method function
     * @return {[type]} [description]
     */
    updateGrid: function updateGrid() {
      // init vars
      var appendTR = false,
          appendTD = false,
          tr,
          td,
          td_chk,
          chk_cid,
          value,
          $table = jApp.tbl();

      jApp.log(' ---Updating The Grid--- ');

      // iterate through the changed data
      $.each(jApp.activeGrid.dataGrid.delta, function (i, oRow) {

        // remove the no-data placeholder
        $table.find('.table-body .tr-no-data').remove();

        // save the current row.
        jApp.aG().currentRow = jApp.aG().dataGrid.data[i];

        // find row in the table if it exists
        tr = $table.find('.table-row[data-identifier="' + oRow[jApp.opts().pkey] + '"]');
        console.log('find tr, attempt 1', tr);

        // try the json key if you can't find the row by the pkey
        if (!tr.length) {
          tr = $table.find('.table-row[data-jsonkey=' + i + ']');
          console.log('find tr, attempt 2', tr);
        }

        // create the row if it does not exist
        if (!tr.length) {
          tr = $('<div/>', { 'class': 'table-row', 'data-identifier': oRow[jApp.opts().pkey], 'data-jsonkey': i });
          console.log('couldnt find tr, making a new one', tr);
          appendTR = true;

          // add the data to the row
          tr.data('rowData', jApp.aG().dataGrid.data[i]);

          td_chk = $('<div/>', { 'class': 'table-cell', "nowrap": "nowrap", "style": "position:relative;" });

          // apply the global cell attributes
          if (!!jApp.opts().cellAtts['*']) {
            $.each(jApp.opts().cellAtts['*'], function (at, fn) {
              td_chk.attr(at, fn());
            });
          }

          chk_cid = !!oRow[jApp.opts().pkey] ? '<input type="checkbox" class="chk_cid" name="cid[]" />' : '';

          td_chk.html('<label class="btn btn-default pull-right lbl-td-check" style="margin-left:20px;"> ' + chk_cid + '</label> \
                  <div class="rowMenu-container"></div> \
                  </div>&nbsp;');

          tr.append(td_chk);
        } else {
          // update the row data- attributes
          tr.attr('data-identifier', oRow[jApp.opts().pkey]).attr('data-jsonkey', i);

          td_chk = tr.find('.table-cell').eq(0);
          // update the attributes on the first cell

          if (!!jApp.opts().cellAtts['*']) {
            $.each(jApp.opts().cellAtts['*'], function (at, fn) {
              td_chk.attr(at, fn());
            });
          }
        }

        // iterate through the columns
        //$.each( jApp.aG().currentRow, function(key, value) {
        $.each(jApp.opts().columns, function (i, key) {

          // determine if the column is hidden
          if (_.indexOf(jApp.opts().hidCols, key) !== -1) {
            return false;
          }

          // find the cell if it exists
          td = tr.find('.table-cell[data-identifier="' + key + '"]');

          // create the cell if needed
          if (!td.length) {
            td = $('<div/>', { 'class': 'table-cell', 'data-identifier': key });
            appendTD = true;
          }

          // set td attributes
          if (!!jApp.opts().cellAtts['*']) {
            $.each(jApp.opts().cellAtts['*'], function (at, fn) {
              td.attr(at, fn());
            });
          }

          if (!!jApp.opts().cellAtts[key]) {
            $.each(jApp.opts().cellAtts[key], function (at, fn) {
              td.attr(at, fn());
            });
          }

          // prepare the value
          value = jUtility.prepareValue(jApp.aG().currentRow[key], key);

          if (td.html().trim() !== value.toString().trim()) {
            // set the cell value
            td.html(value).addClass('changed');
          }

          // add the cell to the row if needed
          if (appendTD) {
            tr.append(td);
          }
        }); // end each

        // add the row if needed
        if (appendTR) {
          console.log('adding the row to the dom', $('#tbl_grid_body').append(tr));
          //$('#tbl_grid_body').append(tr);
        }
      }); // end each

      // reset column widths
      jUtility.DOM.updateColWidths();

      setTimeout(function () {
        jApp.tbl().find('.table-cell.changed').removeClass('changed');
      }, 2000);

      jUtility.countdown();
      jUtility.DOM.page(jApp.opts().pageNum);

      // deal with the row checkboxes
      jApp.tbl().find('.table-row').filter(':not([data-identifier])').find('.lbl-td-check').remove() // remove the checkbox if there is no primary key for the row
      .end().end().filter('[data-identifier]') // add the checkbox if there is a primary key for the row
      .each(function (i, elm) {
        if (jUtility.isEditable() && $(elm).find('.lbl-td-check').length === 0) {
          $('<label/>', { class: 'btn btn-default pull-right lbl-td-check', style: 'margin-left:20px' }).append($('<input/>', { type: 'checkbox', class: 'chk_cid', name: 'cid[]' })).appendTo($(elm));
        }
      });

      jApp.tbl().find('.table-body .table-row, .table-head .table-row:last-child').each(function (i, elm) {
        if ($(elm).find('.table-cell,.table-header').length < 4) {
          $('<div/>', { 'class': 'table-cell' }).appendTo($(elm));
        }
      });

      jApp.tbl().find('.table-head .table-row:nth-child(2)').each(function (i, elm) {
        if ($(elm).find('.table-cell,.table-header').length < 3) {
          $('<div/>', { 'class': 'table-cell' }).appendTo($(elm));
        }
      });

      // process pagination
      jUtility.updatePagination();

      jApp.log('--done updating grid');
    },

    /**
     * Update the grid footer message
     * @method function
     * @return {[type]} [description]
     */
    updateGridFooter: function updateGridFooter() {
      var target = $('.data-footer-message'),
          self = jApp.activeGrid,
          data = self.dataGrid,
          message = '<div style="padding:6px;" class="alert-warning"><i class="fa fa-fw fa-info"></i> Records ' + data.from + ' - ' + data.to + ' of ' + data.total + ' total</div>';

      target.html(message);
    }, // end fn

    /**
     * Clear the grid footer
     * @method function
     * @return {[type]} [description]
     */
    clearGridFooter: function clearGridFooter() {
      $('.data-footer-message').html('');
    }, // end fn

    /**
     * Clear the menus so they can be rebuilt
     * @method function
     * @return {[type]} [description]
     */
    clearMenus: function clearMenus() {
      jApp.aG().DOM.$tblMenu.find('.btn:not(.btn-toggle)').remove();
      jApp.aG().DOM.$rowMenu.empty();
      //jApp.aG().DOM.$withSelectedMenu.empty();
    }, // end fn

    /**
     * Build a menu
     * @method function
     * @param  {obj} collection 	collection of menu options to iterate over
     * @param  {jQuery} target    DOM target for new buttons/links
     * @param  {string} type 			buttons | links
     */
    buildMenu: function buildMenu(collection, target, type, order) {
      type = type || 'buttons';

      //build menu
      _.each(collection, function (o, key) {
        if (!!o.ignore) return false;
        if (jUtility.isButtonEnabled(key)) {
          if (key === 'custom') {
            _.each(o, function (oo, kk) {
              if (!!oo.ignore) return false;

              if (jUtility.isPermission(oo)) {
                jApp.log('Button enabled : ' + kk);
                delete oo.disabled;
              } else {
                jApp.log('Button disabled : ' + kk);
                oo.disabled = true;
              }

              // mark this as a custom button
              oo['data-custom'] = true;

              if (type == 'buttons') {
                jUtility.DOM.createMenuButton(oo).appendTo(target);
              } else {
                jUtility.DOM.createMenuLink(oo).appendTo(target);
              }
            });
          } else {

            if (jUtility.isPermission(o)) {
              jApp.log('Button enabled : ' + key);
              delete o.disabled;
            } else {
              jApp.log('Button disabled : ' + key);
              o.disabled = true;
            }

            //jApp.log(o);
            if (type == 'buttons') {
              jUtility.DOM.createMenuButton(o).clone().appendTo(target);
            } else {
              jUtility.DOM.createMenuLink(o).appendTo(target);
            }
          }
        }
      });

      //sort buttons by data-order
      if (!!order) {
        var btns = target.find('[data-order]');

        btns.detach().sort(function (a, b) {
          var an = +a.getAttribute('data-order'),
              bn = +b.getAttribute('data-order');

          if (an > bn) return 1;
          if (an < bn) return -1;
          return 0;
        }).appendTo(target);
      }
    }, //end fn

    /**
     * Build a button menu
     * @method function
     */
    buildBtnMenu: function buildBtnMenu(collection, target, order) {
      jUtility.DOM.buildMenu(collection, target, 'buttons', order);
    }, //end fn

    /**
     * Build a link menu
     * @method function
     */
    buildLnkMenu: function buildLnkMenu(collection, target, order) {
      jUtility.DOM.buildMenu(collection, target, 'links', order);
    }, // end fn

    /**
     * Create a text input for a menu
     * @method function
     * @param  {[type]} o [description]
     * @return {[type]}   [description]
     */
    createMenuText: function createMenuText(o) {
      var $input,
          $div = $('<div/>', { style: 'position:relative', 'data-order': o['data-order'] }).html('<button style="display:none;" class="btn btn-link btn-clear-search btn-toggle">Reset</button>');

      $input = $('<input/>', _.omit(o, 'data-order'));

      $div.prepend($input);

      o.ignore = true;

      return $div;
    }, // end fn

    /**
     * Helper function to create menu links
     * @method function
     * @param  {obj} o html parameters of the link
     * @return {jQuery obj}
     */
    createMenuLink: function createMenuLink(o) {
      var $btn_choice = $('<a/>', { href: 'javascript:void(0)', 'data-permission': o['data-permission'] || null });

      //add the icon
      if (!!o.icon) {
        $btn_choice.append($('<i/>', { 'class': 'fa fa-fw fa-lg ' + o.icon }));
      }
      // add the label
      if (!!o.label) {
        $btn_choice.append($('<span/>').html(o.label));
      }

      // disable/enable the button
      if (o.disabled === true) {
        $btn_choice.prop('disabled', true).addClass('disabled');
      } else {
        $btn_choice.prop('disabled', false).removeClass('disabled');
      }

      // add the click handler
      if (!!o.fn) {
        if (typeof o.fn === 'string') {
          if (o.fn !== 'delete') {
            $btn_choice.off('click.custom').on('click.custom', function () {
              jApp.aG().withSelectedButton = $(this);
              jUtility.withSelected('custom', jApp.aG().fn[o.fn]);
            });
          } else {
            $btn_choice.off('click.custom').on('click.custom', function () {
              jApp.aG().withSelectedButton = $(this);
              jUtility.withSelected('delete', null);
            });
          }
        } else if (typeof o.fn === 'function') {
          $btn_choice.off('click.custom').on('click.custom', function () {
            jApp.aG().withSelectedButton = $(this);
            jUtility.withSelected('custom', o.fn);
          });
        }
      }

      // add the html5 data
      if (!!o.data) {
        _.each(o.data, function (v, k) {
          $btn_choice.attr('data-' + k, v);
        });
      }

      return $('<li/>', { class: o.class, title: o.title }).append($btn_choice);
    }, // end fn

    /**
     * Helper function to create menu buttons
     * @method function
     * @param  {obj} o html parameters of the button
     * @return {jQuery obj}
     */
    createMenuButton: function createMenuButton(params) {
      var $btn, $btn_a, $btn_choice, $ul;

      if (!!params.type && params.type == 'text') {
        return jUtility.DOM.createMenuText(params);
      }

      if (_typeof(params[0]) === 'object') {
        // determine if button is a dropdown menu

        $btn = $('<div/>', { class: 'btn-group btn-group-sm', 'data-custom-menu': true });

        // params[0] will contain the dropdown toggle button
        $btn_a = $('<a/>', {
          type: 'button',
          class: params[0].class + ' dropdown-toggle',
          href: '#',
          'data-toggle': 'dropdown'
        });

        // add the icon if applicable
        if (!!params[0].icon) {
          $btn_a.append($('<i/>', { 'class': 'fa fa-fw fa-lg ' + params[0].icon }));
        }
        // add the label if applicable
        if (!!params[0].label) {
          $btn_a.append($('<span/>').html(params[0].label));
        }
        // add the click handler, if applicable
        if (typeof params[0].fn !== 'undefined') {
          if (typeof params[0].fn === 'string') {
            $btn_a.off('click.custom').on('click.custom', jApp.aG().fn[params[0].fn]);
          } else if (typeof params[0].fn === 'function') {
            $btn_a.off('click.custom').on('click.custom', params[0].fn);
          }
        }
        // add the dropdown if there are multiple options
        if (params.length > 1) {
          $btn_a.append($('<span/>', { class: 'fa fa-caret-down' }));
          $btn.append($btn_a);
          $ul = $('<ul/>', { class: 'dropdown-menu' });

          _.each(params, function (o, key) {
            if (key === 0) return false;
            var signature = 'btn_' + Array(26).join((Math.random().toString(36) + '000000000000000000000').slice(2, 18)).slice(0, 25);

            $btn_choice = $('<a/>', $.extend(true, { 'data-permission': '' }, _.omit(o, 'fn'), { href: '#', 'data-signature': signature }));

            // disable/enable the button
            if (o.disabled === true) {
              $btn_choice.prop('disabled', true).addClass('disabled');
            } else {
              $btn_choice.prop('disabled', false).removeClass('disabled');
            }

            //add the icon
            if (!!o.icon) {
              $btn_choice.append($('<i/>', { 'class': 'fa fa-fw fa-lg ' + o.icon }));
            }
            // add the label
            if (!!o.label) {
              $btn_choice.append($('<span/>').html(o.label));
            }

            // add the click handler
            if (!!o.fn) {
              if (typeof o.fn === 'string') {
                $(document).delegate('a[data-signature=' + signature + ']', 'click.custom', jApp.aG().fn[o.fn]);
              } else if (typeof o.fn === 'function') {
                $(document).delegate('a[data-signature=' + signature + ']', 'click.custom', o.fn);
              }
            }

            $btn_choice.wrap('<li></li>').parent().appendTo($ul);
          });

          $btn.append($ul);
        } else {
          $btn.append($btn_a);
        }
      } else {
        // generate a random, unique button signature
        var signature = 'btn_' + Array(26).join((Math.random().toString(36) + '000000000000000000000').slice(2, 18)).slice(0, 25);

        $btn = $('<button/>', _.omit(params, ['fn'])).attr('data-signature', signature);

        if (!!params['data-custom']) {
          $btn.attr('btn-custom', true);
        }

        //add ignore flag for toggle buttons
        if ($btn.hasClass('btn-toggle')) {
          params.ignore = true;
        }
        if (!!params.icon) {
          $btn.append($('<i/>', { 'class': 'fa fa-fw fa-lg ' + params.icon }));
        }
        if (!!params.label) {
          $btn.append($('<span/>').html(params.label));
        }
        if (!!params.fn) {
          if (typeof params.fn === 'string') {
            $(document).delegate('button[data-signature=' + signature + ']', 'click.custom', jApp.aG().fn[params.fn]);
          } else if (typeof params.fn === 'function') {
            $(document).delegate('button[data-signature=' + signature + ']', 'click.custom', params.fn);
          }
        }
        // disable/enable the button
        if (params.disabled === true) {
          $btn.prop('disabled', true).addClass('disabled');
        } else {
          $btn.prop('disabled', false).removeClass('disabled');
        }
      }

      return $btn;
    }, // end fn


    /**  **  **  **  **  **  **  **  **  **
     *   overlay
     *
     *  Controls the modal overlays
     **  **  **  **  **  **  **  **  **  **/
    overlay: function overlay(which, action) {
      var $which = which == 1 ? '#modal_overlay' : '#modal_overlay2';
      if (action == 'on') {
        $($which).show();
      } else {
        $($which).hide();
      }
    },

    /**
     * Setup Grid Headers
     * @method function
     * @return {[type]} [description]
     */
    setupGridHeaders: function setupGridHeaders() {
      // init vars
      var appendTH = false,
          theaders,
          tfilters,
          btn,
          isActive,
          self = jApp.aG();

      // find the header row
      theaders = self.DOM.$grid.find('.table-head .table-row.colHeaders');

      // create the header row if needed
      if (!theaders.length) {
        tfilters = self.DOM.$grid.find('.table-row.tfilters');
        theaders = $('<div/>', { 'class': 'table-row colHeaders' });
        appendTH = true;

        // Append the check all checkbox
        if (jUtility.isEditable()) {
          theaders.append($('<div/>', { 'class': 'table-header table-header-text' }).html(jUtility.render(self.html.tmpCheckAll)));
        }

        // create header for this column if needed
        $.each(self.options.headers, function (i, v) {
          // determine if the current column is the active sortBy column
          isActive = self.options.columns[i] === self.options.sortBy ? true : false;

          // render the button
          btn = jUtility.render(self.html.tmpSortBtn, {
            'ColumnName': self.options.columns[i],
            'BtnClass': isActive ? 'btn-primary' : '',
            'faClass': isActive ? 'amount-desc' : 'amount-asc',
            'BtnTitle': isActive ? 'Sort Descending' : 'Sort Ascending'
          });

          // append the header
          theaders.append($('<div/>', { 'class': 'table-header table-header-text' }).html(btn + v));

          if (i > 0) {
            // skip the id column
            tfilters.append($('<div/>', { 'class': 'table-header', 'style': 'position:relative' }).append($('<input/>',
            //tfilters.append( $('<div/>', { 'class' : 'table-header'}).append( $('<input/>',
            {
              'rel': self.options.columns[i],
              'id': 'filter_' + self.options.columns[i],
              'name': 'filter_' + self.options.columns[i],
              'class': 'header-filter form-control',
              'style': 'width:100%',
              'placeholder': self.options.headers[i]
            })));
          }
        });

        self.DOM.$grid.find('.table-head').append(theaders);
        self.DOM.$grid.find('.paging').parent().attr('colspan', self.options.headers.length - 2);
        //self.DOM.$grid.find('.with-selected-menu').append( self.DOM.$withSelectedMenu.find('li') );
      }
    }

  } // end DOM fns
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

/**
 * formatters.js
 *
 * methods dealing with string formats
 */

;module.exports = {

  /**
   * Format phone number
   * @method function
   * @param  {[type]} phonenum [description]
   * @return {[type]}          [description]
   */
  formatPhone: function formatPhone(phonenum) {
    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum)) {
      var parts = phonenum.match(regexObj);
      var phone = "";
      if (parts[1]) {
        phone += "(" + parts[1] + ") ";
      }
      phone += parts[2] + "-" + parts[3];
      return phone;
    } else {
      //invalid phone number
      return phonenum;
    }
  }, // emd fn

  /**
   * Format zip code
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatZip: function formatZip(z) {
    z = z.replace(/[^0-9-]/gi, "");
    if (/^\d{6,9}$/.test(z)) {
      z = z.substring(0, 5) + "-" + z.substring(5);
      return z;
    } else {
      return z.substring(0, 10);
    }
  }, // end fn

  /**
   * Format number
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatNumber: function formatNumber(z) {
    if (isNaN(parseFloat(z))) {
      if (!isNaN(z.replace(/[^0-9\.]/gi, ""))) {
        return z.replace(/[^0-9\.]/gi, "");
      } else {
        return '';
      }
    } else {
      return parseFloat(z);
    }
  }, // end fn

  /**
   * Format Integer
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatInteger: function formatInteger(z) {
    if (!isNaN(z)) {
      return Math.round(z);
    } else {
      return z.replace(/[^0-9]/gi, "");
    }
  }, // end fn

  /**
   * Format SSN
   * @method formatSSN
   * @param  {[type]}  z [description]
   * @return {[type]}    [description]
   */
  formatSSN: function formatSSN(z) {
    z = z.replace(/\D/g, '');

    switch (z.length) {
      case 0:
      case 1:
      case 2:
      case 3:
        return z;

      case 4:
      case 5:
        return z.substr(0, 3) + '-' + z.substr(3);
    }

    return z.substr(0, 3) + '-' + z.substr(3, 2) + '-' + z.substr(5);
  }, // end fn

  /**
   * Format UpperCase
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatUC: function formatUC(z) {
    return z.toUpperCase();
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   prepareValue
   *
   *  @value 	(str) the column value as
   *  		specified in the JSON
   *  		data
   *  @column (str) the column name as
   *  		specified in the JSON
   *  		data
   *
   *  @return (str) the prepared value
   *
   *  prepares the value for display in
   *  the DOM, applying a template
   *  function if applicable.
   **  **  **  **  **  **  **  **  **  **/
  prepareValue: function prepareValue(value, column) {
    var template,
        templateFunctions = $.extend(true, {}, jApp.cellTemplates, jApp.opts().templates);

    if (typeof templateFunctions[column] === 'function') {
      template = templateFunctions[column];
      value = template(value);
    }

    if (value == null) {
      value = '';
    }

    if (value.toString().toLowerCase() === 'null') {
      return '';
    }

    if (value.toString().trim() === '') {
      return '';
    }

    if (value.toString().indexOf('|') !== -1) {
      value = value.replace(/\|/gi, ', ');
    }

    if (jUtility.isEllipses()) {
      value = jUtility.ellipsis(value);
    }

    return value;
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   ellipsis
   *
   *  Truncates cells that are too long
   *  according to the maxCellLength grid
   *  option. Adds a read-more button to
   *  any cells that are truncated.
   **  **  **  **  **  **  **  **  **  **/
  ellipsis: function ellipsis(txt) {
    var $rdMr, $dtch, $btn, $truncated, $e;

    $btn = $('<button/>', {
      'class': 'btn btn-success btn-xs btn-readmore pull-right',
      'type': 'button' }).html(' . . . ');

    $e = $('<div/>').html(txt);

    if ($e.text().length > jApp.opts().maxCellLength) {
      // look for child html elements
      if ($e.find(':not(i)').length > 0) {
        $rdMr = $('<span/>', { 'class': 'readmore' });

        while ($e.text().length > jApp.opts().maxCellLength) {
          // keep detaching html elements until the cell length is
          // within allowable limits

          // store detached element
          $dtch = !!$e.find(':not(i)').last().parent('h4').length ? $e.find(':not(i)').last().parent().detach() : $e.find(':not(i)').last().detach();

          // append the detached element to the readmore span
          $rdMr.html($rdMr.html() + ' ').append($dtch);

          // clean up the element html of extra whitespace
          $e.html($e.html().replace(/(\s*)?\,*(\s*)?$/ig, ''));
        }

        $e.append($rdMr).prepend($btn);
      } // end if

      // all text, no child html elements in the cell
      else {
          // place the extra text in the readmore span
          $rdMr = $('<span/>', { 'class': 'readmore' }).html($e.html().substr(jApp.opts().maxCellLength));

          // truncate the visible text in the cell
          $truncated = $e.html().substr(0, jApp.opts().maxCellLength);

          $e.empty().append($truncated).append($rdMr).prepend($btn);
        } // end else
    } // end if

    return $e.html();
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   render
   *
   *  @str   (string) containing
   *  		multiline text
   *
   *  @params (obj) contains key/value pairs
   *  		  defining parameters that
   *  		  will be interpolated in
   *  		  the returned text
   *
   *  returns the interpolated text
   **  **  **  **  **  **  **  **  **  **/
  render: function render(str, params) {
    var ptrn;

    //if (typeof params !== 'object') return '';

    _.each(params, function (val, key) {
      ptrn = new RegExp('\{@' + key + '\}', 'gi');
      str = str.replace(ptrn, val);
    });

    return str.replace(/\{@.+\}/gi, '');
  }, //end fn

  /**  **  **  **  **  **  **  **  **  **
   *   interpolate
   *
   *  @value (str) string to be interpolated
   *
   *  @return (str) the interpolated string
   *
   *  recursively processes the input value and
   *  replaces parameters of the form
   *  {@ParamName} with the corresponding
   *  value from the JSON data. Uses the
   *  replace callbak jUtility.replacer.
   *
   *  e.g. {@ParamName} -> jApp.aG().dataGrid.data[row][ParamName]
   **  **  **  **  **  **  **  **  **  **/
  interpolate: function interpolate(value) {
    return value.replace(/\{@(\w+)\}/gi, jUtility.replacer);
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   replacer - RegExp replace callback
   *
   *  @match 	(str) the match as defined
   *  			by the RegExp pattern
   *  @p1	  	{str} the partial match as
   *  			defined by the first
   *  			capture group
   *  @offset	(int) the offset where the
   *  			match was found in @string
   *  @string	(str) the original string
   *
   *  @return	(str) the replacement string
   **  **  **  **  **  **  **  **  **  **/
  replacer: function replacer(match, p1) {
    return jApp.aG().currentRow[p1];
  } // end fn

};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * forms.js
 *
 * methods dealing with forms
 */

;module.exports = {
  /**
   * Form boot up function
   * @method function
   * @return {[type]} [description]
   */
  formBootup: function formBootup() {
    if (typeof jApp.aG().fn.formBootup === 'function') {
      jApp.aG().fn.formBootup();
    }

    jUtility.$currentFormWrapper()
    //reset validation stuff
    .find('.has-error').removeClass('has-error').end().find('.has-success').removeClass('has-success').end().find('.help-block').hide().end().find('.form-control-feedback').hide().end()

    //multiselects
    .find('select:not(.no-bsms)').addClass('bsms').end().find('.bsms').each(function (i, elm) {
      if (!!$(elm).data('no-bsms')) return false;

      $(elm).data('jInput').fn.multiselect().fn.multiselectRefresh();
    }).end().find('[data-tokens]').each(function () {
      if (!!$(this).data('tokenFieldSource')) {
        $(this).tokenfield({
          autocomplete: {
            source: $(this).data('tokenFieldSource'),
            delay: 300
          },
          showAutoCompleteOnFocus: false,
          tokens: $(this).val() || []
        });
        $(this).data('tokenFieldSource', null);
      }
      // var val = $(this).data('value').split('|') || []
      // $(this).tokenfield( 'setTokens', val );
    }).end().find('[_linkedElmID]').change();
  }, //end fn

  /**
   * Refresh and rebuild the current form
   * @method function
   * @return {[type]} [description]
   */
  refreshCurrentForm: function refreshCurrentForm() {
    jApp.aG().store.flush();
    jUtility.oCurrentForm().fn.getColParams();
  }, // end fn

  /**
   * Clear the current form
   * @method function
   * @return {[type]} [description]
   */
  resetCurrentForm: function resetCurrentForm() {
    try {
      jUtility.$currentForm().clearForm();
      jUtility.$currentForm().find(':input:not("[type=button]"):not("[type=submit]"):not("[type=reset]"):not("[type=radio]"):not("[type=checkbox]")').each(function (i, elm) {
        if (!!$(elm).attr('data-static')) {
          return false;
        }

        //$(elm).data("DateTimePicker").remove();
        $(elm).val('');
        if ($(elm).hasClass('bsms') && !$elm.data('no-bsms')) {
          $(elm).data('jInput').fn.multiselect();
          $(elm).multiselect('refresh');
        }
      });
    } catch (e) {
      console.warn(e);
      return false;
    }
  }, // end fn

  /**
   * Does the meta data describe the current form?
   * @method function
   * @param  {[type]} meta [description]
   * @param  {[type]} oFrm [description]
   * @return {[type]}      [description]
   */
  doesThisMetaDataDescribeTheCurrentForm: function doesThisMetaDataDescribeTheCurrentForm(meta) {
    var current = jUtility.oCurrentForm();

    return meta.action === jApp.aG().action || !!meta.model && !!current.model && meta.model === current.model;
  }, // end fn

  /**
   * Maximize the current form
   * @method function
   * @return {[type]} [description]
   */
  maximizeCurrentForm: function maximizeCurrentForm() {
    try {
      jApp.log('   maximizing the current form');
      jApp.log(jUtility.oCurrentForm());

      var openFormKey = null,
          openForm;

      if (jApp.openForms.length) {
        jApp.openForms.last().wrapper.removeClass('max');

        _.each(jApp.openForms, function (meta, key) {
          if (jUtility.doesThisMetaDataDescribeTheCurrentForm(meta)) {
            jApp.log('openFormKey ' + key);
            openFormKey = key;
            jApp.log(meta);
            openForm = meta;
          }
        });
      }

      if (openFormKey !== null && !!openForm) {
        // form is minimized, open it.
        jApp.openForms.splice(openFormKey, 1); // remove the element from the array
        jApp.openForms.push(openForm); // move the element to the end
      } else {
        // open a new form
        jApp.openForms.push({
          wrapper: jUtility.$currentFormWrapper(),
          obj: jUtility.oCurrentForm() || {},
          $: jUtility.$currentForm(),
          action: jApp.aG().action,
          model: !!jUtility.oCurrentForm() ? jUtility.oCurrentForm().model : jUtility.getActionModel()
        });
      }

      // maximize the form and enable its buttons
      jApp.openForms.last().wrapper.addClass('max');
      //.find('button').prop('disabled',false);
    } catch (e) {
      console.warn(e);
      return false;
    }
  }, // end fn

  /**
   * Exit the current form, checking in the record if needed
   * @method function
   * @return {[type]} [description]
   */
  exitCurrentForm: function exitCurrentForm() {
    if (jUtility.needsCheckin()) {
      return jUtility.checkin(jUtility.getCurrentRowId());
    }

    return jUtility.closeCurrentForm();
  }, // end fn

  /**
   * Close the current form
   * @method function
   * @return {[type]} [description]
   */
  closeCurrentForm: function closeCurrentForm() {

    try {
      var oTgt = jApp.openForms.pop();

      jApp.aG().action = jApp.openForms.length ? jApp.openForms.last().action : '';

      jUtility.msg.clear();

      oTgt.wrapper.removeClass('max').find('.formContainer').css('height', '');
      oTgt.$.clearForm();

      if (!jApp.openForms.length) {
        jUtility.turnOffOverlays();
      } else {

        jApp.openForms.last().wrapper.addClass('max').find('button').prop('disabled', false).end().find('.btn-refresh').trigger('click');
      }
    } catch (ignore) {}
  }, // end fn


  /**
   * Load Form Definitions
   * @method function
   * @return {[type]} [description]
   */
  loadFormDefinitions: function loadFormDefinitions() {
    jApp.opts().formDefs = $.extend(true, {}, __webpack_require__(33), jApp.opts().formDefs);
  }, //end fn

  /**
   * Save the current form and leave open
   * @method function
   * @return {[type]} [description]
   */
  saveCurrentForm: function saveCurrentForm() {
    jApp.opts().closeOnSave = false;
    jUtility.submitCurrentForm($(this));
  }, // end fn

  /**
   * Save the current form and close
   * @method function
   * @return {[type]} [description]
   */
  saveCurrentFormAndClose: function saveCurrentFormAndClose() {

    jApp.opts().closeOnSave = true;
    jUtility.submitCurrentForm($(this));
    //jUtility.toggleRowMenu;
  }, // end fn

  /**
   * Upload the file
   * @method function
   * @param  {[type]} $inpt [description]
   * @return {[type]}       [description]
   */
  uploadFile: function uploadFile(inpt) {
    var formData = new FormData(),
        $btn,
        requestOptions;

    _.each(inpt.files, function (file, index) {
      formData.append(inpt.name, file, file.name);
    });

    $btn = jUtility.$currentFormWrapper().find('.btn-go');

    requestOptions = {
      url: jUtility.getCurrentFormAction(),
      data: formData,
      //fail : console.warn,
      always: function always() {
        jUtility.toggleButton($btn);
      }
    };

    jUtility.postJSONfile(requestOptions);

    jUtility.toggleButton($btn);
  }, // end fn

  /**
   * Submit the current form
   * @method function
   * @return {[type]} [description]
   */
  submitCurrentForm: function submitCurrentForm($btn) {
    var requestOptions = {
      url: jUtility.getCurrentFormAction(),
      data: jUtility.oCurrentForm().fn.getFormData(),
      success: jUtility.callback.submitCurrentForm,
      //fail : console.warn,
      always: function always() {
        jUtility.toggleButton($btn);
      }
    };

    jUtility.msg.clear();

    if (!!jUtility.$currentForm()) {
      var oValidate = new $.validator(jUtility.$currentForm());
      if (oValidate.errorState) {
        return false;
      }
    }

    // turn off the button to avoid multiple clicks;
    jUtility.toggleButton($btn);

    jUtility.postJSON(requestOptions);
  }, // end fn

  /**
   * Set focus on the current form
   * @method function
   * @return {[type]} [description]
   */
  setCurrentFormFocus: function setCurrentFormFocus() {
    jUtility.$currentFormWrapper().find(":input:not([type='hidden']):not([type='button'])").eq(0).focus();
  }, // end fn

  /**
   * Get the current form row data for the current row
   * @method function
   * @return {[type]} [description]
   */
  getCurrentFormRowData: function getCurrentFormRowData() {
    if (jApp.aG().action === 'new') return false;
    var url = jUtility.getCurrentRowDataUrl();

    jUtility.oCurrentForm().fn.getRowData(url, jUtility.callback.updateDOMFromRowData);
  }, //end fn

  /**
   * Get the action of the current form
   * @method function
   * @return {[type]} [description]
   */
  getCurrentFormAction: function getCurrentFormAction() {
    var action = jApp.aG().action;

    if (action.indexOf('edit') === 0 || action.indexOf('delete') === 0) {
      return jApp.routing.get(jUtility.getActionModel(), jUtility.getCurrentRowId());
    }

    switch (action) {
      case 'withSelectedDelete':
        return jApp.routing.get(jUtility.getActionModel());

      case 'withSelectedUpdate':
        return jApp.routing.get('massUpdate', jUtility.getActionModel());

      case 'resetPassword':
        return jApp.routing.get('resetPassword/' + jUtility.getCurrentRowId());

      default:
        return jApp.routing.get(jUtility.oCurrentForm().options.model); //jApp.opts().table;
    }
  }, // end fn

  /**
   * Build all grid forms
   * @method function
   * @return {[type]} [description]
   */
  buildForms: function buildForms() {
    jUtility.loadFormDefinitions();

    _.each(jApp.opts().formDefs, function (o, key) {
      jUtility.DOM.buildForm(o, key);
    });
  },

  /**
   * formFactory
   *
   * build a new form for the model
   * @method function
   * @param  {[type]} model [description]
   * @return {[type]}       [description]
   */
  formFactory: function formFactory(model) {
    var colparams,
        key = 'edit' + model + 'frm',
        htmlkey = 'editOtherFrm',
        tableFriendly = model,
        formDef = {
      model: model,
      pkey: 'id',
      tableFriendly: model,
      atts: { method: 'PATCH' }
    },
        oFrm;

    if (!jApp.colparams[model]) {
      console.warn('there are no colparams available for ' + model);
      return false;
    }

    // build the form
    oFrm = jUtility.DOM.buildForm(formDef, key, htmlkey, tableFriendly);

    // set up the form bindings
    jUtility.bind();

    return oFrm;
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   oCurrentForm
   *
   *  returns the currently active form
   *  or false if the current action is
   *  a non-standard action.
   *
   *  @return jForm (obj) || false
   *
   **  **  **  **  **  **  **  **  **  **/
  oCurrentForm: function oCurrentForm() {
    var key,
        tmpForms,
        tmpIndex,
        action = jApp.aG().action,
        model;

    if (!jUtility.needsForm()) return {};

    jApp.log(' Getting current form for action: ' + action, true);

    switch (jApp.aG().action) {
      case 'new':
      case 'New':
        return jApp.aG().forms.oNewFrm;

      case 'edit':
      case 'Edit':
        return jApp.aG().forms.oEditFrm;
    }

    // the form is not a standard form, try to find it from the current action

    // get an array of the form objects
    tmpForms = _.compact(_.map(jApp.aG().forms, function (o, key) {
      if (key.indexOf('o') === 0) return key;else return false;
    }));
    jApp.log('-- these are the forms', true);
    jApp.log(tmpForms, true);

    // try to find the action in the forms
    tmpIndex = _.findIndex(tmpForms, function (str) {
      return str.toLowerCase().indexOf(action.toLowerCase()) !== -1;
    });
    jApp.log('-- the index of the current form ' + tmpIndex, true);

    if (tmpIndex > -1) {
      jApp.log('Found current form', true);
      jApp.log(jApp.aG().forms[tmpForms[tmpIndex]], true);
      return jApp.aG().forms[tmpForms[tmpIndex]];
    }

    // we don't have a form built yet, see if we have a form definition for the current action and build the form
    return jUtility.formFactory(jUtility.getActionModel());

    // if ( jUtility.isOtherButtonChecked() ) {
    //   model = jUtility.getOtherButtonModel();
    //   console.log('building a new form for model ' + model )
    //   model = jApp.aG().temp.actionModel;
    //   return jUtility.formFactory( model );
    // } else {
    //   console.warn('could not find the actionModel to build the form');
    // }
  },

  /**  **  **  **  **  **  **  **  **  **
   *   $currentForm
   *
   *  returns the currently active form
   *  jQuery handle or false if the current
   *  action is a non-standard action.
   *
   *  @return jQuery (obj) || false
   *
   **  **  **  **  **  **  **  **  **  **/
  $currentForm: function $currentForm() {
    try {
      if (jUtility.needsForm()) {
        return jUtility.oCurrentForm().$();
      }
      return $('#div_inspect').find('.target');
    } catch (e) {
      console.warn('No current form object found');
      return false;
    }
  },

  /**  **  **  **  **  **  **  **  **  **
   *   $currentFormWrapper
   *
   *  returns the currently active form
   *  wrapper jQuery handle or false
   *  if the current action is a non-
   *  standard action.
   *
   *  @return jQuery (obj) || false
   *
   **  **  **  **  **  **  **  **  **  **/
  $currentFormWrapper: function $currentFormWrapper() {
    try {
      return jUtility.$currentForm().closest('.div-form-panel-wrapper');
    } catch (e) {
      console.warn('No current form wrapper found');
      return false;
    }
  },

  /**  **  **  **  **  **  **  **  **  **
   *   setupFormContainer
   *
   *  When a rowMenu button is clicked,
   *  this function sets up the
   *  corresponding div
   **  **  **  **  **  **  **  **  **  **/
  setupFormContainer: function setupFormContainer() {
    jUtility.DOM.overlay(2, 'on');

    if (jUtility.needsForm()) {
      jApp.aG().hideOverlayOnError = false;
      jUtility.resetCurrentForm();
      jUtility.maximizeCurrentForm();
      jUtility.setCurrentFormFocus();
      jUtility.formBootup();
      jUtility.getCurrentFormRowData();
    } else {
      jUtility.DOM.inspectSelected();
    }
  }, // end fn

  /**
   * Prepare form data
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  prepareFormData: function prepareFormData(data) {
    var fd = new FormData();

    _.each(data, function (value, key) {
      fd.append(key, value);
    });

    return fd;
  } // end fn
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * forms.js
 * @type {Object}
 *
 * Standard form definitions
 */
;module.exports = {

  editFrm: {
    model: jApp.opts().model,
    table: jApp.opts().table,
    pkey: jApp.opts().pkey,
    tableFriendly: jApp.opts().tableFriendly,
    atts: { method: 'PATCH' },
    disabledElements: jApp.opts().disabledFrmElements
  },

  newFrm: {
    model: jApp.opts().model,
    table: jApp.opts().table,
    pkey: jApp.opts().pkey,
    tableFriendly: jApp.opts().tableFriendly,
    atts: { method: 'POST' },
    disabledElements: jApp.opts().disabledFrmElements
  },

  colParamFrm: {
    table: 'col_params',
    pkey: 'colparam_id',
    tableFriendly: 'Column Parameters',
    btns: [],
    atts: {
      name: 'frm_element_editor'
    },
    fieldset: {
      'legend': '3. Edit Column Parameters'
    }
  }
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * grid.js
 *
 * grid methods
 */
;module.exports = {
  /**
   * Calculate where the grid should be positioned
   * @return {[type]} [description]
   */
  calculateGridPosition: function calculateGridPosition() {
    if (typeof $('.colHeaders').offset() === 'undefined') {
      return false;
    }
    return {
      marginTop: +$('.colHeaders').height() + $('.colHeaders').offset().top,
      height: +$(window).height() - 95 - $('.colHeaders').offset().top
    };
  }, // end fn

  /**
   * Toggle a button to prevent it being clicked multiple times
   * @method function
   * @return {[type]} [description]
   */
  toggleButton: function toggleButton($btn) {
    if ($btn.prop('disabled')) {
      $btn.prop('disabled', false).removeClass('disabled').html($btn.attr('data-original-text'));
    } else {
      $btn.attr('data-original-text', $btn.html()).prop('disabled', true).addClass('disabled').html('<i class="fa fa-spinner fa-pulse"></i>');
    }
  }, // end fn

  /**
   * Set instance options
   * @method function
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  setOptions: function setOptions(options) {
    jApp.aG().options = $.extend(true, jApp.opts(), options);
    jApp.log('1.1 Options Set');
    return jApp.aG();
  }, //end fn

  /**
   * Set up the visible columns menu for the table menu
   * @method function
   * @return {[type]} [description]
   */
  setupVisibleColumnsMenu: function setupVisibleColumnsMenu() {
    if (typeof jApp.aG().temp.visibleColumnsMenuSetup === 'undefined' || jApp.aG().temp.visibleColumnsMenuSetup === false) {
      // visible columns
      _.each(jApp.opts().columns, function (o, i) {
        if (i < jApp.opts().headers.length) {
          jApp.opts().tableBtns.custom.visColumns.push({
            icon: 'fa-check-square-o',
            label: jApp.opts().headers[i],
            fn: function fn() {
              jUtility.DOM.toggleColumnVisibility($(this));
            },
            'data-column': o
          });
        }
      });

      jApp.aG().temp.visibleColumnsMenuSetup = true;
    } else {
      return false;
    }
  }, //end fn

  /**
   * Toggle Delete Icon Visibility
   * @method function
   * @param  {[type]} $elm [description]
   * @return {[type]}      [description]
   */
  toggleDeleteIcon: function toggleDeleteIcon($elm) {
    if (!!$elm.val().toString().trim()) {
      $elm.next('.deleteicon').show();
    } else {
      $elm.next('.deleteicon').hide();
    }
  }, //end fn

  /**
   * Setup header filters
   * @method function
   * @return {[type]} [description]
   */
  setupHeaderFilters: function setupHeaderFilters() {
    if (jUtility.isHeaderFilters()) {
      jUtility.DOM.headerFilterDeleteIcons();
    }
    if (jUtility.isHeaderFiltersDisplay()) {
      jUtility.DOM.showHeaderFilters();
    } else {
      jUtility.DOM.hideHeaderFilters();
    }
  }, // end fn

  /**
   * Setup the table sort buttons
   * @method function
   * @return {[type]} [description]
   */
  setupSortButtons: function setupSortButtons() {
    if (jUtility.isSort()) {
      jApp.aG().$().find('.tbl-sort').show();
    } else {
      jApp.aG().$().find('.tbl-sort').hide();
    }
  }, // end fn

  /**
   * Display unload warning if a form is open
   * @method function
   * @return {[type]} [description]
   */
  unloadWarning: function unloadWarning() {
    if (jUtility.isFormOpen()) {
      return 'You have unsaved changes.';
    }
  }, // end fn

  /**
   * Update Grid from cached data
   * @method function
   * @return {[type]} [description]
   */
  updateGridFromCache: function updateGridFromCache() {
    jUtility.callback.update(jUtility.getCachedGridData());
    jUtility.DOM.togglePreloader(true);
    jUtility.buildMenus();
  }, // end fn

  /**
   * Retrieve cached data
   * @method function
   * @return {[type]} [description]
   */
  getCachedGridData: function getCachedGridData() {
    return jApp.aG().store.get('data_' + jApp.opts().table);
  }, // end fn

  /**
   * Turn off modal overlays
   * @method function
   * @return {[type]} [description]
   */
  turnOffOverlays: function turnOffOverlays() {
    jUtility.DOM.overlay(1, 'off');
    jUtility.DOM.overlay(2, 'off');
  }, //end fn

  /**
   * Update countdown
   * @method function
   * @return {[type]} [description]
   */
  updateCountdown: function updateCountdown() {
    if (jUtility.isFormOpen() || jUtility.isRowMenuOpen()) {
      return false;
    }

    var txt = 'Refreshing in ';
    txt += jApp.aG().dataGrid.intervals.countdownTimer > 0 ? Math.floor(jApp.aG().dataGrid.intervals.countdownTimer / 1000) : 0;
    txt += 's';

    jApp.tbl().find('button#btn_table_status').text(txt);
    jApp.aG().dataGrid.intervals.countdownTimer -= 1000;

    if (jApp.aG().dataGrid.intervals.countdownTimer <= -1000) {
      jUtility.updateAll();
    }
  }, // end fn

  /**
   * Initialize countdown timer value
   * @method function
   * @return {[type]} [description]
   */
  initCountdown: function initCountdown() {
    jApp.aG().dataGrid.intervals.countdownTimer = jApp.opts().refreshInterval - 2000;
  }, // end fn

  /**
   * Temp storage object
   * @type {Object}
   */
  temp: {},

  /**
   * Get the jInput object
   * @method function
   * @return {[type]} [description]
   */
  jInput: function (_jInput) {
    function jInput() {
      return _jInput.apply(this, arguments);
    }

    jInput.toString = function () {
      return _jInput.toString();
    };

    return jInput;
  }(function () {
    if (!this.temp.jInput) {
      this.temp.jInput = new jInput({});
    }
    return this.temp.jInput;
  }), // end fn

  /**
   * Get the jForm object
   * @method function
   * @return {[type]} [description]
   */
  jForm: function (_jForm) {
    function jForm() {
      return _jForm.apply(this, arguments);
    }

    jForm.toString = function () {
      return _jForm.toString();
    };

    return jForm;
  }(function () {
    if (!this.temp.jForm) {
      this.temp.jForm = new jForm({});
    }
    return this.temp.jForm;
  }), // end fn

  /**
   * Set AJAX Defaults
   * @method function
   * @return {[type]} [description]
   */
  setAjaxDefaults: function setAjaxDefaults() {
    $.ajaxSetup({
      headers: {
        'X-XSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    });
    jApp.log('4.1 Ajax Defaults Set');
  }, // end fn

  /**
   * Get the default grid options
   * @method function
   * @return {[type]} [description]
   */
  getDefaultOptions: __webpack_require__(35), // end fn

  /**
   * Get users permissions
   * @method function
   * @return {[type]} [description]
   */
  getPermissions: function getPermissions(model) {
    model = model || jApp.opts().model;

    var storeKey = model + '_permissions';

    if (!!jApp.store.get(storeKey, false)) {
      return jUtility.callback.getPermissions(jApp.store.get(storeKey));
    }

    jApp.log('0.1 - Getting Permissions from server');

    var requestOptions = {
      url: jApp.routing.get('getPermissions', model),
      success: function success(response) {
        jApp.store.set(storeKey, response, { TTL: 60000 * 60 * 24 });
        jApp.log(jApp.store.getTTL(storeKey));

        jUtility.callback.getPermissions(response);
        jUtility.buildMenus();
      }
    };

    jApp.log(requestOptions.url);

    jUtility.getJSON(requestOptions);
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   withSelected
   *  @action - The action to perform
   *
   *  When one or more rows are checked,
   *  this defines the various options
   *  that are available and the actions
   *  that are performed.
   **  **  **  **  **  **  **  **  **  **/
  withSelected: function withSelected(action, callback) {
    if (!!jUtility.numInvisibleItemsChecked()) {
      return jUtility.confirmInvisibleCheckedItems(action, callback);
    }

    return jUtility.withSelectedAction(action, callback, true);
  }, // end fn

  /**
   * With selected actions
   * @param  {[type]}   action   [description]
   * @param  {Function} callback [description]
   * @param  {[type]}   $cid     [description]
   * @return {[type]}            [description]
   */
  withSelectedAction: function withSelectedAction(action, callback, includeHidden) {
    var $cid = jUtility.getCheckedItems(includeHidden),
        model = jUtility.getActionModel();

    if (!$cid.length && !jUtility.isOtherButtonChecked()) {
      return jUtility.msg.warning('Nothing selected.');
    }

    switch (action) {
      // DELETE SELECTED
      case 'delete':
        jApp.aG().action = 'withSelectedDelete';
        bootbox.confirm('Are you sure you want to delete ' + $cid.length + ' ' + model + ' record(s)?', function (response) {
          if (!!response) {
            jUtility.postJSON({
              url: jUtility.getCurrentFormAction(),
              success: jUtility.callback.submitCurrentForm,
              data: { '_method': 'delete', 'ids[]': $cid }
            });
          }
        });
        break;

      case 'custom':
        return typeof callback === 'function' ? callback($cid) : console.warn('callback is not a valid function');

      default:
        console.warn(action + ' is not a valid withSelected action');
        break;
    }
  }, //end fn

  /**
   * [function description]
   * @method function
   * @param  {[type]} action [description]
   * @return {[type]}        [description]
   */
  actionHelper: function actionHelper(action) {
    var id, model;

    jApp.aG().action = action;

    if (jUtility.needsCheckout()) {

      id = jUtility.getCurrentRowId();
      model = jUtility.getActionModel();

      jUtility.checkout(id, model);
    }

    jUtility.setupFormContainer();
  }, // end fn

  /**
   * Get error message from response
   * @method function
   * @param  {[type]} response [description]
   * @return {[type]}          [description]
   */
  getErrorMessage: function getErrorMessage(response) {
    return typeof response.message !== 'undefined' ? response.message : 'There was a problem completing your request.';
  }, //end fn

  /**
   * Get the model that the action is action on
   * @method function
   * @return {[type]} [description]
   */
  getActionModel: function getActionModel() {
    if (jUtility.isOtherButtonChecked()) {
      return jUtility.getOtherButtonModel();
    }
    // if (!!jApp.aG().temp && !!jApp.aG().temp.actionModel) {
    //   return jApp.aG().temp.actionModel;
    // }
    return jApp.opts().model;
  }, // end fn

  /**
   * Get the id of the "other" button that is checked
   * @method function
   * @return {[type]} [description]
   */
  getOtherButtonId: function getOtherButtonId() {
    return jUtility.getActiveOtherButton().attr('data-id');
  }, // end fn

  /**
   * Get the model of the "other" button that is checked
   * @method function
   * @return {[type]} [description]
   */
  getOtherButtonModel: function getOtherButtonModel() {
    return jUtility.getActiveOtherButton().attr('data-model');
  }, // end fn

  /**
   * Get the "other" button that is checked
   * @method function
   * @return {[type]} [description]
   */
  getActiveOtherButton: function getActiveOtherButton() {
    return $('.btn-editOther.active').eq(0);
  }, // end fn

  /**
   * Get current row id
   * @method function
   * @return {[type]} [description]
   */
  getCurrentRowId: function getCurrentRowId() {
    // if (!!jApp.aG().temp && jApp.aG().temp.actionId > 0) {
    //   return jApp.aG().temp.actionId;
    // }
    if (jUtility.isOtherButtonChecked()) {
      return jUtility.getOtherButtonId();
    }

    return jUtility.getCheckedItems(true);
  }, //end fn

  /**
   * Set up HTML templates
   * @method function
   * @return {[type]} [description]
   */
  setupHtmlTemplates: function setupHtmlTemplates() {
    /**
     *   HTML TEMPLATES
     *
     *  Place large html templates here.
     *  These are rendered with
     *  the method jUtility.render.
     *
     *  Parameters of the form {@ParamName}
     *  are expanded by the render function
     */
    jApp.aG().html = $.extend(true, {}, __webpack_require__(36), jApp.opts().html);

    jApp.log('2.1 HTML Templates Done');
  }, // end fn


  /**
   * Get the rows that match the header filter text
   * @method function
   * @return {[type]} [description]
   */
  getHeaderFilterMatchedRows: function getHeaderFilterMatchedRows() {
    var currentColumn,
        currentMatches,
        matchedRows = [],
        targetString;

    //iterate through header filters and apply each
    jApp.tbl().find('.header-filter').filter(function () {
      return !!$(this).val().toString().trim().length;
    }).each(function () {

      // calculate the 1-indexed index of the current column
      currentColumn = +1 + $(this).parent().index();

      jApp.log('The current column is' + currentColumn);

      // set the target string for the current column
      // note: using a modified version of $.contains that is case-insensitive
      targetString = ".table-row .table-cell:nth-child(" + currentColumn + "):contains('" + $(this).val() + "')";

      // find the matched rows in the current column
      currentMatches = jApp.tbl().find(targetString).parent().map(function (i, obj) {
        return $(obj).index();
      }).get();

      // if matchedRows is non-empty, find the intersection of the
      // matched rows and the current rows - ie the rows that match
      // all of the criteria processed so far.
      matchedRows = !matchedRows.length ? currentMatches : _.intersection(matchedRows, currentMatches);
    });

    return matchedRows;
  }, //end fn

  /**
   * Sets the rows that are visible
   * @param  {array} visibleRows [indexes of the visible rows]
   * @return {[type]}             [description]
   */
  setVisibleRows: function setVisibleRows(visibleRows) {
    // show appropriate rows
    jApp.tbl().find('.table-body .table-row').hide().filter(function (i) {
      return _.indexOf(visibleRows, i) !== -1;
    }).show();
  }, // end fn


  /**  **  **  **  **  **  **  **  **  **
   *   deltaData
   *
   *  @prev (obj) previous state of object
   *  @now  (obj) current state of object
   *
   *  computes and returns the difference
   *  between two objects
   **  **  **  **  **  **  **  **  **  **/
  deltaData: function deltaData(prev, now) {
    var changes = {};
    _.each(now, function (row, i) {
      if (typeof prev[i] === 'undefined') {
        changes[i] = row;
      } else {
        _.each(row, function (value, prop) {
          if (prev[i][prop] !== value) {
            if (typeof changes[i] === 'undefined') {
              changes[i] = {};
            }
            changes[i][prop] = value;
          }
        });
      }
    });
    if ($.isEmptyObject(changes)) {
      return false;
    }
    return changes;
  }, // end fn

  /**
   * Checkout record
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  checkout: function checkout(id, model) {

    if (!model) {
      model = jApp.opts().model;
    }

    jUtility.getJSON({
      url: jApp.routing.get('checkout', model, id), //jApp.prefixURL( '/checkout/_' + jApp.opts().model + '_' + id ),
      success: jUtility.callback.checkout
    });
  }, // end fn

  /**
   * Checkin record
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  checkin: function checkin(id, model) {

    if (!model) {
      model = jUtility.getActionModel();
    }

    jUtility.getJSON({
      url: jApp.routing.get('checkin', model, id), // jApp.prefixURL( '/checkin/_' + jApp.opts().model + '_' + id ),
      success: jUtility.callback.checkin,
      always: function always() {/* ignore */}
    });
  }, // end fn

  /**
   * Get all checked out records
   * @return {[type]} [description]
   */
  getCheckedOutRecords: function getCheckedOutRecords() {
    jUtility.getJSON({
      url: jApp.routing.get('checkedOut', jApp.opts().model), //jApp.prefixURL( '/checkedout/_' + jApp.opts().model ),
      success: jUtility.callback.getCheckedOutRecords
    });
  }, // end fn

  /**
   * Set initial parameters
   * @method function
   * @return {[type]} [description]
   */
  setInitParams: function setInitParams() {
    var ag = jApp.aG();

    /**
     * Placeholders
     */
    ag = $.extend(ag, __webpack_require__(37));

    jApp.log('3.1 Initial Params Set');
  }, // end fn

  /**
   * Get checked items
   * @method function
   * @return {[type]} [description]
   *
   *  $cid = self.DOM.$grid.find('.chk_cid:checked').map( function(i,elm) {
     return $(elm).closest('.table-row').attr('data-identifier');
   }).get(); jUtility.withSelectedAction(action,callback, $cid);
   */
  getCheckedItems: function getCheckedItems(includeHidden) {
    var selector = !!includeHidden ? '.chk_cid:checked' : '.chk_cid:checked:visible';

    if (jUtility.isOtherButtonChecked()) {
      return [jUtility.getOtherButtonId()];
    }

    return $('.table-grid').find(selector).map(function (i, elm) {
      return $(elm).closest('.table-row').attr('data-identifier');
    }).get();
  }, // end fn

  /**
   * Get the data objects of the checked items
   * @method function
   * @param  {[type]} includeHidden [description]
   * @return {[type]}               [description]
   */
  getCheckedObjects: function getCheckedObjects(includeHidden) {
    var items = jUtility.getCheckedItems(includeHidden),
        ret = [];

    _.each(items, function (val) {
      ret.push(_.findWhere(jApp.activeGrid.dataGrid.data, { id: val }));
    });

    return ret;
  }, // end fn

  /**
   * Are any invisible items checked
   * @method function
   * @return {[type]} [description]
   */
  numInvisibleItemsChecked: function numInvisibleItemsChecked() {
    return jApp.tbl().find('.chk_cid:checked:not(:visible)').length;
  }, // end fn

  /**
   * Determine if invisible checked items
   *  should be included in the operation
   * @method function
   * @return {[type]} [description]
   */
  confirmInvisibleCheckedItems: function confirmInvisibleCheckedItems(action, _callback) {
    bootbox.dialog({
      message: "There are  " + jUtility.numInvisibleItemsChecked() + " items which are checked and are currently not displayed. Include hidden items in the operation?",
      title: "Include Hidden Checked Items?",
      buttons: {
        yes: { label: "Include Hidden Items", className: "btn-primary", callback: function callback() {
            return jUtility.withSelectedAction(action, _callback, true);
          } },
        no: { label: "Do Not Include Hidden Items", className: "btn-warning", callback: function callback() {
            return jUtility.withSelectedAction(action, _callback, false);
          } },
        cancel: { label: "Cancel Operation", className: "btn-danger", callback: function callback() {
            dialog.modal('hide');
          } }
      }
    });
  }, // end fn

  /**
   * Initialize the grid template
   * @method function
   * @return {[type]} [description]
   */
  initializeTemplate: function initializeTemplate() {
    jUtility.DOM.emptyPageWrapper();
    jApp.log('5.1 Page Wrapper Emptied');
    jUtility.DOM.initGrid();
    jApp.log('5.2 Grid Initialized');
  },

  /**
   * Build all grid menus
   * @method function
   * @return {[type]} [description]
   */
  buildMenus: function buildMenus() {
    jUtility.DOM.clearMenus();

    //jUtility.setupVisibleColumnsMenu();
    jUtility.DOM.buildBtnMenu(jApp.opts().tableBtns, jApp.aG().DOM.$tblMenu, true);
    jUtility.DOM.buildBtnMenu(jApp.opts().rowBtns, jApp.aG().DOM.$rowMenu, false);
    //jUtility.DOM.buildLnkMenu( jApp.opts().withSelectedBtns, jApp.aG().DOM.$withSelectedMenu );

    jUtility.DOM.attachRowMenu();

    jUtility.DOM.updateServerPagination(jApp.activeGrid.dataGrid.last_page);
    $(".btn-collapseText").toggleClass('active', jApp.opts().toggles.ellipses);
  }, // end fn

  /**
   * Sets up the countdown that displays
   *  the time remaining until the next
   *  refresh
   * @return {[type]} [description]
   */
  countdown: function countdown() {
    if (!jUtility.isAutoUpdate()) {
      return false;
    }

    jUtility.clearCountdownInterval();
    jUtility.initCountdown();
    jUtility.setCountdownInterval();
  }, // end fn

  /**
   * Update all the grids currently on the page
   * @return {[type]} [description]
   */
  updateAll: function updateAll() {
    jUtility.getGridData();
  } //end fn
};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

/**
 * defaults.js
 *
 * Default jGrid options
 */
;module.exports = function () {
  /**
   * Default Options
   * @type {Object}
   */
  return {

    /**
     * Form Definitions
     */
    formDefs: {},

    /**
     * Event Bindings
     * @type {Object}
     */
    bind: {},

    /**
     * Function definitions
     * @type {Object}
     */
    fn: {},

    /**
     * Toggles - true/false switches
     * @type {Object}
     */
    toggles: {

      /**
       * Data is editable
       * @type {Boolean} default true
       */
      editable: true,

      /**
       * Show the 'new' button
       * @type {Boolean} default true
       */
      new: true,

      /**
       * Show the 'edit' button
       * @type {Boolean} default true
       */
      edit: true,

      /**
       * Show the 'delete' buton
       * @type {Boolean} default true
       */
      del: true,

      /**
       * Show the sort buttons above each header
       * @type {Boolean} default true
       */
      sort: true,

      /**
       * Autoupdate the grid data automatically
       * @type {Boolean} default true
       */
      autoUpdate: true,

      /**
       * Auto-paginate the grid data
       * @type {Boolean} default true
       */
      paginate: true,

      /**
       * Enable the filter text boxes above each header
       * @type {Boolean} default true
       */
      headerFilters: true,

      /**
       * Display the header filters above each header
       */
      displayHeaderFilters: false,

      /**
       * Collapse the row menu
       * @type {Boolean} default true
       */
      collapseMenu: true,

      /**
       * Cache the grid data for faster load times
       * @type {Boolean} default false
       */
      caching: false,

      /**
       * Show the ellipsis ... and readmore buttons
       * @type {Boolean} default true
       */
      ellipses: true,

      /**
       * Checkout records before editing
       * @type {Boolean} default true
       */
      checkout: true,

      /**
       * Close form window after saving
       * @type {Boolean} default true
       */
      closeOnSave: true,

      /**
       * remove all rows when updating data
       * @type {Boolean}
       */
      removeAllRows: false
    },

    /**
     * General Grid Options
     */

    /**
     * If jApp.opts().toggles.autoUpdate, interval to autorefresh data in ms
     * @type {Number} default 602000
     */
    refreshInterval: 602000,

    /**
     * jQuery DOM target
     * @type {String} default '.table-responsive'
     */
    target: '.table-responsive', // htmlTable target

    /**
     * Data request options
     */

    /**
     * URL of JSON resource (grid data)
     * @type {String}
     */
    url: jApp.routing.get(jApp.opts().runtimeParams.model),

    /**
     * Database table name of grid data
     * @type {String}
     */
    table: '', // db table (for updates / inserts)

    /**
     * Primary key of table
     * @type {String}
     */
    pkey: 'id',

    /**
     * Where clause of data query
     * @type {String}
     */
    filter: '', // where clause for query

    /**
     * The order query scope to apply
     * @type string
     */
    order: 'oldest',

    /**
     * Scope of the query
     */
    scope: 'all',

    /**
     * db columns to show
     * @type {Array}
     */
    columns: [], // columns to query

    /**
     * Friendly headers for db columns
     * @type {Array}
     */
    headers: [], // headers for table

    /**
     * Data Presentation options
     */

    /**
     * Pagination - Rows per page
     * @type {Number} default 10
     */
    rowsPerPage: 10,

    /**
     * Pagination - Starting page number
     * @type {Number} default 1
     */
    pageNum: 1,

    /**
     * The friendly name of the table e.g. Users
     * @type {String}
     */
    tableFriendly: '', // friendly name of table

    /**
     * The column containing the friendly name of each row e.g. username
     * @type {String}
     */
    columnFriendly: '', // column containing friendly name of each row

    /**
     * The text shown when deleting a record
     * @type {String}
     */
    deleteText: 'Deleting',

    /**
     * html attributes to apply to individual columns
     * @type {Array}
     */
    cellAtts: [], // column attributes

    /**
     * html templates
     * @type {Array}
     */
    templates: [], // html templates

    /**
     * Max cell length in characters, if toggles.ellipses
     * @type {Number} default 38
     */
    maxCellLength: 38,

    /**
     * Max column length in pixels
     * @type {Number} default 450
     */
    maxColWidth: 450,

    /**
     * Bootstrap Multiselect Default Options
     * @type {Object}
     */
    bsmsDefaults: {
      //buttonContainer : '<div class="btn-group" />',
      enableCaseInsensitiveFiltering: true,
      includeSelectAllOption: true,
      maxHeight: 185,
      numberDisplayed: 1,
      dropUp: true
    },

    /**
     * Header Options
     * @type {Object}
     */
    gridHeader: {
      icon: 'fa-dashboard',
      headerTitle: 'Manage',
      helpText: false
    },

    /**
     * Disabled Form Elements - e.g. password
     * @type {Array}
     */
    disabledFrmElements: [],

    /**
     * Table buttons appear in the table menu below the header
     * @type {Object}
     */
    tableBtns: {

      tableMenu: {
        type: 'button',
        class: 'btn btn-success btn-tblMenu',
        id: 'btn_table_menu_heading',
        icon: 'fa-table',
        label: '&nbsp;',
        'data-order': 0
      },

      /**
       * Refresh Button
       * @type {Object}
       */
      refresh: {
        type: 'button',
        name: 'btn_refresh_grid',
        class: 'btn btn-success btn-refresh',
        icon: 'fa-refresh',
        label: 'Refresh',
        'data-order': 1
      },

      /**
       * New Button
       * @type {Object}
       */
      new: {
        type: 'button',
        class: 'btn btn-success btn-new',
        id: 'btn_edit',
        icon: 'fa-plus-circle',
        label: 'New',
        'data-permission': 'create_enabled',
        'data-order': 2
      },

      firstPage: {
        type: 'button',
        class: 'btn btn-success btn-firstPage',
        icon: 'fa-angle-double-left',
        label: '',
        'data-order': 3
      },

      prevPage: {
        type: 'button',
        class: 'btn btn-success btn-prevPage',
        icon: 'fa-angle-left',
        label: '',
        'data-order': 4
      },

      nextPage: {
        type: 'button',
        class: 'btn btn-success btn-nextPage',
        icon: 'fa-angle-right',
        label: '',
        'data-order': 5
      },

      lastPage: {
        type: 'button',
        class: 'btn btn-success btn-lastPage',
        icon: 'fa-angle-double-right',
        label: '',
        'data-order': 6
      },

      collapseText: {
        type: 'button',
        class: 'btn btn-success btn-collapseText btn-toggle active',
        icon: 'fa-ellipsis-h',
        label: 'Collapse Text',
        'data-order': 7
      },

      /**
       * Header Filters Button
       * @type {Object}
       */
      headerFilters: {
        type: 'button',
        class: 'btn btn-success btn-headerFilters btn-toggle',
        id: 'btn_toggle_header_filters',
        icon: 'fa-filter',
        label: 'Filter Rows',
        'data-order': 8
      },

      /**
       * Define custom buttons here. Custom buttons may also be defined at runtime.
       * @type {Object}
       */
      custom: {
        // visColumns : [
        //   { icon : 'fa-bars fa-rotate-90', label : ' Visible Columns' },
        // ],

      },

      search: {
        type: 'text',
        id: 'search',
        name: 'search',
        icon: 'fa-search',
        placeholder: 'Search...',
        'data-order': 9998
      },

      /**
       * Table status
       * @type {Object}
       */
      tableStatus: {
        type: 'button',
        class: 'btn btn-tableStatus',
        id: 'btn_table_status',
        icon: '',
        label: '',
        'data-order': 9999
      }
    },

    /**
     * Row buttons appear in each row of the grid
     * @type {Object}
     */
    rowBtns: {

      /**
       * The row menu heading. Displayed when an item is checked.
       * @type {Object}
       */
      rowMenu: {
        type: 'button',
        class: 'btn btn-primary btn-rowMenu',
        id: 'btn_row_menu_heading',
        icon: 'fa-check-square-o',
        label: '&nbsp;'
      },

      /**
       * Clear Selected Button
       * @type {Object}
       */
      clearSelected: {
        type: 'button',
        class: 'btn btn-primary btn-clear',
        id: 'btn_clear',
        icon: 'fa-square-o',
        label: 'Clear Selection'
      },

      /**
       * Inspect Record Button
       * @type {Object}
       */
      inspect: {
        type: 'button',
        class: 'btn btn-primary btn-inspect',
        id: 'btn_inspect',
        icon: 'fa-info',
        label: 'Inspect ...',
        'data-permission': 'read_enabled',
        'data-multiple': false
      },

      /**
       * Edit Button
       * @type {Object}
       */
      edit: {
        type: 'button',
        class: 'btn btn-primary btn-edit',
        id: 'btn_edit',
        icon: 'fa-pencil',
        label: 'Edit ...',
        'data-permission': 'update_enabled',
        'data-multiple': false
      },

      /**
       * Delete Button
       * @type {Object}
       */
      del: {
        type: 'button',
        class: 'btn btn-primary btn-delete',
        id: 'btn_delete',
        icon: 'fa-trash-o',
        label: 'Delete ...',
        //title : 'Delete Record ...',
        'data-permission': 'delete_enabled'
      },

      /**
       * Define custom buttons here. Custom buttons may also be defined at runtime.
       * @type {Object}
       */
      custom: {
        //custom : { type : 'button' } // etc.
      }
    },

    /**
     * With Selected Buttons appear in the dropdown menu of the header
     * @type {Object}
     */
    withSelectedBtns: {

      /**
       * Delete Selected ...
       * @type {Object}
       */
      del: {
        type: 'button',
        class: 'li-red',
        id: 'btn_delete',
        icon: 'fa-trash-o',
        label: 'Delete Selected ...',
        fn: 'delete',
        'data-permission': 'delete_enabled'
      },

      /**
       * Define custom buttons here. Custom buttons may also be defined at runtime.
       * @type {Object}
       */
      custom: {
        //custom : { type : 'button' } // etc.
      }
    },

    /**
     * linktables define the relationships between tables
     * @type {Array}
     */
    linkTables: []

  }; // end defaults
};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

/**
 * templates.js
 *
 * html templates
 */

;module.exports = {

  // main grid body
  tmpMainGridBody: "<div class=\"row\">\n                      <div class=\"col-lg-12\">\n                        <div class=\"panel panel-info panel-grid panel-grid1\">\n                          <div class=\"panel-heading\">\n                            <h1 class=\"page-header\"><i class=\"fa {@icon} fa-fw\"></i><span class=\"header-title\"> {@headerTitle} </span></h1>\n                            <div class=\"alert alert-warning alert-dismissible helpText\" role=\"alert\"> <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button> {@helpText} </div>\n                          </div>\n                          <div class=\"panel-body grid-panel-body\">\n                            <div class=\"table-responsive\">\n                              <div class=\"table table-bordered table-grid\">\n                                <div class=\"table-head\">\n                                  <div class=\"table-row table-menu-row\">\n                                    <div class=\"table-header table-menu-header\" style=\"width:100%\">\n                                      <div class=\"btn-group btn-group-sm table-btn-group\">  </div>\n                                    </div>\n                                  </div>\n                                  <div style=\"display:none\" class=\"table-row table-rowMenu-row\"></div>\n                                  <div style=\"display:none\" class=\"table-row table-otherMenu-row\"></div>\n                                  <div class=\"table-row tfilters\" style=\"display:none\">\n                                    <div style=\"width:10px;\" class=\"table-header\">&nbsp;</div>\n                                    <div style=\"width:175px;\" class=\"table-header\" align=\"right\"> <span class=\"label label-info filter-showing\"></span> </div>\n                                  </div>\n                                </div>\n                                <div class=\"table-body\" id=\"tbl_grid_body\">\n                                  <!--{$tbody}-->\n                                </div>\n                                <div class=\"table-foot\">\n                                  <div class=\"row\">\n                                    <div class=\"col-md-3\">\n                                      <div class=\"data-footer-message pull-left\"></div>\n                                      <div style=\"display:none\" class=\"ajax-activity-preloader pull-left\"></div>\n                                      <div class=\"divRowsPerPage pull-right\">\n                                        <select style=\"width:180px;display:inline-block\" type=\"select\" name=\"RowsPerPage\" id=\"RowsPerPage\" class=\"form-control\">\n                                          <option value=\"10\">10</option>\n                                          <option value=\"15\">15</option>\n                                          <option value=\"25\">25</option>\n                                          <option value=\"50\">50</option>\n                                          <option value=\"100\">100</option>\n                                          <option value=\"10000\">All</option>\n                                        </select>\n                                      </div>\n                                    </div>\n                                    <div class=\"col-md-9\">\n\n                                      <div class=\"paging\"></div>\n\n                                    </div>\n                                  </div>\n                                </div>\n                                <!-- /. table-foot -->\n                              </div>\n                            </div>\n                            <!-- /.table-responsive -->\n                          </div>\n                          <!-- /.panel-body -->\n                        </div>\n                        <!-- /.panel -->\n                      </div>\n                      <!-- /.col-lg-12 -->\n                    </div>\n                    <!-- /.row -->\n                    <div id=\"div_inspect\" class=\"div-btn-edit min div-form-panel-wrapper\">\n                      <div class=\"frm_wrapper\">\n                        <form>\n                          <div class=\"panel panel-info\">\n                            <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">\xD7</button> <i class=\"fa fa-info fa-fw\"></i> <span class=\"spn_editFriendlyName\">{@Name}</span> [Inspecting] </div>\n                            <div class=\"panel-overlay\" style=\"display:none\"></div>\n                            <div class=\"panel-body\">\n                                <div class=\"target\"></div>\n                            </div>\n                            <div class=\"panel-btns footer\">\n                              <button type=\"button\" class=\"btn btn-primary btn-formMenu\" id=\"btn_form_menu_heading\"><i class=\"fa fa-fw fa-bars\"></i></button>\n                              <button type=\"button\" class=\"btn btn-primary btn-cancel\" id=\"btn_cancel\"><i class=\"fa fa-fw fa-times\"></i> Close</button>\n                            </div>\n                          </div>\n                        </form>\n                      </div>\n                    </div>",

  // check all checkbox template
  tmpCheckAll: "<label for=\"chk_all\" class=\"btn btn-default pull-right\"> <input id=\"chk_all\" type=\"checkbox\" class=\"chk_all\" name=\"chk_all\"> </label>",

  // header filter clear text button
  tmpClearHeaderFilterBtn: "<span class=\"fa-stack fa-lg\"><i class=\"fa fa-circle-thin fa-stack-2x\"></i><i class=\"fa fa-remove fa-stack-1x\"></i></span>",

  // filter showing ie Showing X / Y Rows
  tmpFilterShowing: "<i class=\"fa fa-filter fa-fw\"></i>{@totalVis} / {@totalRows}",

  // table header sort button
  tmpSortBtn: "<button rel=\"{@ColumnName}\" title=\"{@BtnTitle}\" class=\"btn btn-sm btn-default {@BtnClass} tbl-sort pull-right\" type=\"button\"> <i class=\"fa fa-sort-{@faClass} fa-fw\"></i> </button>",

  // form templates
  forms: {

    // Edit Form Template
    editFrm: "<div id=\"div_editFrm\" class=\"div-btn-edit min div-form-panel-wrapper\">\n                <div class=\"frm_wrapper\">\n                  <div class=\"panel panel-blue\">\n                    <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">\xD7</button> <i class=\"fa fa-pencil fa-fw\"></i> <span class=\"spn_editFriendlyName\">{@Name}</span> [Editing] </div>\n                    <div class=\"panel-overlay\" style=\"display:none\"></div>\n                    <div class=\"panel-body\">\n                      <div class=\"row side-by-side\">\n                        <div class=\"side-by-side editFormContainer formContainer\"> </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>",

    // New Form Template
    newFrm: "<div id=\"div_newFrm\" class=\"div-btn-new min div-form-panel-wrapper\">\n                <div class=\"frm_wrapper\">\n                  <div class=\"panel panel-green\">\n                    <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">\xD7</button> <i class=\"fa fa-plus fa-fw\"></i> New: <span class=\"spn_editFriendlyName\">{@tableFriendly}</span> </div>\n                    <div class=\"panel-overlay\" style=\"display:none\"></div>\n                    <div class=\"panel-body\">\n                      <div class=\"row side-by-side\">\n                        <div class=\"side-by-side newFormContainer formContainer\"> </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>",

    // New Form Template
    newOtherFrm: "<div id=\"div_newFrm\" class=\"div-btn-new min div-form-panel-wrapper\">\n                    <div class=\"frm_wrapper\">\n                      <div class=\"panel panel-info\">\n                        <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">\xD7</button> <i class=\"fa fa-plus fa-fw\"></i> New: <span class=\"spn_editFriendlyName\">{@tableFriendly}</span> </div>\n                        <div class=\"panel-overlay\" style=\"display:none\"></div>\n                        <div class=\"panel-body\">\n                          <div class=\"row side-by-side\">\n                            <div class=\"side-by-side newOtherFormContainer formContainer\"> </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>",

    // Edit Form Template
    editOtherFrm: "<div id=\"div_editFrm\" class=\"div-btn-edit min div-form-panel-wrapper\">\n                    <div class=\"frm_wrapper\">\n                      <div class=\"panel panel-warning\">\n                        <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">\xD7</button> <i class=\"fa fa-plus fa-fw\"></i> Edit: <span class=\"spn_editFriendlyName\">{@tableFriendly}</span> </div>\n                        <div class=\"panel-overlay\" style=\"display:none\"></div>\n                        <div class=\"panel-body\">\n                          <div class=\"row side-by-side\">\n                            <div class=\"side-by-side editOtherFormContainer formContainer\"> </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>",

    // Delete Form Template
    deleteFrm: "<div id=\"div_deleteFrm\" class=\"div-btn-delete min div-form-panel-wrapper\">\n                  <div class=\"frm_wrapper\">\n                    <div class=\"panel panel-red\">\n                      <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\">\xD7</button> <i class=\"fa fa-trash-o fa-fw\"></i> <span class=\"spn_editFriendlyName\"></span> : {@deleteText} </div>\n                      <div class=\"panel-overlay\" style=\"display:none\"></div>\n                      <div class=\"panel-body\">\n                        <div class=\"row side-by-side\">\n                          <div class=\"delFormContainer formContainer\"></div>\n                        </div>\n                      </div>\n                    </div>\n                    </form>\n                  </div>\n                </div>",

    // Colparams Form Template
    colParamFrm: "<div id=\"div_colParamFrm\" class=\"div-btn-other min div-form-panel-wrapper\">\n                    <div class=\"frm_wrapper\">\n                      <div class=\"panel panel-lblue\">\n                        <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">\xD7</button> <i class=\"fa fa-gear fa-fw\"></i> <span class=\"spn_editFriendlyName\">Form Setup</span> </div>\n                        <div class=\"panel-overlay\" style=\"display:none\"></div>\n                        <div class=\"panel-body\" style=\"padding:0 0px !important;\">\n                          <div class=\"row side-by-side\">\n                            <div class=\"col-lg-3 tbl-list\"></div>\n                            <div class=\"col-lg-2 col-list\"></div>\n                            <div class=\"col-lg-7 param-list\">\n                              <div class=\"side-by-side colParamFormContainer formContainer\"> </div>\n                            </div>\n                          </div>\n                        </div>\n                        <div class=\"panel-heading\"> <input type=\"button\" class=\"btn btn-success btn-save\" id=\"btn_save\" value=\"Save\"> <button type=\"reset\" class=\"btn btn-warning btn-reset\" id=\"btn_reset\">Reset</button> <input type=\"button\" class=\"btn btn-warning btn-refreshForm\" id=\"btn_refresh\" value=\"Refresh Form\"> <input type=\"button\" class=\"btn btn-danger btn-cancel\" id=\"btn_cancel\" value=\"Cancel\"> </div>\n                      </div>\n                    </div>\n                  </div>"
  }
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

/**
 * initParams.js
 *
 * Initial Parameters
 */
;module.exports = {
  action: 'new',
  store: jApp.store,
  currentRow: {},
  permissions: {},
  dataGrid: {

    // pagination parameters
    pagination: {
      totalPages: -1,
      rowsPerPage: jApp.store.get('pref_rowsPerPage', jApp.aG().options.rowsPerPage)
    },

    // ajax requests
    requests: [],

    // request options
    requestOptions: {
      url: jApp.prefixURL(jApp.aG().options.url),
      data: {
        filter: jApp.aG().options.filter,
        scope: jApp.aG().options.scope || 'all',
        order: jApp.aG().options.order || 'oldest',
        filterMine: 0
      }
    },

    // intervals
    intervals: {},

    // timeouts
    timeouts: {},

    // grid data
    data: {},

    // data delta (i.e. any differences in the data)
    delta: {}
  }, // end dataGrid

  DOM: {
    $grid: false,
    $currentRow: false,
    $tblMenu: false,
    $rowMenu: $('<div/>', { class: 'btn-group btn-group-sm rowMenu', style: 'position:relative !important' })
  },

  forms: {},
  linkTables: [],
  temp: {}

};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * intervals.js
 *
 * methods dealing with intervals and timeouts
 */

;module.exports = {

  /**
   * Setup grid intervals
   * @method function
   * @return {[type]} [description]
   */
  setupIntervals: function setupIntervals() {
    if (jUtility.isAutoUpdate()) {
      jUtility.setCountdownInterval();

      if (jUtility.isCheckout()) {
        jUtility.setGetCheckedOutRecordsInterval();
      }
    }
  },

  /**
   * setTimeout helper
   * @method function
   * @param  {[type]}   o.key   [description]
   * @param  {Function} o.fn    [description]
   * @param  {[type]}   o.delay [description]
   * @return {[type]}         [description]
   */
  timeout: function timeout(o) {
    try {
      clearTimeout(jApp.aG().dataGrid.timeouts[o.key]);
    } catch (ignore) {}

    jApp.aG().dataGrid.timeouts[o.key] = setTimeout(o.fn, o.delay);
  }, //end fn

  /**
   * setInterval helper
   * @method function
   * @param  {[type]}   o.key   [description]
   * @param  {Function} o.fn    [description]
   * @param  {[type]}   o.delay [description]
   * @return {[type]}         [description]
   */
  interval: function interval(o) {
    try {
      clearInterval(jApp.aG().dataGrid.intervals[o.key]);
    } catch (ignore) {}

    jApp.aG().dataGrid.intervals[o.key] = setInterval(o.fn, o.delay);
  }, //end fn

  /**
   * Clear countdown interval
   * @method function
   * @return {[type]} [description]
   */
  clearCountdownInterval: function clearCountdownInterval() {
    try {
      clearInterval(jApp.aG().dataGrid.intervals.countdownInterval);
    } catch (e) {
      // do nothing
    }
  }, // end fn

  /**
   * Set the countdown interval
   * @method function
   * @return {[type]} [description]
   */
  setCountdownInterval: function setCountdownInterval() {
    jUtility.clearCountdownInterval();
    jApp.aG().dataGrid.intervals.countdownInterval = setInterval(jUtility.updateCountdown, 1000);
  }, // end fn

  /**
   * Clear the get checked out records interval
   * @method function
   * @return {[type]} [description]
   */
  clearGetCheckedOutRecordsIntevrval: function clearGetCheckedOutRecordsIntevrval() {
    try {
      clearInterval(jApp.aG().dataGrid.intervals.getCheckedOutRecords);
    } catch (e) {
      // do nothing
    }
  }, // end fn

  /**
   * Set the get checked out records interval
   * @method function
   * @return {[type]} [description]
   */
  setGetCheckedOutRecordsInterval: function setGetCheckedOutRecordsInterval() {
    if (jUtility.isCheckout()) {
      jUtility.clearGetCheckedOutRecordsIntevrval();
      jApp.aG().dataGrid.intervals.getCheckedOutRecords = setInterval(jUtility.getCheckedOutRecords, 10000);
    }
  } // end fn
};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

/**
 * messaging.js
 *
 * methods dealing with messaging
 */

;module.exports = {
  /**
   * Messaging functions
   * @type {Object}
   */
  msg: {

    /**
     * Clear all messages
     * @method function
     * @return {[type]} [description]
     */
    clear: function clear() {
      $.noty.closeAll();
    }, // end fn

    /**
     * Show a message
     * @method function
     * @param  {[type]} message [description]
     * @param  {[type]} type    [description]
     * @return {[type]}         [description]
     */
    show: function show(message, type, timeout) {
      return noty({
        layout: 'bottomLeft',
        text: message,
        type: type || 'info',
        dismissQueue: true,
        timeout: timeout || 3000
      });
    },

    /**
     * Display a success message
     * @method function
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    success: function success(message) {
      jUtility.msg.show(message, 'success');
    }, // end fn

    /**
     * Display a error message
     * @method function
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    error: function error(message) {
      jUtility.msg.show(message, 'error', 10000);
    }, // end fn

    /**
     * Display a warning message
     * @method function
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    warning: function warning(message) {
      jUtility.msg.show(message, 'warning');
    } // end fn

  }
};

/***/ }),
/* 40 */
/***/ (function(module, exports) {

/**
 * pagination.js
 *
 * methods dealing with pagination
 */
;module.exports = {

  /**
   * Update the total pages of the grid
   * @method function
   * @return {[type]} [description]
   */
  updateTotalPages: function updateTotalPages() {
    jApp.aG().dataGrid.pagination.totalPages = Math.ceil(jApp.aG().dataGrid.data.length / jApp.aG().dataGrid.pagination.rowsPerPage);
  }, // end fn

  /**
   * Update pagination of the grid
   * @method function
   * @return {[type]} [description]
   */
  updatePagination: function updatePagination() {
    //pagination
    if (jUtility.isPagination()) {
      jUtility.updateTotalPages();
      jUtility.setupBootpag();
      jUtility.setupRowsPerPage();
    } else {
      jUtility.hideBootpag();
    }
  }, // end fn

  /**
   * Setup bootpag pagination controls
   * @method function
   * @return {[type]} [description]
   */
  setupBootpag: function setupBootpag() {
    jApp.tbl().find('.paging').empty().show().bootpag({
      total: jApp.aG().dataGrid.pagination.totalPages,
      page: jApp.opts().pageNum,
      maxVisible: 20
    }).on("page", function (event, num) {
      jUtility.DOM.page(num);
    });
  }, // end fn

  /**
   * setup/update rows per page controls
   * @method function
   * @return {[type]} [description]
   */
  setupRowsPerPage: function setupRowsPerPage() {
    jApp.tbl().find('[name=RowsPerPage]').off('change.rpp').on('change.rpp', function () {
      jApp.tbl().find('[name=RowsPerPage]').val($(this).val());
      jUtility.DOM.rowsPerPage($(this).val());
    }).parent().show();
  }, // end fn

  /**
   * Hide bootpag pagination controls
   * @method function
   * @return {[type]} [description]
   */
  hideBootpag: function hideBootpag() {
    jApp.tbl().find('.paging').hide();
    jApp.tbl().find('[name=RowsPerPage]').parent().hide();
  } // end fn

};

/***/ }),
/* 41 */
/***/ (function(module, exports) {

/**
 * request.js
 *
 * methods dealing with ajax requests
 */
;module.exports = {
  /**
   * Get the data url of the current row
   * @method function
   * @return {[type]} [description]
   */
  getCurrentRowDataUrl: function getCurrentRowDataUrl() {
    // use the specified row data url if there is one
    if (typeof jApp.opts().rowDataUrl !== 'undefined') {
      return jApp.prefixURL(jApp.opts().rowDataUrl);
    }
    return jApp.routing.get(jUtility.getActionModel(), jUtility.getCurrentRowId());
  }, //end fn

  /**
   * Get the inspect url of the current row
   * @method function
   * @return {[type]} [description]
   */
  getCurrentRowInspectUrl: function getCurrentRowInspectUrl() {
    return jApp.routing.get('inspect', jUtility.getActionModel(), jUtility.getCurrentRowId());
  }, //end fn

  /**
   * Kill pending ajax request
   * @method function
   * @param  {[type]} requestName [description]
   * @return {[type]}             [description]
   */
  killPendingRequest: function killPendingRequest(requestName) {
    try {
      jApp.aG().dataGrid.requests[requestName].abort();
    } catch (e) {
      // nothing to abort
    }
  }, //end fn

  /**
   * get the requested url
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  get: function get(requestOptions) {
    var opts = $.extend(true, {
      url: null,
      data: {},
      success: function success() {},
      always: function always() {},
      fail: jUtility.callback.displayResponseErrors,
      complete: function complete() {}
    }, requestOptions);

    jApp.log('6.5 ajax options set, executing ajax request');
    return $.get(opts.url, opts.data, opts.success).fail(opts.fail).always(opts.always).complete(opts.complete);
  }, // end fn

  /**
   * get JSON
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  getJSON: function getJSON(requestOptions) {

    var opts = $.extend(true, {
      url: null,
      data: {},
      success: function success() {},
      fail: jUtility.callback.displayResponseErrors,
      always: function always() {},
      complete: function complete() {}
    }, requestOptions);

    jApp.log('6.5 ajax options set, executing ajax request');
    return $.getJSON(opts.url, opts.data, opts.success).fail(opts.fail).always(opts.always).complete(opts.complete);
  }, // end fn

  /**
   * post JSON
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  postJSON: function postJSON(requestOptions) {

    // if ( typeof requestOptions.data.append !== 'function' ) {
    //   requestOptions.data = jUtility.prepareFormData( requestOptions.data || {} );
    // }

    var opts = $.extend(true, {
      url: null,
      data: {},
      success: function success() {},
      always: function always() {},
      fail: jUtility.callback.displayResponseErrors,
      complete: function complete() {}
    }, requestOptions);

    return $.ajax({
      url: opts.url,
      data: opts.data,
      success: opts.success,
      type: 'POST',
      dataType: 'json'
    }).fail(opts.fail).always(opts.always).complete(opts.complete);
  }, // end fn

  /**
   * post JSON to upload a file
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  postJSONfile: function postJSONfile(requestOptions) {

    // if ( typeof requestOptions.data.append !== 'function' ) {
    //   requestOptions.data = jUtility.prepareFormData( requestOptions.data || {} );
    // }

    var opts = $.extend(true, {
      url: null,
      data: {},
      success: function success() {},
      always: function always() {},
      fail: jUtility.callback.displayResponseErrors,
      complete: function complete() {}
    }, requestOptions);

    return $.ajax({
      url: opts.url,
      data: opts.data,
      success: opts.success,
      type: 'POST',
      dataType: 'json',
      processData: false,
      contentType: false,
      cache: false
    }).fail(opts.fail).always(opts.always).complete(opts.complete);
  }, // end fn

  /**
   * Execute the grid data request
   * @method function
   * @return {[type]} [description]
   */
  executeGridDataRequest: function executeGridDataRequest(search) {
    jApp.log('6.3 Setting up options for the data request');
    var params = $.extend(true, jApp.aG().dataGrid.requestOptions, {
      success: jUtility.callback.update,
      fail: jUtility.gridDataRequestCallback.fail,
      always: !!search ? jUtility.gridDataRequestCallback.search : jUtility.gridDataRequestCallback.always,
      complete: jUtility.gridDataRequestCallback.complete
    }),
        r = jApp.aG().dataGrid.requests;

    jUtility.DOM.clearGridFooter();

    // show the preloader
    jUtility.DOM.activityPreloader('show');

    // execute the request
    jApp.log('6.4 Executing ajax request');

    jUtility.killPendingRequest('gridData');

    r.gridData = jUtility.getJSON(params);
  }, //end fn

  /**
   * get the grid data
   * @method function
   * @param  {[type]} preload [description]
   * @return {[type]}         [description]
   */
  getGridData: function getGridData(preload) {
    // show the preload if needed
    if (!!preload) {
      jUtility.DOM.togglePreloader();
      //jUtility.setupIntervals();
    }

    jUtility.clearCountdownInterval();

    jApp.log('6.1 Starting Countdown timer');
    // start the countdown timer


    // kill the pending request if it's still going
    jUtility.killPendingRequest('gridData');

    // use cached copy, if available
    if (jUtility.isDataCacheAvailable()) {
      jApp.log('6.2 Updating grid from cache');
      setTimeout(jUtility.updateGridFromCache(), 100);
    } else {
      jApp.log('6.2 Executing data request');
      jUtility.executeGridDataRequest();
    }
  }, // end fn

  /**
   * Grid data request callback methods
   * @type {Object}
   */
  gridDataRequestCallback: {
    /**
     * Grid data request failed
     * @method function
     * @return {[type]} [description]
     */
    fail: function fail() {
      console.warn('update grid data failed, it may have been aborted');
    }, //end fn

    /**
     * Always execute after grid data request
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    always: function always(response) {
      jUtility.callback.displayResponseErrors(response);
      if (jUtility.isCaching()) {
        jApp.aG().store.set('data_' + jApp.opts().table, response);
      }
      jUtility.DOM.togglePreloader(true);
    }, // end fn

    /**
     * Execute after grid data search request
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    search: function search(response) {
      jUtility.callback.displayResponseErrors(response);
      if (jUtility.isCaching()) {
        jApp.aG().store.set('data_' + jApp.opts().table, response);
      }
      jUtility.DOM.togglePreloader(true);

      $('#search').focus().val($('#search').val());
    }, // end fn

    /**
     * Grid data request completed
     * @method function
     * @return {[type]} [description]
     */
    complete: function complete() {
      jUtility.DOM.activityPreloader('hide');
      jUtility.countdown();
    } // end fn
  } // end callbacks
};

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **
 *
 *  jInput.class.js - Custom Form Input JS class
 *
 *  Defines the properties and methods of the
 *  custom input class.
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *
 *  Created:        4/20/15
 *  Last Updated:    4/20/15
 *
 *  Prereqs:    jQuery, lodash, jStorage.js
 *
 *  Changelog:
 *   4-20-15    Created the jInput class
 *
 *   4-30-15    Added the feedback icon container and help block container
 */
;'use strict';

/* harmony default export */ __webpack_exports__["a"] = (function (options) {

  var

  /**
   * Alias of this
   * @type Object
   */
  self = this,
      runopts = options || {},
      $ = window.$;

  /**
   * Initialize this object
   */
  $.extend(true, self, {
    options: {
      atts: {}
    },

    /**
     * Run time options
     * @type Object
     */
    runopts: runopts,

    /**
     * Separator placeholder
     * @type {[type]}
     */
    $separator: {}
  });

  /**
   * Method definitions
   * @type {Object}
   */
  self.fn = $.extend(true,

  /**
   * Select/token options functions
   */
  __webpack_require__(60)(self),

  /**
   * Array input functions
   */
  __webpack_require__(61)(self),

  /**
   * Multiselect functions
   */
  __webpack_require__(62)(self),

  /**
   * Toggling functions
   */
  __webpack_require__(63)(self),

  /**
   * Other input-related functions
   */
  __webpack_require__(64)(self)); // end fns

  /**
   * Builders for html elements
   * @type {Object}
   */
  self.factory = __webpack_require__(71)(self);

  // initialize
  self.fn._preInit(options || {});
});; // end fn

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(44);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var ps = __webpack_require__(45);
var psInstances = __webpack_require__(0);

function mountJQuery(jQuery) {
  jQuery.fn.perfectScrollbar = function (settingOrCommand) {
    return this.each(function () {
      if (typeof settingOrCommand === 'object' ||
          typeof settingOrCommand === 'undefined') {
        // If it's an object or none, initialize.
        var settings = settingOrCommand;

        if (!psInstances.get(this)) {
          ps.initialize(this, settings);
        }
      } else {
        // Unless, it may be a command.
        var command = settingOrCommand;

        if (command === 'update') {
          ps.update(this);
        } else if (command === 'destroy') {
          ps.destroy(this);
        }
      }
    });
  };
}

if (true) {
  // AMD. Register as an anonymous module.
  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (mountJQuery),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  var jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    mountJQuery(jq);
  }
}

module.exports = mountJQuery;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var destroy = __webpack_require__(46);
var initialize = __webpack_require__(50);
var update = __webpack_require__(58);

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var dom = __webpack_require__(4);
var instances = __webpack_require__(0);

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  dom.remove(i.scrollbarX);
  dom.remove(i.scrollbarY);
  dom.remove(i.scrollbarXRail);
  dom.remove(i.scrollbarYRail);
  _.removePsClasses(element);

  instances.remove(element);
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
  theme: 'default'
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventElement = function (element) {
  this.element = element;
  this.events = {};
};

EventElement.prototype.bind = function (eventName, handler) {
  if (typeof this.events[eventName] === 'undefined') {
    this.events[eventName] = [];
  }
  this.events[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function (eventName, handler) {
  var isHandlerProvided = (typeof handler !== 'undefined');
  this.events[eventName] = this.events[eventName].filter(function (hdlr) {
    if (isHandlerProvided && hdlr !== handler) {
      return true;
    }
    this.element.removeEventListener(eventName, hdlr, false);
    return false;
  }, this);
};

EventElement.prototype.unbindAll = function () {
  for (var name in this.events) {
    this.unbind(name);
  }
};

var EventManager = function () {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
  var ee = this.eventElements.filter(function (eventElement) {
    return eventElement.element === element;
  })[0];
  if (typeof ee === 'undefined') {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function (element, eventName, handler) {
  this.eventElement(element).unbind(eventName, handler);
};

EventManager.prototype.unbindAll = function () {
  for (var i = 0; i < this.eventElements.length; i++) {
    this.eventElements[i].unbindAll();
  }
};

EventManager.prototype.once = function (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (e) {
    ee.unbind(eventName, onceHandler);
    handler(e);
  };
  ee.bind(eventName, onceHandler);
};

module.exports = EventManager;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var cls = __webpack_require__(6);
var instances = __webpack_require__(0);
var updateGeometry = __webpack_require__(2);

// Handlers
var handlers = {
  'click-rail': __webpack_require__(51),
  'drag-scrollbar': __webpack_require__(52),
  'keyboard': __webpack_require__(53),
  'wheel': __webpack_require__(54),
  'touch': __webpack_require__(55),
  'selection': __webpack_require__(56)
};
var nativeScrollHandler = __webpack_require__(57);

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = _.extend(i.settings, userSettings);
  cls.add(element, 'ps-theme-' + i.settings.theme);

  i.settings.handlers.forEach(function (handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  updateGeometry(element);
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var instances = __webpack_require__(0);
var updateGeometry = __webpack_require__(2);
var updateScroll = __webpack_require__(3);

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = function (e) { e.stopPropagation(); };

  i.event.bind(i.scrollbarY, 'click', stopPropagation);
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var positionTop = e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    updateScroll(element, 'top', element.scrollTop + direction * i.containerHeight);
    updateGeometry(element);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'click', stopPropagation);
  i.event.bind(i.scrollbarXRail, 'click', function (e) {
    var positionLeft = e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    updateScroll(element, 'left', element.scrollLeft + direction * i.containerWidth);
    updateGeometry(element);

    e.stopPropagation();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindClickRailHandler(element, i);
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var dom = __webpack_require__(4);
var instances = __webpack_require__(0);
var updateGeometry = __webpack_require__(2);
var updateScroll = __webpack_require__(3);

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + (deltaX * i.railXRatio);
    var maxLeft = Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = _.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
    updateScroll(element, 'left', scrollLeft);
  }

  var mouseMoveHandler = function (e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = _.toInt(dom.css(i.scrollbarX, 'left')) * i.railXRatio;
    _.startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + (deltaY * i.railYRatio);
    var maxTop = Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = _.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
    updateScroll(element, 'top', scrollTop);
  }

  var mouseMoveHandler = function (e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = _.toInt(dom.css(i.scrollbarY, 'top')) * i.railYRatio;
    _.startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseScrollXHandler(element, i);
  bindMouseScrollYHandler(element, i);
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var dom = __webpack_require__(4);
var instances = __webpack_require__(0);
var updateGeometry = __webpack_require__(2);
var updateScroll = __webpack_require__(3);

function bindKeyboardHandler(element, i) {
  var hovered = false;
  i.event.bind(element, 'mouseenter', function () {
    hovered = true;
  });
  i.event.bind(element, 'mouseleave', function () {
    hovered = false;
  });

  var shouldPrevent = false;
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if ((e.isDefaultPrevented && e.isDefaultPrevented()) || e.defaultPrevented) {
      return;
    }

    var focused = dom.matches(i.scrollbarX, ':focus') ||
                  dom.matches(i.scrollbarY, ':focus');

    if (!hovered && !focused) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (_.isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
    case 37: // left
      if (e.metaKey) {
        deltaX = -i.contentWidth;
      } else if (e.altKey) {
        deltaX = -i.containerWidth;
      } else {
        deltaX = -30;
      }
      break;
    case 38: // up
      if (e.metaKey) {
        deltaY = i.contentHeight;
      } else if (e.altKey) {
        deltaY = i.containerHeight;
      } else {
        deltaY = 30;
      }
      break;
    case 39: // right
      if (e.metaKey) {
        deltaX = i.contentWidth;
      } else if (e.altKey) {
        deltaX = i.containerWidth;
      } else {
        deltaX = 30;
      }
      break;
    case 40: // down
      if (e.metaKey) {
        deltaY = -i.contentHeight;
      } else if (e.altKey) {
        deltaY = -i.containerHeight;
      } else {
        deltaY = -30;
      }
      break;
    case 33: // page up
      deltaY = 90;
      break;
    case 32: // space bar
      if (e.shiftKey) {
        deltaY = 90;
      } else {
        deltaY = -90;
      }
      break;
    case 34: // page down
      deltaY = -90;
      break;
    case 35: // end
      if (e.ctrlKey) {
        deltaY = -i.contentHeight;
      } else {
        deltaY = -i.containerHeight;
      }
      break;
    case 36: // home
      if (e.ctrlKey) {
        deltaY = element.scrollTop;
      } else {
        deltaY = i.containerHeight;
      }
      break;
    default:
      return;
    }

    updateScroll(element, 'top', element.scrollTop - deltaY);
    updateScroll(element, 'left', element.scrollLeft + deltaX);
    updateGeometry(element);

    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.preventDefault();
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindKeyboardHandler(element, i);
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var instances = __webpack_require__(0);
var updateGeometry = __webpack_require__(2);
var updateScroll = __webpack_require__(3);

function bindMouseWheelHandler(element, i) {
  var shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(deltaX, deltaY) {
    var child = element.querySelector('textarea:hover, select[multiple]:hover, .ps-child:hover');
    if (child) {
      if (!window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
        // if not scrollable
        return false;
      }

      var maxScrollTop = child.scrollHeight - child.clientHeight;
      if (maxScrollTop > 0) {
        if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = child.scrollLeft - child.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    var delta = getDeltaFromEvent(e);

    var deltaX = delta[0];
    var deltaY = delta[1];

    if (shouldBeConsumedByChild(deltaX, deltaY)) {
      return;
    }

    shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'top', element.scrollTop + (deltaX * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'left', element.scrollLeft - (deltaY * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    }

    updateGeometry(element);

    shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== "undefined") {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== "undefined") {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseWheelHandler(element, i);
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var instances = __webpack_require__(0);
var updateGeometry = __webpack_require__(2);
var updateScroll = __webpack_require__(3);

function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    updateScroll(element, 'top', element.scrollTop - differenceY);
    updateScroll(element, 'left', element.scrollLeft - differenceX);

    updateGeometry(element);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;
  var inGlobalTouch = false;
  var inLocalTouch = false;

  function globalTouchStart() {
    inGlobalTouch = true;
  }
  function globalTouchEnd() {
    inGlobalTouch = false;
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }
  function shouldHandle(e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }
  function touchStart(e) {
    if (shouldHandle(e)) {
      inLocalTouch = true;

      var touch = getTouch(e);

      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;

      startTime = (new Date()).getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }

      e.stopPropagation();
    }
  }
  function touchMove(e) {
    if (!inLocalTouch && i.settings.swipePropagation) {
      touchStart(e);
    }
    if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = (new Date()).getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPreventDefault(differenceX, differenceY)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (!inGlobalTouch && inLocalTouch) {
      inLocalTouch = false;

      clearInterval(easingLoop);
      easingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(easingLoop);
          return;
        }

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (supportsTouch) {
    i.event.bind(window, 'touchstart', globalTouchStart);
    i.event.bind(window, 'touchend', globalTouchEnd);
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  } else if (supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(window, 'pointerdown', globalTouchStart);
      i.event.bind(window, 'pointerup', globalTouchEnd);
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(window, 'MSPointerDown', globalTouchStart);
      i.event.bind(window, 'MSPointerUp', globalTouchEnd);
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

module.exports = function (element) {
  if (!_.env.supportsTouch && !_.env.supportsIePointer) {
    return;
  }

  var i = instances.get(element);
  bindTouchHandler(element, i, _.env.supportsTouch, _.env.supportsIePointer);
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var instances = __webpack_require__(0);
var updateGeometry = __webpack_require__(2);
var updateScroll = __webpack_require__(3);

function bindSelectionHandler(element, i) {
  function getRangeNode() {
    var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  }

  var scrollingLoop = null;
  var scrollDiff = {top: 0, left: 0};
  function startScrolling() {
    if (!scrollingLoop) {
      scrollingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(scrollingLoop);
          return;
        }

        updateScroll(element, 'top', element.scrollTop + scrollDiff.top);
        updateScroll(element, 'left', element.scrollLeft + scrollDiff.left);
        updateGeometry(element);
      }, 50); // every .1 sec
    }
  }
  function stopScrolling() {
    if (scrollingLoop) {
      clearInterval(scrollingLoop);
      scrollingLoop = null;
    }
    _.stopScrolling(element);
  }

  var isSelected = false;
  i.event.bind(i.ownerDocument, 'selectionchange', function () {
    if (element.contains(getRangeNode())) {
      isSelected = true;
    } else {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'mouseup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'keyup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });

  i.event.bind(window, 'mousemove', function (e) {
    if (isSelected) {
      var mousePosition = {x: e.pageX, y: e.pageY};
      var containerGeometry = {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight
      };

      if (mousePosition.x < containerGeometry.left + 3) {
        scrollDiff.left = -5;
        _.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        _.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        _.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        _.startScrolling(element, 'y');
      } else {
        scrollDiff.top = 0;
      }

      if (scrollDiff.top === 0 && scrollDiff.left === 0) {
        stopScrolling();
      } else {
        startScrolling();
      }
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindSelectionHandler(element, i);
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var instances = __webpack_require__(0);
var updateGeometry = __webpack_require__(2);

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var dom = __webpack_require__(4);
var instances = __webpack_require__(0);
var updateGeometry = __webpack_require__(2);
var updateScroll = __webpack_require__(3);

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  dom.css(i.scrollbarXRail, 'display', 'none');
  dom.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  dom.css(i.scrollbarXRail, 'display', '');
  dom.css(i.scrollbarYRail, 'display', '');
};


/***/ }),
/* 59 */
/***/ (function(module, exports) {

/**
 * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 * 
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2015 David Stutz
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * 
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2015 David Stutz
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
!function ($) {
    "use strict";// jshint ;_;

    if (typeof ko !== 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
        ko.bindingHandlers.multiselect = {
            after: ['options', 'value', 'selectedOptions'],

            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect(config);

                if (allBindings.has('options')) {
                    var options = allBindings.get('options');
                    if (ko.isObservable(options)) {
                        ko.computed({
                            read: function() {
                                options();
                                setTimeout(function() {
                                    var ms = $element.data('multiselect');
                                    if (ms)
                                        ms.updateOriginalOptions();//Not sure how beneficial this is.
                                    $element.multiselect('rebuild');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        });
                    }
                }

                //value and selectedOptions are two-way, so these will be triggered even by our own actions.
                //It needs some way to tell if they are triggered because of us or because of outside change.
                //It doesn't loop but it's a waste of processing.
                if (allBindings.has('value')) {
                    var value = allBindings.get('value');
                    if (ko.isObservable(value)) {
                        ko.computed({
                            read: function() {
                                value();
                                setTimeout(function() {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                //Switched from arrayChange subscription to general subscription using 'refresh'.
                //Not sure performance is any better using 'select' and 'deselect'.
                if (allBindings.has('selectedOptions')) {
                    var selectedOptions = allBindings.get('selectedOptions');
                    if (ko.isObservable(selectedOptions)) {
                        ko.computed({
                            read: function() {
                                selectedOptions();
                                setTimeout(function() {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    $element.multiselect('destroy');
                });
            },

            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect('setOptions', config);
                $element.multiselect('rebuild');
            }
        };
    }

    function forEach(array, callback) {
        for (var index = 0; index < array.length; ++index) {
            callback(array[index], index);
        }
    }

    /**
     * Constructor to create a new multiselect using the given select.
     *
     * @param {jQuery} select
     * @param {Object} options
     * @returns {Multiselect}
     */
    function Multiselect(select, options) {

        this.$select = $(select);
        
        // Placeholder via data attributes
        if (this.$select.attr("data-placeholder")) {
            options.nonSelectedText = this.$select.data("placeholder");
        }
        
        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));

        // Initialization.
        // We have to clone to create a new reference.
        this.originalOptions = this.$select.clone()[0].options;
        this.query = '';
        this.searchTimeout = null;
        this.lastToggledInput = null

        this.options.multiple = this.$select.attr('multiple') === "multiple";
        this.options.onChange = $.proxy(this.options.onChange, this);
        this.options.onDropdownShow = $.proxy(this.options.onDropdownShow, this);
        this.options.onDropdownHide = $.proxy(this.options.onDropdownHide, this);
        this.options.onDropdownShown = $.proxy(this.options.onDropdownShown, this);
        this.options.onDropdownHidden = $.proxy(this.options.onDropdownHidden, this);
        
        // Build select all if enabled.
        this.buildContainer();
        this.buildButton();
        this.buildDropdown();
        this.buildSelectAll();
        this.buildDropdownOptions();
        this.buildFilter();

        this.updateButtonText();
        this.updateSelectAll();

        if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
            this.disable();
        }
        
        this.$select.hide().after(this.$container);
    };

    Multiselect.prototype = {

        defaults: {
            /**
             * Default text function will either print 'None selected' in case no
             * option is selected or a list of the selected options up to a length
             * of 3 selected options.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {String}
             */
            buttonText: function(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else if (this.allSelectedText 
                            && options.length === $('option', $(select)).length 
                            && $('option', $(select)).length !== 1 
                            && this.multiple) {

                    if (this.selectAllNumber) {
                        return this.allSelectedText + ' (' + options.length + ')';
                    }
                    else {
                        return this.allSelectedText;
                    }
                }
                else if (options.length > this.numberDisplayed) {
                    return options.length + ' ' + this.nSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;
                    
                    options.each(function() {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    
                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Updates the title of the button similar to the buttonText function.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {@exp;selected@call;substr}
             */
            buttonTitle: function(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;
                    
                    options.each(function () {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Create a label.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionLabel: function(element){
                return $(element).attr('label') || $(element).text();
            },
            /**
             * Triggered on change of the multiselect.
             * 
             * Not triggered when selecting/deselecting options manually.
             * 
             * @param {jQuery} option
             * @param {Boolean} checked
             */
            onChange : function(option, checked) {

            },
            /**
             * Triggered when the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShow: function(event) {

            },
            /**
             * Triggered when the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHide: function(event) {

            },
            /**
             * Triggered after the dropdown is shown.
             * 
             * @param {jQuery} event
             */
            onDropdownShown: function(event) {
                
            },
            /**
             * Triggered after the dropdown is hidden.
             * 
             * @param {jQuery} event
             */
            onDropdownHidden: function(event) {
                
            },
            /**
             * Triggered on select all.
             */
            onSelectAll: function() {
                
            },
            enableHTML: false,
            buttonClass: 'btn btn-default',
            inheritClass: false,
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            dropRight: false,
            selectedClass: 'active',
            // Maximum height of the dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: false,
            checkboxName: false,
            includeSelectAllOption: false,
            includeSelectAllIfMoreThan: 0,
            selectAllText: ' Select all',
            selectAllValue: 'multiselect-all',
            selectAllName: false,
            selectAllNumber: true,
            enableFiltering: false,
            enableCaseInsensitiveFiltering: false,
            enableClickableOptGroups: false,
            filterPlaceholder: 'Search',
            // possible options: 'text', 'value', 'both'
            filterBehavior: 'text',
            includeFilterClearBtn: true,
            preventInputChangeEvent: false,
            nonSelectedText: 'None selected',
            nSelectedText: 'selected',
            allSelectedText: 'All selected',
            numberDisplayed: 3,
            disableIfEmpty: false,
            delimiterText: ', ',
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                li: '<li><a tabindex="0"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
            }
        },

        constructor: Multiselect,

        /**
         * Builds the container of the multiselect.
         */
        buildContainer: function() {
            this.$container = $(this.options.buttonContainer);
            this.$container.on('show.bs.dropdown', this.options.onDropdownShow);
            this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);
            this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);
            this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);
        },

        /**
         * Builds the button of the multiselect.
         */
        buildButton: function() {
            this.$button = $(this.options.templates.button).addClass(this.options.buttonClass);
            if (this.$select.attr('class') && this.options.inheritClass) {
                this.$button.addClass(this.$select.attr('class'));
            }
            // Adopt active state.
            if (this.$select.prop('disabled')) {
                this.disable();
            }
            else {
                this.enable();
            }

            // Manually add button width if set.
            if (this.options.buttonWidth && this.options.buttonWidth !== 'auto') {
                this.$button.css({
                    'width' : this.options.buttonWidth,
                    'overflow' : 'hidden',
                    'text-overflow' : 'ellipsis'
                });
                this.$container.css({
                    'width': this.options.buttonWidth
                });
            }

            // Keep the tab index from the select.
            var tabindex = this.$select.attr('tabindex');
            if (tabindex) {
                this.$button.attr('tabindex', tabindex);
            }

            this.$container.prepend(this.$button);
        },

        /**
         * Builds the ul representing the dropdown menu.
         */
        buildDropdown: function() {

            // Build ul.
            this.$ul = $(this.options.templates.ul);

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }

            // Set max height of dropdown menu to activate auto scrollbar.
            if (this.options.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.$ul.css({
                    'max-height': this.options.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }

            this.$container.append(this.$ul);
        },

        /**
         * Build the dropdown options and binds all nessecary events.
         * 
         * Uses createDivider and createOptionValue to create the necessary options.
         */
        buildDropdownOptions: function() {

            this.$select.children().each($.proxy(function(index, element) {

                var $element = $(element);
                // Support optgroups and options without a group simultaneously.
                var tag = $element.prop('tagName')
                    .toLowerCase();
            
                if ($element.prop('value') === this.options.selectAllValue) {
                    return;
                }

                if (tag === 'optgroup') {
                    this.createOptgroup(element);
                }
                else if (tag === 'option') {

                    if ($element.data('role') === 'divider') {
                        this.createDivider();
                    }
                    else {
                        this.createOptionValue(element);
                    }

                }

                // Other illegal tags will be ignored.
            }, this));

            // Bind the change event on the dropdown elements.
            $('li input', this.$ul).on('change', $.proxy(function(event) {
                var $target = $(event.target);

                var checked = $target.prop('checked') || false;
                var isSelectAllOption = $target.val() === this.options.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.options.selectedClass) {
                    if (checked) {
                        $target.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                    else {
                        $target.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                // Get the corresponding option.
                var value = $target.val();
                var $option = this.getOptionByValue(value);

                var $optionsNotThis = $('option', this.$select).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($target);

                if (isSelectAllOption) {
                    if (checked) {
                        this.selectAll();
                    }
                    else {
                        this.deselectAll();
                    }
                }

                if(!isSelectAllOption){
                    if (checked) {
                        $option.prop('selected', true);

                        if (this.options.multiple) {
                            // Simply select additional option.
                            $option.prop('selected', true);
                        }
                        else {
                            // Unselect all other options and corresponding checkboxes.
                            if (this.options.selectedClass) {
                                $($checkboxesNotThis).closest('li').removeClass(this.options.selectedClass);
                            }

                            $($checkboxesNotThis).prop('checked', false);
                            $optionsNotThis.prop('selected', false);

                            // It's a single selection, so close.
                            this.$button.click();
                        }

                        if (this.options.selectedClass === "active") {
                            $optionsNotThis.closest("a").css("outline", "");
                        }
                    }
                    else {
                        // Unselect option.
                        $option.prop('selected', false);
                    }
                }

                this.$select.change();

                this.updateButtonText();
                this.updateSelectAll();

                this.options.onChange($option, checked);

                if(this.options.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('li a', this.$ul).on('mousedown', function(e) {
                if (e.shiftKey) {
                    // Prevent selecting text by Shift+click
                    return false;
                }
            });
        
            $('li a', this.$ul).on('touchstart click', $.proxy(function(event) {
                event.stopPropagation();

                var $target = $(event.target);
                
                if (event.shiftKey && this.options.multiple) {
                    if($target.is("label")){ // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)
                        event.preventDefault();
                        $target = $target.find("input");
                        $target.prop("checked", !$target.prop("checked"));
                    }
                    var checked = $target.prop('checked') || false;

                    if (this.lastToggledInput !== null && this.lastToggledInput !== $target) { // Make sure we actually have a range
                        var from = $target.closest("li").index();
                        var to = this.lastToggledInput.closest("li").index();
                        
                        if (from > to) { // Swap the indices
                            var tmp = to;
                            to = from;
                            from = tmp;
                        }
                        
                        // Make sure we grab all elements since slice excludes the last index
                        ++to;
                        
                        // Change the checkboxes and underlying options
                        var range = this.$ul.find("li").slice(from, to).find("input");
                        
                        range.prop('checked', checked);
                        
                        if (this.options.selectedClass) {
                            range.closest('li')
                                .toggleClass(this.options.selectedClass, checked);
                        }
                        
                        for (var i = 0, j = range.length; i < j; i++) {
                            var $checkbox = $(range[i]);

                            var $option = this.getOptionByValue($checkbox.val());

                            $option.prop('selected', checked);
                        }                   
                    }
                    
                    // Trigger the select "change" event
                    $target.trigger("change");
                }
                
                // Remembers last clicked option
                if($target.is("input") && !$target.closest("li").is(".multiselect-item")){
                    this.lastToggledInput = $target;
                }

                $target.blur();
            }, this));

            // Keyboard support.
            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function(event) {
                if ($('input[type="text"]', this.$container).is(':focus')) {
                    return;
                }

                if (event.keyCode === 9 && this.$container.hasClass('open')) {
                    this.$button.click();
                }
                else {
                    var $items = $(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                    if (!$items.length) {
                        return;
                    }

                    var index = $items.index($items.filter(':focus'));

                    // Navigation up.
                    if (event.keyCode === 38 && index > 0) {
                        index--;
                    }
                    // Navigate down.
                    else if (event.keyCode === 40 && index < $items.length - 1) {
                        index++;
                    }
                    else if (!~index) {
                        index = 0;
                    }

                    var $current = $items.eq(index);
                    $current.focus();

                    if (event.keyCode === 32 || event.keyCode === 13) {
                        var $checkbox = $current.find('input');

                        $checkbox.prop("checked", !$checkbox.prop("checked"));
                        $checkbox.change();
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            }, this));

            if(this.options.enableClickableOptGroups && this.options.multiple) {
                $('li.multiselect-group', this.$ul).on('click', $.proxy(function(event) {
                    event.stopPropagation();

                    var group = $(event.target).parent();

                    // Search all option in optgroup
                    var $options = group.nextUntil('li.multiselect-group');
                    var $visibleOptions = $options.filter(":visible:not(.disabled)");

                    // check or uncheck items
                    var allChecked = true;
                    var optionInputs = $visibleOptions.find('input');
                    optionInputs.each(function() {
                        allChecked = allChecked && $(this).prop('checked');
                    });

                    optionInputs.prop('checked', !allChecked).trigger('change');
               }, this));
            }
        },

        /**
         * Create an option using the given select option.
         *
         * @param {jQuery} element
         */
        createOptionValue: function(element) {
            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            var label = this.options.optionLabel(element);
            var value = $element.val();
            var inputType = this.options.multiple ? "checkbox" : "radio";

            var $li = $(this.options.templates.li);
            var $label = $('label', $li);
            $label.addClass(inputType);

            if (this.options.enableHTML) {
                $label.html(" " + label);
            }
            else {
                $label.text(" " + label);
            }
        
            var $checkbox = $('<input/>').attr('type', inputType);

            if (this.options.checkboxName) {
                $checkbox.attr('name', this.options.checkboxName);
            }
            $label.prepend($checkbox);

            var selected = $element.prop('selected') || false;
            $checkbox.val(value);

            if (value === this.options.selectAllValue) {
                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');
            }

            $label.attr('title', $element.attr('title'));

            this.$ul.append($li);

            if ($element.is(':disabled')) {
                $checkbox.attr('disabled', 'disabled')
                    .prop('disabled', true)
                    .closest('a')
                    .attr("tabindex", "-1")
                    .closest('li')
                    .addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            if (selected && this.options.selectedClass) {
                $checkbox.closest('li')
                    .addClass(this.options.selectedClass);
            }
        },

        /**
         * Creates a divider using the given select option.
         *
         * @param {jQuery} element
         */
        createDivider: function(element) {
            var $divider = $(this.options.templates.divider);
            this.$ul.append($divider);
        },

        /**
         * Creates an optgroup.
         *
         * @param {jQuery} group
         */
        createOptgroup: function(group) {
            var groupName = $(group).prop('label');

            // Add a header for the group.
            var $li = $(this.options.templates.liGroup);
            
            if (this.options.enableHTML) {
                $('label', $li).html(groupName);
            }
            else {
                $('label', $li).text(groupName);
            }
            
            if (this.options.enableClickableOptGroups) {
                $li.addClass('multiselect-group-clickable');
            }

            this.$ul.append($li);

            if ($(group).is(':disabled')) {
                $li.addClass('disabled');
            }

            // Add the options of the group.
            $('option', group).each($.proxy(function(index, element) {
                this.createOptionValue(element);
            }, this));
        },

        /**
         * Build the selct all.
         * 
         * Checks if a select all has already been created.
         */
        buildSelectAll: function() {
            if (typeof this.options.selectAllValue === 'number') {
                this.options.selectAllValue = this.options.selectAllValue.toString();
            }
            
            var alreadyHasSelectAll = this.hasSelectAll();

            if (!alreadyHasSelectAll && this.options.includeSelectAllOption && this.options.multiple
                    && $('option', this.$select).length > this.options.includeSelectAllIfMoreThan) {

                // Check whether to add a divider after the select all.
                if (this.options.includeSelectAllDivider) {
                    this.$ul.prepend($(this.options.templates.divider));
                }

                var $li = $(this.options.templates.li);
                $('label', $li).addClass("checkbox");
                
                if (this.options.enableHTML) {
                    $('label', $li).html(" " + this.options.selectAllText);
                }
                else {
                    $('label', $li).text(" " + this.options.selectAllText);
                }
                
                if (this.options.selectAllName) {
                    $('label', $li).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" />');
                }
                else {
                    $('label', $li).prepend('<input type="checkbox" />');
                }
                
                var $checkbox = $('input', $li);
                $checkbox.val(this.options.selectAllValue);

                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');

                this.$ul.prepend($li);

                $checkbox.prop('checked', false);
            }
        },

        /**
         * Builds the filter.
         */
        buildFilter: function() {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.
            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);

                if (this.$select.find('option').length >= enableFilterLength) {

                    this.$filter = $(this.options.templates.filter);
                    $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);
                    
                    // Adds optional filter clear button
                    if(this.options.includeFilterClearBtn){
                        var clearBtn = $(this.options.templates.filterClearBtn);
                        clearBtn.on('click', $.proxy(function(event){
                            clearTimeout(this.searchTimeout);
                            this.$filter.find('.multiselect-search').val('');
                            $('li', this.$ul).show().removeClass("filter-hidden");
                            this.updateSelectAll();
                        }, this));
                        this.$filter.find('.input-group').append(clearBtn);
                    }
                    
                    this.$ul.prepend(this.$filter);

                    this.$filter.val(this.query).on('click', function(event) {
                        event.stopPropagation();
                    }).on('input keydown', $.proxy(function(event) {
                        // Cancel enter key default behaviour
                        if (event.which === 13) {
                          event.preventDefault();
                        }
                        
                        // This is useful to catch "keydown" events after the browser has updated the control.
                        clearTimeout(this.searchTimeout);

                        this.searchTimeout = this.asyncFunction($.proxy(function() {

                            if (this.query !== event.target.value) {
                                this.query = event.target.value;

                                var currentGroup, currentGroupVisible;
                                $.each($('li', this.$ul), $.proxy(function(index, element) {
                                    var value = $('input', element).length > 0 ? $('input', element).val() : "";
                                    var text = $('label', element).text();

                                    var filterCandidate = '';
                                    if ((this.options.filterBehavior === 'text')) {
                                        filterCandidate = text;
                                    }
                                    else if ((this.options.filterBehavior === 'value')) {
                                        filterCandidate = value;
                                    }
                                    else if (this.options.filterBehavior === 'both') {
                                        filterCandidate = text + '\n' + value;
                                    }

                                    if (value !== this.options.selectAllValue && text) {
                                        // By default lets assume that element is not
                                        // interesting for this search.
                                        var showElement = false;

                                        if (this.options.enableCaseInsensitiveFiltering && filterCandidate.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
                                            showElement = true;
                                        }
                                        else if (filterCandidate.indexOf(this.query) > -1) {
                                            showElement = true;
                                        }

                                        // Toggle current element (group or group item) according to showElement boolean.
                                        $(element).toggle(showElement).toggleClass('filter-hidden', !showElement);
                                        
                                        // Differentiate groups and group items.
                                        if ($(element).hasClass('multiselect-group')) {
                                            // Remember group status.
                                            currentGroup = element;
                                            currentGroupVisible = showElement;
                                        }
                                        else {
                                            // Show group name when at least one of its items is visible.
                                            if (showElement) {
                                                $(currentGroup).show().removeClass('filter-hidden');
                                            }
                                            
                                            // Show all group items when group name satisfies filter.
                                            if (!showElement && currentGroupVisible) {
                                                $(element).show().removeClass('filter-hidden');
                                            }
                                        }
                                    }
                                }, this));
                            }

                            this.updateSelectAll();
                        }, this), 300, this);
                    }, this));
                }
            }
        },

        /**
         * Unbinds the whole plugin.
         */
        destroy: function() {
            this.$container.remove();
            this.$select.show();
            this.$select.data('multiselect', null);
        },

        /**
         * Refreshs the multiselect based on the selected options of the select.
         */
        refresh: function() {
            $('option', this.$select).each($.proxy(function(index, element) {
                var $input = $('li input', this.$ul).filter(function() {
                    return $(this).val() === $(element).val();
                });

                if ($(element).is(':selected')) {
                    $input.prop('checked', true);

                    if (this.options.selectedClass) {
                        $input.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                }
                else {
                    $input.prop('checked', false);

                    if (this.options.selectedClass) {
                        $input.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                if ($(element).is(":disabled")) {
                    $input.attr('disabled', 'disabled')
                        .prop('disabled', true)
                        .closest('li')
                        .addClass('disabled');
                }
                else {
                    $input.prop('disabled', false)
                        .closest('li')
                        .removeClass('disabled');
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Select all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered if
         * and only if one value is passed.
         * 
         * @param {Array} selectValues
         * @param {Boolean} triggerOnChange
         */
        select: function(selectValues, triggerOnChange) {
            if(!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }
                
                if (!this.options.multiple) {
                    this.deselectAll(false);
                }
                
                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .addClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);
                
                if (triggerOnChange) {
                    this.options.onChange($option, true);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Clears all selected items.
         */
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Deselects all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered, if
         * and only if one value is passed.
         * 
         * @param {Array} deselectValues
         * @param {Boolean} triggerOnChange
         */
        deselect: function(deselectValues, triggerOnChange) {
            if(!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .removeClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);
                
                if (triggerOnChange) {
                    this.options.onChange($option, false);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },
        
        /**
         * Selects all enabled & visible options.
         *
         * If justVisible is true or not specified, only visible options are selected.
         *
         * @param {Boolean} justVisible
         * @param {Boolean} triggerOnSelectAll
         */
        selectAll: function (justVisible, triggerOnSelectAll) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allCheckboxes = $("li input[type='checkbox']:enabled", this.$ul);
            var visibleCheckboxes = allCheckboxes.filter(":visible");
            var allCheckboxesCount = allCheckboxes.length;
            var visibleCheckboxesCount = visibleCheckboxes.length;
            
            if(justVisible) {
                visibleCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").addClass(this.options.selectedClass);
            }
            else {
                allCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).addClass(this.options.selectedClass);
            }
                
            if (allCheckboxesCount === visibleCheckboxesCount || justVisible === false) {
                $("option:enabled", this.$select).prop('selected', true);
            }
            else {
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.$select).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', true);
            }
            
            if (triggerOnSelectAll) {
                this.options.onSelectAll();
            }
        },

        /**
         * Deselects all options.
         * 
         * If justVisible is true or not specified, only visible options are deselected.
         * 
         * @param {Boolean} justVisible
         */
        deselectAll: function (justVisible) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            
            if(justVisible) {              
                var visibleCheckboxes = $("li input[type='checkbox']:not(:disabled)", this.$ul).filter(":visible");
                visibleCheckboxes.prop('checked', false);
                
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.$select).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', false);
                
                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").removeClass(this.options.selectedClass);
                }
            }
            else {
                $("li input[type='checkbox']:enabled", this.$ul).prop('checked', false);
                $("option:enabled", this.$select).prop('selected', false);
                
                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Rebuild the plugin.
         * 
         * Rebuilds the dropdown, the filter and the select all option.
         */
        rebuild: function() {
            this.$ul.html('');

            // Important to distinguish between radios and checkboxes.
            this.options.multiple = this.$select.attr('multiple') === "multiple";

            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll();
            
            if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
                this.disable();
            }
            else {
                this.enable();
            }
            
            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function(dataprovider) {
            
            var groupCounter = 0;
            var $select = this.$select.empty();
            
            $.each(dataprovider, function (index, option) {
                var $tag;
                
                if ($.isArray(option.children)) { // create optiongroup tag
                    groupCounter++;
                    
                    $tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter,
                        disabled: !!option.disabled
                    });
                    
                    forEach(option.children, function(subOption) { // add children option tags
                        $tag.append($('<option/>').attr({
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        }));
                    });
                }
                else {
                    $tag = $('<option/>').attr({
                        value: option.value,
                        label: option.label || option.value,
                        title: option.title,
                        selected: !!option.selected,
                        disabled: !!option.disabled
                    });
                }
                
                $select.append($tag);
            });
            
            this.rebuild();
        },

        /**
         * Enable the multiselect.
         */
        enable: function() {
            this.$select.prop('disabled', false);
            this.$button.prop('disabled', false)
                .removeClass('disabled');
        },

        /**
         * Disable the multiselect.
         */
        disable: function() {
            this.$select.prop('disabled', true);
            this.$button.prop('disabled', true)
                .addClass('disabled');
        },

        /**
         * Set the options.
         *
         * @param {Array} options
         */
        setOptions: function(options) {
            this.options = this.mergeOptions(options);
        },

        /**
         * Merges the given options with the default options.
         *
         * @param {Array} options
         * @returns {Array}
         */
        mergeOptions: function(options) {
            return $.extend(true, {}, this.defaults, this.options, options);
        },

        /**
         * Checks whether a select all checkbox is present.
         *
         * @returns {Boolean}
         */
        hasSelectAll: function() {
            return $('li.multiselect-all', this.$ul).length > 0;
        },

        /**
         * Updates the select all checkbox based on the currently displayed and selected checkboxes.
         */
        updateSelectAll: function() {
            if (this.hasSelectAll()) {
                var allBoxes = $("li:not(.multiselect-item):not(.filter-hidden) input:enabled", this.$ul);
                var allBoxesLength = allBoxes.length;
                var checkedBoxesLength = allBoxes.filter(":checked").length;
                var selectAllLi  = $("li.multiselect-all", this.$ul);
                var selectAllInput = selectAllLi.find("input");
                
                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                    selectAllInput.prop("checked", true);
                    selectAllLi.addClass(this.options.selectedClass);
                    this.options.onSelectAll();
                }
                else {
                    selectAllInput.prop("checked", false);
                    selectAllLi.removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Update the button text and its title based on the currently selected options.
         */
        updateButtonText: function() {
            var options = this.getSelected();
            
            // First update the displayed button text.
            if (this.options.enableHTML) {
                $('.multiselect .multiselect-selected-text', this.$container).html(this.options.buttonText(options, this.$select));
            }
            else {
                $('.multiselect .multiselect-selected-text', this.$container).text(this.options.buttonText(options, this.$select));
            }
            
            // Now update the title attribute of the button.
            $('.multiselect', this.$container).attr('title', this.options.buttonTitle(options, this.$select));
        },

        /**
         * Get all selected options.
         *
         * @returns {jQUery}
         */
        getSelected: function() {
            return $('option', this.$select).filter(":selected");
        },

        /**
         * Gets a select option by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getOptionByValue: function (value) {

            var options = $('option', this.$select);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },

        /**
         * Get the input (radio/checkbox) by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getInputByValue: function (value) {

            var checkboxes = $('li input', this.$ul);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        /**
         * Used for knockout integration.
         */
        updateOriginalOptions: function() {
            this.originalOptions = this.$select.clone()[0].options;
        },

        asyncFunction: function(callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function() {
                callback.apply(self || window, args);
            }, timeout);
        },

        setAllSelectedText: function(allSelectedText) {
            this.options.allSelectedText = allSelectedText;
            this.updateButtonText();
        }
    };

    $.fn.multiselect = function(option, parameter, extraOptions) {
        return this.each(function() {
            var data = $(this).data('multiselect');
            var options = typeof option === 'object' && option;

            // Initialize the multiselect.
            if (!data) {
                data = new Multiselect(this, options);
                $(this).data('multiselect', data);
            }

            // Call multiselect method.
            if (typeof option === 'string') {
                data[option](parameter, extraOptions);
                
                if (option === 'destroy') {
                    $(this).data('multiselect', false);
                }
            }
        });
    };

    $.fn.multiselect.Constructor = Multiselect;

    $(function() {
        $("select[data-role=multiselect]").multiselect();
    });

}(window.jQuery);


/***/ }),
/* 60 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * options.js
 *
 * Options methods
 */
;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  };

  return {

    /**
     * Build the options
     * @method function
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    buildOptions: function buildOptions(data) {
      // load JSON data if applicable
      if (!!data) {
        self.JSON = data;
      }

      if (oAtts().type === 'select') {
        self.fn.populateSelectOptions();
      } else {
        self.fn.populateTokensOptions();
      }
    }, // end fn

    /**
     * Retrieve external options
     * @param  {[type]}   force    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getExtOptions: function getExtOptions(force, callback) {
      jApp.log('getting external options');
      self.options.extData = true;

      force = typeof force !== 'undefined' ? force : false;

      // use the copy in storage if available;
      if (!force && self.options.cache && !!self.store.get('selectOptions_' + oAtts().name, false)) {
        //jApp.log('using local copy of options');
        return self.fn.buildOptions(JSON.parse(self.store.get('selectOptions_' + oAtts().name)));
      }

      var url, data;

      url = self.fn.getExtUrl();
      data = {};

      self.buildOptionsCallback = callback;

      //jApp.log('executing request for external options');
      $.getJSON(url, data, self.fn.buildOptions).always(function () {
        if (self.options.cache) {
          self.store.setTTL('selectOptions_' + oAtts().name, 1000 * 60 * self.options.ttl); // expire in 10 mins.
        }
      });
    }, // end fn

    /**
     * Populate Tokens Options
     * @method function
     * @return {[type]} [description]
     */
    populateTokensOptions: function populateTokensOptions() {
      jApp.log('--- Building TokenField Input ---');
      jApp.log(self.JSON);

      self.DOM.$inpt.data('tokenFieldSource', _.pluck(self.JSON, 'name'));
    }, //end fn

    /**
     * Populate Select Options
     * @method function
     * @return {[type]} [description]
     */
    populateSelectOptions: function populateSelectOptions() {

      // grab the external data if applicable
      if (self.options.extData) {
        oAtts()._labels = _.pluck(self.JSON, 'label');
        oAtts()._options = _.pluck(self.JSON, 'option');

        if (self.options.cache) {
          self.store.set('selectOptions_' + oAtts().name, JSON.stringify(self.JSON));
        }
      }

      // hide if empty options
      if ((!oAtts()._options || !oAtts()._options.length) && !!self.options.hideIfNoOptions) {
        //jApp.log('Hiding the element because there are no options ' + oAtts().name)
        return self.fn.disable().hide();
      }
      // else {
      // 	self.fn.enable().show();
      // }

      // remove all options
      jApp.log(self.DOM);
      self.DOM.$inpt.find('option').remove();

      // append first option if applicable
      if (!!oAtts()._firstlabel) {
        var firstOption = !!oAtts()._firstoption ? oAtts()._firstoption : '';
        self.DOM.$inpt.append($('<option/>', { value: firstOption }).html(oAtts()._firstlabel));
      }

      // iterate over the label/value pairs and build the options
      _.each(oAtts()._options, function (v, k) {
        self.DOM.$inpt.append(
        // determine if the current value is currently selected
        _.indexOf(oAtts().value, v) !== -1 || !!self.$().attr('data-value') && _.indexOf(self.$().attr('data-value').split('|'), v) !== -1 ? $('<option/>', { value: v, 'selected': 'selected' }).html(oAtts()._labels[k]) : $('<option/>', { value: !!v ? v : '' }).html(oAtts()._labels[k]));
      });

      // remove the unneeded data-value attribute
      self.$().removeAttr('data-value');

      // call the callback if applicable
      if (typeof self.buildOptionsCallback === 'function') {
        self.buildOptionsCallback();
        delete self.buildOptionsCallback;
      }
    }, // end fn

    /**
     * Get the model of the options source
     * @method function
     * @return {[type]} [description]
     */
    getModel: function getModel() {
      var tmp = oAtts()._optionssource.split('.');
      return tmp[0];
    }, // end fn

    /**
     * Initialize the select options
     * @param  {[type]} refresh [description]
     * @return {[type]}         [description]
     */
    initSelectOptions: function initSelectOptions(refresh) {
      jApp.log('Initializing Select Options');

      self.refreshAfterLoadingOptions = !!refresh ? true : false;

      // local data
      if (!!oAtts()._optionssource && _typeof(oAtts()._optionssource) === 'object') {
        self.options.extData = false;
        oAtts()._options = oAtts()._optionssource;
        oAtts()._labels = !!oAtts()._labelssource ? oAtts()._labelssource : oAtts()._optionssource;
        self.fn.buildOptions();
      } else if (!!oAtts()._optionssource && oAtts()._optionssource.indexOf('|') !== -1) {
        jApp.log(' - local options data - ');
        self.options.extData = false;
        oAtts()._options = oAtts()._optionssource.split('|');
        oAtts()._labels = !!oAtts()._labelssource ? oAtts()._labelssource.split('|') : oAtts()._optionssource.split('|');
        self.fn.buildOptions();
      }
      // external data
      else if (!!oAtts()._optionssource && oAtts()._optionssource.indexOf('.') !== -1) {
          jApp.log(' - external options data -');
          self.options.extData = true;
          //jApp.log('Getting External Options');
          self.fn.getExtOptions();
        }
    }, // end fn

    /**
     * Get the external url of the options
     * @return {[type]} [description]
     */
    getExtUrl: function getExtUrl(type) {
      var model, lbl, opt, tmp;

      type = type || oAtts().type;

      tmp = oAtts()._labelssource.split('.');
      self.model = model = tmp[0]; // db table that contains option/label pairs
      lbl = tmp[1]; // db column that contains labels
      opt = oAtts()._optionssource.split('.')[1];
      //where = ( !!oAtts()._optionsFilter && !!oAtts()._optionsFilter.length ) ? oAtts()._optionsFilter : '1=1';

      switch (type) {
        case 'select':
          return jApp.routing.get('selectOptions', model, opt, lbl);

        default:
          return jApp.routing.get('tokenOptions', model, opt, lbl);
      }
    } // end fn

  };
};

/***/ }),
/* 61 */
/***/ (function(module, exports) {

/**
 * arrayInputs.js
 *
 * Array Input Methods
 */
;module.exports = function (self) {

      /**
       * Set up some convenience variables
       */
      var oAtts = function oAtts() {
            return self.options.atts;
      };

      return {

            /**
             * Is the form field an array input
             * @param  {[type]} oInpt [description]
             * @return {[type]}       [description]
             */
            isArrayFormField: function isArrayFormField() {
                  return !!self.arrayField;
            }, //end fn


            /**
             * Process array field from parameters
             * @method function
             * @param  {[type]} params [description]
             * @param  {[type]} target [description]
             * @return {[type]}        [description]
             */
            processArrayField: function processArrayField(params) {
                  var $container = $('<div/>', { class: 'array-field-container alert alert-info' }).data('colparams', params),
                      $table = $('<table/>', { class: '' }),
                      masterSelect = self.fn.getArrayMasterSelectParams(params.fields[0]),
                      $btn_add = $('<button/>', { type: 'button', class: 'btn btn-link btn-array-add' }).html('<i class="fa fa-fw fa-plus"></i>'),
                      inpt;

                  self.arrayField = true;

                  self.DOM.$container = $container;
                  self.DOM.$table = $table;

                  // add a row with the master select
                  inpt = new jInput({ atts: masterSelect, form: self.form });
                  inpt.DOM.$container = $container;
                  self.oInpts[masterSelect.name] = inpt;
                  $container.append(inpt.fn.handle());

                  // set up the custom multiselect object
                  inpt.fn.multiselect(self.fn.getArrayMasterSelectMultiSelectOptions());

                  // add button
                  $table.append($btn_add.wrap('<tr class="no-row-filler"><td></td></tr>'));

                  // add the table to the container
                  $container.append($table);

                  // setup the singleSelect parameters
                  params.fields[0] = self.fn.getArraySingleSelectParams(params.fields[0]);

                  // setup the names of the additional parameters
                  _.each(params.fields, function (o, i) {
                        if (i === 0) return false;

                        var baseName = params.fields[0].name.replace('[]', '');
                        o['data-pivotName'] = o.name;
                        o.name = baseName + '[][' + o.name + ']';
                  });

                  return $container;
            }, // end fn

            /**
             * Add rows corresponding to the selected array values
             * @method function
             * @return {[type]} [description]
             */
            arrayAddValues: function arrayAddValues() {
                  var multiSelect = this,
                      selectedRaw = multiSelect.getSelected(),
                      selectedOptions = selectedRaw.map(function (i, elm) {
                        return +$(elm).attr('value');
                  }),
                      selectedLabels = selectedRaw.map(function (i, elm) {
                        return $(elm).html();
                  });

                  jApp.log(selectedOptions);

                  _.each(selectedOptions, function (val, i) {
                        self.fn.arrayAddRow(val);
                  });

                  this.clearSelection();
            }, // end fn

            /**
             * Get Array MasterSelect Parameters
             * @method function
             * @param  {[type]} params [description]
             * @return {[type]}        [description]
             */
            getArrayMasterSelectParams: function getArrayMasterSelectParams(params) {
                  return $.extend({}, params, {
                        class: 'no-bsms',
                        multiple: true,
                        name: params.name + '-masterSelect'
                  });
            }, // end fn

            /**
             * Get Array SingleSelect Parameters
             * @method function
             * @param  {[type]} params [description]
             * @return {[type]}        [description]
             */
            getArraySingleSelectParams: function getArraySingleSelectParams(params) {
                  delete params._label;
                  delete params.multiple;

                  return $.extend({}, params, {
                        class: 'no-bsms form-control',
                        name: params.name.replace('[]', '') + '[]'
                  });
            }, // end fn

            /**
             * Get array MasterSelect Multiselect options
             * @method function
             * @return {[type]} [description]
             */
            getArrayMasterSelectMultiSelectOptions: function getArrayMasterSelectMultiSelectOptions() {
                  return $.extend(true, {}, self.options.bsmsDefaults, {
                        buttonClass: 'btn btn-primary',
                        onDropdownHidden: self.fn.arrayAddValues,
                        nonSelectedText: 'Quick picker'
                  });
            }, // end fn

            /**
             * Populate and array field with the form data
             * @return {[type]} [description]
             */
            populateArrayFormData: function populateArrayFormData(oInpt, data) {
                  self.fn.arrayRemoveAllRows(oInpt.$());
                  jApp.log('------Array Data------');
                  jApp.log(data);

                  // iterate through the data rows and populate the form
                  _.each(data, function (obj) {

                        // create a row in the array field table
                        jApp.log('--------Adding Row To The Array ---------');
                        jApp.log(oInpt.$());
                        self.fn.arrayAddRowFromContainer(oInpt.$(), obj);
                  });
            }, // end fn

            /**
             * Add row to array field from container
             * @param  {[type]} $container [description]
             * @return {[type]}            [description]
             */
            arrayAddRowFromContainer: function arrayAddRowFromContainer($container, data) {
                  var $table = $container.find('table'),
                      params = $container.data('colparams'),
                      $tr_new = jUtility.oCurrentForm().fn.populateFieldRow(params, 1, data || {});

                  $table.find('.btn-array-add,.no-row-filler').remove();

                  $table.append($tr_new);
            }, // end fn

            /**
             * Add row to an array input
             * @method function
             * @return {[type]} [description]
             */
            arrayAddRow: function arrayAddRow(value) {
                  var $container = self.DOM.$container || $(this).closest('.array-field-container'),
                      $table = $container.find('table'),
                      params = $container.data('colparams'),
                      $tr_new = jUtility.oCurrentForm().fn.populateFieldRow(params, 1, { id: value || null, pivot: null });

                  if (!!params.max && +$table.find('tr').length - 1 === params.max) {
                        return jUtility.msg.warning('This field requires at most ' + params.max + ' selections.');
                  }

                  $table.find('.btn-array-add,.no-row-filler').remove();

                  $table.append($tr_new);
            }, // end fn

            /**
             * Remove a row from an array input table
             * @return {[type]} [description]
             */
            arrayRemoveRow: function arrayRemoveRow() {
                  var $container = $(this).closest('.array-field-container'),
                      $table = $(this).closest('table'),
                      $tr = $(this).closest('tr'),
                      params = $container.data('colparams'),
                      $btn_add = $table.find('.btn-array-add').eq(0).detach();

                  if (!!params.min && +$table.find('tr').length - 1 === params.min) {
                        $table.find('tr:last-child').find('td:last-child').append($btn_add);
                        return jUtility.msg.warning('This field requires at least ' + params.min + ' selections.');
                  }

                  $tr.remove();

                  // rename inputs so they all have unique names
                  // $table.find('tr').each( function( i, elm ) {
                  //   $(elm).find(':input').each( function(ii, ee) {
                  //     $(ee).attr('name', $(ee).attr('data-name') + '_' + i)
                  //   });
                  // });
                  if (!$table.find('tr').length) {
                        $table.append('<tr class="no-row-filler"><td></td></tr>');
                  }

                  $table.find('tr:last-child').find('td:last-child').append($btn_add);
            }, // end fn

            /**
             * [function description]
             * @param  {[type]} $inpt [description]
             * @return {[type]}       [description]
             */
            arrayRemoveAllRows: function arrayRemoveAllRows($container) {
                  var $table = $container.find('table');

                  $table.empty();
                  $table.append('<tr class="no-row-filler"><td></td></tr>');
            } // end fn
      };
};

/***/ }),
/* 62 */
/***/ (function(module, exports) {

/**
 * multiselect.js
 *
 * Multiselect Methods
 */

;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  };

  return {

    /**
     * Multiselect handler
     * @return {[type]} [description]
     */
    multiselect: function multiselect(options) {
      if (!!self.$().data('no-bsms')) return false;

      self.$().multiselect(options || self.options.bsmsDefaults).multiselect('refresh');
      self.fn.multiselectExtraButtons();
      return self;
    }, // end fn

    /**
     * Destroy the multiselect
     * @method function
     * @return {[type]} [description]
     */
    multiselectDestroy: function multiselectDestroy() {
      self.$().multiselect('destroy');
    }, // end fn

    /**
     * Refresh the multiselect
     * @method function
     * @return {[type]} [description]
     */
    multiselectRefresh: function multiselectRefresh() {
      var inpt_name = self.options.atts.name.replace('[]', ''),
          oInpts,
          data;

      if (!self.options.extData) {
        return false;
      }

      $(this).prop('disabled', true).find('i').addClass('fa-spin');

      self.$().attr('data-tmpVal', self.$().val() || '').val('').multiselect('refresh');

      if (!!self.$().closest('.array-field-container').length) {
        data = self.$().closest('.array-field-container').data() || {};

        if (data['jInput']['oInpts'] !== 'undefined') {
          _.each(data.jInput.oInpts, function (o) {
            o.fn.getExtOptions(true);
          });
        }
      }

      self.fn.getExtOptions(true, function (newOptions) {
        jUtility.$currentForm().find('.btn.btn-refresh').prop('disabled', false).find('i').removeClass('fa-spin').end().end().find('[data-tmpVal]').each(self.fn.multiselectRefreshCallback);
      });
    }, // end fn

    /**
     * Refresh the multiselect callback
     * @method function
     * @param  {[type]} i   [description]
     * @param  {[type]} elm [description]
     * @return {[type]}     [description]
     */
    multiselectRefreshCallback: function multiselectRefreshCallback(i, elm) {
      $(elm).val($(elm).attr('data-tmpVal')).multiselect('enable').multiselect('refresh').multiselect('rebuild').removeAttr('data-tmpVal');
    }, // end fn

    /**
     * Add button and refresh button for multiselect elements
     * @return {[type]} [description]
     */
    multiselectExtraButtons: function multiselectExtraButtons() {
      if (!self.options.extData) return self;

      // make an add button, if the model is not the same as the current form
      if (self.fn.getModel() !== jApp.opts().model) {

        jApp.log('----------------------INPUT-------------------');
        jApp.log(self);

        var model = self.fn.getModel(),
            frmDef = {
          table: jApp.model2table(model),
          model: model,
          pkey: 'id',
          tableFriendly: model,
          atts: { method: 'POST' }
        },
            key = 'new' + model + 'Frm';

        if (!jUtility.isFormExists(key)) {
          jApp.log('building the form: ' + key);
          jUtility.DOM.buildForm(frmDef, key, 'newOtherFrm', model);
          jUtility.processFormBindings();
        }

        var $btnAdd = $('<button/>', {
          type: 'button',
          class: 'btn btn-primary btn-add',
          title: 'Create New ' + model
        }).html('New ' + model + ' <i class="fa fa-fw fa-external-link"></i>').off('click.custom').on('click.custom', function () {

          jUtility.actionHelper('new' + model + 'Frm');
        });

        self.DOM.$prnt.find('.btn-group .btn-add').remove().end().find('.btn-group').prepend($btnAdd);
      }

      var $btnRefresh = $('<button/>', {
        type: 'button',
        class: 'btn btn-primary btn-refresh',
        title: 'Refresh Options'
      }).html('<i class="fa fa-fw fa-refresh"></i>').off('click.custom').on('click.custom', self.fn.multiselectRefresh);

      self.DOM.$prnt.find('.btn-group .btn-refresh').remove().end().find('.btn-group').prepend($btnRefresh);

      return self;
    } // end fn

  };
};

/***/ }),
/* 63 */
/***/ (function(module, exports) {

/**
 * toggles.js
 *
 * Toggle methods
 */

;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  };

  return {
    /**
     * Hide the input
     * @method function
     * @return {[type]} [description]
     */
    hide: function hide() {
      if (!!self.DOM.$prnt.hide) {
        self.DOM.$prnt.hide();
      }
      return self.fn;
    },

    /**
     * Show the input
     * @method function
     * @return {[type]} [description]
     */
    show: function show() {
      if (oAtts().type !== 'hidden') {
        self.DOM.$prnt.show();
      }
      return self.fn;
    },

    /**
     * Disable the input
     * @method function
     * @return {[type]} [description]
     */
    disable: function disable() {
      if (oAtts().type !== 'hidden') {
        self.DOM.$inpt.prop('disabled', true);
        self.DOM.$inpt.addClass('disabled');
      }
      return self.fn;
    },

    /**
     * Enable the input
     * @method function
     * @return {[type]} [description]
     */
    enable: function enable() {
      if (!!self.DOM.$inpt.prop) {
        self.DOM.$inpt.prop('disabled', false);
        self.DOM.$inpt.removeClass('disabled');
      }
      return self.fn;
    }

  };
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * input.js
 *
 * Input methods
 */

;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  },
      runopts = self.runopts;

  return {

    /**
     * Set the instance options
     * @method function
     * @return {[type]} [description]
     */
    setOptions: function setOptions(options) {
      // insulate against options being null
      options = options || {};
      // set the runtime values for the options
      var atts = options.atts || {};

      $.extend(true, self.options, // target
      self.defaults, // default options
      { // additional computed defaults
        atts: {
          id: atts.name || null,
          _enabled: true
        }
      }, options || {} // runtime options
      );

      // alias to attributes object
      //self.options.atts = self.options.atts || {};

      return self.fn; // for chaining methods
    }, // end fn

    /**
     * Resolve the input name
     * @return {[type]} [description]
     */
    resolveInputName: function resolveInputName() {
      if (self.fn.isMultiple()) {
        self.options.atts.name = self.options.atts.name.replace('[]', '') + '[]';
      }
    }, // end fn

    /**
     * Does the input accept multiple values
     * @return {[type]} [description]
     */
    isMultiple: function isMultiple() {
      return !!self.options.atts.multiple || self.options.atts.multiple === 'multiple';
    },

    /**
     * Process form field from parameters
     * @method function
     * @param  {[type]} params [description]
     * @param  {[type]} target [description]
     * @return {[type]}        [description]
     */
    processField: function processField(params, target) {
      var inpt;

      jApp.log('B. Processing Field');
      //jApp.log(params);
      //jApp.log(obj);


      // check if the type is array
      //if (params.type == 'array') return self.fn.processArrayField(params, target);

      inpt = new jInput({ atts: params, form: self.form }, self);
      self.oInpts[params.name] = inpt;
      target.append(inpt.fn.handle());
      if (params.readonly === 'readonly') self.readonlyFields.push(params.name);
    }, // end fn

    /**
     * Get input attributes
     * @method function
     * @return {[type]} [description]
     */
    getAtts: function getAtts() {
      var gblAtts = self.globalAtts;
      var stdAtts = self.allowedAtts[self.type];
      var allowedAttributes = _.union(stdAtts, gblAtts);

      var filteredAtts = _.pick(self.options.atts, function (value, key) {
        if (typeof value === 'undefined' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || !value || value == '__OFF__' || value == '__off__' || _.indexOf(allowedAttributes, key) === -1 && key.indexOf('data-') === -1) {
          return false;
        } else {
          return true;
        }
      });
      return filteredAtts;
    }, // end fn


    /**
     * Set time to live on the store value
     * @method function
     * @param  {[type]} ttl [description]
     * @return {[type]}     [description]
     */
    setTTL: function setTTL(ttl) {
      self.store.setTTL(ttl);
    }, //end fn

    /**
     * Attribute handler function
     * @method function
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    attr: function attr(key, value) {
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
        _.each(key, function (v, k) {
          self.options.atts[k] = v;
        });
        self.fn.refresh();
      } else if (!!value) {
        self.options.atts[key] = value;
        self.fn.refresh();
      } else {
        return self.options.atts[key];
      }
    }, // end fn

    /**
     * Set the value of the input
     * @method function
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    setValue: function setValue(value) {
      jApp.log('--Setting value of ' + self.options.atts.name);
      jApp.log('---value');
      jApp.log(value);
      switch (self.type) {

        case 'select':

          if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !!_.pluck(value, 'id').length) {
            jApp.log('-- plucking the value out of the object');
            value = _.pluck(value, 'id');
          }
          if (!!self.DOM.$inpt.data('multiselect')) {
            jApp.log('-- setting bsms select value');
            jApp.log(value);
            self.DOM.$inpt.multiselect('deselectAll');
            self.fn.val(value);
            self.DOM.$inpt.multiselect('select', value);
            self.DOM.$inpt.multiselect('refresh');
            return self.fn;
          }

          jApp.log('-- normal select, not bsms');
          self.fn.val(value);
          return self.fn;

        case 'tokens':
          self.DOM.$inpt.tokenfield('setTokens', _.pluck(value, 'name'));

          return self.fn;

        case 'array':
          self.fn.populateArrayFormData(self, value);
          return self.fn;

        default:
          self.fn.val(value);
          return self.fn;
      }
    }, // end fn

    /**
     * Value handler function
     * @method function
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    val: function val(value) {

      if (!!value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
          self.$().attr('data-value', value);
          self.fn.attr('value', [value]);
          self.DOM.$inpt.val(value);
        } else {
          self.$().attr('data-value', value);
          self.fn.attr('value', value);
          self.DOM.$inpt.val(value);
        }

        return self.fn;
      }

      switch (self.type) {
        case 'radio':
        case 'checkbox':
          return $.map(self.DOM.$prnt.find(':checked'), function (i, elm) {
            return $(elm).val();
          });

        default:
          return self.DOM.$inpt.val();
      }
    }, // end fn

    /**
     * Serialize the input value and return the object representation
     * @method function
     * @return {[type]} [description]
     */
    serialize: function serialize() {
      var ret = {};

      if (!self.arrayField) {
        return self.fn.val();
      } else {
        self.DOM.$container.find('tr').each(function (i, row) {
          var $inpts = $(row).find(':input:not(button)'),
              key,
              val;

          $inpts.each(function (ii, inpt) {
            val = $(inpt).val();
            name = $(inpt).attr('data-pivotName');

            if (name == null) return false;

            if (ii == 0) {
              key = val;
              ret[key] = {};
            } else {
              ret[key][name] = val;
            }
          });
        });

        return ret;
      }
    }, // end fn

    /**
     * Refresh the attributes of the element
     * @method function
     * @return {[type]} [description]
     */
    refresh: function refresh() {
      _.each(self.fn.getAtts(), function (v, k) {
        if (k !== 'type') {
          // cannot refresh type
          self.DOM.$inpt.attr(k, v);
        }
      });

      self.DOM.$inpt.val(self.options.atts.value);
    },

    /**
     * Render the html of the element
     * @method function
     * @return {[type]} [description]
     */
    render: function render() {
      return self.DOM.$prnt.prop('outerHTML');
    },

    /**
     * jQuery reference to the parent of the element
     * @method function
     * @return {[type]} [description]
     */
    handle: function handle() {
      return self.DOM.$prnt;
    },

    /**
     * pre-initialize the object
     * @method function
     * @return {[type]} [description]
     */
    _preInit: function _preInit() {
      self.store = jApp.store;
      self.readonly = false;

      // Get the default options and config
      self.options = {};
      self.defaults = __webpack_require__(65);

      // allowable html attributes
      self.globalAtts = __webpack_require__(66);
      self.allowedAtts = __webpack_require__(67);

      // allowable column parameters
      self.globalColParams = __webpack_require__(68);
      self.allowedColParams = __webpack_require__(69);
      self.disallowedColParams = __webpack_require__(70);

      /**  **  **  **  **  **  **  **  **  **
         *   DOM ELEMENTS
         *
         *  These placeholders get replaced
         *  by their jQuery handles
         **  **  **  **  **  **  **  **  **  **/
      self.DOM = {
        $prnt: false,
        $inpt: false,
        $lbl: false
      };

      /**
       * [oInpts description]
       * @type {Array}
       */
      self.oInpts = [];

      /**
       * Is self an array field
       * @type {Boolean}
       */
      self.arrayField = false;

      /**
       * Shortcut function to the $inpt
       * @method function
       * @return {[type]} [description]
       */
      self.$ = function () {
        return self.DOM.$inpt;
      };

      // set the instance options to the runtime options
      self.fn.setOptions(self.runopts);

      // set the separator
      self.$separator = !!self.options.separator ? $('<br/>') : false;

      // set the type
      self.type = self.options.atts.type;

      // get the input name
      self.fn.resolveInputName();

      // set readonly flag on the input
      self.readonly = self.options.atts.readonly === 'readonly' ? true : false;

      // set the form
      self.form = runopts.form || self.options.atts.form || {};

      //set the parent element
      self.DOM.$prnt = self.options.parent.clone();

      // initialize
      self.fn._init();
    }, // end fn

    /**
     * Build a label for the input
     * @method function
     * @return {[type]} [description]
     */
    labelHandler: function labelHandler() {
      if (self.type === 'hidden' || !self.options.atts._label) return false;

      self.DOM.$lbl = self.factory.label();

      // append the label to the DOM
      self.DOM.$prnt.append(!!self.DOM.$lbl.parents().length ? self.DOM.$lbl.parents().last() : self.DOM.$lbl);

      //append the separator, if applicable
      if (!!self.options.separator) {
        self.DOM.$prnt.append(self.$separator.clone());
      }
    }, // end fn

    /**
     * A jquery handle to the input
     * @method function
     * @return {[type]} [description]
     */
    inputHandle: function inputHandle() {
      if (self.DOM.$inpt.parents().length) {
        return self.DOM.$inpt.parents().last();
      }
      return self.DOM.$inpt;
    }, // end fn

    /**
     * Append the input, feedback icon
     * container and help block
     * to the $prnt object
     *
     * @method function
     * @return {[type]} [description]
     */
    appendInput: function appendInput() {
      self.DOM.$prnt.append([self.fn.inputHandle(), self.factory.feedbackIcon(), self.factory.helpTextBlock()]);
    }, // end fn

    /**
     * Append the $prnt object to the specified target
     * @method function
     * @param  {[type]} $target [description]
     * @return {[type]}         [description]
     */
    appendTo: function appendTo($target) {
      self.DOM.$prnt.appendTo($target);
    }, // end fn

    /**
     * Initialize the object
     * @method function
     * @return {[type]} [description]
     */
    _init: function _init() {

      //handle the label
      self.fn.labelHandler();

      //create and append the input element
      self.DOM.$inpt = self.factory._build();

      //append the input
      self.fn.appendInput();

      // run any postbuild subroutines
      self.factory._postbuild();

      // //update reference to $inpt for radio groups
      // if (self.type === 'radio') {
      // 	self.DOM.$inpt = self.DOM.$prnt.find( '[name=' + self.options.atts.name + ']' );
      // }
    } // end fn
  };
};

/***/ }),
/* 65 */
/***/ (function(module, exports) {

/**
 * default jInput Options
 *
 * Set the default options for the
 *  instance here. Any values specified
 *  at runtime will overwrite these
 *  values.
 *
 * @type Object
 */

;module.exports = {
	// html attributes
	atts: {
		type: 'text',
		class: 'form-control',
		name: 'input',
		_enabled: true
	},

	// DOM presentation options
	parent: $('<div/>', { 'class': 'form_element has-feedback' }),

	// wrap - wrap the label and input elements with something e.g. <div></div>
	wrap: false,

	// separator - separate the label and input elements
	separator: true,

	// external data for options, etc.
	extData: false,

	// TTL for external data (mins)
	ttl: 10,

	// cache options locally
	cache: true,

	// hide if no options
	hideIfNoOptions: false,

	// multiselect defaults
	bsmsDefaults: { // bootstrap multiselect default options
		//buttonContainer : '<div class="btn-group" />',
		enableCaseInsensitiveFiltering: true,
		includeSelectAllOption: true,
		maxHeight: 185,
		numberDisplayed: 1,
		dropUp: true
	}

};

/***/ }),
/* 66 */
/***/ (function(module, exports) {

/**
 * Globally allowed attributes
 * @type {Array}
 */
module.exports = ['accesskey', 'class', 'contenteditable', 'contextmenu', 'dir', 'draggable', 'dropzone', 'hidden', 'id', 'lang', 'lang', 'spellcheck', 'style', 'tabindex', 'title', 'translate', 'data-validType', 'readonly', 'required', 'onClick', 'onChange', 'form'];

/***/ }),
/* 67 */
/***/ (function(module, exports) {

/**
 * Allowed attributes by input type
 * @type {Object}
 */
module.exports = {
  date: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
  datetime: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
  'datetime-local': ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
  month: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
  time: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
  week: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],

  url: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],
  text: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],
  tokens: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],
  search: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],

  number: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'placeholder', 'readOnly', 'required', 'step', 'type', 'value'],
  range: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'step', 'type', 'value'],

  password: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],

  button: ['autofocus', 'defaultValue', 'disabled', 'form', 'name', 'type', 'value'],
  reset: ['autofocus', 'defaultValue', 'disabled', 'form', 'name', 'type', 'value'],
  submit: ['autofocus', 'defaultValue', 'disabled', 'form', 'name', 'type', 'value'],

  radio: ['autofocus', 'checked', 'defaultChecked', 'defaultValue', 'disabled', 'form', 'name', 'required', 'type', 'value'],
  checkbox: ['autofocus', 'checked', 'defaultChecked', 'defaultValue', 'disabled', 'form', 'indeterminate', 'name', 'required', 'type', 'value'],

  file: ['accept', 'autofocus', 'defaultValue', 'disabled', 'files', 'form', 'multiple', 'name', 'required', 'type', 'value'],

  hidden: ['defaultValue', 'form', 'name', 'type', 'value', 'readonly'],

  image: ['alt', 'autofocus', 'defaultValue', 'disabled', 'form', 'height', 'name', 'src', 'type', 'value', 'width'],

  select: ['disabled', 'form', 'multiple', 'name', 'size', 'type', 'value', '_linkedElmID', '_linkedElmFilterCol', '_linkedElmLabels', '_linkedElmOptions'],

  textarea: ['autofocus', 'cols', 'defaultValue', 'disabled', 'form', 'maxLength', 'name', 'placeholder', 'readOnly', 'required', 'rows', 'type', 'value', 'wrap'],

  color: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'name', 'type', 'value'],

  email: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'multiple', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],
  tel: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value']
}; // end allowable attributes

/***/ }),
/* 68 */
/***/ (function(module, exports) {

/**
 * Globally allowed column parameters
 * @type {Array}
 */
module.exports = ['_enabled', '_label', 'data-fieldset', 'data-ordering', 'data-validType-template', 'type'];

/***/ }),
/* 69 */
/***/ (function(module, exports) {

/**
 * Allowed column parameters by input type
 * @type {Object}
 */
module.exports = {
  radio: ['_labelssource', '_optionssource', '_optionsfilter'],
  select: ['_firstoption', '_firstlabel', '_labelssource', '_optionssource', '_optionsfilter']
};

/***/ }),
/* 70 */
/***/ (function(module, exports) {

/**
 * Disallowed column parameters by input type
 * @type {Object}
 */
module.exports = {
  hidden: ['_label', 'onClick', 'onChange']
};

/***/ }),
/* 71 */
/***/ (function(module, exports) {

/**
 * factory.js
 *
 * jInput factory methods
 */

;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  };

  return {
    /**
     * Main builder method
     * @method function
     * @return {[type]} [description]
     */
    _build: function _build() {
      var $inpt = typeof self.factory[self.type] === 'function' ? self.factory[self.type]() : self.factory.input();

      return $inpt.data('jInput', self).off('change.jInput').on('change.jInput', function () {
        $(this).data('jInput').options.atts.value = $(this).val();
      });
    }, // end fn

    /**
     * Run post-build subroutines
     * @method function
     * @return {[type]} [description]
     */
    _postbuild: function _postbuild() {
      jApp.log('--Testing self object--');
      jApp.log(self);
      if (typeof self.factory._callback[self.type] === 'function') {
        self.factory._callback[self.type]();
      }
    }, // end fn

    // callback definitions
    _callback: {
      select: self.fn.initSelectOptions
    }, // end factory callbacks

    /**
     * create a generic input element
     * @method function
     * @return {[type]} [description]
     */
    input: function input() {
      return $('<input/>', self.fn.getAtts()).wrap(self.options.wrap);
    }, // end fn

    /**
     * create a select element
     * @method function
     * @return {[type]} [description]
     */
    select: function select() {
      return $('<select/>', self.fn.getAtts()).wrap(self.options.wrap);
    }, // end fn

    /**
     * create a tokens element
     * @method function
     * @return {[type]} [description]
     */
    tokens: function tokens() {
      // get the external options
      self.fn.getExtOptions();

      var runtime = self.fn.getAtts(),
          atts = $.extend(true, runtime, {
        type: 'text',
        'data-tokens': true,
        'data-url': self.fn.getExtUrl('tokens')
      });

      return $('<input/>', atts);
    }, // end fn

    /**
     * create a textarea element
     * @method function
     * @return {[type]} [description]
     */
    textarea: function textarea() {
      return $('<textarea/>', self.fn.getAtts()).wrap(self.options.wrap);
    }, // end fn

    /**
     * create a button element
     * @method function
     * @return {[type]} [description]
     */
    button: function button() {
      return $('<button/>', self.fn.getAtts()).html(self.options.atts.value).wrap(self.options.wrap);
    }, // end fn

    /**
     * create an array input
     * @method function
     * @return {[type]} [description]
     */
    array: function array() {
      return self.fn.processArrayField(self.options.atts);
    }, //  end fn

    /**
     * create a label element
     * @method function
     * @return {[type]} [description]
     */
    label: function label() {
      return $('<label/>', { 'for': self.options.atts.id }).html(self.options.atts._label).wrap(self.options.wrap);
    }, // end fn

    /**
     * create a feedback icon
     * @method function
     * @return {[type]} [description]
     */
    feedbackIcon: function feedbackIcon() {
      return $('<i/>', { class: 'form-control-feedback glyphicon', style: 'display:none' });
    }, // end fn

    /**
     * Create a helptext block
     * @method function
     * @return {[type]} [description]
     */
    helpTextBlock: function helpTextBlock() {
      return $('<small/>', { class: 'help-block', style: 'display:none' });
    } // end fn
  };
};

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 *  jForm.class.js - Custom Form JS class
 *
 *  Defines the properties and methods of the
 *  custom form class.
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 *  Prereqs:    jQuery, underscore.js, jStorage.js
 */
;'use strict';

/* harmony default export */ __webpack_exports__["a"] = (function (options) {

    var

    /**
     * Alias of this
     * @type {[type]}
     */
    self = this,


    /**
     * Shortcut to this.options.atts
     */
    oAtts = void 0,


    /**
     * Runtime options
     * @type {[type]}
     */
    runopts = options || {},
        $ = window.$,
        _ = window._;

    /**  **  **  **  **  **  **  **  **  **
     *   FUNCTION DEFS
     **  **  **  **  **  **  **  **  **  **/
    this.fn = {
        _init: function _init() {
            var inpt;

            // create the form
            self.DOM.$frm = self.factory.form();

            // handle the fieldset
            self.fn.handleFieldset();

            // append the DOM elements
            self.fn.append();

            // create and append the hidden elements
            self.fn.buildInputs(self.options.hiddenElms);

            // handle the column parameters
            self.fn.handleColParams();
        }, // end fn

        /**
         * Serialize the input values
         * @method function
         * @return {[type]} [description]
         */
        serialize: function serialize() {
            var ret = {};
            _.each(self.oInpts, function (o, i) {
                // ignore disabled elements
                if (!!(o.$().prop('disabled') || o.$().hasClass('disabled'))) return false;

                ret[i] = o.fn.serialize();
            });
            return ret;
        }, // end fn

        /**
         * The the value of the input
         * @method function
         * @param  {[type]} value [description]
         * @param  {[type]} key   [description]
         * @return {[type]}       [description]
         */
        setInputValue: function setInputValue(value, key) {
            var oInpt;

            jApp.log('Setting up input ' + key);
            jApp.log(value);

            if (typeof self.oInpts[key] === 'undefined' || typeof self.oInpts[key].$ !== 'function') {
                jApp.log('No input associated with this key.');
                return false;
            }

            // get the jInput object
            oInpt = self.oInpts[key];

            // enable the input
            oInpt.fn.enable();

            // set the value of the input
            return oInpt.fn.setValue(value, key);
        }, // end fn

        /**
         * Is the form field an array input
         * @param  {[type]} oInpt [description]
         * @return {[type]}       [description]
         */
        isArrayFormField: function isArrayFormField(oInpt) {
            return !!oInpt.arrayField;
        }, //end fn

        /**
         * Is the form field a tokens field
         * @param  {[type]} value [description]
         * @param  {[type]} oInpt [description]
         * @return {[type]}       [description]
         */
        isTokensFormField: function isTokensFormField(oInpt, value) {
            return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !!_.pluck(value, 'name').length && typeof oInpt.$().attr('data-tokens') !== 'undefined';
        }, // end fn

        /**
         * Get the form data as a FormData object
         * @method function
         * @return {[type]} [description]
         */
        getFormData: function getFormData() {
            // var data = new FormData;
            //
            // _.each( self.$().serializeObject(), function(value,name) {
            //   data.append(name, value);
            // });
            //
            // self.$().find('input[type=file]').each( function(i, elm) {
            //     jApp.log('adding files to the FormData object');
            //
            //     jApp.log( elm.files );
            //
            //     _.each( elm.files, function( o ) {
            //       jApp.log( 'Adding ' + elm.name );
            //       jApp.log( o );
            //
            //       data.append( elm.name, o );
            //     });
            // })

            return self.fn.serialize();
        }, // end fn

        /**
         * Get the DOM handle of the form
         * @return {[type]} [description]
         */
        handle: function handle() {
            return self.DOM.$prnt;
        }, // end fn

        /**
         * Get the form fieldset
         * @return {[type]} [description]
         */
        $fieldset: function $fieldset() {
            return self.DOM.$frm.find('fieldset');
        }, //end fn

        /**
         * Get form input by id
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        getElmById: function getElmById(id) {
            id = id.replace('#', '');

            return self.oInpts[id];
        },

        /**
         * Render the form html
         * @param  {[type]} params [description]
         * @return {[type]}        [description]
         */
        render: function render(params) {
            var tmp = self.DOM.$prnt.prop('outerHTML'),
                ptrn;

            if (!!params && !$.isEmptyObject(params)) {
                _.each(params, function (o, key) {
                    ptrn = new RegExp('\{@' + key + '\}', 'gi');
                    tmp = tmp.replace(ptrn, o);
                });
            }
            return tmp;
        }, //end fn

        /**
         * Add inputs to the form
         * @param  {[type]} arr [description]
         * @return {[type]}     [description]
         */
        addElements: function addElements(arr) {
            self.options.colParamsAdd = _.union(self.options.colParamsAdd, arr);
        }, //end fn

        /**
         * Get external column parameters - deprecated
         * @return {[type]} [description]
         */
        getColParams: function getColParams() {
            jApp.log('A. Getting external colparams');
            self.options.colParams = jApp.colparams[self.options.model] || self.options.colParams;
            jApp.log(self.options.colParams);

            //process the colParams;
            self.fn.processExternalColParams();

            //add the buttons
            self.fn.processBtns();
        }, //end fn

        /**
         * Pre-Filter column parameters to remove invalid entries
         * @param  {[type]} unfilteredParams [description]
         * @return {[type]}                  [description]
         */
        preFilterColParams: function preFilterColParams(unfilteredParams) {
            return _.filter(unfilteredParams, function (o) {
                if (!o) {
                    jApp.warn(o);
                    jApp.warn('Fails because is null');
                    return false;
                }

                // add the default colparams before attempting to filter
                o = $.extend(true, {}, self.options.defaultColparams, o);

                if (!o._enabled) {
                    jApp.warn(o);
                    jApp.warn('Fails because is not enabled');
                    return false;
                }
                if (_.indexOf(self.options.disabledElements, o.name) !== -1) {
                    jApp.warn(o);
                    jApp.warn('Fails because is on the disabled elements list');
                    return false;
                }

                return _.omit(o, function (value) {
                    return !value || value === 'null' || value.toString().toLowerCase() === '__off__';
                });
            });
        }, // end fn

        /**
         * Get row data for the form
         * @param  {[type]}   url      [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        getRowData: function getRowData(url, callback) {

            $('.panel-overlay').show();

            $.getJSON(jApp.prefixURL(url), {}, self.callback.getRowData).fail(function () {
                console.error('There was a problem getting the row data');
            }).always(function (response) {
                if (typeof callback !== 'undefined' && typeof callback === 'function') {
                    callback(response);
                } else if (typeof callback !== 'undefined' && typeof callback === 'string' && typeof self.fn[callback] !== 'undefined' && typeof self.fn[callback] === 'function') {
                    self.fn[callback](response);
                }
            });
        }, //end fn

        /**
         * Process externally loaded column parameters
         * @method function
         * @return {[type]} [description]
         */
        processExternalColParams: function processExternalColParams() {
            _.each(self.options.colParams, function (o, index) {
                self.fn.processFieldset(o, index);
            });
        }, // end fn

        /**
         * Process fieldset
         * @method function
         * @param  {[type]} o     [description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        processFieldset: function processFieldset(o) {

            jApp.log('A. Processing the fieldset');
            jApp.log(o);
            //create the fieldset
            var $fs = $('<div/>', {
                class: o.class
            });

            // add the label, if necessary
            jApp.log('A.1 Adding the label');
            if (!!o.label) {
                $fs.append($('<legend/>').html(o.label));
            }

            // add the helptext if necessary
            jApp.log('A.2 Adding the helptext');
            if (!!o.helpText) {
                $fs.append($('<div/>', { class: 'alert alert-info' }).html(o.helpText));
            }

            // add the fields
            jApp.log('A.3 Adding the fields');
            _.each(self.fn.preFilterColParams(o.fields), function (oo, kk) {
                jApp.log('A.3.' + kk + ' Adding Field');
                jApp.log(oo);
                self.fn.processField(oo, $fs);
            });

            // add the fieldset to the DOM
            jApp.log('A.4 Adding to the DOM');
            self.DOM.$Inpts.append($fs);
        }, // end fn

        /**
         * Populate a row with the field inputs
         * @method function
         * @param  {[type]} params [description]
         * @return {[type]}        [description]
         */
        populateFieldRow: function populateFieldRow(params, index, data) {
            var $btn_add = $('<button/>', {
                type: 'button',
                class: 'btn btn-link btn-array-add'
            }).html('<i class="fa fa-fw fa-plus"></i>'),
                $btn_remove = $('<button/>', {
                type: 'button',
                class: 'btn btn-link btn-array-remove'
            }).html('<i class="fa fa-fw fa-trash-o"></i>');

            jApp.log('---------Array Row Data---------');
            jApp.log(data);

            return $('<tr/>').append(_.map(params.fields, function (oo, ii) {
                var $td = $('<td/>', { nowrap: 'nowrap' }),
                    value = null;

                oo['data-array-input'] = true;

                // if its the first input (the singleSelect) grab the value (the id of the row)
                if (!!data && !!data.id && ii === 0) {
                    value = data.id;
                }

                jApp.log('-----[]-----');
                jApp.log(oo);
                jApp.log(data);

                // if its not the first input, grab the value from the pivot data
                if (ii > 0 && !!data && !!oo['data-pivotName'] && !!data.pivot && !!data.pivot[oo['data-pivotName']]) {
                    value = data.pivot[oo['data-pivotName']];

                    // if it's not a m-m relationship, look for the data in the root of the object
                } else if (ii > 0 && !!data && !!oo['data-pivotName'] && !!data[oo['data-pivotName']]) {
                    value = data[oo['data-pivotName']];
                }

                self.fn.processField(oo, $td, value, true);
                return $td;
            })).append([$('<td/>', { nowrap: 'nowrap' }).append([$btn_remove, $btn_add])]);
        }, // end fn

        /**
         * Process form field from parameters
         * @method function
         * @param  {[type]} params [description]
         * @param  {[type]} target [description]
         * @return {[type]}        [description]
         */
        processField: function processField(params, target, value, isArrayFormField) {
            var inpt,
                inpt_name = params.name.replace('[]', '');

            jApp.log('B. Processing Field');
            inpt = new jInput({ atts: params, form: self });

            if (!isArrayFormField) {
                self.oInpts[inpt_name] = inpt;
            } else if (typeof self.oInpts[inpt_name] !== 'undefined') {

                if (typeof self.oInpts[inpt_name].oInpts === 'undefined') {
                    self.oInpts[inpt_name].oInpts = [];
                }
                self.oInpts[inpt_name].oInpts.push(inpt);
            }
            inpt.fn.val(value);
            target.append(inpt.fn.handle());
            //if (params.readonly === 'readonly') self.readonlyFields.push(params.name);
        }, // end fn

        /**
         * Process externally loaded column parameters - deprecated
         * @return {[type]} [description]
         */
        processColParams: function processColParams() {
            self.DOM.$Inpts.find('.fs, .panel-heading').remove();

            if (self.options.layout === 'standard') {

                self.DOM.$Inpts.append($('<div/>', { 'class': 'fs col-lg-4' }));
                self.DOM.$Inpts.append($('<div/>', { 'class': 'fs col-lg-4' }));
                self.DOM.$Inpts.append($('<div/>', { 'class': 'fs col-lg-4' }));
            } else {
                self.DOM.$Inpts.append($('<div/>', { 'class': 'fs' }));
            }

            // process static or dynamically loaded colParams
            _.each(_.sortBy(self.options.colParams, function (o) {
                return !isNaN(o['data-ordering']) ? +o['data-ordering'] : 1000;
            }), function (o, key) {
                var inpt, eq;
                if (!!o && !!o.name && _.indexOf(self.options.disabledElements, o.name) === -1) {

                    eq = !!o['data-fieldset'] ? Number(o['data-fieldset']) - 1 : 0;
                    inpt = new jInput({ atts: o, form: self });
                    self.oInpts[o.name] = inpt;
                    self.DOM.$Inpts.find('.fs').eq(self.options.layout === 'standard' ? eq : 0).append(inpt.fn.handle());
                    if (o.readonly === 'readonly') {
                        self.readonlyFields.push(o.name);
                    }
                }
            });

            //jApp.log('Now adding the colParamsAdd : ' + self.options.colParamsAdd.length);
            // process additional colParams that may have come from linkTables
            _.each(_.sortBy(self.options.colParamsAdd, function (o) {
                return !isNaN(o['data-ordering']) ? +o['data-ordering'] : 1000;
            }), function (o, key) {
                var inpt, eq;
                if (!!o && !!o.name && _.indexOf(self.options.disabledElements, o.name) === -1) {

                    eq = !!o['data-fieldset'] ? Number(o['data-fieldset']) - 1 : 0;
                    inpt = new jInput({ atts: o, form: self });
                    self.oInpts[o.name] = inpt;
                    self.DOM.$Inpts.find('.fs').eq(self.options.layout === 'standard' ? eq : 0).append(inpt.fn.handle());
                    if (o.readonly === 'readonly') {
                        self.readonlyFields.push(o.name);
                    }
                }
            });

            if (self.options.layout === 'standard') {
                // set fieldset classes
                if (self.DOM.$Inpts.find('.fs').eq(1).find('div').length === 0) {
                    self.DOM.$Inpts.find('.fs').eq(1).removeClass('col-lg-4').end().eq(0).removeClass('col-lg-4').addClass('col-lg-8');
                } else {
                    self.DOM.$Inpts.find('.fs').eq(1).addClass('col-lg-4').end().eq(0).addClass('col-lg-4').removeClass('col-lg-8');
                }
            }

            // handle linked Elements
            self.$().find('[_linkedElmID]').off('change.linkedelm').on('change.linkedelm', function () {
                //jApp.log( 'Setting up linked Element' );
                var This = $(this),
                    $col = This.attr('_linkedElmFilterCol'),
                    $id = This.val(),
                    $labels = This.attr('_linkedElmLabels'),
                    $options = This.attr('_linkedElmOptions'),
                    oElm = self.fn.getElmById(This.attr('_linkedElmID')),
                    atts;

                //jApp.log(This.attr('name'));
                //jApp.log($id);
                //jApp.log(oElm);

                // set data to always expire;
                oElm.fn.setTTL(-1);
                oElm.options.hideIfNoOptions = true;
                oElm.options.cache = false;

                if (typeof $id === 'string') {
                    $id = "'" + $id + "'";
                }
                if ((typeof $id === 'undefined' ? 'undefined' : _typeof($id)) === 'object') {
                    $id = _.map($id, function (elm) {
                        return "'" + elm + "'";
                    });
                }

                atts = {
                    '_optionsFilter': $col + ' in (' + $id + ')',
                    '_labelsSource': $labels,
                    '_optionsSource': $options,
                    'getExtData': true
                };

                if (!oElm.fn.attr('multiple') || oElm.fn.attr('multiple') != 'multiple') {
                    atts = _.extend(atts, { '_firstoption': 0, '_firstlabel': '-Other-' });
                }

                oElm.fn.attr(atts);

                oElm.fn.initSelectOptions(true);
            }).change();
        }, //end fn

        /**
         * Add the form buttons
         * @method function
         * @return {[type]} [description]
         */
        processBtns: function processBtns() {
            var btnPanel = $('<div/>', { 'class': 'panel-btns header' }),
                btnFooter = $('<div/>', { 'class': 'panel-btns footer' });

            _.each(self.options.btns, function (o, key) {
                if (o.type === 'button') {
                    var inpt = $('<button/>', o).html(o.value);
                } else {
                    var inpt = $('<input/>', o);
                }

                btnPanel.append(inpt);
                btnFooter.append(inpt.clone());
            });

            self.DOM.$Inpts.append([btnPanel, btnFooter]);
            //self.DOM.$Inpts.append(btnFooter);
        }, //end fn

        /**
         * Submit the form
         * @return {[type]} [description]
         */
        submit: function submit() {

            self.fn.toggleSubmitted();

            $.ajax({
                //dataType : 'json',
                method: 'POST',
                url: jApp.prefixURL(self.options.atts.action),
                data: self.fn.serialize(),
                success: self.callback.submit
            }).done(self.fn.toggleSubmitted);
        }, //end fn

        /**
         * Toggle the submited flag of the form
         * @return {[type]} [description]
         */
        toggleSubmitted: function toggleSubmitted() {
            if (!self.submitted) {
                self.submitted = true;
                //self.oElms['btn_go'].fn.disable();
            } else {
                self.submitted = false;
                //self.oElms['btn_go'].fn.enable();
            }
        }, // end fn

        /**
         * Set the instance options
         * @method function
         * @return {[type]} [description]
         */
        setOptions: function setOptions(options) {
            // insulate against options being null
            options = options || {};
            // set the runtime values for the options
            var atts = options.atts || {};

            $.extend(true, self.options, // target
            self.defaults, // default options
            { // additional defaults
                // Default attributes
                atts: {
                    name: 'frm_edit' + (options.tableFriendly || options.model || null)
                },

                // Default hidden elements
                hiddenElms: [{
                    atts: {
                        'type': 'hidden',
                        'readonly': 'readonly',
                        'name': '_method',
                        'value': atts.method || 'POST',
                        'data-static': true
                    }
                }],

                // Default fieldset heading
                fieldset: {
                    'legend': (options.tableFriendly || 'Form') + ' Details',
                    'id': 'fs_details'
                },

                // Default buttons
                btns: [{
                    type: 'button',
                    class: 'btn btn-primary btn-formMenu',
                    id: 'btn_form_menu_heading',
                    value: '<i class="fa fa-fw fa-bars"></i>'
                }, {
                    type: 'button',
                    class: 'btn btn-primary btn-go',
                    id: 'btn_go',
                    value: '<i class="fa fa-fw fa-floppy-o"></i> Save &amp; Close'
                }, {
                    type: 'button',
                    class: 'btn btn-primary btn-reset',
                    id: 'btn_reset',
                    value: '<i class="fa fa-fw fa-refresh"></i> Reset'
                }, {
                    type: 'button',
                    class: 'btn btn-primary btn-cancel',
                    id: 'btn_cancel',
                    value: '<i class="fa fa-fw fa-times"></i> Cancel'
                }]
            }, options || {} // runtime options
            );

            // alias to attributes object
            oAtts = self.options.atts || {};

            // set up the callback functions
            $.extend(true, self.callback, options.callback || {});

            return self.fn; // for chaining methods
        }, // end fn

        /**
         * Handle form fieldset
         * @method function
         * @return {[type]} [description]
         */
        handleFieldset: function handleFieldset() {
            if (!!self.options.loadExternal) return false;

            self.DOM.$frm.append(self.factory.fieldset());
        }, // end fn

        /**
         * Handle the column parameters
         * @method function
         * @return {[type]} [description]
         */
        handleColParams: function handleColParams() {
            if (!!self.options.loadExternal) {
                // get the colparams from an external json source
                return self.fn.getColParams();
            }

            self.fn.processColParams();
            self.fn.processBtns();
        }, // end fn

        /**
         * Append the DOM elements
         * @method function
         * @return {[type]} [description]
         */
        append: function append() {
            self.DOM.$frm.append(self.DOM.$Inpts);

            // append the form to the parent container
            self.DOM.$prnt.append(!!self.DOM.$frm.parents().length ? self.DOM.$frm.parents().last() : self.DOM.$frm);
        }, // end fn

        /**
         * Build inputs from array
         *  of column parameters
         * @method function
         * @return {[type]} [description]
         */
        buildInputs: function buildInputs(aColParams) {
            _.each(aColParams, self.factory.input);
        }, // end fn

        /**
         * pre-initialize the object
         * @method function
         * @return {[type]} [description]
         */
        _preInit: function _preInit() {
            self.store = jApp.store;
            self.readonly = false;

            // Get the default options and config
            self.options = {};
            self.defaults = __webpack_require__(73);

            /**  **  **  **  **  **  **  **  **  **
             *   DOM ELEMENTS
             *
             *  These placeholders get replaced
             *  by their jQuery handles
             **  **  **  **  **  **  **  **  **  **/
            self.DOM = {
                $prnt: $('<div/>'),
                $frm: false,
                $fs: false,
                $Inpts: $('<div/>')
            };

            /**
             * Initialize submitted flag
             * @type {Boolean}
             */
            self.submitted = false;

            /**
             * Reference jStorage object
             * @type {[type]}
             */
            self.store = $.jStorage;

            /**
             * Container for jInput objects
             * @type {Array}
             */
            self.oInpts = {};

            /**
             * Initialize the rowData object
             * @type {Object}
             */
            self.rowData = {};

            /**
             * Initialize the readonly fields array
             * @type {Array}
             */
            self.readonlyFields = [];

            /**
             * Initialize the html template container
             * @type {Object}
             */
            self.html = {};

            /**
             * Shortcut function to the $frm
             * @method function
             * @return {[type]} [description]
             */
            self.$ = function () {
                return self.DOM.$frm;
            };

            // set the instance options
            self.fn.setOptions(options);

            // the model of the form
            self.model = self.options.model;

            // initialize
            self.fn._init();
        } // end fn

    }; // end fns

    /**
     * Builders for html elements
     * @type {Object}
     */
    this.factory = {

        /**
         * Create a form element
         * @method function
         * @return {[type]} [description]
         */
        form: function form(options) {
            options = options || self.options;

            return $('<form/>', options.atts).data('jForm', self).wrap(options.wrap);
        }, // end fn

        /**
         * Build and append an input
         * from column parameters
         * @method function
         * @param  {[type]} colparams [description]
         * @return {[type]}           [description]
         */
        input: function input(colparams, index) {
            var inpt = self.factory.jInput(colparams),
                atts = colparams.atts || {};

            // add the jInput object to the oInpts array
            self.oInpts[atts.name] = inpt;

            // add the input DOM handle to the DOM
            self.DOM.$Inpts.append(inpt.fn.handle());

            // add the input to the readonly
            //  fields list, if applicable
            if (!!atts.readonly) {
                self.readonlyFields.push(atts.name);
            }
        }, // end fn

        /**
         * Build a new jInput Object
         * from column parameters
         * @method function
         * @param  {[type]} colparams [description]
         * @return {[type]}           [description]
         */
        jInput: function (_jInput) {
            function jInput(_x) {
                return _jInput.apply(this, arguments);
            }

            jInput.toString = function () {
                return _jInput.toString();
            };

            return jInput;
        }(function (colparams) {
            colparams.form = self;
            return new jInput(colparams);
        }), // end fn

        /**
         * Create a fieldset element
         * @method function
         * @return {[type]} [description]
         */
        fieldset: function fieldset(options) {
            options = options || self.options.fieldset;
            return $('<fieldset/>', options).append(self.factory.legend());
        }, // end fn

        /**
         * Create a legend element
         * @method function
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        legend: function legend(options) {
            options = options || self.options.fieldset.legend;
            return $('<legend/>').html(options);
        } // end fn

        // end factory

        // alias the submit function
    };this.submit = this.fn.submit;

    this.callback = {

        /**
         * Get row data callback
         * @param  {[type]} response [description]
         * @return {[type]}          [description]
         */
        getRowData: function getRowData(response) {
            var oInpt, $inpt;

            if (typeof response[0] !== 'undefined') {
                response = response[0];
            }

            self.rowData = response;

            self.DOM.$frm.clearForm();

            // iterate through each row and the the corresponding input value
            _.each(response, self.fn.setInputValue);

            // if there is a custom callback, then call it.
            if (typeof jApp.aG().fn.getRowDataCallback === 'function') {
                jApp.aG().fn.getRowDataCallback();
            }

            //self.DOM.$frm.find('.bsms').multiselect('refresh').change();
            $('.panel-overlay').hide();
        },

        // do something with the response
        submit: function submit(response) {
            jApp.log(response);
        }
    }; // end fns

    // initialize
    this.fn._preInit(options || {});
});; // end jForm declaration

/***/ }),
/* 73 */
/***/ (function(module, exports) {

/**
 * default jForm Options
 *
 * Set the default options for the
 *  instance here. Any values specified
 *  at runtime will overwrite these
 *  values.
 *
 * @type Object
 */

;module.exports = {
  // form setup
  model: '',
  table: '',
  atts: { // form html attributes
    'method': 'POST',
    'action': '',
    'role': 'form',
    'onSubmit': 'return false',
    'name': false,
    'enctype': 'multipart/form-data'
  },
  hiddenElms: false,
  wrap: '',
  btns: false,
  fieldset: false,
  disabledElements: [],
  defaultColparams: {
    _enabled: true,
    name: 'input',
    type: 'text'
  },
  colParams: {},
  colParamsAdd: [], // storage container for additional colParams such as from linkTables
  loadExternal: true, // load external colParams e.g. from a db
  ttl: 30, // TTL for external data (mins)
  tableFriendly: '', // friendly name of table e.g. Application
  layout: 'standard' // standard (three-column layout) | single (one-col layout)
};

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 *  jGrid.class.js - Custom Data Grid JS class
 *
 *  Defines the properties and methods of the
 *  custom grid class. This version asynchronously
 *  keeps the grid updated by receiving JSON data
 *  from the server
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 *  Prereqs:    jQuery, underscore.js,
 *                    jInput, jForm, $.validator
 *                jApp, jUtility
 */

/**
 * jGrid instance constructor
 * @method function
 * @param  {object} options
 * @return /jGrid            jGrid instance
 */
/* harmony default export */ __webpack_exports__["a"] = (function (options) {

    'use strict';

    var $ = window.$,
        jApp = window.jApp,
        jUtility = window.jUtility,
        self = jApp.activeGrid = this;

    /**
     * Alias handle to the grid
     * @method function
     * @return {[type]} [description]
     */
    this.$ = function () {
        return self.DOM.$grid;
    };

    /**
     * Declare Options vars
     * @type {Object}
     */
    this.options = {
        formDefs: {},
        bind: {},
        events: {},
        fn: {},
        toggles: {},
        bsmsDefaults: {},
        gridHeader: {},
        tableBtns: {},
        rowBtns: {},
        withSelectedBtns: {},
        runtimeParams: options
    }; // end options

    /**
     * HTML Templates
     * @type {Object}
     */
    this.html = {};

    /**
     * Container for events once they have been delegated to avoid collisions
     * @type {Array}
     */
    this.delegatedEvents = [];

    /**
     * Class Methods
     * @type {Object}
     */
    this.fn = {

        /**
         * init the instance
         * @method function
         * @return {[type]} [description]
         */
        _init: function _init() {

            jApp.log('1. Setting Options');
            jUtility.setOptions($.extend(true, {}, jUtility.getDefaultOptions(), {
                tableBtns: { new: { label: 'New ' + (options.model_display || options.model) } } }, options));

            jApp.log('2. Setting up html templates');
            jUtility.setupHtmlTemplates();

            jApp.log('3. Setting up initial parameters');
            jUtility.setInitParams();

            jApp.log('0. Get User Permissions');
            jUtility.getPermissions(options.model);

            jApp.log('4. Setting Ajax Defaults');
            jUtility.setAjaxDefaults();

            jApp.log('5. Initializing Template');
            jUtility.initializeTemplate();

            jApp.log('6. Getting grid data');
            jUtility.getGridData();

            jApp.log('7. Setting up intervals');
            //jUtility.setupIntervals();

            jApp.log('8. Building Menus');
            jUtility.buildMenus();

            jApp.log('9. Building Forms');
            jUtility.buildForms();

            jApp.log('10. Setting up bindings');
            jUtility.bind();

            //jApp.log('11. Setting up link tables')
            //jUtility.linkTables();

            // toggle the mine button if needed
            // if ( jUtility.isToggleMine() ) {
            // 	self.fn.toggleMine();
            // }

            jUtility.getCheckedOutRecords();
            jUtility.initScrollbar();
        } // end fn
    }; // end fn defs

    // add any functions to this.fn
    this.fn = $.extend(true, this.fn, options.fn);

    // initialize
    this.fn._init();
});; // end fn

/***/ })
/******/ ]);