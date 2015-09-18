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

    } // end fns

  }

  window.jColParam = jColParam; // add to the global scope

})(window, jQuery, $, _, jApp);
