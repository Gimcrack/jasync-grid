/**
 * formBindings.js
 * @type {Object}
 *
 * Event bindings related to forms
 */
;module.exports = {
  // the bind function will assume the scope is relative to the current form
  // unless the key is found in the global scope
  // boot functions will be automatically called at runtime
  "[data-validType='Phone Number']" : {
    keyup : function() {
      $(this).val( jUtility.formatPhone( $(this).val() ) );
    }
  },

  "[data-validType='Zip Code']" : {
    keyup : function() {
      $(this).val( jUtility.formatZip( $(this).val() ) );
    }
  },

  "[data-validType='SSN']" : {
    keyup : function() {
      var This = $(this);
      setTimeout( function() {
        This.val( jUtility.formatSSN( jApp.aG().val() ) );
      }, 200);
    }
  },

  "[data-validType='color']" : {
    keyup : function() {
      $(this).css('background-color',$(this).val());
    }
  },

  "[data-validType='Number']" : {
    change : function() {
      $(this).val( jUtility.formatNumber( $(this).val() ) );
    }
  },

  "[data-validType='Integer']" : {
    change : function() {
      $(this).val( jUtility.formatInteger( $(this).val() ) );
    }
  },

  "[data-validType='US State']" : {
    change : function() {
      $(this).val( jUtility.formatUC( $(this).val() ) );
    }
  },

  "button.close, .btn-cancel" : {
    click : jUtility.exitCurrentForm
  },

  ".btn-go" : {
    click : jUtility.saveCurrentFormAndClose
  },

  ".btn-save" : {
    click : jUtility.saveCurrentForm
  },

  ".btn-reset" : {
    click : jUtility.resetCurrentForm
  },

  ".btn-refreshForm" : {
    click : jUtility.refreshCurrentForm
  },

  ".btn-array-add" : {
    click : jUtility.jInput().fn.arrayAddRow
  },

  ".btn-array-remove" : {
    click : jUtility.jInput().fn.arrayRemoveRow
  },

  "input" : {
    keyup : function(e) {
      e.preventDefault();
      if (e.which === 13) {
        if( jUtility.isConfirmed() ) {
          jUtility.saveCurrentFormAndClose();
        }
      } else if (e.which === 27) {
        jUtility.closeCurrentForm();
      }
    }
  },

  "#confirmation" : {
    keyup : function() {
      if( $(this).val().toString().toLowerCase() === 'yes' ) {
        jUtility.$currentForm().find('.btn-go').removeClass('disabled');
      } else {
        jUtility.$currentForm().find('.btn-go').addClass('disabled');
      }
    }
  },

  "[_linkedElmID]" : {
    change : function() {
      var This = $(this),
        $col = This.attr('_linkedElmFilterCol'),
        $id	 = This.val(),
        $labels = This.attr('_linkedElmLabels'),
        $options = This.attr('_linkedElmOptions'),
        oFrm = jUtility.oCurrentForm(),
        oElm = oFrm.fn.getElmById( This.attr('_linkedElmID') );


      // set data to always expire;
      oElm.fn.setTTL(-1);
      oElm.jApp.opts().hideIfNoOptions = true;
      oElm.jApp.opts().cache = false;

      oElm.fn.attr( {
        '_optionsFilter' : $col + '=' + $id,
        '_firstoption' : 0,
        '_firstlabel' : '-Other-',
        '_labelsSource' : $labels,
        '_optionsSource' : $options
        } );

      oElm.fn.initSelectOptions(true);

    },
  }
}
