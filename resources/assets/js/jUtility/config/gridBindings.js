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

  "button.close, .btn-cancel" : {
    click : jUtility.exitCurrentForm
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
      jApp.aG().$().find('.chk_cid').prop('checked',$(this).prop('checked'));
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
