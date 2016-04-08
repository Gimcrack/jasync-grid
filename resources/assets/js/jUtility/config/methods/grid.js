/**
 * grid.js
 *
 * grid methods
 */
;module.exports = {
  /**
   * Calculate where the grid should be positioned
   * @return {[type]} [description]
   */
  calculateGridPosition : function() {
    if ( typeof $('.colHeaders').offset() === 'undefined' ) {return false;}
    return {
      marginTop : +$('.colHeaders').height()+$('.colHeaders').offset().top,
      height : +$(window).height()-95-$('.colHeaders').offset().top
    };
  }, // end fn

  /**
   * Toggle a button to prevent it being clicked multiple times
   * @method function
   * @return {[type]} [description]
   */
  toggleButton : function($btn) {
    if( $btn.prop('disabled') ) {
      $btn.prop('disabled',false)
          .removeClass('disabled')
          .html( $btn.attr('data-original-text'));
    } else {
      $btn.attr('data-original-text', $btn.html() )
          .prop('disabled',true)
          .addClass('disabled')
          .html('<i class="fa fa-spinner fa-pulse"></i>');
    }
  }, // end fn

  /**
   * Set instance options
   * @method function
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  setOptions : function(options) {
    jApp.aG().options = $.extend(true, jApp.opts(),options);
    jApp.log('1.1 Options Set');
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
              fn : function() { jUtility.DOM.toggleColumnVisibility( $(this) ); },
              'data-column' : o
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
   * Turn off modal overlays
   * @method function
   * @return {[type]} [description]
   */
  turnOffOverlays : function() {
    jUtility.DOM.overlay(1,'off');
    jUtility.DOM.overlay(2,'off');
  }, //end fn

  /**
   * Update countdown
   * @method function
   * @return {[type]} [description]
   */
  updateCountdown : function() {
    if (jUtility.isFormOpen() || jUtility.isRowMenuOpen()) { return false; }

    var txt = 'Refreshing in ';
    txt += (jApp.aG().dataGrid.intervals.countdownTimer > 0) ? Math.floor( jApp.aG().dataGrid.intervals.countdownTimer / 1000) : 0;
    txt += 's';

    jApp.tbl().find('button#btn_table_status').text( txt );
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

  /**
   * Temp storage object
   * @type {Object}
   */
  temp : {},

  /**
   * Get the jInput object
   * @method function
   * @return {[type]} [description]
   */
  jInput : function() {
    if ( !this.temp.jInput ) {
      this.temp.jInput = new jInput({});
    }
    return this.temp.jInput;
  }, // end fn

  /**
   * Get the jForm object
   * @method function
   * @return {[type]} [description]
   */
  jForm : function() {
    if (!this.temp.jForm) {
      this.temp.jForm = new jForm({});
    }
    return this.temp.jForm;
  }, // end fn

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
    jApp.log('4.1 Ajax Defaults Set');
  }, // end fn

  /**
   * Get the default grid options
   * @method function
   * @return {[type]} [description]
   */
  getDefaultOptions : require('../defaults'), // end fn

  /**
   * Get users permissions
   * @method function
   * @return {[type]} [description]
   */
  getPermissions : function( model ) {
    model = model || jApp.opts().model;

    var storeKey = model + '_permissions';

    if (!!jApp.store.get(storeKey,false)) {
      return jUtility.callback.getPermissions( jApp.store.get(storeKey)  );
    }

    jApp.log('0.1 - Getting Permissions from server');

    var requestOptions = {
      url : jApp.routing.get( 'getPermissions', model ),
      success : function(response) {
        jApp.store.set(storeKey, response, { TTL : 60000*60*24 });
        jApp.log( jApp.store.getTTL( storeKey ) );

        jUtility.callback.getPermissions(response);
        jUtility.buildMenus();
      }
    };

    jApp.log(requestOptions.url);

    jUtility.getJSON( requestOptions );
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
    if ( !!jUtility.numInvisibleItemsChecked() ) {
      return jUtility.confirmInvisibleCheckedItems(action,callback);
    }

    return jUtility.withSelectedAction(action,callback, true);
  }, // end fn

  /**
   * With selected actions
   * @param  {[type]}   action   [description]
   * @param  {Function} callback [description]
   * @param  {[type]}   $cid     [description]
   * @return {[type]}            [description]
   */
  withSelectedAction : function(action, callback, includeHidden) {
    var $cid = jUtility.getCheckedItems(includeHidden),
        model = jUtility.getActionModel();

    if ( !$cid.length && !jUtility.isOtherButtonChecked() ) { return jUtility.msg.warning('Nothing selected.'); }

    switch(action) {
      // DELETE SELECTED
      case 'delete' :
        jApp.aG().action = 'withSelectedDelete';
        bootbox.confirm('Are you sure you want to delete ' + $cid.length + ' ' + model + ' record(s)?', function(response) {
          if (!!response) {
            jUtility.postJSON( {
              url : jUtility.getCurrentFormAction(),
              success : jUtility.callback.submitCurrentForm,
              data : { '_method' : 'delete', 'ids[]' : $cid }
            });
          }
        });
      break;

      case 'custom' :
        return (typeof callback === 'function') ?
          callback( $cid ) :
          console.warn( 'callback is not a valid function');

      default :
        console.warn( action + ' is not a valid withSelected action');
      break;
    }

  }, //end fn

  /**
   * [function description]
   * @method function
   * @param  {[type]} action [description]
   * @return {[type]}        [description]
   */
  actionHelper : function(action) {
    var id,  model;

    jApp.aG().action = action;

    if ( jUtility.needsCheckout() ) {

      id = jUtility.getCurrentRowId();
      model = jUtility.getActionModel();

      jUtility.checkout( id, model  );
    }

    jUtility.setupFormContainer();

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
      'There was a problem completing your request.';
  }, //end fn

  /**
   * Get the model that the action is action on
   * @method function
   * @return {[type]} [description]
   */
  getActionModel : function() {
    if ( jUtility.isOtherButtonChecked() ) {
      return jUtility.getOtherButtonModel();
    }
    // if (!!jApp.aG().temp && !!jApp.aG().temp.actionModel) {
    //   return jApp.aG().temp.actionModel;
    // }
    return jApp.opts().model;
  }, // end fn

  /**
   * Get the id of the "other" button that is checked
   * @method function
   * @return {[type]} [description]
   */
  getOtherButtonId : function() {
    return jUtility.getActiveOtherButton().attr('data-id');
  }, // end fn

  /**
   * Get the model of the "other" button that is checked
   * @method function
   * @return {[type]} [description]
   */
  getOtherButtonModel : function() {
    return jUtility.getActiveOtherButton().attr('data-model');
  }, // end fn

  /**
   * Get the "other" button that is checked
   * @method function
   * @return {[type]} [description]
   */
  getActiveOtherButton : function() {
    return $('.btn-editOther.active').eq(0);
  }, // end fn

  /**
   * Get current row id
   * @method function
   * @return {[type]} [description]
   */
  getCurrentRowId : function() {
    // if (!!jApp.aG().temp && jApp.aG().temp.actionId > 0) {
    //   return jApp.aG().temp.actionId;
    // }
    if ( jUtility.isOtherButtonChecked() ) {
      return jUtility.getOtherButtonId();
    }

    return jUtility.getCheckedItems(true);
  }, //end fn

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
    jApp.aG().html = $.extend(true, {}, require('../templates'), jApp.opts().html);

    jApp.log('2.1 HTML Templates Done');

  }, // end fn



  /**
   * Get the rows that match the header filter text
   * @method function
   * @return {[type]} [description]
   */
  getHeaderFilterMatchedRows : function() {
    var currentColumn,
        currentMatches,
        matchedRows = [],
        targetString;


    //iterate through header filters and apply each
    jApp.tbl().find('.header-filter').filter( function() {
      return !!$(this).val().toString().trim().length;
    }).each( function() {

      // calculate the 1-indexed index of the current column
      currentColumn = +1+$(this).parent().index();

      jApp.log( 'The current column is'  + currentColumn);

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
    var changes = {};
    _.each(now, function( row, i) {
      if (typeof prev[i] === 'undefined') {
        changes[i] = row;
      } else {
        _.each( row, function( value, prop) {
          if (prev[i][prop] !== value) {
            if (typeof changes[i] === 'undefined') {
              changes[i] = {};
            }
            changes[i][prop] = value;
          }
        });
      }
    });
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
  checkout: function checkout(id, model) {

    if (!model) {
      model = jApp.opts().model;
    }

    jUtility.getJSON({
      url: jApp.routing.get('checkout', model, id), //jApp.prefixURL( '/checkout/_' + jApp.opts().model + '_' + id ),
      success: jUtility.callback.checkout
    });
  }, // end fn

  /**
   * Checkin record
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  checkin : function(id, model) {

    if (!model) {
      model = jUtility.getActionModel();
    }

    jUtility.getJSON({
      url : jApp.routing.get('checkin', model, id), // jApp.prefixURL( '/checkin/_' + jApp.opts().model + '_' + id ),
      success : jUtility.callback.checkin,
      always : function() { /* ignore */ }
    });

  }, // end fn

  /**
   * Get all checked out records
   * @return {[type]} [description]
   */
  getCheckedOutRecords : function() {
    jUtility.getJSON({
      url : jApp.routing.get('checkedOut', jApp.opts().model), //jApp.prefixURL( '/checkedout/_' + jApp.opts().model ),
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
    ag = $.extend( ag, require('../initParams') );

    jApp.log('3.1 Initial Params Set');
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

    if ( jUtility.isOtherButtonChecked() ) {
      return [ jUtility.getOtherButtonId() ];
    }

    return $('.table-grid').find( selector ).map( function(i, elm) {
      return $(elm).closest('.table-row').attr('data-identifier');
    }).get();

  }, // end fn

  /**
   * Get the data objects of the checked items
   * @method function
   * @param  {[type]} includeHidden [description]
   * @return {[type]}               [description]
   */
  getCheckedObjects : function( includeHidden ){
    var items = jUtility.getCheckedItems( includeHidden ),
        ret = [];

    _.each( items, function(val) {
      ret.push( _.findWhere( jApp.activeGrid.dataGrid.data, { id : val } ) );
    });

    return ret;
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
          cancel : { label : "Cancel Operation", className : "btn-danger", callback: function() { dialog.modal('hide'); } }
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
    jApp.log('5.1 Page Wrapper Emptied');
    jUtility.DOM.initGrid();
    jApp.log('5.2 Grid Initialized');
  },


  /**
   * Build all grid menus
   * @method function
   * @return {[type]} [description]
   */
  buildMenus : function() {
    jUtility.DOM.clearMenus();

    //jUtility.setupVisibleColumnsMenu();
    jUtility.DOM.buildBtnMenu( jApp.opts().tableBtns, jApp.aG().DOM.$tblMenu, true );
    jUtility.DOM.buildBtnMenu( jApp.opts().rowBtns, jApp.aG().DOM.$rowMenu, false);
    //jUtility.DOM.buildLnkMenu( jApp.opts().withSelectedBtns, jApp.aG().DOM.$withSelectedMenu );

    jUtility.DOM.attachRowMenu();
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
}
