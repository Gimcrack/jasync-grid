/**
 * methods.js
 *
 * jApp method definitions
 *
 */

;module.exports = {
  /**
   * Convenience function to access the active grid object
   * @method function
   * @return {[type]} [description]
   */
  aG : function() {
    return this.activeGrid
  }, // end fn

  /**
   * Prefix url with api route prefix
   * @method function
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  prefixURL : function(url) {
    // sanitize url
    url = url.replace('http://',''); 	// remove http://
    url = url.replace('https://',''); // remove https://
    url = url.replace(this.apiRoutePrefix,'') // remove api route prefix, if it has already been applied

    // add the api route prefix
    url = this.apiRoutePrefix + '/' + url;

    // remove any doubled-up slashes
    url = url.replace(/\/\//gi,'/');

    return url;
  }, // end fn

  /**
   * Get the table from the corresponding model
   * @param  {[type]} model [description]
   * @return {[type]}       [description]
   */
  model2table : function( model ) {

    var RuleExceptions = {
      Person : 'people'
    };

    return ( RuleExceptions[model] == null ) ?
      (model + 's').toLowerCase() :
      RuleExceptions[model];
  }, // end fn

  /**
   * Convenience function to access the $grid object
   * in the active grid
   * @method function
   * @return {[type]} [description]
   */
  tbl : function() {
    return this.activeGrid.DOM.$grid;
  }, // end fn


  /**
   * Convenience function to access the options
   * of the active grid
   * @method function
   * @return {[type]} [description]
   */
  opts : function() {
    return this.activeGrid.options;
  }, // end fn

  /**
   * Log a message
   * @method function
   * @param  {[type]} msg   [description]
   * @param  {[type]} force [description]
   * @return {[type]}       [description]
   */
  log : function(msg,force) {
    if (!!self.debug || !!force) {
      console.log(msg);
    }
  }, // end fn

  /**
   * Log a warning message
   * @method function
   * @param  {[type]} msg   [description]
   * @param  {[type]} force [description]
   * @return {[type]}       [description]
   */
  warn : function(msg,force) {
    if (!!self.debug || !!force) {
      console.warn(msg);
    }
  }, // end fn

}
