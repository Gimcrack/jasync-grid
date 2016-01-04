/**
 * bindings.js
 * @type {Object}
 *
 * methods dealing with events, bindings, and delegation
 */
;module.exports = {

  /**  **  **  **  **  **  **  **  **  **
   *   bind
   *
   *  binds event handlers to the various
   *  DOM elements.
   **  **  **  **  **  **  **  **  **  **/
  bind : function() {
    jUtility.setupBootpag();
    jUtility.setupSortButtons();
    jUtility.turnOffOverlays();
    jUtility.loadBindings();
    jUtility.setupHeaderFilters();
    jUtility.processGridBindings();
    jUtility.processFormBindings();
  }, // end bind fn

  /**
   * Load event bindings for processing
   * @method function
   * @return {[type]} [description]
   */
  loadBindings : function() {
      // form bindings
      jApp.opts().events.form = $.extend(true, require('../formBindings'), jApp.opts().events.form);

      // grid events
      jApp.opts().events.grid = $.extend(true, require('../gridBindings'), jApp.opts().events.grid);
  }, //end fn

  /**
   * Process the event bindings for the grid
   * @method function
   * @return {[type]} [description]
   */
  processGridBindings : function() {
    _.each( jApp.opts().events.grid, function( events, target ) {
      _.each( events, function(fn, event) {
          if (typeof fn === 'function') {
            jUtility.setCustomBinding( target, fn, event );
          }
      });
    });
  }, //end fn

  /**
   * Process the event bindings for the form
   * @method function
   * @return {[type]} [description]
   */
  processFormBindings : function() {

    _.each( jApp.opts().events.form, function( events, target ) {
      _.each( events, function(fn, event) {
          jUtility.setCustomBinding( target, fn, event, '.div-form-panel-wrapper', 'force' );
      });
    });
  }, //end fn

  /**
   * Set up a custom event binding
   * @method function
   * @param  {[type]}   event [description]
   * @param  {Function} fn    [description]
   * @return {[type]}         [description]
   */
  setCustomBinding : function( target, fn, event, scope, force ) {
    var eventKey = event + '.custom-' + $.md5( fn.toString() ),
        $scope = $(scope || document),
        scope_text = scope || 'document';

    if ( event === 'boot' ) {
      return (typeof fn === 'function') ? fn() : false;
    }

    // we cannot use event bubbling for scroll
    // events, we must use capturing
    if ( event !== 'scroll' ) {
      if ( !!$(window[target]).length ) {
        //jApp.log('Found target within global scope ' + target);
        //jApp.log('Binding event ' + eventKey + ' to target ' + target);
        $(window[target]).off(eventKey).on(eventKey, fn);

      } else if ( !jUtility.isEventDelegated(target,eventKey,scope_text) || force ) {

        //jApp.log('Binding event ' + event + ' to target ' + target + ' within scope ' + scope_text);
        $scope.undelegate(target,eventKey).delegate(target, eventKey, fn);
        jUtility.eventIsDelegated(target,eventKey,scope_text);
      }
    } else {
      document.addEventListener(event, fn , true);
    }
  }, // end fn

  /**
   * Has the event been delegated for the target?
   * @method function
   * @param  {[type]} target   [description]
   * @param  {[type]} eventKey [description]
   * @return {[type]}          [description]
   */
  isEventDelegated : function( target, eventKey, scope ) {
    return _.indexOf(jApp.aG().delegatedEvents, scope + '-' + target + '-' + eventKey) !== -1;
  }, // end fn

  /**
   * Mark event delegated
   * @method function
   * @param  {[type]} target   [description]
   * @param  {[type]} eventKey [description]
   * @param  {[type]} scope    [description]
   * @return {[type]}          [description]
   */
  eventIsDelegated : function( target, eventKey, scope) {
    return jApp.aG().delegatedEvents.push( scope + '-' + target + '-' + eventKey );
  }, // end fn

  /**
   * Attempt to locate jQuery target
   * @method function
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  locateTarget : function(target, scope) {
    // first look in the grid scope,
    // then the document scope,
    // then look through the window object
    // to see if the target is a member
    // of the global scope e.g. $(window)
    if (typeof scope === 'undefined') {
      return jApp.aG().$().find(target) || $(target) || $(window[target]);
    } else {
      return jApp.aG().$().find(target, scope) || $(target, scope) || $(window[target], scope);
    }
  }, //end fn

}
