/**
 *  jApp.class.js - Custom Grid App container
 *
 *
 *  Defines the properties and methods of the
 *  custom app class.
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 */
'use strict';

var $ = require('jQuery'),
		_ = require('underscore');

$.jStorage = require('./jStorage/jstorage');

module.exports = function() {

		var self = this;

		this.store = $.jStorage;

		this.debug = true;

		if (this.debug) {
			console.warn( 'DEBUG MODE ON ');
			//$.jStorage.flush();
		}

		this.oG = {
			admin : {

			}
			// extend this oG object with the individual page grid objects
		};

		this.views = {
			//extend this views object with individual page views
			admin : {

			}
		};

		this.grids = {
			admin : {

			}
		};

		this.activeGrid = {};

		this.openForms = [];

		/**
		 * Placeholder for the colparams object
		 * @type {Object}
		 */
		this.colparams = {
			Group : [
            { // fieldset
              label : 'Group Details',
              helpText : 'Please fill out the following information about the group.',
              class : 'col-lg-4',
              fields : [
                {
                  name : 'name',
                  placeholder : 'e.g. Administrators',
                  _label : 'Group Name',
                  _enabled : true,
                  required : true,
                  'data-validType' : 'Anything',
                }, {
                  name : 'description',
                  type : 'textarea',
                  _label : 'Description',
                  _enabled : true
                }, {
                  name : 'modules',
                  type : 'select',
                  _label : 'Assign roles/permissions to this group',
                  _enabled : true,
                  _labelssource : 'a|b|c|d',
                  _optionssource : '1|2|3|4',
                  multiple : true,
                }
              ]
            }, {
              class : 'col-lg-8',
              fields : [
                {
                  name : 'users',
                  type : 'array',
                  _label : 'Add Users to this Group',
                  _enabled : true,
                  fields : [
                    {
                      name : 'users',
                      type : 'select',
                      _label : 'Select Users',
                      _labelssource : 'a|b|c|d',
                      _optionssource : '1|2|3|4',
                      _enabled : true,
                      multiple : true
                    }, {
                      name : 'comment[]',
                      placeholder : 'Optional Comment',
                      _enabled : true,
                    }
                  ]
                },
              ]
            }
          ]
		};

		/**
		 * Convenience function to access the active grid object
		 * @method function
		 * @return {[type]} [description]
		 */
		this.aG = function() {
			return this.activeGrid;
		};

		/**
		 * Get the table from the corresponding model
		 * @param  {[type]} model [description]
		 * @return {[type]}       [description]
		 */
		this.model2table = function( model ) {

			var RuleExceptions = {
				Person : 'people'
			};

			return ( RuleExceptions[model] == null ) ?
				(model + 's').toLowerCase() :
				RuleExceptions[model];
		};

		/**
		 * Convenience function to access the $grid object
		 * in the active grid
		 * @method function
		 * @return {[type]} [description]
		 */
		this.tbl = function() {
			return this.activeGrid.DOM.$grid;
		};


		/**
		 * Convenience function to access the options
		 * of the active grid
		 * @method function
		 * @return {[type]} [description]
		 */
		this.opts = function() {
			return this.activeGrid.options;
		};

		this.log = function(msg,force) {
			if (!!self.debug || !!force) {
				console.log(msg);
			}
		};

		this.warn = function(msg,force) {
			if (!!self.debug || !!force) {
				console.warn(msg);
			}
		};

	}
