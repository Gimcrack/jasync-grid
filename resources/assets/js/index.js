// prereqs
const jquery = require('jquery');
if ( ! window.$ || ! window.jQuery ) {
    window.$ = window.jQuery = jquery;
}

require('bootstrap-sass');
window.bootbox = require('bootbox-jeremyedit');


$.validator = require('@ingenious/jquery-validator');
require('./vendor/jquery.bootpag');

// vendor libraries
require('./vendor/jquery.md5');

require('bootstrap-multiselect-jeremyedit');
require('bootstrap-tokenfield-jeremyedit');

import sleep from 'sleep-promise';
window.sleep = sleep;

import PerfectScrollbar from 'perfect-scrollbar';
window.PerfectScrollbar = PerfectScrollbar;

import Noty from 'noty';
import '../../../node_modules/noty/src/noty.scss';
import '../../../node_modules/noty/src/themes/relax.scss';
window.Noty = Noty;


import JApp from './jApp/jApp.class';
import jUtility from './jUtility/jUtility.class';
import jInput from './jInput/jInput.class';
import jForm from './jForm/jForm.class';
import jGrid from './jGrid/jGrid.class';

// functions
require('./prebuild/functions');


/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

let api_token = document.head.querySelector('meta[name="token"]');

if (api_token) {
    window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + api_token.content;
}


window.jApp = new JApp();
window.jUtility = jUtility;
window.jInput = jInput;
window.jForm = jForm;
window.jGrid = jGrid;

// test form
window.editFrm = {
    model: 'Group',
    table: 'groups',
    pkey: 'id',
    tableFriendly: 'Group',
    atts: {method: 'PATCH'},
};
