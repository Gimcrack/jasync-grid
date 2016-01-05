/**
 * factory.js
 *
 * jInput factory methods
 */

;module.exports = function(self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function() { return self.options.atts };

  return {
    /**
     * Main builder method
     * @method function
     * @return {[type]} [description]
     */
    _build : function() {
      var $inpt = ( typeof self.factory[ self.type ] === 'function' ) ?
            self.factory[ self.type ]() :
            self.factory.input();

      return $inpt.data('jInput',self)
                  .off('change.jInput')
                  .on('change.jInput', function() {
                    $(this).data('jInput').options.atts.value = $(this).val();
                  });

    }, // end fn

    /**
     * Run post-build subroutines
     * @method function
     * @return {[type]} [description]
     */
    _postbuild : function() {
      jApp.log('--Testing self object--')
      jApp.log(self);
      if (typeof self.factory._callback[ self.type ] === 'function' ) {
        self.factory._callback[ self.type ]();
      }
    }, // end fn

    // callback definitions
    _callback : {
      select : self.fn.initSelectOptions,
    }, // end factory callbacks

    /**
     * create a generic input element
     * @method function
     * @return {[type]} [description]
     */
    input : function() {
      return $('<input/>', self.fn.getAtts() )
              .wrap( self.options.wrap );

    }, // end fn

    /**
     * create a select element
     * @method function
     * @return {[type]} [description]
     */
    select : function() {
      return $('<select/>', self.fn.getAtts() )
                .wrap( self.options.wrap );
    }, // end fn

    /**
     * create a tokens element
     * @method function
     * @return {[type]} [description]
     */
    tokens : function() {
      // get the external options
      self.fn.getExtOptions();

      var atts = $.extend(true,
        self.fn.getAtts(),
        {
          type : 'text',
          'data-tokens' : true,
          'data-url' : self.fn.getExtUrl('tokens')
        }
      );

      return $('<input/>', atts );
    }, // end fn

    /**
     * create a textarea element
     * @method function
     * @return {[type]} [description]
     */
    textarea : function() {
      return $('<textarea/>', self.fn.getAtts() )
                .wrap( self.options.wrap )

    }, // end fn

    /**
     * create a button element
     * @method function
     * @return {[type]} [description]
     */
    button : function() {
      return $('<button/>', self.fn.getAtts() )
        .html(self.options.atts.value)
        .wrap(self.options.wrap );
    }, // end fn

    /**
     * create an array input
     * @method function
     * @return {[type]} [description]
     */
    array : function() {
      return self.fn.processArrayField( self.options.atts );
    }, //  end fn

    /**
     * create a label element
     * @method function
     * @return {[type]} [description]
     */
    label : function() {
      return $('<label/>', { 'for' : self.options.atts.id } )
              .html( self.options.atts._label )
              .wrap( self.options.wrap )

    }, // end fn

    /**
     * create a feedback icon
     * @method function
     * @return {[type]} [description]
     */
    feedbackIcon : function() {
      return $('<i/>', { class : 'form-control-feedback glyphicon', style : 'display:none'});
    }, // end fn

    /**
     * Create a helptext block
     * @method function
     * @return {[type]} [description]
     */
    helpTextBlock : function() {
      return $('<small/>', { class : 'help-block', style : 'display:none' });
    }, // end fn
  }


}
