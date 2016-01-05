/**  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **
 *
 *  jInput.class.js - Custom Form Input JS class
 *
 *  Defines the properties and methods of the
 *  custom input class.
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *
 *  Created: 		4/20/15
 *  Last Updated: 	4/20/15
 *
 *  Prereqs: 	jQuery, underscore.js, jStorage.js
 *
 *  Changelog:
 *   4-20-15	Created the jInput class
 *
 *   4-30-15	Added the feedback icon container and help block container
 */
;'use strict';

var $ = require('jQuery'),
    _ = require('underscore');

require('perfect-scrollbar/jquery')($);
require('./vendor/bootstrap-multiselect')($);

module.exports = function( options, obj ) {

		var

			/**
			 * Alias of this
			 * @type Object
			 */
			self = this,

			/**
			 * Shortcut to this.options.atts
			 */
			oAtts,

			/**
			 * Input/label separator jQuery object
			 */
			$separator,

			/**
			 * Run time options
			 * @type Object
			 */
			runopts = options || {};

  /**
   * Initialize object properties
   * @type {Object}
   */
  self.options = {
    atts : {}
  }

  /**
   * Initialize this
   * @type {Object}
   */
  this.fn = {}

	/**
	 * Method definitions
	 * @type {Object}
	 */
	$.extend( true, this.fn,
    require('./config/methods/options'),
    require('./config/methods/arrayInputs'),
    require('./config/methods/multiselect'),
    require('./config/methods/toggles'),
    {

		/**
		 * Initialize the object
		 * @method function
		 * @return {[type]} [description]
		 */
		_init : function() {

			//handle the label
			self.fn.labelHandler();

			//create and append the input element
			self.DOM.$inpt = self.factory._build();

			// run any postbuild subroutines
			self.factory._postbuild();

			//append the input
			self.fn.appendInput();

			// //update reference to $inpt for radio groups
			// if (self.type === 'radio') {
			// 	self.DOM.$inpt = self.DOM.$prnt.find( '[name=' + self.options.atts.name + ']' );
			// }

		}, // end fn

    /**
     * Set the instance options
     * @method function
     * @return {[type]} [description]
     */
    setOptions : function( options ) {
			// insulate against options being null
			options = options || {};
			// set the runtime values for the options
      var atts = options.atts || {};

    	$.extend(true,
        self.options,   // target
        self.defaults,  // default options
        {               // additional computed defaults
          atts : {
              'id' : atts.name || null
          }
        },
        options || {}   // runtime options
      );

    	// alias to attributes object
    	//self.options.atts = self.options.atts || {};

      return self.fn; // for chaining methods
    }, // end fn

		/**
		 * Resolve the input name
		 * @return {[type]} [description]
		 */
		resolveInputName : function() {
			if ( self.fn.isMultiple() ) {
				self.options.atts.name = self.options.atts.name.replace('[]','') + '[]';
			}
		}, // end fn

		/**
		 * Does the input accept multiple values
		 * @return {[type]} [description]
		 */
		isMultiple : function() {
			return ( !!self.options.atts.multiple || self.options.atts.multiple === 'multiple' );
		},

		/**
     * Process form field from parameters
     * @method function
     * @param  {[type]} params [description]
     * @param  {[type]} target [description]
     * @return {[type]}        [description]
     */
    processField : function( params, target ) {
      var inpt;

      jApp.log('B. Processing Field');
      jApp.log(params);
      jApp.log(obj);


      // check if the type is array
      //if (params.type == 'array') return self.fn.processArrayField(params, target);

      inpt = new jInput( { atts : params, form: self.form }, self );
      self.oInpts[ params.name ] = inpt;
      target.append( inpt.fn.handle() );
      if (params.readonly === 'readonly') self.readonlyFields.push(params.name);

    }, // end fn

    /**
     * Get input attributes
     * @method function
     * @return {[type]} [description]
     */
		getAtts : function( ) {
			var gblAtts = self.globalAtts;
			var stdAtts = self.allowedAtts[ self.type ];
			var allowedAttributes = _.union(stdAtts,gblAtts);

			//console.log( 'allowed attributes ' + self.options.atts.name );
			//console.log( allowedAttributes );

			var filteredAtts = _.pick( self.options.atts, function( value, key) {
				if ( 	typeof value === 'undefined' ||
						typeof value === 'object' ||
						!value ||
						value == '__OFF__' ||
						value == '__off__' ||
						( _.indexOf( allowedAttributes, key ) === -1 && key.indexOf('data-') === -1 )
				) {
					//console.log(key + ' not allowed for ' + self.options.atts.name);
					return false;
				} else {
					//console.log(key + ' allowed for ' + self.options.atts.name);
					return true;
				}
			});
			//console.log(filteredAtts);
			return filteredAtts;
		}, // end fn


    /**
     * Set time to live on the store value
     * @method function
     * @param  {[type]} ttl [description]
     * @return {[type]}     [description]
     */
		setTTL : function(ttl) {
			self.store.setTTL( ttl );
		}, //end fn

    /**
     * Attribute handler function
     * @method function
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
		attr : function( key, value ) {
			if (typeof key === 'object') {
				//console.log( 'Setting the attrs' );
				//console.log(key);
				_.each( key, function( v, k ) {
					self.options.atts[k] = v;
				});
				//console.log(self.options.atts);
				self.fn.refresh();
			} else if (!!value) {
				self.options.atts[key] = value;
				self.fn.refresh();
			} else {
				return self.options.atts[key];
			}
		},

    /**
     * Value handler function
     * @method function
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
		val : function( value ) {

			if (!!value) {
				if (typeof value !== 'object') {
					if (self.options.atts.name == '_labelssource' || self.options.atts.name == '_optionssource') {
						value = value.replace(/\,/gi,'|');
					}
					self.$().attr('data-value',value);
					return self.fn.attr('value',[value]);
				} else {
					self.$().attr('data-value',value.join('|'));
					return self.fn.attr('value',value);
				}
			}

			switch( self.type ) {
				case 'radio' :
				case 'checkbox' :
					return $.map( self.DOM.$prnt.find(':checked'), function(i, elm) {
						return $(elm).val();
					});

				default :
					return self.DOM.$inpt.val();
			}
		},

    /**
     * Refresh the attributes of the element
     * @method function
     * @return {[type]} [description]
     */
		refresh : function() {
			_.each( self.fn.getAtts(), function(v, k) {
				if ( k !== 'type' ) { // cannot refresh type
					self.DOM.$inpt.attr(k,v);
				}
			});

			self.DOM.$inpt.val( self.options.atts.value );
		},

    /**
     * Render the html of the element
     * @method function
     * @return {[type]} [description]
     */
		render : function() {
			return self.DOM.$prnt.prop('outerHTML');
		},

    /**
     * jQuery reference to the parent of the element
     * @method function
     * @return {[type]} [description]
     */
		handle : function() {
			return self.DOM.$prnt;
		},

    /**
     * pre-initialize the object
     * @method function
     * @return {[type]} [description]
     */
    _preInit : function() {
      self.store = jApp.store;
    	self.readonly = false;

    	// Get the default options and config
    	self.options  = {};
    	self.defaults = require('./config/defaults');

    	// allowable html attributes
    	self.globalAtts = require('./config/globalAttributes');
    	self.allowedAtts = require('./config/allowedAttributes');

    	// allowable column parameters
    	self.globalColParams = require('./config/globalColParams');
    	self.allowedColParams = require('./config/allowedColParams');
    	self.disallowedColParams = require('./config/disallowedColParams');

    	/**  **  **  **  **  **  **  **  **  **
    		 *   DOM ELEMENTS
    		 *
    		 *  These placeholders get replaced
    		 *  by their jQuery handles
    		 **  **  **  **  **  **  **  **  **  **/
    	self.DOM = {
    		$prnt : false,
    		$inpt : false,
    		$lbl  : false,
    	};

    	/**
    	 * [oInpts description]
    	 * @type {Array}
    	 */
    	self.oInpts = [];

    	/**
    	 * Is self an array field
    	 * @type {Boolean}
    	 */
    	self.arrayField = false;

      /**
       * Shortcut function to the $inpt
       * @method function
       * @return {[type]} [description]
       */
    	self.$ = function() {
    		return self.DOM.$inpt;
    	};

      // set the instance options
      self.fn.setOptions( options );

      // set the separator
      $separator = (!!self.options.separator) ? $('<br/>') : false;

      // set the type
      self.type = self.options.atts.type;

			// get the input name
			self.fn.resolveInputName();

			// set readonly flag on the input
			self.readonly = (self.options.atts.readonly === 'readonly') ? true : false;

			// set the form
			self.form = runopts.form || self.options.atts.form || {};

      //set the parent element
			self.DOM.$prnt = self.options.parent.clone();

      // initialize
      self.fn._init();

    }, // end fn

    /**
     * Build a label for the input
     * @method function
     * @return {[type]} [description]
     */
    labelHandler : function() {
      if (self.type === 'hidden' || !self.options.atts._label ) return false;

      self.DOM.$lbl = self.factory.label();

      // append the label to the DOM
      self.DOM.$prnt
        .append(  ( !!self.DOM.$lbl.parents().length ) ?
                    self.DOM.$lbl.parents().last() :
                    self.DOM.$lbl
        );

      //append the separator, if applicable
			if (!!self.options.separator) {
				self.DOM.$prnt.append( $separator.clone() );
			}

    }, // end fn

    /**
     * A jquery handle to the input
     * @method function
     * @return {[type]} [description]
     */
    inputHandle : function() {
      if ( self.DOM.$inpt.parents().length ) {
        return self.DOM.$inpt.parents().last();
      }
      return self.DOM.$inpt;
    }, // end fn

    /**
     * Append the input, feedback icon
     * container and help block
     * to the $prnt object
     *
     * @method function
     * @return {[type]} [description]
     */
    appendInput : function() {
			self.DOM.$prnt.append( [
        self.fn.inputHandle(),
        self.factory.feedbackIcon(),
        self.factory.helpTextBlock()
      ]);

    }, // end fn

    /**
     * Append the $prnt object to the specified target
     * @method function
     * @param  {[type]} $target [description]
     * @return {[type]}         [description]
     */
    appendTo : function($target) {
      self.DOM.$prnt.appendTo( $target );
    }, // end fn
	}); // end fns

  /**
   * Builders for html elements
   * @type {Object}
   */
  this.factory = {
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
      if (typeof self.factory._callback[ self.type ] === 'function' ) {
        self.factory._callback[ self.type ]();
      }
    }, // end fn

    // callback definitions
    _callback : {
      select : function() {
        self.fn.initSelectOptions()
      },
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

	// initialize
	this.fn._preInit(options || {});


  // case 'radio' :
  // case 'checkbox' :
  //   self.options.atts._options = [];
  //   self.options.atts._labels = [];
  //   // determine if we are loading options from an external source (db)
  //   if ( typeof self.options.atts._labelssource !== 'undefined' && self.options.atts._labelssource.indexOf('.') !== -1 ) {
  //     self.options.extData = true;
  //     self.fn.getExtOptions();
  //   } else { // options are loaded locally
  //     if ( typeof self.options.atts._labelssource !== 'undefined' && typeof self.options.atts._optionssource !== 'undefined') {
  //       self.options.atts._options = self.options.atts._optionssource.split('|');
  //       self.options.atts._labels = ( !!self.options.atts._labelssource ) ?
  //         self.options.atts._labelssource.split('|') :
  //         self.options.atts._optionssource.split('|');
  //     }
  //   }
  //
  //   // shift off the first elements of the labels and options arrays and create the first radio element
  //   var firstOpt = (typeof self.options.atts._options[0] !== 'undefined') ? self.options.atts._options[0] : false;
  //   var firstLbl = (typeof self.options.atts._labels[0] !== 'undefined') ?  self.options.atts._labels[0] : false;
  //
  //   // set the attributes of the first element
  //   var atts = _.extend( self.fn.getAtts(), {
  //     'value' : firstOpt,
  //     'checked' : ( _.indexOf( self.options.atts.value, firstOpt ) !== -1 ) ? 'checked' : '',
  //     'id' : self.options.atts.name + '_0'
  //   });
  //
  //   // add the first element
  //   self.DOM.$inpt = $('<label/>', {'class' : 'form-control'})
  //             .append( $('<input/>', atts) )
  //             .append( $('<div/>', { style : 'width:200px' }).html( firstLbl ) )
  //             .wrap('<div class="radio-group"></div>');
  //
  //   //iterate through the remaining options
  //   _.each( self.options.atts._options, function( v, k ) {
  //     if ( k>0 ) { // skip the first one
  //       var lbl = self.options.atts._labels[k];
  //       var atts = _.extend( self.fn.getAtts(), {
  //         'value' : v,
  //         'checked' : ( _.indexOf( self.options.atts.value, v ) !== -1 ) ? 'checked' : false,
  //         'id' : self.options.atts.name + '_' + k,
  //       });
  //
  //       // add the radio options
  //       self.DOM.$inpt
  //       .after( $('<label/>', {'class' : 'form-control'})
  //         .append( $('<input/>', atts) )
  //         .append( $('<div/>', { style : 'width:200px' } ).html( lbl ) )
  //       );
  //     }
  //   }); // end each
  //
  // break;

}; // end fn
