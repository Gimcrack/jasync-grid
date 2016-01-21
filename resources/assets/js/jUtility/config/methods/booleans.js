/**
 * booleans.js
 *
 * methods for checking boolean values
 */

;module.exports = {
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
   * Is an "other" button checked?
   * @method function
   * @return {[type]} [description]
   */
  isOtherButtonChecked : function() {
    return !!$('.btn-editOther.active').length;
  }, // end fn

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
    return typeof jApp.opts().toggles[key] === 'undefined' || !!jApp.opts().toggles[key];
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
   * Does the form exist
   * @param  {[type]} key [description]
   * @return {[type]}          [description]
   */
  isFormExists : function( key ) {
    return ( typeof jApp.aG().forms[ '$' + key ] !== 'undefined' ||
             typeof jApp.aG().forms[ 'o' + key.ucfirst() ] !== 'undefined' ||
             typeof jApp.aG().forms[ key ] !== 'undefined'  );
  }, // end fn

  /**
   * Check permission on the button parameters
   * @method function
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  isPermission : function( params ) {
    if (!params['data-permission']) return true;
    return !!jApp.activeGrid.permissions[ params['data-permission'] ];
  }, // end fn

  /**
   * The row needs to be checked out
   * @method function
   * @return {[type]} [description]
   */
  needsCheckout : function() {
    var action = jApp.aG().action;
    return ( jUtility.isCheckout() && ( action === 'edit' || action === 'delete' || action.indexOf('edit') === 0 ) );
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
   * Are Header Filters Non-empty
   * @method function
   * @return {[type]} [description]
   */
  areHeaderFiltersNonempty : function() {
    return !!jApp.tbl().find('.header-filter').filter( function() {
      return !!this.value;
    }).length;
  }, //end fn
}
