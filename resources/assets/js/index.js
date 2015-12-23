//get jApp
var jApp = require('./jApp/jApp.class');
global.jApp = new jApp();

// get jUtility
global.jUtility = require('./jUtility/jUtility.class');

// get jInput
global.jInput = require('./jInput/jInput.class');

// get jForm
global.jForm = require('./jForm/jForm.class');

// get jGrid
global.jGrid = require('./jGrid/jGrid.class');

// test form
global.editFrm = {
      model : 'Group',
      table : 'groups',
      pkey : 'id',
      tableFriendly : 'Group',
      atts : { method : 'PATCH' },
    };
