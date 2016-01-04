/**
 * templates.js
 *
 * html templates
 */

;module.exports = {

  // main grid body
  tmpMainGridBody : `<div class="row">
                      <div class="col-lg-12">
                        <div class="panel panel-info panel-grid panel-grid1">
                          <div class="panel-heading">
                            <h1 class="page-header"><i class="fa {@icon} fa-fw"></i><span class="header-title"> {@headerTitle} </span></h1>
                            <div class="alert alert-warning alert-dismissible helpText" role="alert"> <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> {@helpText} </div>
                          </div>
                          <div class="panel-body grid-panel-body">
                            <div class="table-responsive">
                              <div class="table table-bordered table-grid">
                                <div class="table-head">
                                  <div class="table-row table-menu-row">
                                    <div class="table-header table-menu-header" style="width:100%">
                                      <div class="btn-group btn-group-sm table-btn-group">  </div>
                                    </div>
                                  </div>
                                  <div style="display:none" class="table-row table-rowMenu-row"></div>
                                  <div class="table-row tfilters" style="display:none">
                                    <div style="width:10px;" class="table-header">&nbsp;</div>
                                    <div style="width:175px;" class="table-header" align="right"> <span class="label label-info filter-showing"></span> </div>
                                  </div>
                                </div>
                                <div class="table-body" id="tbl_grid_body">
                                  <!--{$tbody}-->
                                </div>
                                <div class="table-foot">
                                  <div class="row">
                                    <div class="col-md-3">
                                      <div style="display:none" class="ajax-activity-preloader pull-left"></div>
                                      <div class="divRowsPerPage pull-right">
                                        <select style="width:180px;display:inline-block" type="select" name="RowsPerPage" id="RowsPerPage" class="form-control">
                                          <option value="10">10</option>
                                          <option value="15">15</option>
                                          <option value="25">25</option>
                                          <option value="50">50</option>
                                          <option value="100">100</option>
                                          <option value="10000">All</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div class="col-md-9">
                                      <div class="paging"></div>
                                    </div>
                                  </div>
                                </div>
                                <!-- /. table-foot -->
                              </div>
                            </div>
                            <!-- /.table-responsive -->
                          </div>
                          <!-- /.panel-body -->
                        </div>
                        <!-- /.panel -->
                      </div>
                      <!-- /.col-lg-12 -->
                    </div>
                    <!-- /.row -->`,

  // check all checkbox template
  tmpCheckAll	: `<label for="chk_all" class="btn btn-default pull-right"> <input id="chk_all" type="checkbox" class="chk_all" name="chk_all"> </label>`,

  // header filter clear text button
  tmpClearHeaderFilterBtn : `<span class="fa-stack fa-lg"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-remove fa-stack-1x"></i></span>`,

  // filter showing ie Showing X / Y Rows
  tmpFilterShowing : `<i class="fa fa-filter fa-fw"></i>{@totalVis} / {@totalRows}`,

  // table header sort button
  tmpSortBtn : `<button rel="{@ColumnName}" title="{@BtnTitle}" class="btn btn-sm btn-default {@BtnClass} tbl-sort pull-right" type="button"> <i class="fa fa-sort-{@faClass} fa-fw"></i> </button>`,

  // form templates
  forms : {

    // Edit Form Template
    editFrm	: `<div id="div_editFrm" class="div-btn-edit min div-form-panel-wrapper">
                <div class="frm_wrapper">
                  <div class="panel panel-blue">
                    <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-pencil fa-fw"></i> <span class="spn_editFriendlyName">{@Name}</span> [Editing] </div>
                    <div class="panel-overlay" style="display:none"></div>
                    <div class="panel-body">
                      <div class="row side-by-side">
                        <div class="side-by-side editFormContainer formContainer"> </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`,

    // New Form Template
    newFrm	: `<div id="div_newFrm" class="div-btn-new min div-form-panel-wrapper">
                <div class="frm_wrapper">
                  <div class="panel panel-green">
                    <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-plus fa-fw"></i> New: <span class="spn_editFriendlyName">{@tableFriendly}</span> </div>
                    <div class="panel-overlay" style="display:none"></div>
                    <div class="panel-body">
                      <div class="row side-by-side">
                        <div class="side-by-side newFormContainer formContainer"> </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`,

    // New Form Template
    newOtherFrm	: `<div id="div_newFrm" class="div-btn-new min div-form-panel-wrapper">
                    <div class="frm_wrapper">
                      <div class="panel panel-info">
                        <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-plus fa-fw"></i> New: <span class="spn_editFriendlyName">{@tableFriendly}</span> </div>
                        <div class="panel-overlay" style="display:none"></div>
                        <div class="panel-body">
                          <div class="row side-by-side">
                            <div class="side-by-side newOtherFormContainer formContainer"> </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`,

    // Delete Form Template
    deleteFrm	: `<div id="div_deleteFrm" class="div-btn-delete min div-form-panel-wrapper">
                  <div class="frm_wrapper">
                    <div class="panel panel-red">
                      <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-trash-o fa-fw"></i> <span class="spn_editFriendlyName"></span> : {@deleteText} </div>
                      <div class="panel-overlay" style="display:none"></div>
                      <div class="panel-body">
                        <div class="row side-by-side">
                          <div class="delFormContainer formContainer"></div>
                        </div>
                      </div>
                    </div>
                    </form>
                  </div>
                </div>`,

    // Colparams Form Template
    colParamFrm	: `<div id="div_colParamFrm" class="div-btn-other min div-form-panel-wrapper">
                    <div class="frm_wrapper">
                      <div class="panel panel-lblue">
                        <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-gear fa-fw"></i> <span class="spn_editFriendlyName">Form Setup</span> </div>
                        <div class="panel-overlay" style="display:none"></div>
                        <div class="panel-body" style="padding:0 0px !important;">
                          <div class="row side-by-side">
                            <div class="col-lg-3 tbl-list"></div>
                            <div class="col-lg-2 col-list"></div>
                            <div class="col-lg-7 param-list">
                              <div class="side-by-side colParamFormContainer formContainer"> </div>
                            </div>
                          </div>
                        </div>
                        <div class="panel-heading"> <input type="button" class="btn btn-success btn-save" id="btn_save" value="Save"> <button type="reset" class="btn btn-warning btn-reset" id="btn_reset">Reset</button> <input type="button" class="btn btn-warning btn-refreshForm" id="btn_refresh" value="Refresh Form"> <input type="button" class="btn btn-danger btn-cancel" id="btn_cancel" value="Cancel"> </div>
                      </div>
                    </div>
                  </div>`,
  }
}
