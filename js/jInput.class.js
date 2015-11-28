/* jshint ignore:start */
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
// javascript closure
/* jshint ignore:end */
;(function( window, $) {

	'use strict';

	var jInput = function( options ) {
		/**  **  **  **  **  **  **  **  **  **
 		 *   VARS
 		 **  **  **  **  **  **  **  **  **  **/

		// alias this
		var self = this;
		this.store = $.jStorage;
		this.readonly = false;

		/**  **  **  **  **  **  **  **  **  **
		 *   DEFAULT OPTIONS
		 *
		 *  Set the default options for the
		 *  instance here. Any values specified
		 *  at runtime will overwrite these
		 *  values.
		 **  **  **  **  **  **  **  **  **  **/

		this.options = {
			// html attributes
			atts : {
				'type' : 'text',
				'class' : 'form-control'
			},

			// DOM presentation options
			parent : $('<div/>', { 'class' : 'form_element has-feedback'}),

			// wrap - wrap the label and input elements with something e.g. <div></div>
			wrap : false,

			// separator - separate the label and input elements
			separator : true,

			// external data for options, etc.
			extData : false,

			// TTL for external data (mins)
			ttl : 10,

			// cache options locally
			cache : true,

			// hide if no options
			hideIfNoOptions : false,

			// multiselect defaults
			bsmsDefaults : {									// bootstrap multiselect default options
				//buttonContainer : '<div class="btn-group" />',
				enableCaseInsensitiveFiltering: true,
				includeSelectAllOption: true,
				maxHeight: 185,
				numberDisplayed: 1,
				dropUp: true
			},

		}; // end options

		// set the runtime values for the options
		$.extend(true,this.options, { atts : { 'id' : this.options.atts.name } }, options);

		this.readonly = (this.options.atts.readonly === 'readonly') ? true : false;

		// alias to attributes object
		var oAtts = self.options.atts;

		oAtts.name = (Number(oAtts.multiple) || oAtts.multiple === true || oAtts.multiple === 'multiple') ? oAtts.name.replace('[]','') + '[]' : oAtts.name;

		/**  **  **  **  **  **  **  **  **  **
 		 *   ALLOWABLE ATTRIBUTES BY INPUT TYPE
 		 **  **  **  **  **  **  **  **  **  **/
		this.allowedAtts = {
			date : 				['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
			datetime : 			['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
			'datetime-local' :	['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
			month : 			['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
			time : 				['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
			week : 				['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],

			url : 				['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],
			text : 				['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],
			tokens :			['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],
			search : 			['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],

			number : 			['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','placeholder','readOnly','required','step','type','value'],
			range : 			['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','step','type','value'],

			password : 			['autocomplete','autofocus','defaultValue','disabled','form','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],

			button : 			['autofocus','defaultValue','disabled','form','name','type','value'],
			reset : 			['autofocus','defaultValue','disabled','form','name','type','value'],
			submit : 			['autofocus','defaultValue','disabled','form','name','type','value'],

			radio : 			['autofocus','checked','defaultChecked','defaultValue','disabled','form','name','required','type','value'],
			checkbox : 			['autofocus','checked','defaultChecked','defaultValue','disabled','form','indeterminate','name','required','type','value'],

			file : 				['accept','autofocus','defaultValue','disabled','files','form','multiple','name','required','type','value'],

			hidden : 			['defaultValue','form','name','type','value','readonly'],

			image : 			['alt','autofocus','defaultValue','disabled','form','height','name','src','type','value','width'],

			select : 			['disabled','form','multiple','name','size','type','value','_linkedElmID','_linkedElmFilterCol','_linkedElmLabels','_linkedElmOptions'],

			textarea : 			['autofocus','cols','defaultValue','disabled','form','maxLength','name','placeholder','readOnly','required','rows','type','value','wrap'],

			color : 			['autocomplete','autofocus','defaultValue','disabled','form','list','name','type','value'],

			email : 			['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','multiple','name','pattern','placeholder','readOnly','required','size','type','value'],
			tel : 				['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','pattern','placeholder','readOnly','required','size','type','value'],
		}; // end allowable attributes

		/**  **  **  **  **  **  **  **  **  **
 		 *   ALLOWABLE COLPARAMS BY INPUT TYPE
 		 **  **  **  **  **  **  **  **  **  **/
		this.allowedColParams = {
			radio : 			['_labelssource','_optionssource','_optionsfilter'],
			select : 			['_firstoption','_firstlabel','_labelssource','_optionssource','_optionsfilter'],
		}; // end allowable attributes

		/**  **  **  **  **  **  **  **  **  **
 		 *   DISALLOWABLE COLPARAMS BY INPUT TYPE
 		 **  **  **  **  **  **  **  **  **  **/
		this.disallowedColParams = {
			hidden : 			['_label','onClick','onChange'],
		}; // end allowable attributes

		/**  **  **  **  **  **  **  **  **  **
 		 *   GLOBAL HTML ATTRIBUTES TO ALLOW
 		 **  **  **  **  **  **  **  **  **  **/
		this.globalAtts = [
			'accesskey', 'class', 'contenteditable', 'contextmenu', 'dir',
			'draggable', 'dropzone', 'hidden', 'id', 'lang', 'lang',
			'spellcheck', 'style', 'tabindex', 'title', 'translate',
			'data-validType', 'readonly', 'required', 'onClick', 'onChange', 'form'
		];

		this.globalColParams = [
			'_enabled', '_label', 'data-fieldset', 'data-ordering', 'data-validType-template', 'type'
		];

		/**  **  **  **  **  **  **  **  **  **
 		 *   DOM ELEMENTS
 		 *
 		 *  These placeholders get replaced
 		 *  by their jQuery handles
 		 **  **  **  **  **  **  **  **  **  **/
		this.DOM = {
			$prnt : false,
			$inpt : false,
			$lbl  : false,
		};

		/**
		 * [oInpts description]
		 * @type {Array}
		 */
		this.oInpts = [];

		/**
		 * Is this an array field
		 * @type {Boolean}
		 */
		this.arrayField = false;

		this.$ = function() {
			return self.DOM.$inpt;
		};

		/**  **  **  **  **  **  **  **  **  **
 		 *   FUNCTION DEFS
 		 **  **  **  **  **  **  **  **  **  **/
		this.fn = {


			_init : function() {
				var $br = (!!self.options.separator) ? $('<br/>') : false;
				self.type = oAtts.type;

				//set the parent element
				self.DOM.$prnt = self.options.parent;

				//create the label
				if ( self.type !== 'hidden' ) {
					self.DOM.$lbl = $('<label/>', { 'for' : oAtts.id } )
								  .html( oAtts._label )
								  .wrap( self.options.wrap );
				}


				//create the input element
				switch ( self.type ) {
					case 'textarea' :
						self.DOM.$inpt = $('<textarea/>', self.fn.getAtts() ).wrap( self.options.wrap );
					break;

					case 'select' :
						self.DOM.$inpt = $('<select/>', self.fn.getAtts() ).wrap( self.options.wrap );
						self.fn.initSelectOptions();
					break;

					case 'tokens' :
						jApp.log('Tokens Attributes')
						jApp.log($.extend(true, self.fn.getAtts(), { type : 'text', 'data-tokens' : true, 'data-url' : self.fn.getExtUrl('tokens')} ));
						self.DOM.$inpt = $('<input/>', $.extend(true, self.fn.getAtts(), { type : 'text', 'data-tokens' : true, 'data-url' : self.fn.getExtUrl('tokens')} ) );
						self.fn.getExtOptions();
					break;

					case 'radio' :
					case 'checkbox' :
						oAtts._options = [];
						oAtts._labels = [];
						// determine if we are loading options from an external source (db)
						if ( typeof oAtts._labelssource !== 'undefined' && oAtts._labelssource.indexOf('.') !== -1 ) {
							self.options.extData = true;
							self.fn.getExtOptions();
						} else { // options are loaded locally
							if ( typeof oAtts._labelssource !== 'undefined' && typeof oAtts._optionssource !== 'undefined') {
								oAtts._options = oAtts._optionssource.split('|');
								oAtts._labels = ( !!oAtts._labelssource ) ?
									oAtts._labelssource.split('|') :
									oAtts._optionssource.split('|');
							}
						}


						// shift off the first elements of the labels and options arrays and create the first radio element
						var firstOpt = (typeof oAtts._options[0] !== 'undefined') ? oAtts._options[0] : false;
						var firstLbl = (typeof oAtts._labels[0] !== 'undefined') ?  oAtts._labels[0] : false;

						// set the attributes of the first element
						var atts = _.extend( self.fn.getAtts(), {
							'value' : firstOpt,
							'checked' : ( _.indexOf( oAtts.value, firstOpt ) !== -1 ) ? 'checked' : '',
							'id' : oAtts.name + '_0'
						});

						// add the first element
						self.DOM.$inpt = $('<label/>', {'class' : 'form-control'})
											.append( $('<input/>', atts) )
											.append( $('<div/>', { style : 'width:200px' }).html( firstLbl ) )
											.wrap('<div class="radio-group"></div>');

						//iterate through the remaining options
						_.each( oAtts._options, function( v, k ) {
							if ( k>0 ) { // skip the first one
								var lbl = oAtts._labels[k];
								var atts = _.extend( self.fn.getAtts(), {
									'value' : v,
									'checked' : ( _.indexOf( oAtts.value, v ) !== -1 ) ? 'checked' : false,
									'id' : oAtts.name + '_' + k,
								});

								// add the radio options
								self.DOM.$inpt
								.after( $('<label/>', {'class' : 'form-control'})
								  .append( $('<input/>', atts) )
								  .append( $('<div/>', { style : 'width:200px' } ).html( lbl ) )
								);
							}
						}); // end each

					break;

					case 'button' :
						self.DOM.$inpt = $('<button/>', self.fn.getAtts() ).html(oAtts.value).wrap(self.options.wrap );
					break;

					case 'array' :
						self.DOM.$inpt = self.fn.processArrayField( oAtts );
					break;

					default :
						self.DOM.$inpt = $('<input/>', self.fn.getAtts() ).wrap( self.options.wrap );
					break;
				}

				// assign a reference to the jInput object to the DOM element
				self.DOM.$inpt.data('jInput',self);

				//bind change handler to keep this object updated
				self.DOM.$inpt.off('change.jInput').on('change.jInput', function() {
					oAtts.value = $(this).val();
				});

				//append the label, if applicable
				if (!!self.DOM.$lbl && self.type !== 'hidden' && oAtts._label != null) {
					self.DOM.$prnt
					 .append(  ( !!self.DOM.$lbl.parents().length ) ? self.DOM.$lbl.parents().last() : self.DOM.$lbl );
				}

				//append the separator, if applicable
				if (!!self.options.separator && self.type !== 'hidden' && oAtts._label != null) {
					self.DOM.$prnt.append( $br.clone() );
				}

				//append the input
				self.DOM.$prnt.append( ( !!self.DOM.$inpt.parents().length ) ? self.DOM.$inpt.parents().last() : self.DOM.$inpt );

				//append the feedback icon container and help block
				self.DOM.$prnt.append( $('<i/>', { class : 'form-control-feedback glyphicon', style : 'display:none'}) );
				self.DOM.$prnt.append( $('<small/>', { class : 'help-block', style : 'display:none' }));

				//update reference to $inpt for radio groups
				if (self.type === 'radio') {
					self.DOM.$inpt = self.DOM.$prnt.find( '[name=' + oAtts.name + ']' );
				}

				//place in DOM
				//self.DOM.$prnt.appendTo('body');


			}, // end fn

			/**
       * Process form field from parameters
       * @method function
       * @param  {[type]} params [description]
       * @param  {[type]} target [description]
       * @return {[type]}        [description]
       */
      processField : function( params, target ) {
        var inpt;

        jApp.log('B. Processing Field')
        jApp.log(params);

        // check if the type is array
        //if (params.type == 'array') return self.fn.processArrayField(params, target);

        inpt = new jInput( { atts : params} );
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
            $table = $('<table/>', { class : 'table' } ),
            //$label = $('<label/>').html( params._label ),
            $tr, $th, $td, inpt, hidNames = [];

				// Set the arrayField flag
				self.arrayField = true;

        _.each( params.fields, function(o) {
          o['data-name'] = o.name;
          hidNames.push(o.name.replace('[]',''));
        });

        console.log(hidNames);

        // append the inputs
        if (params.min != null ) {
          for ( var ii = +params.min-1; ii >= 0; ii--  ) {
            $table.append( self.fn.populateFieldRow( params, ii ) );
          }
        } else {
          $table.append( self.fn.populateFieldRow( params ) );
        }

        // append the table to the container
        $container.append($table);

        var hid = {
          name : params.name + '_extra_columns',
          type : 'hidden',
          value : hidNames.join()
        }

        var oHid = new jInput({ atts : hid } );
        $container.append( oHid.fn.handle() );

				return $container;
      }, // end fn

      /**
       * Populate a row with the field inputs
       * @method function
       * @param  {[type]} params [description]
       * @return {[type]}        [description]
       */
      populateFieldRow : function(params, index) {
        var $td,
            $btn_add = $('<button/>', {type : 'button', class : 'btn btn-primary btn-array-add'}).html( '<i class="fa fa-fw fa-plus"></i>' ),
            $btn_remove = $('<button/>', {type : 'button', class : 'btn btn-danger btn-array-remove'}).html( '<i class="fa fa-fw fa-trash-o"></i>' ),
            index = (typeof index === 'undefined') ? 0 : index;

        return $('<tr/>').append(
          _.map( params.fields, function( oo ) {
              var $td = $('<td/>');
							oo['data-pivot'] = _.pluck( 'name', params.fields );
							oo['data-array-input'] = true;
              self.fn.processField( oo, $td );
              return $td;
          })

        ).append(
          [
              $('<td/>').append([$btn_remove, (index === 0) ? $btn_add : null])
          ]
        );
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
				self.DOM.$prnt.hide();
				return self.fn;
			},

			show : function() {
				self.DOM.$prnt.show();
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
				self.DOM.$inpt.prop('disabled',false);
				self.DOM.$inpt.removeClass('disabled');
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
				if ( oAtts._optionssource != null && oAtts._optionssource.indexOf('|') !== -1 ) {
					jApp.log(' - local options data - ');
					self.options.extData = false;
					oAtts._options = oAtts._optionssource.split('|');
					oAtts._labels = ( !!oAtts._labelssource ) ?
						oAtts._labelssource.split('|') :
						oAtts._optionssource.split('|');
					self.fn.buildOptions();
				}
				// external data
				else if ( oAtts._optionssource != null && oAtts._optionssource.indexOf('.') !== -1 ) {
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

				type = (type != null) ? type : oAtts.type;

				tmp = oAtts._labelssource.split('.');
				self.model = model = tmp[0]; // db table that contains option/label pairs
				lbl = tmp[1]; // db column that contains labels
				opt = oAtts._optionssource.split('.')[1];
				//where = ( !!oAtts._optionsFilter && !!oAtts._optionsFilter.length ) ? oAtts._optionsFilter : '1=1';

				switch (type) {
					case 'select' :
						return "/selopts/_" + model + "_" + opt + "_" + lbl;
					break;

					default :
						return "/tokenopts/_" + model + "_" + opt + "_" + lbl;
					break;
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
				if (data != null) {
					self.JSON = data;
				}

				if (oAtts.type === 'select') {
					self.fn.populateSelectOptions()
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
				} else {
					self.fn.enable().show();
				}

				// remove all options
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
						return $.map( self.DOM.$prnt.find(':checked'), function(elm, i) {
							return $(elm).val();
						});
					break;

					default :
						return self.DOM.$inpt.val();
					break;
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
						.multiselect('refresh')
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
								.removeAttr('data-tmpVal')

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

					var frmDef = {
						table : jApp.model2table( self.fn.getModel() ),
						pkey : 'id',
						tableFriendly : self.fn.getModel(),
						atts : { method : 'POST'}
					}, key = 'new' + self.fn.getModel() + 'Frm';

					if ( !jUtility.isFormExists( key ) ) {
						console.log('building the form: ' + key);
						jUtility.DOM.buildForm( frmDef, key, 'newOtherFrm', self.fn.getModel() );
						jUtility.processFormBindings();
					}

					var $btnAdd = $('<button/>', {
						type : 'button',
						class : 'btn btn-primary btn-add',
						title : 'Add ' + self.fn.getModel()
					}).html('<i class="fa fa-fw fa-plus"></i> ' + self.fn.getModel() + ' <i class="fa fa-fw fa-external-link"></i>')
						.off('click.custom').on('click.custom', function() {

							jUtility.actionHelper( 'new' + self.fn.getModel() + 'Frm' );

						});

					self.DOM.$prnt.find('.btn-group .btn-add').remove().end()
					.find('.btn-group').append( $btnAdd );
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
			}
		};

		// initialize
		this.fn._init();

	}; // end jInput declaration

	window.jInput = jInput; // add to global scope

})( window, $);
