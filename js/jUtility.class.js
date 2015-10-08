/**
 *  jUtility.class.js - Custom Data Grid JS utility class
 *
 *  Contains helper functions used by jGrid
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 *  Prereqs: 	jQuery, jApp
 *
 */

;(function(window, $, jApp) {

  'use strict';

  var jUtility = {

    /**
     * Set AJAX Defaults
     * @method function
     * @return {[type]} [description]
     */
    setAjaxDefaults : function() {
      $.ajaxSetup({
        headers: {
            'X-XSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
      jApp.log('4.1 Ajax Defaults Set')
    }, // end fn

    /**
     * Get the default grid options
     * @method function
     * @return {[type]} [description]
     */
    getDefaultOptions : function() {
      /**
       * Default Options
       * @type {Object}
       */
      return {

        /**
         * Form Definitions
         */
        formDefs : {},

        /**
         * Event Bindings
         * @type {Object}
         */
        bind : {},

        /**
         * Function definitions
         * @type {Object}
         */
        fn : {},

        /**
         * Toggles - true/false switches
         * @type {Object}
         */
        toggles : {

          /**
           * Data is editable
           * @type {Boolean} default true
           */
          editable : true,

          /**
           * Show the 'new' button
           * @type {Boolean} default true
           */
          new : true,

          /**
           * Show the 'edit' button
           * @type {Boolean} default true
           */
          edit : true,

          /**
           * Show the 'delete' buton
           * @type {Boolean} default true
           */
          del : true,

          /**
           * Show the sort buttons above each header
           * @type {Boolean} default true
           */
          sort : true,

          /**
           * Autoupdate the grid data automatically
           * @type {Boolean} default true
           */
          autoUpdate : true,

          /**
           * Auto-paginate the grid data
           * @type {Boolean} default true
           */
          paginate : true,

          /**
           * Enable the filter text boxes above each header
           * @type {Boolean} default true
           */
          headerFilters : true,

          /**
           * Display the header filters above each header
           */
          displayHeaderFilters : false,

          /**
           * Collapse the row menu
           * @type {Boolean} default true
           */
          collapseMenu : true,

          /**
           * Cache the grid data for faster load times
           * @type {Boolean} default false
           */
          caching : false,

          /**
           * Show the ellipsis ... and readmore buttons
           * @type {Boolean} default true
           */
          ellipses : true,

          /**
           * Checkout records before editing
           * @type {Boolean} default true
           */
          checkout : true,

          /**
           * Close form window after saving
           * @type {Boolean} default true
           */
          closeOnSave : true,

          /**
           * remove all rows when updating data
           * @type {Boolean}
           */
          removeAllRows : false,
        },

        /**
         * General Grid Options
         */

        /**
         * If jApp.opts().toggles.autoUpdate, interval to autorefresh data in ms
         * @type {Number} default 602000
         */
        refreshInterval :  602000,

        /**
         * jQuery DOM target
         * @type {String} default '.table-responsive'
         */
        target : '.table-responsive',						// htmlTable target

        /**
         * Data request options
         */

        /**
         * URL of JSON resource (grid data)
         * @type {String}
         */
        url	: jApp.opts().runtimeParams.table + '/json', 	// url of JSON resource

        /**
         * Database table name of grid data
         * @type {String}
         */
        table : '',											// db table (for updates / inserts)

        /**
         * Primary key of table
         * @type {String}
         */
        pkey : 'id',

        /**
         * Where clause of data query
         * @type {String}
         */
        filter : '',										// where clause for query

        /**
         * db columns to show
         * @type {Array}
         */
        columns : [ ],										// columns to query

        /**
         * Friendly headers for db columns
         * @type {Array}
         */
        headers : [ ],										// headers for table

        /**
         * Data Presentation options
         */


        /**
         * Pagination - Rows per page
         * @type {Number} default 10
         */
        rowsPerPage : 10,

        /**
         * Pagination - Starting page number
         * @type {Number} default 1
         */
        pageNum	: 1,

        /**
         * The friendly name of the table e.g. Users
         * @type {String}
         */
        tableFriendly : '',									// friendly name of table

        /**
         * The column containing the friendly name of each row e.g. username
         * @type {String}
         */
        columnFriendly : '',								// column containing friendly name of each row

        /**
         * The text shown when deleting a record
         * @type {String}
         */
        deleteText : 'Deleting',

        /**
         * html attributes to apply to individual columns
         * @type {Array}
         */
        cellAtts : [ ],										// column attributes

        /**
         * html templates
         * @type {Array}
         */
        templates : [ ],									// html templates

        /**
         * Max cell length in characters, if toggles.ellipses
         * @type {Number} default 38
         */
        maxCellLength : 38,

        /**
         * Max column length in pixels
         * @type {Number} default 450
         */
        maxColWidth: 450,

        /**
         * Bootstrap Multiselect Default Options
         * @type {Object}
         */
        bsmsDefaults : {
          buttonContainer : '<div class="btn-group" />',
          enableFiltering: true,
          includeSelectAllOption: true,
          maxHeight: 185
        },

        /**
         * Header Options
         * @type {Object}
         */
        gridHeader : {
          icon : 'fa-dashboard',
          headerTitle : 'Manage',
          helpText : false,
        },

        /**
         * Disabled Form Elements - e.g. password
         * @type {Array}
         */
        disabledFrmElements : [],

        /**
         * Table buttons appear in the table menu below the header
         * @type {Object}
         */
        tableBtns : {

          /**
           * Refresh Button
           * @type {Object}
           */
          refresh : {
            type : 'button',
            name : 'btn_refresh_grid',
            class : 'btn btn-success btn-refresh',
            icon : 'fa-refresh',
            label : '&nbsp;'
          },

          /**
           * New Button
           * @type {Object}
           */
          new : {
            type : 'button',
            class : 'btn btn-success btn-new',
            id : 'btn_edit',
            icon : 'fa-plus-circle',
            label : 'New',
          },

          /**
           * Header Filters Button
           * @type {Object}
           */
          headerFilters : {
            type : 'button',
            class : 'btn btn-success btn-headerFilters',
            id : 'btn_toggle_header_filters',
            icon : 'fa-filter',
            label : '',
          },

          /**
           * Define custom buttons here. Custom buttons may also be defined at runtime.
           * @type {Object}
           */
          custom : {
            visColumns : [
              { icon : 'fa-bars fa-rotate-90', label : ' Visible Columns' },
            ],

          }
        },


        /**
         * Row buttons appear in each row of the grid
         * @type {Object}
         */
        rowBtns : {

          /**
           * Edit Button
           * @type {Object}
           */
          edit : {
            type : 'button',
            class : 'btn btn-primary btn-edit',
            id : 'btn_edit',
            icon : 'fa-pencil',
            label : '',
            title : 'Edit Record ...',
          },

          /**
           * Delete Button
           * @type {Object}
           */
          del : {
            type : 'button',
            class : 'btn btn-danger btn-delete',
            id : 'btn_delete',
            icon : 'fa-trash-o',
            label : '',
            title : 'Delete Record ...'
          },

          /**
           * Define custom buttons here. Custom buttons may also be defined at runtime.
           * @type {Object}
           */
          custom : {
            //custom : { type : 'button' } // etc.
          }
        },

        /**
         * With Selected Buttons appear in the dropdown menu of the header
         * @type {Object}
         */
        withSelectedBtns : {

          /**
           * Delete Selected ...
           * @type {Object}
           */
          del : {
            type : 'button',
            class : 'li-red',
            id : 'btn_delete',
            icon : 'fa-trash-o',
            label : 'Delete Selected ...',
            fn : 'delete',
          },

          /**
           * Define custom buttons here. Custom buttons may also be defined at runtime.
           * @type {Object}
           */
          custom : {
            //custom : { type : 'button' } // etc.
          }
        },

        /**
         * linktables define the relationships between tables
         * @type {Array}
         */
        linkTables : [ ],

      }; // end defaults

    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   withSelected
     *  @action - The action to perform
     *
     *  When one or more rows are checked,
     *  this defines the various options
     *  that are available and the actions
     *  that are performed.
     **  **  **  **  **  **  **  **  **  **/
    withSelected : function(action, callback) {
      console.log('clicked');
      ( !!jUtility.numInvisibleItemsChecked() ) ?
        jUtility.confirmInvisibleCheckedItems(action,callback) :
        jUtility.withSelectedAction(action,callback, true);
    }, // end fn

    /**
     * With selected actions
     * @param  {[type]}   action   [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   $cid     [description]
     * @return {[type]}            [description]
     */
    withSelectedAction : function(action, callback, includeHidden) {
      var $cid = jUtility.getCheckedItems(includeHidden);

      if (!$cid.length) { return jUtility.msg.warning('Nothing selected.') }

      switch(action) {
        // DELETE SELECTED
        case 'delete' :
          jApp.aG().action = 'withSelectedDelete';
          bootbox.confirm("Are you sure you want to delete " + $cid.length + " items?", function(response) {
            if (!!response) {
              jUtility.postJSON( {
                url : jUtility.getCurrentFormAction(),
                success : jUtility.callback.submitCurrentForm,
                data : { '_method' : 'delete', 'ids' : $cid }
              });
            }
          });
        break;

        case 'custom' :
          return (typeof callback === 'function') ?
            callback( $cid ) :
            console.warn( 'callback is not a valid function');
        break;

        default :
          console.warn( action + ' is not a valid withSelected action');
        break;
      }

    }, //end fn

    /**
     * Get the action of the current form
     * @method function
     * @return {[type]} [description]
     */
    getCurrentFormAction : function() {
      switch (jApp.aG().action) {
        case 'edit' :
        case 'delete' :
          return jApp.opts().table + '/' + jUtility.getCurrentRowId();
        break;

        case 'resetPassword' :
          return 'resetPassword/' + jUtility.getCurrentRowId();
        break;

        default :
          return jApp.opts().table;
        break;
      }
    }, // end fn

    /**
     * [function description]
     * @method function
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    actionHelper : function(action) {
      jApp.aG().action = action;
      if ( jUtility.needsCheckout() ) {
        jUtility.checkout( jUtility.getCurrentRowId() );
      } else {
        jUtility.setupFormContainer()
      }
    }, // end fn

    /**
     * Clear the current form
     * @method function
     * @return {[type]} [description]
     */
    resetCurrentForm : function() {
      try {
        jUtility.$currentForm().clearForm();
        jUtility.$currentForm().find(':input:not("[type=button]"):not("[type=submit]"):not("[type=reset]"):not("[type=radio]"):not("[type=checkbox]")')
        .each( function(i,elm) {
          if ( !!$(elm).attr('data-static') ) { return false; }

          //$(elm).data("DateTimePicker").remove();
          $(elm).val('');
          if ( $(elm).hasClass('bsms') ) {
            $(elm).multiselect(jApp.opts().bsmsDefaults).multiselect('refresh');
          }
        });
      } catch(e) {
        console.warn(e);
        return false;
      }
    }, // end fn

    /**
     * Refresh and rebuild the current form
     * @method function
     * @return {[type]} [description]
     */
    refreshCurrentForm : function() {
      jApp.aG().store.flush();
      jUtility.oCurrentForm().fn.getColParams();
    }, // end fn

    /**
     * Maximize the current form
     * @method function
     * @return {[type]} [description]
     */
    maximizeCurrentForm : function() {
      try {
        jUtility.$currentFormWrapper().addClass('max');
      } catch(e) {
        console.warn(e);
        return false;
      }
    }, // end fn

    /**
     * Close the current form
     * @method function
     * @return {[type]} [description]
     */
    closeCurrentForm : function() {
      try {
        jUtility.msg.clear()
        jUtility.$currentFormWrapper().removeClass('max')
          .find('.formContainer').css('height','');
        jUtility.$currentForm().clearForm();
        jUtility.turnOffOverlays();
      } catch(ignore) {}
    }, // end fn

    /**
     * Set focus on the current form
     * @method function
     * @return {[type]} [description]
     */
    setCurrentFormFocus : function() {
      jUtility.$currentFormWrapper().find(":input:not([type='hidden']):not([type='button'])").eq(0).focus();
    }, // end fn

    /**
     * Get the current form row data for the current row
     * @method function
     * @return {[type]} [description]
     */
    getCurrentFormRowData : function() {
      if (jApp.aG().action === 'new') return false;
      var url = jUtility.getCurrentRowDataUrl();

      jUtility.oCurrentForm().fn.getRowData(url, jUtility.callback.updateDOMFromRowData);
    }, //end fn

    /**
     * Get the data url of the current row
     * @method function
     * @return {[type]} [description]
     */
    getCurrentRowDataUrl : function() {
      if (typeof jApp.opts().rowDataUrl !== 'undefined') {
        return jApp.opts().rowDataUrl;
      }
      return jApp.opts().table + '/' + jUtility.getCurrentRowId() + '/json';
    }, //end fn

    /**
     * Submit the current form
     * @method function
     * @return {[type]} [description]
     */
    submitCurrentForm : function() {
      var requestOptions = {
        url : jUtility.getCurrentFormAction(),
        data : jUtility.$currentForm().serialize(),
        success : jUtility.callback.submitCurrentForm,
        fail : console.warn
      };

      jUtility.msg.clear();

      if (!!jUtility.$currentForm()) {
        var oValidate = new validator( jUtility.$currentForm() );
        if (oValidate.errorState) {
          return false;
        }
      }

      jUtility.postJSON( requestOptions );

    }, // end fn

    /**
     * Save the current form and leave open
     * @method function
     * @return {[type]} [description]
     */
    saveCurrentForm : function() {
      jApp.opts().closeOnSave = false;
      jUtility.submitCurrentForm();
      $(this).addClass('disabled').delay(2000).removeClass('disabled');
    }, // end fn

    /**
     * Save the current form and close
     * @method function
     * @return {[type]} [description]
     */
    saveCurrentFormAndClose : function() {
      jApp.opts().closeOnSave = true;
      jUtility.submitCurrentForm();
      $(this).addClass('disabled').delay(2000).removeClass('disabled');
      //jUtility.toggleRowMenu;
    }, // end fn

    /**
     * Kill pending ajax request
     * @method function
     * @param  {[type]} requestName [description]
     * @return {[type]}             [description]
     */
    killPendingRequest : function(requestName) {
      try{
        jApp.aG().dataGrid.requests[requestName].abort();
      } catch(e) {
        // nothing to abort
      }
    }, //end fn

    /**
     * Set instance options
     * @method function
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    setOptions : function(options) {
      jApp.aG().options = $.extend(true, jApp.opts(),options);
      jApp.log('1.1 Options Set')
      return jApp.aG();
    }, //end fn

    /**
     * Set up the visible columns menu for the table menu
     * @method function
     * @return {[type]} [description]
     */
    setupVisibleColumnsMenu : function() {
      if ( typeof jApp.aG().temp.visibleColumnsMenuSetup === 'undefined' || jApp.aG().temp.visibleColumnsMenuSetup === false) {
        // visible columns
        _.each( jApp.opts().columns, function( o, i ) {
          if (i < jApp.opts().headers.length ) {
            jApp.opts().tableBtns.custom.visColumns.push(
              {
                icon : 'fa-check-square-o',
                label : jApp.opts().headers[i],
                fn : function() { jUtility.DOM.toggleColumnVisibility( $(this) ) }, 'data-column' : o
              }
            );
          }
        });

        jApp.aG().temp.visibleColumnsMenuSetup = true;
      } else {
        return false;
      }
    }, //end fn

    /**
     * Does the form need confirmation
     * @method function
     * @return {[type]} [description]
     */
    isConfirmed : function() {
      var conf = jUtility.$currentFormWrapper().find('#confirmation');
      if ( !!conf.length && conf.val().toString().toLowerCase() !== 'yes') {
        jUtility.msg.warning('Type yes to continue');
        return false;
      }
      return true;
    }, //end fn

    /**
     * Initialize scrollbar
     * @method function
     * @return {[type]} [description]
     */
    initScrollbar : function() {
      $('.table-grid').perfectScrollbar();
    }, //end fn

    /**
     * Is autoupdate enabled
     * @method function
     * @return {[type]} [description]
     */
    isAutoUpdate : function() {
      return !!jApp.opts().toggles.autoUpdate;
    }, //end fn

    /**
     * Is data caching enabled
     * @method function
     * @return {[type]} [description]
     */
    isCaching : function() {
      return !!jApp.opts().toggles.caching;
    }, // end fn

    /**
     * Is record checkout enabled
     * @method function
     * @return {[type]} [description]
     */
    isCheckout : function() {
      return !!jApp.opts().toggles.checkout && jUtility.isEditable();
    }, // end fn

    /**
     * Is the grid data editable
     * @method function
     * @return {[type]} [description]
     */
    isEditable : function() {
      return !!jApp.opts().toggles.editable;
    }, //end fn

    /**
     * Are ellipses enabled
     * @method function
     * @return {[type]} [description]
     */
    isEllipses : function() {
      return !!jApp.opts().toggles.ellipses;
    }, // end fn

    /**
     * Is a form container maximized
     * @method function
     * @return {[type]} [description]
     */
    isFormOpen : function() {
      return !!jApp.aG().$().find('.div-form-panel-wrapper.max').length;
    }, // end fn

    /**
     * Is pagination enabled
     * @method function
     * @return {[type]} [description]
     */
    isPagination : function() {
      return !!jApp.opts().toggles.paginate;
    }, // end fn

    /**
     * Is sorting by column enabled
     * @method function
     * @return {[type]} [description]
     */
    isSort : function() {
      return !!jApp.opts().toggles.sort;
    }, // end fn

    /**
     * Is toggle mine enabled
     * @method function
     * @return {[type]} [description]
     */
    isToggleMine : function() {
      return window.location.href.indexOf('/my') !== -1;
    }, // end fn

    /**
     * Is header filters enabled
     * @method function
     * @return {[type]} [description]
     */
    isHeaderFilters : function() {
      return !!jApp.opts().toggles.headerFilters;
    }, // end fn

    /**
     * Are header filters currently displayed
     * @method function
     * @return {[type]} [description]
     */
    isHeaderFiltersDisplay : function() {
      return !!jApp.opts().toggles.headerFiltersDisplay;
    }, // end fn

    /**
     * Is the button with name 'key' enabled
     * @method function
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    isButtonEnabled : function(key) {
      return typeof jApp.opts().toggles[key] === 'undefined' || !!jApp.opts().toggles[key]
    }, //end fn

    /**
     * Is data cache available
     * @method function
     * @return {[type]} [description]
     */
    isDataCacheAvailable : function() {
      return (jUtility.isCaching() && !!jApp.aG().store.get('data_' + jApp.opts().table,false) );
    }, // end fn

    /**
     * Are there errors in the response
     * @method function
     * @return {[type]} [description]
     */
    isResponseErrors : function(response) {
       return (typeof response.errors !== 'undefined' &&
                      !!response.errors);
    }, // end fn

    /**
     * Get error message from response
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    getErrorMessage : function(response) {
      return (typeof response.message !== 'undefined') ?
        response.message :
        'There was a problem completing your request.'
    }, //end fn

    /**
     * The row needs to be checked out
     * @method function
     * @return {[type]} [description]
     */
    needsCheckout : function() {
      return ( jUtility.isCheckout() && ( jApp.aG().action === 'edit' || jApp.aG().action === 'delete' ) );
    }, //end fn

    /**
     * The row needs to be checked in
     * @method function
     * @return {[type]} [description]
     */
    needsCheckin : function() {
      return jUtility.needsCheckout();
    }, //end fn

    /**
     * Get current row id
     * @method function
     * @return {[type]} [description]
     */
    getCurrentRowId : function() {
      return +jApp.aG().DOM.$rowMenu.closest('.table-row').attr('data-identifier') || -1;
    }, //end fn

    /**
     * Display unload warning if a form is open
     * @method function
     * @return {[type]} [description]
     */
    unloadWarning : function() {
      if (jUtility.isFormOpen()) {
        return 'You have unsaved changes.';
      }
    }, // end fn

    /**
     * Update the total pages of the grid
     * @method function
     * @return {[type]} [description]
     */
    updateTotalPages : function() {
      jApp.aG().dataGrid.pagination.totalPages = Math.ceil( jApp.aG().dataGrid.data.length / jApp.aG().dataGrid.pagination.rowsPerPage );
    }, // end fn

    /**
     * Update pagination of the grid
     * @method function
     * @return {[type]} [description]
     */
    updatePagination : function() {
      //pagination
      if ( jUtility.isPagination() ) {
        jUtility.updateTotalPages();
        jUtility.setupBootpag();
        jUtility.setupRowsPerPage();
      } else {
        jUtility.hideBootpag();
      }
    }, // end fn

    /**
     * Setup bootpag pagination controls
     * @method function
     * @return {[type]} [description]
     */
    setupBootpag : function() {
      jApp.tbl().find('.paging').empty().show().bootpag({
        total : jApp.aG().dataGrid.pagination.totalPages,
        page : jApp.opts().pageNum,
        maxVisible : 20
      }).on("page", function(event,num) {
        jUtility.DOM.page(num);
      });
    }, // end fn

    /**
     * setup/update rows per page controls
     * @method function
     * @return {[type]} [description]
     */
    setupRowsPerPage : function() {
      jApp.tbl().find('[name=RowsPerPage]').off('change.rpp').on('change.rpp', function() {
        jApp.tbl().find('[name=RowsPerPage]').val( $(this).val() );
        jUtility.DOM.rowsPerPage( $(this).val() );
      }).parent().show();
    }, // end fn

    /**
     * Hide bootpag pagination controls
     * @method function
     * @return {[type]} [description]
     */
    hideBootpag : function() {
      jApp.tbl().find('.paging').hide();
      jApp.tbl().find('[name=RowsPerPage]').parent().hide();
    }, // end fn

    /**
     * Setup header filters
     * @method function
     * @return {[type]} [description]
     */
    setupHeaderFilters : function() {
      if (jUtility.isHeaderFilters() ) {
        jUtility.DOM.headerFilterDeleteIcons();
      }
      if (jUtility.isHeaderFiltersDisplay()) {
        jUtility.DOM.showHeaderFilters();
      } else {
        jUtility.DOM.hideHeaderFilters();
      }
    }, // end fn

    /**
     * Setup the table sort buttons
     * @method function
     * @return {[type]} [description]
     */
    setupSortButtons : function() {
      if ( jUtility.isSort() ) {
        jApp.aG().$().find('.tbl-sort').show();
      } else {
        jApp.aG().$().find('.tbl-sort').hide();
      }
    }, // end fn

    /**
     * Toggle Delete Icon Visibility
     * @method function
     * @param  {[type]} $elm [description]
     * @return {[type]}      [description]
     */
    toggleDeleteIcon : function( $elm ) {
      if ( !!$elm.val().toString().trim() ) {
        $elm.next('.deleteicon').show();
      } else {
        $elm.next('.deleteicon').hide();
      }
    }, //end fn

    /**
     * setTimeout helper
     * @method function
     * @param  {[type]}   o.key   [description]
     * @param  {Function} o.fn    [description]
     * @param  {[type]}   o.delay [description]
     * @return {[type]}         [description]
     */
    timeout : function(o) {
      try{
        clearTimeout( jApp.aG().dataGrid.timeouts[o.key] )
      } catch(ignore) {}

      jApp.aG().dataGrid.timeouts[o.key] = setTimeout(o.fn, o.delay );
    }, //end fn

    /**
     * setInterval helper
     * @method function
     * @param  {[type]}   o.key   [description]
     * @param  {Function} o.fn    [description]
     * @param  {[type]}   o.delay [description]
     * @return {[type]}         [description]
     */
    interval : function(o) {
      try{
        clearInterval( jApp.aG().dataGrid.intervals[o.key] )
      } catch(ignore) {}

      jApp.aG().dataGrid.intervals[o.key] = setInterval(o.fn, o.delay );
    }, //end fn

    /**
     * Update Grid from cached data
     * @method function
     * @return {[type]} [description]
     */
    updateGridFromCache : function() {
      jUtility.callback.update( jUtility.getCachedGridData() );
      jUtility.DOM.togglePreloader(true);
      jUtility.buildMenus();
    }, // end fn

    /**
     * Retrieve cached data
     * @method function
     * @return {[type]} [description]
     */
    getCachedGridData : function() {
      return jApp.aG().store.get('data_' + jApp.opts().table);
    }, // end fn


    /**
     * get JSON
     * @method function
     * @param  {[type]} requestOptions [description]
     * @return {[type]}                [description]
     */
    getJSON : function( requestOptions ) {

        var opts = $.extend(true,
          {
            url : null,
            data : {},
            success : function() { },
            fail : function() { },
            always : function() {},
            complete : function() {}
          } , requestOptions );

        jApp.log('6.5 ajax options set, executing ajax request')
        return $.getJSON(opts.url, opts.data, opts.success )
          .fail( opts.fail )
          .always( opts.always )
          .complete( opts.complete );
    }, // end fn

    /**
     * post JSON
     * @method function
     * @param  {[type]} requestOptions [description]
     * @return {[type]}                [description]
     */
    postJSON : function( requestOptions ) {

        var opts = $.extend(true,
          {
            url : null,
            data : {},
            success : function() { },
            fail : function() { },
            always : function() {},
            complete : function() {}
          } , requestOptions );

        return $.ajax({
            url: opts.url,
            data : opts.data,
            success : opts.success,
            type : 'POST',
            dataType : 'json'
          })
          .fail( opts.fail )
          .always( opts.always )
          .complete( opts.complete );
    }, // end fn

    /**
     * Execute the grid data request
     * @method function
     * @return {[type]} [description]
     */
    executeGridDataRequest : function() {
      jApp.log('6.3 Setting up options for the data request')
      var params = $.extend(true,  jApp.aG().dataGrid.requestOptions,
          {
            success : jUtility.callback.update,
            fail 		: jUtility.gridDataRequestCallback.fail,
            always 	: jUtility.gridDataRequestCallback.always,
            complete: jUtility.gridDataRequestCallback.complete
          } ),
          r = jApp.aG().dataGrid.requests;

      // show the preloader
      jUtility.DOM.activityPreloader('show');

      // execute the request
      jApp.log('6.4 Executing ajax request')
      r.gridData = jUtility.getJSON( params );
    }, //end fn

    /**
     * Turn off modal overlays
     * @method function
     * @return {[type]} [description]
     */
    turnOffOverlays : function() {
      jUtility.DOM.overlay(1,'off');
      jUtility.DOM.overlay(2,'off');
    }, //end fn

    /**
     * Attempt to locate jQuery target
     * @method function
     * @param  {[type]} target [description]
     * @return {[type]}        [description]
     */
    locateTarget : function(target, scope) {
      // first look in the grid scope,
      // then the document scope,
      // then look through the window object
      // to see if the target is a member
      // of the global scope e.g. $(window)
      if (typeof scope === 'undefined') {
        return jApp.aG().$().find(target) || $(target) || $(window[target]);
      } else {
        return jApp.aG().$().find(target, scope) || $(target, scope) || $(window[target], scope);
      }
    }, //end fn

    /**
     * Process the event bindings for the grid
     * @method function
     * @return {[type]} [description]
     */
    processGridBindings : function() {
      var events, target, fn, event;

      _.each( jApp.opts().events.grid, function( events, target ) {
        _.each( events, function(fn, event) {
            if (typeof fn === 'function') {
              jUtility.setCustomBinding( target, fn, event )
            }
        });
      })
    }, //end fn

    /**
     * Process the event bindings for the form
     * @method function
     * @return {[type]} [description]
     */
    processFormBindings : function() {
      var events, target, fn, event;

      _.each( jApp.opts().events.form, function( events, target ) {
        _.each( events, function(fn, event) {
            jUtility.setCustomBinding( target, fn, event, '.div-form-panel-wrapper' )
        });
      })
    }, //end fn

    /**
     * Set up a custom event binding
     * @method function
     * @param  {[type]}   event [description]
     * @param  {Function} fn    [description]
     * @return {[type]}         [description]
     */
    setCustomBinding : function( target, fn, event, scope ) {
      var eventKey = event + '.custom-' + $.md5( fn.toString() ),
          $scope = (typeof scope === 'undefined') ? $(document) : $(scope),
          scope = (typeof scope === 'undefined') ? 'document' : scope;

      if ( event === 'boot' ) {
        return (typeof fn === 'function') ? fn() : false;
      }

      if ( !!$(window[target]).length ) {
        $(window[target]).off(eventKey).on(eventKey, fn);
      } else if ( !jUtility.isEventDelegated(target,eventKey,scope) ) {
        $scope.delegate(target, eventKey, fn);
        jUtility.eventIsDelegated(target,eventKey,scope);
      }
    }, // end fn

    /**
     * Has the event been delegated for the target?
     * @method function
     * @param  {[type]} target   [description]
     * @param  {[type]} eventKey [description]
     * @return {[type]}          [description]
     */
    isEventDelegated : function( target, eventKey, scope ) {
      return _.indexOf(jApp.aG().delegatedEvents, scope + '-' + target + '-' + eventKey) !== -1;
    }, // end fn

    /**
     * Mark event delegated
     * @method function
     * @param  {[type]} target   [description]
     * @param  {[type]} eventKey [description]
     * @param  {[type]} scope    [description]
     * @return {[type]}          [description]
     */
    eventIsDelegated : function( target, eventKey, scope) {
      return jApp.aG().delegatedEvents.push( scope + '-' + target + '-' + eventKey );
    }, // end fn

    /**
     * Form boot up function
     * @method function
     * @return {[type]} [description]
     */
    formBootup : function() {
      jUtility.$currentFormWrapper()
        //reset validation stuff
        .find('.has-error').removeClass('has-error').end()
        .find('.has-success').removeClass('has-success').end()
        .find('.help-block').hide().end()
        .find('.form-control-feedback').hide().end()

        //multiselects
        .find('select').addClass('bsms').end()
        .find('.bsms').multiselect(jApp.opts().bsmsDefaults).multiselect('refresh').end()

        .find('[_linkedElmID]').change();
    }, //end fn

    /**
     * Load event bindings for processing
     * @method function
     * @return {[type]} [description]
     */
    loadBindings : function() {
        // form bindings
        jApp.opts().events.form = $.extend(true, {
          // the bind function will assume the scope is relative to the current form
          // unless the key is found in the global scope
          // boot functions will be automatically called at runtime
          "[data-validType='Phone Number']" : {
            keyup : function() {
              $(this).val( formatPhone( $(this).val() ) );
            }
          },

          "[data-validType='Zip Code']" : {
            keyup : function() {
              $(this).val( formatZip( $(this).val() ) );
            }
          },

          "[data-validType='SSN']" : {
            keyup : function() {
              var This = $(this);
              setTimeout( function() {
                This.val( formatSSN( jApp.aG().val() ) );
              }, 200);
            }
          },

          "[data-validType='color']" : {
            keyup : function() {
              $(this).css('background-color',$(this).val());
            }
          },

          "[data-validType='Number']" : {
            change : function() {
              $(this).val( formatNumber( $(this).val() ) );
            }
          },

          "[data-validType='Integer']" : {
            change : function() {
              $(this).val( formatInteger( $(this).val() ) );
            }
          },

          "[data-validType='US State']" : {
            change : function() {
              $(this).val( formatUC( $(this).val() ) );
            }
          },

          "button.close, .btn-cancel" : {
            click : function() {
              if ( jUtility.needsCheckin() )  {
                jUtility.checkin( jUtility.getCurrentRowId() );
              } else {
                jUtility.closeCurrentForm();
              }
            }
          },

          ".btn-go" : {
            click : jUtility.saveCurrentFormAndClose
          },

          ".btn-save" : {
            click : jUtility.saveCurrentForm
          },

          ".btn-reset" : {
            click : jUtility.resetCurrentForm
          },

          ".btn-refreshForm" : {
            click : jUtility.refreshCurrentForm
          },

          "input" : {
            keyup : function(e) {
              e.preventDefault();
              if (e.which === 13) {
                if( jUtility.isConfirmed() ) {
                  jUtility.saveCurrentFormAndClose();
                }
              } else if (e.which === 27) {
                jUtility.closeCurrentForm();
              }
            }
          },

          "#confirmation" : {
            keyup : function() {
              if( $(this).val().toString().toLowerCase() === 'yes' ) {
                jUtility.$currentForm().find('.btn-go').removeClass('disabled');
              } else {
                jUtility.$currentForm().find('.btn-go').addClass('disabled');
              }
            }
          },

          "[_linkedElmID]" : {
            change : function() {
              var This = $(this),
                $col = This.attr('_linkedElmFilterCol'),
                $id	 = This.val(),
                $labels = This.attr('_linkedElmLabels'),
                $options = This.attr('_linkedElmOptions'),
                oFrm = jUtility.oCurrentForm(),
                oElm = oFrm.fn.getElmById( This.attr('_linkedElmID') );


              // set data to always expire;
              oElm.fn.setTTL(-1);
              oElm.jApp.opts().hideIfNoOptions = true;
              oElm.jApp.opts().cache = false;

              oElm.fn.attr( {
                '_optionsFilter' : $col + '=' + $id,
                '_firstoption' : 0,
                '_firstlabel' : '-Other-',
                '_labelsSource' : $labels,
                '_optionsSource' : $options
                } );

              oElm.fn.initSelectOptions(true);

            },
          }

        }, jApp.opts().events.form);

        // grid events
        jApp.opts().events.grid = $.extend(true, {
          // the bind function will assume the scope is relative to the grid
          // unless the key is found in the global scope
          // boot functions will be automatically called at runtime
          window : {
            resize : function() {
              jUtility.timeout( {
                key : 'resizeTimeout',
                fn : jUtility.DOM.updateColWidths,
                delay : 500
              });
            },

            beforeunload : jUtility.unloadWarning,
          },

          ".deleteicon" : {
            click : function() {
              $(this).prev('input').val('').focus().trigger('keyup');
              jUtility.DOM.applyHeaderFilters();
            }
          },

          ".header-filter" : {
            keyup : function() {
              jUtility.toggleDeleteIcon( $(this) );

              jUtility.timeout( {
                key : 'applyHeaderFilters',
                fn : jUtility.DOM.applyHeaderFilters,
                delay : 300
              });

            },

            boot : jUtility.DOM.applyHeaderFilters
          },

          ".tbl-sort" : {
            click : function() {
              var $btn, $btnIndex, $desc

              //button
              $btn = $(this);
              //index
              $btnIndex = $btn.closest('.table-header').index()+1;

              //tooltip
              $btn.attr('title', $btn.attr('title').indexOf('Descending') !== -1 ?
                'Sort Ascending' :
                'Sort Descending'
              ).attr('data-original-title', $btn.attr('title') )
              .tooltip({delay:300});

              //ascending or descending
              $desc = $btn.find('i').hasClass('fa-sort-amount-desc');

              //other icons
              jApp.tbl().find('.tbl-sort i.fa-sort-amount-desc')
                .removeClass('fa-sort-amount-desc')
                .addClass('fa-sort-amount-asc')
                .end()
                .find('.tbl-sort.btn-primary')
                .removeClass('btn-primary');

              //btn style
              $btn.addClass('btn-primary');

              //icon
              $btn.find('i')
                .removeClass( ($desc) ? 'fa-sort-amount-desc' : 'fa-sort-amount-asc')
                .addClass( ($desc) ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc');

              jApp.tbl().find('.table-body .table-row').show();

              // perform the sort on the table rows
              jUtility.DOM.sortByCol( $btnIndex, $desc );
            }
          },

          "[title]" : {
            boot : function() {
              $('[title]').tooltip({delay:300});
            }
          },

          ".btn-readmore" : {
            click : function()  {
              $(this).toggleClass('btn-success btn-warning');
              $(this).siblings('.readmore').toggleClass('active');
            }
          },

          "[name=RowsPerPage]" : {
            change : function() {
              jApp.tbl().find('[name=RowsPerPage]').val( $(this).val() );
              jUtility.DOM.rowsPerPage( $(this).val() );
            },
            boot : function() {
              if ( jUtility.isPagination() ) {
                $('[name=RowsPerPage]').parent().show();
              } else {
                $('[name=RowsPerPage]').parent().hide();
              }
            }
          },

          ".deleteicon" : {
            boot : function() {
              $(this).remove();
            }
          },

          ".chk_all" : {
            change : function() {
              jApp.aG().$().find(':checkbox:visible').prop('checked',$(this).prop('checked'));
            }
          },

          ".chk_cid" : {
            change : function() {
              var $chk_all,	// $checkall checkbox
                $checks,	// $checkboxes
                total_num,	// total checkboxes
                num_checked,// number of checkboxes checked


              $chk_all = jApp.tbl().find('.chk_all');
              $checks = jApp.tbl().find('.chk_cid');
              total_num = $checks.length;
              num_checked = jApp.tbl().find('.chk_cid:checked').length

              // set the state of the checkAll checkbox
              $chk_all
              .prop('checked', (total_num === num_checked) ? true : false )
              .prop('indeterminate', (num_checked > 0 && num_checked < total_num) ? true : false );
            }
          },

          ".btn-new" : {
            click : function() {
              jUtility.actionHelper('new');
            }
          },

          ".btn-edit" : {
            click : function() {
              jUtility.actionHelper('edit');
            }
          },

          ".btn-headerFilters" : {
            click : jUtility.DOM.toggleHeaderFilters
          },

          ".btn-delete" : {
            click : function() {
              jUtility.actionHelper('delete');
            }
          },

          ".btn-refresh" : {
            click : function() {
              $(this).addClass('disabled').delay(2000).removeClass('disabled');
              jUtility.updateAll();
            }
          },

          ".btn-showMenu" : {
            click : jUtility.DOM.toggleRowMenu
          },

          ".table-body" : {
            mouseover : function() {
              $(this).focus();
            }
          },

          ".table-body .table-row" : {
            mouseover : function() {
              var $tr = $(this);

              clearTimeout(jApp.aG().dataGrid.intervals.cancelRowMenuUpdate);
              jApp.aG().dataGrid.intervals.moveRowMenu = setTimeout( function() {
                jApp.tbl().find('.btn-showMenu').removeClass('hover');
                if (jApp.tbl().find('.rowMenu').hasClass('expand') === false) {
                  jApp.tbl().find('.btn-showMenu').removeClass('active');
                }
                $tr.find('.btn-showMenu').addClass('hover');

              }, 250 );
            },

            mouseout : function() {

              var $tr = $(this);
              clearTimeout(jApp.aG().dataGrid.intervals.moveRowMenu);
              jApp.aG().dataGrid.intervals.cancelRowMenuUpdate = setTimeout( function() {
                jApp.tbl().find('.btn-showMenu').removeClass('hover');
                if (!jApp.tbl().find('.rowMenu').hasClass('expand')) {
                  $tr.find('.btn-showMenu').removeClass('active');
                }
                jApp.tbl().find('.rowMenu').removeClass('active');
              }, 100 );
            }
          }
        }, jApp.opts().events.grid);
    }, //end fn

    /**
     * Load Form Definitions
     * @method function
     * @return {[type]} [description]
     */
    loadFormDefinitions : function() {
      jApp.opts().formDefs = $.extend(true, {}, {

        editFrm : {
          table : jApp.opts().table,
          pkey : jApp.opts().pkey,
          tableFriendly : jApp.opts().tableFriendly,
          atts : { method : 'PATCH' },
          disabledElements : jApp.opts().disabledFrmElements,
        },

        newFrm : {
          table : jApp.opts().table,
          pkey : jApp.opts().pkey,
          tableFriendly : jApp.opts().tableFriendly,
          atts : { method : 'POST' },
          disabledElements : jApp.opts().disabledFrmElements
        },

        deleteFrm : {
          table : jApp.opts().table,
          pkey : jApp.opts().pkey,
          tableFriendly : jApp.opts().tableFriendly,
          loadExternal : false,
          atts : { method : 'DELETE' },
          btns : [
            { 'type' : 'button', 'class' : 'btn btn-success btn-go disabled', 	'id' : 'btn_go', 'value' : 'Go' },
            { 'type' : 'button', 'class' : 'btn btn-danger btn-cancel', 'id' : 'btn_cancel', 'value' : 'Cancel' },
          ],
          colParams : [
            { 'type' : 'text', '_label' : 'Type yes to continue', 'name' : 'confirmation', 'id' : 'confirmation'  },
          ],
          fieldset : {
            'legend' : 'Delete Record',
          }
        },

        colParamFrm : {
          table : 'col_params',
          pkey : 'colparam_id',
          tableFriendly : 'Column Parameters',
          btns : [],
          atts : {
            name : 'frm_element_editor',
          },
          fieldset : {
            'legend' : '3. Edit Column Parameters',
          }
        }
      }, jApp.opts().formDefs);
    }, //end fn

    /**
     * Grid data request callback methods
     * @type {Object}
     */
    gridDataRequestCallback : {
      /**
       * Grid data request failed
       * @method function
       * @return {[type]} [description]
       */
      fail : function() {
        console.warn( 'update grid data failed, it may have been aborted' );
      }, //end fn

      /**
       * Always execute after grid data request
       * @method function
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      always : function(response) {
        if (jUtility.isCaching()) {
            jApp.aG().store.set('data_' + jApp.opts().table,response);
        }
        jUtility.DOM.togglePreloader(true);
        jUtility.buildMenus();
      }, // end fn

      /**
       * Grid data request completed
       * @method function
       * @return {[type]} [description]
       */
      complete : function() {
        jUtility.DOM.activityPreloader('hide');
      }, // end fn
    }, // end callbacks

    /**
     * Clear countdown interval
     * @method function
     * @return {[type]} [description]
     */
    clearCountdownInterval : function() {
      try {
        clearInterval( jApp.aG().dataGrid.intervals.countdownInterval );
      } catch(e) {
        // do nothing
      }
    }, // end fn

    /**
     * Set the countdown interval
     * @method function
     * @return {[type]} [description]
     */
    setCountdownInterval : function() {
      jUtility.clearCountdownInterval();
      jApp.aG().dataGrid.intervals.countdownInterval = setInterval( jUtility.updateCountdown,1000 );
    }, // end fn

    /**
     * Clear the get checked out records interval
     * @method function
     * @return {[type]} [description]
     */
    clearGetCheckedOutRecordsIntevrval : function() {
      try {
        clearInterval( jApp.aG().dataGrid.intervals.getCheckedOutRecords );
      } catch(e) {
        // do nothing
      }
    }, // end fn

    /**
     * Set the get checked out records interval
     * @method function
     * @return {[type]} [description]
     */
    setGetCheckedOutRecordsInterval : function() {
      if ( jUtility.isCheckout() ) {
        jUtility.clearGetCheckedOutRecordsIntevrval();
        jApp.aG().dataGrid.intervals.getCheckedOutRecords = setInterval( jUtility.getCheckedOutRecords, 10000 );
      }
    }, // end fn

    /**
     * Update countdown
     * @method function
     * @return {[type]} [description]
     */
    updateCountdown : function() {
      if (jUtility.isFormOpen()) { return false; }

      jApp.tbl().find('button[name=btn_refresh_grid]').find('span').text( (jApp.aG().dataGrid.intervals.countdownTimer > 0) ? Math.floor( jApp.aG().dataGrid.intervals.countdownTimer / 1000) : 0 );
      jApp.aG().dataGrid.intervals.countdownTimer -= 1000;

      if ( jApp.aG().dataGrid.intervals.countdownTimer <= -1000) {
        jUtility.updateAll();
      }

    }, // end fn

    /**
     * Initialize countdown timer value
     * @method function
     * @return {[type]} [description]
     */
    initCountdown : function() {
      jApp.aG().dataGrid.intervals.countdownTimer = jApp.opts().refreshInterval-2000;
    }, // end fn


    /**  **  **  **  **  **  **  **  **  **
     *   ellipsis
     *
     *  Truncates cells that are too long
     *  according to the maxCellLength grid
     *  option. Adds a read-more button to
     *  any cells that are truncated.
     **  **  **  **  **  **  **  **  **  **/
    ellipsis : function( txt ) {
      var $rdMr, $dtch, $btn, $truncated, $e;

      $btn = $('<button/>', {
        'class' : 'btn btn-success btn-xs btn-readmore pull-right',
        'type' : 'button'}
      ).html(' . . . ');

      $e = $('<div/>').html(txt);

      if ( $e.text().length > jApp.opts().maxCellLength ) {
        // look for child html elements
        if ( $e.find(':not(i)').length > 0) {
          $rdMr = $('<span/>', {'class':'readmore'});

          while ( $e.text().length > jApp.opts().maxCellLength ) {
            // keep detaching html elements until the cell length is
            // within allowable limits

            // store detached element
            $dtch = ( !!$e.find(':not(i)').last().parent('h4').length ) ?
              $e.find(':not(i)').last().parent().detach() :
              $e.find(':not(i)').last().detach();

            // append the detached element to the readmore span
            $rdMr.html( $rdMr.html( ) + ' ' ).append($dtch);

            // clean up the element html of extra whitespace
            $e.html( $e.html().replace(/(\s*)?\,*(\s*)?$/ig,'') );
          }

          $e.append($rdMr).prepend($btn);
        }// end if

        // all text, no child html elements in the cell
        else {
          // place the extra text in the readmore span
          $rdMr = $('<span/>', {'class':'readmore'})
            .html( $e.html().substr(jApp.opts().maxCellLength) );

          // truncate the visible text in the cell
          $truncated = $e.html().substr(0,jApp.opts().maxCellLength);

          $e.empty().append($truncated).append($rdMr).prepend($btn);
        } // end else
      }// end if

      return $e.html();

    }, // end fn

    /**
     * Set up HTML templates
     * @method function
     * @return {[type]} [description]
     */
    setupHtmlTemplates : function() {
      /**
       *   HTML TEMPLATES
       *
       *  Place large html templates here.
       *  These are rendered with
       *  the method jUtility.render.
       *
       *  Parameters of the form {@ParamName}
       *  are expanded by the render function
       */
      jApp.aG().html = $.extend(true, {}, {

        // main grid body
        tmpMainGridBody : '<div class="row"> <div class="col-lg-12"> <div class="panel panel-info panel-grid panel-grid1"> <div class="panel-heading"> <h1 class="page-header"><i class="fa {@icon} fa-fw"></i><span class="header-title"> {@headerTitle} </span></h1> <div class="alert alert-warning alert-dismissible helpText" role="alert"> <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> {@helpText} </div> </div> <div class="panel-body grid-panel-body"> <div class="table-responsive"> <div class="table table-bordered table-grid"> <div class="table-head"> <div class="table-row"> <div class="table-header" style="width:100%"> <div class="btn-group btn-group-sm table-btn-group">  </div> </div> </div> <div class="table-row tfilters" style="display:none"> <div style="width:10px;" class="table-header">&nbsp;</div> <div style="width:175px;" class="table-header" align="right"> <span class="label label-info filter-showing"></span> </div> </div> </div> <div class="table-body" id="tbl_grid_body"> <!--{$tbody}--> </div> <div class="table-foot"> <div class="row"> <div class="col-md-3"> <div style="display:none" class="ajax-activity-preloader pull-left"></div> <div class="divRowsPerPage pull-right"> <select style="width:180px;display:inline-block" type="select" name="RowsPerPage" id="RowsPerPage" class="form-control"> <option value="10">10</option> <option value="15">15</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option> <option value="10000">All</option> </select> </div> </div> <div class="col-md-9"> <div class="paging"></div> </div> </div> </div> <!-- /. table-foot --> </div> </div> <!-- /.table-responsive --> </div> <!-- /.panel-body --> </div> <!-- /.panel --> </div> <!-- /.col-lg-12 --> </div> <!-- /.row -->',

        // check all checkbox template
        tmpCheckAll	: '<div class="btn-group btn-group-sm"> <label for="chk_all" class="btn btn-default"> <input type="checkbox" class="chk_all" name="chk_all"> </label> <button title="Do With Selected" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> &nbsp;<span class="caret"></span> </button> <ul class="with-selected-menu dropdown-menu" role="menu"> {@WithSelectedOptions} </ul></div>',

        // header filter clear text button
        tmpClearHeaderFilterBtn : '<div class="btn-group btn-group-sm"> <label for="chk_all" class="btn btn-default"> <input type="checkbox" class="chk_all" name="chk_all"> </label> <button title="Do With Selected" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> &nbsp;<span class="caret"></span> </button> <ul class="with-selected-menu dropdown-menu" role="menu"> {@WithSelectedOptions} </ul> </div>',

        // filter showing ie Showing X / Y Rows
        tmpFilterShowing : '<i class="fa fa-filter fa-fw"></i>{@totalVis} / {@totalRows}',

        // table header sort button
        tmpSortBtn : '<button rel="{@ColumnName}" title="{@BtnTitle}" class="btn btn-sm btn-default {@BtnClass} tbl-sort pull-right" type="button"> <i class="fa fa-sort-{@faClass} fa-fw"></i> </button> ',

        // form templates
        forms : {

          // Edit Form Template
          editFrm	: '<div id="div_editFrm" class="div-btn-edit min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-blue"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-pencil fa-fw"></i> <span class="spn_editFriendlyName">{@Name}</span> [Editing] </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side"> <div class="side-by-side editFormContainer formContainer"> </div> </div> </div> </div> </div> </div>',

          // New Form Template
          newFrm	: '<div id="div_newFrm" class="div-btn-new min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-green"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-plus fa-fw"></i> New: <span class="spn_editFriendlyName">{@tableFriendly}</span> </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side"> <div class="side-by-side newFormContainer formContainer"> </div> </div> </div> </div> </div> </div> ',

          // Delete Form Template
          deleteFrm	: '<div id="div_deleteFrm" class="div-btn-delete min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-red"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-trash-o fa-fw"></i> <span class="spn_editFriendlyName"></span> : {@deleteText} </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side"> <div class="delFormContainer formContainer"></div> </div> </div> </div> </form> </div> </div> ',

          // Colparams Form Template
          colParamFrm	: '<div id="div_colParamFrm" class="div-btn-other min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-lblue"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-gear fa-fw"></i> <span class="spn_editFriendlyName">Form Setup</span> </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body" style="padding:0 0px !important;"> <div class="row side-by-side"> <div class="col-lg-3 tbl-list"></div> <div class="col-lg-2 col-list"></div> <div class="col-lg-7 param-list"> <div class="side-by-side colParamFormContainer formContainer"> </div> </div> </div> </div> <div class="panel-heading"> <input type="button" class="btn btn-success btn-save" id="btn_save" value="Save"> <input type="button" class="btn btn-warning btn-reset" id="btn_reset" value="Reset"> <input type="button" class="btn btn-warning btn-refreshForm" id="btn_refresh" value="Refresh Form"> <input type="button" class="btn btn-danger btn-cancel" id="btn_cancel" value="Cancel"> </div> </div> </div> </div>',
        }
      }, jApp.opts().html);

      jApp.log('2.1 HTML Templates Done')

    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   render
     *
     *  @str   (string) containing
     *  		multiline text
     *
     *  @params (obj) contains key/value pairs
     *  		  defining parameters that
     *  		  will be interpolated in
     *  		  the returned text
     *
     *  returns the interpolated text
     **  **  **  **  **  **  **  **  **  **/
    render : function(str,params) {
      var ptrn, key, val;

      //if (typeof params !== 'object') return '';

      _.each( params, function(val, key) {
        ptrn = new RegExp( '\{@' + key + '\}', 'gi' );
        str = str.replace(ptrn, val );
      })

      return str.replace(/\{@.+\}/gi,'');
    }, //end fn

    /**  **  **  **  **  **  **  **  **  **
     *   interpolate
     *
     *  @value (str) string to be interpolated
     *
     *  @return (str) the interpolated string
     *
     *  recursively processes the input value and
     *  replaces parameters of the form
     *  {@ParamName} with the corresponding
     *  value from the JSON data. Uses the
     *  replace callbak jUtility.replacer.
     *
     *  e.g. {@ParamName} -> jApp.aG().dataGrid.data[row][ParamName]
     **  **  **  **  **  **  **  **  **  **/
    interpolate : function(value) {
      return value.replace(/\{@(\w+)\}/gi, jUtility.replacer)
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   replacer - RegExp replace callback
     *
     *  @match 	(str) the match as defined
     *  			by the RegExp pattern
     *  @p1	  	{str} the partial match as
     *  			defined by the first
     *  			capture group
     *  @offset	(int) the offset where the
     *  			match was found in @string
     *  @string	(str) the original string
     *
     *  @return	(str) the replacement string
     **  **  **  **  **  **  **  **  **  **/
    replacer : function(match, p1, offset, string) {
      return jApp.aG().currentRow[p1];
    }, // end fn

    /**
     * Get the rows that match the header filter text
     * @method function
     * @return {[type]} [description]
     */
    getHeaderFilterMatchedRows : function() {
      var columnOffset = (jUtility.isEditable()) ? 3 : 2,
          currentColumn,
          currentMatches,
          matchedRows = [],
          targetString


      //iterate through header filters and apply each
      jApp.tbl().find('.header-filter').each( function(i) {
        if ( !$(this).val().toString().trim() ) return false;

        // calculate the index of the current column
        currentColumn = +(i + columnOffset);

        // set the target string for the current column
        // note: using a modified version of $.contains that is case-insensitive
        targetString = ".table-row .table-cell:nth-child(" + currentColumn + "):contains('" + $(this).val() + "')";

        // find the matched rows in the current column
        currentMatches = jApp.tbl().find(targetString)
                            .parent()
                            .map( function(i, obj) { return $(obj).index(); })
                            .get();

        // if matchedRows is non-empty, find the intersection of the
        // matched rows and the current rows - ie the rows that match
        // all of the criteria processed so far.
        matchedRows = (!matchedRows.length) ?
          currentMatches :
          _.intersection(matchedRows,currentMatches);

      });

      return matchedRows;

    }, //end fn

    /**
     * Sets the rows that are visible
     * @param  {array} visibleRows [indexes of the visible rows]
     * @return {[type]}             [description]
     */
    setVisibleRows : function( visibleRows ) {
      // show appropriate rows
      jApp.tbl().find('.table-body .table-row').hide()
         .filter( function(i) {
           return _.indexOf(visibleRows, i) !== -1;
      }).show();
    }, // end fn

    /**
     * Are Header Filters Non-empty
     * @method function
     * @return {[type]} [description]
     */
    areHeaderFiltersNonempty : function() {
      return !!jApp.tbl().find('.header-filter').filter( function() {
        return !!this.value;
      }).length
    }, //end fn

    /**  **  **  **  **  **  **  **  **  **
     *   prepareValue
     *
     *  @value 	(str) the column value as
     *  		specified in the JSON
     *  		data
     *  @column (str) the column name as
     *  		specified in the JSON
     *  		data
     *
     *  @return (str) the prepared value
     *
     *  prepares the value for display in
     *  the DOM, applying a template
     *  function if applicable.
     **  **  **  **  **  **  **  **  **  **/
    prepareValue : function(value,column) {
      var template;

      if (typeof value === 'undefined') {
        value = '';
      }

      if (value.toString().toLowerCase() === 'null') {
        return '';
      }

      if (typeof jApp.opts().templates[column] === 'function') {
        template = jApp.opts().templates[column];
        value = template(value);
      }

      if (value.toString().trim() === '') {
        return '';
      }

      if (value.toString().indexOf('|') !== -1) {
        value = value.replace(/\|/gi,', ');
      }

      if ( jUtility.isEllipses() ) {
        value = jUtility.ellipsis( value );
      }

      return value;
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   deltaData
     *
     *  @prev (obj) previous state of object
     *  @now  (obj) current state of object
     *
     *  computes and returns the difference
     *  between two objects
     **  **  **  **  **  **  **  **  **  **/
    deltaData : function(prev, now) {
      var changes = {}, prop, c;
      $.each(now, function( i, row) {
        if (typeof prev[i] === 'undefined') {
          changes[i] = row;
        } else {
          $.each( row, function( prop, value) {
            if (prev[i][prop] !== value) {
              if (typeof changes[i] === 'undefined') {
                changes[i] = {};
              }
              changes[i][prop] = value;
            }
          })
        }
      })
      if ($.isEmptyObject(changes)) {
        return false;
      }
      return changes;

    }, // end fn

    /**
     * Checkout record
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    checkout : function(id) {
      jUtility.getJSON( {
        url : '/checkout/_' + jApp.opts().model + '_' + id,
        success : jUtility.callback.checkout
      });
    }, // end fn

    /**
     * Checkin record
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    checkin : function(id) {
      jUtility.getJSON({
        url : '/checkin/_' + jApp.opts().model + '_' + id,
        success : jUtility.callback.checkin
      });
    }, // end fn

    /**
     * Get all checked out records
     * @return {[type]} [description]
     */
    getCheckedOutRecords : function() {
      jUtility.getJSON({
        url : '/checkedout/_' + jApp.opts().model,
        success : jUtility.callback.getCheckedOutRecords
      });
    }, // end fn

    /**
     * Set initial parameters
     * @method function
     * @return {[type]} [description]
     */
    setInitParams : function() {
      var ag = jApp.aG();

      /**
       * Placeholders
       */
      ag = $.extend( ag, {
        action : 'new',
        store : $.jStorage,
        currentRow : {},
        dataGrid : {

          // pagination parameters
          pagination : {
            totalPages : -1,
            rowsPerPage : $.jStorage.get('pref_rowsPerPage',ag.options.rowsPerPage)
          },

          // ajax requests
          requests : [],

          // request options
          requestOptions : {
            url : ag.options.url,
            data : {
              filter : ag.options.filter,
              filterMine : 0
            }
          },

          // intervals
          intervals : {},

          // timeouts
          timeouts : {},

          // grid data
          data : {},

          // data delta (i.e. any differences in the data)
          delta : {},
        }, // end dataGrid

        DOM : {
          $grid : false,
          $currentRow : false,
          $tblMenu : false,
          $rowMenu : $('<div/>', { class : 'btn-group rowMenu', style : 'position:relative !important' }),
          $withSelectedMenu : $('<div/>'),
        },

        forms : {},
        linkTables : [],
        temp : {},

      });

      jApp.log('3.1 Initial Params Set')
    }, // end fn

    /**
     * Get checked items
     * @method function
     * @return {[type]} [description]
     *
     *  $cid = self.DOM.$grid.find('.chk_cid:checked').map( function(i,elm) {
       return $(elm).closest('.table-row').attr('data-identifier');
     }).get(); jUtility.withSelectedAction(action,callback, $cid);
     */
    getCheckedItems : function( includeHidden ) {
      var selector = (!!includeHidden) ? '.chk_cid:checked' : '.chk_cid:checked:visible';

      return $('.table-grid').find( selector ).map( function(i, elm) {
        return $(elm).closest('.table-row').attr('data-identifier');
      }).get();

    }, // end fn

    /**
     * Are any invisible items checked
     * @method function
     * @return {[type]} [description]
     */
    numInvisibleItemsChecked : function() {
      return jApp.tbl().find('.chk_cid:checked:not(:visible)').length;
    }, // end fn

    /**
     * Determine if invisible checked items
     *  should be included in the operation
     * @method function
     * @return {[type]} [description]
     */
    confirmInvisibleCheckedItems : function(action, callback) {
      bootbox.dialog({
          message: "There are  " + jUtility.numInvisibleItemsChecked() + " items which are checked and are currently not displayed. Include hidden items in the operation?",
          title: "Include Hidden Checked Items?",
          buttons: {
            yes: { label: "Include Hidden Items", className: "btn-primary", callback: function() { return jUtility.withSelectedAction(action,callback,true); } },
            no:  { label: "Do Not Include Hidden Items", className: "btn-warning", callback: function() { return jUtility.withSelectedAction(action,callback,false); } },
            cancel : { label : "Cancel Operation", className : "btn-danger", callback: function() { return false } }
          }
        });

    }, // end fn

    /**
     * Initialize the grid template
     * @method function
     * @return {[type]} [description]
     */
    initializeTemplate : function() {
      jUtility.DOM.emptyPageWrapper();
      jApp.log('5.1 Page Wrapper Emptied')
      jUtility.DOM.initGrid();
      jApp.log('5.2 Grid Initialized')
    },

    /**
     * Setup grid intervals
     * @method function
     * @return {[type]} [description]
     */
    setupIntervals : function() {
      if ( jUtility.isAutoUpdate() ) {
        jUtility.setCountdownInterval();

        if ( jUtility.isCheckout() ) {
          jUtility.setGetCheckedOutRecordsInterval();
        }
      }
    },

    /**
     * Build all grid menus
     * @method function
     * @return {[type]} [description]
     */
    buildMenus : function() {
      jUtility.DOM.clearMenus();

      jUtility.setupVisibleColumnsMenu();
      jUtility.DOM.buildBtnMenu( jApp.opts().tableBtns, jApp.aG().DOM.$tblMenu );
      jUtility.DOM.buildBtnMenu( jApp.opts().rowBtns, jApp.aG().DOM.$rowMenu);
      jUtility.DOM.buildLnkMenu( jApp.opts().withSelectedBtns, jApp.aG().DOM.$withSelectedMenu );
    }, // end fn

    /**
     * Build all grid forms
     * @method function
     * @return {[type]} [description]
     */
    buildForms : function() {
      jUtility.loadFormDefinitions();

      _.each( jApp.opts().formDefs, function( o, key ) {
        jUtility.DOM.buildForm( o, key );
      });

    },

    /**  **  **  **  **  **  **  **  **  **
     *   linkTables
     *
     *  iterates through the linktable
     *  definitions in the options and
     *  adds the appropriate elements to the
     *  forms
     **  **  **  **  **  **  **  **  **  **/
    linkTables : function() {
      var oLT;
      _.each( jApp.opts().linkTables, function(o,key) {
        o.callback = jUtility.callback.linkTables;
        oLT = new jLinkTable( o );
      });
    }, // end fn

    /**
     * Sets up the countdown that displays
     *  the time remaining until the next
     *  refresh
     * @return {[type]} [description]
     */
    countdown : function( ) {
      if ( !jUtility.isAutoUpdate() ) {
        return false;
      }

      jUtility.clearCountdownInterval();
      jUtility.initCountdown();
      jUtility.setCountdownInterval();
    }, // end fn

    /**
     * Update all the grids currently on the page
     * @return {[type]} [description]
     */
    updateAll : function() {
      jUtility.getGridData();
    }, //end fn

    /**
     * get the grid data
     * @method function
     * @param  {[type]} preload [description]
     * @return {[type]}         [description]
     */
    getGridData : function( preload ) {
      // show the preload if needed
      if (!!preload) {
        jUtility.DOM.togglePreloader();
        jUtility.setupIntervals();
      }

      jApp.log('6.1 Starting Countdown timer')
      // start the countdown timer
      jUtility.countdown();

      // kill the pending request if it's still going
      jUtility.killPendingRequest('gridData');

      // use cached copy, if available
      if ( jUtility.isDataCacheAvailable() ) {
        jApp.log('6.2 Updating grid from cache')
        setTimeout( jUtility.updateGridFromCache(), 100);
      } else {
        jApp.log('6.2 Executing data request')
        jUtility.executeGridDataRequest();
      }
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   oCurrentForm
     *
     *  returns the currently active form
     *  or false if the current action is
     *  a non-standard action.
     *
     *  @return jForm (obj) || false
     *
     **  **  **  **  **  **  **  **  **  **/
    oCurrentForm : function() {
      var key;

      if (!! (key = _.findKey( jApp.aG().forms, function(o, key) {
        if (key.indexOf('o') !== 0) return false;
        return key.toLowerCase().indexOf( jApp.aG().action.toString().toLowerCase() ) !== -1;
      }) )) {
        return jApp.aG().forms[key];
      } else {
        console.warn( 'There is no valid form associated with the current action' );
        return false;
      }
    },

    /**  **  **  **  **  **  **  **  **  **
     *   $currentForm
     *
     *  returns the currently active form
     *  jQuery handle or false if the current
     *  action is a non-standard action.
     *
     *  @return jQuery (obj) || false
     *
     **  **  **  **  **  **  **  **  **  **/
    $currentForm : function() {
      try {
        return jUtility.oCurrentForm().$()
      } catch(e) {
        console.warn('No current form object found');
        return false
      }
    },


    /**  **  **  **  **  **  **  **  **  **
     *   $currentFormWrapper
     *
     *  returns the currently active form
     *  wrapper jQuery handle or false
     *  if the current action is a non-
     *  standard action.
     *
     *  @return jQuery (obj) || false
     *
     **  **  **  **  **  **  **  **  **  **/
    $currentFormWrapper : function() {
      try {
        return jUtility.$currentForm().closest('.div-form-panel-wrapper');
      } catch(e) {
        console.warn('No current form wrapper found');
        return false;
      }
    },

    /**  **  **  **  **  **  **  **  **  **
     *   bind
     *
     *  binds event handlers to the various
     *  DOM elements.
     **  **  **  **  **  **  **  **  **  **/
    bind : function() {
      jUtility.setupBootpag();
      jUtility.setupSortButtons();
      jUtility.turnOffOverlays();
      jUtility.loadBindings();
      jUtility.setupHeaderFilters();
      jUtility.processGridBindings();
      jUtility.processFormBindings();
    }, // end bind fn

    /**  **  **  **  **  **  **  **  **  **
     *   setupFormContainer
     *
     *  When a rowMenu button is clicked,
     *  this function sets up the
     *  corresponding div
     **  **  **  **  **  **  **  **  **  **/
    setupFormContainer : function() {
      jUtility.DOM.overlay(2,'on');
      jApp.aG().hideOverlayOnError = false;
      jUtility.resetCurrentForm();
      jUtility.maximizeCurrentForm();
      jUtility.setCurrentFormFocus();
      jUtility.formBootup();
      jUtility.getCurrentFormRowData();
    }, // end fn


    /**
     * Messaging functions
     * @type {Object}
     */
    msg : {

			/**
			 * Clear all messages
			 * @method function
			 * @return {[type]} [description]
			 */
			clear : function() {
					$.noty.closeAll();
			}, // end fn

			/**
			 * Show a message
			 * @method function
			 * @param  {[type]} message [description]
			 * @param  {[type]} type    [description]
			 * @return {[type]}         [description]
			 */
			show : function(message, type) {
				var n = noty({
					layout: 'bottomLeft',
					text : message,
					type : type || 'info',
					dismissQueue: true,
					timeout : 3000
				})
			},

			/**
			 * Display a success message
			 * @method function
			 * @param  {[type]} message [description]
			 * @return {[type]}         [description]
			 */
			success : function(message) {
				jUtility.msg.show(message,'success');
			}, // end fn

			/**
			 * Display a error message
			 * @method function
			 * @param  {[type]} message [description]
			 * @return {[type]}         [description]
			 */
			error : function(message) {
				jUtility.msg.show(message,'error');
			}, // end fn

			/**
			 * Display a warning message
			 * @method function
			 * @param  {[type]} message [description]
			 * @return {[type]}         [description]
			 */
			warning : function(message) {
				jUtility.msg.show(message,'warning');
			}, // end fn

		},

    /**
     * DOM Manipulation Functions
     * @type {Object}
     */
    DOM : {

      /**
       * Hide header filters
       * @method function
       * @return {[type]} [description]
       */
      hideHeaderFilters : function() {
        jApp.aG().$().find('.table-head .tfilters').slideUp();
        $('#btn_toggle_header_filters').removeClass('active');
      }, // end fn

      /**
       * Show header filters
       * @method function
       * @return {[type]} [description]
       */
      showHeaderFilters : function() {
        jApp.aG().$().find('.table-head .tfilters').slideDown();
        $('#btn_toggle_header_filters').addClass('active');
      }, // end fn

      /**
       * Updates the grid when there is
       * or is not any data
       * @method function
       * @param  {Boolean} isDataEmpty [description]
       * @return {[type]}              [description]
       */

      dataEmptyHandler : function(isDataEmpty) {
        if ( isDataEmpty ) {
          $('.table-cell.no-data').remove();
          $('<div/>', { class : 'table-cell no-data'}).html('<div class="alert alert-warning"> <i class="fa fa-fw fa-warning"></i> I did not find anything matching your query.</div>').appendTo( jApp.tbl().find('#tbl_grid_body') );
        } else {
          $('.table-cell.no-data').remove();
        }
      }, // end fn

      /**
       * Update the header title
       * @param  {[type]} newTitle [description]
       * @return {[type]}          [description]
       */
      updateHeaderTitle : function(newTitle) {
        jApp.opts().gridHeader.headerTitle = newTitle;
        jApp.tbl().find('span.header-title').html(newTitle);
      }, // end fn

      /**
       * Toggle column visibility
       * @param  {[type]} elm [description]
       * @return {[type]}     [description]
       */
      toggleColumnVisibility : function( elm ) {
        var col = elm.data('column'),
          i = +elm.closest('li').index()+2;

        if (elm.find('i').hasClass('fa-check-square-o')) {
          elm.find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
          jApp.tbl().find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i +'), .table-body .table-cell:nth-child(' + i +')').hide();
        } else {
          elm.find('i').addClass('fa-check-square-o').removeClass('fa-square-o');
          jApp.tbl().find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i +'), .table-body .table-cell:nth-child(' + i +')').show();
        }

        jUtility.DOM.updateColWidths();

      }, //end fn

      /**  **  **  **  **  **  **  **  **  **
       *   rowsPerPage
       *
       *  @rowsPerPage (int) hide the preloader
       *
       *  show/hide the preload animation
       **  **  **  **  **  **  **  **  **  **/
      rowsPerPage : function( rowsPerPage ) {
        if ( isNaN(rowsPerPage) ) return false;

        jApp.aG().store.set('pref_rowsPerPage',rowsPerPage);
        jApp.opts().pageNum = 1;
        jApp.aG().dataGrid.pagination.rowsPerPage = Math.floor(rowsPerPage);
        jUtility.updatePagination();
        jUtility.DOM.page(1);
        jUtility.DOM.updateColWidths();
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   preload
       *
       *  @hide (bool) hide the preloader
       *
       *  show/hide the preload animation
       **  **  **  **  **  **  **  **  **  **/
      togglePreloader : function( hide ) {
        if (typeof hide === 'undefined') { hide = false; }

        if (!hide) {
          jApp.tbl().css('background','url("/images/tbody-preload.gif") no-repeat center 175px rgba(0,0,0,0.15)')
           .find('[name=RowsPerPage],[name=q]').prop('disabled',true).end()
           .find('.table-body').css('filter','blur(1px) grayscale(100%)').css('-webkit-filter','blur(2px) grayscale(100%)') .css('-moz-filter','blur(2px) grayscale(100%)')
           //.find('.table-cell, .table-header').css('border','1px solid transparent').css('background','none');
        } else {
          jApp.tbl().css('background','')
           .find('[name=RowsPerPage],[name=q]').prop('disabled',false).end()
           .find('.table-body').css('filter','').css('-webkit-filter','').css('-moz-filter','')
           //.find('.table-cell, .table-header').css('border','').css('background','');
        }
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   page
       *
       *  @pageNum (int) the new page number
       *  				to display
       *
       *  jumps to the desired page number
       **  **  **  **  **  **  **  **  **  **/
      page : function( pageNum ) {
        var first, last;

        jUtility.DOM.togglePreloader();

        if (isNaN(pageNum)) return false;
        pageNum = Math.floor(pageNum);

        jApp.opts().pageNum = pageNum;
        first = +( (pageNum-1) * jApp.aG().dataGrid.pagination.rowsPerPage );
        last  = +(first+jApp.aG().dataGrid.pagination.rowsPerPage);
        jApp.tbl().find('.table-body .table-row').hide().slice(first,last).show();

        // set col widths
        setTimeout(	jUtility.DOM.updateColWidths, 100 );
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   updatePanelHeader
       *
       *  @text	(string) text to display
       *
       *  updates the text display in the
       *  header of the form wrapper
       *
       **  **  **  **  **  **  **  **  **  **/
      updatePanelHeader : function(text) {
        jUtility.$currentFormWrapper().find('.spn_editFriendlyName').html( text );
      }, // end fn

      /**
       * Remove rows from the DOM that do not have corresponding data
       * @param  {[type]} all [description]
       * @return {[type]}     [description]
       */
      removeRows : function(all) {
        var identifiers = _.pluck(jApp.aG().dataGrid.data, jApp.opts().pkey);

        if (typeof all !== 'undefined' && all) {
          jApp.tbl().find('.table-body .table-row').remove();
        } else {
          jApp.aG().DOM.$rowMenu.detach();

          jApp.tbl().find('.table-row[data-identifier]')
             .filter( function(i, row) {
                return _.indexOf( identifiers, $(row).attr('data-identifier') ) === -1;
             }
          ).remove();
        }
      }, // end fn

      /**
       * Apply the header filters
       * @method function
       * @return {[type]} [description]
       */
      applyHeaderFilters : function() {
        var matchedRows = [];

        if ( !jUtility.areHeaderFiltersNonempty() ) {
          return jUtility.DOM.removeHeaderFilters();
        }

        jUtility.DOM.hidePaginationControls();

        matchedRows = jUtility.getHeaderFilterMatchedRows();

        jUtility.setVisibleRows( matchedRows );

        jApp.tbl().find('.filter-showing').html(
             jUtility.render( jApp.aG().html.tmpFilterShowing,
               {
                 'totalVis' : matchedRows.length,
                 'totalRows' : jApp.tbl().find('.table-body .table-row').length
               }
              )
           );

        // update column widths
        jUtility.DOM.updateColWidths();

      }, // end fn

      /**
       * Remove the header filters
       * @method function
       * @return {[type]} [description]
       */
      removeHeaderFilters : function() {
        if ( jUtility.isPagination() ) {
          jUtility.DOM.showPaginationControls();
          jUtility.DOM.updateFilterText('');
          jUtility.DOM.page(jApp.opts().pageNum);
        }
      }, // end fn

      /**
       * Update the Showing x/x filter text
       * @method function
       * @param  {[type]} text [description]
       * @return {[type]}      [description]
       */
      updateFilterText : function(text) {
        jApp.tbl().find('.filter-showing').html( text );
      }, // end fn

      /**
       * Show the pagination controls
       * @method function
       * @return {[type]} [description]
       */
      showPaginationControls : function() {
        jApp.tbl().find('.divRowsPerPage, .paging').show();
      }, // end fn

      /**
       * Hide the pagination controls
       * @method function
       * @return {[type]} [description]
       */
      hidePaginationControls : function() {
        jApp.tbl().find('.divRowsPerPage, .paging').hide();
      }, // end fn

      /**
       * Header Filter Delete Icons
       * @method function
       * @return {[type]} [description]
       */
      headerFilterDeleteIcons : function() {
        $('.header-filter').after(
          $('<span/>', {'class':'deleteicon','style':'display:none'})
          .html(
            jUtility.render( jApp.aG().html.tmpClearHeaderFilterBtn )
          )
        )
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   sortByCol
       *
       *  @colNum (int) the 1-indexed html
       *  			column to sort by
       *
       *  @desc 	(bool) sort descending
       *
       *  sorts the table rows in the DOM
       *  according the the input column
       *  and direction (asc default)
       **  **  **  **  **  **  **  **  **  **/
      sortByCol : function( colNum, desc ) {
        var $col;

        //col
        $col = jApp.tbl().find('.table-body .table-row .table-cell:nth-child(' + colNum + ')')
          .map( function(i,elm) {
            return [[
                  $(elm).text().toLowerCase(),
                  $(elm).parent()
                ]];
          })
          .sort(function(a,b) {

            if (jQuery.isNumeric(a[0]) && jQuery.isNumeric(b[0])) {
              return a[0]-b[0];
            }

            if (a[0] > b[0]) {
              return 1;
            }

            if (a[0] < b[0]) {
              return -1;
            }

            // a must be equal to b
            return 0;
          }
        );

        // iterate through col
        $.each($col, function(i,elm){
          var $e = $(elm[1]);

          // detach the row from the DOM
          $e.detach();

          // attach the row in the correct order
          (!desc) ?
            jApp.tbl().find('.table-body').append( $e ) :
            jApp.tbl().find('.table-body').prepend( $e );
        });

        // go to the appropriate page to refresh the view
        jUtility.DOM.page( jApp.opts().pageNum );

        // apply header filters
        jUtility.DOM.applyHeaderFilters()
      }, // end fn

      /**
       * Hide or show the activity preloader
       * @method function
       * @param  {[type]} action [description]
       * @return {[type]}        [description]
       */
      activityPreloader : function( action ) {
        if (action !== 'hide') {
          $('.ajax-activity-preloader').show();
        } else {
          $('.ajax-activity-preloader').hide();
        }
      }, //end fn

      /**
       * Empty the page wrapper div
       * @method function
       * @return {[type]} [description]
       */
      emptyPageWrapper : function() {
        $('#page-wrapper').empty();
      }, //end fn

      /**
       * Toggle header filters
       * @method function
       * @return {[type]} [description]
       */
      toggleHeaderFilters : function() {
        jApp.log('headerFilters toggled');

        jApp.opts().toggles.headerFiltersDisplay =
          !jApp.opts().toggles.headerFiltersDisplay;

        if ( $('.tfilters:visible').length ) {
          jUtility.DOM.hideHeaderFilters();
        } else {
          jUtility.DOM.showHeaderFilters();
        }

        jUtility.DOM.updateColWidths();
      }, //end fn

      /**
       * Update column widths
       * @method function
       * @return {[type]} [description]
       */
      updateColWidths : function() {
        var headerRowIndex = 2,
            bottomOffset = 0;

        if ( !jUtility.isHeaderFiltersDisplay() ) {
          $('.grid-panel-body').css('marginTop',330);
          bottomOffset += 50;
        } else {
          $('.grid-panel-body').css('marginTop','');
        }

        // if ( !$('.paging:visible').length ) {
        //   bottomOffset += 10;
        // }

        if (typeof jApp.aG().tableBodyInitialOffset === 'undefined') {
          jApp.aG().tableBodyInitialOffset = $('.table-body').offset().top;
          console.log( jApp.aG().tableBodyInitialOffset );
        }

        jUtility.setupSortButtons();

        // set column widths
        $('.grid-panel-body .table-row').find('.table-cell, .table-header').css('width','');

        // table height
        if( !$('#page-wrapper').hasClass('scrolled') ) {
          $('.grid-panel-body .table').css('height',+$(window).height()-425+bottomOffset);
        } else {
          $('.grid-panel-body .table').css('height',+$(window).height()-290+bottomOffset);
        }

        // perfect scrollbar
        $('.table-grid').perfectScrollbar('update');

        //add scroll listener
        $('.table-grid').off('scroll.custom').on('scroll.custom', function() {
          if ( typeof jApp.aG().scrollTimeout !== 'undefined' ) {
            clearInterval(jApp.aG().scrollTimeout);
          }
          jApp.aG().scrollTimeout = setTimeout( function() {
            if ( !$('#page-wrapper').hasClass('scrolled') && jApp.aG().tableBodyInitialOffset - $('.table-body').offset().top > 75 ) {
              // table height
              $('#page-wrapper').addClass('scrolled');
              $('.grid-panel-body .table').animate(
                { 'height' : +$(window).height()-290+bottomOffset },
                500,
                'linear',
                function() { $('.table-grid').perfectScrollbar('update'); }
              );
            } else if ( $('#page-wrapper').hasClass('scrolled') && jApp.aG().tableBodyInitialOffset - $('.table-body').offset().top < 150  ) {
              $('#page-wrapper').removeClass('scrolled');
              // table height
              $('.grid-panel-body .table').animate(
                {'height' : +$(document).height()-425+bottomOffset},
                300,
                'linear',
                function() { $('.table-grid').perfectScrollbar('update'); }
              );
            }
          }, 300)
        });

        jApp.opts().maxColWidth =  +350/1920 * +$(window).innerWidth();




        //visible columns
        var visCols = +$('.table-head .table-row').eq( headerRowIndex ).find('.table-header:visible').length-1;

        for(var ii=1; ii <= visCols; ii++ ) {

          var colWidth = Math.max.apply( Math, $('.grid-panel-body .table-row').map(function(i) {
            return $(this).find('.table-cell:visible,.table-header-text:visible').eq(ii).innerWidth() } ).get()
          );

          if ( +colWidth > jApp.opts().maxColWidth && ii < visCols ) {
            colWidth = jApp.opts().maxColWidth;
          }

          if ( ii == visCols ) {
            colWidth = +$(window).innerWidth()-$('.table-head .table-row').eq(headerRowIndex).find('.table-header:visible').slice(0,-1).map( function(i) { return $(this).innerWidth() } ).get().reduce( function(p,c) { return p+c } )-40;
          }

          var nindex = +ii+1;

          // set widths of each cell
          $(  '.grid-panel-body .table-row:not(.tr-no-data) .table-cell:visible:nth-child(' + nindex + '),' +
            '.grid-panel-body .table-row:not(.tr-no-data) .table-header:nth-child(' + nindex + ')').css('width',+colWidth+14);

          if (ii==1) {
            //$('.tfilters .table-header').eq(1).css('width', +colWidth+90);
          }
        }

        //hide preload mask
        jUtility.DOM.togglePreloader(true);
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   moveRowMenu
       *
       *  @tr - target table row element
       *
       *  Moves the row menu to the target
       **  **  **  **  **  **  **  **  **  **/
      moveRowMenu : function($tr) {
        jApp.aG().DOM.$rowMenu.detach().appendTo( $tr.find('.table-cell .rowMenu-container').eq(0) );
      }, // end fn

      /**
       * Toggle Row Menu visibility
       * @method function
       * @return {[type]} [description]
       */
      toggleRowMenu : function() {
        var $btn = $(this),
            $tr = $(this).closest('.table-row'),
            $rowMenu = jApp.aG().DOM.$rowMenu;

        $rowMenu.removeClass('expand');

        jUtility.DOM.moveRowMenu($tr);

        $btn.toggleClass('active rotate');

        if ( $btn.hasClass('rotate') ) {
          $rowMenu.addClass('expand');
        }
        else {
          $rowMenu.removeClass('expand');
        }
        jApp.tbl().find('.btn-showMenu').not(this).removeClass('rotate active');
      }, // end fn


      /**
       * Reset row menu to non-expanded state
       * @method function
       * @return {[type]} [description]
       */
      resetRowMenu : function() {
        $('.btn-showMenu').removeClass('rotate');
        jApp.aG().DOM.$rowMenu.removeClass('expand');
      }, // end fn

      /**
       * Initialize grid
       * @method function
       * @return {[type]} [description]
       */
      initGrid : function() {
        var id = jApp.opts().table + '_' + Date.now();

        jApp.aG().DOM.$grid = $('<div/>' , { id : id }).html(
          jUtility.render(
            jApp.aG().html.tmpMainGridBody , jApp.opts().gridHeader
          )
        ).find('select#RowsPerPage')
          .val( jApp.aG().dataGrid.pagination.rowsPerPage )
          .end()
        .appendTo('#page-wrapper');

        jApp.aG().DOM.$tblMenu = jApp.aG().DOM.$grid.find('.table-btn-group');

        if ( !jApp.opts().gridHeader.helpText ) {
          jApp.tbl().find('.helpText').hide();
        }

      }, // end fn

      /**
       * iterates through changed data and updates the DOM
       * @method function
       * @return {[type]} [description]
       */
      updateGrid : function() {
        // init vars
        var appendTR = false,
          appendTD = false;

        if (!!jApp.aG().dataGrid.delta[0] && jApp.aG().dataGrid.delta[0][jApp.opts().pkey] === 'NoData') {
          var tr = $('<div/>', { class : 'table-row tr-no-data'} ).append( $('<div/>', { class : 'table-cell'} ).html('No Data') );

          jApp.tbl().find('.table-body').empty().append( tr );
          return false;
        }

        // iterate through the changed data
        $.each( jApp.aG().dataGrid.delta, function(i,oRow) {

          jApp.tbl().find('.table-body .tr-no-data').remove();

          // save the current row.
          jApp.aG().currentRow = jApp.aG().dataGrid.data[i];

          // find row in the table if it exists
          var	tr = jApp.tbl().find('.table-row[data-identifier="' + oRow[jApp.opts().pkey] + '"]');

          // try the json key if you can't find the row by the pkey
          if (!tr.length) tr = jApp.tbl().find('.table-row[data-jsonkey=' + i + ']');

          // create the row if it does not exist
          if (!tr.length) {
            tr = $('<div/>', { 'class' : 'table-row', 'data-identifier' : oRow[jApp.opts().pkey], 'data-jsonkey' : i } );
            appendTR = true;

            if (jUtility.isEditable()) {


              var td_chk = $('<div/>', { 'class' : 'table-cell', "nowrap" : "nowrap",  "style" : "position:relative;"} );
              //var td_chk = $('<div/>', { 'class' : 'table-cell', "nowrap" : "nowrap" } );
              if (!!jApp.opts().cellAtts['*']) {
                $.each( jApp.opts().cellAtts['*'], function(at, fn) {
                  td_chk.attr( at,fn() );
                });
              }

              var collapseMenu = (!!jApp.opts().toggles.collapseMenu) ?
                '<button style="padding:0" class="btn btn-success btn-showMenu"> <i class="fa fa-angle-right fa-fw fa-lg"></i> </button>' :
                '';

              var	tdCheck = (!!oRow[jApp.opts().pkey]) ? '<input type="checkbox" class="chk_cid" name="cid[]" />' : '';

              var lblCheck = '<label class="btn btn-default pull-right lbl-td-check" style="margin-left:20px;"> ' + tdCheck + '</label>';

              td_chk.html( 	'<div class="permanent-handle"> ' +
                        collapseMenu +
                        lblCheck +
                      '<div class="rowMenu-container"></div> \
                      </div>&nbsp;'
              );
              tr.append(td_chk);
            }

          } else { // update the row data- attributes
            tr.attr('data-identifier',oRow[jApp.opts().pkey]).attr('data-jsonkey',i);

            var td_chk = tr.find('.table-cell').eq(0);
            // update the attributes on the first cell
            if (!!jApp.opts().cellAtts['*']) {
              $.each( jApp.opts().cellAtts['*'], function(at, fn) {
                td_chk.attr( at,fn() );
              });
            }
          }



          // iterate through the columns
          //$.each( jApp.aG().currentRow, function(key, value) {
          $.each( jApp.opts().columns, function(i, key) {

            // get the value of the current key
            var value = jApp.aG().currentRow[key];

            // determine if the column is hidden
            if ( _.indexOf(jApp.opts().hidCols, key) !== -1) {
              return false;
            }

            // find the cell if it exists
            var td = tr.find('.table-cell[data-identifier="' + key + '"]');

            // create the cell if needed
            if (!td.length) {
              td = $('<div/>', { 'class' : 'table-cell', 'data-identifier' : key} );
              appendTD = true;
            }

            // set td attributes
            if (!!jApp.opts().cellAtts['*']) {
              $.each( jApp.opts().cellAtts['*'], function(at, fn) {
                td.attr( at,fn() );
              });
            }

            if(!!jApp.opts().cellAtts[key]) {
              $.each( jApp.opts().cellAtts[key], function(at, fn) {
                td.attr( at,fn() );
              });
            }

            // prepare the value
            value = jUtility.prepareValue(value,key);

            if ( td.html().trim() !== value.trim() ) {
              // set the cell value
              td
               .html(value)
               .addClass('changed')
            }


            // add the cell to the row if needed
            if (appendTD) {
              tr.append(td);
            }

          });// end each

          // add the row if needed
          if (appendTR) {
            jApp.tbl().find('.table-body').append(tr);
          }
        }); // end each

        // reset column widths
        jUtility.DOM.updateColWidths();

        // animate changed cells

          // .stop()
          // .css("background-color", "#FFFF9C")
          // .animate({ backgroundColor: 'transparent'}, 1500, function() { $(this).removeAttr('style');  } );


        setTimeout( function() { jApp.tbl().find('.table-cell.changed').removeClass('changed') }, 2000 );


        jUtility.countdown();
        jUtility.DOM.page( jApp.opts().pageNum );

        // deal with the row checkboxes
        jApp.tbl().find('.table-row')
          .filter(':not([data-identifier])')
            .find('.lbl-td-check').remove() // remove the checkbox if there is no primary key for the row
            .end()
          .end()
          .filter('[data-identifier]') // add the checkbox if there is a primary key for the row
          .each(function(i,elm) {
            if ( jUtility.isEditable() && $(elm).find('.lbl-td-check').length === 0 ) {
              $('<label/>', { class : 'btn btn-default pull-right lbl-td-check', style : 'margin-left:20px' })
                .append( $('<input/>', { type: 'checkbox', class : 'chk_cid', name : 'cid[]' } ))
                .appendTo ( $(elm).find('.permanent-handle'));
            }
          });

        jApp.tbl().find('.table-body .table-row, .table-head .table-row:last-child').each( function(i,elm) {
          if ( $(elm).find('.table-cell,.table-header').length < 4 ) {
            $('<div/>', {'class' : 'table-cell'}).appendTo( $(elm) );
          }
        });

        jApp.tbl().find('.table-head .table-row:nth-child(2)').each( function(i,elm) {
          if ( $(elm).find('.table-cell,.table-header').length < 3 ) {
            $('<div/>', {'class' : 'table-cell'}).appendTo( $(elm) );
          }
        });

        // process pagination
        jUtility.updatePagination();


      },

      /**
       * Clear the menus so they can be rebuilt
       * @method function
       * @return {[type]} [description]
       */
      clearMenus : function() {
        jApp.aG().DOM.$tblMenu.empty();
        jApp.aG().DOM.$rowMenu.empty();
        jApp.aG().DOM.$withSelectedMenu.empty();
      }, // end fn

      /**
       * Build a menu
       * @method function
       * @param  {obj} collection 	collection of menu options to iterate over
       * @param  {jQuery} target    DOM target for new buttons/links
       * @param  {string} type 			buttons | links
       */
      buildMenu : function(collection, target, type) {
        var o, key, oo, kk;

        if (typeof type === 'undefined') { type = 'buttons'}

        //build menu
        _.each( collection, function(o, key) {
          if ( jUtility.isButtonEnabled(key) ) {
            if (key === 'custom') {
              _.each( o, function( oo, kk ) {
                if (type == 'buttons') {
                  jUtility.DOM.createMenuButton( oo ).appendTo( target );
                } else {
                  jUtility.DOM.createMenuLink( oo ).appendTo( target );
                }
              });
            } else {
              if (type == 'buttons') {
                jUtility.DOM.createMenuButton( o ).clone().appendTo( target );
              } else {
                jUtility.DOM.createMenuLink( o ).appendTo( target );
              }
            }
          }
        });
      }, //end fn

      /**
       * Build a button menu
       * @method function
       */
      buildBtnMenu : function(collection, target) {
        jUtility.DOM.buildMenu(collection, target, 'buttons');
      }, //end fn

      /**
       * Build a link menu
       * @method function
       */
      buildLnkMenu : function(collection, target) {
        jUtility.DOM.buildMenu(collection, target, 'links');
      }, // end fn

      /**
       * Helper function to create menu links
       * @method function
       * @param  {obj} o html parameters of the link
       * @return {jQuery obj}
       */
      createMenuLink : function( o ) {
        var $btn, $btn_a, $btn_choice, $ul;

        $btn_choice = $('<a/>', { href : 'javascript:void(0)' });

        //add the icon
        if (!!o.icon) {
          $btn_choice.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + o.icon } ) );
        }
        // add the label
        if (!!o.label) {
          $btn_choice.append( $('<span/>').html(o.label) );
        }
        // add the click handler
        if (!!o.fn) {
          if (typeof o.fn === 'string') {
            if (o.fn !== 'delete') {
              $btn_choice.off('click.custom').on('click.custom', function() {
              jApp.aG().withSelectedButton = $(this);
              jUtility.withSelected( 'custom', jApp.aG().fn[o.fn] ) } );
            } else {
              $btn_choice.off('click.custom').on('click.custom', function() {
              jApp.aG().withSelectedButton = $(this);
              jUtility.withSelected( 'delete', null ) } );
            }
          } else if (typeof o.fn === 'function') {
            $btn_choice.off('click.custom').on('click.custom', function() {
            jApp.aG().withSelectedButton = $(this);
            jUtility.withSelected( 'custom', o.fn ) } );
          }
        }

        // add the html5 data
        if (!!o.data) {
          _.each( o.data, function(v,k) {
            $btn_choice.attr('data-'+k,v);
          });
        }

        return $('<li/>', {class : o.class, title : o.title}).append( $btn_choice );

      }, // end fn

      /**
       * Helper function to create menu buttons
       * @method function
       * @param  {obj} o html parameters of the button
       * @return {jQuery obj}
       */
      createMenuButton : function( params ) {
        var $btn, $btn_a, $btn_choice, $ul;

        if ( typeof params[0] === 'object') { // determine if button is a dropdown menu
          $btn = $('<div/>', { class : 'btn-group btn-group-sm'})
          // params[0] will contain the dropdown toggle button
          $btn_a = $('<a/>', {
                    type : 'button',
                    class : 'btn btn-success dropdown-toggle',
                    href : '#',
                    'data-toggle' : 'dropdown'
                 });
          // add the icon if applicable
          if (!!params[0].icon) {
            $btn_a.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + params[0].icon } ) );
          }
          // add the label if applicable
          if (!!params[0].label) {
            $btn_a.append( $('<span/>').html(params[0].label) );
          }
          // add the click handler, if applicable
          if (typeof params[0].fn !== 'undefined') {
            if (typeof params[0].fn === 'string') {
              $btn_a.off('click.custom').on('click.custom', jApp.aG().fn[params[0].fn ] );
            } else if (typeof params[0].fn === 'function') {
              $btn_a.off('click.custom').on('click.custom', params[0].fn );
            }
          }
          // add the dropdown if there are multiple options
          if (params.length > 1) {
            $btn_a.append( $('<span/>', {class : 'fa fa-caret-down'}));
            $btn.append($btn_a);
            $ul = $('<ul/>', { class : 'dropdown-menu'});

            _.each( params, function(o,key) {
              if (key == 0) return false;
              $btn_choice = $('<a/>', $.extend(true, {}, o, { href : 'javascript:void(0)' }) );

              //add the icon
              if (!!o.icon) {
                $btn_choice.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + o.icon } ) );
              }
              // add the label
              if (!!o.label) {
                $btn_choice.append( $('<span/>').html(o.label) );
              }
              // add the click handler
              if (!!o.fn) {
                if (typeof o.fn === 'string') {
                  $btn_choice.off('click.custom').on('click.custom', jApp.aG().fn[o.fn] );
                } else if (typeof o.fn === 'function') {
                  $btn_choice.off('click.custom').on('click.custom', o.fn );
                }
              }

              $btn_choice.wrap('<li></li>').parent().appendTo($ul);
            });

            $btn.append($ul);
          } else {
            $btn.append($btn_a);
          }

        } else {

          $btn = $('<button/>', params);
          if (!!params.icon) {
            $btn.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + params.icon } ) );
          }
          if (!!params.label) {
            $btn.append( $('<span/>').html(params.label) );
          }
          if (!!params.fn) {
            if (typeof params.fn === 'string') {
              $btn.off('click.custom').on('click.custom', jApp.aG().fn[params.fn] );
            } else if (typeof params.fn === 'function') {
              $btn.off('click.custom').on('click.custom', params.fn );
            }
          }
        }

        return $btn;
      }, // end fn

      /**
       * Build form
       * @method function
       * @param  {[type]} params [description]
       * @param  {[type]} key    [description]
       * @return {[type]}        [description]
       */
      buildForm : function( params, key ) {
        var $frmHandle = '$' + key,
            oFrmHandle = 'o' + key.ucfirst(),
            oFrm;

        // make sure the form template exists
        if ( typeof jApp.aG().html.forms[key] === 'undefined' ) return false;

        // create form object
        jApp.aG().forms[oFrmHandle] = oFrm = new jForm( params );

        // create form container
        jApp.aG().forms[$frmHandle] = $('<div/>', { 'class' : 'gridFormContainer' })
          .html( jUtility.render( jApp.aG().html.forms[key] ) )
          .find( '.formContainer' ).append( oFrm.fn.handle() ).end()
          .appendTo( jApp.aG().$() );
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   overlay
       *
       *  Controls the modal overlays
       **  **  **  **  **  **  **  **  **  **/
      overlay : function(which,action) {
        var $which = (which == 1) ? '#modal_overlay' : '#modal_overlay2';
        if (action == 'on') {
          $($which).fadeIn('fast');
        } else {
          $($which).fadeOut('fast');
        }
      },

    }, // end DOM fns

    /**  **  **  **  **  **  **  **  **  **
		 *   CALLBACK
		 *
		 *  Defines the callback functions
		 *  used by the various AJAX calls
		 **  **  **  **  **  **  **  **  **  **/
		callback : {

			/**
			 * Process the result of the form submission
			 * @method function
			 * @param  {[type]} response [description]
			 * @return {[type]}          [description]
			 */
			submitCurrentForm : function(response) {
				if ( jUtility.isResponseErrors(response) ) {
					jUtility.msg.error( jUtility.getErrorMessage(response) )
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
					jUtility.DOM.resetRowMenu();
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
				jApp.log('6.6 data received. processing...')

        if ($.isEmptyObject(response)) {
          jUtility.DOM.dataEmptyHandler(true);
        } else {
          jUtility.DOM.dataEmptyHandler(false);
        }

				// init vars
				var	appendTH = false,
					theaders,
					tfilters,
					btn,
					isActive,
          self = jApp.aG();

				// detect changes in data;
				self.dataGrid.delta = ( !$.isEmptyObject(self.dataGrid.data) ) ?
					jUtility.deltaData(self.dataGrid.data,response) :
					response;

				// merge the changes into self.dataGrid.data
				if (!!self.dataGrid.delta) {
					self.dataGrid.data = response;
				} else { // abort if no changes in the data
					return false;
				}

				// remove all rows, if needed
				if (self.options.removeAllRows) {
					jUtility.DOM.removeRows(true);
				}

				// show the preloader, then update the contents
				jUtility.DOM.togglePreloader();

				// find the header row
				theaders = self.DOM.$grid.find('.table-head .table-row.colHeaders');

				// create the header row if needed
				if (!theaders.length) {
					tfilters = self.DOM.$grid.find('.table-row.tfilters');
					theaders = $('<div/>', {'class' : 'table-row colHeaders'});
					appendTH = true;

					// Append the check all checkbox
					if (jUtility.isEditable()) {
						theaders.append( $('<div/>', {'class' : 'table-header table-header-text'}).html( jUtility.render( self.html.tmpCheckAll ) ));
					}

					// create header for this column if needed
					$.each( self.options.headers, function(i,v) {
						// determine if the current column is the active sortBy column
						isActive = (self.options.columns[i] === self.options.sortBy) ? true : false;

						// render the button
						btn = jUtility.render( self.html.tmpSortBtn, {
							'ColumnName' : self.options.columns[i],
							'BtnClass' : (isActive) ? 'btn-primary' : '',
							'faClass' : (isActive) ? 'amount-desc' : 'amount-asc',
							'BtnTitle' : (isActive) ? 'Sort Descending' : 'Sort Ascending'
							} );

						// append the header
						theaders.append( $('<div/>', { 'class' : 'table-header table-header-text' }).html( btn + v ) );

						if ( i > 0 ) { // skip the id column
							tfilters.append( $('<div/>', { 'class' : 'table-header', 'style' : 'position:relative'}).append( $('<input/>',
							//tfilters.append( $('<div/>', { 'class' : 'table-header'}).append( $('<input/>',
								{
									'rel' : self.options.columns[i],
									'id'  :	'filter_' + self.options.columns[i],
									'name' : 'filter_' + self.options.columns[i],
									'class' : 'header-filter form-control',
									'style' : 'width:100%'
								}
							)));
						}
					});

					self.DOM.$grid.find('.table-head').append(theaders);
					self.DOM.$grid.find('.paging').parent().attr('colspan',self.options.headers.length-2);
					self.DOM.$grid.find('.with-selected-menu').append( self.DOM.$withSelectedMenu.find('li') );
				}

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
          jUtility.setupFormContainer();
          jUtility.getCheckedOutRecords();
        } else {
          jUtility.msg.error( jUtility.getErrorMessage(response) )
        }
			}, //end fn

      /**
       * Check in row
       * @method function
       * @return {[type]} [description]
       */
			checkin : function(response) {
        if ( jUtility.isResponseErrors(response) ) {
          jUtility.msg.warning( jUtility.getErrorMessage(response) )
        }
        jUtility.getCheckedOutRecords();
        jUtility.closeCurrentForm();
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
				self.DOM.$grid.find('.btn-showMenu').removeClass('disabled').prop('disabled',false)
							.attr('title','')
							.find('i')
								.addClass('fa-angle-right')
								//.removeClass('fa-lock')

				_.each(response, function(o,key) {

					if (!!o && !!o.lockable_id) {
						$tr = $('.table-row[data-identifier="' + o.lockable_id + '"]');

						$tr.find('.chk_cid').parent().addClass('disabled').hide()
							.closest('.table-cell').append( $('<span/>',{class : 'btn btn-default btn-danger pull-right checkedOut'})
              .html($i.prop('outerHTML')).clone().attr('title','Locked By ' + o.user.name));
						$tr.find('.rowMenu-container').addClass('disabled').find('.rowMenu.expand').removeClass('expand');
						$tr.find('.btn-showMenu').addClass('disabled').prop('disabled',true)
							.find('i')
								.removeClass('fa-angle-right')
								//.addClass('fa-lock')
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

		} // end callback defs

  }

  // add it to the global scope
  window.jUtility = jUtility;

})(window, $, jApp);
