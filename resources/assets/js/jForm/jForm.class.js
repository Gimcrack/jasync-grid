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
;'use strict';

var $ = require('jQuery'),
    _ = require('underscore');
    //jInput = require('../jInput/jInput.class');

module.exports = function( options ) {

		var

      /**
       * Alias of this
       * @type {[type]}
       */
      self = this,

      /**
       * Shortcut to this.options.atts
       */
      oAtts,

      /**
       * Runtime options
       * @type {[type]}
       */
      runopts = options || {};

		/**  **  **  **  **  **  **  **  **  **
 		 *   FUNCTION DEFS
 		 **  **  **  **  **  **  **  **  **  **/
		this.fn = {
			_init : function() {
				var inpt;

				// create the form
				self.DOM.$frm = self.factory.form();

        // handle the fieldset
        self.fn.handleFieldset();

        // append the DOM elements
        self.fn.append();

				// create and append the hidden elements
				self.fn.buildInputs( self.options.hiddenElms );

        // handle the column parameters
				self.fn.handleColParams();

			}, // end fn

      /**
       * Serialize the input values
       * @method function
       * @return {[type]} [description]
       */
      serialize : function() {
        var ret = {};
        _.each( self.oInpts, function( o, i ) {
          // ignore disabled elements
          if ( !! ( o.$().prop('disabled') || o.$().hasClass('disabled') ) ) return false;

          ret[i] = o.fn.serialize();
        });
        return ret;
      }, // end fn

      /**
       * The the value of the input
       * @method function
       * @param  {[type]} value [description]
       * @param  {[type]} key   [description]
       * @return {[type]}       [description]
       */
      setInputValue : function( value, key ) {
          var oInpt;

          jApp.log('Setting up input ' + key);
          jApp.log(value);


          if ( typeof self.oInpts[key] === 'undefined' || typeof self.oInpts[key].$ !== 'function' ) {
            jApp.log('No input associated with this key.');
            return false;
          }

          // get the jInput object
          oInpt = self.oInpts[key];

          // enable the input
          oInpt.fn.enable();

          // set the value of the input
          return oInpt.fn.setValue( value, key );

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

        return self.fn.serialize();

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
        self.options.colParams = jApp.colparams[ self.options.model ] || self.options.colParams;
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

          // add the default colparams before attempting to filter
          o = $.extend(true, {}, self.options.defaultColparams, o);

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

				$.getJSON( jApp.prefixURL(url), {}, self.callback.getRowData )
          .fail( function() { console.error('There was a problem getting the row data');
				})
        .always( function(response) {
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
        var $btn_add = $('<button/>',   {type : 'button', class : 'btn btn-link btn-array-add'}).html( '<i class="fa fa-fw fa-plus"></i>' ),
            $btn_remove = $('<button/>', {type : 'button', class : 'btn btn-link btn-array-remove'}).html( '<i class="fa fa-fw fa-trash-o"></i>' );

        jApp.log('---------Array Row Data---------');
        jApp.log(data);


        return $('<tr/>').append(
          _.map( params.fields, function( oo, ii ) {
              var $td = $('<td/>', { nowrap : 'nowrap' }),
                  value = null;

							oo['data-array-input'] = true;

              // if its the first input (the singleSelect) grab the value (the id of the row)
              if ( !!data && !!data.id && ii === 0 ) {
                value = data.id
              }

              jApp.log('-----[]-----');
              jApp.log(oo);
              jApp.log(data);

              // if its not the first input, grab the value from the pivot data
              if (ii> 0 && !!data && !!oo['data-pivotName'] && !!data.pivot && !!data.pivot[oo['data-pivotName']]) {
                value = data.pivot[oo['data-pivotName']];

              // if it's not a m-m relationship, look for the data in the root of the object
              } else if ( ii> 0 && !!data && !!oo['data-pivotName'] && !!data[oo['data-pivotName']] ) {
                value = data[oo['data-pivotName']];
              }


              self.fn.processField( oo, $td, value, true );
              return $td;
          })

        ).append(
          [
              $('<td/>', { nowrap : 'nowrap' } ).append([$btn_remove,$btn_add])
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
      processField : function( params, target, value, isArrayFormField ) {
        var inpt, inpt_name = params.name.replace('[]','');

        jApp.log('B. Processing Field');
        inpt = new jInput( { atts : params, form : self} );

        if ( ! isArrayFormField ) {
          self.oInpts[inpt_name] = inpt;
        } else if ( typeof self.oInpts[inpt_name] !== 'undefined' ) {

          if ( typeof self.oInpts[inpt_name].oInpts === 'undefined' ) {
            self.oInpts[inpt_name].oInpts = [];
          }
          self.oInpts[inpt_name].oInpts.push(inpt);
        }
        inpt.fn.val( value );
        target.append( inpt.fn.handle() );
        //if (params.readonly === 'readonly') self.readonlyFields.push(params.name);

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

				//jApp.log('Now adding the colParamsAdd : ' + self.options.colParamsAdd.length);
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
					//jApp.log( 'Setting up linked Element' );
					var This = $(this),
						$col = This.attr('_linkedElmFilterCol'),
						$id	 = This.val(),
						$labels = This.attr('_linkedElmLabels'),
						$options = This.attr('_linkedElmOptions'),
						oElm = self.fn.getElmById( This.attr('_linkedElmID') ),
						atts;

					//jApp.log(This.attr('name'));
					//jApp.log($id);
					//jApp.log(oElm);

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

        //self.DOM.$Inpts.append([btnPanel, btnFooter]);
        self.DOM.$Inpts.append(btnFooter);
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
          url : jApp.prefixURL(self.options.atts.action),
          data : self.fn.serialize(),
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
          {               // additional defaults
            // Default attributes
            atts : {
              name : 'frm_edit' + ( options.tableFriendly || options.model || null )
            },

            // Default hidden elements
            hiddenElms : [
      				{ atts :
                { 'type' : 'hidden', 'readonly' : 'readonly', 'name' : '_method', 'value' : atts.method || 'POST', 'data-static' : true }
              },
      			],

            // Default fieldset heading
            fieldset : {
              'legend' : ( options.tableFriendly || 'Form' ) + ' Details',
      				'id' : 'fs_details'
            },

            // Default buttons
            btns : [
              { type : 'button', class : 'btn btn-primary btn-formMenu',  id : 'btn_form_menu_heading', value : '<i class="fa fa-fw fa-bars"></i>',},
      				{ type : 'button', class : 'btn btn-primary btn-go', 	      id : 'btn_go',                value : '<i class="fa fa-fw fa-floppy-o"></i> Save &amp; Close' },
      				{ type : 'button', class : 'btn btn-primary btn-reset',     id : 'btn_reset',             value : '<i class="fa fa-fw fa-refresh"></i> Reset' },
      				{ type : 'button', class : 'btn btn-primary btn-cancel',    id : 'btn_cancel',            value : '<i class="fa fa-fw fa-times"></i> Cancel' },
      			],
          },
          options || {}   // runtime options
        );

      	// alias to attributes object
      	oAtts = self.options.atts || {};

        // set up the callback functions
        $.extend(true, self.callback, options.callback || {} );

        return self.fn; // for chaining methods
      }, // end fn

      /**
       * Handle form fieldset
       * @method function
       * @return {[type]} [description]
       */
      handleFieldset : function() {
        if (!!self.options.loadExternal) return false;

        self.DOM.$frm.append( self.factory.fieldset() );
      }, // end fn

      /**
       * Handle the column parameters
       * @method function
       * @return {[type]} [description]
       */
      handleColParams : function() {
        if ( !!self.options.loadExternal ) { // get the colparams from an external json source
					return self.fn.getColParams();
				}

				self.fn.processColParams();
				self.fn.processBtns();

      }, // end fn

      /**
       * Append the DOM elements
       * @method function
       * @return {[type]} [description]
       */
      append : function() {
        self.DOM.$frm.append( self.DOM.$Inpts );

        // append the form to the parent container
				self.DOM.$prnt.append( ( !!self.DOM.$frm.parents().length ) ?
					  self.DOM.$frm.parents().last() :
					  self.DOM.$frm
				);

      }, // end fn

      /**
       * Build inputs from array
       *  of column parameters
       * @method function
       * @return {[type]} [description]
       */
      buildInputs : function( aColParams ) {
        _.each( aColParams, self.factory.input );
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

      	/**  **  **  **  **  **  **  **  **  **
      		 *   DOM ELEMENTS
      		 *
      		 *  These placeholders get replaced
      		 *  by their jQuery handles
      		 **  **  **  **  **  **  **  **  **  **/
      	self.DOM = {
    			$prnt : $('<div/>'),
    			$frm : false,
    			$fs : false,
          $Inpts : $('<div/>')
    		};

        /**
         * Initialize submitted flag
         * @type {Boolean}
         */
        self.submitted = false;

        /**
         * Reference jStorage object
         * @type {[type]}
         */
        self.store = $.jStorage;

      	/**
      	 * Container for jInput objects
      	 * @type {Array}
      	 */
      	self.oInpts = {};

        /**
         * Initialize the rowData object
         * @type {Object}
         */
        self.rowData = {};

        /**
         * Initialize the readonly fields array
         * @type {Array}
         */
        self.readonlyFields = [];

        /**
         * Initialize the html template container
         * @type {Object}
         */
        self.html = {};

        /**
         * Shortcut function to the $frm
         * @method function
         * @return {[type]} [description]
         */
      	self.$ = function() {
      		return self.DOM.$frm;
      	};

        // set the instance options
        self.fn.setOptions( options );

        // the model of the form
        self.model = self.options.model;

        // initialize
        self.fn._init();

      }, // end fn

		}; // end fns

    /**
     * Builders for html elements
     * @type {Object}
     */
    this.factory = {

      /**
       * Create a form element
       * @method function
       * @return {[type]} [description]
       */
      form : function( options ) {
        options = options || self.options;

        return $('<form/>', options.atts )
          .data('jForm', self)
					.wrap(options.wrap);
      }, // end fn

      /**
       * Build and append an input
       * from column parameters
       * @method function
       * @param  {[type]} colparams [description]
       * @return {[type]}           [description]
       */
      input : function( colparams, index ) {
        var inpt = self.factory.jInput( colparams ),
            atts = colparams.atts || {};

        // add the jInput object to the oInpts array
        self.oInpts[atts.name] = inpt;

        // add the input DOM handle to the DOM
        self.DOM.$Inpts.append( inpt.fn.handle() );

        // add the input to the readonly
        //  fields list, if applicable
        if ( !!atts.readonly ) {
          self.readonlyFields.push( atts.name );
        }

      }, // end fn

      /**
       * Build a new jInput Object
       * from column parameters
       * @method function
       * @param  {[type]} colparams [description]
       * @return {[type]}           [description]
       */
      jInput : function( colparams ) {
        colparams.form = self;
        return new jInput( colparams );
      }, // end fn

      /**
       * Create a fieldset element
       * @method function
       * @return {[type]} [description]
       */
      fieldset : function( options ) {
        options = options || self.options.fieldset;
        return $('<fieldset/>', options)
                  .append( self.factory.legend() );
      }, // end fn

      /**
       * Create a legend element
       * @method function
       * @param  {[type]} options [description]
       * @return {[type]}         [description]
       */
      legend : function( options ) {
        options = options || self.options.fieldset.legend;
        return $('<legend/>').html(options);
      }, // end fn

    } // end factory

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

        // iterate through each row and the the corresponding input value
				_.each( response, self.fn.setInputValue );

        // if there is a custom callback, then call it.
        if ( typeof jApp.aG().fn.getRowDataCallback === 'function' ) {
          jApp.aG().fn.getRowDataCallback();
        }

				//self.DOM.$frm.find('.bsms').multiselect('refresh').change();
				$('.panel-overlay').hide();
			},

      // do something with the response
      submit : function(response) {
        jApp.log(response);
      }
		}; // end fns

		// initialize
		this.fn._preInit( options || {} );

	} // end jForm declaration
