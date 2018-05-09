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
'use strict';

/**
 * Configure the export
 * @method function
 * @return {[type]} [description]
 */
export default function (options) {

    const self = this,
        $ = window.$;

    options = options || {};

    /**
     * Configuration
     * @type {Object}
     */
    $.extend(true,
        this,
        require('./config/defaults'),
        require('./config/methods')(self),
        require('./config/cellTemplates')(self),
        require('./config/routing'),
        options
    );


    /**
     * Warn about debug mode if it's on
     */
    if (this.debug) {
        console.warn('DEBUG MODE ON ');
        //$.jStorage.flush();
    }
};
