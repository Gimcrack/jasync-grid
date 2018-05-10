/**
 * defaults.js
 *
 * Default app configuration
 */

;module.exports = {

    /**
     * Debug mode, set to false to suppress messages
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
    colparams: require('./colparams'),

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
    openForms: [],

};
