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

import dom from './config/methods/dom';

export default window.$.extend(
  require('./config/methods/bindings'),
  require('./config/methods/booleans'),
  require('./config/methods/callbacks'),
  dom,
  require('./config/methods/formatters'),
  require('./config/methods/forms'),
  require('./config/methods/grid'),
  require('./config/methods/intervals'),
  require('./config/methods/messaging'),
  require('./config/methods/pagination'),
  require('./config/methods/request')
);