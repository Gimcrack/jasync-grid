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
;(function( window, $ ) {

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
			model : '',
      table : '',
      atts : {						// form html attributes
				'method' : 'POST',
        'action' : '',
				'role' : 'form',
				'onSubmit' : 'return false',
				'name' : false,
        'enctype' : 'multipart/form-data'
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
        { type : 'button', class : 'btn btn-primary btn-formMenu',  id : 'btn_form_menu_heading', value : '<i class="fa fa-fw fa-bars"></i>',},
				{ type : 'button', class : 'btn btn-primary btn-go', 	      id : 'btn_go',                value : '<i class="fa fa-fw fa-floppy-o"></i> Save &amp; Close' },
				{ type : 'button', class : 'btn btn-primary btn-reset',     id : 'btn_reset',             value : '<i class="fa fa-fw fa-refresh"></i> Reset' },
				{ type : 'button', class : 'btn btn-primary btn-cancel',    id : 'btn_cancel',            value : '<i class="fa fa-fw fa-times"></i> Cancel' },
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
				{ atts : { 'type' : 'hidden', 'readonly' : 'readonly', 'name' : '_method', 'value' : oAtts.method || 'POST', 'data-static' : true } },
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
		};

		/**  **  **  **  **  **  **  **  **  **
 		 *   FUNCTION DEFS
 		 **  **  **  **  **  **  **  **  **  **/
		this.fn = {
			_init : function() {
				var inpt;

				// create the form
				self.DOM.$frm = $('<form/>', oAtts )
					.wrap(self.options.wrap);

        // add the fieldset if we are not loading external col params
        if ( !self.options.loadExternal ) {
          self.DOM.$frm
           .append(  $('<fieldset/>', self.options.fieldset)
					      .append( $('<legend/>').html( self.options.fieldset.legend ) )
          );
        }

        // add the inputs to the DOM
        self.DOM.$frm.append( self.DOM.$Inpts );


				// append the form to the parent container
				self.DOM.$prnt.append( ( !!self.DOM.$frm.parents().length ) ?
					  self.DOM.$frm.parents().last() :
					  self.DOM.$frm
				);

				// create and append the hidden elements
				_.each( self.options.hiddenElms, function( o )  {
          o.form = self;
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

      /**
       * Is the form field an array input
       * @param  {[type]} oInpt [description]
       * @return {[type]}       [description]
       */
      isArrayFormField : function( oInpt ) {
        return ( !!oInpt.arrayField );
      }, //end fn

      /**
       * Is the form field a tokens field
       * @param  {[type]} value [description]
       * @param  {[type]} oInpt [description]
       * @return {[type]}       [description]
       */
      isTokensFormField : function( oInpt, value ) {
        return ( typeof value === 'object' && !!_.pluck(value,'name').length && typeof oInpt.$().attr('data-tokens') !== 'undefined'  );
      }, // end fn

      /**
       * Get the form data as a FormData object
       * @method function
       * @return {[type]} [description]
       */
      getFormData : function() {
        // var data = new FormData;
        //
        // _.each( self.$().serializeObject(), function(value,name) {
        //   data.append(name, value);
        // });
        //
        // self.$().find('input[type=file]').each( function(i, elm) {
        //     jApp.log('adding files to the FormData object');
        //
        //     jApp.log( elm.files );
        //
        //     _.each( elm.files, function( o ) {
        //       jApp.log( 'Adding ' + elm.name );
        //       jApp.log( o );
        //
        //       data.append( elm.name, o );
        //     });
        // })

        return self.$().serialize();

      }, // end fn

      /**
       * Get the DOM handle of the form
       * @return {[type]} [description]
       */
			handle : function() {
				return self.DOM.$prnt;
			}, // end fn

      /**
       * Get the form fieldset
       * @return {[type]} [description]
       */
			$fieldset : function() {
				return self.DOM.$frm.find('fieldset');
			}, //end fn

      /**
       * Get form input by id
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
			getElmById : function(id) {
				id = id.replace('#','');

				return self.oInpts[id];
			},

      /**
       * Render the form html
       * @param  {[type]} params [description]
       * @return {[type]}        [description]
       */
			render : function(params) {
				var tmp = self.DOM.$prnt.prop('outerHTML'), ptrn;

				if (!!params && !$.isEmptyObject(params)) {
          _.each( params, function( o, key ) {
            ptrn = new RegExp( '\{@' + key + '\}', 'gi' );
            tmp = tmp.replace(ptrn, o);
          });
				}
				return tmp;
			}, //end fn

      /**
       * Add inputs to the form
       * @param  {[type]} arr [description]
       * @return {[type]}     [description]
       */
			addElements : function(arr) {
				self.options.colParamsAdd = _.union( self.options.colParamsAdd, arr );
			}, //end fn

      /**
       * Get external column parameters - deprecated
       * @return {[type]} [description]
       */
			getColParams : function() {
        jApp.log('A. Getting external colparams');
        self.options.colParams = jApp.colparams[ self.options.model ];
        jApp.log(self.options.colParams);

        //process the colParams;
				self.fn.processExternalColParams();

				//add the buttons
				self.fn.processBtns();

			}, //end fn

      /**
       * Pre-Filter column parameters to remove invalid entries
       * @param  {[type]} unfilteredParams [description]
       * @return {[type]}                  [description]
       */
      preFilterColParams : function( unfilteredParams ) {
        return _.filter( unfilteredParams, function(o) {
          if (!o) {
            jApp.warn(o);
            jApp.warn('Fails because is null');
            return false;
          }
          // if (typeof o._enabled === 'undefined') {
          //   jApp.warn(o)
          //   jApp.warn('Fails because ')
          //   return false;
          // };
          if (!o._enabled) {
            jApp.warn(o);
            jApp.warn('Fails because is not enabled');
            return false;
          }
          if ( _.indexOf( self.options.disabledElements, o.name ) !== -1 ) {
            jApp.warn(o);
            jApp.warn('Fails because is on the disabled elements list');
            return false;
          }

          return _.omit(o, function(value) {
            return ( !value || value === 'null' || value.toString().toLowerCase() === '__off__' );
          });

        });
      }, // end fn

      /**
       * Get row data for the form
       * @param  {[type]}   url      [description]
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
			getRowData : function( url, callback ) {

        $('.panel-overlay').show();

				$.getJSON( url, {}, self.callback.getRowData)
          .fail( function() { console.error('There was a problem getting the row data');
				}).always( function(response) {
					if (typeof callback !== 'undefined' && typeof callback === 'function' ) {
						callback(response);
					} else if ( typeof callback !== 'undefined' && typeof callback === 'string' && typeof self.fn[callback] !== 'undefined' && typeof self.fn[callback] === 'function' ) {
						self.fn[callback](response);
					}
				});
			}, //end fn

      /**
       * Process externally loaded column parameters
       * @method function
       * @return {[type]} [description]
       */
      processExternalColParams : function() {
        _.each( self.options.colParams, function(o, index) {
          self.fn.processFieldset(o, index);
        });
      }, // end fn

      /**
       * Process fieldset
       * @method function
       * @param  {[type]} o     [description]
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      processFieldset : function( o ) {

        jApp.log('A. Processing the fieldset');
        jApp.log(o);
        //create the fieldset
        var $fs = $('<div/>', {
          class : o.class
        });

        // add the label, if necessary
        jApp.log('A.1 Adding the label');
        if (!!o.label) {
          $fs.append( $('<legend/>').html(o.label) );
        }

        // add the helptext if necessary
        jApp.log('A.2 Adding the helptext');
        if (!!o.helpText) {
          $fs.append( $('<div/>', { class : 'alert alert-info' } ).html(o.helpText) );
        }

        // add the fields
        jApp.log('A.3 Adding the fields');
        _.each( self.fn.preFilterColParams( o.fields ), function(oo, kk) {
          jApp.log('A.3.' + kk + ' Adding Field');
          jApp.log(oo);
          self.fn.processField(oo, $fs);
        });


        // add the fieldset to the DOM
        jApp.log('A.4 Adding to the DOM');
        self.DOM.$Inpts.append( $fs );

      }, // end fn

      /**
       * Populate a row with the field inputs
       * @method function
       * @param  {[type]} params [description]
       * @return {[type]}        [description]
       */
      populateFieldRow : function(params, index, data) {
        var $btn_add = $('<button/>', {type : 'button', class : 'btn btn-primary btn-array-add'}).html( '<i class="fa fa-fw fa-plus"></i>' ),
            $btn_remove = $('<button/>', {type : 'button', class : 'btn btn-danger btn-array-remove'}).html( '<i class="fa fa-fw fa-trash-o"></i>' );

        jApp.log('---------Array Row Data---------');
        jApp.log(data);

        return $('<tr/>').append(
          _.map( params.fields, function( oo, ii ) {
              var $td = $('<td/>'),
                  value = null;

              oo['data-pivot'] = _.pluck( 'name', params.fields );
							oo['data-array-input'] = true;

              if ( !!data && ( !!data.id || !!data.pivot )  ) {
                value = ( ii === 0 ) ?
                  data.id :
                  data.pivot[ oo.name.replace('[]','') ] || null;
              }

              self.fn.processField( oo, $td, value );
              return $td;
          })

        ).append(
          [
              $('<td/>').append([$btn_remove, (+index || 0 === 0) ? $btn_add : null])
          ]
        );
      }, // end fn

      /**
       * Process form field from parameters
       * @method function
       * @param  {[type]} params [description]
       * @param  {[type]} target [description]
       * @return {[type]}        [description]
       */
      processField : function( params, target, value ) {
        var inpt;

        jApp.log('B. Processing Field');
        jApp.log(params);

        // check if the type is array
        //if (params.type == 'array') return self.fn.processArrayField(params, target);

        inpt = new jInput( { atts : params, form : self} );
        self.oInpts[ params.name ] = inpt;
        inpt.fn.val( value );
        target.append( inpt.fn.handle() );
        if (params.readonly === 'readonly') self.readonlyFields.push(params.name);

      }, // end fn

      /**
       * Process externally loaded column parameters - deprecated
       * @return {[type]} [description]
       */
			processColParams : function() {
				self.DOM.$Inpts.find('.fs, .panel-heading').remove();

				if (self.options.layout === 'standard') {

					self.DOM.$Inpts.append( $('<div/>', { 'class' : 'fs col-lg-4' }) );
					self.DOM.$Inpts.append( $('<div/>', { 'class' : 'fs col-lg-4' }) );
					self.DOM.$Inpts.append( $('<div/>', { 'class' : 'fs col-lg-4' }) );
				} else {
					self.DOM.$Inpts.append( $('<div/>', { 'class' : 'fs' }) );
				}

				// process static or dynamically loaded colParams
				_.each( _.sortBy( self.options.colParams, function( o ) { return (!isNaN(o['data-ordering'])) ? +o['data-ordering'] : 1000 } ) , function( o, key ) {
          var inpt, eq;
					if (!!o && !!o.name && _.indexOf( self.options.disabledElements, o.name ) === -1 ) {

						eq = ( !!o['data-fieldset'] ) ? Number( o['data-fieldset'] )-1 : 0;
            inpt = new jInput( { atts : o, form : self } );
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
            inpt = new jInput( { atts : o, form : self } );
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

      /**
       * Add the form buttons
       * @method function
       * @return {[type]} [description]
       */
			processBtns : function() {
				var btnPanel = $('<div/>', { 'class' : 'panel-btns header' } ),
            btnFooter = $('<div/>', { 'class' : 'panel-btns footer' } );

				_.each( self.options.btns, function( o, key ) {
          if (o.type === 'button') {
            var inpt = $('<button/>',o).html(o.value);
          } else {
            var inpt = $('<input/>', o);
          }

					btnPanel.append( inpt );
          btnFooter.append( inpt.clone() );
				});

        self.DOM.$Inpts.append([btnPanel, btnFooter]);
			}, //end fn

      /**
       * Submit the form
       * @return {[type]} [description]
       */
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

      /**
       * Toggle the submited flag of the form
       * @return {[type]} [description]
       */
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

      /**
       * Get row data callback
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
			getRowData : function(response) {
        var oInpt, $inpt;

        if (typeof response[0] !== 'undefined') {
          response = response[0];
        }

        self.rowData = response;

				self.DOM.$frm.clearForm();

				_.each( response, function( value, key ) {
          jApp.log('Setting up input ' + key);
          jApp.log(value);

          if ( typeof self.oInpts[key] === 'undefined' || typeof self.oInpts[key].$ !== 'function' ) {
            jApp.log('No input associated with this key.');
            return false;
          }

          oInpt = self.oInpts[key];
          $inpt = oInpt.$();

          // enable the input
          oInpt.fn.enable();

					if (value != null && value.indexOf('|') !== -1 && key !== '_labelssource' && key !== '_optionssource') {
						value = value.split('|');
					}

          if ( self.fn.isArrayFormField( oInpt )  ) { // handle an array input
            jApp.log('-----------------Populating Array Form Field-----------------------');
            oInpt.fn.populateArrayFormData( oInpt, value );
          } else if ( self.fn.isTokensFormField( oInpt, value ) ) {
            $inpt.tokenfield('setTokens', _.pluck(value,'name'));
          }
          else if (typeof value === 'object' && !!_.pluck(value,'id').length) {
            oInpt.fn.val(_.pluck(value,'id'));
          } else {
            oInpt.fn.val(value);
          }
					if (oInpt.options.atts.type === 'select') {
						$inpt.multiselect('refresh').change();
					}

				});

				self.DOM.$frm.find('.bsms').multiselect('refresh');
				$('.panel-overlay').hide();
			},

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
