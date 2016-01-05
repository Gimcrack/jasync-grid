/**
 * toggles.js
 *
 * Toggle methods
 */

;module.exports = {
  /**
   * Hide the input
   * @method function
   * @return {[type]} [description]
   */
  hide : function() {
    if (!!self.DOM.$prnt.hide) {
      self.DOM.$prnt.hide();
    }
    return self.fn;
  },

  /**
   * Show the input
   * @method function
   * @return {[type]} [description]
   */
  show : function() {
    if ( oAtts.type !== 'hidden' ) {
      self.DOM.$prnt.show();
    }
    return self.fn;
  },

  /**
   * Disable the input
   * @method function
   * @return {[type]} [description]
   */
  disable : function() {
    if (oAtts.type !== 'hidden') {
      self.DOM.$inpt.prop('disabled',true);
      self.DOM.$inpt.addClass('disabled');
    }
    return self.fn;
  },

  /**
   * Enable the input
   * @method function
   * @return {[type]} [description]
   */
  enable : function() {
    if (!!self.DOM.$inpt.prop) {
      self.DOM.$inpt.prop('disabled',false);
      self.DOM.$inpt.removeClass('disabled');
    }
    return self.fn;
  },
}
