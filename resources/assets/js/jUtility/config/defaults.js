/**
 * defaults.js
 *
 * Default jGrid options
 */
;module.exports = function() {
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
    url	: jApp.routing.get( jApp.opts().runtimeParams.model ),

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
     * The order query scope to apply
     * @type string
     */
    order : 'oldest', 

    /**
     * Scope of the query
     */
    scope : 'all',

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
      //buttonContainer : '<div class="btn-group" />',
      enableCaseInsensitiveFiltering: true,
      includeSelectAllOption: true,
      maxHeight: 185,
      numberDisplayed: 1,
      dropUp: true,
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


      tableMenu : {
        type : 'button',
        class : 'btn btn-success btn-tblMenu',
        id : 'btn_table_menu_heading',
        icon : 'fa-table',
        label : '&nbsp;',
        'data-order' : 0
      },

      /**
       * Refresh Button
       * @type {Object}
       */
      refresh : {
        type : 'button',
        name : 'btn_refresh_grid',
        class : 'btn btn-success btn-refresh',
        icon : 'fa-refresh',
        label : 'Refresh',
        'data-order' : 1
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
          'data-permission' : 'create_enabled',
          'data-order' : 2
      },

      firstPage : {
          type : 'button',
          class : 'btn btn-success btn-firstPage',
          icon : 'fa-angle-double-left',
          label : '',
          'data-order' : 3
      },
      
      prevPage : {
        type : 'button',
        class : 'btn btn-success btn-prevPage',
        icon : 'fa-angle-left',
        label : '',
        'data-order' : 4
      },
      
      nextPage : {
        type : 'button',
        class : 'btn btn-success btn-nextPage',
        icon : 'fa-angle-right',
        label : '',
        'data-order' : 5
      },
      
      lastPage : {
        type : 'button',
        class : 'btn btn-success btn-lastPage',
        icon : 'fa-angle-double-right',
        label : '',
        'data-order' : 6
      },

      collapseText : {
        type : 'button',
        class : 'btn btn-success btn-collapseText btn-toggle active',
        icon : 'fa-ellipsis-h',
        label : 'Collapse Text',
        'data-order' : 7
      },

      /**
       * Header Filters Button
       * @type {Object}
       */
      headerFilters : {
        type : 'button',
        class : 'btn btn-success btn-headerFilters btn-toggle',
        id : 'btn_toggle_header_filters',
        icon : 'fa-filter',
        label : 'Filter Rows',
        'data-order' : 8
      },

      /**
       * Define custom buttons here. Custom buttons may also be defined at runtime.
       * @type {Object}
       */
      custom : {
        // visColumns : [
        //   { icon : 'fa-bars fa-rotate-90', label : ' Visible Columns' },
        // ],

      },

      search : {
        type : 'text',
        id : 'search',
        name : 'search',
        icon : 'fa-search',
        placeholder : 'Search...',
        'data-order' : 9998
      },

      /**
       * Table status
       * @type {Object}
       */
      tableStatus : {
        type : 'button',
        class : 'btn btn-tableStatus',
        id : 'btn_table_status',
        icon : '',
        label : '',
        'data-order' : 9999
      }
    },


    /**
     * Row buttons appear in each row of the grid
     * @type {Object}
     */
    rowBtns : {

      /**
       * The row menu heading. Displayed when an item is checked.
       * @type {Object}
       */
      rowMenu : {
        type : 'button',
        class : 'btn btn-primary btn-rowMenu',
        id : 'btn_row_menu_heading',
        icon : 'fa-check-square-o',
        label : '&nbsp;',
      },

      /**
       * Clear Selected Button
       * @type {Object}
       */
      clearSelected : {
        type : 'button',
        class : 'btn btn-primary btn-clear',
        id : 'btn_clear',
        icon : 'fa-square-o',
        label : 'Clear Selection',
      },

      /**
       * Inspect Record Button
       * @type {Object}
       */
      inspect : {
        type : 'button',
        class : 'btn btn-primary btn-inspect',
        id : 'btn_inspect',
        icon : 'fa-info',
        label : 'Inspect ...',
        'data-permission' : 'read_enabled',
        'data-multiple' : false
      },

      /**
       * Edit Button
       * @type {Object}
       */
      edit : {
        type : 'button',
        class : 'btn btn-primary btn-edit',
        id : 'btn_edit',
        icon : 'fa-pencil',
        label : 'Edit ...',
        'data-permission' : 'update_enabled',
        'data-multiple' : false
      },

      /**
       * Delete Button
       * @type {Object}
       */
      del : {
        type : 'button',
        class : 'btn btn-primary btn-delete',
        id : 'btn_delete',
        icon : 'fa-trash-o',
        label : 'Delete ...',
        //title : 'Delete Record ...',
        'data-permission' : 'delete_enabled'
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
        'data-permission' : 'delete_enabled',
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

}
