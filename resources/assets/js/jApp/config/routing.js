/**
 * routing.js
 *
 * configures the routing patterns for the app
 */

;module.exports = {
  routing : {

    /**
     * Get the route for the specified parameters
     * @method function
     * @param  {[type]} route     [description]
     * @param  {[type]} model     [description]
     * @param  {[type]} optionKey [description]
     * @param  {[type]} labelKey  [description]
     * @return {[type]}           [description]
     */
    get : function( route, model, optionKey, labelKey ) {
      if ( typeof jApp.routing[ route ] === 'function' ) {
        return jApp.prefixURL( jApp.routing[ route ]( model, optionKey, labelKey ) );
      } else {
        return jApp.prefixURL( jApp.routing.default( route || model, model || null ) );
      }
    },

    /**
     * Checked out records route
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    checkedOut : function( model ) {
      return model + '/_checkedOut';
    },

    /**
     * Checkout a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    checkout : function( model, id ) {
      return model + '/' + id + '/_checkout';
    },

    /**
     * Checkin a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    checkin : function( model, id ) {
      return model + '/' + id + '/_checkin';
    },

    /**
     * Get permissions for a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    getPermissions : function( model ) {
      return model + '/_getPermissions' ;
    },

    /**
     * get select options for a model
     * @method function
     * @param  {[type]} model [description]
     * @param  {[type]}       [description]
     * @return {[type]}       [description]
     */
    selectOptions : function( model, optionKey, labelKey ) {
      return model + '/_selectOptions/' + optionKey + '_' + labelKey;
    },

    /**
     * get token options for a model
     * @method function
     * @param  {[type]} model [description]
     * @param  {[type]}       [description]
     * @return {[type]}       [description]
     */
    tokenOptions : function( model, optionKey, labelKey ) {
      return model + '/_tokenOptions/' + optionKey + '_' + labelKey;
    },

    /**
     * Get the route for a mass update for a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    massUpdate : function( model ) {
      return model + '/_massUpdate'
    },

    /**
     * default route for a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    default : function( model, id ) {
      return ( !!id ) ? model + '/' + id : model;
    },
  }
}
