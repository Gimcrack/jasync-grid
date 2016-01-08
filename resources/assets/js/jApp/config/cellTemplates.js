/**
 * cellTemplate.js
 *
 * Cell template formatting functions
 */

;module.exports = function(self) {

  return {
      cellTemplates : {

      id : function(value) {
    		return ('0000' + value).slice(-4);
    	},

      name : function(value) {
      	var r = self.activeGrid.currentRow;
      	return value.link( window.location.href.trim('/') + '/' + r.id );
      },

      person_name : function() {
				var r = self.activeGrid.currentRow;
				return ( !! r.person && r.person.name != null) ? r.person.name : '';
			},

      username : function(value) {
      	var r = self.activeGrid.currentRow;
      	return value.link( window.location.href.trim('/') + '/' + r.id );
      },

      email : function(value) {
  			return value.link( 'mailto:' + value );
  		},

      users : function(arr) {
      	return _.pluck(arr, 'username').join(', ');
      },

      modules : function(arr) {
      	return _.pluck(arr, 'role').join(', ');
      },

      group_modules : function(arr) {
				return _.compact(_.flatten(_.map(  self.activeGrid.currentRow.groups, function(row, i) {
					return (row.modules.length) ? _.map(row.modules, function(o, ii ) { return o.role + ' (' + o.name + ')' }) : false
				} ))).join(', ');
			},

      user_groups : function(arr) {
        return _.compact(_.flatten(_.map(  self.activeGrid.currentRow.users, function(row, i) {
        	return (row.groups.length) ? _.pluck(row.groups,'name') : false
        } ))).join(', ');
      },

      groups : function(arr) {
				return _.map(arr, function(o ) {
					if (o.pivot.comment != null) {
						return o.name + ' (' + o.pivot.comment + ')';
					}
					return o.name;
				}).join(', ');
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
