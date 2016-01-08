/**
 * multiselect.js
 *
 * Multiselect Methods
 */

;module.exports = function(self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function() { return self.options.atts };

  return {

    /**
     * Multiselect handler
     * @return {[type]} [description]
     */
    multiselect : function( options ) {
      if (!!self.$().data('no-bsms')) return false;
      
      self.$().multiselect( options || self.options.bsmsDefaults ).multiselect('refresh');
      self.fn.multiselectExtraButtons();
      return self;
    }, // end fn

    /**
     * Destroy the multiselect
     * @method function
     * @return {[type]} [description]
     */
    multiselectDestroy : function() {
      self.$().multiselect('destroy');
    }, // end fn

    /**
     * Refresh the multiselect
     * @method function
     * @return {[type]} [description]
     */
    multiselectRefresh : function() {
      if ( !self.options.extData ) { return false; }

      $(this).prop('disabled',true).find('i').addClass('fa-spin');

      self.$().attr('data-tmpVal', self.$().val() || '' )
          .val('')
          .multiselect('refresh');
          //.multiselect('disable');

      self.fn.getExtOptions(true, function() {
        jUtility.$currentForm()
           .find('.btn.btn-refresh').prop('disabled',false)
             .find('i').removeClass('fa-spin').end()
           .end()
          .find('[data-tmpVal]').each( function(i,elm) {
            $(elm).val( $(elm).attr('data-tmpVal') )
              .multiselect('enable')
              .multiselect('refresh')
              .multiselect('rebuild')
              .removeAttr('data-tmpVal');

              //.data('jInput').fn.multiselect();
            });
      });
    }, // end fn

    /**
     * Add button and refresh button for multiselect elements
     * @return {[type]} [description]
     */
    multiselectExtraButtons : function() {
      if ( !self.options.extData ) return self;

      // make an add button, if the model is not the same as the current form
      if ( self.fn.getModel() !== jApp.opts().model ) {

        jApp.log('----------------------INPUT-------------------');
        jApp.log(self);

        var model = self.fn.getModel(), frmDef = {
          table : jApp.model2table( model ),
          model : model,
          pkey : 'id',
          tableFriendly : model,
          atts : { method : 'POST'}
        }, key = 'new' + model + 'Frm';

        if ( !jUtility.isFormExists( key ) ) {
          jApp.log('building the form: ' + key);
          jUtility.DOM.buildForm( frmDef, key, 'newOtherFrm', model );
          jUtility.processFormBindings();
        }

        var $btnAdd = $('<button/>', {
          type : 'button',
          class : 'btn btn-primary btn-add',
          title : 'Create New ' + model
        }).html('New ' + model + ' <i class="fa fa-fw fa-external-link"></i>')
          .off('click.custom').on('click.custom', function() {

            jUtility.actionHelper( 'new' + model + 'Frm' );

          });

        self.DOM.$prnt.find('.btn-group .btn-add').remove().end()
        .find('.btn-group').prepend( $btnAdd );
      }

      var $btnRefresh = $('<button/>', {
        type : 'button',
        class : 'btn btn-primary btn-refresh',
        title : 'Refresh Options'
      }).html('<i class="fa fa-fw fa-refresh"></i>')
        .off('click.custom').on('click.custom', self.fn.multiselectRefresh);

      self.DOM.$prnt.find('.btn-group .btn-refresh').remove().end()
          .find('.btn-group').prepend( $btnRefresh );

      return self;
    }, // end fn

  }
}
