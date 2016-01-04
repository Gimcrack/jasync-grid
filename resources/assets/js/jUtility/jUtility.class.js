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

 var $ = require('jQuery'),
 		 _ = require('underscore'),
     jForm = require('../jForm/jForm.class'),
     jInput = require('../jInput/jInput.class'),
     bootstrap = require('bootstrap');

$.validator = require('@ingenious/jquery-validator');
$.fn.bootpag = require('./vendor/jquery.bootpag');

require('./vendor/jquery.md5')($);
require('noty');

module.exports = $.extend(
  require('./config/methods/bindings'),
  require('./config/methods/booleans'),
  require('./config/methods/callbacks'),
  require('./config/methods/dom'),
  require('./config/methods/formatters'),
  require('./config/methods/forms'),
  require('./config/methods/grid'),
  require('./config/methods/intervals'),
  require('./config/methods/messaging'),
  require('./config/methods/pagination'),
  require('./config/methods/request')
);
