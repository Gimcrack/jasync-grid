/**
 * options.js
 *
 * Options methods
 */
;module.exports = {

  /**
   * Build the options
   * @method function
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  buildOptions : function( data ) {
    // load JSON data if applicable
    if (!!data) {
      self.JSON = data;
    }

    if (self.options.atts.type === 'select') {
      self.fn.populateSelectOptions();
    } else {
      self.fn.populateTokensOptions();
    }

  }, // end fn

  /**
   * Retrieve external options
   * @param  {[type]}   force    [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  getExtOptions : function( force, callback ) {
    console.log('getting external options');
    self.options.extData = true;

    force = ( typeof force !== 'undefined' ) ? force : false;

    // use the copy in storage if available;
    if (!force && self.options.cache && !!self.store.get( 'selectOptions_' + self.options.atts.name, false )) {
      //console.log('using local copy of options');
      return self.fn.buildOptions( JSON.parse( self.store.get( 'selectOptions_' + self.options.atts.name ) ) );
    }

    var url, data;

    url = self.fn.getExtUrl();
    data = {};

    self.buildOptionsCallback = callback;

    //console.log('executing request for external options');
    $.getJSON( url, data, self.fn.buildOptions )
     .always( function() {
        if (self.options.cache) {
          self.store.setTTL( 'selectOptions_' + self.options.atts.name, 1000*60*self.options.ttl ); // expire in 10 mins.
        }
     });
  }, // end fn

  /**
   * Populate Tokens Options
   * @method function
   * @return {[type]} [description]
   */
  populateTokensOptions : function() {
    jApp.log('--- Building TokenField Input ---');
    jApp.log(self.JSON);

    self.DOM.$inpt.data( 'tokenFieldSource', _.pluck( self.JSON, 'name' ) );
  }, //end fn

  /**
   * Populate Select Options
   * @method function
   * @return {[type]} [description]
   */
  populateSelectOptions : function() {

    // grab the external data if applicable
    if (self.options.extData ) {
      self.options.atts._labels = _.pluck(self.JSON,'label');
      self.options.atts._options = _.pluck(self.JSON,'option');

      if (self.options.cache) {
        self.store.set( 'selectOptions_' + self.options.atts.name, JSON.stringify(self.JSON) );
      }
    }

    // hide if empty options
    if ( ( !self.options.atts._options || !self.options.atts._options.length ) && !!self.options.hideIfNoOptions ) {
      //console.log('Hiding the element because there are no options ' + self.options.atts.name)
      return self.fn.disable().hide();
    }
    // else {
    // 	self.fn.enable().show();
    // }

    // remove all options
    console.log( self.DOM );
    self.DOM.$inpt.find('option').remove();

    // append first option if applicable
    if (!!self.options.atts._firstlabel) {
      var firstOption = (!!self.options.atts._firstoption) ? self.options.atts._firstoption : '';
      self.DOM.$inpt.append(
        $('<option/>', { value : firstOption }).html( self.options.atts._firstlabel )
      );
    }

    // iterate over the label/value pairs and build the options
    _.each( self.options.atts._options, function( v, k ) {
      self.DOM.$inpt.append(
        // determine if the current value is currently selected
        ( _.indexOf( self.options.atts.value, v ) !== -1 || ( !!self.$().attr('data-value') &&  _.indexOf( self.$().attr('data-value').split('|'), v ) !== -1 )) ?
          $('<option/>', { value : v, 'selected' : 'selected' }).html( self.options.atts._labels[k] ) :
          $('<option/>', { value : (!!v) ? v : '' }).html( self.options.atts._labels[k] )
      );
    });

    // remove the unneeded data-value attribute
    self.$().removeAttr('data-value');

    // call the callback if applicable
    if (typeof self.buildOptionsCallback === 'function') {
      self.buildOptionsCallback();
      delete self.buildOptionsCallback;
    }

  }, // end fn

  /**
   * Get the model of the options source
   * @method function
   * @return {[type]} [description]
   */
  getModel : function() {
    var tmp = self.options.atts._optionssource.split('.');
    return tmp[0];
  }, // end fn

  /**
   * Initialize the select options
   * @param  {[type]} refresh [description]
   * @return {[type]}         [description]
   */
  initSelectOptions : function(refresh) {
    var self = this;
    var obj = obj || 'no obj';
    console.log( obj );
    console.log('Initializing Select Options');

    self.refreshAfterLoadingOptions = (!!refresh) ? true : false;

    // local data
    if ( !!self.options.atts._optionssource && self.options.atts._optionssource.indexOf('|') !== -1 ) {
      jApp.log(' - local options data - ');
      self.options.extData = false;
      self.options.atts._options = self.options.atts._optionssource.split('|');
      self.options.atts._labels = ( !!self.options.atts._labelssource ) ?
        self.options.atts._labelssource.split('|') :
        self.options.atts._optionssource.split('|');
      self.fn.buildOptions();
    }
    // external data
    else if ( !!self.options.atts._optionssource && self.options.atts._optionssource.indexOf('.') !== -1 ) {
      jApp.log(' - external options data -');
      self.options.extData = true;
      //console.log('Getting External Options');
      self.fn.getExtOptions();
    }

  }, // end fn

  /**
   * Get the external url of the options
   * @return {[type]} [description]
   */
  getExtUrl : function( type ) {
    var model, lbl, opt, tmp;

    type = type || self.options.atts.type;

    tmp = self.options.atts._labelssource.split('.');
    self.model = model = tmp[0]; // db table that contains option/label pairs
    lbl = tmp[1]; // db column that contains labels
    opt = self.options.atts._optionssource.split('.')[1];
    //where = ( !!self.options.atts._optionsFilter && !!self.options.atts._optionsFilter.length ) ? self.options.atts._optionsFilter : '1=1';

    switch (type) {
      case 'select' :
        return jApp.routing.get( 'selectOptions', model, opt, lbl );

      default :
        return jApp.routing.get( 'tokenOptions', model, opt, lbl );
    }

  }, // end fn

}
