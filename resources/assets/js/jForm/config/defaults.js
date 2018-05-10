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
    atts: {						// form html attributes
        'method': 'POST',
        'action': '',
        'role': 'form',
        'onSubmit': 'return',
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
