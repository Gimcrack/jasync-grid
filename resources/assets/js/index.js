// prereqs
import jquery from 'jquery';
import JApp from './jApp/jApp.class';
import jUtility from './jUtility/jUtility.class';
import jInput from './jInput/jInput.class';
import jForm from './jForm/jForm.class';

import jGrid from './jGrid/jGrid.class';

if ( ! window.$ || ! window.jQuery ) {
    window.$ = window.jQuery = jquery;
}
$.validator = require('@ingenious/jquery-validator');
$.fn.bootpag = require('./vendor/jquery.bootpag');

// vendor libraries
require('./vendor/jquery.md5');
require('noty');
require('perfect-scrollbar/jquery');
require('bootstrap-multiselect-jeremyedit');

// functions
require('./prebuild/functions');


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
