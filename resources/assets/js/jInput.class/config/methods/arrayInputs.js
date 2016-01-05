/**
 * arrayInputs.js
 *
 * Array Input Methods
 */
;module.exports = {
  /**
   * Process array field from parameters
   * @method function
   * @param  {[type]} params [description]
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  processArrayField : function( params ) {
    var $container = $('<div/>', { class : 'array-field-container alert alert-info' }).data('colparams', params),
        $table = $('<table/>', { class : '' } ),
        masterSelect = self.fn.getArrayMasterSelectParams(params.fields[0]),
        inpt;

    self.arrayField = true;

    self.DOM.$container = $container;
    self.DOM.$table = $table;

    // add a row with the master select
    inpt = new jInput( { atts : masterSelect, form: self.form } );
    self.oInpts[ masterSelect.name ] = inpt;
    $container.append( inpt.fn.handle() );

    // set up the custom multiselect object
    inpt.fn.multiselect( self.fn.getArrayMasterSelectMultiSelectOptions() );

    // add the table to the container
    $container.append($table);

    // setup the singleSelect parameters
    params.fields[0] = self.fn.getArraySingleSelectParams( params.fields[0] );

    // setup the names of the additional parameters
    _.each( params.fields, function(o,i) {
      if (i===0) return false;

      var baseName = params.fields[0].name.replace('[]','');
      o['data-pivotName'] = o.name;
      o.name = baseName + '[][' + o.name + ']';
    });

    return $container;
  }, // end fn

  /**
   * Add rows corresponding to the selected array values
   * @method function
   * @return {[type]} [description]
   */
  arrayAddValues : function() {
    var multiSelect = this,
        selectedRaw = multiSelect.getSelected(),
        selectedOptions = selectedRaw.map( function(i,elm) { return +$(elm).attr('value') } ),
        selectedLabels = selectedRaw.map( function(i,elm) { return $(elm).html() });

    console.log(selectedOptions);

    _.each( selectedOptions, function( val, i) {
      self.fn.arrayAddRow( val );
    });

    this.clearSelection();

  }, // end fn

  /**
   * Get Array MasterSelect Parameters
   * @method function
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getArrayMasterSelectParams : function( params ) {
    return $.extend({}, params, {
      class : 'no-bsms',
      multiple : true,
      name : params.name + '-masterSelect'
    });
  }, // end fn

  /**
   * Get Array SingleSelect Parameters
   * @method function
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getArraySingleSelectParams : function( params ) {
    delete params._label;
    delete params.multiple;

    return $.extend({}, params, {
        class : 'no-bsms form-control',
        name : params.name.replace('[]','') + '[]'
    });
  }, // end fn

  /**
   * Get array MasterSelect Multiselect options
   * @method function
   * @return {[type]} [description]
   */
  getArrayMasterSelectMultiSelectOptions : function() {
    return $.extend(true, {}, self.options.bsmsDefaults, {
      buttonClass : 'btn btn-primary',
      onDropdownHidden : self.fn.arrayAddValues
    } );
  }, // end fn

  /**
   * Populate and array field with the form data
   * @return {[type]} [description]
   */
  populateArrayFormData : function( oInpt, data ) {
    self.fn.arrayRemoveAllRows( oInpt.$() );
    jApp.log('------Array Data------' );
    jApp.log(data);

    // iterate through the data rows and populate the form
    _.each( data, function( obj ) {

      // create a row in the array field table
      jApp.log('--------Adding Row To The Array ---------');
      jApp.log( oInpt.$() );
      self.fn.arrayAddRowFromContainer( oInpt.$(), obj );

    });

    // boot the form
    jUtility.formBootup();

  }, // end fn

  /**
   * Add row to array field from container
   * @param  {[type]} $container [description]
   * @return {[type]}            [description]
   */
  arrayAddRowFromContainer : function( $container, data ) {
    var $table = $container.find('table'),
        params = $container.data('colparams'),
        $tr_new = jUtility.oCurrentForm().fn.populateFieldRow( params, 1, data || {} ),
        $btn_add = $table.find('.btn-array-add').eq(0).detach();

    $table.find('.btn-array-add,.no-row-filler').remove();

    $table.append($tr_new);

    if (!$table.find('.btn-array-add').length) {
        $table.find('tr:last-child').find('td:last-child,th:last-child').append($btn_add);
    }

  }, // end fn

  /**
   * Add row to an array input
   * @method function
   * @return {[type]} [description]
   */
  arrayAddRow : function( value ) {
    var $container = self.DOM.$container,
        $table = $container.find('table'),
        params = $container.data('colparams'),
        $tr_new = jUtility.oCurrentForm().fn.populateFieldRow( params, 1, { id : value || null, pivot : null } );

    if (!!params.max && +$table.find('tr').length-1 === params.max) {
      return jUtility.msg.warning('This field requires at most ' + params.max + ' selections.');
    }

    $table.find('.btn-array-add,.no-row-filler').remove();

    $table.append($tr_new);

    // rename inputs so they all have unique names
    // $table.find('tr').each( function( i, elm ) {
    //   $(elm).find(':input').each( function(ii, ee) {
    //     $(ee).attr('name', $(ee).attr('data-name') + '_' + i)
    //   });
    // });

    jUtility.formBootup();
  }, // end fn

  /**
   * Remove a row from an array input table
   * @return {[type]} [description]
   */
  arrayRemoveRow : function() {
    var $container = $(this).closest('.array-field-container'),
        $table = $(this).closest('table'),
        $tr = $(this).closest('tr'),
        params = $container.data('colparams'),
        $btn_add = $table.find('.btn-array-add').detach();


    if (!!params.min && +$table.find('tr').length-1 === params.min) {
      $table.find('tr:last-child').find('td:last-child').append($btn_add);
      return jUtility.msg.warning('This field requires at least ' + params.min + ' selections.');
    }

    $tr.remove();

    // rename inputs so they all have unique names
    // $table.find('tr').each( function( i, elm ) {
    //   $(elm).find(':input').each( function(ii, ee) {
    //     $(ee).attr('name', $(ee).attr('data-name') + '_' + i)
    //   });
    // });
    if  ( !$table.find('tr').length ) {
      $table.append( '<tr class="no-row-filler"><td></td></tr>' );
    }

    $table.find('tr:last-child').find('td:last-child,th:last-child').append($btn_add);
  }, // end fn

  /**
   * [function description]
   * @param  {[type]} $inpt [description]
   * @return {[type]}       [description]
   */
  arrayRemoveAllRows : function($container) {
    var $table = $container.find('table'),
        $btn_add = $table.find('.btn-array-add').detach();

    $table.empty();
    $table.append( '<tr class="no-row-filler"><td></td></tr>' );
    $table.find('tr:last-child').find('td:last-child,th:last-child').append($btn_add);
  }, // end fn
}
