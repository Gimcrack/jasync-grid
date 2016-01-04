/**
 * intervals.js
 *
 * methods dealing with intervals and timeouts
 */

;module.exports = {

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
   * setTimeout helper
   * @method function
   * @param  {[type]}   o.key   [description]
   * @param  {Function} o.fn    [description]
   * @param  {[type]}   o.delay [description]
   * @return {[type]}         [description]
   */
  timeout : function(o) {
    try{
      clearTimeout( jApp.aG().dataGrid.timeouts[o.key] );
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
      clearInterval( jApp.aG().dataGrid.intervals[o.key] );
    } catch(ignore) {}

    jApp.aG().dataGrid.intervals[o.key] = setInterval(o.fn, o.delay );
  }, //end fn

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
}
