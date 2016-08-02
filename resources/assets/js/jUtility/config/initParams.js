/**
 * initParams.js
 *
 * Initial Parameters
 */
;module.exports = {
  action : 'new',
  store : jApp.store,
  currentRow : {},
  permissions : {},
  dataGrid : {

    // pagination parameters
    pagination : {
      totalPages : -1,
      rowsPerPage : jApp.store.get('pref_rowsPerPage',jApp.aG().options.rowsPerPage)
    },

    // ajax requests
    requests : [],

    // request options
    requestOptions : {
      url : jApp.prefixURL( jApp.aG().options.url ),
      data : {
        filter : jApp.aG().options.filter,
        scope : jApp.aG().options.scope || 'all',
        order : jApp.aG().options.order || 'oldest',
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
    $rowMenu : $('<div/>', { class : 'btn-group btn-group-sm rowMenu', style : 'position:relative !important' }),
  },

  forms : {},
  linkTables : [],
  temp : {},

}
