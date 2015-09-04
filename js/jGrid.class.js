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
 *  			jInput, jForm, oValidator
 *  			jApp
 */

;(function(window, jQuery, $, _, jInput, jForm, oValidator, jApp) {

	'use strict';

	var jGrid = function(options) {

		/**  **  **  **  **  **  **  **  **  **
		 *  OPTIONS
		 *
		 *  set default values for options
		 **  **  **  **  **  **  **  **  **  **/
		this.options = {
			// toggles
			toggles : { // choose which buttons to display and which options to enable
				new : true,											// standard table button
				edit : true,										// standard row button
				del : true,											// standard row button
				sort : true, 										// header sort buttons
				autoUpdate : true,									// whether to update the data automatically
				paginate : true,									// whether to paginate the data
				headerFilters : true,								// whether to show the header filters
				collapseMenu : true,								// whether to collapse the row menu
				editable : true,									// whether the data is editable
				caching : false,									// cache the data for faster load times
				ellipses : true,									// whether to show the readmore buttons
				checkout : true,									// checkout records before editing them
			},

			// general grid options
			refreshInterval : 602000, 							// refresh every minute by default
			target : '.table-responsive',						// htmlTable target

			// data request options
			url	: 'index.php?controller=json&view=grid-async', 	// url of JSON resource
			table : '',											// db table (for updates / inserts)
			schema : 'dbo',										// db schema
			dbView : '',										// db view (for displaying data)
			pkey : '', 											// Primary Key Of Table
			filter : '',										// where clause for query
			columns : [ ],										// columns to query
			headers : [ ],										// headers for table
			sortBy : '1',										// the column to sort by

			// data presentation options
			tableFriendly : '',									// friendly name of table
			columnFriendly : '',								// column containing friendly name of each row
			deleteText : 'Deleting',
			hidCols : [ ],										// columns to hide
			cellAtts : [ ],										// column attributes
			templates : [ ],									// html templates
			rowsPerPage : 10,									// rows per page to display on grid
			pageNum	: 1,										// current page number to display
			maxCellLength : 38,									// max cell length
			maxColWidth: 450,
			bsmsDefaults : {									// bootstrap multiselect default options
				buttonContainer : '<div class="btn-group" />',
				enableFiltering: true,
				includeSelectAllOption: true,
				maxHeight: 185
			},
			gridHeader : {
				icon : 'fa-dashboard',
				headerTitle : 'Manage',
				helpText : false,
			},
			disabledFrmElements : [],
			editFrmName : 'frm_editGrid',

			// table buttons appear in the grid header above the data
			tableBtns : {

				new : {
					type : 'button',
					class : 'btn btn-success btn-new',
					id : 'btn_edit',
					icon : 'fa-plus-circle',
					label : 'New',
				},

				// you can define custom buttons per instance in the options
				custom : {
					visColumns : [
						{ icon : 'fa-bars fa-rotate-90', label : ' Visible Columns' },
					],
				}
			},

			rowBtns : {
				edit : {
					type : 'button',
					class : 'btn btn-primary btn-edit',
					id : 'btn_edit',
					icon : 'fa-pencil',
					label : '',
					title : 'Edit Record ...',
				},
				del : {
					type : 'button',
					class : 'btn btn-danger btn-delete',
					id : 'btn_delete',
					icon : 'fa-trash-o',
					label : '',
					title : 'Delete Record ...'
				},
				// you can define custom buttons per instance in the options
				custom : {
					//custom : { type : 'button' } // etc.
				}
			},

			withSelectedBtns : {
				/* edit : {
					type : 'button',
					id : 'btn_edit',
					icon : 'fa-pencil',
					label : 'Edit Selected',
					fn : function() { self.fn.withSelected('edit'); },
				}, */
				del : {
					type : 'button',
					class : 'li-red',
					id : 'btn_delete',
					icon : 'fa-trash-o',
					label : 'Delete Selected ...',
					fn : function() { self.fn.withSelected('delete'); },
				},
				// you can define custom buttons per instance in the options
				custom : {
					//custom : { type : 'button' } // etc.
				}
			},

			linkTables : [ ],

		}; // end options

		// set the runtime values for the options
		$.extend(true,this.options,options);

		//init values
		this.totalPages = -1;					// placeholder for computed total pages
		this.url = window.location.href.replace("#/","");
		this.ajaxRequests = [];
		this.$rowMenu = $('<div/>', { class : 'btn-group rowMenu', style : 'position:relative !important' });
		this.$tblMenu = false;
		this.closeOnSave = true;

		//placeholder values
		this.action = 'new';					// action is set by the row button that is clicked
		this.$currentRow = false;				// $currentRow is set when a grid tr is activated
		this.$grid = false;						// $grid is the jQuery handle of the grid
		this.removeAllRows = false;				// remove all rows when updating data
		this.currentRow = {};					// object container for current row in the JSON data
		this.oJSON = {};						// object container for the JSON result
		this.oDelta = {};						// object container for the computed difference
												// between the new result and the stored result
		this.forms = {};						// forms container
		this.intervals = {};					// intervals
		this.linkTables = [];					// linktables
		this.$withSelectedMenu = $('<div/>');	// with selected menu

		//storage
		this.store = $.jStorage;
		this.temp = {};
		this.store.setTTL('data_' + this.options.schema + '_' + this.options.dbView,this.options.refreshInterval);

		// copy 'this' to a global variable so it can be accessed in member methods
		var self = this;
		var tbl;

		// visible columns
		_.each( this.options.columns, function( o, i ) {
			if (i < self.options.headers.length) {
				self.options.tableBtns.custom.visColumns.push(
					{ icon : 'fa-check-square-o', label : self.options.headers[i], fn : function() { self.fn.visibleColumns( $(this) ) }, 'data-column' : o }
				);
			}
		})

		// user preferences
		self.options.rowsPerPage = ( !!self.store.get('pref_rowsPerPage',false) ) ? self.store.get('pref_rowsPerPage') : 15;

		/**  **  **  **  **  **  **  **  **  **
		 *   HTML TEMPLATES
		 *
		 *  Place large html templates here.
		 *  These are rendered with
		 *  the method self.fn.render.
		 *
		 *  Parameters of the form {@ParamName}
		 *  are expanded by the render function
		 **  **  **  **  **  **  **  **  **  **/
		this.html = {

			// main grid body
			tmpMainGridBody : '<div class="row"> <div class="col-lg-12"> <div class="panel panel-info panel-grid panel-grid1"> <div class="panel-heading"> <h1 class="page-header"><i class="fa {@icon} fa-fw"></i><span class="header-title"> {@headerTitle} </span></h1> <div class="alert alert-warning alert-dismissible helpText" role="alert"> <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> {@helpText} </div> </div> <div class="panel-body grid-panel-body"> <div class="table-responsive"> <div class="table table-bordered table-grid"> <div class="table-head"> <div class="table-row"> <div class="table-header" style="width:100%"> <div class="btn-group btn-group-sm table-btn-group"> <button type="button" name="btn_refresh_grid" class="btn btn-success pull-left btn-refresh"> <i class="fa fa-refresh fa-fw"></i><span>&nbsp;</span> </button> </div> </div> </div> <div class="table-row tfilters"> <div style="width:10px;" class="table-header">&nbsp;</div> <div style="width:175px;" class="table-header" align="right"> <span class="label label-info filter-showing"></span> Filter : </div> </div> </div> <div class="table-body" id="tbl_grid_body"> <!--{$tbody}--> </div> <div class="table-foot"> <div class="row"> <div class="col-md-3"> <div style="display:none" class="ajax-activity-preloader pull-left"></div> <div class="divRowsPerPage pull-right"> <select style="width:180px;display:inline-block" type="select" name="RowsPerPage" id="RowsPerPage" class="form-control"> <option value="10">10</option> <option value="15">15</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option> <option value="10000">All</option> </select> </div> </div> <div class="col-md-9"> <div class="paging"></div> </div> </div> </div> <!-- /. table-foot --> </div> </div> <!-- /.table-responsive --> </div> <!-- /.panel-body --> </div> <!-- /.panel --> </div> <!-- /.col-lg-12 --> </div> <!-- /.row -->',
			
			// check all checkbox template
			tmpCheckAll	: '<div class="btn-group btn-group-sm"> <label for="chk_all" class="btn btn-default"> <input type="checkbox" class="chk_all" name="chk_all"> </label> <button title="Do With Selected" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> &nbsp;<span class="caret"></span> </button> <ul class="with-selected-menu dropdown-menu" role="menu"> {@WithSelectedOptions} </ul></div>',

			// header filter clear text button
			tmpClearHeaderFilterBtn : '<div class="btn-group btn-group-sm"> <label for="chk_all" class="btn btn-default"> <input type="checkbox" class="chk_all" name="chk_all"> </label> <button title="Do With Selected" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> &nbsp;<span class="caret"></span> </button> <ul class="with-selected-menu dropdown-menu" role="menu"> {@WithSelectedOptions} </ul> </div>',

			// filter showing ie Showing X / Y Rows
			tmpFilterShowing : '<i class="fa fa-filter fa-fw"></i>{@totalVis} / {@totalRows}',

			// table header sort button
			tmpSortBtn : '<button rel="{@ColumnName}" title="{@BtnTitle}" class="btn btn-sm btn-default {@BtnClass} tbl-sort pull-right" type="button"> <i class="fa fa-sort-{@faClass} fa-fw"></i> </button> ',

			// Colparams Form Template
			tmpColParamForm	: '<div id="div_colParamFrm" class="div-btn-other min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-lblue"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-gear fa-fw"></i> <span class="spn_editFriendlyName">Form Setup</span> </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body" style="padding:0 0px !important;"> <div class="row side-by-side"> <div class="col-lg-3 tbl-list"></div> <div class="col-lg-2 col-list"></div> <div class="col-lg-7 param-list"> <div class="side-by-side colParamFormContainer"> </div> </div> </div> </div> <div class="panel-heading"> <input type="button" class="btn btn-success btn-save" id="btn_save" value="Save"> <input type="button" class="btn btn-warning btn-reset" id="btn_reset" value="Reset"> <input type="button" class="btn btn-warning btn-refreshForm" id="btn_refresh" value="Refresh Form"> <input type="button" class="btn btn-danger btn-cancel" id="btn_cancel" value="Cancel"> </div> </div> </div> </div>',

			// Edit Form Template
			tmpEditForm	: '<div id="div_editFrm" class="div-btn-edit min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-blue"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-pencil fa-fw"></i> <span class="spn_editFriendlyName">{@Name}</span> [Editing] </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side"> <div class="side-by-side editFormContainer"> </div> </div> </div> </div> </div> </div>',

			// New Form Template
			tmpNewForm	: '<div id="div_newFrm" class="div-btn-new min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-green"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-plus fa-fw"></i> New: <span class="spn_editFriendlyName">{@tableFriendly}</span> </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side"> <div class="side-by-side newFormContainer"> </div> </div> </div> </div> </div> </div> ',

			// Delete Form Template
			tmpDeleteForm	: '<div id="div_deleteFrm" class="div-btn-delete min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-red"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-trash-o fa-fw"></i> <span class="spn_editFriendlyName"></span> : {@deleteText} </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side"> <div class="delFormContainer"></div> </div> </div> </div> </form> </div> </div> ',

		};// end html templates

		// add any templates to this.html
		$.extend(true,this.html,options.html);

		// alias to the grid.
		this.$ = function() {
			return this.$grid;
		}

		/**  **  **  **  **  **  **  **  **  **
		 *   FN - MEMBER METHODS
		 *
		 *  Defines methods/functions used
		 *  by this class.
		 **  **  **  **  **  **  **  **  **  **/
		this.fn = {

			/**  **  **  **  **  **  **  **  **  **
			 *   init
			 *
			 *  Initializes the instance of the class
			 *
			 **  **  **  **  **  **  **  **  **  **/
			_init : function() {
				self.prevScroll = 0;
				$('#page-wrapper').empty();

				$(window).resize( function() {
					if ( typeof self.resizeTimeout !== 'undefined' ) {
						clearInterval( self.resizeTimeout );
					}
					self.resizeTimeout = setTimeout( self.fn.colWidths, 500 );
				});

				// initialize the grid template
				self.fn.initializeTemplate();

				// download the initial JSON data for the grid
				self.fn.update();

				// set the update intervals
				self.fn.sI();

				// create the menus
				self.fn.buildMenus();

				// create the forms
				self.fn.forms();

				// get the details of any link tables before building the forms
				self.fn.linkTables();

				// toggle the mine button if needed
				if ( window.location.href.indexOf('/my') !== -1 ) {
					self.fn.toggleMine();
				}

				// get checked out records
				self.fn.getCheckedOutRecords();


				$('.table-grid').perfectScrollbar()
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   initializeTemplate
			 *
			 *  Initializes the template for the grid
			 *  rendering the html with the runtime
			 *  values.
			 *
			 **  **  **  **  **  **  **  **  **  **/
			initializeTemplate : function() {
				var id = self.options.table + '_' + Date.now();

				//console.log('Appending template to wrapper.');
				//console.log( $('#page-wrapper').prop('outerHTML') );
				self.$grid = $('<div/>' , { id : id }).html(
					self.fn.render(
						self.html.tmpMainGridBody , self.options.gridHeader
					)
				).mouseover( function() { jApp.activeGrid = self } ).appendTo('#page-wrapper');
				//console.log( $('#page-wrapper').prop('outerHTML') );

				// set rows per page control
				self.$grid.find('select#RowsPerPage').val( self.options.rowsPerPage );

				self.$tblMenu = self.$().find('.table-btn-group');
				tbl = $('#page-wrapper').find( '#'+id );

				if ( !self.options.gridHeader.helpText ) {
					tbl.find('.helpText').hide();
				}
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   sI - setInterval
			 *
			 *  Sets the refresh interval
			 *
			 **  **  **  **  **  **  **  **  **  **/
			sI : function() {
				if (!self.options.toggles.autoUpdate) { return false; }

				if (!!self.interval) {
					clearInterval(self.interval);
				}
				self.interval = setInterval(self.fn.update,self.options.refreshInterval);

				if (!!self.options.toggles.editable) {

					// get checked out records interval
					if (!!self.intervalCheckedOutRecords) {
						clearInterval(self.intervalCheckedOutRecords);
					}
					self.intervalCheckedOutRecords = setInterval( self.fn.getCheckedOutRecords, 10000 );
				}
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   buildMenus
			 *
			 *  Iterates through the buttons and
			 *  adds them to the menus.
			 *
			 **  **  **  **  **  **  **  **  **  **/
			buildMenus : function() {
				var $ul, $btn_choice;

				//self.$tblMenu.empty();
				self.$rowMenu.empty();
				self.$withSelectedMenu.empty();

				if (!self.tableMenuBuilt) {
					//build table menu
					_.each( self.options.tableBtns, function(o,key) {
						if (key === 'custom') {
							_.each( o, function( oo, kk ) {
								self.$tblMenu.append( self.fn.createMenuButton( oo ) );
							});
						} else if (typeof self.options.toggles[key] === 'undefined' || !!self.options.toggles[key]) {
							self.$tblMenu.append( self.fn.createMenuButton( o ) );
						}
					});
					self.tableMenuBuilt = true;
				}

				//build row menu
				_.each( self.options.rowBtns, function(o, key) {
					if (key === 'custom') {
						_.each( o, function( oo, kk ) {
							var btn = self.fn.createMenuButton( oo );
							if (!!self.$rowMenu.find('.btn-delete').length) {
								btn.insertBefore( self.$rowMenu.find('.btn-delete') );
							} else {
								btn.appendTo( self.$rowMenu );
							}

						});
					} else if ( typeof( self.options.toggles[key] ) === 'undefined' || !!self.options.toggles[key] ) {
						self.$rowMenu.append( self.fn.createMenuButton( o ) );
					}
				});

				// build with selected menu
				_.each( self.options.withSelectedBtns, function(o, key) {
					//console.log(key)
					if ( typeof( self.options.toggles[key] ) === 'undefined' || !!self.options.toggles[key] ) {

						if (key === 'custom') {
							_.each( o, function( oo, kk ) {
								self.fn.createMenuLink( oo ).appendTo( self.$withSelectedMenu );
							});
						} else {
							self.fn.createMenuLink( o ).appendTo( self.$withSelectedMenu );
						}



					}
				});
			}, // end fn

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
					//console.log('binding function');
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
					console.log( 'appending data' );
					_.each( o.data, function(v,k) {
						$btn_choice.attr('data-'+k,v);
					});
				}

				return $('<li/>', {class : o.class, title : o.title}).append( $btn_choice );

			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   createMenuButton
			 *
			 *  @params (obj)	html parameters of
			 *  				the button
			 *
			 *  @return (jQuery obj)
			 *
			 *  Builds the button object with
			 *  the specified parameters
			 *
			 **  **  **  **  **  **  **  **  **  **/
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
							$btn_choice = $('<a/>', _.extend( o || {}, { href : 'javascript:void(0)' }) );

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
					o.dataView = self.options.dataView;
					o.callback = self.callback.linkTables;
					oLT = new jLinkTable( o );
				});
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   forms
			 *
			 *  creates the required forms
			 *  for the grid
			 *
			 **  **  **  **  **  **  **  **  **  **/
			forms : function() {
				// create the edit form
				self.forms.oEditFrm = new jForm(
					{
						table : self.options.schema + '.' + self.options.table,
						dataView : self.options.schema + '.' + self.options.dbView,
						pkey : self.options.pkey,
						tableFriendly : self.options.tableFriendly,
						atts : { name : self.options.editFrmName },
						colParamsAdd : self.linkTables,
						disabledElements : self.options.disabledFrmElements
					}
				);

				// create the new form
				self.forms.oNewFrm = new jForm(
					{
						table : self.options.schema + '.' + self.options.table,
						dataView : self.options.schema + '.' + self.options.dbView,
						pkey : self.options.pkey,
						tableFriendly : self.options.tableFriendly,
						atts : { name : self.options.editFrmName },
						colParamsAdd : self.linkTables,
						disabledElements : self.options.disabledFrmElements
					}
				);

				// create the delete form
				self.forms.oDeleteFrm = new jForm(
					{
						table : self.options.schema + '.' + self.options.table,
						dataView : self.options.schema + '.' + self.options.dbView,
						pkey : self.options.pkey,
						tableFriendly : self.options.tableFriendly,
						loadExternal : false,
						atts : {
							name : self.options.delFormName || 'frm_deleteGrid', // + self.options.tableFriendly,
						},
						btns : [
							{ 'type' : 'button', 'class' : 'btn btn-success btn-go disabled', 	'id' : 'btn_go', 'value' : 'Go' },
							{ 'type' : 'button', 'class' : 'btn btn-danger btn-cancel', 'id' : 'btn_cancel', 'value' : 'Cancel' },
						],
						colParams : [
							{ 'type' : 'text', '_label' : 'Type yes to continue', 'name' : 'confirmation', 'id' : 'confirmation'  },
							{ 'type' : 'hidden', 'name' : self.options.pkey }
						],
						fieldset : {
							'legend' : 'Delete Record',
						}
					}
				);

				// create the colParams form
				self.forms.oColParamFrm = new jForm(
					{
						table : 'admin.colParam',
						dataView : 'admin.ColParam',
						pkey : 'ColParamID',
						tableFriendly : 'Column Parameters',
						btns : [],
						atts : {
							name : 'frm_element_editor',
						},
						fieldset : {
							'legend' : '3. Edit Column Parameters',
						}
					}
				);

				// create DOM handles for the form containers
				self.forms.$editFrm = $('<div/>').html( self.fn.render( self.html.tmpEditForm ) );
				self.forms.$newFrm = $('<div/>').html( self.fn.render( self.html.tmpNewForm, { tableFriendly : self.options.tableFriendly } ) );
				self.forms.$deleteFrm = $('<div/>').html( self.fn.render( self.html.tmpDeleteForm, { deleteText : self.options.deleteText } ) );
				self.forms.$colParamFrm = $('<div/>').html( self.fn.render( self.html.tmpColParamForm ) );

				// append the forms to the form containers
				self.forms.$editFrm.find('.editFormContainer').append( self.forms.oEditFrm.fn.handle() );
				self.forms.$newFrm.find('.newFormContainer').append( self.forms.oNewFrm.fn.handle() );
				self.forms.$deleteFrm.find('.delFormContainer').append( self.forms.oDeleteFrm.fn.handle() );
				self.forms.$colParamFrm.find('.colParamFormContainer').append( self.forms.oColParamFrm.fn.handle() );

				// add the form containers to the DOM
				tbl
				  .append( self.forms.$editFrm )
				  .append( self.forms.$newFrm  )
				  .append( self.forms.$deleteFrm )
				  .append( self.forms.$colParamFrm );

				// add custom forms specified at runTime
				_.each( self.options.formDefs, function( o, key ) {
					//console.log ('adding form ' + key);
					var $frmHandle = '$' + key,
						oFrmHandle = 'o' + key;

					if ( typeof self.html[key] === 'undefined' ) return false;

					// create form container
					self.forms[$frmHandle] = $('<div/>').html( self.fn.render( self.html[key] ) );

					// create form object
					self.forms[oFrmHandle] = new jForm( o );

					// append the form to the form container
					self.forms[$frmHandle].find( '.formContainer' ).append( self.forms[oFrmHandle].fn.handle() );

					// add the form to the DOM
					tbl.append( self.forms[$frmHandle]  );
				});
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   colParamSetup
			 *
			 *  Displays the form setup form so
			 *  an admin user can edit the form
			 *  colParams
			 *
			 **  **  **  **  **  **  **  **  **  **/
			colParamSetup : function() {
				$('.tbl-list,.col-list,.param-list').perfectScrollbar();
				$('.colParamFormContainer').hide();
				$('.btn-save').addClass('disabled');
				$.jStorage.flush();
				self.forms.oColParamFrm.fn.getColParams();
				self.action = 'colParam';

				// modal overlay
				self.fn.overlay(2,'on');

				var $target = tbl.find('#div_colParamFrm')
				self.fn.setupTargetDiv($target);

				// get table list
				if ( !!self.store.get( 'tableList', false ) ) {
					self.callback.getTableList(  self.store.get('tableList') );
				} else {
					var url = 'index.php?controller=ajax&view=getTableList';
					var data = {};

					$.getJSON( url
						, data
						, self.callback.getTableList
					).fail( function() {
						console.error('There was a problem getting the row data');
					}).always( function(response) {
						self.store.set('tableList',response);
					});
				}

			}, // end fn

			activityPreloader : function( action ) {
				if (action !== 'hide') {
					$('.ajax-activity-preloader').show();
				} else {
					$('.ajax-activity-preloader').hide();
				}
			}, //end fn

			getColumnList : function( tableName ) {

				// get column list
				if ( !!self.store.get( 'columnList' + tableName, false ) ) {
					self.callback.getTableList(  self.store.get( 'columnList' + tableName ) );
				} else {
					var url = 'index.php?controller=ajax&view=getColumnList';
					var data = { tableName : tableName };

					$.getJSON( url
						, data
						, self.callback.getColumnList
					).fail( function() {
						console.error('There was a problem getting the row data');
					}).always( function(response) {
						self.store.set( 'columnList' + tableName,response);
						self.store.setTTL( 'columnList' + tableName, 120);
					});
				}
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   countdown
			 *
			 *  Sets up the countdown that displays
			 *  the time remaining until the next
			 *  refresh
			 *
			 **  **  **  **  **  **  **  **  **  **/
			countdown : function( ) {
				if (!self.options.toggles.autoUpdate) { return false; }
				if (!!self.countdownInterval) {
					clearInterval(self.countdownInterval);
				}

				// data refresh interval
				self.countdownTimer = self.options.refreshInterval-2000;
				self.countdownInterval = setInterval( function() {
					tbl.find('button[name=btn_refresh_grid]').find('span').text( (self.countdownTimer > 0) ? Math.floor( self.countdownTimer / 1000) : 0 );
					self.countdownTimer -= 1000;
				},1000 );

			},

			/**  **  **  **  **  **  **  **  **  **
			 *   setup
			 *
			 *  sets up the AJAX request options
			 **  **  **  **  **  **  **  **  **  **/
			setup : function() {
				// setup the request
				self.requestOptions = {
					url : self.options.url,
					data : {
						dbView : self.options.schema + '.' + self.options.dbView,
						columns : self.options.columns,
						sortBy : self.options.sortBy,
						filter : self.options.filter,
						filterMine : 0
					}
				};

				self.ajaxVars = {
					url : self.options.url,
					type : 'POST'
				}
			},

			updateAll : function() {
				//console.log('updating all grids');

				_.each( jApp.oG, function(o, key) {
					//console.log('updating ' + key);
					o.fn.update();
				})
			}, //end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   update
			 *
			 *  executes the AJAX request
			 **  **  **  **  **  **  **  **  **  **/
			update : function( preload ) {
				// show the preload if needed
				if (!!preload) {
					self.fn.preload();
					self.fn.sI();
				}
				self.fn.countdown();

				// set up the request options
				if (typeof self.requestOptions === 'undefined' ) {
					self.fn.setup();
				}

				// kill the pending request if it's still going
				if (typeof self.ajaxRequests.gridData !== 'undefined') {
					self.ajaxRequests.gridData.abort();
				}

				// use cached copy, if available
				if ( self.options.toggles.caching && !!self.store.get('data_' + self.options.schema + '_' + self.options.dbView,false) ) {
					setTimeout( function() {
						self.callback.update( self.store.get('data_' + self.options.schema + '_' + self.options.dbView) );
					}, 100) ;
					self.fn.preload(true);
					//console.log('Rebuilding Menus');
					self.fn.buildMenus();
					//console.log('Request Complete.');
				} else {
					// show the preloader
					self.fn.activityPreloader('show');
					// execute the request
					self.ajaxRequests.gridData = $.getJSON(self.requestOptions.url,
							  self.requestOptions.data,
							  self.callback.update
					).fail( function() {
						console.warn( 'update grid data failed, it may have been aborted' );
					}).always( function(response) {
						//console.log(response);
						self.store.set('data_' + self.options.schema + '_' + self.options.dbView,response);
						//console.log( self.store.get('data_' + self.options.dbView) );
						self.fn.preload(true);
						//console.log('Rebuilding Menus');
						self.fn.buildMenus();
						//console.log('Request Complete.');
					}).complete(function() {
						self.fn.activityPreloader('hide');
					});
				}
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   updateDOM
			 *
			 *  interates through the changed data
			 *  and updates the appropriate DOM
			 *  elements. Updated DOM elements are
			 *  animated to highlight changes
			 *
			 **  **  **  **  **  **  **  **  **  **/
			updateDOM : function() {
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

						if (!!self.options.toggles.editable) {


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
											</div>'
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
					$.each( self.currentRow, function(key, value) {

						// determine if the column is hidden
						if ($.inArray(key,self.options.hidCols) !== -1) {
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
						value = self.fn.prepareValue(value,key);

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
				self.fn.colWidths();

				// animate changed cells

					// .stop()
					// .css("background-color", "#FFFF9C")
					// .animate({ backgroundColor: 'transparent'}, 1500, function() { $(this).removeAttr('style');  } );


				setTimeout( function() { tbl.find('.table-cell.changed').removeClass('changed') }, 2000 );


				self.fn.countdown();
				self.fn.page( self.options.pageNum );

				// deal with the row checkboxes
				tbl.find('.table-row')
					.filter(':not([data-identifier])')
						.find('.lbl-td-check').remove() // remove the checkbox if there is no primary key for the row
						.end()
					.end()
					.filter('[data-identifier]') // add the checkbox if there is a primary key for the row
					.each(function(i,elm) {
						if ( !!self.options.toggles.editable && $(elm).find('.lbl-td-check').length === 0 ) {
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

				self.fn.bind();

				//pagination
				if ( !!self.options.toggles.paginate ) {
					// update pagination
					self.totalPages = Math.ceil( self.oJSON.length / self.options.rowsPerPage );

					tbl.find('.paging').empty().show().bootpag({
						total : self.totalPages,
						page : 1,
						maxVisible : 20
					}).on("page", function(event,num) {
						self.fn.page(num);
					});

					// rows per page
					tbl.find('[name=RowsPerPage]').off('change.rpp').on('change.rpp', function() {
						tbl.find('[name=RowsPerPage]').val( $(this).val() );
						self.fn.rowsPerPage( $(this).val() );
					}).parent().show();

				} else {
					tbl.find('.paging').hide();
					tbl.find('[name=RowsPerPage]').parent().hide();
				}

				//self.fn.colWidths();


			},

			colWidths : function() {
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
									{'height' : +$(window).height()-425},
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
				self.fn.preload(true);
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   updateRowMenu
			 *
			 *  @tr - target table row element
			 *
			 *  Moves the row menu to the target
			 *  row and updates the menu forms
			 *  with the corresponding data.
			 **  **  **  **  **  **  **  **  **  **/
			updateRowMenu : function($tr) {
				//console.log('updating the row menu');

				// set the current row
				self.$currentRow = $tr;

				if (self.lastUpdatedRow == $tr.index()) { return false;}
				//row Menu
				self.$rowMenu.detach();

				//table row
				$tr.find('.table-cell .rowMenu-container').eq(0).append(self.$rowMenu);

				// update bindings
				self.fn.bind();

				// update lastUpdatedRow;
				self.lastUpdatedRow = $tr.index();

			},

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


				// iterate through each table cell

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

			/**  **  **  **  **  **  **  **  **  **
			 *   colSort
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
			colSort : function( colNum, desc ) {
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
				self.fn.page( self.options.pageNum );

				// apply header filters
				self.fn.applyHeaderFilter()
			},

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
				switch (self.action) {
					case 'edit' :
						return self.forms.oEditFrm;
					break;

					case 'delete' :
						return self.forms.oDeleteFrm;
					break;

					case 'new' :
						return self.forms.oNewFrm;
					break;

					case 'colParam' :
						return self.forms.oColParamFrm;
					break;

					default :
						if (typeof self.forms[ 'o' + self.action ]  !== 'undefined' ) {
							return self.forms[ 'o' + self.action ];
						}
					break;

				}
				console.warn( 'There is no valid form associated with the current action' );
				return false;
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
				if ( !!self.fn.oCurrentForm() ) {
					return self.fn.oCurrentForm().$();
				} else {
					return false;
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
				if (!!self.fn.oCurrentForm() ) {
					return self.fn.$currentForm().closest('.div-form-panel-wrapper');
				} else {
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
				var $hf_to, $emptyFilters, $matches, $temp, $tcol, $totalRows, $totalVis;

				//console.log('setting bindings.');

				// tooltips
				tbl.find('[title]').tooltip({delay:300});

				// read more links
				tbl.find('.btn-readmore').off('click.rm').on('click.rm', function()  {
					$(this).toggleClass('btn-success btn-warning');
					$(this).siblings('.readmore').toggleClass('active');
				});

				//pagination
				if ( !!self.options.toggles.paginate ) {
					// update pagination
					self.totalPages = Math.ceil( self.oJSON.length / self.options.rowsPerPage );

					tbl.find('.paging').empty().show().bootpag({
						total : self.totalPages,
						page : self.options.pageNum,
						maxVisible : 20
					}).on("page", function(event,num) {
						self.fn.page(num);
					});

					// rows per page
					tbl.find('[name=RowsPerPage]').off('change.rpp').on('change.rpp', function() {
						tbl.find('[name=RowsPerPage]').val( $(this).val() );
						self.fn.rowsPerPage( $(this).val() );
					}).parent().show();

				} else {
					tbl.find('.paging').hide();
					tbl.find('[name=RowsPerPage]').parent().hide();
				}

				// remove delete icons
				tbl.find('.deleteicon').remove();

				// header filter inputs
				if ( !!self.options.toggles.headerFilters ) {
					tbl.find('.table-head .tfilters').show();
					tbl.find('.header-filter')
						.after(
							// add the clear button to be displayed when text is entered
							$('<span/>', {'class':'deleteicon','style':'display:none'})
							.html(
								self.fn.render( self.html.tmpClearHeaderFilterBtn )
							)
							.off('click.deleteicon')
							.on('click.deleteicon', function() {
								//console.log('clicked')
								$(this).prev('input').val('').focus().trigger('keyup');
								self.fn.applyHeaderFilter();
							})
						).off('keyup.hf')
						.on( 'keyup.hf',function()  {
							// process the header filters

							( $(this).val() != '' ) ?
								$(this).next('.deleteicon').show() :
								$(this).next('.deleteicon').hide();


							if (typeof $hf_to !== 'undefined') { clearTimeout($hf_to); }
							$hf_to = setTimeout( self.fn.applyHeaderFilter, 300 );
						}) // end on keyup

					self.fn.applyHeaderFilter(); // trigger keyup to refresh the visible rows
				} else {
					tbl.find('.table-head .tfilters').hide();
				}

				// table sort buttons
				if (!!self.options.toggles.sort) {
					tbl.find('.tbl-sort').off('click.ts').on('click.ts', function() {
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
						self.fn.colSort( $btnIndex, $desc );
					});
				} else {
					tbl.find('.tbl-sort').hide();
				}

				// checkall checkbox
				$('.chk_all', tbl).off('change.chkall').on('change.chkall', function() {
					//console.log(tbl.find(':checkbox:visible').length);
					$(':checkbox:visible', tbl ).prop('checked',$(this).prop('checked'));
				});

				//individual checkboxes
				tbl.find('.chk_cid').off('change.chkcid').on('change.chkcid', function() {
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
				});

				// button bindings
				tbl.find('.btn-new').off('click.btn-new').on('click.btn-new', function() {
					self.action = 'new';
					// modal overlay
					self.fn.overlay(2,'on');

					//setup target div
					var $target = tbl.find('#div_newFrm');
					self.fn.setupTargetDiv($target);
				});

				tbl.find('.btn-edit').off('click.btn-edit').on('click.btn-edit', function() {
					//console.log('Editing Record');
					self.action = 'edit';

					//determine the id of the row so we can attempt to check it out.
					var $tr = self.$rowMenu.closest('.table-row'),
						id = $tr.attr('data-identifier');

					// check out the record
					if (!!self.options.toggles.checkout) {
						self.fn.checkout(id);
					} else {
						self.fn.overlay(2,'on');

						// setup target div
						var $target = tbl.find('#div_editFrm');
						self.fn.setupTargetDiv($target);
					}

					//setup target div
					//var $target = tbl.find('#div_editFrm');
					//self.fn.setupTargetDiv($target);
				});

				tbl.find('.btn-delete').off('click.btn-del').on('click.btn-del', function() {
					self.action = 'delete';

					//determine the id of the row so we can attempt to check it out.
					var $tr = self.$rowMenu.closest('.table-row'),
						id = $tr.attr('data-identifier');

					// check out the record
					if (!!self.options.toggles.checkout) {
						self.fn.checkout(id);
					} else {
						self.fn.overlay(2,'on');

						// setup target div
						var $target = tbl.find('#div_deleteFrm');
						self.fn.setupTargetDiv($target);
					}

					// setup target div
					//var $target = tbl.find('#div_deleteFrm');
					//self.fn.setupTargetDiv($target);
				});

				// hide the delete button if there is no pid
				(!self.$currentRow || !!self.$currentRow.attr('data-identifier')) ? tbl.find('.btn-delete').show() : tbl.find('.btn-delete').hide();

				// refresh button
				tbl.find('.btn-refresh').off('click.btn-refresh').on('click.btn-refresh', function() {
					var This = $(this);
					This.addClass('disabled');
					setTimeout( function() { This.removeClass('disabled') }, 2000 );
					self.fn.updateAll();
				});


				// row menu updates
				tbl.find('.table-body .table-row').off('mouseover.tr').on('mouseover.tr',function() {
					var $tr = $(this);

					clearTimeout(self.intervals.cancelRowMenuUpdate);
					self.intervals.updateRowMenu = setTimeout( function() {
						//console.log('do the thing');
						tbl.find('.btn-showMenu').removeClass('hover');
						if (tbl.find('.rowMenu').hasClass('expand') === false) {
							tbl.find('.btn-showMenu').removeClass('active');
						}
						$tr.find('.btn-showMenu').addClass('hover');

					}, 250 );
				}).off('mouseout.tr').on('mouseout.tr',function() {

					var $tr = $(this);
					clearTimeout(self.intervals.updateRowMenu);
					self.intervals.cancelRowMenuUpdate = setTimeout( function() {
						tbl.find('.btn-showMenu').removeClass('hover');
						if (!tbl.find('.rowMenu').hasClass('expand')) {
							$tr.find('.btn-showMenu').removeClass('active');
						}
						tbl.find('.rowMenu').removeClass('active');
					}, 100 );
				});

				// show menu button
				tbl.find('.btn-showMenu').off('click.btn-showMenu').on('click.btn-showMenu',function() {
					tbl.find('.rowMenu').removeClass('expand');
					var $tr = $(this).closest('.table-row');
					self.fn.updateRowMenu($tr);

					$(this).toggleClass('active rotate');
					if ( $(this).hasClass('rotate') ) {
						$(this).closest('.table-cell').find('.rowMenu').addClass('expand');
					}
					else {
						$(this).closest('.table-cell').find('.rowMenu').removeClass('expand');
					}
					tbl.find('.btn-showMenu').not(this).removeClass('rotate active');
				});

				self.fn.overlay(1,'off');
				self.fn.overlay(2,'off');
				return true; //console.log('bound');
			}, // end bind fn

			/**  **  **  **  **  **  **  **  **  **
			 *   setupTargetDiv
			 *
			 *  When a rowMenu button is clicked,
			 *  this function sets up the
			 *  corresponding div
			 **  **  **  **  **  **  **  **  **  **/
			setupTargetDiv : function($target) {
				// declare vars
				var $TI = $target.find('#TimeIn'),
					$TO = $target.find('#TimeOut'),
					$MTT = $target.find('#ManualTotalTime');

				self.hideOverlayOnError = false;

				// prevent accidentally navigating away while editing records
				$( window ).bind("beforeunload", function() {
					return 'You have unsaved changes.';
				});

				// reset form
				if ( $target.find('form').length > 0 ) { $target.find('form').clearForm(); }

				// set up the bindings
				$target.addClass('max') // maximize the panel

					//set focus
					.find(":input:not([type='hidden']):not([type='button'])").eq(0).focus().end().end()

					//reset validation stuff
					.find('.has-error').removeClass('has-error').end()
					.find('.has-success').removeClass('has-success').end()
					.find('.help-block').hide().end()
					.find('.form-control-feedback').hide().end()

					//multiselects
					.find('select').addClass('bsms').end()
					.find('.bsms').multiselect(self.options.bsmsDefaults).multiselect('refresh').end()

					// Format special input types
					.find('[validType="Phone Number"]').keyup( function() {  $(this).val( formatPhone( $(this).val() ) ); }).end()
					.find('[validType="Zip Code"]').keyup( 	function() {  $(this).val( formatZip( $(this).val() ) ); }).end()
					.find('[validType="SSN"]').keyup( 			function() {  var self = $(this); setTimeout( function() { self.val( formatSSN( self.val() ) ); }, 200); }).end()
					.find('[validType="color"]').keyup( 		function() {  $(this).css('background-color',$(this).val()); }).end()
					.find('[validType="Number"]').change( 		function() {  $(this).val( formatNumber( $(this).val() ) );	}).end()
					.find('[validType="Integer"]').change( 	function() {  $(this).val( formatInteger( $(this).val() ) ); }).end()
					.find('[validType="US State"]').change( 	function() {  $(this).val( formatUC( $(this).val() ) );	}).end()

					// button bindings
					.find('button.close,.btn-cancel').off('click.btn-cancel').on('click.btn-cancel', function() {
						if (!!self.options.toggles.checkout && self.action !== 'colParam')  {
							self.fn.checkin('all');

						} else {
							self.callback.checkin('Successful');
						}

					}).end()

					.find('.btn-go').off('click.btn-go').on('click.btn-go', function() {
						self.closeOnSave = true;
						var $target_btn = $(this);
						$target_btn.addClass('disabled');
						$.noty.closeAll();
						self.fn.ajaxSetupAction();
						self.fn.ajaxSubmit();
						setTimeout(function() {
							$target_btn.removeClass('disabled');
							tbl.find('.btn-showMenu.active').click();
						},2000 );
					}).end()

					.find('.btn-save').off('click.btn-go').on('click.btn-go', function() {
						self.closeOnSave = false;
						var $target_btn = $(this);
						$target_btn.addClass('disabled');
						$.noty.closeAll();
						self.fn.ajaxSetupAction();
						self.ajaxVars.success = self.fn.colParamSaveSuccess;
						self.fn.ajaxSubmit();

						$.jStorage.flush();
						self.forms.oColParamFrm.fn.getColParams();
						self.fn.updateColParamForm();

						setTimeout(function() {
							self.fn.getColumnList( self.temp.tableName );
							self.fn.oCurrentForm().fn.getRowData( self.temp.colParamID, self.fn.updateColParamForm );
							$target_btn.removeClass('disabled');
						},2000 );
					}).end()

					.find('.btn-reset').off('click.btn-reset').on('click.btn-reset', function() {
						self.fn.$currentForm().clearForm();
					}).end()

					.find('.btn-refreshForm').off('click.btn-refresh').on('click.btn-refresh', function() {
						$.jStorage.flush();
						self.forms.oColParamFrm.fn.getColParams();
						self.fn.updateColParamForm();
					}).end()

					// bind enter
					.find("input").off('keyup.bindEnter').on('keyup.bindEnter', function(e) {
						e.preventDefault();
						if(e.which === 13) {
							if ($target.find('#confirmation').length > 0 && $target.find('#confirmation').val() != 'yes') {
								nfx_thumbslide('./images/warning.png','Type yes to continue.','warning');
								return false;
							}
							tbl.find('.btn-go').trigger('click');
						}
						if(e.which === 27 || (e.keyCode !== "undefined" && e.keyCode === 27 )) {
							$target.find('.btn-cancel').trigger('click');
						}
					}).end()

					// Password2
					.find('#Password2').off('keyup.Password').on('keyup.Password', function() {
						if( $(this).val() == $target.find('#Password1').val() ) {
							$target.find('.btn-go').removeClass('disabled').attr('disabled',false);
						} else {
							$target.find('.btn-go').addClass('disabled').attr('disabled',true);
						}
					}).end()

					// confirmation
					.find('#confirmation').off('keyup.confirmation').on('keyup.confirmation', function() {
						if( $(this).val().toLowerCase() == 'yes' ) {
							$target.find('.btn-go').removeClass('disabled').attr('disabled',false);
						} else {
							$target.find('.btn-go').addClass('disabled').attr('disabled',true);
						}
					}).end()

					// link table form update
					.find('.lktbl').off('lktbl.change').on('lktbl.change', function() {
						_log($(this).val());
					}).end();

				// Date Time Fields
				if ($TO.val() != '') { $MTT.attr('disabled',true); } else { $MTT.attr('disabled',false); }
				if ($MTT.val() != '') { $TO.attr('disabled',true); } else { $TO.attr('disabled',false); }

				// Outage date
				$target.find("#OutageDate").datetimepicker({
					format: "YYYY-MM-DD HH:mm",
					pickTime:false
				});

				// TimeIn
				$TI.datetimepicker({
					useSeconds : false,
					sideBySide: true,
					format: "YYYY-MM-DD HH:mm"
				}).on("dp.change",function (e) {
					$TI.trigger('change');
				});

				// Time Out
				$TO.datetimepicker({
					useSeconds : false,
					sideBySide: true,
					format: "YYYY-MM-DD HH:mm"
				}).on("dp.change",function (e) {
				   $TO.trigger('change');
				}).off('change.to').on('change.to', function() {
					if ($TO.val() != '') { $MTT.attr('disabled',true); } else { $MTT.attr('disabled',false); }
				});

				//Manual Total Time
				$MTT.off('change.mtt').on('change.mtt',function() {
					if ($MTT.val() != '') { $TO.attr('disabled',true); } else { $TO.attr('disabled',false); }
				});

				//linked elements
				$target.find('[_linkedElmID]').off('change.linkedelm').on('change.linkedelm', function() {
					//console.log( 'Setting up linked Element' )
					var This = $(this),
						$col = This.attr('_linkedElmFilterCol'),
						$id	 = This.val(),
						$labels = This.attr('_linkedElmLabels'),
						$options = This.attr('_linkedElmOptions'),
						oFrm = self.fn.oCurrentForm(),
						oElm = oFrm.fn.getElmById( This.attr('_linkedElmID') );

					//console.log(oElm);

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

				}).change();

				//reset form elements in standard forms and blank existing values.
				_.each([ '$editFrm', '$newFrm', '$deleteFrm' ], function( v ) {
						self.forms[v].find(':input:not("[type=button]"):not("[type=submit]"):not("[type=reset]"):not("[type=radio]"):not("[type=checkbox]")').each( function (i,elm) {
						try {
							$(elm).data("DateTimePicker").remove();
							$(elm).val('');
							if ( $(elm).hasClass('bsms') ) {
								$(elm).multiselect(self.options.bsmsDefaults).multiselect('refresh');
							}
						}
						catch(ignore) {

						}
					});
				});

				// if editing
				if (self.action !== 'new') {
					var $tr = self.$rowMenu.closest('.table-row');

					//load the data for the row into the form
					var id = $tr.attr('data-identifier');
					var jsonkey = $tr.attr('data-jsonkey');

					//determine if this is an existing record
					if (!!id) {
						//console.log('Getting the row data');
						self.fn.oCurrentForm().fn.getRowData(id, self.callback.updateDOMFromRowData);

					} else if (!!jsonkey) {
						//console.log('No id, defaulting to json grid data');
						self.fn.oCurrentForm().callback.getRowData( [self.oJSON[ jsonkey ]] );
						self.fn.updatePanelHeader( self.oJSON[ jsonkey ][ self.options.columnFriendly ] );
					}
				}
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


			/**  **  **  **  **  **  **  **  **  **
			 *   applyHeaderFilter
			 *
			 *  filters the visible rows, displaying
			 *  only those which match the pattern(s)
			 *  entered in the header filters
			 *
			 **  **  **  **  **  **  **  **  **  **/
			applyHeaderFilter : function() {
				var $emptyFilters = true,
					$matches = [],
					$tcol,
					$temp,
					$totalRows,
					$totalVis


				//iterate through header filters and apply each
				tbl.find('.header-filter').each( function(i) {
					if ( $(this).val() != '' ) {
						$emptyFilters = false;
						$tcol = (self.options.toggles.editable) ? i+3 : i+2;

						$temp = tbl.find(".table-row .table-cell:nth-child(" + $tcol + "):contains('" + $(this).val() + "')").parent();

						$temp = $.map( $temp, function(obj, i) {
							return $(obj).index();
						});

						$matches = (!$matches.length) ?
							$temp :
							$.intersect($matches,$temp);
					}
				});

				if ($emptyFilters === false) {
					tbl.find('.divRowsPerPage, .paging').hide(); 	// hide rows per page and paging controls
					tbl.find('.table-body .table-row').hide();			// hide all rows

					// show appropriate rows
					tbl.find('.table-body .table-row').filter( function(i) {
						return $.inArray(i,$matches) !== -1;
					}).show();

					// update information about visible rows
					$totalRows = tbl.find('.table-body .table-row').length;
					$totalVis = $matches.length;
					tbl.find('.filter-showing').html(
						self.fn.render( self.html.tmpFilterShowing, { 'totalVis' : $totalVis, 'totalRows' : $totalRows } )
					);


					// update column widths
					self.fn.colWidths();
				}
				else if (!!self.options.toggles.paginate) { // filters are empty, reset everything
					// show the rows per page and paging controls
					tbl.find('.divRowsPerPage, .paging').show();

					// update information about visible rows
					tbl.find('.filter-showing').html('');

					// refresh the page with the current page number
					self.fn.page( self.options.pageNum );
				}
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   removeRows
			 *
			 *  inspects each row in the DOM and
			 *  looks for the corresponding row
			 *  in the JSON data. If the row is not
			 *  found in the JSON data it is removed
			 *  from the DOM.
			 **  **  **  **  **  **  **  **  **  **/
			removeRows : function(all) {
				if (typeof all === 'undefined' || !all) {

					tbl.find('.table-row[data-identifier]').each(function(i, elm) {
						var found = false;
						var $id = $(elm).attr('data-identifier');
						for(var row in self.oJSON) {
							if (self.oJSON[row][self.options.pkey] === $id) {
								found = true;
							}
						}
						if (!found) {
							self.$rowMenu.detach();
							$(elm).remove();
						}
					});
				} else {
					tbl.find('.table-body .table-row').remove();
				}
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
				if (!value || value.toLowerCase() === 'null') {
					return '';
				}

				if (!!self.options.templates[column]) {
					var template = self.options.templates[column];
					value = template(value);

				}

				if (value.indexOf('|') !== -1) {
					value = value.replace(/\|/gi,', ');
				}

				if (self.options.toggles.ellipses) {
					value = self.fn.ellipsis( value );
				}

				return value;
			}, // end fn

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
			 *  replace callbak self.fn.replacer.
			 *
			 *  e.g. {@ParamName} -> self.oJSON[row][ParamName]
			 **  **  **  **  **  **  **  **  **  **/
			interpolate : function(value) {
				return value.replace(/\{@(\w+)\}/gi, self.fn.replacer)
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

				self.fn.preload();

				if (isNaN(pageNum)) return false;
				pageNum = Math.floor(pageNum);

				self.options.pageNum = pageNum;
				first = +( (pageNum-1) * self.options.rowsPerPage );
				last  = +(first+self.options.rowsPerPage);
				tbl.find('.table-body .table-row').hide().slice(first,last).show();

				// set col widths
				setTimeout(	self.fn.colWidths, 100 );


			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   preload
			 *
			 *  @hide (bool) hide the preloader
			 *
			 *  show/hide the preload animation
			 **  **  **  **  **  **  **  **  **  **/
			preload : function( hide ) {
				if (typeof hide === 'undefined') { hide = false; }

				if (!hide) {
					tbl.css('background','url("./images/tbody-preload.gif") no-repeat center 175px rgba(0,0,0,0.15)')
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
				self.options.rowsPerPage = Math.floor(rowsPerPage);
				self.fn.bind();
				self.fn.page(1);
				self.fn.colWidths();
			}, // end fn

			visibleColumns : function( elm ) {
				var col = elm.data('column'),
					i = +elm.closest('li').index()+2;

				if (elm.find('i').hasClass('fa-check-square-o')) {
					elm.find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
					tbl.find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i +'), .table-body .table-cell:nth-child(' + i +')').hide();
				} else {
					elm.find('i').addClass('fa-check-square-o').removeClass('fa-square-o');
					tbl.find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i +'), .table-body .table-cell:nth-child(' + i +')').show();
				}

				self.fn.colWidths();

			}, //end fn

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
				var tmp, ptrn, key

				tmp = str;

				if (!!params && !$.isEmptyObject(params)) {
					for (key in params ) {
						ptrn = new RegExp( '\{@' + key + '\}', 'gi' );
						tmp = tmp.replace(ptrn, params[key] );
					}
				}
				return tmp.replace(/\{@.+\}/gi,'');
			}, //end fn

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

			/**  **  **  **  **  **  **  **  **  **
			 *   ajaxSetupAction
			 *  @form - the form object that will
			 *          be submitted
			 *
			 *  Sets up the ajax request
			 *   variables.
			 **  **  **  **  **  **  **  **  **  **/
			ajaxSetupAction : function() {
				var $data = self.fn.$currentForm().serialize();
				self.ajaxVars = { url: self.options.url, data: $data, type: 'POST', success: self.fn.ajaxSuccessAction };
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   ajaxSubmit
			 *
			 *  Calls the ajax function with the
			 *  request variables that have been
			 *  set up prior.
			 **  **  **  **  **  **  **  **  **  **/
			ajaxSubmit : function() {

				self.lastUpdatedRow = -1;

				if (!!self.fn.$currentForm()) {
					var oValidate = new oValidator( self.fn.$currentForm() );
					if (oValidate.errorState) {
						return false;
					}
				}

				// determine if the same request is being currently processed, should cut down on multiple accidental submissions
				var requestIndex = $.md5( escape(self.ajaxVars.data) ); // );
				if (typeof self.ajaxRequests[ requestIndex ] !== 'undefined' ) {
					self.ajaxRequests[ requestIndex ].abort();
				}
				if (self.ajaxVars.overlay && self.ajaxVars.overlay.toLowerCase() == 'off') {
					self.fn.overlay(2,'on');
				} else {
					self.fn.overlay(1,'on');
				}
				self.ajaxRequests[ requestIndex ] = $.ajax(self.ajaxVars).always( self.fn.bind );
			},

			/**  **  **  **  **  **  **  **  **  **
			 *    ajaxSuccessAction
			 *
			 *  @response - ajax response
			 *
			 *  Success callback function after
			 *  the action request has been made,
			 *  sets up and calls the update
			 *  request.
			 **  **  **  **  **  **  **  **  **  **/
			ajaxSuccessAction : function(response) {
				var type = (response.indexOf('Successful') !== -1) ? 'success' : 'warning';
				nfx_thumbslide('./images/' + type + '.png',response,type);
				if (type === 'success') {
					if ( !!self.options.toggles.checkout && self.action !== 'colParam' ) self.fn.checkin('all');
					if ( !!self.fn.oCurrentForm() && !!self.closeOnSave && !!self.fn.$currentFormWrapper ) {
						self.fn.$currentFormWrapper().removeClass('max');
						$( window ).unbind("beforeunload");
					}
					if (!!self.closeOnSave) {
						self.fn.overlay(2,'off');
					}
					self.fn.overlay(1,'off');
					self.fn.updateAll();
					tbl.find('.header-filter').each( function(i,elm){
						setTimeout( function() { $(elm).trigger('keyup');}, 300 );
					});
					setTimeout(function() {
						//$target_btn.removeClass('disabled');
						var $tr = tbl.find( '.btn-showMenu.active' ).closest('.table-row');

						tbl.find('.btn-showMenu.active').click();

						self.fn.updateRowMenu($tr);


					},500 );
				} else {
					if (self.hideOverlayOnError) {
						self.fn.overlay(1,'off');
					}
				}
			}, // end fn

			colParamSaveSuccess : function(response) {
				var type = (response.indexOf('Successful') !== -1) ? 'success' : 'warning';
				nfx_thumbslide('./images/' + type + '.png',response,type);

				self.fn.overlay(2,'on');
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   toggleMine
			 *
			 *  Toggles the display of only 'my'
			 *  objects (applications, servers,
			 *  etc.)
			 **  **  **  **  **  **  **  **  **  **/
			toggleMine : function() {
				if (self.$tblMenu.find('#toggleMine span').length === 0) return false;
				var tmp = self.$tblMenu.find('#toggleMine span').html();
				//console.log(tmp);

				if (!!self.requestOptions.data.filterMine) { // turn filter off
					self.removeAllRows = false;
					self.requestOptions.data.filterMine = 0;
					self.$tblMenu
						.find('#toggleMine')
							.find('span')
							.html( tmp.replace('All','My') )
						.end()
						.toggleClass('btn-success btn-warning');
					self.fn.updateAll();
				} else {
					self.removeAllRows = true;
					self.requestOptions.data.filterMine = 1;
					self.$tblMenu
						.find('#toggleMine')
							.find('span')
							.html( tmp.replace('My','All') )
						.end()
						.toggleClass('btn-success btn-warning');
					self.fn.updateAll();
				}
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

			withSelectedAction : function(action, callback, $cid) {

				if ($cid.length > 0) {
					switch(action) {

						// DELETE SELECTED
						case 'delete' :
							self.action = 'withSelectedDelete';
							bootbox.prompt("Are you sure you want to delete " + $cid.length + " items? Type your password to continue.", function(response) {
								var $data = 'frm_name=frm_deleteSelected&table=' + self.options.table  + '&cid=' + $cid.join('|') + '&pwd=' + response;
								self.ajaxVars = { url: self.url, data: $data, type: 'POST', success: self.fn.ajaxSuccessAction };
								self.fn.ajaxSubmit();
							});
						break;

						// MARK SELECTED COMPLETE - OUTAGE TASKS
						case 'markComplete' :
							bootbox.prompt("Are you sure you want to complete " + $cid.length + " tasks? Type yes to continue.", function(response) {
								if (response == 'yes') {
									tbl.find('.chk_cid:checked').each( function(i) {
										var $tr = $(this).closest('.table-row');
										var $jsonData = $.parseJSON( htmlspecialchars_decode( $tr.find('#hid_jsondata').html() ) );
										self.btn.completeTask($jsonData);
										//$row.find('#btn_menuBtn_0').trigger('click');
									});
								}
							});
						break;

						// ASSIGN SELECTED TO ME - OUTAGE TASKS
						case 'assignToMe' :
							bootbox.prompt("Are you sure you want to assign " + $cid.length + " tasks to you? Type yes to continue.", function(response) {
								if (response == 'yes') {
									tbl.find('.chk_cid:checked').each( function(i) {
										var $tr = $(this).closest('.table-row');
										var $jsonData = $.parseJSON( htmlspecialchars_decode( $tr.find('#hid_jsondata').html() ) );
										self.btn.assignToMe($jsonData);
									});
								}
							});
						break;

						// PROJECTS - VIEW

						// MARK SELECTED PROJECTS COMPLETE
						case 'completeProject' :
							bootbox.prompt("Are you sure you want mark " + $cid.length + " projects compelte? Type yes to continue.", function(response) {
								if (response == 'yes') {
									var $data = 'frm_name=frm_completeSelectedProjects&cid=' + $cid.join('|');
									self.ajaxVars = { url: self.url, data: $data, type: 'POST', success: self.fn.ajaxSuccessAction };
									self.fn.ajaxSubmit();
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
					nfx_thumbslide('./images/warning.png','Nothing selected.','warning');
				}
			}, //end fn

			updateColParamForm : function() {
				var oFrm = self.forms.oColParamFrm;
				var oElms = oFrm.oInpts;
				var tmp, type, allowedColParams;

				// hide or show based on value of _enabled
				if (oElms._enabled.fn.val() === 'yes') {
					oElms.type.fn.show().enable();

					// hide or show based on value of type
					type = oElms.type.fn.val();
					tmp = new jInput( { atts : { type : type } } );
					allowedColParams = _.union( tmp.allowedAtts[type], tmp.allowedColParams[type], tmp.globalAtts, tmp.globalColParams );
					allowedColParams = _.difference ( allowedColParams, tmp.disallowedColParams[type] );
					_.each( oElms, function(o,key) {
						if ( key === 'type' ||  _.indexOf( allowedColParams, key  ) !== -1) {
							//console.log('enabling ' + key)
							o.fn.show().enable();
						} else {
							//console.log('disabling ' + key)
							o.fn.hide().disable();
						}
					});
				} else {
					_.each( oElms, function(o,key) {
						if (key !== '_enabled') {
							o.fn.hide();
						}
					});
				}
			}, // end fn

			updateHeaderTitle : function(newTitle) {
				self.options.gridHeader.headerTitle = newTitle;
				tbl.find('span.header-title').html(newTitle);
			}, // end fn

			checkout : function(id) {
				//console.log('Checking out record');


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

			checkin : function(id) {
				//console.log('Checking in record');
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

			getCheckedOutRecords : function() {
				//console.log('Getting checked out records');
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

			/**  **  **  **  **  **  **  **  **  **
			 *   REPORTS
			 **  **  **  **  **  **  **  **  **  **/
			exportView : function() {
				var $url = window.location.href.replace(window.location.hash,'').replace('#','').split('/');
				$url.pop();
				$url = $url.join('/');
				window.open($url + '/export.php?report=currentView');
			},

			projectSummary : function() {
				var $url = window.location.href.replace(window.location.hash,'').replace('#','');
				$url.pop();
				$url = $url.join('/');
				window.open($url + '/export.php?report=projectSummary');
			},

			mgrReport : function($report,$filter) {
				var $url = window.location.href.replace(window.location.hash,'').replace('#','');
				$url.pop();
				$url = $url.join('/');
				window.open($url + '/export.php?report=' + $report + '&filter=' + $filter);
			}



		}; // end fn defs

		// add any functions to this.fn
		$.extend(true,this.fn,self.options.fn);

		/**  **  **  **  **  **  **  **  **  **
		 *   CALLBACK
		 *
		 *  Defines the callback functions
		 *  used by the various AJAX calls
		 **  **  **  **  **  **  **  **  **  **/
		this.callback = {

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
					self.fn.deltaData(self.oJSON,response) :
					response;

				// merge the changes into self.oJSON
				if (!!self.oDelta) {
					self.oJSON = response;
				} else { // abort if no changes in the data
					//console.log('no changes in the data');
					return false;
				}

				// remove all rows, if needed
				if (self.removeAllRows) {
					self.fn.removeRows(true);
				}

				// show the preloader, then update the contents
				self.fn.preload();

				// find the header row
				theaders = tbl.find('.table-head .table-row.colHeaders');

				// create the header row if needed
				if (!theaders.length) {
					tfilters = tbl.find('.table-row.tfilters');
					theaders = $('<div/>', {'class' : 'table-row colHeaders'});
					appendTH = true;

					// Append the check all checkbox
					if (!!self.options.toggles.editable) {
						theaders.append( $('<div/>', {'class' : 'table-header table-header-text'}).html( self.fn.render( self.html.tmpCheckAll ) ));
						//tbl.find('.tfilters .table-cell').eq(0).attr('colspan',2);
						//tbl.find('thead tr:last-child').attr('colspan',3);
					} else {
						//tbl.find('.tfilters .table-cell').eq(0).attr('colspan',1);
						//tbl.find('thead tr:last-child').attr('colspan',2);
					}

					// create header for this column if needed
					$.each( self.options.headers, function(i,v) {
						// determine if the current column is the active sortBy column
						isActive = (self.options.columns[i] === self.options.sortBy) ? true : false;

						// render the button
						btn = self.fn.render( self.html.tmpSortBtn, {
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
					tbl.find('.with-selected-menu').append( self.$withSelectedMenu.find('li') );
				}

				// update the DOM
				self.fn.updateDOM();

				// remove the rows that may have been removed from the data
				self.fn.removeRows();
				self.fn.buildMenus();
				self.fn.bind();
				self.fn.preload(true);
				self.removeAllRows = false;

				if (!self.loaded) {
					// custom init fn
					if ( self.fn.customInit && typeof self.fn.customInit === 'function' ) {
						self.fn.customInit();
					}
					self.loaded = true;
				}

				// adjust column widths
				self.fn.colWidths();

			}, // end fn

			updateDOMFromRowData : function(response) {
				if (!!response[0]) {
					var data = response[0];
					self.rowData = response[0];
					self.fn.updatePanelHeader( data[ self.options.columnFriendly ] );
				}
			}, // end fn

			getTableList : function(response) {
				var target = self.fn.$currentFormWrapper().find('.tbl-list');
				var ul = $('<ul/>', {class : 'list-group'});

				target.empty();

				_.each(response, function( o, key ) {
					$('<li/>', {class : 'list-group-item'})
						.append( $('<a/>', { href : '#' })
								.click( function(e) {
											$('.tbl-list').find('.list-group-item').removeClass('chosen');
											$(this).parent().addClass('chosen')
											e.preventDefault();
											self.temp.tableName = o.tableName;
											self.fn.getColumnList(o.tableName)
								}).html( o.tableName ) )
						.appendTo(ul);
				} );

				ul.appendTo(target);

				target.prepend( $('<h3/>').html('1. Choose Table') );

				target.perfectScrollbar('update');

			}, //end fn

			getColumnList : function(response) {
				var target = self.fn.$currentFormWrapper().find('.col-list');
				var ul = $('<ul/>', {class : 'list-group'});
				var prevFS = false;

				target.empty();

				_.each(response, function( o, key ) {
					if ( o.fieldset !== prevFS ) {
						if (prevFS !== false) {
							ul.appendTo(target);
						}
						ul = $('<ul/>', {class : 'list-group'});
					}

					$('<li/>', {class : 'list-group-item'})
						.append( $('<a/>', { href : '#' })
									.click( function(e) {
										$('.col-list').find('.list-group-item').removeClass('chosen');
										$(this).parent().addClass('chosen')
										e.preventDefault();
										$('.colParamFormContainer').show();
										$('.btn-save').removeClass('disabled');
										self.temp.colParamID = o.colParamID;
										self.fn.oCurrentForm().fn.getRowData(o.colParamID, self.fn.updateColParamForm ) ;

									} ).html( o.columnName ) )
						.appendTo(ul);

					prevFS = o.fieldset;
				} );

				ul.appendTo(target);
				target.prepend( $('<h3/>').html('2. Choose Column') );
				target.perfectScrollbar('update');

			}, //end fn

			checkout : function(response) {
				var type = (response.indexOf('Successful') !== -1) ? 'success' : 'warning';

				if (type === 'success') {
					//console.log('Checked out successfully.');
					// modal overlay
					self.fn.overlay(2,'on');

					var $target = (self.action === 'edit') ?
									tbl.find('#div_editFrm') :
									tbl.find('#div_deleteFrm');

					self.fn.setupTargetDiv($target);
				} else {
					//console.log('Problem checking out.');
					nfx_thumbslide('./images/' + type + '.png',response,type);
				}


			}, //end fn

			checkin : function(response) {
				var type = (response.indexOf('Successful') !== -1) ? 'success' : 'warning';

				if (type === 'success') {
					//console.log('Checked in successfully.');
					// modal overlay
					var $target = (self.action === 'edit') ?
									tbl.find('#div_editFrm') :
									tbl.find('#div_deleteFrm');

					$.noty.closeAll();
					self.fn.overlay(2,'off');
					self.fn.overlay(1,'off');
					if (!!self.fn.$currentFormWrapper() && typeof self.fn.$currentFormWrapper().removeClass !== 'undefined' ) {
						self.fn.$currentFormWrapper().removeClass('max');
						self.fn.$currentForm().clearForm();
					}
					tbl.find('.has-error').removeClass('has-error');

					$target.css('height','');
					$( window ).unbind("beforeunload");
				} else {
					//console.log('Problem checking in.');
					nfx_thumbslide('./images/' + type + '.png','There was a problem closing the record. Please try again.',type);
				}


			}, //end fn

			getCheckedOutRecords : function(response) {
				var $tr,  $i = $('<i/>', { class : 'fa fa-lock fa-fw checkedOut'});
				//console.log(response);

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

			linkTables : function( colParams ) {

				// add the colParams to the linkTable store
				self.linkTables = _.union( self.linkTables, colParams );

				// count the number of completed requests
				if ( !self.linkTableRequestsComplete ) {
					self.linkTableRequestsComplete = 1;
				} else {
					self.linkTableRequestsComplete++;
				}

				// once all linkTable requests are complete, apply the updates to the forms
				if (self.linkTableRequestsComplete == self.options.linkTables.length) {
					console.log('all linkTables in');

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

		// initialize
		this.fn._init();

	}; // end jGrid

	window.jGrid = jGrid;


})(window, jQuery, $, _, jInput, jForm, oValidator, jApp);
