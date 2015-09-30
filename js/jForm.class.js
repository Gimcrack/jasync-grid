 /**
  *  jForm.class.js - Custom Form JS class
  *
  *  Defines the properties and methods of the
  *  custom form class.
  *
  *  Jeremy Bloomstrom | jeremy@in.genio.us
  *  Released under the MIT license
  *
  *  Prereqs: 	jQuery, underscore.js, jStorage.js
  */

 // jquery function for clearing a form of all its values
 $.fn.clearForm = function() {
  return this.each(function() {
    if ( !!$(this).prop('disabled') || !!$(this).prop('readonly') ) return false;

	var type = this.type, tag = this.tagName.toLowerCase();
    if (tag == 'form')
      return $(':input',this).clearForm();
    if (type == 'text' || type == 'password' || tag == 'textarea')
      this.value = '';
    else if (type == 'checkbox' || type == 'radio')
      this.checked = false;
    else if (tag == 'select')
       this.selectedIndex = (!!$(this).prop('multiple')) ? -1 : 0;
	$(this).psiblings('.form-control-feedback').removeClass('glyphicon-remove').removeClass('glyphicon-ok').hide();
	$(this).closest('.form_element').removeClass('has-error').removeClass('has-success');
  });
};

// javascript closure
;(function( window, $, jQuery ) {

	'use strict';

	var jForm = function( options ) {
		/**  **  **  **  **  **  **  **  **  **
 		 *   VARS
 		 **  **  **  **  **  **  **  **  **  **/

		// alias this
		var self = this;

		this.$frm = false;
		this.store = $.jStorage;
    this.submitted = false;


		/**  **  **  **  **  **  **  **  **  **
		 *   DEFAULT OPTIONS
		 *
		 *  Set the default options for the
		 *  instance here. Any values specified
		 *  at runtime will overwrite these
		 *  values.
		 **  **  **  **  **  **  **  **  **  **/

		this.options = {
			// form setup
      table : '',
      atts : {						// form html attributes
				'method' : 'POST',
        'action' : '',
				'role' : 'form',
				'onSubmit' : 'return false',
				'name' : false
			},
			hiddenElms : false,
			wrap : '',
			btns : false,
			fieldset : false,
			disabledElements : [],
			/* colParams - 	accept, alt, autocomplete, autofocus, checked, cols,
							disabled, form, formaction, formenctype, formmethod,
							formnovalidate, formtarget, height, id, list, max,
							maxlength, min, multiple, name, pattern, placeholder,
							readonly, required, rows, size, src, step, type, data-validType,
							value, width, wrap, onClick, onChange, class, _labels,
							_options, _firstlabel, _firstoption, _label, _enabled,
							viewName, data-ordering, fieldset, _optionsSource, _labelsSource,
							_optionsFilter, _linkedElmID, _linkedElmOptions,
							_linkedElmLabels, _linkedElmFilterCol
			*/
			colParams : {},
			colParamsAdd : [], // storage container for additional colParams such as from linkTables
			loadExternal : true, // load external colParams e.g. from a db
			ttl : 30, // TTL for external data (mins)
			tableFriendly : '', // friendly name of table e.g. Application
			layout : 'standard' // standard (three-column layout) | single (one-col layout)
		};

		// set the runtime values for the options
		$.extend(true, this.options,options);

    // set up the callback functions
    $.extend(true, this.callback, options.callback);

    // alias for attributes container
		var oAtts = this.options.atts;

		// set default values
		if (!this.options.fieldset) {
			this.options.fieldset = {
				'legend' : self.options.tableFriendly + ' Details',
				'id' : 'fs_details'
			};
		}

		// set the default buttons, if not present
		if (!this.options.btns) {
			this.options.btns = [
				{ 'type' : 'button', 'class' : 'btn btn-success btn-go', 	'id' : 'btn_go', 'value' : 'Go' },
				{ 'type' : 'reset', 'class' : 'btn btn-warning btn-reset', 'id' : 'btn_reset', 'value' : 'Reset' },
				{ 'type' : 'button', 'class' : 'btn btn-danger btn-cancel', 'id' : 'btn_cancel', 'value' : 'Cancel' },
			];
		}

		// set the default name for the form, if not present
		if (!this.options.atts.name) {
			this.options.atts.name = 'frm_edit' + this.options.tableFriendly;
		}

		// set the default hidden elements if not present
		if (!this.options.hiddenElms) {
			// setup the hidden elements
			this.options.hiddenElms = [
				{ atts : { 'type' : 'hidden', 'readonly' : 'readonly', 'name' : '_method', 'value' : options.atts.method, 'data-static' : true } },
			];
		}

		// container for jQuery DOM elements
		this.DOM = {
			$prnt : $('<div/>'),
			$frm : false,
			$fs : false
		};

		this.oInpts = {};
		this.DOM.$Inpts = $('<div/>');
		this.rowData = {};
		this.readonlyFields = [];

		/**  **  **  **  **  **  **  **  **  **
		 *   HTML TEMPLATES
		 *
		 *  Place large html templates here
		 *  as functions. These are rendered with
		 *  the method self.fn.render.
		 *
		 *  Parameters of the form {@ParamName}
		 *  are expanded by the render function
		 **  **  **  **  **  **  **  **  **  **/
		this.html = {

		};// end html templates

		// create shortcut to the form
		this.$ = function() {
			return this.DOM.$frm;
		}

		/**  **  **  **  **  **  **  **  **  **
 		 *   FUNCTION DEFS
 		 **  **  **  **  **  **  **  **  **  **/
		this.fn = {
			_init : function() {
				var inpt, hdn;

				// create the form
				self.DOM.$frm = $('<form/>', oAtts )
					.wrap(self.options.wrap)
					.append(  $('<fieldset/>', self.options.fieldset)
								.append( $('<legend/>').html( self.options.fieldset.legend ) )
								.append( self.DOM.$Inpts )
					)

				// append the form to the parent container
				self.DOM.$prnt.append( ( !!self.DOM.$frm.parents().length ) ?
					  self.DOM.$frm.parents().last() :
					  self.DOM.$frm
				);

				// create and append the hidden elements
				_.each( self.options.hiddenElms, function( o, key )  {
					inpt = new jInput( o );
					self.oInpts[ o.atts.name ] = inpt ;
					self.DOM.$Inpts.append( inpt.fn.handle() );
					if (o.atts.readonly === 'readonly') {
						self.readonlyFields.push( o.atts.name );
					}
				});

				// get the colParams
				if ( !!self.options.loadExternal ) { // get the colparams from an external json source
					self.fn.getColParams();
				} else { // colparams must be specified locally, so process them
					self.fn.processColParams();
					self.fn.processBtns();
				}
			}, // end fn

			handle : function() {
				return self.DOM.$prnt;
			}, // end fn

			$fieldset : function() {
				return self.DOM.$frm.find('fieldset');
			}, //end fn

			getElmById : function(id) {
				id = id.replace('#','');

				return self.oInpts[id];
			},

			render : function(params) {
				var tmp = self.DOM.$prnt.prop('outerHTML');

				if (!!params && !$.isEmptyObject(params)) {
					for (key in params ) {
						ptrn = new RegExp( '\{@' + key + '\}', 'gi' );
						tmp = tmp.replace(ptrn, params[key] );
					}
				}
				return tmp;
			}, //end fn

			addElements : function(arr) {
				self.options.colParamsAdd = _.union( self.options.colParamsAdd, arr );
			}, //end fn

			getColParams : function() {

				// use the copy in storage if it exists;
				if ( !!self.store.get( self.options.table + '_colparams', false ) ) {
					return self.callback.getColParams( JSON.parse( self.store.get( self.options.table + '_colparams' ) ) );
				}

				var url = '/admin/colparams/json/' + self.options.table;

				$.getJSON( url
					, {}
					, self.callback.getColParams
				).fail( function() {
					console.error('There was a problem getting the column parameters');
				}).always( function() {
					self.store.setTTL( self.options.table + '_colparams', 1000*60*self.options.ttl  ); // expire after 1 hours
					//console.log('Got the colParams');
				});

			}, //end fn

			getRowData : function( url, callback ) {

        $('.panel-overlay').show();

				$.getJSON( url
					, {}
					, self.callback.getRowData
				).fail( function() {
					console.error('There was a problem getting the row data');
				}).always( function(response) {
					if (typeof callback !== 'undefined' && typeof callback === 'function' ) {
						callback(response);
					} else if ( typeof callback !== 'undefined' && typeof callback === 'string' && typeof self.fn[callback] !== 'undefined' && typeof self.fn[callback] === 'function' ) {
						self.fn[callback](response);
					}
					//console.log('Got the row data');
					//console.log(response);
				})
			}, //end fn

			processColParams : function() {
				self.DOM.$Inpts.find('.fs, .panel-heading').remove();

				if (self.options.layout === 'standard') {

					self.DOM.$Inpts.append( $('<div/>', { 'class' : 'fs col-lg-4' }) )
					self.DOM.$Inpts.append( $('<div/>', { 'class' : 'fs col-lg-4' }) )
					self.DOM.$Inpts.append( $('<div/>', { 'class' : 'fs col-lg-4' }) )
				} else {
					self.DOM.$Inpts.append( $('<div/>', { 'class' : 'fs' }) )
				}

				// process static or dynamically loaded colParams
				_.each( _.sortBy( self.options.colParams, function( o ) { return (!isNaN(o['data-ordering'])) ? +o['data-ordering'] : 1000 } ) , function( o, key ) {
          var inpt, eq;
					if (!!o && !!o.name && _.indexOf( self.options.disabledElements, o.name ) === -1 ) {

						eq = ( !!o['data-fieldset'] ) ? Number( o['data-fieldset'] )-1 : 0;
						inpt = new jInput( { atts : o } );
						self.oInpts[ o.name ] = inpt ;
						self.DOM.$Inpts.find('.fs').eq( (self.options.layout === 'standard') ? eq : 0 ).append( inpt.fn.handle() );
						if (o.readonly === 'readonly') {
							self.readonlyFields.push( o.name );
						}
					}
				});

				//console.log('Now adding the colParamsAdd : ' + self.options.colParamsAdd.length);
				// process additional colParams that may have come from linkTables
				_.each( _.sortBy( self.options.colParamsAdd, function( o ) { return (!isNaN(o['data-ordering'])) ? +o['data-ordering'] : 1000 } ) , function( o, key ) {
					var inpt, eq;
					if (!!o && !!o.name && _.indexOf( self.options.disabledElements, o.name ) === -1 ) {

						eq = ( !!o['data-fieldset'] ) ? Number( o['data-fieldset'] )-1 : 0;
						inpt = new jInput( { atts : o } );
						self.oInpts[ o.name ] = inpt ;
						self.DOM.$Inpts.find('.fs').eq( (self.options.layout === 'standard') ? eq : 0 ).append( inpt.fn.handle() );
						if (o.readonly === 'readonly') {
							self.readonlyFields.push( o.name );
						}
					}
				});

				if (self.options.layout === 'standard') {
					// set fieldset classes
					if ( self.DOM.$Inpts.find('.fs').eq(1).find('div').length === 0  ) {
						self.DOM.$Inpts.find('.fs').eq(1).removeClass('col-lg-4').end()
												   .eq(0).removeClass('col-lg-4').addClass('col-lg-8');
					} else {
						self.DOM.$Inpts.find('.fs').eq(1).addClass('col-lg-4').end()
												   .eq(0).addClass('col-lg-4').removeClass('col-lg-8');
					}
				}

				// handle linked Elements
				self.$().find('[_linkedElmID]').off('change.linkedelm').on('change.linkedelm', function() {
					//console.log( 'Setting up linked Element' );
					var This = $(this),
						$col = This.attr('_linkedElmFilterCol'),
						$id	 = This.val(),
						$labels = This.attr('_linkedElmLabels'),
						$options = This.attr('_linkedElmOptions'),
						oElm = self.fn.getElmById( This.attr('_linkedElmID') ),
						atts;

					//console.log(This.attr('name'));
					//console.log($id);
					//console.log(oElm);

					// set data to always expire;
					oElm.fn.setTTL(-1);
					oElm.options.hideIfNoOptions = true;
					oElm.options.cache = false;

					if (typeof $id === 'string') { $id = "'" + $id + "'" }
					if (typeof $id === 'object') { $id = _.map($id, function(elm) { return "'" + elm + "'" }) }

					atts = {
						'_optionsFilter' : $col + ' in (' + $id + ')',
						'_labelsSource' : $labels,
						'_optionsSource' : $options,
						'getExtData' : true,
					};

					if ( !oElm.fn.attr('multiple') || oElm.fn.attr('multiple') != 'multiple' ) {
						atts = _.extend( atts, { '_firstoption' : 0, '_firstlabel' : '-Other-' } );
					}

					oElm.fn.attr( atts );

					oElm.fn.initSelectOptions(true);

				}).change();

			}, //end fn

			processBtns : function() {
				var btnPanel = $('<div/>', { 'class' : 'panel-heading' } ).appendTo( self.DOM.$Inpts )

				_.each( self.options.btns, function( o, key ) {
					var inpt = $('<input/>', o);
					btnPanel.append(inpt);
				});
			}, //end fn

			submit : function() {

        self.fn.toggleSubmitted();

        $.ajax({
          //dataType : 'json',
          method : 'POST',
          url : self.options.atts.action,
          data : self.$().serialize(),
          success : self.callback.submit,
        }).done( self.fn.toggleSubmitted );

      }, //end fn

      toggleSubmitted : function() {
        if (!self.submitted) {
          self.submitted = true;
          //self.oElms['btn_go'].fn.disable();
        } else {
          self.submitted = false;
          //self.oElms['btn_go'].fn.enable();
        }
      }

		}; // end fns

    // alias the submit function
    this.submit = this.fn.submit;

		this.callback = {

			getRowData : function(response) {

        //console.log(response[0]);

				self.DOM.$frm.clearForm();

				_.each( response, function( value, key ) {
					if (typeof self.oInpts[key] !== 'undefined') {
						if (!!value && value.indexOf('|') !== -1 && key !== '_labelsSource' && key !== '_optionsSource') {
							value = value.split('|');
						}
						self.oInpts[key].fn.enable();
            if (typeof value === 'object' && !!_.pluck(value,'id').length) {
              self.oInpts[key].fn.val(_.pluck(value,'id'));
            } else {
              self.oInpts[key].fn.val(value);
            }
						if (self.oInpts[key].options.atts.type === 'select') {
							self.oInpts[key].DOM.$inpt.multiselect('refresh').change();
						}
					}

				});

				self.DOM.$frm.find('.bsms').multiselect('refresh');
				$('.panel-overlay').hide();
			},

			getColParams : function(response) {

				// store the response so it will persist.
				self.store.set( self.options.table + '_colparams', JSON.stringify(response) );

				var tmp, prop, $frm, $inpt, $lbl, $div, $fs, $br = $('<br/>');

				//console.log('loading colParams')
				self.options.colParams = $.map( response, function( o ) {
					if ( !( o && o._enabled && typeof o._enabled !== 'undefined' && o._enabled.toLowerCase() === 'yes' && _.indexOf( self.options.disabledElements, o.name ) === -1 ) ) { return false }
					tmp = {};
					for(prop in o) {
						if (o && o[prop] && o[prop].toString().toLowerCase() !== 'null' && o[prop].toString().toLowerCase() !== '__off__' ) {
							tmp[prop] = o[prop];
						}
					}
					return tmp;
				});

        //console.log(self.options.colParams);

				//process the colParams;
				self.fn.processColParams();

				//add the buttons
				self.fn.processBtns();


			}, // end fn

      // do something with the response
      submit : function(response) {
        console.log(response);
      }
		}; // end fns



		// initialize
		this.fn._init();

	} // end jForm declaration

	window.jForm = jForm; // add to global scope

})(window, $, jQuery);
