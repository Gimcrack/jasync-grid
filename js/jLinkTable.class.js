/**  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **
 *  
 *  jLinkTable.class.js - Aysnc Grid LinkTable Class
 *  
 *  Matsu Borough IT Dashboard
 *  
 *  Defines the properties and methods of the 
 *  custom LinkTable Class. 
 *  
 *  Jeremy Bloomstrom | jeremy.bloomstrom@matsugov.us
 *  Programmer Analyst
 *  Matsu Borough IT
 *  
 *  Created: 		5/1/15
 *  Last Updated: 	4/20/15
 *  
 *  Prereqs: 	jQuery, underscore.js, jStorage.js
 *  
 *  Changelog:
 *   5-1-15		Created the class
 *  
 */
// javascript closure
;(function( window, jQuery, $, _, jInput, jForm, jApp ) {

	'use strict';
	
	var jLinkTable = function( options ) {
		/**  **  **  **  **  **  **  **  **  ** 
 		 *   VARS
 		 **  **  **  **  **  **  **  **  **  **/
		
		// alias this
		var self = this;
		this.store = $.jStorage;
		this.form = {};
		this.linkTable = '';
		this.colParams = [];
		
		/**  **  **  **  **  **  **  **  **  ** 
		 *   DEFAULT OPTIONS
		 *  
		 *  Set the default options for the 
		 *  instance here. Any values specified
		 *  at runtime will overwrite these
		 *  values.
		 **  **  **  **  **  **  **  **  **  **/
		
		this.options = {
			
			oFrm : {},
			
			// tables 
			tables : {
				parent : 'ptable',
				child : 'ctable',
				child2 : '',
				child3 : '',
			},
			
			dataView : '',
			
			childFriendlyName : '',
			
			// whether to allow multiple
			multiple : true,
			
			// whether the value is required
			required : false,
			
			// html attributes
			atts : {
				'type' : 'text',
				'class' : 'form-control'
			},
			
			// external data for tables, etc.
			extData : true,
			
			// TTL for external data (mins)
			ttl : 60*60000,
			
			// callback for the completed colParams
			callback : alert,
			
		}; // end options
		
		// set the runtime values for the options
		$.extend(true,this.options, options);
		
		this.store.setTTL( 'lkTable_names', self.options.ttl );
		
		/**  **  **  **  **  **  **  **  **  ** 
 		 *   FUNCTION DEFS
 		 **  **  **  **  **  **  **  **  **  **/
		this.fn = {
			
			preinit : function() {
				
				// load external data
				if (!!self.options.extData) {
					
					// find out if we have it cached locally
					if ( !!self.store.get( 'lkTable_names', false ) ) {
						
						// retrieve from storage
						self.callback.preinit( self.store.get( 'lkTable_names' ) );	
					
					} else { // get external options
						// set up request
						self.requestOptions = {
							url : window.location.href,
							data : {
								frm_name : 'frm_getLinkTables'
							},
						};
						
						// execute request
						$.getJSON(self.requestOptions.url,
									self.requestOptions.data,
									self.callback.preinit 
						).always( function(response) {
							self.store.set( 'lkTable_names', response );
						});
					}
				} else {
					// use default schema
					
					self.callback.preinit(  
					[ 	'lk_ApplicationContact', 'lk_ApplicationServer', 'lk_ApplicationTask',
						'lk_ContactGroup', 'lk_DatabaseContact', 'lk_DatabaseServer', 
						'lk_ModuleContact', 'lk_Notification', 'lk_OutageTask', 
						'lk_OutageTaskApplicationContact', 'lk_OutageTaskServerContact',
						'lk_ProjectGroup', 'lk_ServerContact', 'lk_ServerTask', 'lk_UserContact' ] 
					);
				}
				
			}, // end fn
			
			_init : function() {
				var p = self.options.tables.parent,
					c1 = self.options.tables.child,
					c2 = self.options.tables.child2,
					c3 = self.options.tables.child3,
					test = ['lk_' + p + c1,
							'lk_' + c1 + p,
							'lk_' + p + c1 + c2 + c3,
							'lk_' + p + c1 + c3 + c2,
							'lk_' + c1 + p + c2 + c3,
							'lk_' + c1 + p + c3 + c2],
					found = '';
				
				_.each( test, function(v) { 
					var f = _.find( self.options.schema, function(val) { return !val &&  val.indexOf(v) > -1 });
					if (typeof f !== 'undefined') { found = f; }
				});	
				
				self.linkTable = found;
				
				self.fn.form();

			}, // end fn
			
			form : function() {
				var p = self.options.tables.parent,
					c = self.options.tables.child,
					source = (self.options.dataView !== '') ? self.options.dataView : c,
					pid = p + 'ID',
					cid = c + 'ID',
					selectName = (self.options.multiple) ? cid + 's' : cid,
					optsSource = source + '.' + cid,
					lblsSource = source + '.' + self.options.childFriendlyName;
					
				self.colParams = 
					 [
						{
							name : 'linkTable',
							type : 'hidden',
							value : self.linkTable,
							multiple : true,
							fieldset : 3,
							colOrder : 1,
						},{
							type : 'hidden',
							name : 'skey',
							value : selectName,
							multiple : true,
							fieldset : 3,
							colOrder : 2,
						},{
							type : 'select', 
							name : selectName,
							multiple : self.options.multiple, 
							_label : (!!self.options.multiple) ? c + 's' : c,
							_optionsSource : optsSource,
							_labelsSource : lblsSource,
							_firstlabel : (!!self.options.multiple) ? false : '--Choose--',
							_firstoption : (!!self.options.multiple) ? false : '0',
							required : (!!self.options.required) ? 'required' : '__OFF__',
							validType : (!!self.options.required) ? 'select' : '__OFF__',
							fieldset : 3,
							colOrder : 3 
						}
					];
				
				// store the end result
				
			}, // end fn
			
		}
		
		/**  **  **  **  **  **  **  **  **  ** 
 		 *   CALLBACK FN DEFS
 		 **  **  **  **  **  **  **  **  **  **/
		this.callback = {
			
			preinit : function(response) {
				console.log(response);
				
				// set the table schema
				self.options.schema = response;
				
				// initialize
				self.fn._init();
				
				// return to calling object
				self.options.callback( self.colParams );
			}
			
		}
		
		// pre-initialize
		this.fn.preinit();
	
	}; // end jInput declaration
	
	window.jLinkTable = jLinkTable; // add to global scope

})( window, jQuery, $, _, jInput, jForm, jApp );