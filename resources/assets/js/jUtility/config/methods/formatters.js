/**
 * formatters.js
 *
 * methods dealing with string formats
 */

;module.exports = {

  /**
   * Format phone number
   * @method function
   * @param  {[type]} phonenum [description]
   * @return {[type]}          [description]
   */
  formatPhone : function(phonenum) {
      var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (regexObj.test(phonenum)) {
          var parts = phonenum.match(regexObj);
          var phone = "";
          if (parts[1]) { phone += "(" + parts[1] + ") "; }
          phone += parts[2] + "-" + parts[3];
          return phone;
      }
      else {
          //invalid phone number
          return phonenum;
      }
  }, // emd fn

  /**
   * Format zip code
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatZip : function(z) {
      z = z.replace(/[^0-9-]/gi, "");
    if (/^\d{6,9}$/.test(z)) {
      z = z.substring(0,5) + "-" + z.substring(5);
      return z;
    }
    else {
      return z.substring(0,10);
    }
  }, // end fn

  /**
   * Format number
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatNumber : function(z) {
    if ( isNaN(parseFloat(z)) ) {
      if ( !isNaN( z.replace(/[^0-9\.]/gi, "") ) ) {
        return z.replace(/[^0-9\.]/gi,"") ;
      } else {
        return '';
      }
    }
    else {
      return parseFloat(z);
    }
  }, // end fn

  /**
   * Format Integer
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatInteger : function(z) {
    if (!isNaN(z)) {
      return Math.round(z);
    }
    else {
      return z.replace(/[^0-9]/gi, "");
    }
  }, // end fn

  /**
   * Format SSN
   * @method formatSSN
   * @param  {[type]}  z [description]
   * @return {[type]}    [description]
   */
  formatSSN : function(z) {
    z = z.replace(/\D/g, '');

    switch (z.length) {
      case 0:
      case 1:
      case 2:
      case 3:
        return z;

      case 4:
      case 5:
        return z.substr(0,3) + '-' + z.substr(3);
    }

    return z.substr(0,3) + '-' + z.substr(3,2) + '-' + z.substr(5);
  }, // end fn

  /**
   * Format UpperCase
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatUC : function(z) {
    return z.toUpperCase();
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   prepareValue
   *
   *  @value 	(str) the column value as
   *  		specified in the JSON
   *  		data
   *  @column (str) the column name as
   *  		specified in the JSON
   *  		data
   *
   *  @return (str) the prepared value
   *
   *  prepares the value for display in
   *  the DOM, applying a template
   *  function if applicable.
   **  **  **  **  **  **  **  **  **  **/
  prepareValue : function(value,column) {
    var template,
        templateFunctions = $.extend(true, {}, jApp.cellTemplates, jApp.opts().templates);

    if (value == null) {
      value = '';
    }

    if (value.toString().toLowerCase() === 'null') {
      return '';
    }

    if (typeof templateFunctions[column] === 'function') {
      template = templateFunctions[column];
      value = template(value);
    }

    if (value.toString().trim() === '') {
      return '';
    }

    if (value.toString().indexOf('|') !== -1) {
      value = value.replace(/\|/gi,', ');
    }

    if ( jUtility.isEllipses() ) {
      value = jUtility.ellipsis( value );
    }

    return value;
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   ellipsis
   *
   *  Truncates cells that are too long
   *  according to the maxCellLength grid
   *  option. Adds a read-more button to
   *  any cells that are truncated.
   **  **  **  **  **  **  **  **  **  **/
  ellipsis : function( txt ) {
    var $rdMr, $dtch, $btn, $truncated, $e;

    $btn = $('<button/>', {
      'class' : 'btn btn-success btn-xs btn-readmore pull-right',
      'type' : 'button'}
    ).html(' . . . ');

    $e = $('<div/>').html(txt);

    if ( $e.text().length > jApp.opts().maxCellLength ) {
      // look for child html elements
      if ( $e.find(':not(i)').length > 0) {
        $rdMr = $('<span/>', {'class':'readmore'});

        while ( $e.text().length > jApp.opts().maxCellLength ) {
          // keep detaching html elements until the cell length is
          // within allowable limits

          // store detached element
          $dtch = ( !!$e.find(':not(i)').last().parent('h4').length ) ?
            $e.find(':not(i)').last().parent().detach() :
            $e.find(':not(i)').last().detach();

          // append the detached element to the readmore span
          $rdMr.html( $rdMr.html( ) + ' ' ).append($dtch);

          // clean up the element html of extra whitespace
          $e.html( $e.html().replace(/(\s*)?\,*(\s*)?$/ig,'') );
        }

        $e.append($rdMr).prepend($btn);
      }// end if

      // all text, no child html elements in the cell
      else {
        // place the extra text in the readmore span
        $rdMr = $('<span/>', {'class':'readmore'})
          .html( $e.html().substr(jApp.opts().maxCellLength) );

        // truncate the visible text in the cell
        $truncated = $e.html().substr(0,jApp.opts().maxCellLength);

        $e.empty().append($truncated).append($rdMr).prepend($btn);
      } // end else
    }// end if

    return $e.html();

  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   render
   *
   *  @str   (string) containing
   *  		multiline text
   *
   *  @params (obj) contains key/value pairs
   *  		  defining parameters that
   *  		  will be interpolated in
   *  		  the returned text
   *
   *  returns the interpolated text
   **  **  **  **  **  **  **  **  **  **/
  render : function(str,params) {
    var ptrn;

    //if (typeof params !== 'object') return '';

    _.each( params, function(val, key) {
      ptrn = new RegExp( '\{@' + key + '\}', 'gi' );
      str = str.replace(ptrn, val );
    });

    return str.replace(/\{@.+\}/gi,'');
  }, //end fn

  /**  **  **  **  **  **  **  **  **  **
   *   interpolate
   *
   *  @value (str) string to be interpolated
   *
   *  @return (str) the interpolated string
   *
   *  recursively processes the input value and
   *  replaces parameters of the form
   *  {@ParamName} with the corresponding
   *  value from the JSON data. Uses the
   *  replace callbak jUtility.replacer.
   *
   *  e.g. {@ParamName} -> jApp.aG().dataGrid.data[row][ParamName]
   **  **  **  **  **  **  **  **  **  **/
  interpolate : function(value) {
    return value.replace(/\{@(\w+)\}/gi, jUtility.replacer);
  }, // end fn

  /**  **  **  **  **  **  **  **  **  **
   *   replacer - RegExp replace callback
   *
   *  @match 	(str) the match as defined
   *  			by the RegExp pattern
   *  @p1	  	{str} the partial match as
   *  			defined by the first
   *  			capture group
   *  @offset	(int) the offset where the
   *  			match was found in @string
   *  @string	(str) the original string
   *
   *  @return	(str) the replacement string
   **  **  **  **  **  **  **  **  **  **/
  replacer : function(match, p1) {
    return jApp.aG().currentRow[p1];
  }, // end fn

}
