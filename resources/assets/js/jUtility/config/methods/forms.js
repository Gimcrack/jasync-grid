/**
 * forms.js
 *
 * methods dealing with forms
 */

;module.exports = {
  /**
   * Form boot up function
   * @method function
   * @return {[type]} [description]
   */
  formBootup : function() {
    jUtility.$currentFormWrapper()
      //reset validation stuff
      .find('.has-error').removeClass('has-error').end()
      .find('.has-success').removeClass('has-success').end()
      .find('.help-block').hide().end()
      .find('.form-control-feedback').hide().end()

      //multiselects
      .find('select:not(.no-bsms)').addClass('bsms').end()
      .find('.bsms').each( function(i,elm) {
        $(elm).data('jInput').fn.multiselect().fn.multiselectRefresh();
      } ).end()
      .find('[data-tokens]').each( function(){
        if ( !!$(this).data('tokenFieldSource') ) {
            $(this).tokenfield({
              autocomplete : {
                source : $(this).data('tokenFieldSource'),
                delay : 300
              },
              showAutoCompleteOnFocus : false,
              tokens : $(this).val() || []
            });
            $(this).data('tokenFieldSource',null);
        }
        // var val = $(this).data('value').split('|') || []
        // $(this).tokenfield( 'setTokens', val );

      }).end()

      .find('[_linkedElmID]').change();

  }, //end fn

  /**
   * Refresh and rebuild the current form
   * @method function
   * @return {[type]} [description]
   */
  refreshCurrentForm : function() {
    jApp.aG().store.flush();
    jUtility.oCurrentForm().fn.getColParams();
  }, // end fn

  /**
   * Clear the current form
   * @method function
   * @return {[type]} [description]
   */
  resetCurrentForm : function() {
    try {
      jUtility.$currentForm().clearForm();
      jUtility.$currentForm().find(':input:not("[type=button]"):not("[type=submit]"):not("[type=reset]"):not("[type=radio]"):not("[type=checkbox]")')
      .each( function(i,elm) {
        if ( !!$(elm).attr('data-static') ) { return false; }

        //$(elm).data("DateTimePicker").remove();
        $(elm).val('');
        if ( $(elm).hasClass('bsms') ) {
          $(elm).data('jInput').fn.multiselect();
          $(elm).multiselect('refresh');
        }
      });
    } catch(e) {
      console.warn(e);
      return false;
    }
  }, // end fn

  /**
   * Maximize the current form
   * @method function
   * @return {[type]} [description]
   */
  maximizeCurrentForm : function() {
    try {

      if ( jApp.openForms.length ) {
        jApp.openForms.last().wrapper.removeClass('max')
          .find('button').prop('disabled',true);
      }

      jApp.openForms.push({
        wrapper : jUtility.$currentFormWrapper().addClass('max'),
        obj : jUtility.oCurrentForm(),
        $ : jUtility.$currentForm(),
        action : jApp.aG().action,
        model : jUtility.oCurrentForm().model
      });
    } catch(e) {
      console.warn(e);
      return false;
    }
  }, // end fn

  /**
   * Close the current form
   * @method function
   * @return {[type]} [description]
   */
  closeCurrentForm : function() {
    try {
      var oTgt = jApp.openForms.pop();

      jApp.aG().action = ( jApp.openForms.length ) ?
        jApp.openForms.last().action : '';

      jUtility.msg.clear();

      oTgt.wrapper.removeClass('max')
        .find('.formContainer').css('height','');
      oTgt.$.clearForm();

      if (!jApp.openForms.length) {
        jUtility.turnOffOverlays();
      } else {

        jApp.openForms.last().wrapper
          .addClass('max')
          .find('button').prop('disabled',false).end()
          .find('.btn-refresh').trigger('click');
      }

    } catch(ignore) {}
  }, // end fn

  /**
   * Load Form Definitions
   * @method function
   * @return {[type]} [description]
   */
  loadFormDefinitions : function() {
    jApp.opts().formDefs = $.extend(true, {}, require('../forms'), jApp.opts().formDefs);
  }, //end fn

  /**
   * Save the current form and leave open
   * @method function
   * @return {[type]} [description]
   */
  saveCurrentForm : function() {
    jApp.opts().closeOnSave = false;
    jUtility.submitCurrentForm( $(this) );
  }, // end fn

  /**
   * Save the current form and close
   * @method function
   * @return {[type]} [description]
   */
  saveCurrentFormAndClose : function() {

    jApp.opts().closeOnSave = true;
    jUtility.submitCurrentForm( $(this) );
    //jUtility.toggleRowMenu;
  }, // end fn

  /**
   * Submit the current form
   * @method function
   * @return {[type]} [description]
   */
  submitCurrentForm : function( $btn ) {
    var requestOptions = {
      url : jUtility.getCurrentFormAction(),
      data : jUtility.oCurrentForm().fn.getFormData(),
      success : jUtility.callback.submitCurrentForm,
      //fail : console.warn,
      always : function() {
        jUtility.toggleButton($btn);
      }
    };

    jUtility.msg.clear();

    if (!!jUtility.$currentForm()) {
      var oValidate = new $.validator( jUtility.$currentForm() );
      if (oValidate.errorState) {
        return false;
      }
    }

    // turn off the button to avoid multiple clicks;
    jUtility.toggleButton($btn);

    jUtility.postJSON( requestOptions );

  }, // end fn

  /**
   * Set focus on the current form
   * @method function
   * @return {[type]} [description]
   */
  setCurrentFormFocus : function() {
    jUtility.$currentFormWrapper().find(":input:not([type='hidden']):not([type='button'])").eq(0).focus();
  }, // end fn

  /**
   * Get the current form row data for the current row
   * @method function
   * @return {[type]} [description]
   */
  getCurrentFormRowData : function() {
    if (jApp.aG().action === 'new') return false;
    var url = jUtility.getCurrentRowDataUrl();

    jUtility.oCurrentForm().fn.getRowData(url, jUtility.callback.updateDOMFromRowData);
  }, //end fn

  /**
   * Get the action of the current form
   * @method function
   * @return {[type]} [description]
   */
  getCurrentFormAction : function() {
    switch (jApp.aG().action) {
      case 'edit' :
      case 'delete' :
        return jApp.routing.get( jApp.opts().model, jUtility.getCurrentRowId() );

      case 'withSelectedDelete' :
        return jApp.routing.get( jApps.opts().model );

      case 'withSelectedUpdate' :
        return jApp.routing.get( 'massUpdate', jApp.opts().model );

      case 'resetPassword' :
        return jApp.routing.get( 'resetPassword/' + jUtility.getCurrentRowId() );

      default :
        return jApp.routing.get( jUtility.oCurrentForm().options.model ); //jApp.opts().table;
    }
  }, // end fn

  /**
   * Build all grid forms
   * @method function
   * @return {[type]} [description]
   */
  buildForms : function() {
    jUtility.loadFormDefinitions();

    _.each( jApp.opts().formDefs, function( o, key ) {
      jUtility.DOM.buildForm( o, key );
    });

  },

  /**
   * Is a form container maximized
   * @method function
   * @return {[type]} [description]
   */
  isFormOpen : function() {
    return !!jApp.aG().$().find('.div-form-panel-wrapper.max').length;
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   oCurrentForm
   *
   *  returns the currently active form
   *  or false if the current action is
   *  a non-standard action.
   *
   *  @return jForm (obj) || false
   *
   **  **  **  **  **  **  **  **  **  **/
  oCurrentForm : function() {
    var key;

    switch ( jApp.aG().action ) {
      case 'new' :
      case 'New' :
        return jApp.aG().forms.oNewFrm

      case 'edit' :
      case 'Edit' :
        return jApp.aG().forms.oEditFrm
    }

    if (!! (key = _.findKey( jApp.aG().forms, function(o, key) {
      if (key.indexOf('o') !== 0) return false;
      return key.toLowerCase().indexOf( jApp.aG().action.toString().toLowerCase() ) !== -1;
    }) )) {
      return jApp.aG().forms[key];
    } else {
      console.warn( 'There is no valid form associated with the current action' );
      return false;
    }


  },

  /**  **  **  **  **  **  **  **  **  **
   *   $currentForm
   *
   *  returns the currently active form
   *  jQuery handle or false if the current
   *  action is a non-standard action.
   *
   *  @return jQuery (obj) || false
   *
   **  **  **  **  **  **  **  **  **  **/
  $currentForm : function() {
    try {
      return jUtility.oCurrentForm().$();
    } catch(e) {
      console.warn('No current form object found');
      return false;
    }
  },


  /**  **  **  **  **  **  **  **  **  **
   *   $currentFormWrapper
   *
   *  returns the currently active form
   *  wrapper jQuery handle or false
   *  if the current action is a non-
   *  standard action.
   *
   *  @return jQuery (obj) || false
   *
   **  **  **  **  **  **  **  **  **  **/
  $currentFormWrapper : function() {
    try {
      return jUtility.$currentForm().closest('.div-form-panel-wrapper');
    } catch(e) {
      console.warn('No current form wrapper found');
      return false;
    }
  },

  /**  **  **  **  **  **  **  **  **  **
   *   setupFormContainer
   *
   *  When a rowMenu button is clicked,
   *  this function sets up the
   *  corresponding div
   **  **  **  **  **  **  **  **  **  **/
  setupFormContainer : function() {
    jUtility.DOM.overlay(2,'on');
    jApp.aG().hideOverlayOnError = false;
    jUtility.resetCurrentForm();
    jUtility.maximizeCurrentForm();
    jUtility.setCurrentFormFocus();
    jUtility.formBootup();
    jUtility.getCurrentFormRowData();
  }, // end fn

  /**
   * Prepare form data
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  prepareFormData : function( data ) {
    var fd = new FormData();

    _.each( data, function(value, key) {
      fd.append(key, value);
    });

    return fd;

  }, // end fn
}
