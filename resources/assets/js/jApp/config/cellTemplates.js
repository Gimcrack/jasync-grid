/**
 * cellTemplate.js
 *
 * Cell template formatting functions
 */

;module.exports = function(self) {

  _.nameButton = function(value,icon) {
    var iconString = (!!icon) ? '<i class="fa fa-fw ' + icon + '"></i>' : '';
    return ('<button style="padding:4px" class="btn btn-link btn-chk">' + iconString + value + '</button>')
  }

  _.link = function(value, icon, external) {
    var row = self.activeGrid.currentRow,
        id = row.id,
        href = window.location.href.trim('/');

    switch (true) {
      case (!!icon && !!external) :
        value = ('<span><i class="fa fa-fw ' + icon + '"></i>' + value + '<i class="fa fa-fw fa-external-link"></i></span>');
      break;

      case (!!icon) :
        value = ('<span><i class="fa fa-fw ' + icon + '"></i>' + value + '</span>');
      break;

      case (!!external) :
        value = ('<span>' + value + '<i class="fa fa-fw fa-external-link"></i></span>');
      break;
    }

    return value.link( href + '/' + id  );
  }

  _.email = function(value, icon) {

    var row = self.activeGrid.currentRow,
        id = row.id,
        href = window.location.href.trim('/'),
        text = (!!icon) ?
      ('<span><i class="fa fa-fw ' + icon + '"></i>' + value + '<i class="fa fa-fw fa-external-link"></span>') :
      ('<span><i class="fa fa-fw fa-envelope"></i>' + value + '<i class="fa fa-fw fa-external-link"></span>');


    return text.link( 'mailto:' + value  );
  }

  _.get = function(key, target, callback, icon, model) {
    var tmpKeyArr = key.split('.'),
        tmpKeyNext,
        returnArr;

    // move variables around
    if (typeof target === 'string') {
      icon = target;
      target = null;
    }

    if (typeof callback === 'string') {
      if (callback.indexOf('fa-') === 0) {
        model = icon;
        icon = callback;
      } else {
        model = callback;
        icon = null
      }
      callback = null;
    }

    if (target != null ) {
      return _.map(target,function(row,i) {
        var iconString = (!!icon) ? '<i class="fa fa-fw ' + icon + '"></i>' : '';
        return ('<button style="padding:4px" class="btn btn-link btn-editOther" data-id="' + row.id + '" data-model="' + model + '">' + iconString + row[key] + '</button>')
      });
    } else {

      target = self.activeGrid.currentRow;

      while (tmpKeyArr.length > 1) {
        tmpKeyNext = tmpKeyArr.shift();

        if (target[tmpKeyNext] != null) {
          target = target[tmpKeyNext];
        } else {
          console.warn(key + ' is not a valid key of ');
          console.warn(target);
          return false;
        }
      }

      switch ( typeof target[tmpKeyArr[0]] ) {
        case 'undefined' :
          return false;
        break;

        case 'string' :
          returnArr = [target[tmpKeyArr[0]]];
        break;

        default :
          returnArr = target[tmpKeyArr[0]];
      }
    }

    if (!!callback) {
      returnArr = returnArr.map(callback);
    }

    if (!!icon) {
      returnArr = returnArr.map( function(val) {
        return ('<span><i class="fa fa-fw ' + icon + '"></i>' + val + '</span>');
      })
    }

    console.log(returnArr);

    return returnArr.join(' ');

  }

  /**
   * pivotExtract
   *
   *	Pulls a unique, flattened list out of the specified
   *	target or the current row. Optionally, you can
   *	specify a callback function which will be applied
   *	to the list using .map. You can also specify a
   *	font-awesome icon to be applied to each item in the list.
   *
   * @method function
   * @param  {[type]}   target   [description]
   * @param  {Function} callback [description]
   * @param  {[type]}   icon     [description]
   * @return {[type]}            [description]
   */
  _.pivotExtract = function(target, callback, icon) {

    // find the target. If it's a string it's a key of the currentRow
    if (typeof target !== 'object') {
      target = self.activeGrid.currentRow[target];
    }

    var a = _.uniq( // return unique values
              _.compact( // remove falsy values
                _.flatten( // flatten multi-dimensional array
                  _.map(  // map currentRow.users return list of group names
                    target, callback
                  )
                )
              )
            );

    // add the icons if applicable
    if (icon != null) {
      a = a.map( function(val) {
        return ('<span><i class="fa fa-fw ' + icon + '"></i>' + val + '</span>')
      });
    }

    return a.join(' '); // join the list and return
  }


  return {
      cellTemplates : {

      id : function(value) {
    		return ('0000' + value).slice(-4);
    	},

      name : function(value) {
      	return _.nameButton(value, self.opts().gridHeader.icon);
      },

      hostname : function(value) {
        return _.nameButton(value, 'fa-server');
      },

      username : function(value) {
        return _.nameButton(value, 'fa-user');
      },

      person_name : function() {
				return _.get('person.name', 'fa-male');
			},

      email : function(value) {
  			return _.email(value);
  		},

      users : function(arr) {
      	return _.get('username', arr, 'fa-user', 'User');
      },

      roles : function(arr) {
      	return _.get('name', arr, 'fa-briefcase', 'Role');
      },

      groups : function(arr) {
        return _.get('name', arr, 'fa-users', 'Group');
      },

      group_roles : function(arr) {
				return  _.pivotExtract( 'groups', function(row, i) {
          return (row.roles.length) ? _.get('name',row.roles,'fa-briefcase','Role') : false
        });
			},

      group_users : function(arr) {
				return _.pivotExtract( 'groups',  function(row, i) {
					return (row.users.length) ? _.get('username',row.users,'fa-user','User') : false
				});
			},

      user_groups : function(arr) {
        return _.pivotExtract( 'users', function(row, i) {
           return (row.groups.length) ? _.get('name',row.groups,'fa-users','Group') : false
         });
      },

      created_at : function(value) {
      	return date('Y-m-d', strtotime(value));
      },

      updated_at : function(value) {
      	return date('Y-m-d', strtotime(value));
      },

      permissions : function() {
  			var row = jApp.aG().currentRow,
  					p = [];

  			if ( !!Number(row.create_enabled) ) p.push('Create');
  			if ( !!Number(row.read_enabled )) p.push('Read');
  			if ( !!Number(row.update_enabled) ) p.push('Update');
  			if ( !!Number(row.delete_enabled) ) p.push('Delete');

  			return p.join(', ');
  		},


    }
  }
}
