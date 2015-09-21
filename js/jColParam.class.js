/**
 * 	jColParam.class.js - Column Parameters helper Class
 *
 * 	Defines the properties and methods of the Column
 * 	parameter helper class. This class is a helper Class
 * 	of the jGrid custom data grid class.
 *
 * 	Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 * 	Prereqs:  jQuery, underscore.js, jGrid
 * 						jApp
 */


;(function(window, jQuery, $, _, jApp) {

  'use strict';

  /**
   * jColParam instance constructor
   * @method function
   * @param  {object} options
   * @return /jColParam instance
   */
  var jColParam = function(options) {

    var self = this,
        grid = jApp.activeGrid;

    /**
     * Class Methods
     * @type {Object}
     */
    this.fn = {

      /**
       * Initizlize the instance
       * @return {[type]} [description]
       */
			_init : function() {
				$('.tbl-list,.col-list,.param-list').perfectScrollbar();
				$('.colParamFormContainer').hide();
				$('.btn-save').addClass('disabled');
				self.store.flush();
				self.forms.oColParamFrm.fn.getColParams();
				self.action = 'colParam';

				// modal overlay
				self.fn.overlay(2,'on');

				var $target = tbl.find('#div_colParamFrm')
				self.fn.setupFormContainer($target);

				// get table list
				if ( !!self.store.get( 'tableList', false ) ) {
					self.callback.getTableList(  self.store.get('tableList') );
				} else {
					var url = 'index.php?controller=ajax&view=getTableList';
					var data = {};

					$.getJSON( url
						, data
						, self.callback.getTableList
					).fail( function() {
						console.error('There was a problem getting the row data');
					}).always( function(response) {
						self.store.set('tableList',response);
					});
				}

			}, // end fn


      /**
       * Get the column list for the chosen table
       * @param  {[type]} tableName [description]
       * @return {[type]}           [description]
       */
      getColumnList : function( tableName ) {

				// get column list
				if ( !!self.store.get( 'columnList' + tableName, false ) ) {
					self.callback.getTableList(  self.store.get( 'columnList' + tableName ) );
				} else {
					var url = 'index.php?controller=ajax&view=getColumnList';
					var data = { tableName : tableName };

					$.getJSON( url
						, data
						, self.callback.getColumnList
					).fail( function() {
						console.error('There was a problem getting the row data');
					}).always( function(response) {
						self.store.set( 'columnList' + tableName,response);
						self.store.setTTL( 'columnList' + tableName, 120);
					});
				}
			}, // end fn

      updateColParamForm : function() {
				var oFrm = self.forms.oColParamFrm;
				var oElms = oFrm.oInpts;
				var tmp, type, allowedColParams;

				// hide or show based on value of _enabled
				if (oElms._enabled.fn.val() === 'yes') {
					oElms.type.fn.show().enable();

					// hide or show based on value of type
					type = oElms.type.fn.val();
					tmp = new jInput( { atts : { type : type } } );
					allowedColParams = _.union( tmp.allowedAtts[type], tmp.allowedColParams[type], tmp.globalAtts, tmp.globalColParams );
					allowedColParams = _.difference ( allowedColParams, tmp.disallowedColParams[type] );
					_.each( oElms, function(o,key) {
						if ( key === 'type' ||  _.indexOf( allowedColParams, key  ) !== -1) {
							//console.log('enabling ' + key)
							o.fn.show().enable();
						} else {
							//console.log('disabling ' + key)
							o.fn.hide().disable();
						}
					});
				} else {
					_.each( oElms, function(o,key) {
						if (key !== '_enabled') {
							o.fn.hide();
						}
					});
				}
			}, // end fn

    } // end fns

    this.callback = {

      getTableList : function(response) {
				var target = self.fn.$currentFormWrapper().find('.tbl-list');
				var ul = $('<ul/>', {class : 'list-group'});

				target.empty();

				_.each(response, function( o, key ) {
					$('<li/>', {class : 'list-group-item'})
						.append( $('<a/>', { href : '#' })
								.click( function(e) {
											$('.tbl-list').find('.list-group-item').removeClass('chosen');
											$(this).parent().addClass('chosen')
											e.preventDefault();
											self.temp.tableName = o.tableName;
											self.fn.getColumnList(o.tableName)
								}).html( o.tableName ) )
						.appendTo(ul);
				} );

				ul.appendTo(target);

				target.prepend( $('<h3/>').html('1. Choose Table') );

				target.perfectScrollbar('update');

			}, //end fn

			getColumnList : function(response) {
				var target = self.fn.$currentFormWrapper().find('.col-list');
				var ul = $('<ul/>', {class : 'list-group'});
				var prevFS = false;

				target.empty();

				_.each(response, function( o, key ) {
					if ( o.fieldset !== prevFS ) {
						if (prevFS !== false) {
							ul.appendTo(target);
						}
						ul = $('<ul/>', {class : 'list-group'});
					}

					$('<li/>', {class : 'list-group-item'})
						.append( $('<a/>', { href : '#' })
									.click( function(e) {
										$('.col-list').find('.list-group-item').removeClass('chosen');
										$(this).parent().addClass('chosen')
										e.preventDefault();
										$('.colParamFormContainer').show();
										$('.btn-save').removeClass('disabled');
										self.temp.colParamID = o.colParamID;
										self.fn.oCurrentForm().fn.getRowData(o.colParamID, self.fn.getGridDataColParamForm ) ;

									} ).html( o.columnName ) )
						.appendTo(ul);

					prevFS = o.fieldset;
				} );

				ul.appendTo(target);
				target.prepend( $('<h3/>').html('2. Choose Column') );
				target.perfectScrollbar('update');

			}, //end fn

    }

  }

  window.jColParam = jColParam; // add to the global scope

})(window, jQuery, $, _, jApp);
