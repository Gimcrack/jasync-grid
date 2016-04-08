/**
 * dom.js
 *
 * DOM manipulation functions
 */

;module.exports = {
  /**
   * DOM Manipulation Functions
   * @type {Object}
   */
  DOM : {

    /**
     * Build form
     * @method function
     * @param  {[type]} params [description]
     * @param  {[type]} key    [description]
     * @return {[type]}        [description]
     */
    buildForm : function( params, key, htmlKey, tableFriendly ) {
      var $frmHandle = '$' + key,
          oFrmHandle = 'o' + key.ucfirst(),
          oFrm;

      htmlKey = ( htmlKey != null ) ? htmlKey : key;

      // make sure the form template exists
      if ( typeof jApp.aG().html.forms[htmlKey] === 'undefined' ) return false;

      // create form object
      jApp.aG().forms[oFrmHandle] = {}; // initialize it with a placeholder
      jApp.aG().forms[oFrmHandle] = oFrm = new jForm( params );

      // create form container
      jApp.aG().forms[$frmHandle] = {}; // initialize it with a placeholder
      jApp.aG().forms[$frmHandle] = $('<div/>', { 'class' : 'gridFormContainer' })
        .html( jUtility.render( jApp.aG().html.forms[htmlKey], { tableFriendly : tableFriendly || jApp.opts().model } ) )
        .find( '.formContainer' ).append( oFrm.fn.handle() ).end()
        .appendTo( jApp.aG().$() );

      return oFrm;
    }, // end fn

    /**
     * Hide header filters
     * @method function
     * @return {[type]} [description]
     */
    hideHeaderFilters : function() {
      jApp.aG().$().find('.table-head .tfilters').hide();
      $('#btn_toggle_header_filters').removeClass('active');
    }, // end fn

    /**
     * Show header filters
     * @method function
     * @return {[type]} [description]
     */
    showHeaderFilters : function() {
      jUtility.DOM.headerFilterDeleteIcons();
      jApp.aG().$().find('.table-head .tfilters').show();
      $('#btn_toggle_header_filters').addClass('active');
    }, // end fn

    /**
     * Updates the grid when there is
     * or is not any data
     * @method function
     * @return {[type]}              [description]
     */

    dataEmptyHandler : function() {
      $('.table-cell.no-data').remove();
      jApp.aG().$().find('.table-body .table-row').remove();
      $('<div/>', { class : 'table-cell no-data'}).html('<div class="alert alert-warning"> <i class="fa fa-fw fa-warning"></i> I did not find anything matching your query.</div>').appendTo( jApp.tbl().find('#tbl_grid_body') );
      jUtility.DOM.updateColWidths();
    }, // end fn

    /**
     * Updates the grid when is or is not errors
     * in the response
     * @method function
     * @param  {Boolean} isDataEmpty [description]
     * @return {[type]}              [description]
     */
    dataErrorHandler : function() {
      $('.table-cell.no-data').remove();
      $('<div/>', { class : 'table-cell no-data'}).html('<div class="alert alert-danger"> <i class="fa fa-fw fa-warning"></i> There was an error retrieving the data.</div>').appendTo( jApp.tbl().find('#tbl_grid_body') );
      jUtility.DOM.updateColWidths();
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
      var i = +elm.closest('li').index()+2;

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
         .find('.table-body').css('filter','blur(1px) grayscale(100%)').css('-webkit-filter','blur(2px) grayscale(100%)') .css('-moz-filter','blur(2px) grayscale(100%)');
         //.find('.table-cell, .table-header').css('border','1px solid transparent').css('background','none');
      } else {
        jApp.tbl().css('background','')
         .find('[name=RowsPerPage],[name=q]').prop('disabled',false).end()
         .find('.table-body').css('filter','').css('-webkit-filter','').css('-moz-filter','');
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
        //--jApp.aG().DOM.$rowMenu.detach();

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

      jApp.log('Applying Header Filters');

      if ( !jUtility.areHeaderFiltersNonempty() ) {
        return jUtility.DOM.removeHeaderFilters();
      }

      jUtility.DOM.hidePaginationControls();

      jApp.log('Getting matched rows');
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
      if ( !$('.table-header .deleteicon').length ) {
        jApp.log('Adding header filter delete icons');
        $('.header-filter').after(
          $('<span/>', {'class':'deleteicon','style':'display:none'})
          .html(
            jUtility.render( jApp.aG().html.tmpClearHeaderFilterBtn )
          )
        );
      } else {
        jApp.log('Delete icons already added');
      }
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

      if (typeof colNum === 'undefined' && typeof jApp.aG().temp.sortOptions === 'undefined') {
        return false;
      }

      if (typeof colNum === 'undefined') {
        colNum = jApp.aG().temp.sortOptions.colNum;
        desc = jApp.aG().temp.sortOptions.desc;
      } else {
          jApp.aG().temp.sortOptions = { colNum : colNum, desc : desc };
      }


      //col
      $col = jApp.tbl().find('.table-body .table-row .table-cell:nth-child(' + colNum + ')')
        .map( function(i,elm) {
          return [[
                $(elm).clone().text().toLowerCase(),
                $(elm).parent()
              ]];
        })
        .sort(function(a,b) {

          if ($.isNumeric(a[0]) && $.isNumeric(b[0])) {
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
      $col.each( function(i,elm){
        var $e = $(elm[1]);

        // detach the row from the DOM
        $e.detach();

        // attach the row in the correct order
        if (!desc) {
          jApp.tbl().find('.table-body').append( $e );
        } else {
          jApp.tbl().find('.table-body').prepend( $e );
        }
      });

      // go to the appropriate page to refresh the view
      jUtility.DOM.page( jApp.opts().pageNum );

      // apply header filters
      jUtility.DOM.applyHeaderFilters();
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
     * Update the grid position
     * @return {[type]} [description]
     */
    updateGridPosition : function() {
      var p = jUtility.calculateGridPosition();
      if (!p) return false;

      $('.grid-panel-body')
        .css({ 'marginTop' : p.marginTop })
        .find('.table')
          .css({ 'height' : p.height });

      $('.table-grid').perfectScrollbar('update');
    }, // end fn

    /**
     * Handles the page wrapper after scrolling
     * @return {[type]} [description]
     */
    pageWrapperScrollHandler : function() {

      var pw = $('#page-wrapper'),
          isScrolled = pw.hasClass('scrolled'),
          offsetTop = $('.table-body').offset().top,
          lowerBound = 150,
          upperBound = 180;

      if ( !isScrolled && offsetTop < lowerBound ) {
        pw.addClass('scrolled');
        jUtility.DOM.updateGridPosition();
      } else if ( isScrolled && offsetTop > upperBound  ) {
        pw.removeClass('scrolled');
        jUtility.DOM.updateGridPosition();
      }

    }, // end fn

    /**
     * Clear the column widths
     * @return {[type]} [description]
     */
    clearColumnWidths : function() {
      $('.grid-panel-body .table-row').find('.table-cell, .table-header').css('width','');
    }, //end fn

    /**
     * Update column widths
     * @method function
     * @return {[type]} [description]
     */
    updateColWidths : function() {

      jUtility.DOM.updateGridPosition();
      jUtility.setupSortButtons();

      jUtility.DOM.clearColumnWidths();

      // perfect scrollbar
      $('.table-grid').perfectScrollbar('update');

      jApp.opts().maxColWidth =  +350/1920 * +$(window).innerWidth();

      //visible columns
      var visCols = +$('.table-head .table-row.colHeaders').find('.table-header:visible').length-1;

      for(var ii=1; ii <= visCols; ii++ ) {

        var colWidth = Math.max.apply( Math, $('.grid-panel-body .table-row').map(function(i) {
          return $(this).find('.table-cell:visible,.table-header-text:visible').eq(ii).innerWidth() } ).get()
        );

        if ( +colWidth > jApp.opts().maxColWidth && ii < visCols ) {
          colWidth = jApp.opts().maxColWidth;
        }

        if ( ii == visCols ) {
          colWidth = +$(window).innerWidth()-$('.table-head .table-row.colHeaders').find('.table-header:visible').slice(0,-1)
                          .map( function(i) { return $(this).innerWidth() } ).get().reduce( function(p,c) { return p+c } )-40;
        }

        var nindex = +ii+1;

        // set widths of each cell
        $(  '.grid-panel-body .table-row:not(.tr-no-data) .table-cell:visible:nth-child(' + nindex + '),' +
          '.grid-panel-body .table-row:not(.tr-no-data) .table-header:nth-child(' + nindex + ')').css('width',+colWidth+14);
      }

      //hide preload mask
      jUtility.DOM.togglePreloader(true);
    }, // end fn

    /**
     * Attach Row Menu To The DOM
     * @method function
     * @return {[type]} [description]
     */
    attachRowMenu : function() {
      $('.table-rowMenu-row').empty().append( jApp.aG().DOM.$rowMenu.wrap('<div class="table-header"></div>').parent() );
    }, //end fn

    /**
     * Handler that triggers when an "other" button is clicked
     * @method function
     * @return {[type]} [description]
     */
    editOtherButtonHandler : function() {
      var id = $(this).attr('data-id'),
          model = $(this).attr('data-model'),
          icon = _.without($(this).find('i').attr('class').split(' '),'fa','fa-fw')[0],
          options;

      $('.btn-editOther.active')
        .not(this)
        .removeClass('btn-default active')
        .addClass('btn-link');

      $(this).toggleClass('btn-link btn-default active');

      options = ( !!$('.btn-editOther.active').length ) ?
        { id: id, model:model, icon : icon } :
        null;

      jUtility.DOM.updateRowMenuExternalItem( options );

      jUtility.DOM.toggleRowMenu(!!$('.btn-editOther.active').length);

      return true;
    }, // end fn

    /**
     * Update the row menu when an external item is checked
     * @method function
     * @return {[type]} [description]
     */
    updateRowMenuExternalItem : function( options ) {
      var $row = $('.table-rowMenu-row'),
          iconClass = $row.find('.btn-rowMenu i').attr('data-tmpClass');

      if (!!options) {
        $('.chk_cid:checked,.chk_all').prop('checked',false).prop('indeterminate',false);

        $row
          .addClass('other')
          .find('[data-custom]')
          .hide()
          .end()
          .find('[data-custom-menu] .btn')
          .hide()
          .end()
          .find('.btn-rowMenu')
          .addClass('other')
          .find('i')
            .attr('data-tmpClass',options.icon)
            .removeClass(iconClass)
            .removeClass('fa-check-square-o')
            .addClass(options.icon)
          .end().end()
          .find('.btn-primary')
          .removeClass('btn-primary')
          .addClass('btn-warning')
          .end()
          .find('.btn-history')
          .hide()
          .end()


          jUtility.DOM.toggleRowMenuItems( false );
      }

      else {

        $row
          .removeClass('other')
          .find('[data-custom]')
          .show()
          .end()
          .find('[data-custom-menu] .btn')
          .show()
          .end()
          .find('.btn-rowMenu')
          .removeClass('other')
          .find('i')
            .removeClass(iconClass)
            .addClass('fa-check-square-o')
            .removeAttr('data-tmpClass')
          .end().end()
          .find('.btn-warning')
          .removeClass('btn-warning')
          .addClass('btn-primary')
          .end()
          .find('.btn-history')
          .show()
          .end()
      }



    }, // end fn

    /**
     * Inspect the selected item
     * @method function
     * @return {[type]} [description]
     */
    inspectSelected : function() {
      console.log('loading...');

      jUtility.get( {
        url : jUtility.getCurrentRowInspectUrl(),
        success : jUtility.callback.inspectSelected,
      });
    }, // end fn

    /**
     * Update the row menu
     * @method function
     * @return {[type]} [description]
     */
    updateRowMenu : function(num_checked) {
      switch( num_checked ) {
        case 0 :
          jUtility.DOM.toggleRowMenu(false);

        break;

        case 1 :
          jUtility.DOM.toggleRowMenu(true);
          jUtility.DOM.toggleRowMenuItems( false );
        break;

        default :
          jUtility.DOM.toggleRowMenu(true);
          jUtility.DOM.toggleRowMenuItems( true );
        break;
      }

      // reset the row menu back to normal
      jUtility.DOM.updateRowMenuExternalItem();
    }, // end fn

    /**
     * Toggle Row Menu Items
     * @method function
     * @param  {[type]} hideNonMultiple [description]
     * @return {[type]}                 [description]
     */
    toggleRowMenuItems : function( disableNonMultiple ) {
      if (disableNonMultiple) {
        $( '.table-row.table-rowMenu-row .btn[data-multiple=false]').addClass('disabled').prop('disabled',true);
      } else {
        var p = jApp.aG().permissions;
        $( '.table-row.table-rowMenu-row .btn').each( function() {
          if ( $(this).attr('data-permission') == null ||  !!p[ $(this).attr('data-permission')  ] ) {
              $(this).removeClass('disabled').prop('disabled',false);
          }
        });
      }
    }, //end fn

    /**
     * Toggle Row Menu visibility
     * @method function
     * @return {[type]} [description]
     */
    toggleRowMenu : function( on ) {
      if (on != null) {
        $('.table-row.table-rowMenu-row').toggle(on);
        $('.table-row.table-menu-row').toggle(!on);
      } else {
        $('.table-row.table-rowMenu-row').toggle();
        $('.table-row.table-menu-row').toggle();
      }
      jUtility.DOM.updateColWidths();
    }, // end fn

    /**
     * Clear the selected items
     * @method function
     * @return {[type]} [description]
     */
    clearSelection : function() {
      jApp.aG().$()
        .find('.chk_cid').prop('checked',false)
        .end()
        .find('.btn-editOther.active')
          .removeClass('active btn-default')
          .addClass('btn-link');

      $('.chk_cid').eq(0).change();
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
     * Refresh the grid
     * @method function
     * @return {[type]} [description]
     */
    refreshGrid : function() {
      $(this)
        .addClass('disabled')
        .prop('disabled',true)
        .find('i').addClass('fa-spin').end()
        // .delay(2000)
        // .removeClass('disabled')
        // .prop('disabled',false)
        // .find('i').removeClass('fa-spin').end();
      jUtility.updateAll();
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

          // add the data to the row
          tr.data('rowData',jApp.aG().dataGrid.data[i] );

          if (jUtility.isEditable()) {


            var td_chk = $('<div/>', { 'class' : 'table-cell', "nowrap" : "nowrap",  "style" : "position:relative;"} );
            //var td_chk = $('<div/>', { 'class' : 'table-cell', "nowrap" : "nowrap" } );
            if (!!jApp.opts().cellAtts['*']) {
              $.each( jApp.opts().cellAtts['*'], function(at, fn) {
                td_chk.attr( at,fn() );
              });
            }

            var collapseMenu = '';

            var	tdCheck = (!!oRow[jApp.opts().pkey]) ? '<input type="checkbox" class="chk_cid" name="cid[]" />' : '';

            var lblCheck = '<label class="btn btn-default pull-right lbl-td-check" style="margin-left:20px;"> ' + tdCheck + '</label>';

            td_chk.html( 	collapseMenu +
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

          if ( td.html().trim() !== value.toString().trim() ) {
            // set the cell value
            td
             .html(value)
             .addClass('changed');
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


      setTimeout( function() { jApp.tbl().find('.table-cell.changed').removeClass('changed'); }, 2000 );


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
              .appendTo ( $(elm) );
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
     * Update the grid footer message
     * @method function
     * @return {[type]} [description]
     */
    updateGridFooter : function() {
      var target = $('.data-footer-message'),
          self = jApp.activeGrid,
          data = self.dataGrid,
          message = '<div style="padding:6px;" class="alert-warning"><i class="fa fa-fw fa-info"></i> Records ' + data.from + ' - ' + data.to + ' of ' + data.total + ' total</div>';

      target.html(message);

    }, // end fn

    /**
     * Clear the grid footer
     * @method function
     * @return {[type]} [description]
     */
    clearGridFooter : function() {
      $('.data-footer-message').html('');
    }, // end fn

    /**
     * Clear the menus so they can be rebuilt
     * @method function
     * @return {[type]} [description]
     */
    clearMenus : function() {
      jApp.aG().DOM.$tblMenu.find( '.btn:not(.btn-toggle)' ).remove();
      jApp.aG().DOM.$rowMenu.empty();
      //jApp.aG().DOM.$withSelectedMenu.empty();
    }, // end fn

    /**
     * Build a menu
     * @method function
     * @param  {obj} collection 	collection of menu options to iterate over
     * @param  {jQuery} target    DOM target for new buttons/links
     * @param  {string} type 			buttons | links
     */
    buildMenu : function(collection, target, type, order) {
      type = type || 'buttons';

      //build menu
      _.each( collection, function(o, key) {
        if (!!o.ignore) return false;
        if ( jUtility.isButtonEnabled(key) ) {
          if (key === 'custom') {
            _.each( o, function( oo, kk ) {
              if (!!oo.ignore) return false;

              if ( jUtility.isPermission(oo) ) {
                jApp.log('Button enabled : ' + kk);
                delete oo.disabled;
              } else {
                jApp.log('Button disabled : ' + kk);
                oo.disabled = true;
              }

              // mark this as a custom button
              oo['data-custom'] = true;

              if (type == 'buttons') {
                jUtility.DOM.createMenuButton( oo ).appendTo( target );
              } else {
                jUtility.DOM.createMenuLink( oo ).appendTo( target );
              }
            });
          } else {

              if ( jUtility.isPermission(o) ) {
                jApp.log('Button enabled : ' + key);
                delete o.disabled;
              } else {
                jApp.log('Button disabled : ' + key);
                o.disabled = true;
              }

              //jApp.log(o);
              if (type == 'buttons') {
                jUtility.DOM.createMenuButton( o ).clone().appendTo( target );
              } else {
                jUtility.DOM.createMenuLink( o ).appendTo( target );
              }
            }
          }
        }
      );

      //sort buttons by data-order
      if (!!order) {
        var btns = target.find('[data-order]');

        btns.detach().sort( function(a,b) {
          var an = +a.getAttribute('data-order'),
              bn = +b.getAttribute('data-order');

          if (an > bn) return 1;
          if (an < bn) return -1;
          return 0;
        }).appendTo(target);
      }
    }, //end fn

    /**
     * Build a button menu
     * @method function
     */
    buildBtnMenu : function(collection, target, order) {
      jUtility.DOM.buildMenu(collection, target, 'buttons', order);
    }, //end fn

    /**
     * Build a link menu
     * @method function
     */
    buildLnkMenu : function(collection, target, order) {
      jUtility.DOM.buildMenu(collection, target, 'links', order);
    }, // end fn

    /**
     * Create a text input for a menu
     * @method function
     * @param  {[type]} o [description]
     * @return {[type]}   [description]
     */
    createMenuText : function( o ) {
      var $input, $div = $('<div/>', { style : 'position:relative', 'data-order' : o['data-order'] })
        .html('<button style="display:none;" class="btn btn-link btn-clear-search btn-toggle">Reset</button>');

      $input = $('<input/>', _.omit(o,'data-order') );

      $div.prepend($input);

      o.ignore = true;

      return $div;
    }, // end fn

    /**
     * Helper function to create menu links
     * @method function
     * @param  {obj} o html parameters of the link
     * @return {jQuery obj}
     */
    createMenuLink : function( o ) {
      var $btn_choice = $('<a/>', { href : 'javascript:void(0)', 'data-permission' : o['data-permission'] || null });

      //add the icon
      if (!!o.icon) {
        $btn_choice.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + o.icon } ) );
      }
      // add the label
      if (!!o.label) {
        $btn_choice.append( $('<span/>').html(o.label) );
      }

      // disable/enable the button
      if (o.disabled === true) {
        $btn_choice.prop('disabled',true).addClass('disabled');
      } else {
        $btn_choice.prop('disabled',false).removeClass('disabled');
      }

      // add the click handler
      if (!!o.fn) {
        if (typeof o.fn === 'string') {
          if (o.fn !== 'delete') {
            $btn_choice.off('click.custom').on('click.custom', function() {
            jApp.aG().withSelectedButton = $(this);
            jUtility.withSelected( 'custom', jApp.aG().fn[o.fn] );
            } );
          } else {
            $btn_choice.off('click.custom').on('click.custom', function() {
            jApp.aG().withSelectedButton = $(this);
            jUtility.withSelected( 'delete', null );
            } );
          }
        } else if (typeof o.fn === 'function') {
          $btn_choice.off('click.custom').on('click.custom', function() {
          jApp.aG().withSelectedButton = $(this);
          jUtility.withSelected( 'custom', o.fn );
          } );
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

      if ( !! params.type && params.type == 'text' ) {
        return jUtility.DOM.createMenuText(params);
      }

      if ( typeof params[0] === 'object') { // determine if button is a dropdown menu

        $btn = $('<div/>', { class : 'btn-group btn-group-sm', 'data-custom-menu' : true });

        // params[0] will contain the dropdown toggle button
        $btn_a = $('<a/>', {
                  type : 'button',
                  class : params[0].class + ' dropdown-toggle',
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
            if (key === 0) return false;
            var signature = 'btn_' + Array(26).join((Math.random().toString(36)+'000000000000000000000').slice(2, 18)).slice(0, 25);

            $btn_choice = $('<a/>', $.extend(true, { 'data-permission' : '' }, _.omit(o,'fn') , { href : '#', 'data-signature' : signature }) );

            // disable/enable the button
            if (o.disabled === true) {
              $btn_choice.prop('disabled',true).addClass('disabled');
            } else {
              $btn_choice.prop('disabled',false).removeClass('disabled');
            }

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
                $(document).delegate( 'a[data-signature=' + signature + ']', 'click.custom', jApp.aG().fn[o.fn] );
              } else if (typeof o.fn === 'function') {
                $(document).delegate( 'a[data-signature=' + signature + ']', 'click.custom', o.fn );
              }
            }

            $btn_choice.wrap('<li></li>').parent().appendTo($ul);
          });

          $btn.append($ul);
        } else {
          $btn.append($btn_a);
        }

      } else {
        // generate a random, unique button signature
        var signature = 'btn_' + Array(26).join((Math.random().toString(36)+'000000000000000000000').slice(2, 18)).slice(0, 25);

        $btn = $('<button/>', _.omit(params, ['fn']) ).attr('data-signature',signature);

        if ( !! params['data-custom'] ) {
          $btn.attr('btn-custom',true);
        }

        //add ignore flag for toggle buttons
        if ( $btn.hasClass('btn-toggle') ) {
          params.ignore = true;
        }
        if (!!params.icon) {
          $btn.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + params.icon } ) );
        }
        if (!!params.label) {
          $btn.append( $('<span/>').html(params.label) );
        }
        if (!!params.fn) {
          if (typeof params.fn === 'string') {
            $(document).delegate( 'button[data-signature=' + signature + ']', 'click.custom', jApp.aG().fn[params.fn] );
          } else if (typeof params.fn === 'function') {
            $(document).delegate( 'button[data-signature=' + signature + ']', 'click.custom', params.fn );
          }
        }
        // disable/enable the button
        if (params.disabled === true) {
          $btn.prop('disabled',true).addClass('disabled');
        } else {
          $btn.prop('disabled',false).removeClass('disabled');
        }
      }

      return $btn;
    }, // end fn



    /**  **  **  **  **  **  **  **  **  **
     *   overlay
     *
     *  Controls the modal overlays
     **  **  **  **  **  **  **  **  **  **/
    overlay : function(which,action) {
      var $which = (which == 1) ? '#modal_overlay' : '#modal_overlay2';
      if (action == 'on') {
        $($which).show();
      } else {
        $($which).hide();
      }
    },

    /**
     * Setup Grid Headers
     * @method function
     * @return {[type]} [description]
     */
    setupGridHeaders : function() {
      // init vars
      var	appendTH = false,
        theaders,
        tfilters,
        btn,
        isActive,
        self = jApp.aG();

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
                'style' : 'width:100%',
                'placeholder' : self.options.headers[i]
              }
            )));
          }
        });

        self.DOM.$grid.find('.table-head').append(theaders);
        self.DOM.$grid.find('.paging').parent().attr('colspan',self.options.headers.length-2);
        //self.DOM.$grid.find('.with-selected-menu').append( self.DOM.$withSelectedMenu.find('li') );
      }
    }

  }, // end DOM fns
}
