/**
 * callback.js
 *
 * callback functions
 */
;module.exports = {

  /**  **  **  **  **  **  **  **  **  **
   *   CALLBACK
   *
   *  Defines the callback functions
   *  used by the various AJAX calls
   **  **  **  **  **  **  **  **  **  **/
  callback : {

    inspectSelected : function(response) {
      $('#div_inspect').find('.panel-body .target').html(response);
      jUtility.maximizeCurrentForm();
      console.log('loaded');
    }, // end fn

    /**
     * Process the result of the form submission
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    submitCurrentForm : function(response) {
      if ( jUtility.isResponseErrors(response) ) {
        jUtility.msg.error( jUtility.getErrorMessage(response) );
      } else {
        jUtility.msg.success( 'Operation Completed Successfully!');
        if (jApp.opts().closeOnSave) {
          if ( jUtility.needsCheckin() )  {
            jUtility.checkin( jUtility.getCurrentRowId() );
          } else {
            jUtility.closeCurrentForm();
          }
        }
        jUtility.getGridData();
        jUtility.DOM.clearSelection();
      }
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   update
     *
     *  @response (obj) The JSON object
     *  returned by the ajax request
     *
     *  processes the result of the AJAX
     *  request
     **  **  **  **  **  **  **  **  **  **/
    update : function(response) {
      var responseData, self;

      jApp.log('6.6 data received. processing...');

      jUtility.DOM.setupGridHeaders();

      $('.table-cell.no-data').remove();

      if ( jUtility.isResponseErrors(response) ) {
        return jUtility.DOM.dataErrorHandler();
      }



      // init vars
      self = jApp.aG();

      // extract the data from the response;
      responseData = response.data;

      // TODO - handle pagination of api data and lazy loading

      // detect changes in data;
      self.dataGrid.delta = ( !$.isEmptyObject(self.dataGrid.data) ) ?
        jUtility.deltaData(self.dataGrid.data,responseData) :
        responseData;

      self.dataGrid.from = response.from;
      self.dataGrid.to = response.to;
      self.dataGrid.total = response.total;
      self.dataGrid.current_page = response.current_page;
      self.dataGrid.last_page = response.last_page;

      jUtility.DOM.updateGridFooter();

      self.dataGrid.data = responseData;

      if ( jUtility.isDataEmpty(response) ) {
        return jUtility.DOM.dataEmptyHandler();
      }

      // abort if no changes to the data
      if ( ! self.dataGrid.delta ) {
        return false;
      }

      // remove all rows, if needed
      if (self.options.removeAllRows) {
        jUtility.DOM.removeRows(true);
      }

      // show the preloader, then update the contents
      jUtility.DOM.togglePreloader();

      // update the DOM
      jUtility.DOM.updateGrid();

      // remove the rows that may have been removed from the data
      jUtility.DOM.removeRows();
      jUtility.buildMenus();
      jUtility.DOM.togglePreloader(true);
      self.options.removeAllRows = false;

      if (!self.loaded) {
        // custom init fn
        if ( self.fn.customInit && typeof self.fn.customInit === 'function' ) {
          self.fn.customInit();
        }
        self.loaded = true;
      }

      // adjust column widths
      jUtility.DOM.updateColWidths();

      // adjust permissions
      jUtility.callback.getPermissions( jApp.aG().permissions );

      // perform sort if needed
      jUtility.DOM.sortByCol();

    }, // end fn

    /**
     * Update panel header from row data
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    updateDOMFromRowData : function(response) {
        var data = response,
            self = jApp.aG();
        self.rowData = response;
        jUtility.DOM.updatePanelHeader( data[ self.options.columnFriendly ] );
    }, // end fn

    /**
     * Check out row
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    checkout : function(response) {
      if ( !jUtility.isResponseErrors(response) ) {
        jUtility.msg.success('Record checked out for editing.');
        jApp.activeGrid.temp.checkedOut = true;
        jUtility.setupFormContainer();
        jUtility.getCheckedOutRecords();
      }
    }, //end fn

    /**
     * Check in row
     * @method function
     * @return {[type]} [description]
     */
    checkin : function(response) {
      if ( jUtility.isResponseErrors(response) ) {
        console.warn( jUtility.getErrorMessage(response) );
      }
      jUtility.getCheckedOutRecords();
      jUtility.closeCurrentForm();
    }, //end fn

    /**
     * Display response errors
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    displayResponseErrors : function(res) {

      var response = res.responseJSON || res;

      console.log('response',response );
      jApp.log('Checking is response has errors.');
      if ( jUtility.isResponseErrors(response) ) {
        jApp.log('Response has errors. Displaying error.')
        console.warn(jUtility.getErrorMessage(response));
        jUtility.msg.clear();
        jUtility.msg.error( jUtility.getErrorMessage(response) );
      } else {
        jApp.log('Response does not have errors.')
      }
    }, //end fn

    /**
     * Get Checked out records
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    getCheckedOutRecords : function(response) {
      /**
       * To do
       */

      var $tr,
          $i = $('<i/>', { class : 'fa fa-lock fa-fw checkedOut'}),
          self = jApp.aG();

      self.DOM.$grid.find('.chk_cid').parent().removeClass('disabled').show();
      self.DOM.$grid.find('.rowMenu-container').removeClass('disabled');
      self.DOM.$grid.find('.checkedOut').remove();

      _.each(response, function(o) {

        if (!!o && !!o.lockable_id) {
          $tr = $('.table-row[data-identifier="' + o.lockable_id + '"]');

          $tr.find('.chk_cid').parent().addClass('disabled').hide()
            .closest('.table-cell').append( $('<span/>',{class : 'btn btn-default btn-danger pull-right checkedOut'})
            .html($i.prop('outerHTML')).clone().attr('title','Locked By ' + o.user.person.name));
          $tr.find('.rowMenu-container').addClass('disabled').find('.rowMenu.expand').removeClass('expand');
        }
      });

    }, //end fn

    /**
     * Process the grid link tables
     * @method function
     * @param  {[type]} colParams [description]
     * @return {[type]}           [description]
     */
    linkTables : function( colParams ) {
      var self = jApp.aG();

      // add the colParams to the linkTable store
      self.linkTables = _.union( self.linkTables, colParams );

      // count the number of completed requests
      if ( !self.linkTableRequestsComplete ) {
        self.linkTableRequestsComplete = 1;
      } else {
        self.linkTableRequestsComplete++;
      }

      // once all linkTable requests are complete, apply the updates to the forms
      if (self.linkTableRequestsComplete == self.options.linkTables.length) {
        // update the edit form
        self.forms.oEditFrm.options.colParamsAdd = self.linkTables;
        self.forms.oEditFrm.fn.processColParams();
        self.forms.oEditFrm.fn.processBtns();

        // update the new form
        self.forms.oNewFrm.options.colParamsAdd = self.linkTables;
        self.forms.oNewFrm.fn.processColParams();
        self.forms.oNewFrm.fn.processBtns();
      }

    }, //end fn

    /**
     * Show or hide controls based on permissions.
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    getPermissions : function(response) {

      jApp.log( 'Setting activeGrid permissions');
      jApp.activeGrid.permissions = response;

      jApp.log( jApp.aG().permissions );

      _.each(response, function(value, key) {
        jApp.log( '12.1 Setting Permission For ' + key + ' to ' + value );
        if (value !== 1) {
          $('[data-permission=' + key + ']').remove();
        }
      });
    }, // end fn

  } // end callback defs
}
