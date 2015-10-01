/**
 *  jGrid.class.js - Custom Data Grid JS class
 *
 *  Defines the properties and methods of the
 *  custom grid class. This version asynchronously
 *  keeps the grid updated by receiving JSON data
 *  from the server
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 *  Prereqs: 	jQuery, underscore.js,
 *  					jInput, jForm, $.validator
 *  			  	jApp
 */

;(function(window, jQuery, $, jInput, jForm, jApp) {

	'use strict';

	/**
	 * jGrid instance constructor
	 * @method function
	 * @param  {object} options
	 * @return /jGrid         	jGrid instance
	 */
	var jGrid = function(options) {

		var self = this,
				tbl;

		/**
		 * Alias handle to the grid
		 * @method function
		 * @return {[type]} [description]
		 */
		this.$ = function() {
			return self.DOM.$grid;
		}

		/**
		 * Declare Options vars
		 * @type {Object}
		 */
 		this.options = {
 			formDefs : {},
 			bind : {},
			events : {},
 			fn : {},
 			toggles : {},
 			bsmsDefaults : {},
 			gridHeader : {},
 			tableBtns : {},
 			rowBtns : {},
 			withSelectedBtns : {},
 		}; // end options

		/**
		 * HTML Templates
		 * @type {Object}
		 */
		this.html = {}

		/**
		 * Container for events once they have been delegated to avoid collisions
		 * @type {Array}
		 */
		this.delegatedEvents = [];

		/**
		 * Class Methods
		 * @type {Object}
		 */
		this.fn = {

			/**
			 * init the instance
			 * @method function
			 * @return {[type]} [description]
			 */
			_init : function() {

				self.utility.setOptions( $.extend(true, {}, self.utility.getDefaultOptions(), options) );
				self.utility.setupHtmlTemplates();
				self.utility.setInitParams();
				self.utility.setAjaxDefaults();
				self.fn.initializeTemplate();
				self.fn.getGridData();
				self.fn.setupIntervals();
				self.fn.buildMenus();
				self.fn.buildForms();
				self.fn.bind();
				self.fn.linkTables();

				// toggle the mine button if needed
				if ( self.utility.isToggleMine() ) {
					self.fn.toggleMine();
				}

				self.utility.getCheckedOutRecords();
				self.utility.initScrollbar();
			}, // end fn

			/**
			 * Initialize the grid template
			 * @method function
			 * @return {[type]} [description]
			 */
			initializeTemplate : function() {
				self.utility.DOM.emptyPageWrapper();
				self.utility.DOM.initGrid();
			},

			/**
			 * Setup grid intervals
			 * @method function
			 * @return {[type]} [description]
			 */
			setupIntervals : function() {
				if (!self.utility.isAutoUpdate()) { return false; }
				self.utility.setCountdownInterval();
				self.utility.setGetCheckedOutRecordsInterval();
			},

			/**
			 * Build all grid menus
			 * @method function
			 * @return {[type]} [description]
			 */
			buildMenus : function() {
				self.utility.DOM.clearMenus();

				self.utility.setupVisibleColumnsMenu();
				self.utility.DOM.buildBtnMenu( self.options.tableBtns, self.DOM.$tblMenu );
				self.utility.DOM.buildBtnMenu( self.options.rowBtns, self.DOM.$rowMenu);
				self.utility.DOM.buildLnkMenu( self.options.withSelectedBtns, self.DOM.$withSelectedMenu );
			}, // end fn


			/**
			 * Build all grid forms
			 * @method function
			 * @return {[type]} [description]
			 */
			buildForms : function() {
				self.utility.loadFormDefinitions();

				_.each( self.options.formDefs, function( o, key ) {
					self.utility.DOM.buildForm( o, key );
				});

			},

			/**  **  **  **  **  **  **  **  **  **
			 *   linkTables
			 *
			 *  iterates through the linktable
			 *  definitions in the options and
			 *  adds the appropriate elements to the
			 *  forms
			 **  **  **  **  **  **  **  **  **  **/
			linkTables : function() {
				var oLT;
				_.each( self.options.linkTables, function(o,key) {
					o.callback = self.callback.linkTables;
					console.log(o);
					oLT = new jLinkTable( o );
				});
			}, // end fn

			/**
			 * Sets up the countdown that displays
			 *  the time remaining until the next
			 *  refresh
			 * @return {[type]} [description]
			 */
			countdown : function( ) {
				if ( !self.utility.isAutoUpdate() ) {
					return false;
				}

				self.utility.clearCountdownInterval();
				self.utility.initCountdown();
				self.utility.setCountdownInterval();
			}, // end fn

			/**
			 * Update all the grids currently on the page
			 * @return {[type]} [description]
			 */
			updateAll : function() {
				self.fn.getGridData();
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
					self.utility.DOM.togglePreloader();
					self.fn.setupIntervals();
				}

				// start the countdown timer
				self.fn.countdown();

				// kill the pending request if it's still going
				self.utility.killPendingRequest('gridData');

				// use cached copy, if available
				if ( self.utility.isDataCacheAvailable() ) {
					setTimeout( self.utility.updateGridFromCache(), 100);
				} else {
					self.utility.executeGridDataRequest();
				}
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   oCurrentForm
			 *
			 *  returns the currently active form
			 *  or false if the current action is
			 *  a non-standard action.
			 *
			 *  @return jForm (obj) || false
			 *
			 **  **  **  **  **  **  **  **  **  **/
			oCurrentForm : function() {
				var key;

				if (!! (key = _.findKey( self.forms, function(o, key) {
					if (key.indexOf('o') !== 0) return false;
					return key.toLowerCase().indexOf( self.action.toString().toLowerCase() ) !== -1;
				}) )) {
					return self.forms[key];
				} else {
					console.warn( 'There is no valid form associated with the current action' );
					return false;
				}
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   $currentForm
			 *
			 *  returns the currently active form
			 *  jQuery handle or false if the current
			 *  action is a non-standard action.
			 *
			 *  @return jQuery (obj) || false
			 *
			 **  **  **  **  **  **  **  **  **  **/
			$currentForm : function() {
				try {
					return self.fn.oCurrentForm().$()
				} catch(e) {
					console.warn('No current form object found');
					return false
				}
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   $currentFormWrapper
			 *
			 *  returns the currently active form
			 *  wrapper jQuery handle or false
			 *  if the current action is a non-
			 *  standard action.
			 *
			 *  @return jQuery (obj) || false
			 *
			 **  **  **  **  **  **  **  **  **  **/
			$currentFormWrapper : function() {
				try {
					return self.fn.$currentForm().closest('.div-form-panel-wrapper');
				} catch(e) {
					console.warn('No current form wrapper found');
					return false;
				}
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   bind
			 *
			 *  binds event handlers to the various
			 *  DOM elements.
			 **  **  **  **  **  **  **  **  **  **/
			bind : function() {
				self.utility.setupBootpag();
				self.utility.setupHeaderFilters();
				self.utility.setupSortButtons();
				self.utility.turnOffOverlays();
				self.utility.loadBindings();
				self.utility.processGridBindings();
				self.utility.processFormBindings();
			}, // end bind fn

			/**  **  **  **  **  **  **  **  **  **
			 *   setupFormContainer
			 *
			 *  When a rowMenu button is clicked,
			 *  this function sets up the
			 *  corresponding div
			 **  **  **  **  **  **  **  **  **  **/
			setupFormContainer : function() {
				self.utility.DOM.overlay(2,'on');
				self.hideOverlayOnError = false;
				self.utility.resetCurrentForm();
				self.utility.maximizeCurrentForm();
				self.utility.setCurrentFormFocus();
				self.utility.formBootup();
				self.utility.getCurrentFormRowData();
			}, // end fn


			/**  **  **  **  **  **  **  **  **  **
			 *   WITH SELECTED MENU OPTIONS
			 **  **  **  **  **  **  **  **  **  **/

			/**  **  **  **  **  **  **  **  **  **
			 *   withSelected
			 *  @action - The action to perform
			 *
			 *  When one or more rows are checked,
			 *  this defines the various options
			 *  that are available and the actions
			 *  that are performed.
			 **  **  **  **  **  **  **  **  **  **/
			withSelected : function(action, callback) {
				var $cid = [];

				if ( tbl.find('.chk_cid:checked:not(:visible)').length > 0 ) {
					var numHiddenChecked = tbl.find('.chk_cid:checked:not(:visible)').length;

					bootbox.dialog({
					  message: "There are  " + numHiddenChecked + " items which are checked and are currently not displayed. Include hidden items in the operation?",
					  title: "Hidden Checked Items",
					  buttons: {
						yes: {
						  label: "Include Hidden Items",
						  className: "btn-primary",
						  callback: function() {
							$cid = tbl.find('.chk_cid:checked').map( function(i,elm) {
								return $(elm).closest('.table-row').attr('data-identifier');
							}).get();
							self.fn.withSelectedAction(action,callback, $cid);
						  }
						},
						no: {
						  label: "Do Not Include Hidden Items",
						  className: "btn-danger",
						  callback: function() {
							$cid = tbl.find('.chk_cid:checked:visible').map( function(i,elm) {
								return $(elm).closest('.table-row').attr('data-identifier');
							}).get();
							self.fn.withSelectedAction(action,callback, $cid);
						  }
						},
					  }
					});
				} else {
					$cid = tbl.find('.chk_cid:checked').map( function(i,elm) {
						return $(elm).closest('.table-row').attr('data-identifier');
					}).get();
					self.fn.withSelectedAction(action,callback, $cid);
				}


			}, // end fn

			/**
			 * With selected actions
			 * @param  {[type]}   action   [description]
			 * @param  {Function} callback [description]
			 * @param  {[type]}   $cid     [description]
			 * @return {[type]}            [description]
			 */
			withSelectedAction : function(action, callback, $cid) {

				if ($cid.length > 0) {
					switch(action) {

						// DELETE SELECTED
						case 'delete' :
							self.action = 'withSelectedDelete';
							bootbox.confirm("Are you sure you want to delete " + $cid.length + " items?", function(response) {
								if (!!response) {
									var requestOptions = {
										url : self.utility.getCurrentFormAction(),
										success : self.callback.submitCurrentForm,
										data : {
											'_method' : 'delete',
											'users' : $cid
										}
									}

									self.utility.postJSON( requestOptions );
								}


							});
						break;

						case 'custom' :
							if (typeof callback === 'function') {
								return callback( $cid );
							} else {
								console.warn( 'callback is not a valid function');
							}
						break;

						default :
							console.warn( action + ' is not a valid withSelected action');
						break;
					}
				} else {
					self.msg.warning('Nothing selected.')
				}
			}, //end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   REPORTS
			 **  **  **  **  **  **  **  **  **  **/
			exportView : function() {
				var $url = window.location.href.replace(window.location.hash,'').replace('#','').split('/');
				$url.pop();
				$url = $url.join('/');
				window.open($url + '/export.php?report=currentView');
			},

		}; // end fn defs

		// add any functions to this.fn
		this.fn = $.extend(true,  this.fn, options.fn );

		/**  **  **  **  **  **  **  **  **  **
		 *   CALLBACK
		 *
		 *  Defines the callback functions
		 *  used by the various AJAX calls
		 **  **  **  **  **  **  **  **  **  **/
		this.callback = {

			/**
			 * Process the result of the form submission
			 * @method function
			 * @param  {[type]} response [description]
			 * @return {[type]}          [description]
			 */
			submitCurrentForm : function(response) {
				if ( self.utility.isResponseErrors(response) ) {
					self.msg.error( self.utility.getErrorMessage(response) )
				} else {
					self.msg.success( 'Operation Completed Successfully!');
					if (self.options.closeOnSave) {
						self.utility.closeCurrentForm();
					}
					self.fn.getGridData();
					self.utility.DOM.resetRowMenu();
				}
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   update
			 *
			 *  @response (obj) The JSON object
			 *  returned by the ajax request
			 *
			 *  processes the result of the AJAX
			 *  request
			 **  **  **  **  **  **  **  **  **  **/
			update : function(response) {

				// init vars
				var	appendTH = false,
					theaders,
					tfilters,
					btn,
					isActive;

				// detect changes in data;
				self.oDelta = ( !$.isEmptyObject(self.oJSON) ) ?
					self.utility.deltaData(self.oJSON,response) :
					response;

				// merge the changes into self.oJSON
				if (!!self.oDelta) {
					self.oJSON = response;
				} else { // abort if no changes in the data
					return false;
				}

				// remove all rows, if needed
				if (self.options.removeAllRows) {
					self.utility.DOM.removeRows(true);
				}

				// show the preloader, then update the contents
				self.utility.DOM.togglePreloader();

				// find the header row
				theaders = tbl.find('.table-head .table-row.colHeaders');

				// create the header row if needed
				if (!theaders.length) {
					tfilters = tbl.find('.table-row.tfilters');
					theaders = $('<div/>', {'class' : 'table-row colHeaders'});
					appendTH = true;

					// Append the check all checkbox
					if (self.utility.isEditable()) {
						theaders.append( $('<div/>', {'class' : 'table-header table-header-text'}).html( self.utility.render( self.html.tmpCheckAll ) ));
					}

					// create header for this column if needed
					$.each( self.options.headers, function(i,v) {
						// determine if the current column is the active sortBy column
						isActive = (self.options.columns[i] === self.options.sortBy) ? true : false;

						// render the button
						btn = self.utility.render( self.html.tmpSortBtn, {
							'ColumnName' : self.options.columns[i],
							'BtnClass' : (isActive) ? 'btn-primary' : '',
							'faClass' : (isActive) ? 'amount-desc' : 'amount-asc',
							'BtnTitle' : (isActive) ? 'Sort Descending' : 'Sort Ascending'
							} );

						// append the header
						theaders.append( $('<div/>', { 'class' : 'table-header table-header-text' }).html( btn + v ) );

						if ( i > 0 ) { // skip the id column
							tfilters.append( $('<div/>', { 'class' : 'table-header', 'style' : 'position:relative'}).append( $('<input/>',
							//tfilters.append( $('<div/>', { 'class' : 'table-header'}).append( $('<input/>',
								{
									'rel' : self.options.columns[i],
									'id'  :	'filter_' + self.options.columns[i],
									'name' : 'filter_' + self.options.columns[i],
									'class' : 'header-filter form-control',
									'style' : 'width:100%'
								}
							)));
						}
					});

					tbl.find('.table-head').append(theaders);
					tbl.find('.paging').parent().attr('colspan',self.options.headers.length-2);
					tbl.find('.with-selected-menu').append( self.DOM.$withSelectedMenu.find('li') );
				}

				// update the DOM
				self.utility.DOM.updateGrid();

				// remove the rows that may have been removed from the data
				self.utility.DOM.removeRows();
				self.fn.buildMenus();
				self.utility.DOM.togglePreloader(true);
				self.options.removeAllRows = false;

				if (!self.loaded) {
					// custom init fn
					if ( self.fn.customInit && typeof self.fn.customInit === 'function' ) {
						self.fn.customInit();
					}
					self.loaded = true;
				}

				// adjust column widths
				self.utility.DOM.updateColWidths();

			}, // end fn

			updateDOMFromRowData : function(response) {
					var data = response;
					self.rowData = response;
					self.utility.DOM.updatePanelHeader( data[ self.options.columnFriendly ] );
			}, // end fn

			checkout : function(response) {
				var type = (response.indexOf('Successful') !== -1) ? 'success' : 'warning';

				if (type === 'success') {
					// modal overlay
					self.utility.DOM.overlay(2,'on');

					var $target = (self.action === 'edit') ?
									tbl.find('#div_editFrm') :
									tbl.find('#div_deleteFrm');

					self.fn.setupFormContainer($target);
				} else {
					nfx_thumbslide('./images/' + type + '.png',response,type);
				}


			}, //end fn

			checkin : function() {
				self.utility.closeCurrentForm();
			}, //end fn

			getCheckedOutRecords : function(response) {
				var $tr,  $i = $('<i/>', { class : 'fa fa-lock fa-fw checkedOut'});

				tbl.find('.chk_cid').parent().removeClass('disabled').show();
				tbl.find('.rowMenu-container').removeClass('disabled');
				tbl.find('.checkedOut').remove();
				tbl.find('.btn-showMenu').removeClass('disabled')
							.attr('title','')
							.tooltip({delay:300})
							.find('i')
								.addClass('fa-angle-right')
								//.removeClass('fa-lock')

				_.each(response, function(o,key) {
					if (!!o && !!o.PkeyID) {
						$tr = $('.table-row[data-identifier="' + o.PkeyID + '"]');
						$tr.find('.chk_cid').parent().addClass('disabled').hide()
							.closest('.table-cell').append( $('<span/>',{class : 'btn btn-default btn-danger pull-right checkedOut'}).html($i.prop('outerHTML')).clone().attr('title','Locked By ' + o.FullName).tooltip({delay:300}));
						$tr.find('.rowMenu-container').addClass('disabled').find('.rowMenu.expand').removeClass('expand');
						$tr.find('.btn-showMenu').addClass('disabled')
							.find('i')
								.removeClass('fa-angle-right')
								//.addClass('fa-lock')
					}
				});

			}, //end fn

			/**
			 * Process the grid link tables
			 * @method function
			 * @param  {[type]} colParams [description]
			 * @return {[type]}           [description]
			 */
			linkTables : function( colParams ) {

				// add the colParams to the linkTable store
				self.linkTables = _.union( self.linkTables, colParams );

				console.log(colParams);

				// count the number of completed requests
				if ( !self.linkTableRequestsComplete ) {
					self.linkTableRequestsComplete = 1;
				} else {
					self.linkTableRequestsComplete++;
				}

				// once all linkTable requests are complete, apply the updates to the forms
				if (self.linkTableRequestsComplete == self.options.linkTables.length) {
					console.log('all linktables in, process the result');
					// update the edit form
					self.forms.oEditFrm.options.colParamsAdd = self.linkTables;
					self.forms.oEditFrm.fn.processColParams();
					self.forms.oEditFrm.fn.processBtns();

					// update the new form
					self.forms.oNewFrm.options.colParamsAdd = self.linkTables;
					self.forms.oNewFrm.fn.processColParams();
					self.forms.oNewFrm.fn.processBtns();
				}

			}, //end fn

		} // end callback defs

		/**
		 * Utility Functions
		 * @type {Object}
		 */
		this.utility = {

			/**
			 * Get the default grid options
			 * @method function
			 * @return {[type]} [description]
			 */
			getDefaultOptions : function() {
				/**
				 * Default Options
				 * @type {Object}
				 */
				return {

					/**
					 * Form Definitions
					 */
					formDefs : {},

					/**
					 * Event Bindings
					 * @type {Object}
					 */
					bind : {},

					/**
					 * Function definitions
					 * @type {Object}
					 */
					fn : {},

					/**
					 * Toggles - true/false switches
					 * @type {Object}
					 */
					toggles : {

						/**
						 * Data is editable
						 * @type {Boolean} default true
						 */
						editable : true,

						/**
						 * Show the 'new' button
						 * @type {Boolean} default true
						 */
						new : true,

						/**
						 * Show the 'edit' button
						 * @type {Boolean} default true
						 */
						edit : true,

						/**
						 * Show the 'delete' buton
						 * @type {Boolean} default true
						 */
						del : true,

						/**
						 * Show the sort buttons above each header
						 * @type {Boolean} default true
						 */
						sort : true,

						/**
						 * Autoupdate the grid data automatically
						 * @type {Boolean} default true
						 */
						autoUpdate : true,

						/**
						 * Auto-paginate the grid data
						 * @type {Boolean} default true
						 */
						paginate : true,

						/**
						 * Show the filter text boxes above each header
						 * @type {Boolean} default true
						 */
						headerFilters : true,

						/**
						 * Collapse the row menu
						 * @type {Boolean} default true
						 */
						collapseMenu : true,

						/**
						 * Cache the grid data for faster load times
						 * @type {Boolean} default false
						 */
						caching : false,

						/**
						 * Show the ellipsis ... and readmore buttons
						 * @type {Boolean} default true
						 */
						ellipses : true,

						/**
						 * Checkout records before editing
						 * @type {Boolean} default true
						 */
						checkout : false,

						/**
						 * Close form window after saving
						 * @type {Boolean} default true
						 */
						closeOnSave : true,

						/**
						 * remove all rows when updating data
						 * @type {Boolean}
						 */
						removeAllRows : false,
					},

					/**
					 * General Grid Options
					 */

					/**
					 * If options.toggles.autoUpdate, interval to autorefresh data in ms
					 * @type {Number} default 602000
					 */
					refreshInterval : 602000,

					/**
					 * jQuery DOM target
					 * @type {String} default '.table-responsive'
					 */
					target : '.table-responsive',						// htmlTable target

					/**
					 * Data request options
					 */

					/**
					 * URL of JSON resource (grid data)
					 * @type {String}
					 */
					url	: options.table + '/json', 	// url of JSON resource

					/**
					 * Database table name of grid data
					 * @type {String}
					 */
					table : '',											// db table (for updates / inserts)

					/**
					 * Primary key of table
					 * @type {String}
					 */
					pkey : 'id',

					/**
					 * Where clause of data query
					 * @type {String}
					 */
					filter : '',										// where clause for query

					/**
					 * db columns to show
					 * @type {Array}
					 */
					columns : [ ],										// columns to query

					/**
					 * Friendly headers for db columns
					 * @type {Array}
					 */
					headers : [ ],										// headers for table

					/**
					 * Data Presentation options
					 */


					/**
					 * Pagination - Rows per page
					 * @type {Number} default 10
					 */
					rowsPerPage : 10,

					/**
					 * Pagination - Starting page number
					 * @type {Number} default 1
					 */
		 			pageNum	: 1,

					/**
					 * The friendly name of the table e.g. Users
					 * @type {String}
					 */
					tableFriendly : '',									// friendly name of table

					/**
					 * The column containing the friendly name of each row e.g. username
					 * @type {String}
					 */
					columnFriendly : '',								// column containing friendly name of each row

					/**
					 * The text shown when deleting a record
					 * @type {String}
					 */
					deleteText : 'Deleting',

					/**
					 * html attributes to apply to individual columns
					 * @type {Array}
					 */
					cellAtts : [ ],										// column attributes

					/**
					 * html templates
					 * @type {Array}
					 */
					templates : [ ],									// html templates

					/**
					 * Max cell length in characters, if toggles.ellipses
					 * @type {Number} default 38
					 */
					maxCellLength : 38,

					/**
					 * Max column length in pixels
					 * @type {Number} default 450
					 */
					maxColWidth: 450,

					/**
					 * Bootstrap Multiselect Default Options
					 * @type {Object}
					 */
					bsmsDefaults : {
						buttonContainer : '<div class="btn-group" />',
						enableFiltering: true,
						includeSelectAllOption: true,
						maxHeight: 185
					},

					/**
					 * Header Options
					 * @type {Object}
					 */
					gridHeader : {
						icon : 'fa-dashboard',
						headerTitle : 'Manage',
						helpText : false,
					},

					/**
					 * Disabled Form Elements - e.g. password
					 * @type {Array}
					 */
					disabledFrmElements : [],

					/**
					 * Table buttons appear in the table menu below the header
					 * @type {Object}
					 */
					tableBtns : {

						/**
						 * Refresh Button
						 * @type {Object}
						 */
						refresh : {
							type : 'button',
							name : 'btn_refresh_grid',
							class : 'btn btn-success btn-refresh',
							icon : 'fa-refresh',
							label : '&nbsp;'
						},

						/**
						 * New Button
						 * @type {Object}
						 */
						new : {
							type : 'button',
							class : 'btn btn-success btn-new',
							id : 'btn_edit',
							icon : 'fa-plus-circle',
							label : 'New',
						},

						/**
						 * Define custom buttons here. Custom buttons may also be defined at runtime.
						 * @type {Object}
						 */
						custom : {
							visColumns : [
								{ icon : 'fa-bars fa-rotate-90', label : ' Visible Columns' },
							],
						}
					},


					/**
					 * Row buttons appear in each row of the grid
					 * @type {Object}
					 */
					rowBtns : {

						/**
						 * Edit Button
						 * @type {Object}
						 */
						edit : {
							type : 'button',
							class : 'btn btn-primary btn-edit',
							id : 'btn_edit',
							icon : 'fa-pencil',
							label : '',
							title : 'Edit Record ...',
						},

						/**
						 * Delete Button
						 * @type {Object}
						 */
						del : {
							type : 'button',
							class : 'btn btn-danger btn-delete',
							id : 'btn_delete',
							icon : 'fa-trash-o',
							label : '',
							title : 'Delete Record ...'
						},

						/**
						 * Define custom buttons here. Custom buttons may also be defined at runtime.
						 * @type {Object}
						 */
						custom : {
							//custom : { type : 'button' } // etc.
						}
					},

					/**
					 * With Selected Buttons appear in the dropdown menu of the header
					 * @type {Object}
					 */
					withSelectedBtns : {

						/**
						 * Delete Selected ...
						 * @type {Object}
						 */
						del : {
							type : 'button',
							class : 'li-red',
							id : 'btn_delete',
							icon : 'fa-trash-o',
							label : 'Delete Selected ...',
							fn : function() { self.fn.withSelected('delete'); },
						},

						/**
						 * Define custom buttons here. Custom buttons may also be defined at runtime.
						 * @type {Object}
						 */
						custom : {
							//custom : { type : 'button' } // etc.
						}
					},

					/**
					 * linktables define the relationships between tables
					 * @type {Array}
					 */
					linkTables : [ ],

				}; // end defaults

			}, // end fn

			/**
			 * Set AJAX Defaults
			 * @method function
			 * @return {[type]} [description]
			 */
			setAjaxDefaults : function() {
				$.ajaxSetup({
	        headers: {
	            'X-XSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	        }
				});
			}, // end fn

			/**
			 * Get the action of the current form
			 * @method function
			 * @return {[type]} [description]
			 */
			getCurrentFormAction : function() {
				switch (self.action) {
					case 'edit' :
					case 'delete' :
						return self.options.table + '/' + self.utility.getCurrentRowId();
					break;

					default :
						return self.options.table;
					break;
				}
			}, // end fn

			/**
			 * [function description]
			 * @method function
			 * @param  {[type]} action [description]
			 * @return {[type]}        [description]
			 */
			actionHelper : function(action) {
				self.action = action;
				if ( self.utility.needsCheckout() ) {
					self.utility.checkout( self.utility.getCurrentRowId() );
				} else {
					self.fn.setupFormContainer( )
				}
			}, // end fn

			/**
			 * Clear the current form
			 * @method function
			 * @return {[type]} [description]
			 */
			resetCurrentForm : function() {
				try {
					self.fn.$currentForm().clearForm();
					self.fn.$currentForm().find(':input:not("[type=button]"):not("[type=submit]"):not("[type=reset]"):not("[type=radio]"):not("[type=checkbox]")')
					.each( function(i,elm) {
						if ( !!$(elm).attr('data-static') ) { return false; }

						//$(elm).data("DateTimePicker").remove();
						$(elm).val('');
						if ( $(elm).hasClass('bsms') ) {
							$(elm).multiselect(self.options.bsmsDefaults).multiselect('refresh');
						}
					});
				} catch(e) {
					console.warn(e);
					return false;
				}
			}, // end fn

			/**
			 * Refresh and rebuild the current form
			 * @method function
			 * @return {[type]} [description]
			 */
			refreshCurrentForm : function() {
				self.store.flush();
				self.fn.oCurrentForm().fn.getColParams();
				self.fn.getGridDataColParamForm();
			}, // end fn

			/**
			 * Maximize the current form
			 * @method function
			 * @return {[type]} [description]
			 */
			maximizeCurrentForm : function() {
				try {
					self.fn.$currentFormWrapper().addClass('max');
				} catch(e) {
					console.warn(e);
					return false;
				}
			}, // end fn

			/**
			 * Close the current form
			 * @method function
			 * @return {[type]} [description]
			 */
			closeCurrentForm : function() {
				try {
					self.msg.clear()
					self.fn.$currentFormWrapper().removeClass('max')
						.find('.formContainer').css('height','');
					self.fn.$currentForm().clearForm();
					self.utility.turnOffOverlays();
				} catch(ignore) {}
			}, // end fn

			/**
			 * Set focus on the current form
			 * @method function
			 * @return {[type]} [description]
			 */
			setCurrentFormFocus : function() {
				self.fn.$currentFormWrapper().find(":input:not([type='hidden']):not([type='button'])").eq(0).focus();
			}, // end fn

			/**
			 * Get the current form row data for the current row
			 * @method function
			 * @return {[type]} [description]
			 */
			getCurrentFormRowData : function() {
				if (self.action === 'new') return false;
				var url = self.utility.getCurrentRowDataUrl();

				self.fn.oCurrentForm().fn.getRowData(url, self.callback.updateDOMFromRowData);
			}, //end fn

			/**
			 * Get the data url of the current row
			 * @method function
			 * @return {[type]} [description]
			 */
			getCurrentRowDataUrl : function() {
				return self.options.table + '/' + self.utility.getCurrentRowId() + '/json';
			}, //end fn

			/**
			 * Submit the current form
			 * @method function
			 * @return {[type]} [description]
			 */
			submitCurrentForm : function() {
				var requestOptions = {
					url : self.utility.getCurrentFormAction(),
					data : self.fn.$currentForm().serialize(),
					success : self.callback.submitCurrentForm,
					fail : console.warn
				};

				self.msg.clear();

				if (!!self.fn.$currentForm()) {
					var oValidate = new validator( self.fn.$currentForm() );
					if (oValidate.errorState) {
						return false;
					}
				}

				self.utility.postJSON( requestOptions );

			}, // end fn

			/**
			 * Save the current form and leave open
			 * @method function
			 * @return {[type]} [description]
			 */
			saveCurrentForm : function() {
				self.options.closeOnSave = false;
				self.utility.submitCurrentForm();
				$(this).addClass('disabled').delay(2000).removeClass('disabled');
			}, // end fn

			/**
			 * Save the current form and close
			 * @method function
			 * @return {[type]} [description]
			 */
			saveCurrentFormAndClose : function() {
				self.options.closeOnSave = true;
				self.utility.submitCurrentForm();
				$(this).addClass('disabled').delay(2000).removeClass('disabled');
				//self.utility.toggleRowMenu;
			}, // end fn

			/**
			 * Kill pending ajax request
			 * @method function
			 * @param  {[type]} requestName [description]
			 * @return {[type]}             [description]
			 */
			killPendingRequest : function(requestName) {
				try{
					self.dataGrid.requests[requestName].abort();
				} catch(e) {
					// nothing to abort
				}
			}, //end fn

			/**
			 * Set instance options
			 * @method function
			 * @param  {[type]} options [description]
			 * @return {[type]}         [description]
			 */
			setOptions : function(options) {
				self.options = $.extend(true, self.options,options);
				return self;
			}, //end fn

			/**
			 * Set up the visible columns menu for the table menu
			 * @method function
			 * @return {[type]} [description]
			 */
			setupVisibleColumnsMenu : function() {
				if ( typeof self.temp.visibleColumnsMenuSetup === 'undefined' || self.temp.visibleColumnsMenuSetup === false) {
					// visible columns
					_.each( self.options.columns, function( o, i ) {
						if (i < self.options.headers.length ) {
							self.options.tableBtns.custom.visColumns.push(
								{
									icon : 'fa-check-square-o',
									label : self.options.headers[i],
									fn : function() { self.utility.DOM.toggleColumnVisibility( $(this) ) }, 'data-column' : o
								}
							);
						}
					});

					self.temp.visibleColumnsMenuSetup = true;
				} else {
					return false;
				}
			}, //end fn

			/**
			 * Does the form need confirmation
			 * @method function
			 * @return {[type]} [description]
			 */
			isConfirmed : function() {
				var conf = self.fn.$currentFormWrapper().find('#confirmation');
				if ( !!conf.length && conf.val().toString().toLowerCase() !== 'yes') {
					self.msg.warning('Type yes to continue');
					return false;
				}
				return true;
			}, //end fn

			/**
			 * Initialize scrollbar
			 * @method function
			 * @return {[type]} [description]
			 */
			initScrollbar : function() {
				$('.table-grid').perfectScrollbar();
			}, //end fn

			/**
			 * Is autoupdate enabled
			 * @method function
			 * @return {[type]} [description]
			 */
			isAutoUpdate : function() {
				return !!self.options.toggles.autoUpdate;
			}, //end fn

			/**
			 * Is data caching enabled
			 * @method function
			 * @return {[type]} [description]
			 */
			isCaching : function() {
				return !!self.options.toggles.caching;
			}, // end fn

			/**
			 * Is record checkout enabled
			 * @method function
			 * @return {[type]} [description]
			 */
			isCheckout : function() {
				return !!self.options.toggles.checkout;
			}, // end fn

			/**
			 * Is the grid data editable
			 * @method function
			 * @return {[type]} [description]
			 */
			isEditable : function() {
				return !!self.options.toggles.editable;
			}, //end fn

			/**
			 * Are ellipses enabled
			 * @method function
			 * @return {[type]} [description]
			 */
			isEllipses : function() {
				return !!self.options.toggles.ellipses;
			}, // end fn

			/**
			 * Is a form container maximized
			 * @method function
			 * @return {[type]} [description]
			 */
			isFormOpen : function() {
				return !!self.$().find('.div-form-panel-wrapper.max').length;
			}, // end fn

			/**
			 * Is pagination enabled
			 * @method function
			 * @return {[type]} [description]
			 */
			isPagination : function() {
				return !!self.options.toggles.paginate;
			}, // end fn

			/**
			 * Is sorting by column enabled
			 * @method function
			 * @return {[type]} [description]
			 */
			isSort : function() {
				return !!self.options.toggles.sort;
			}, // end fn

			/**
			 * Is toggle mine enabled
			 * @method function
			 * @return {[type]} [description]
			 */
			isToggleMine : function() {
				return window.location.href.indexOf('/my') !== -1;
			}, // end fn

			/**
			 * Is header filters enabled
			 * @method function
			 * @return {[type]} [description]
			 */
			isHeaderFilters : function() {
				return !!self.options.toggles.headerFilters;
			}, // end fn

			/**
			 * Is the button with name 'key' enabled
			 * @method function
			 * @param  {[type]} key [description]
			 * @return {[type]}     [description]
			 */
			isButtonEnabled : function(key) {
				return typeof self.options.toggles[key] === 'undefined' || !!self.options.toggles[key]
			}, //end fn

			/**
			 * Is data cache available
			 * @method function
			 * @return {[type]} [description]
			 */
			isDataCacheAvailable : function() {
				return (self.utility.isCaching() && !!self.store.get('data_' + self.options.table,false) );
			}, // end fn

			/**
			 * Are there errors in the response
			 * @method function
			 * @return {[type]} [description]
			 */
			isResponseErrors : function(response) {
				 return (typeof response.errors !== 'undefined' &&
				 								!!response.errors);
			}, // end fn

			/**
			 * Get error message from response
			 * @method function
			 * @param  {[type]} response [description]
			 * @return {[type]}          [description]
			 */
			getErrorMessage : function(response) {
				return (typeof response.message !== 'undefined') ?
					response.message :
					'There was a problem completing your request.'
			}, //end fn

			/**
			 * The row needs to be checked out
			 * @method function
			 * @return {[type]} [description]
			 */
			needsCheckout : function() {
				return ( self.utility.isCheckout() && ( self.action === 'edit' || self.action === 'delete' ) );
			}, //end fn

			/**
			 * The row needs to be checked in
			 * @method function
			 * @return {[type]} [description]
			 */
			needsCheckin : function() {
				return self.utility.needsCheckout();
			}, //end fn

			/**
			 * Get current row id
			 * @method function
			 * @return {[type]} [description]
			 */
			getCurrentRowId : function() {
				return +self.DOM.$rowMenu.closest('.table-row').attr('data-identifier') || -1;
			}, //end fn

			/**
			 * Display unload warning if a form is open
			 * @method function
			 * @return {[type]} [description]
			 */
			unloadWarning : function() {
				if (self.utility.isFormOpen()) {
					return 'You have unsaved changes.';
				}
			}, // end fn

			/**
			 * Update the total pages of the grid
			 * @method function
			 * @return {[type]} [description]
			 */
			updateTotalPages : function() {
				self.dataGrid.pagination.totalPages = Math.ceil( self.oJSON.length / self.dataGrid.pagination.rowsPerPage );
			}, // end fn

			/**
			 * Update pagination of the grid
			 * @method function
			 * @return {[type]} [description]
			 */
			updatePagination : function() {
				//pagination
				if ( self.utility.isPagination() ) {
					self.utility.updateTotalPages();
					self.utility.setupBootpag();
					self.utility.setupRowsPerPage();
				} else {
					self.utility.hideBootpag();
				}
			}, // end fn

			/**
			 * Setup bootpag pagination controls
			 * @method function
			 * @return {[type]} [description]
			 */
			setupBootpag : function() {
				tbl.find('.paging').empty().show().bootpag({
					total : self.dataGrid.pagination.totalPages,
					page : self.options.pageNum,
					maxVisible : 20
				}).on("page", function(event,num) {
					self.utility.DOM.page(num);
				});
			}, // end fn

			/**
			 * setup/update rows per page controls
			 * @method function
			 * @return {[type]} [description]
			 */
			setupRowsPerPage : function() {
				tbl.find('[name=RowsPerPage]').off('change.rpp').on('change.rpp', function() {
					tbl.find('[name=RowsPerPage]').val( $(this).val() );
					self.utility.DOM.rowsPerPage( $(this).val() );
				}).parent().show();
			}, // end fn

			/**
			 * Hide bootpag pagination controls
			 * @method function
			 * @return {[type]} [description]
			 */
			hideBootpag : function() {
				tbl.find('.paging').hide();
				tbl.find('[name=RowsPerPage]').parent().hide();
			}, // end fn

			/**
			 * Setup header filters
			 * @method function
			 * @return {[type]} [description]
			 */
			setupHeaderFilters : function() {
				if (self.utility.isHeaderFilters() ) {
					self.utility.showHeaderFilters();
					self.utility.DOM.headerFilterDeleteIcons();
				} else {
					self.utility.hideHeaderFilters();
				}
			}, // end fn

			/**
			 * Setup the table sort buttons
			 * @method function
			 * @return {[type]} [description]
			 */
			setupSortButtons : function() {
				if ( self.utility.isSort() ) {
					self.$().find('.tbl-sort').show();
				} else {
					self.$().find('.tbl-sort').hide();
				}
			}, // end fn

			/**
			 * Toggle Delete Icon Visibility
			 * @method function
			 * @param  {[type]} $elm [description]
			 * @return {[type]}      [description]
			 */
			toggleDeleteIcon : function( $elm ) {
				if ( !!$elm.val().toString().trim() ) {
					$elm.next('.deleteicon').show();
				} else {
					$elm.next('.deleteicon').hide();
				}
			}, //end fn

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
					clearTimeout( self.dataGrid.timeouts[o.key] )
				} catch(ignore) {}

				self.dataGrid.timeouts[o.key] = setTimeout(o.fn, o.delay );
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
					clearInterval( self.dataGrid.intervals[o.key] )
				} catch(ignore) {}

				self.dataGrid.intervals[o.key] = setInterval(o.fn, o.delay );
			}, //end fn

			/**
			 * Hide header filters
			 * @method function
			 * @return {[type]} [description]
			 */
			hideHeaderFilters : function() {
				self.$().find('.table-head .tfilters').hide();
			}, // end fn

			/**
			 * Show header filters
			 * @method function
			 * @return {[type]} [description]
			 */
			showHeaderFilters : function() {
				self.$().find('.table-head .tfilters').show();
			}, // end fn



			/**
			 * Update Grid from cached data
			 * @method function
			 * @return {[type]} [description]
			 */
			updateGridFromCache : function() {
				self.callback.update( self.utility.getCachedGridData() );
				self.utility.DOM.togglePreloader(true);
				self.fn.buildMenus();
			}, // end fn

			/**
			 * Retrieve cached data
			 * @method function
			 * @return {[type]} [description]
			 */
			getCachedGridData : function() {
				return self.store.get('data_' + self.options.table);
			}, // end fn


			/**
			 * get JSON
			 * @method function
			 * @param  {[type]} requestOptions [description]
			 * @return {[type]}                [description]
			 */
			getJSON : function( requestOptions ) {

					var options = $.extend(true,
						{
							url : null,
							data : {},
							success : function() { },
							fail : function() { },
							always : function() {},
							complete : function() {}
						} , requestOptions );

					return $.getJSON(options.url, options.data, options.success )
						.fail( options.fail )
						.always( options.always )
						.complete( options.complete );
			}, // end fn

			/**
			 * post JSON
			 * @method function
			 * @param  {[type]} requestOptions [description]
			 * @return {[type]}                [description]
			 */
			postJSON : function( requestOptions ) {

					var options = $.extend(true,
						{
							url : null,
							data : {},
							success : function() { },
							fail : function() { },
							always : function() {},
							complete : function() {}
						} , requestOptions );

					return $.ajax({
							url: options.url,
							data : options.data,
							success : options.success,
							type : 'POST',
							dataType : 'json'
						})
						.fail( options.fail )
						.always( options.always )
						.complete( options.complete );
			}, // end fn

			/**
			 * Execute the grid data request
			 * @method function
			 * @return {[type]} [description]
			 */
			executeGridDataRequest : function() {
				var params = $.extend(true,  self.dataGrid.requestOptions,
						{
							success : self.callback.update,
							fail 		: self.utility.gridDataRequestCallback.fail,
							always 	: self.utility.gridDataRequestCallback.always,
							complete: self.utility.gridDataRequestCallback.complete
						} ),
						r = self.dataGrid.requests;

				// show the preloader
				self.utility.DOM.activityPreloader('show');

				// execute the request
				r.gridData = self.utility.getJSON( params );
			}, //end fn

			/**
			 * Turn off modal overlays
			 * @method function
			 * @return {[type]} [description]
			 */
			turnOffOverlays : function() {
				self.utility.DOM.overlay(1,'off');
				self.utility.DOM.overlay(2,'off');
			}, //end fn

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
					return self.$().find(target) || $(target) || $(window[target]);
				} else {
					return self.$().find(target, scope) || $(target, scope) || $(window[target], scope);
				}
			}, //end fn

			/**
			 * Process the event bindings for the grid
			 * @method function
			 * @return {[type]} [description]
			 */
			processGridBindings : function() {
				var events, target, fn, event;

				_.each( self.options.events.grid, function( events, target ) {
					_.each( events, function(fn, event) {
							if (typeof fn === 'function') {
								self.utility.setCustomBinding( target, fn, event )
							}
					});
				})
			}, //end fn

			/**
			 * Process the event bindings for the form
			 * @method function
			 * @return {[type]} [description]
			 */
			processFormBindings : function() {
				var events, target, fn, event;

				_.each( self.options.events.form, function( events, target ) {
					_.each( events, function(fn, event) {
							self.utility.setCustomBinding( target, fn, event, '.div-form-panel-wrapper' )
					});
				})
			}, //end fn

			/**
			 * Set up a custom event binding
			 * @method function
			 * @param  {[type]}   event [description]
			 * @param  {Function} fn    [description]
			 * @return {[type]}         [description]
			 */
			setCustomBinding : function( target, fn, event, scope ) {
				var eventKey = event + '.custom-' + $.md5( fn.toString() ),
						$scope = (typeof scope === 'undefined') ? $(document) : $(scope),
						scope = (typeof scope === 'undefined') ? 'document' : scope;

				if ( event === 'boot' ) {
					return (typeof fn === 'function') ? fn() : false;
				}

				if ( !!$(window[target]).length ) {
					$(window[target]).off(eventKey).on(eventKey, fn);
				} else if ( !self.utility.isEventDelegated(target,eventKey,scope) ) {
					$scope.delegate(target, eventKey, fn);
					self.utility.eventIsDelegated(target,eventKey,scope);
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
				return _.indexOf(self.delegatedEvents, scope + '-' + target + '-' + eventKey) !== -1;
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
				return self.delegatedEvents.push( scope + '-' + target + '-' + eventKey );
			}, // end fn

			/**
			 * Form boot up function
			 * @method function
			 * @return {[type]} [description]
			 */
			formBootup : function() {
				self.fn.$currentFormWrapper()
					//reset validation stuff
					.find('.has-error').removeClass('has-error').end()
					.find('.has-success').removeClass('has-success').end()
					.find('.help-block').hide().end()
					.find('.form-control-feedback').hide().end()

					//multiselects
					.find('select').addClass('bsms').end()
					.find('.bsms').multiselect(self.options.bsmsDefaults).multiselect('refresh').end()

					.find('[_linkedElmID]').change();
			}, //end fn

			/**
			 * Load event bindings for processing
			 * @method function
			 * @return {[type]} [description]
			 */
			loadBindings : function() {
					// form bindings
					self.options.events.form = $.extend(true, {
						// the bind function will assume the scope is relative to the current form
						// unless the key is found in the global scope
						// boot functions will be automatically called at runtime
						"[data-validType='Phone Number']" : {
							keyup : function() {
								$(this).val( formatPhone( $(this).val() ) );
							}
						},

						"[data-validType='Zip Code']" : {
							keyup : function() {
								$(this).val( formatZip( $(this).val() ) );
							}
						},

						"[data-validType='SSN']" : {
							keyup : function() {
								var self = $(this);
								setTimeout( function() {
									self.val( formatSSN( self.val() ) );
								}, 200);
							}
						},

						"[data-validType='color']" : {
							keyup : function() {
								$(this).css('background-color',$(this).val());
							}
						},

						"[data-validType='Number']" : {
							change : function() {
								$(this).val( formatNumber( $(this).val() ) );
							}
						},

						"[data-validType='Integer']" : {
							change : function() {
								$(this).val( formatInteger( $(this).val() ) );
							}
						},

						"[data-validType='US State']" : {
							change : function() {
								$(this).val( formatUC( $(this).val() ) );
							}
						},

						"button.close, .btn-cancel" : {
							click : function() {
								if ( self.utility.needsCheckin() )  {
									self.utility.checkin('all');
								} else {
									self.utility.closeCurrentForm();
								}
							}
						},

						".btn-go" : {
							click : self.utility.saveCurrentFormAndClose
						},

						".btn-save" : {
							click : self.utility.saveCurrentForm
						},

						".btn-reset" : {
							click : self.utility.resetCurrentForm
						},

						".btn-refreshForm" : {
							click : self.utility.refreshCurrentForm
						},

						"input" : {
							keyup : function(e) {
								e.preventDefault();
								if (e.which === 13) {
									if( self.utility.isConfirmed() ) {
										self.utility.saveCurrentFormAndClose();
									}
								} else if (e.which === 27) {
									self.utility.closeCurrentForm();
								}
							}
						},

						"#confirmation" : {
							keyup : function() {
								if( $(this).val().toString().toLowerCase() === 'yes' ) {
									self.fn.$currentForm().find('.btn-go').removeClass('disabled');
								} else {
									self.fn.$currentForm().find('.btn-go').addClass('disabled');
								}
							}
						},

						"[_linkedElmID]" : {
							change : function() {
								var This = $(this),
									$col = This.attr('_linkedElmFilterCol'),
									$id	 = This.val(),
									$labels = This.attr('_linkedElmLabels'),
									$options = This.attr('_linkedElmOptions'),
									oFrm = self.fn.oCurrentForm(),
									oElm = oFrm.fn.getElmById( This.attr('_linkedElmID') );


								// set data to always expire;
								oElm.fn.setTTL(-1);
								oElm.options.hideIfNoOptions = true;
								oElm.options.cache = false;

								oElm.fn.attr( {
									'_optionsFilter' : $col + '=' + $id,
									'_firstoption' : 0,
									'_firstlabel' : '-Other-',
									'_labelsSource' : $labels,
									'_optionsSource' : $options
									} );

								oElm.fn.initSelectOptions(true);

							},
						}

					}, self.options.events.form);

					// grid events
					self.options.events.grid = $.extend(true, {
						// the bind function will assume the scope is relative to the grid
						// unless the key is found in the global scope
						// boot functions will be automatically called at runtime
						window : {
							resize : function() {
								self.utility.timeout( {
									key : 'resizeTimeout',
									fn : self.utility.DOM.updateColWidths,
									delay : 500
								});
							},

							beforeunload : self.utility.unloadWarning,
						},

						".deleteicon" : {
							click : function() {
								$(this).prev('input').val('').focus().trigger('keyup');
								self.utility.DOM.applyHeaderFilters();
							}
						},

						".header-filter" : {
							keyup : function() {
								self.utility.toggleDeleteIcon( $(this) );

								self.utility.timeout( {
									key : 'applyHeaderFilters',
									fn : self.utility.DOM.applyHeaderFilters,
									delay : 300
								});

							},

							boot : self.utility.DOM.applyHeaderFilters
						},

						".tbl-sort" : {
							click : function() {
								var $btn, $btnIndex, $desc

								//button
								$btn = $(this);
								//index
								$btnIndex = $btn.closest('.table-header').index()+1;

								//tooltip
								$btn.attr('title', $btn.attr('title').indexOf('Descending') !== -1 ?
									'Sort Ascending' :
									'Sort Descending'
								).attr('data-original-title', $btn.attr('title') )
								.tooltip({delay:300});

								//ascending or descending
								$desc = $btn.find('i').hasClass('fa-sort-amount-desc');

								//other icons
								tbl.find('.tbl-sort i.fa-sort-amount-desc')
									.removeClass('fa-sort-amount-desc')
									.addClass('fa-sort-amount-asc')
									.end()
									.find('.tbl-sort.btn-primary')
									.removeClass('btn-primary');

								//btn style
								$btn.addClass('btn-primary');

								//icon
								$btn.find('i')
									.removeClass( ($desc) ? 'fa-sort-amount-desc' : 'fa-sort-amount-asc')
									.addClass( ($desc) ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc');

								tbl.find('.table-body .table-row').show();

								// perform the sort on the table rows
								self.utility.DOM.sortByCol( $btnIndex, $desc );
							}
						},

						"[title]" : {
							boot : function() {
								$('[title]').tooltip({delay:300});
							}
						},

						".btn-readmore" : {
							click : function()  {
								$(this).toggleClass('btn-success btn-warning');
								$(this).siblings('.readmore').toggleClass('active');
							}
						},

						"[name=RowsPerPage]" : {
							change : function() {
								tbl.find('[name=RowsPerPage]').val( $(this).val() );
								self.utility.DOM.rowsPerPage( $(this).val() );
							},
							boot : function() {
								if ( self.utility.isPagination() ) {
									$('[name=RowsPerPage]').parent().show();
								} else {
									$('[name=RowsPerPage]').parent().hide();
								}
							}
						},

						".deleteicon" : {
							boot : function() {
								$(this).remove();
							}
						},

						".chk_all" : {
							change : function() {
								self.$().find(':checkbox:visible').prop('checked',$(this).prop('checked'));
							}
						},

						".chk_cid" : {
							change : function() {
								var $chk_all,	// $checkall checkbox
									$checks,	// $checkboxes
									total_num,	// total checkboxes
									num_checked,// number of checkboxes checked


								$chk_all = tbl.find('.chk_all');
								$checks = tbl.find('.chk_cid');
								total_num = $checks.length;
								num_checked = tbl.find('.chk_cid:checked').length

								// set the state of the checkAll checkbox
								$chk_all
								.prop('checked', (total_num === num_checked) ? true : false )
								.prop('indeterminate', (num_checked > 0 && num_checked < total_num) ? true : false );
							}
						},

						".btn-new" : {
							click : function() {
								self.utility.actionHelper('new');
							}
						},

						".btn-edit" : {
							click : function() {
								self.utility.actionHelper('edit');
							}
						},

						".btn-delete" : {
							click : function() {
								self.utility.actionHelper('delete');
							}
						},

						".btn-refresh" : {
							click : function() {
								$(this).addClass('disabled').delay(2000).removeClass('disabled');
								self.fn.updateAll();
							}
						},

						".btn-showMenu" : {
							click : self.utility.DOM.toggleRowMenu
						},

						".table-body .table-row" : {
							mouseover : function() {
								var $tr = $(this);

								clearTimeout(self.dataGrid.intervals.cancelRowMenuUpdate);
								self.dataGrid.intervals.moveRowMenu = setTimeout( function() {
									tbl.find('.btn-showMenu').removeClass('hover');
									if (tbl.find('.rowMenu').hasClass('expand') === false) {
										tbl.find('.btn-showMenu').removeClass('active');
									}
									$tr.find('.btn-showMenu').addClass('hover');

								}, 250 );
							},

							mouseout : function() {

								var $tr = $(this);
								clearTimeout(self.dataGrid.intervals.moveRowMenu);
								self.dataGrid.intervals.cancelRowMenuUpdate = setTimeout( function() {
									tbl.find('.btn-showMenu').removeClass('hover');
									if (!tbl.find('.rowMenu').hasClass('expand')) {
										$tr.find('.btn-showMenu').removeClass('active');
									}
									tbl.find('.rowMenu').removeClass('active');
								}, 100 );
							}
						}
					}, self.options.events.grid);
			}, //end fn

			/**
			 * Load Form Definitions
			 * @method function
			 * @return {[type]} [description]
			 */
			loadFormDefinitions : function() {
				self.options.formDefs = $.extend(true, {}, {

					editFrm : {
						table : self.options.table,
						pkey : self.options.pkey,
						tableFriendly : self.options.tableFriendly,
						atts : { name : 'frm_editGrid', method : 'PATCH' },
						disabledElements : self.options.disabledFrmElements,
					},

					newFrm : {
						table : self.options.table,
						pkey : self.options.pkey,
						tableFriendly : self.options.tableFriendly,
						atts : { name : 'frm_editGrid', method : 'POST' },
						disabledElements : self.options.disabledFrmElements
					},

					deleteFrm : {
						table : self.options.table,
						pkey : self.options.pkey,
						tableFriendly : self.options.tableFriendly,
						loadExternal : false,
						atts : {
							name : 'frm_deleteGrid', // + self.options.tableFriendly,
							method : 'DELETE'
						},
						btns : [
							{ 'type' : 'button', 'class' : 'btn btn-success btn-go disabled', 	'id' : 'btn_go', 'value' : 'Go' },
							{ 'type' : 'button', 'class' : 'btn btn-danger btn-cancel', 'id' : 'btn_cancel', 'value' : 'Cancel' },
						],
						colParams : [
							{ 'type' : 'text', '_label' : 'Type yes to continue', 'name' : 'confirmation', 'id' : 'confirmation'  },
						],
						fieldset : {
							'legend' : 'Delete Record',
						}
					},

					colParamFrm : {
						table : 'col_params',
						pkey : 'colparam_id',
						tableFriendly : 'Column Parameters',
						btns : [],
						atts : {
							name : 'frm_element_editor',
						},
						fieldset : {
							'legend' : '3. Edit Column Parameters',
						}
					}
				}, options.formDefs);
			}, //end fn

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
					if (self.utility.isCaching()) {
							self.store.set('data_' + self.options.table,response);
					}
					self.utility.DOM.togglePreloader(true);
					self.fn.buildMenus();
				}, // end fn

				/**
				 * Grid data request completed
				 * @method function
				 * @return {[type]} [description]
				 */
				complete : function() {
					self.utility.DOM.activityPreloader('hide');
				}, // end fn
			}, // end callbacks

			/**
			 * Clear countdown interval
			 * @method function
			 * @return {[type]} [description]
			 */
			clearCountdownInterval : function() {
				try {
					clearInterval( self.dataGrid.intervals.countdownInterval );
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
				self.utility.clearCountdownInterval();
				self.dataGrid.intervals.countdownInterval = setInterval( self.utility.updateCountdown,1000 );
			}, // end fn

			/**
			 * Clear the get checked out records interval
			 * @method function
			 * @return {[type]} [description]
			 */
			clearGetCheckedOutRecordsIntevrval : function() {
				try {
					clearInterval( self.dataGrid.intervals.getCheckedOutRecords );
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
				if ( self.utility.isEditable() ) {
					self.utility.clearGetCheckedOutRecordsIntevrval();
					self.dataGrid.intervals.getCheckedOutRecords = setInterval( self.utility.getCheckedOutRecords, 10000 );
				}
			}, // end fn

			/**
			 * Update countdown
			 * @method function
			 * @return {[type]} [description]
			 */
			updateCountdown : function() {
				tbl.find('button[name=btn_refresh_grid]').find('span').text( (self.dataGrid.intervals.countdownTimer > 0) ? Math.floor( self.dataGrid.intervals.countdownTimer / 1000) : 0 );
				self.dataGrid.intervals.countdownTimer -= 1000;
			}, // end fn

			/**
			 * Initialize countdown timer value
			 * @method function
			 * @return {[type]} [description]
			 */
			initCountdown : function() {
				self.dataGrid.intervals.countdownTimer = self.options.refreshInterval-2000;
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

				if ( $e.text().length > self.options.maxCellLength ) {
					// look for child html elements
					if ( $e.find(':not(i)').length > 0) {
						$rdMr = $('<span/>', {'class':'readmore'});

						while ( $e.text().length > self.options.maxCellLength ) {
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
							.html( $e.html().substr(self.options.maxCellLength) );

						// truncate the visible text in the cell
						$truncated = $e.html().substr(0,self.options.maxCellLength);

						$e.empty().append($truncated).append($rdMr).prepend($btn);
					} // end else
				}// end if

				return $e.html();

			}, // end fn

			/**
			 * Set up HTML templates
			 * @method function
			 * @return {[type]} [description]
			 */
			setupHtmlTemplates : function() {
				/**
				 *   HTML TEMPLATES
				 *
				 *  Place large html templates here.
				 *  These are rendered with
				 *  the method self.utility.render.
				 *
				 *  Parameters of the form {@ParamName}
				 *  are expanded by the render function
				 */
				self.html = $.extend(true, {}, {

					// main grid body
					tmpMainGridBody : '<div class="row"> <div class="col-lg-12"> <div class="panel panel-info panel-grid panel-grid1"> <div class="panel-heading"> <h1 class="page-header"><i class="fa {@icon} fa-fw"></i><span class="header-title"> {@headerTitle} </span></h1> <div class="alert alert-warning alert-dismissible helpText" role="alert"> <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> {@helpText} </div> </div> <div class="panel-body grid-panel-body"> <div class="table-responsive"> <div class="table table-bordered table-grid"> <div class="table-head"> <div class="table-row"> <div class="table-header" style="width:100%"> <div class="btn-group btn-group-sm table-btn-group">  </div> </div> </div> <div class="table-row tfilters"> <div style="width:10px;" class="table-header">&nbsp;</div> <div style="width:175px;" class="table-header" align="right"> <span class="label label-info filter-showing"></span> Filter : </div> </div> </div> <div class="table-body" id="tbl_grid_body"> <!--{$tbody}--> </div> <div class="table-foot"> <div class="row"> <div class="col-md-3"> <div style="display:none" class="ajax-activity-preloader pull-left"></div> <div class="divRowsPerPage pull-right"> <select style="width:180px;display:inline-block" type="select" name="RowsPerPage" id="RowsPerPage" class="form-control"> <option value="10">10</option> <option value="15">15</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option> <option value="10000">All</option> </select> </div> </div> <div class="col-md-9"> <div class="paging"></div> </div> </div> </div> <!-- /. table-foot --> </div> </div> <!-- /.table-responsive --> </div> <!-- /.panel-body --> </div> <!-- /.panel --> </div> <!-- /.col-lg-12 --> </div> <!-- /.row -->',

					// check all checkbox template
					tmpCheckAll	: '<div class="btn-group btn-group-sm"> <label for="chk_all" class="btn btn-default"> <input type="checkbox" class="chk_all" name="chk_all"> </label> <button title="Do With Selected" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> &nbsp;<span class="caret"></span> </button> <ul class="with-selected-menu dropdown-menu" role="menu"> {@WithSelectedOptions} </ul></div>',

					// header filter clear text button
					tmpClearHeaderFilterBtn : '<div class="btn-group btn-group-sm"> <label for="chk_all" class="btn btn-default"> <input type="checkbox" class="chk_all" name="chk_all"> </label> <button title="Do With Selected" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> &nbsp;<span class="caret"></span> </button> <ul class="with-selected-menu dropdown-menu" role="menu"> {@WithSelectedOptions} </ul> </div>',

					// filter showing ie Showing X / Y Rows
					tmpFilterShowing : '<i class="fa fa-filter fa-fw"></i>{@totalVis} / {@totalRows}',

					// table header sort button
					tmpSortBtn : '<button rel="{@ColumnName}" title="{@BtnTitle}" class="btn btn-sm btn-default {@BtnClass} tbl-sort pull-right" type="button"> <i class="fa fa-sort-{@faClass} fa-fw"></i> </button> ',

					// form templates
					forms : {

						// Edit Form Template
						editFrm	: '<div id="div_editFrm" class="div-btn-edit min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-blue"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-pencil fa-fw"></i> <span class="spn_editFriendlyName">{@Name}</span> [Editing] </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side"> <div class="side-by-side editFormContainer formContainer"> </div> </div> </div> </div> </div> </div>',

						// New Form Template
						newFrm	: '<div id="div_newFrm" class="div-btn-new min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-green"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-plus fa-fw"></i> New: <span class="spn_editFriendlyName">{@tableFriendly}</span> </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side"> <div class="side-by-side newFormContainer formContainer"> </div> </div> </div> </div> </div> </div> ',

						// Delete Form Template
						deleteFrm	: '<div id="div_deleteFrm" class="div-btn-delete min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-red"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-trash-o fa-fw"></i> <span class="spn_editFriendlyName"></span> : {@deleteText} </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side"> <div class="delFormContainer formContainer"></div> </div> </div> </div> </form> </div> </div> ',

						// Colparams Form Template
						colParamFrm	: '<div id="div_colParamFrm" class="div-btn-other min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-lblue"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-gear fa-fw"></i> <span class="spn_editFriendlyName">Form Setup</span> </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body" style="padding:0 0px !important;"> <div class="row side-by-side"> <div class="col-lg-3 tbl-list"></div> <div class="col-lg-2 col-list"></div> <div class="col-lg-7 param-list"> <div class="side-by-side colParamFormContainer formContainer"> </div> </div> </div> </div> <div class="panel-heading"> <input type="button" class="btn btn-success btn-save" id="btn_save" value="Save"> <input type="button" class="btn btn-warning btn-reset" id="btn_reset" value="Reset"> <input type="button" class="btn btn-warning btn-refreshForm" id="btn_refresh" value="Refresh Form"> <input type="button" class="btn btn-danger btn-cancel" id="btn_cancel" value="Cancel"> </div> </div> </div> </div>',
					}
				}, options.html);

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
				var ptrn, key, val;

				//if (typeof params !== 'object') return '';

				_.each( params, function(val, key) {
					ptrn = new RegExp( '\{@' + key + '\}', 'gi' );
					str = str.replace(ptrn, val );
				})

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
			 *  replace callbak self.utility.replacer.
			 *
			 *  e.g. {@ParamName} -> self.oJSON[row][ParamName]
			 **  **  **  **  **  **  **  **  **  **/
			interpolate : function(value) {
				return value.replace(/\{@(\w+)\}/gi, self.utility.replacer)
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
			replacer : function(match, p1, offset, string) {
				return self.currentRow[p1];
			}, // end fn

			/**
			 * Get the rows that match the header filter text
			 * @method function
			 * @return {[type]} [description]
			 */
			getHeaderFilterMatchedRows : function() {
				var columnOffset = (self.utility.isEditable()) ? 3 : 2,
						currentColumn,
						currentMatches,
						matchedRows,
						targetString


				//iterate through header filters and apply each
				tbl.find('.header-filter').each( function(i) {
					if ( !$(this).val().toString().trim() ) return false;

					// calculate the index of the current column
					currentColumn = +(i + columnOffset);

					// set the target string for the current column
					// note: using a modified version of $.contains that is case-insensitive
					targetString = ".table-row .table-cell:nth-child(" + currentColumn + "):contains('" + $(this).val() + "')";

					// find the matched rows in the current column
					currentMatches = tbl.find(targetString)
															.parent()
															.map( function(i, obj) { return $(obj).index(); })
															.get();

					// if matchedRows is non-empty, find the intersection of the
					// matched rows and the current rows - ie the rows that match
					// all of the criteria processed so far.
					matchedRows = (!matchedRows.length) ?
						currentMatches :
						_.intersection(matchedRows,currentMatches);

				});

				return matchedRows;

			}, //end fn

			/**
			 * Sets the rows that are visible
			 * @param  {array} visibleRows [indexes of the visible rows]
			 * @return {[type]}             [description]
			 */
			setVisibleRows : function( visibleRows ) {
				// show appropriate rows
				tbl.find('.table-body .table-row').hide()
					 .filter( function(i) {
						 return _.indexOf(visibleRows, i) !== -1;
				}).show();
			}, // end fn

			/**
			 * Are Header Filters Non-empty
			 * @method function
			 * @return {[type]} [description]
			 */
			areHeaderFiltersNonempty : function() {
				return !!tbl.find('.header-filter').filter( function() {
					return !!this.value;
				}).length
			}, //end fn

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
				var template;

				if (!value || value.toString().toLowerCase() === 'null') {
					return '';
				}

				if (typeof self.options.templates[column] === 'function') {
					template = self.options.templates[column];
					value = template(value);
				}

				if (value.toString().indexOf('|') !== -1) {
					value = value.replace(/\|/gi,', ');
				}

				if ( self.utility.isEllipses() ) {
					value = self.utility.ellipsis( value );
				}

				return value;
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   deltaData
			 *
			 *  @prev (obj) previous state of object
			 *  @now  (obj) current state of object
			 *
			 *  computes and returns the difference
			 *  between two objects
			 **  **  **  **  **  **  **  **  **  **/
			deltaData : function(prev, now) {
				var changes = {}, prop, c;
				$.each(now, function( i, row) {
					if (typeof prev[i] === 'undefined') {
						changes[i] = row;
					} else {
						$.each( row, function( prop, value) {
							if (prev[i][prop] !== value) {
								if (typeof changes[i] === 'undefined') {
									changes[i] = {};
								}
								changes[i][prop] = value;
							}
						})
					}
				})
				if ($.isEmptyObject(changes)) {
					return false;
				}
				return changes;

			}, // end fn

			/**
			 * Checkout record
			 * @param  {[type]} id [description]
			 * @return {[type]}    [description]
			 */
			checkout : function(id) {
				return true;
				self.ajaxVars = {
					url: self.options.url,
					data: {
						table : self.options.table,
						id : id,
						frm_name : 'frm_checkout'
					},
					type: 'POST',
					success: self.callback.checkout
				};

				$.ajax(self.ajaxVars);
			}, // end fn

			/**
			 * Checkin record
			 * @param  {[type]} id [description]
			 * @return {[type]}    [description]
			 */
			checkin : function(id) {
				return true;
				self.ajaxVars = {
					url: self.options.url,
					data: {
						table : self.options.table,
						id : id,
						frm_name : 'frm_checkin'
					},
					type: 'POST',
					success: self.callback.checkin
				};

				$.ajax(self.ajaxVars);
			}, // end fn

			/**
			 * Get all checked out records
			 * @return {[type]} [description]
			 */
			getCheckedOutRecords : function() {
				return true;
				self.ajaxVars = {
					url: self.options.url,
					data: {
						table : self.options.table,
						frm_name : 'frm_getCheckoutOutRecords'
					},
					type: 'POST',
					dataType : 'JSON',
					success: self.callback.getCheckedOutRecords
				};

				$.ajax(self.ajaxVars);

			}, // end fn

			/**
			 * Set initial parameters
			 * @method function
			 * @return {[type]} [description]
			 */
			setInitParams : function() {

				/**
				 * Placeholders
				 */
				self.store = $.jStorage;

				/**
				 * [dataGrid description]
				 * @type {Object}
				 */
				self.dataGrid = {

						// pagination parameters
						pagination : {
							totalPages : -1,
							rowsPerPage : $.jStorage.get('pref_rowsPerPage',self.options.rowsPerPage)
						},

						// ajax requests
						requests : [],

						// request options
						requestOptions : {
							url : self.options.url,
							data : {
								filter : self.options.filter,
								filterMine : 0
							}
						},

						// intervals
						intervals : {

						},

						// timeouts
						timeouts : {

						},
				}

				self.DOM = {
					$grid : false,
					$tblMenu : false,
					$rowMenu : $('<div/>', { class : 'btn-group rowMenu', style : 'position:relative !important' }),
					$withSelectedMenu : $('<div/>'),
				}

				self.DOM.$currentRow = false;
				self.action = 'new';
				self.currentRow = {};
				self.oJSON = {};
				self.oDelta = {};
				self.forms = {};
				self.linkTables = [];
				self.temp = {};
				self.store.setTTL('data_' + self.options.schema + '_' + self.options.dbView,self.options.refreshInterval);

				/**
				 * Deprecated
				 */
				//self.url = window.location.href.replace("#/","");
			}, // end fn

			/**
			 * DOM Manipulation Functions
			 * @type {Object}
			 */
			DOM : {

				/**
				 * Update the header title
				 * @param  {[type]} newTitle [description]
				 * @return {[type]}          [description]
				 */
				updateHeaderTitle : function(newTitle) {
					self.options.gridHeader.headerTitle = newTitle;
					tbl.find('span.header-title').html(newTitle);
				}, // end fn

				/**
				 * Toggle column visibility
				 * @param  {[type]} elm [description]
				 * @return {[type]}     [description]
				 */
				toggleColumnVisibility : function( elm ) {
					var col = elm.data('column'),
						i = +elm.closest('li').index()+2;

					if (elm.find('i').hasClass('fa-check-square-o')) {
						elm.find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
						tbl.find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i +'), .table-body .table-cell:nth-child(' + i +')').hide();
					} else {
						elm.find('i').addClass('fa-check-square-o').removeClass('fa-square-o');
						tbl.find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i +'), .table-body .table-cell:nth-child(' + i +')').show();
					}

					self.utility.DOM.updateColWidths();

				}, //end fn

				/**  **  **  **  **  **  **  **  **  **
				 *   rowsPerPage
				 *
				 *  @rowsPerPage (int) hide the preloader
				 *
				 *  show/hide the preload animation
				 **  **  **  **  **  **  **  **  **  **/
				rowsPerPage : function( rowsPerPage ) {
					if ( isNaN(rowsPerPage) ) return false;

					self.store.set('pref_rowsPerPage',rowsPerPage);
					self.options.pageNum = 1;
					self.dataGrid.pagination.rowsPerPage = Math.floor(rowsPerPage);
					self.utility.updatePagination();
					self.utility.DOM.page(1);
					self.utility.DOM.updateColWidths();
				}, // end fn

				/**  **  **  **  **  **  **  **  **  **
				 *   preload
				 *
				 *  @hide (bool) hide the preloader
				 *
				 *  show/hide the preload animation
				 **  **  **  **  **  **  **  **  **  **/
				togglePreloader : function( hide ) {
					if (typeof hide === 'undefined') { hide = false; }

					if (!hide) {
						tbl.css('background','url("/images/tbody-preload.gif") no-repeat center 175px rgba(0,0,0,0.15)')
						 .find('[name=RowsPerPage],[name=q]').prop('disabled',true).end()
						 .find('.table-body').css('filter','blur(1px) grayscale(100%)').css('-webkit-filter','blur(2px) grayscale(100%)') .css('-moz-filter','blur(2px) grayscale(100%)')
						 //.find('.table-cell, .table-header').css('border','1px solid transparent').css('background','none');
					} else {
						tbl.css('background','')
						 .find('[name=RowsPerPage],[name=q]').prop('disabled',false).end()
						 .find('.table-body').css('filter','').css('-webkit-filter','').css('-moz-filter','')
						 //.find('.table-cell, .table-header').css('border','').css('background','');
					}
				}, // end fn

				/**  **  **  **  **  **  **  **  **  **
				 *   page
				 *
				 *  @pageNum (int) the new page number
				 *  				to display
				 *
				 *  jumps to the desired page number
				 **  **  **  **  **  **  **  **  **  **/
				page : function( pageNum ) {
					var first, last;

					self.utility.DOM.togglePreloader();

					if (isNaN(pageNum)) return false;
					pageNum = Math.floor(pageNum);

					self.options.pageNum = pageNum;
					first = +( (pageNum-1) * self.dataGrid.pagination.rowsPerPage );
					last  = +(first+self.dataGrid.pagination.rowsPerPage);
					tbl.find('.table-body .table-row').hide().slice(first,last).show();

					// set col widths
					setTimeout(	self.utility.DOM.updateColWidths, 100 );
				}, // end fn

				/**  **  **  **  **  **  **  **  **  **
				 *   updatePanelHeader
				 *
				 *  @text	(string) text to display
				 *
				 *  updates the text display in the
				 *  header of the form wrapper
				 *
				 **  **  **  **  **  **  **  **  **  **/
				updatePanelHeader : function(text) {
					self.fn.$currentFormWrapper().find('.spn_editFriendlyName').html( text );
				}, // end fn

				/**
				 * Remove rows from the DOM that do not have corresponding data
				 * @param  {[type]} all [description]
				 * @return {[type]}     [description]
				 */
				removeRows : function(all) {
					var identifiers = _.pluck(self.oJSON, self.options.pkey);

					if (typeof all !== 'undefined' && all) {
						tbl.find('.table-body .table-row').remove();
					} else {
						self.DOM.$rowMenu.detach();

						tbl.find('.table-row[data-identifier]')
							 .filter( function(i, row) {
								 	return _.indexOf( identifiers, $(row).attr('data-identifier') ) === -1;
							 }
						).remove();
					}
				}, // end fn

				/**
				 * Apply the header filters
				 * @method function
				 * @return {[type]} [description]
				 */
				applyHeaderFilters : function() {
					var matchedRows = [];

					if ( !self.utility.areHeaderFiltersNonempty() ) {
						return self.utility.DOM.removeHeaderFilters();
					}

					self.utility.DOM.hidePaginationControls();

					matchedRows = self.utility.getHeaderFilterMatchedRows();

					self.utility.setVisibleRows( matchedRows );

					tbl.find('.filter-showing').html(
							 self.utility.render( self.html.tmpFilterShowing,
								 {
									 'totalVis' : matchedRows.length,
									 'totalRows' : tbl.find('.table-body .table-row').length
								 }
								)
						 );

					// update column widths
					self.utility.DOM.updateColWidths();

				}, // end fn

				/**
				 * Remove the header filters
				 * @method function
				 * @return {[type]} [description]
				 */
				removeHeaderFilters : function() {
					if ( self.utility.isPagination() ) {
						self.utility.DOM.showPaginationControls();
						self.utility.DOM.updateFilterText('');
						self.utility.DOM.page(self.options.pageNum);
					}
				}, // end fn

				/**
				 * Update the Showing x/x filter text
				 * @method function
				 * @param  {[type]} text [description]
				 * @return {[type]}      [description]
				 */
				updateFilterText : function(text) {
					tbl.find('.filter-showing').html( text );
				}, // end fn

				/**
				 * Show the pagination controls
				 * @method function
				 * @return {[type]} [description]
				 */
				showPaginationControls : function() {
					tbl.find('.divRowsPerPage, .paging').show();
				}, // end fn

				/**
				 * Hide the pagination controls
				 * @method function
				 * @return {[type]} [description]
				 */
				hidePaginationControls : function() {
					tbl.find('.divRowsPerPage, .paging').hide();
				}, // end fn

				/**
				 * Header Filter Delete Icons
				 * @method function
				 * @return {[type]} [description]
				 */
				headerFilterDeleteIcons : function() {
					$('.header-filter').after(
						$('<span/>', {'class':'deleteicon','style':'display:none'})
						.html(
							self.utility.render( self.html.tmpClearHeaderFilterBtn )
						)
					)
				}, // end fn

				/**  **  **  **  **  **  **  **  **  **
				 *   sortByCol
				 *
				 *  @colNum (int) the 1-indexed html
				 *  			column to sort by
				 *
				 *  @desc 	(bool) sort descending
				 *
				 *  sorts the table rows in the DOM
				 *  according the the input column
				 *  and direction (asc default)
				 **  **  **  **  **  **  **  **  **  **/
				sortByCol : function( colNum, desc ) {
					var $col;

					//col
					$col = tbl.find('.table-body .table-row .table-cell:nth-child(' + colNum + ')')
					  .map( function(i,elm) {
							return [[
										$(elm).text().toLowerCase(),
										$(elm).parent()
									]];
						})
						.sort(function(a,b) {

							if (jQuery.isNumeric(a[0]) && jQuery.isNumeric(b[0])) {
								return a[0]-b[0];
							}

							if (a[0] > b[0]) {
								return 1;
							}

							if (a[0] < b[0]) {
								return -1;
							}

							// a must be equal to b
							return 0;
						}
					);

					// iterate through col
					$.each($col, function(i,elm){
						var $e = $(elm[1]);

						// detach the row from the DOM
						$e.detach();

						// attach the row in the correct order
						(!desc) ?
							tbl.find('.table-body').append( $e ) :
							tbl.find('.table-body').prepend( $e );
					});

					// go to the appropriate page to refresh the view
					self.utility.DOM.page( self.options.pageNum );

					// apply header filters
					self.utility.DOM.applyHeaderFilters()
				}, // end fn

				/**
				 * Hide or show the activity preloader
				 * @method function
				 * @param  {[type]} action [description]
				 * @return {[type]}        [description]
				 */
				activityPreloader : function( action ) {
					if (action !== 'hide') {
						$('.ajax-activity-preloader').show();
					} else {
						$('.ajax-activity-preloader').hide();
					}
				}, //end fn

				/**
				 * Empty the page wrapper div
				 * @method function
				 * @return {[type]} [description]
				 */
				emptyPageWrapper : function() {
					$('#page-wrapper').empty();
				}, //end fn

				/**
				 * Update column widths
				 * @method function
				 * @return {[type]} [description]
				 */
				updateColWidths : function() {
					// set column widths
					$('.grid-panel-body .table-row').find('.table-cell, .table-header').css('width','');

					// table height
					if( !$('#page-wrapper').hasClass('scrolled') ) {
						$('.grid-panel-body .table').css('height',+$(window).height()-425);
					} else {
						$('.grid-panel-body .table').css('height',+$(window).height()-290);
					}

					// perfect scrollbar
					$('.table-grid').perfectScrollbar('update');

					//add scroll listener
					$('.table-grid').off('scroll.custom').on('scroll.custom', function() {
						if ( typeof self.scrollTimeout !== 'undefined' ) {
							clearInterval(self.scrollTimeout);
						}
						self.scrollTimeout = setTimeout( function() {
							if (  $('.table-body').offset().top < 10 ) {
								if( !$('#page-wrapper').hasClass('scrolled') ) {
									// table height
									$('#page-wrapper').addClass('scrolled');
									$('.grid-panel-body .table').animate(
										{ 'height' : +$(window).height()-290 },
										500,
										'linear',
										function() {
											// perfect scrollbar
											$('.table-grid').perfectScrollbar('update');
										}
									);
								}
							} else if ($('.table-body').offset().top > 50  ) {
								if( $('#page-wrapper').hasClass('scrolled') ) {

									$('#page-wrapper').removeClass('scrolled');
									// table height
									$('.grid-panel-body .table').animate(
										{'height' : +$(document).height()-425},
										300,
										'linear',
										function() {
											// perfect scrollbar
											$('.table-grid').perfectScrollbar('update');
										}
									);
								}
							}
						}, 300)
					});

					self.options.maxColWidth =  +350/1920 * +$(window).innerWidth();

					//visible columns
					var visCols = +$('.table-head .table-row').eq(1).find('.table-header:visible').length-1;

					for(var ii=1; ii <= visCols; ii++ ) {

						var colWidth = Math.max.apply( Math, $('.grid-panel-body .table-row').map(function(i) {
							return $(this).find('.table-cell:visible,.table-header-text:visible').eq(ii).innerWidth() } ).get()
						);

						if ( +colWidth > self.options.maxColWidth && ii < visCols ) {
							colWidth = self.options.maxColWidth;
						}

						if ( ii == visCols ) {
							colWidth = +$(window).innerWidth()-$('.table-head .table-row').eq(1).find('.table-header:visible').slice(0,-1).map( function(i) { return $(this).innerWidth() } ).get().reduce( function(p,c) { return p+c } )-40;
						}

						var nindex = +ii+1;

						// set widths of each cell
						$(  '.grid-panel-body .table-row:not(.tr-no-data) .table-cell:visible:nth-child(' + nindex + '),' +
							'.grid-panel-body .table-row:not(.tr-no-data) .table-header:visible:nth-child(' + nindex + ')').css('width',+colWidth+14);

						if (ii==1) {
							//$('.tfilters .table-header').eq(1).css('width', +colWidth+90);
						}
					}

					//hide preload mask
					self.utility.DOM.togglePreloader(true);
				}, // end fn

				/**  **  **  **  **  **  **  **  **  **
				 *   moveRowMenu
				 *
				 *  @tr - target table row element
				 *
				 *  Moves the row menu to the target
				 **  **  **  **  **  **  **  **  **  **/
				moveRowMenu : function($tr) {
					self.DOM.$rowMenu.detach().appendTo( $tr.find('.table-cell .rowMenu-container').eq(0) );
				}, // end fn

				/**
				 * Toggle Row Menu visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleRowMenu : function() {
					var $btn = $(this),
						 	$tr = $(this).closest('.table-row'),
							$rowMenu = self.DOM.$rowMenu;

					$rowMenu.removeClass('expand');

					self.utility.DOM.moveRowMenu($tr);

					$btn.toggleClass('active rotate');

					if ( $btn.hasClass('rotate') ) {
						$rowMenu.addClass('expand');
					}
					else {
						$rowMenu.removeClass('expand');
					}
					tbl.find('.btn-showMenu').not(this).removeClass('rotate active');
				}, // end fn


				/**
				 * Reset row menu to non-expanded state
				 * @method function
				 * @return {[type]} [description]
				 */
				resetRowMenu : function() {
					$('.btn-showMenu').removeClass('rotate');
					self.DOM.$rowMenu.removeClass('expand');
				}, // end fn

				/**
				 * Initialize grid
				 * @method function
				 * @return {[type]} [description]
				 */
				initGrid : function() {
					var id = self.options.table + '_' + Date.now();

					self.DOM.$grid = $('<div/>' , { id : id }).html(
						self.utility.render(
							self.html.tmpMainGridBody , self.options.gridHeader
						)
					).find('select#RowsPerPage')
						.val( self.dataGrid.pagination.rowsPerPage )
						.end()
					.mouseover( function() { jApp.activeGrid = self } )
					.appendTo('#page-wrapper');

					self.DOM.$tblMenu = self.DOM.$grid.find('.table-btn-group');

					tbl = self.DOM.$grid;

					if ( !self.options.gridHeader.helpText ) {
						tbl.find('.helpText').hide();
					}

				}, // end fn

				/**
				 * iterates through changed data and updates the DOM
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGrid : function() {
					// init vars
					var appendTR = false,
						appendTD = false;

					if (!!self.oDelta[0] && self.oDelta[0][self.options.pkey] === 'NoData') {
						var tr = $('<div/>', { class : 'table-row tr-no-data'} ).append( $('<div/>', { class : 'table-cell'} ).html('No Data') );

						tbl.find('.table-body').empty().append( tr );
						return false;
					}

					// iterate through the changed data
					$.each( self.oDelta, function(i,oRow) {

						tbl.find('.table-body .tr-no-data').remove();

						// save the current row.
						self.currentRow = self.oJSON[i];

						// find row in the table if it exists
						var	tr = tbl.find('.table-row[data-identifier="' + oRow[self.options.pkey] + '"]');

						// try the json key if you can't find the row by the pkey
						if (!tr.length) tr = tbl.find('.table-row[data-jsonkey=' + i + ']');

						// create the row if it does not exist
						if (!tr.length) {
							tr = $('<div/>', { 'class' : 'table-row', 'data-identifier' : oRow[self.options.pkey], 'data-jsonkey' : i } );
							appendTR = true;

							if (self.utility.isEditable()) {


								var td_chk = $('<div/>', { 'class' : 'table-cell', "nowrap" : "nowrap",  "style" : "position:relative;"} );
								//var td_chk = $('<div/>', { 'class' : 'table-cell', "nowrap" : "nowrap" } );
								if (!!self.options.cellAtts['*']) {
									$.each( self.options.cellAtts['*'], function(at, fn) {
										td_chk.attr( at,fn() );
									});
								}

								var collapseMenu = (!!self.options.toggles.collapseMenu) ?
									'<button style="padding:0" class="btn btn-success btn-showMenu"> <i class="fa fa-angle-right fa-fw fa-lg"></i> </button>' :
									'';

								var	tdCheck = (!!oRow[self.options.pkey]) ? '<input type="checkbox" class="chk_cid" name="cid[]" />' : '';

								var lblCheck = '<label class="btn btn-default pull-right lbl-td-check" style="margin-left:20px;"> ' + tdCheck + '</label>';

								td_chk.html( 	'<div class="permanent-handle"> ' +
													collapseMenu +
													lblCheck +
												'<div class="rowMenu-container"></div> \
												</div>&nbsp;'
								);
								tr.append(td_chk);
							}

						} else { // update the row data- attributes
							tr.attr('data-identifier',oRow[self.options.pkey]).attr('data-jsonkey',i);

							var td_chk = tr.find('.table-cell').eq(0);
							// update the attributes on the first cell
							if (!!self.options.cellAtts['*']) {
								$.each( self.options.cellAtts['*'], function(at, fn) {
									td_chk.attr( at,fn() );
								});
							}
						}



						// iterate through the columns
						//$.each( self.currentRow, function(key, value) {
						$.each( self.options.columns, function(i, key) {

							// get the value of the current key
							var value = self.currentRow[key];

							// determine if the column is hidden
							if ( _.indexOf(self.options.hidCols, key) !== -1) {
								return false;
							}

							// find the cell if it exists
							var td = tr.find('.table-cell[data-identifier="' + key + '"]');

							// create the cell if needed
							if (!td.length) {
								td = $('<div/>', { 'class' : 'table-cell', 'data-identifier' : key} );
								appendTD = true;
							}

							// set td attributes
							if (!!self.options.cellAtts['*']) {
								$.each( self.options.cellAtts['*'], function(at, fn) {
									td.attr( at,fn() );
								});
							}

							if(!!self.options.cellAtts[key]) {
								$.each( self.options.cellAtts[key], function(at, fn) {
									td.attr( at,fn() );
								});
							}

							// prepare the value
							value = self.utility.prepareValue(value,key);

							if ( td.html().trim() !== value.trim() ) {
								// set the cell value
								td
								 .html(value)
								 .addClass('changed')
							}


							// add the cell to the row if needed
							if (appendTD) {
								tr.append(td);
							}

						});// end each

						// add the row if needed
						if (appendTR) {
							tbl.find('.table-body').append(tr);
						}
					}); // end each

					// reset column widths
					self.utility.DOM.updateColWidths();

					// animate changed cells

						// .stop()
						// .css("background-color", "#FFFF9C")
						// .animate({ backgroundColor: 'transparent'}, 1500, function() { $(this).removeAttr('style');  } );


					setTimeout( function() { tbl.find('.table-cell.changed').removeClass('changed') }, 2000 );


					self.fn.countdown();
					self.utility.DOM.page( self.options.pageNum );

					// deal with the row checkboxes
					tbl.find('.table-row')
						.filter(':not([data-identifier])')
							.find('.lbl-td-check').remove() // remove the checkbox if there is no primary key for the row
							.end()
						.end()
						.filter('[data-identifier]') // add the checkbox if there is a primary key for the row
						.each(function(i,elm) {
							if ( self.utility.isEditable() && $(elm).find('.lbl-td-check').length === 0 ) {
								$('<label/>', { class : 'btn btn-default pull-right lbl-td-check', style : 'margin-left:20px' })
									.append( $('<input/>', { type: 'checkbox', class : 'chk_cid', name : 'cid[]' } ))
									.appendTo ( $(elm).find('.permanent-handle'));
							}
						});

					tbl.find('.table-body .table-row, .table-head .table-row:last-child').each( function(i,elm) {
						if ( $(elm).find('.table-cell,.table-header').length < 4 ) {
							$('<div/>', {'class' : 'table-cell'}).appendTo( $(elm) );
						}
					});

					tbl.find('.table-head .table-row:nth-child(2)').each( function(i,elm) {
						if ( $(elm).find('.table-cell,.table-header').length < 3 ) {
							$('<div/>', {'class' : 'table-cell'}).appendTo( $(elm) );
						}
					});

					// process pagination
					self.utility.updatePagination();


				},

				/**
				 * Clear the menus so they can be rebuilt
				 * @method function
				 * @return {[type]} [description]
				 */
				clearMenus : function() {
					self.DOM.$tblMenu.empty();
					self.DOM.$rowMenu.empty();
					self.DOM.$withSelectedMenu.empty();
				}, // end fn

				/**
				 * Build a menu
				 * @method function
				 * @param  {obj} collection 	collection of menu options to iterate over
				 * @param  {jQuery} target    DOM target for new buttons/links
				 * @param  {string} type 			buttons | links
				 */
				buildMenu : function(collection, target, type) {
					var o, key, oo, kk;

					if (typeof type === 'undefined') { type = 'buttons'}

					//build menu
					_.each( collection, function(o, key) {
						if ( self.utility.isButtonEnabled(key) ) {
							if (key === 'custom') {
								_.each( o, function( oo, kk ) {
									if (type == 'buttons') {
										self.utility.DOM.createMenuButton( oo ).appendTo( target );
									} else {
										self.utility.DOM.createMenuLink( oo ).appendTo( target );
									}
								});
							} else {
								if (type == 'buttons') {
									self.utility.DOM.createMenuButton( o ).clone().appendTo( target );
								} else {
									self.utility.DOM.createMenuLink( o ).appendTo( target );
								}
							}
						}
					});
				}, //end fn

				/**
				 * Build a button menu
				 * @method function
				 */
				buildBtnMenu : function(collection, target) {
					self.utility.DOM.buildMenu(collection, target, 'buttons');
				}, //end fn

				/**
				 * Build a link menu
				 * @method function
				 */
				buildLnkMenu : function(collection, target) {
					self.utility.DOM.buildMenu(collection, target, 'links');
				}, // end fn

				/**
				 * Helper function to create menu links
				 * @method function
				 * @param  {obj} o html parameters of the link
				 * @return {jQuery obj}
				 */
				createMenuLink : function( o ) {
					var $btn, $btn_a, $btn_choice, $ul;

					$btn_choice = $('<a/>', { href : 'javascript:void(0)' });

					//add the icon
					if (!!o.icon) {
						$btn_choice.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + o.icon } ) );
					}
					// add the label
					if (!!o.label) {
						$btn_choice.append( $('<span/>').html(o.label) );
					}
					// add the click handler
					if (!!o.fn) {
						if (typeof o.fn === 'string') {
							$btn_choice.off('click.custom').on('click.custom', function() {
							self.withSelectedButton = $(this);
							self.fn.withSelected( 'custom', self.fn[o.fn] ) } );
						} else if (typeof o.fn === 'function') {
							$btn_choice.off('click.custom').on('click.custom', function() {
							self.withSelectedButton = $(this);
							self.fn.withSelected( 'custom', o.fn ) } );
						}
					}

					// add the html5 data
					if (!!o.data) {
						_.each( o.data, function(v,k) {
							$btn_choice.attr('data-'+k,v);
						});
					}

					return $('<li/>', {class : o.class, title : o.title}).append( $btn_choice );

				}, // end fn

				/**
				 * Helper function to create menu buttons
				 * @method function
				 * @param  {obj} o html parameters of the button
				 * @return {jQuery obj}
				 */
				createMenuButton : function( params ) {
					var $btn, $btn_a, $btn_choice, $ul;

					if ( typeof params[0] === 'object') { // determine if button is a dropdown menu
						$btn = $('<div/>', { class : 'btn-group btn-group-sm'})
						// params[0] will contain the dropdown toggle button
						$btn_a = $('<a/>', {
											type : 'button',
											class : 'btn btn-success dropdown-toggle',
											href : '#',
											'data-toggle' : 'dropdown'
								   });
						// add the icon if applicable
						if (!!params[0].icon) {
							$btn_a.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + params[0].icon } ) );
						}
						// add the label if applicable
						if (!!params[0].label) {
							$btn_a.append( $('<span/>').html(params[0].label) );
						}
						// add the click handler, if applicable
						if (!!params[0].fn) {
							if (typeof params[0].fn === 'string') {
								$btn_a.off('click.custom').on('click.custom', self.fn[params[0].fn ] );
							} else if (typeof params[0].fn === 'function') {
								$btn_a.off('click.custom').on('click.custom', params[0].fn );
							}
						}
						// add the dropdown if there are multiple options
						if (params.length > 1) {
							$btn_a.append( $('<span/>', {class : 'fa fa-caret-down'}));
							$btn.append($btn_a);
							$ul = $('<ul/>', { class : 'dropdown-menu'});

							_.each( params, function(o,key) {
								if (key == 0) return false;
								$btn_choice = $('<a/>', $.extend(true, {}, o, { href : 'javascript:void(0)' }) );

								//add the icon
								if (!!o.icon) {
									$btn_choice.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + o.icon } ) );
								}
								// add the label
								if (!!o.label) {
									$btn_choice.append( $('<span/>').html(o.label) );
								}
								// add the click handler
								if (!!o.fn) {
									if (typeof o.fn === 'string') {
										$btn_choice.off('click.custom').on('click.custom', self.fn[o.fn] );
									} else if (typeof o.fn === 'function') {
										$btn_choice.off('click.custom').on('click.custom', o.fn );
									}
								}

								$btn_choice.wrap('<li></li>').parent().appendTo($ul);
							});

							$btn.append($ul);
						} else {
							$btn.append($btn_a);
						}

					} else {

						$btn = $('<button/>', params);
						if (!!params.icon) {
							$btn.append( $('<i/>', { 'class' : 'fa fa-fw fa-lg ' + params.icon } ) );
						}
						if (!!params.label) {
							$btn.append( $('<span/>').html(params.label) );
						}
						if (!!params.fn) {
							if (typeof params.fn === 'string') {
								$btn.off('click.custom').on('click.custom', self.fn[params.fn] );
							} else if (typeof params.fn === 'function') {
								$btn.off('click.custom').on('click.custom', params.fn );
							}
						}
					}

					return $btn;
				}, // end fn

				/**
				 * Build form
				 * @method function
				 * @param  {[type]} params [description]
				 * @param  {[type]} key    [description]
				 * @return {[type]}        [description]
				 */
				buildForm : function( params, key ) {
					var $frmHandle = '$' + key,
							oFrmHandle = 'o' + key.ucfirst(),
							oFrm;

					// make sure the form template exists
					if ( typeof self.html.forms[key] === 'undefined' ) return false;

					// create form object
					self.forms[oFrmHandle] = oFrm = new jForm( params );

					// create form container
					self.forms[$frmHandle] = $('<div/>', { 'class' : 'gridFormContainer' })
						.html( self.utility.render( self.html.forms[key] ) )
						.find( '.formContainer' ).append( oFrm.fn.handle() ).end()
						.appendTo( self.$() );
				}, // end fn

				/**  **  **  **  **  **  **  **  **  **
				 *   overlay
				 *
				 *  Controls the modal overlays
				 **  **  **  **  **  **  **  **  **  **/
				overlay : function(which,action) {
					var $which = (which == 1) ? '#modal_overlay' : '#modal_overlay2';
					if (action == 'on') {
						$($which).fadeIn('fast');
					} else {
						$($which).fadeOut('fast');
					}
				},

			}, // end DOM fns

		}; // end utility fns

		/**
		 * Message handler
		 * @type {Object}
		 */
		this.msg = {

			/**
			 * Clear all messages
			 * @method function
			 * @return {[type]} [description]
			 */
			clear : function() {
					$.noty.closeAll();
			}, // end fn

			/**
			 * Show a message
			 * @method function
			 * @param  {[type]} message [description]
			 * @param  {[type]} type    [description]
			 * @return {[type]}         [description]
			 */
			show : function(message, type) {
				var n = noty({
					layout: 'top',
					text : message,
					type : type || 'info',
					dismissQueue: true,
					timeout : 3000
				})
			},

			/**
			 * Display a success message
			 * @method function
			 * @param  {[type]} message [description]
			 * @return {[type]}         [description]
			 */
			success : function(message) {
				self.msg.show(message,'success');
			}, // end fn

			/**
			 * Display a error message
			 * @method function
			 * @param  {[type]} message [description]
			 * @return {[type]}         [description]
			 */
			error : function(message) {
				self.msg.show(message,'error');
			}, // end fn

			/**
			 * Display a warning message
			 * @method function
			 * @param  {[type]} message [description]
			 * @return {[type]}         [description]
			 */
			warning : function(message) {
				self.msg.show(message,'warning');
			}, // end fn

		}

		// initialize
		this.fn._init();

	}; // end jGrid

	window.jGrid = jGrid;


})(window, jQuery, $, jInput, jForm, jApp);
