/**
 * gridBindings.js
 * @type {Object}
 *
 * Event bindings related to the grid
 */
;module.exports = {

  // the bind function will assume the scope is relative to the grid
  // unless the key is found in the global scope
  // boot functions will be automatically called at runtime
  window : {
    resize : function() {
      jUtility.timeout( {
        key : 'resizeTimeout',
        fn : jUtility.DOM.updateColWidths,
        delay : 500
      });
    },

    beforeunload : jUtility.unloadWarning,
  },

  ".table-grid" : {
    "scroll" : function() {
      jUtility.timeout( {
        key : 'tableGridScroll',
        fn : jUtility.DOM.pageWrapperScrollHandler,
        delay : 300
      });
    }
  },

  ".header-filter" : {
    keyup : function() {
      jUtility.toggleDeleteIcon( $(this) );

      jUtility.timeout( {
        key : 'applyHeaderFilters',
        fn : jUtility.DOM.applyHeaderFilters,
        delay : 300
      });

    },

    boot : jUtility.DOM.applyHeaderFilters
  },

  ".tbl-sort" : {
    click : function() {
      var $btn, $btnIndex, $desc;

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
      jApp.tbl().find('.tbl-sort i.fa-sort-amount-desc')
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

      jApp.tbl().find('.table-body .table-row').show();

      // perform the sort on the table rows
      jUtility.DOM.sortByCol( $btnIndex, $desc );
    }
  },

  ".btn-clear-search" : {
    click : function() {
      var $search = $(this).closest('div').find('#search');

      $search.val('').keyup();

    }
  },

  "#search" : {

    blur : function() {
      var val = $(this).val();

      if ( !! val.length ) {
        $(this)
          .closest('div').find('.btn-clear-search')
          .show();
      } else {
        $(this).animate({ width: 100}, 'slow')
          .closest('div').find('.btn-clear-search')
          .hide();
      }
    },

    keyup : function(e) {
      var delay = ( e.which === 13 ) ? 70 : 700,
          val = $(this).val();

      jApp.activeGrid.dataGrid.requestOptions.data['q'] = val;

      if ( !! val.length ) {
        $(this).animate({ width: 300}, 'slow')
          .closest('div').find('.btn-clear-search')
          .show();
      } else {
        $(this).animate({ width: 100}, 'slow')
          .closest('div').find('.btn-clear-search')
          .hide();
      }

      jUtility.timeout({
        key : 'updateGridSearch',
        delay : delay,
        fn : function() {
          $(this).focus();
          jUtility.executeGridDataRequest(true);
        }
      });

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
      jApp.tbl().find('[name=RowsPerPage]').val( $(this).val() );
      jUtility.DOM.rowsPerPage( $(this).val() );
    },
    boot : function() {
      if ( jUtility.isPagination() ) {
        $('[name=RowsPerPage]').parent().show();
      } else {
        $('[name=RowsPerPage]').parent().hide();
      }
    }
  },

  ".deleteicon" : {
    boot : function() {
      $(this).remove();
    },
    click : function() {
      $(this).prev('input').val('').focus().trigger('keyup');
      jUtility.DOM.applyHeaderFilters();
    }
  },

  ".chk_all" : {
    change : function() {
      var num_checked   = jApp.aG().$().find('.chk_cid:visible:checked').length,
          num_unchecked = jApp.aG().$().find('.chk_cid:visible:not(:checked)').length;

      jApp.aG().$().find('.chk_cid:visible').prop('checked', ( num_checked <= num_unchecked ) );
      $('.chk_cid').eq(0).change();
    }
  },

  ".chk_cid" : {
    change : function() {
      var $chk_all = jApp.tbl().find('.chk_all'),	// $checkall checkbox
        $checks = jApp.tbl().find('.chk_cid'), 	// $checkboxes
        total_num = $checks.length,	// total checkboxes
        num_checked = jApp.tbl().find('.chk_cid:checked').length;// number of checkboxes checked

      jUtility.DOM.updateRowMenu( num_checked );

      // set the state of the checkAll checkbox
      $chk_all
      .prop('checked', (total_num === num_checked) ? true : false )
      .prop('indeterminate', (num_checked > 0 && num_checked < total_num) ? true : false );

      if (!!num_checked) {
        $('.btn-editOther.active').removeClass('btn-default active').addClass('btn-link');
      }
    }
  },

  ".btn-chk" : {
    click : function() {
      $('.chk_cid:checked').prop('checked',false).eq(0).change();
      $(this).closest('.table-row').find('.chk_cid').click();
    }
  },

  ".btn-new" : {
    click : function() {
      jUtility.actionHelper('new');
    }
  },

  ".btn-edit" : {
    click : function() {
      if ( jUtility.isOtherButtonChecked() ) {
        return jUtility.actionHelper('edit' + jUtility.getOtherButtonModel() );
      }
      return jUtility.actionHelper('edit');
    }
  },

  ".btn-firstPage" : {
    click : function() {
      var data = jApp.activeGrid.dataGrid.requestOptions.data;

      data.page = 1;
      jUtility.executeGridDataRequest();
    },
  },

  ".btn-prevPage" : {
    click : function() {
      var data = jApp.activeGrid.dataGrid.requestOptions.data;

      data.page = ( isNaN(data.page) || data.page < 2 ) ? 1 : data.page-1;
      jUtility.executeGridDataRequest();
    },
  },

  ".btn-nextPage" : {
    click : function() {
      var data = jApp.activeGrid.dataGrid.requestOptions.data,
        last_page = jApp.activeGrid.dataGrid.last_page;

      data.page = ( isNaN(data.page) || data.page < 2 ) ? 2 : +data.page+1;
      data.page = ( data.page > last_page ) ? last_page : data.page;
      jUtility.executeGridDataRequest();
    },
  },

  ".btn-lastPage" : {
    click : function() {
      var data = jApp.activeGrid.dataGrid.requestOptions.data,
        last_page = jApp.activeGrid.dataGrid.last_page;

      data.page = last_page;
      jUtility.executeGridDataRequest();
    },
  },

  ".btn-collapseText" : {
    click : function() {
      jApp.opts().toggles.ellipses = ! jApp.opts().toggles.ellipses;
      $(this).toggleClass('active', jApp.opts().toggles.ellipses);
      jUtility.DOM.refreshGrid();
    }
  },

  ".btn-editOther" : {
    click : jUtility.DOM.editOtherButtonHandler
  },

  ".btn-inspect" : {
    click : function() {
      jUtility.actionHelper('inspect');
    }
  },

  ".btn-headerFilters" : {
    click : jUtility.DOM.toggleHeaderFilters
  },

  ".btn-delete" : {
    click : function() {
      jUtility.withSelected('delete');
    }
  },

  ".btn-clear" : {
    click : jUtility.DOM.clearSelection
  },

  ".btn-refresh" : {
    click : jUtility.DOM.refreshGrid
  },

  // ".btn-showMenu" : {
  //   click : jUtility.DOM.toggleRowMenu
  // },

  ".table-body" : {
    mouseover : function() {
      $(this).focus();
    }
  },
}
