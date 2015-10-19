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
				buttonContainer : '<div class="btn-group" />',
				enableFiltering: true,
				includeSelectAllOption: true,
				maxHeight: 185,
				numberDisplayed: 1,
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
						self.DOM.$inpt = $('<input/>', $.extend(true, self.fn.getAtts(), { type : 'text', 'data-tokens' : true, 'data-url' : self.fn.getExtUrl('tokens')} ) );//.tokenInput( self.fn.getExtUrl('tokens') )
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

					default :
						self.DOM.$inpt = $('<input/>', self.fn.getAtts() ).wrap( self.options.wrap );
					break;
				}

				//bind change handler to keep this object updated
				self.DOM.$inpt.off('change.jInput').on('change.jInput', function() {
					oAtts.value = $(this).val();
				});

				//append the label, if applicable
				if (!!self.DOM.$lbl && self.type !== 'hidden') {
					self.DOM.$prnt
					 .append(  ( !!self.DOM.$lbl.parents().length ) ? self.DOM.$lbl.parents().last() : self.DOM.$lbl );
				}

				//append the separator, if applicable
				if (!!self.options.separator && self.type !== 'hidden') {
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

			initSelectOptions : function(refresh) {

				//console.log('Initializing Select Options');
				//console.log(oAtts);

				self.refreshAfterLoadingOptions = (!!refresh) ? true : false;

				// determine if we are loading options from an external source (db)
				if ( typeof oAtts._labelssource !== 'undefined' && oAtts._labelssource.indexOf('.') !== -1 ) {
					self.options.extData = true;
					//console.log('Getting External Options');
					self.fn.getExtOptions();
				} else { // options are loaded locally
					if ( typeof oAtts._labelssource !=='undefined' && typeof oAtts._optionssource !== 'undefined') {
						oAtts._options = oAtts._optionssource.split('|');
						oAtts._labels = ( !!oAtts._labelssource ) ?
							oAtts._labelssource.split('|') :
							oAtts._optionssource.split('|');
						self.fn.buildOptions();
					}
				}
			},

			/**
			 * Get the external url of the options
			 * @return {[type]} [description]
			 */
			getExtUrl : function( type ) {
				var model, lbl, opt, tmp;

				tmp = oAtts._labelssource.split('.');
				model = tmp[0]; // db table that contains option/label pairs
				lbl = tmp[1]; // db column that contains labels
				opt = oAtts._optionssource.split('.')[1];
				//where = ( !!oAtts._optionsFilter && !!oAtts._optionsFilter.length ) ? oAtts._optionsFilter : '1=1';

				switch (type) {
					case 'tokens' :
						return "/tokenopts/_" + model + "_" + opt + "_" + lbl;
					break;

					default :
						return "/selopts/_" + model + "_" + opt + "_" + lbl;
					break;
				}

			}, // end fn

			getExtOptions : function() {
				// use the copy in storage if available;
				if (self.options.cache && !!self.store.get( 'selectOptions_' + self.options.atts.name, false )) {
					//console.log('using local copy of options');
					return self.fn.buildOptions( JSON.parse( self.store.get( 'selectOptions_' + self.options.atts.name ) ) );
				}

				var url, data;

				url = self.fn.getExtUrl();
				data = {};

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
					oAtts._labels = _.pluck(data,'label');
					oAtts._options = _.pluck(data,'option');
					if (self.options.cache) {
						self.store.set( 'selectOptions_' + self.options.atts.name, JSON.stringify(data) );
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

				// refresh the element to update the options
				if (!!self.refreshAfterLoadingOptions) {
					//console.log('refreshing options');
					self.DOM.$inpt
						.multiselect('destroy')
						.multiselect(self.options.bsmsDefaults)
						.multiselect('refresh');
					self.refreshAfterLoadingOptions = false;
				}
			},

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

			multiselect : function() {
				return self.$().multiselect( self.options.bsmsDefaults );
			}
		};

		// initialize
		this.fn._init();

	}; // end jInput declaration

	window.jInput = jInput; // add to global scope

})( window, $);
