/**
 * forms.js
 * @type {Object}
 *
 * Standard form definitions
 */
;module.exports = {

  editFrm : {
    model : jApp.opts().model,
    table : jApp.opts().table,
    pkey : jApp.opts().pkey,
    tableFriendly : jApp.opts().tableFriendly,
    atts : { method : 'PATCH' },
    disabledElements : jApp.opts().disabledFrmElements,
  },

  newFrm : {
    model : jApp.opts().model,
    table : jApp.opts().table,
    pkey : jApp.opts().pkey,
    tableFriendly : jApp.opts().tableFriendly,
    atts : { method : 'POST' },
    disabledElements : jApp.opts().disabledFrmElements
  },

  colParamFrm : {
    table : 'col_params',
    pkey : 'colparam_id',
    tableFriendly : 'Column Parameters',
    btns : [],
    atts : {
      name : 'frm_element_editor',
    },
    fieldset : {
      'legend' : '3. Edit Column Parameters',
    }
  }
}
