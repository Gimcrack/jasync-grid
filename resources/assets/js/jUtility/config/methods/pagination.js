/**
 * pagination.js
 *
 * methods dealing with pagination
 */
;module.exports = {

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
   * Get the first page of results from the server
   */
  firstPage : function() {
    var data = jApp.activeGrid.dataGrid.requestOptions.data;

    data.page = 1;
    jUtility.executeGridDataRequest();
  },

  /**
   * Get the previous page of results from the server
   */
  prevPage : function() {
    var data = jApp.activeGrid.dataGrid.requestOptions.data;

    data.page = ( isNaN(data.page) || data.page < 2 ) ? 1 : data.page-1;
    jUtility.executeGridDataRequest();
  },

  /**
   * Get the next page of results from the server
   */
  nextPage : function() {
    var data = jApp.activeGrid.dataGrid.requestOptions.data,
      last_page = jApp.activeGrid.dataGrid.last_page;

    data.page = ( isNaN(data.page) || data.page < 2 ) ? 2 : +data.page+1;
    data.page = ( data.page > last_page ) ? last_page : data.page;
    jUtility.executeGridDataRequest();
  },

  /**
   * Get the last page of results from the server
   */
  lastPage : function() {
    var data = jApp.activeGrid.dataGrid.requestOptions.data,
      last_page = jApp.activeGrid.dataGrid.last_page;

    data.page = last_page;
    jUtility.executeGridDataRequest();
  },
}
