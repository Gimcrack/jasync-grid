;(function(window) { 

  if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//"
      + window.location.hostname
      + (window.location.port ? ':' + window.location.port : '');
  }

  if (!Array.prototype.last){
     Array.prototype.last = function(){
         return this[this.length - 1];
     };
  }

  _.findKeyWhere = function(list, properties){
      var k;
      var filter = _.matches(properties);
      _.some(list, function(value, key){
          return filter(value) && (k = key);
      });
      return k;
  };

  $.fn.serializeObject = function() {
     var o = {};
     var a = this.serializeArray();
     $.each(a, function() {
         if ($(this).prop('disabled')) return;

         if ( !!$(this).attr('data-tokens') ) {
           jApp.log($(this).tokenInput('get'));
           o[this.name] = _.map( $(this).tokenInput('get'), 'name');
           return o;
         }

         if (o[this.name]) {
             if (!o[this.name].push) {
                 o[this.name] = [o[this.name]];
             }
             o[this.name].push(this.value || '');
         } else {
             o[this.name] = this.value || '';
         }
     });
     return o;
  };

  $.fn.clearForm = function() {
   return this.each(function() {
     if ( !!$(this).prop('disabled') || !!$(this).prop('readonly') ) return;

   var type = this.type, tag = this.tagName.toLowerCase();
     if (tag == 'form')
       return $(':input',this).clearForm();
     if (type == 'text' || type == 'password' || tag == 'textarea')
       this.value = '';
     else if (type == 'checkbox' || type == 'radio')
       this.checked = false;
     else if (tag == 'select')
        this.selectedIndex = (!!$(this).prop('multiple')) ? -1 : 0;
   $(this).psiblings('.form-control-feedback').removeClass('glyphicon-remove').removeClass('glyphicon-ok').hide();
   $(this).closest('.form_element').removeClass('has-error').removeClass('has-success');
   });
  };

  $.fn.psiblings = function(search) {
      // Get the current element's siblings
      var siblings = this.siblings(search);

      if (siblings.length != 0) { // Did we get a hit?
          return siblings.eq(0);
      }

      // Traverse up another level
      var parent = this.parent();
      if (parent === undefined || parent.get(0).tagName.toLowerCase() == 'body') {
          // We reached the body tag or failed to get a parent with no result.
          // Return the empty siblings tag so as to return an empty jQuery object.
          return siblings;
      }
      // Try again
      return parent.psiblings(search);
  };

  String.prototype.ucfirst = function() {
      return this.toString().charAt(0).toUpperCase() + this.slice(1);
  };

  String.prototype.ucwords = function() {
      return this.toString().replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  };
  
})(window);
