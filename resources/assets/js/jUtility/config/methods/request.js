/**
 * request.js
 *
 * methods dealing with ajax requests
 */
;module.exports = {
  /**
   * Get the data url of the current row
   * @method function
   * @return {[type]} [description]
   */
  getCurrentRowDataUrl : function() {
    // use the specified row data url if there is one
    if (typeof jApp.opts().rowDataUrl !== 'undefined') {
      return jApp.prefixURL( jApp.opts().rowDataUrl );
    }
    return jApp.routing.get( jUtility.getActionModel(), jUtility.getCurrentRowId() );
  }, //end fn

  /**
   * Get the inspect url of the current row
   * @method function
   * @return {[type]} [description]
   */
  getCurrentRowInspectUrl : function() {
    return jApp.routing.get('inspect', jUtility.getActionModel(), jUtility.getCurrentRowId() );
  }, //end fn

  /**
   * Kill pending ajax request
   * @method function
   * @param  {[type]} requestName [description]
   * @return {[type]}             [description]
   */
  killPendingRequest : function(requestName) {
    try{
      jApp.aG().dataGrid.requests[requestName].abort();
    } catch(e) {
      // nothing to abort
    }
  }, //end fn

  /**
   * get the requested url
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  get : function( requestOptions ) {
    var opts = $.extend(true,
      {
        url : null,
        data : {},
        success : function() { },
        always : function() { },
        fail : jUtility.callback.displayResponseErrors,
        complete : function() {}
      } , requestOptions );

    jApp.log('6.5 ajax options set, executing ajax request');
    return $.get(opts.url, opts.data, opts.success )
      .fail( opts.fail )
      .always( opts.always )
      .complete( opts.complete );
  }, // end fn

  /**
   * get JSON
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  getJSON : function( requestOptions ) {

      var opts = $.extend(true,
        {
          url : null,
          data : {},
          success : function() { },
          fail : jUtility.callback.displayResponseErrors,
          always : function() { },
          complete : function() {}
        } , requestOptions);

      jApp.log('6.5 ajax options set, executing ajax request');
      return $.getJSON(opts.url, opts.data, opts.success )
        .fail( opts.fail )
        .always( opts.always )
        .complete( opts.complete );
  }, // end fn

  /**
   * post JSON
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  postJSON : function( requestOptions ) {

      // if ( typeof requestOptions.data.append !== 'function' ) {
      //   requestOptions.data = jUtility.prepareFormData( requestOptions.data || {} );
      // }

      var opts = $.extend(true,
        {
          url : null,
          data : {},
          success : function() { },
          always : function() { },
          fail : jUtility.callback.displayResponseErrors,
          complete : function() {}
        } , requestOptions);

      return $.ajax({
          url: opts.url,
          data : opts.data,
          success : opts.success,
          type : 'POST',
          dataType : 'json',
        })
        .fail( opts.fail )
        .always( opts.always )
        .complete( opts.complete );
  }, // end fn

  /**
   * post JSON to upload a file
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  postJSONfile : function( requestOptions ) {

      // if ( typeof requestOptions.data.append !== 'function' ) {
      //   requestOptions.data = jUtility.prepareFormData( requestOptions.data || {} );
      // }

      var opts = $.extend(true,
        {
          url : null,
          data : {},
          success : function() { },
          always : function() { },
          fail : jUtility.callback.displayResponseErrors,
          complete : function() {}
        } , requestOptions);

      return $.ajax({
          url: opts.url,
          data : opts.data,
          success : opts.success,
          type : 'POST',
          dataType : 'json',
          processData : false,
          contentType : false,
          cache : false
        })
        .fail( opts.fail )
        .always( opts.always )
        .complete( opts.complete );
  }, // end fn

  /**
   * Execute the grid data request
   * @method function
   * @return {[type]} [description]
   */
  executeGridDataRequest : function( search ) {
    jApp.log('6.3 Setting up options for the data request');
    var params = $.extend(true,  jApp.aG().dataGrid.requestOptions,
        {
          success : jUtility.callback.update,
          fail 		: jUtility.gridDataRequestCallback.fail,
          always 	: ( !! search ) ? jUtility.gridDataRequestCallback.search : jUtility.gridDataRequestCallback.always,
          complete: jUtility.gridDataRequestCallback.complete
        } ),
        r = jApp.aG().dataGrid.requests;

    jUtility.DOM.clearGridFooter();

    // show the preloader
    jUtility.DOM.activityPreloader('show');

    // execute the request
    jApp.log('6.4 Executing ajax request');

    jUtility.killPendingRequest('gridData');


    r.gridData = jUtility.getJSON( params );
  }, //end fn

  /**
   * get the grid data
   * @method function
   * @param  {[type]} preload [description]
   * @return {[type]}         [description]
   */
  getGridData : function( preload ) {
    // show the preload if needed
    if (!!preload) {
      jUtility.DOM.togglePreloader();
      //jUtility.setupIntervals();
    }

    jUtility.clearCountdownInterval();

    jApp.log('6.1 Starting Countdown timer');
    // start the countdown timer


    // kill the pending request if it's still going
    jUtility.killPendingRequest('gridData');

    // use cached copy, if available
    if ( jUtility.isDataCacheAvailable() ) {
      jApp.log('6.2 Updating grid from cache');
      setTimeout( jUtility.updateGridFromCache(), 100);
    } else {
      jApp.log('6.2 Executing data request');
      jUtility.executeGridDataRequest();
    }
  }, // end fn

  /**
   * Grid data request callback methods
   * @type {Object}
   */
  gridDataRequestCallback : {
    /**
     * Grid data request failed
     * @method function
     * @return {[type]} [description]
     */
    fail : function() {
      console.warn( 'update grid data failed, it may have been aborted' );
    }, //end fn

    /**
     * Always execute after grid data request
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    always : function(response) {
      jUtility.callback.displayResponseErrors(response);
      if (jUtility.isCaching()) {
          jApp.aG().store.set('data_' + jApp.opts().table,response);
      }
      jUtility.DOM.togglePreloader(true);

    }, // end fn

    /**
     * Execute after grid data search request
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    search : function(response) {
      jUtility.callback.displayResponseErrors(response);
      if (jUtility.isCaching()) {
          jApp.aG().store.set('data_' + jApp.opts().table,response);
      }
      jUtility.DOM.togglePreloader(true);

      $('#search').focus().val( $('#search').val() );
    }, // end fn

    /**
     * Grid data request completed
     * @method function
     * @return {[type]} [description]
     */
    complete : function() {
      jUtility.DOM.activityPreloader('hide');
      jUtility.countdown();
    }, // end fn
  }, // end callbacks
}
