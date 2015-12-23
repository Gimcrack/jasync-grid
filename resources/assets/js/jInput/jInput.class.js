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

module.exports = function( options ) {

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
	 * Method definitions
	 * @type {Object}
	 */
	this.fn = {

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
			// 	self.DOM.$inpt = self.DOM.$prnt.find( '[name=' + oAtts.name + ']' );
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
    	oAtts = self.options.atts || {};

      return self.fn; // for chaining methods
    }, // end fn

		/**
		 * Resolve the input name
		 * @return {[type]} [description]
		 */
		resolveInputName : function() {
			if ( self.fn.isMultiple() ) {
				oAtts.name = oAtts.name.replace('[]','') + '[]';
			}
		}, // end fn

		/**
		 * Does the input accept multiple values
		 * @return {[type]} [description]
		 */
		isMultiple : function() {
			return ( !!oAtts.multiple || oAtts.multiple === 'multiple' );
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

      // check if the type is array
      //if (params.type == 'array') return self.fn.processArrayField(params, target);

      inpt = new jInput( { atts : params, form: self.form } );
      self.oInpts[ params.name ] = inpt;
      target.append( inpt.fn.handle() );
      if (params.readonly === 'readonly') self.readonlyFields.push(params.name);

    }, // end fn

		/**
     * Process array field from parameters
     * @method function
     * @param  {[type]} params [description]
     * @param  {[type]} target [description]
     * @return {[type]}        [description]
     */
    processArrayField : function( params ) {
      var $container = $('<div/>', { class : 'array-field-container alert alert-info' }).data('colparams', params),
          $table = $('<table/>', { class : '' } ),
          hidNames = [],
					masterSelect = params.fields.shift(),
					inpt;

			self.arrayField = true;

			// populate the hidden field with the names of the pivot inputs
      _.each( params.fields, function(o) {
				if (!!o.name) {
					o['data-name'] = o.name;
					hidNames.push(o.name.replace('[]',''));
				}
      });

			// add a row with the master select
			inpt = new jInput( { atts : masterSelect, form: self.form } );
      self.oInpts[ masterSelect.name ] = inpt;
      $container.append( inpt.fn.handle() );

			// append the inputs
      // if (!!params.min) {
      //   for ( var ii = +params.min-1; ii >= 0; ii--  ) {
      //     $table.append( jUtility.jForm().fn.populateFieldRow( params, ii ) );
      //   }
      // } else {
      //   $table.append( jUtility.jForm().fn.populateFieldRow( params ) );
      // }

			// add the table to the container
      $container.append($table);



      var hid = {
        name : params.name + '_extra_columns',
        type : 'hidden',
        value : hidNames.join()
      };

      var oHid = new jInput({ atts : hid } );
      $container.append( oHid.fn.handle() );

			$container.perfectScrollbar();

			return $container;
    }, // end fn

		getAtts : function( ) {
			var gblAtts = self.globalAtts;
			var stdAtts = self.allowedAtts[ self.type ];
			var allowedAttributes = _.union(stdAtts,gblAtts);

			//console.log( 'allowed attributes ' + oAtts.name );
			//console.log( allowedAttributes );

			var filteredAtts = _.pick( oAtts, function( value, key) {
				if ( 	typeof value === 'undefined' ||
						typeof value === 'object' ||
						!value ||
						value == '__OFF__' ||
						value == '__off__' ||
							( _.indexOf( allowedAttributes, key ) === -1 && key.indexOf('data-') === -1 )
				) {
					//console.log(key + ' not allowed for ' + oAtts.name);
					return false;
				} else {
					//console.log(key + ' allowed for ' + oAtts.name);
					return true;
				}
			});
			//console.log(filteredAtts);
			return filteredAtts;
		},

		hide : function() {
			if (!!self.DOM.$prnt.hide) {
				self.DOM.$prnt.hide();
			}
			return self.fn;
		},

		show : function() {
			if ( oAtts.type !== 'hidden' ) {
				self.DOM.$prnt.show();
			}
			return self.fn;
		},

		disable : function() {
			if (oAtts.type !== 'hidden') {
				self.DOM.$inpt.prop('disabled',true);
				self.DOM.$inpt.addClass('disabled');
			}
			return self.fn;
		},

		enable : function() {
			if (!!self.DOM.$inpt.prop) {
				self.DOM.$inpt.prop('disabled',false);
				self.DOM.$inpt.removeClass('disabled');
			}
			return self.fn;
		},

		setTTL : function(ttl) {
			self.store.setTTL( ttl );
		}, //end fn

		/**
		 * Initialize the select options
		 * @param  {[type]} refresh [description]
		 * @return {[type]}         [description]
		 */
		initSelectOptions : function(refresh) {

			//console.log('Initializing Select Options');
			//console.log(oAtts);

			self.refreshAfterLoadingOptions = (!!refresh) ? true : false;

			// local data
			if ( !!oAtts._optionssource && oAtts._optionssource.indexOf('|') !== -1 ) {
				jApp.log(' - local options data - ');
				self.options.extData = false;
				oAtts._options = oAtts._optionssource.split('|');
				oAtts._labels = ( !!oAtts._labelssource ) ?
					oAtts._labelssource.split('|') :
					oAtts._optionssource.split('|');
				self.fn.buildOptions();
			}
			// external data
			else if ( !!oAtts._optionssource && oAtts._optionssource.indexOf('.') !== -1 ) {
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

			type = type || oAtts.type;

			tmp = oAtts._labelssource.split('.');
			self.model = model = tmp[0]; // db table that contains option/label pairs
			lbl = tmp[1]; // db column that contains labels
			opt = oAtts._optionssource.split('.')[1];
			//where = ( !!oAtts._optionsFilter && !!oAtts._optionsFilter.length ) ? oAtts._optionsFilter : '1=1';

			switch (type) {
				case 'select' :
					return '/selopts/_' + model + '_' + opt + '_' + lbl;

				default :
					return '/tokenopts/_' + model + '_' + opt + '_' + lbl;
			}

		}, // end fn

		getModel : function() {
			var tmp = oAtts._optionssource.split('.');
			return tmp[0];
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
		},

		buildOptions : function( data ) {
			// load JSON data if applicable
			if (!!data) {
				self.JSON = data;
			}

			if (oAtts.type === 'select') {
				self.fn.populateSelectOptions();
			} else {
				self.fn.populateTokensOptions();
			}

		},

		populateTokensOptions : function() {
			jApp.log('--- Building TokenField Input ---');
			jApp.log(self.JSON);

			self.DOM.$inpt.data( 'tokenFieldSource', _.pluck( self.JSON, 'name' ) );
		}, //end fn

		populateSelectOptions : function() {

			// grab the external data if applicable
			if (self.options.extData ) {
				oAtts._labels = _.pluck(self.JSON,'label');
				oAtts._options = _.pluck(self.JSON,'option');

				if (self.options.cache) {
					self.store.set( 'selectOptions_' + self.options.atts.name, JSON.stringify(self.JSON) );
				}
			}

			// hide if empty options
			if ( ( !oAtts._options || !oAtts._options.length ) && !!self.options.hideIfNoOptions ) {
				//console.log('Hiding the element because there are no options ' + oAtts.name)
				return self.fn.disable().hide();
			}
			// else {
			// 	self.fn.enable().show();
			// }

			// remove all options
			console.log( self.DOM );
			self.DOM.$inpt.find('option').remove();

			// append first option if applicable
			if (!!oAtts._firstlabel) {
				var firstOption = (!!oAtts._firstoption) ? oAtts._firstoption : '';
				self.DOM.$inpt.append(
					$('<option/>', { value : firstOption }).html( oAtts._firstlabel )
				);
			}

			// iterate over the label/value pairs and build the options
			_.each( oAtts._options, function( v, k ) {
				self.DOM.$inpt.append(
					// determine if the current value is currently selected
					( _.indexOf( oAtts.value, v ) !== -1 || ( !!self.$().attr('data-value') &&  _.indexOf( self.$().attr('data-value').split('|'), v ) !== -1 )) ?
						$('<option/>', { value : v, 'selected' : 'selected' }).html( oAtts._labels[k] ) :
						$('<option/>', { value : (!!v) ? v : '' }).html( oAtts._labels[k] )
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

		attr : function( key, value ) {
			if (typeof key === 'object') {
				//console.log( 'Setting the attrs' );
				//console.log(key);
				_.each( key, function( v, k ) {
					oAtts[k] = v;
				});
				//console.log(oAtts);
				self.fn.refresh();
			} else if (!!value) {
				self.options.atts[key] = value;
				self.fn.refresh();
			} else {
				return oAtts[key];
			}
		},

		val : function( value ) {

			if (!!value) {
				if (typeof value !== 'object') {
					if (oAtts.name == '_labelssource' || oAtts.name == '_optionssource') {
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

		refresh : function() {
			_.each( self.fn.getAtts(), function(v, k) {
				if ( k !== 'type' ) { // cannot refresh type
					self.DOM.$inpt.attr(k,v);
				}
			});

			self.DOM.$inpt.val( oAtts.value );
		},

		render : function() {
			return self.DOM.$prnt.prop('outerHTML');
		},

		handle : function() {
			return self.DOM.$prnt;
		},

		multiselectDestroy : function() {
			self.$().multiselect('destroy');
		}, // end fn

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
					console.log('building the form: ' + key);
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

		/**
		 * Multiselect handler
		 * @return {[type]} [description]
		 */
		multiselect : function() {
			self.$().multiselect( self.options.bsmsDefaults ).multiselect('refresh');
			self.fn.multiselectExtraButtons();
			return self;
		}, // end fn

		/**
     * Populate and array field with the form data
     * @return {[type]} [description]
     */
    populateArrayFormData : function( oInpt, data ) {
      self.fn.arrayRemoveAllRows( oInpt.$() );
      jApp.log('------Array Data------' );
      jApp.log(data);

      // iterate through the data rows and populate the form
      _.each( data, function( obj ) {

        // create a row in the array field table
        jApp.log('--------Adding Row To The Array ---------');
        jApp.log( oInpt.$() );
        self.fn.arrayAddRowFromContainer( oInpt.$(), obj );

      });

      // boot the form
      jUtility.formBootup();

    }, // end fn

		/**
     * Add row to array field from container
     * @param  {[type]} $container [description]
     * @return {[type]}            [description]
     */
    arrayAddRowFromContainer : function( $container, data ) {
      var $table = $container.find('table'),
          params = $container.data('colparams'),
          $tr_new = jUtility.oCurrentForm().fn.populateFieldRow( params, 1, data || {} ),
          $btn_add = $table.find('.btn-array-add').eq(0).detach();

      $table.find('.btn-array-add,.no-row-filler').remove();

      $table.append($tr_new);

			if (!$table.find('.btn-array-add').length) {
					$table.find('tr:last-child').find('td:last-child,th:last-child').append($btn_add);
			}

    }, // end fn

    /**
     * Add row to an array input
     * @method function
     * @return {[type]} [description]
     */
    arrayAddRow : function( ) {
      var $container = $(this).closest('.array-field-container'),
          $table = $(this).closest('table'),
          params = $container.data('colparams'),
          $tr_new = jUtility.oCurrentForm().fn.populateFieldRow( params );

      if (!!params.max && +$table.find('tr').length-1 === params.max) {
        return jUtility.msg.warning('This field requires at most ' + params.max + ' selections.');
      }

      $table.find('.btn-array-add,.no-row-filler').remove();

      $table.append($tr_new);

      // rename inputs so they all have unique names
      // $table.find('tr').each( function( i, elm ) {
      //   $(elm).find(':input').each( function(ii, ee) {
      //     $(ee).attr('name', $(ee).attr('data-name') + '_' + i)
      //   });
      // });

      jUtility.formBootup();
    }, // end fn

    /**
     * Remove a row from an array input table
     * @return {[type]} [description]
     */
    arrayRemoveRow : function() {
      var $container = $(this).closest('.array-field-container'),
          $table = $(this).closest('table'),
          $tr = $(this).closest('tr'),
          params = $container.data('colparams'),
          $btn_add = $table.find('.btn-array-add').detach();


      if (!!params.min && +$table.find('tr').length-1 === params.min) {
        $table.find('tr:last-child').find('td:last-child').append($btn_add);
        return jUtility.msg.warning('This field requires at least ' + params.min + ' selections.');
      }

      $tr.remove();

      // rename inputs so they all have unique names
      // $table.find('tr').each( function( i, elm ) {
      //   $(elm).find(':input').each( function(ii, ee) {
      //     $(ee).attr('name', $(ee).attr('data-name') + '_' + i)
      //   });
      // });
      if  ( !$table.find('tr').length ) {
        $table.append( '<tr class="no-row-filler"><td></td></tr>' );
      }

      $table.find('tr:last-child').find('td:last-child,th:last-child').append($btn_add);
    }, // end fn

    /**
     * [function description]
     * @param  {[type]} $inpt [description]
     * @return {[type]}       [description]
     */
    arrayRemoveAllRows : function($container) {
      var $table = $container.find('table'),
          $btn_add = $table.find('.btn-array-add').detach();

      $table.empty();
      $table.append( '<tr class="no-row-filler"><td></td></tr>' );
      $table.find('tr:last-child').find('td:last-child,th:last-child').append($btn_add);
    }, // end fn


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
      self.type = oAtts.type;

			// get the input name
			self.fn.resolveInputName();

			// set readonly flag on the input
			self.readonly = (oAtts.readonly === 'readonly') ? true : false;

			// set the form
			self.form = runopts.form || oAtts.form || {};

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
      if (self.type === 'hidden' || !oAtts._label ) return false;

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
	}; // end fns

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
        .html(oAtts.value)
        .wrap(self.options.wrap );
    }, // end fn

    /**
     * create an array input
     * @method function
     * @return {[type]} [description]
     */
    array : function() {
      return self.fn.processArrayField( oAtts );
    }, //  end fn

    /**
     * create a label element
     * @method function
     * @return {[type]} [description]
     */
    label : function() {
      return $('<label/>', { 'for' : oAtts.id } )
              .html( oAtts._label )
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
  //   oAtts._options = [];
  //   oAtts._labels = [];
  //   // determine if we are loading options from an external source (db)
  //   if ( typeof oAtts._labelssource !== 'undefined' && oAtts._labelssource.indexOf('.') !== -1 ) {
  //     self.options.extData = true;
  //     self.fn.getExtOptions();
  //   } else { // options are loaded locally
  //     if ( typeof oAtts._labelssource !== 'undefined' && typeof oAtts._optionssource !== 'undefined') {
  //       oAtts._options = oAtts._optionssource.split('|');
  //       oAtts._labels = ( !!oAtts._labelssource ) ?
  //         oAtts._labelssource.split('|') :
  //         oAtts._optionssource.split('|');
  //     }
  //   }
  //
  //   // shift off the first elements of the labels and options arrays and create the first radio element
  //   var firstOpt = (typeof oAtts._options[0] !== 'undefined') ? oAtts._options[0] : false;
  //   var firstLbl = (typeof oAtts._labels[0] !== 'undefined') ?  oAtts._labels[0] : false;
  //
  //   // set the attributes of the first element
  //   var atts = _.extend( self.fn.getAtts(), {
  //     'value' : firstOpt,
  //     'checked' : ( _.indexOf( oAtts.value, firstOpt ) !== -1 ) ? 'checked' : '',
  //     'id' : oAtts.name + '_0'
  //   });
  //
  //   // add the first element
  //   self.DOM.$inpt = $('<label/>', {'class' : 'form-control'})
  //             .append( $('<input/>', atts) )
  //             .append( $('<div/>', { style : 'width:200px' }).html( firstLbl ) )
  //             .wrap('<div class="radio-group"></div>');
  //
  //   //iterate through the remaining options
  //   _.each( oAtts._options, function( v, k ) {
  //     if ( k>0 ) { // skip the first one
  //       var lbl = oAtts._labels[k];
  //       var atts = _.extend( self.fn.getAtts(), {
  //         'value' : v,
  //         'checked' : ( _.indexOf( oAtts.value, v ) !== -1 ) ? 'checked' : false,
  //         'id' : oAtts.name + '_' + k,
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
