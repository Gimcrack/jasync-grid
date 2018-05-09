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

export default function (options) {

    let

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
            atts: {},
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
        require('./config/methods/options')(self),

        /**
         * Array input functions
         */
        require('./config/methods/arrayInputs')(self),

        /**
         * Multiselect functions
         */
        require('./config/methods/multiselect')(self),

        /**
         * Toggling functions
         */
        require('./config/methods/toggles')(self),

        /**
         * Other input-related functions
         */
        require('./config/methods/input')(self)
    ); // end fns

    /**
     * Builders for html elements
     * @type {Object}
     */
    self.factory = require('./config/methods/factory')(self);

    // initialize
    self.fn._preInit(options || {});

}; // end fn