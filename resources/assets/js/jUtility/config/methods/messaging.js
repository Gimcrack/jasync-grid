/**
 * messaging.js
 *
 * methods dealing with messaging
 */

;module.exports = {
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
      return noty({
        layout: 'bottomLeft',
        text : message,
        type : type || 'info',
        dismissQueue: true,
        timeout : 3000
      });
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
}
