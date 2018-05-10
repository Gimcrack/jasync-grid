/**
 * forms.js
 *
 * methods dealing with forms
 */

;module.exports = {
    /**
     * Form boot up function
     * @method function
     * @return {[type]} [description]
     */
    formBootup: function () {
        if (typeof jApp.aG().fn.formBootup === 'function') {
            jApp.aG().fn.formBootup();
        }

        jUtility.$currentFormWrapper()
        //reset validation stuff
            .find('.has-error').removeClass('has-error').end()
            .find('.has-success').removeClass('has-success').end()
            .find('.help-block').hide().end()
            .find('.form-control-feedback').hide().end()

        //multiselects
            .find('select:not(.no-bsms)').addClass('bsms').end()
            .find('.bsms').each(function (i, elm) {
            if (!!$(elm).data('no-bsms')) return;

            $(elm).data('jInput').fn.multiselect().fn.multiselectRefresh();
        }).end()
            .find('[data-tokens]').each(function () {
            if (!!$(this).data('tokenFieldSource')) {
                // $(this).tokenfield({
                //     autocomplete: {
                //         source: $(this).data('tokenFieldSource'),
                //         delay: 300
                //     },
                //     showAutoCompleteOnFocus: false,
                //     tokens: $(this).val() || []
                // });
                $(this).data('tokenFieldSource', null);
            }
            // var val = $(this).data('value').split('|') || []
            // $(this).tokenfield( 'setTokens', val );

        }).end()

            .find('[_linkedElmID]').change();


    }, //end fn

    /**
     * Refresh and rebuild the current form
     * @method function
     * @return {[type]} [description]
     */
    refreshCurrentForm: function () {
        jApp.aG().store.flush();
        jUtility.oCurrentForm().fn.getColParams();
    }, // end fn

    /**
     * Clear the current form
     * @method function
     * @return {[type]} [description]
     */
    resetCurrentForm: function () {
        try {
            jUtility.$currentForm().clearForm();
            jUtility.$currentForm().find(':input:not("[type=button]"):not("[type=submit]"):not("[type=reset]"):not("[type=radio]"):not("[type=checkbox]")')
                .each(function (i, elm) {
                    if (!!$(elm).attr('data-static')) {
                        return;
                    }

                    //$(elm).data("DateTimePicker").remove();
                    $(elm).val('');
                    if ($(elm).hasClass('bsms') && !$(elm).data('no-bsms')) {
                        $(elm).data('jInput').fn.multiselect();
                        $(elm).multiselect('refresh');
                    }
                });
        } catch (e) {
            console.warn(e);
            return;
        }
    }, // end fn

    /**
     * Does the meta data describe the current form?
     * @method function
     * @param  {[type]} meta [description]
     * @param  {[type]} oFrm [description]
     * @return {[type]}      [description]
     */
    doesThisMetaDataDescribeTheCurrentForm: function (meta) {
        var current = jUtility.oCurrentForm();

        return ( meta.action === jApp.aG().action ||
            (!!meta.model && !!current.model && meta.model === current.model ) );
    }, // end fn

    /**
     * Maximize the current form
     * @method function
     * @return {[type]} [description]
     */
    maximizeCurrentForm: function () {
        try {
            jApp.log('   maximizing the current form');
            jApp.log(jUtility.oCurrentForm());

            var openFormKey = null,
                openForm;

            if (jApp.openForms.length) {
                jApp.openForms.last().wrapper.removeClass('max')

                _.each(jApp.openForms, function (meta, key) {
                    if (jUtility.doesThisMetaDataDescribeTheCurrentForm(meta)) {
                        jApp.log('openFormKey ' + key);
                        openFormKey = key;
                        jApp.log(meta);
                        openForm = meta;
                    }
                })
            }

            if (openFormKey !== null && !!openForm) { // form is minimized, open it.
                jApp.openForms.splice(openFormKey, 1); // remove the element from the array
                jApp.openForms.push(openForm); // move the element to the end

            } else { // open a new form
                jApp.openForms.push({
                    wrapper: jUtility.$currentFormWrapper(),
                    obj: jUtility.oCurrentForm() || {},
                    $: jUtility.$currentForm(),
                    action: jApp.aG().action,
                    model: ( !!jUtility.oCurrentForm() ) ? jUtility.oCurrentForm().model : jUtility.getActionModel()
                });
            }

            // maximize the form and enable its buttons
            jApp.openForms.last().wrapper.addClass('max')
            //.find('button').prop('disabled',false);

        } catch (e) {
            console.warn(e);
            return;
        }
    }, // end fn

    /**
     * Exit the current form, checking in the record if needed
     * @method function
     * @return {[type]} [description]
     */
    exitCurrentForm: function () {
        if (jUtility.needsCheckin()) {
            return jUtility.checkin(jUtility.getCurrentRowId());
        }

        return jUtility.closeCurrentForm();
    }, // end fn

    /**
     * Close the current form
     * @method function
     * @return {[type]} [description]
     */
    closeCurrentForm: function () {

        try {
            var oTgt = jApp.openForms.pop();

            jApp.aG().action = ( jApp.openForms.length ) ?
                jApp.openForms.last().action : '';

            jUtility.msg.clear();

            oTgt.wrapper.removeClass('max')
                .find('.formContainer').css('height', '');
            oTgt.$.clearForm();

            if (!jApp.openForms.length) {
                jUtility.turnOffOverlays();
            } else {

                jApp.openForms.last().wrapper
                    .addClass('max')
                    .find('button').prop('disabled', false).end()
                    .find('.btn-refresh').trigger('click');
            }

        } catch (ignore) {
        }
    }, // end fn


    /**
     * Load Form Definitions
     * @method function
     * @return {[type]} [description]
     */
    loadFormDefinitions: function () {
        jApp.opts().formDefs = $.extend(true, {}, require('../forms'), jApp.opts().formDefs);
    }, //end fn

    /**
     * Save the current form and leave open
     * @method function
     * @return {[type]} [description]
     */
    saveCurrentForm: function () {
        jApp.opts().closeOnSave = false;
        jUtility.submitCurrentForm($(this));
    }, // end fn

    /**
     * Save the current form and close
     * @method function
     * @return {[type]} [description]
     */
    saveCurrentFormAndClose: function () {

        jApp.opts().closeOnSave = true;
        jUtility.submitCurrentForm($(this));
        //jUtility.toggleRowMenu;
    }, // end fn

    /**
     * Upload the file
     * @method function
     * @param  {[type]} $inpt [description]
     * @return {[type]}       [description]
     */
    uploadFile: function (inpt) {
        var formData = new FormData(), $btn, requestOptions;

        _.each(inpt.files, function (file, index) {
            formData.append(inpt.name, file, file.name);
        });


        $btn = jUtility.$currentFormWrapper().find('.btn-go');

        requestOptions = {
            url: jUtility.getCurrentFormAction(),
            data: formData,
            //fail : console.warn,
            always: function () {
                jUtility.toggleButton($btn);
            },
        };

        jUtility.postJSONfile(requestOptions);

        jUtility.toggleButton($btn);
    }, // end fn

    /**
     * Submit the current form
     * @method function
     * @return {[type]} [description]
     */
    submitCurrentForm: function ($btn) {
        var requestOptions = {
            url: jUtility.getCurrentFormAction(),
            data: jUtility.oCurrentForm().fn.getFormData(),
            success: jUtility.callback.submitCurrentForm,
            //fail : console.warn,
            always: function () {
                jUtility.toggleButton($btn);
            }
        };

        jUtility.msg.clear();

        if (!!jUtility.$currentForm()) {
            var oValidate = new $.validator(jUtility.$currentForm());
            if (oValidate.errorState) {
                return;
            }
        }

        // turn off the button to avoid multiple clicks;
        jUtility.toggleButton($btn);

        jUtility.postJSON(requestOptions);

    }, // end fn

    /**
     * Set focus on the current form
     * @method function
     * @return {[type]} [description]
     */
    setCurrentFormFocus: function () {
        jUtility.$currentFormWrapper().find(":input:not([type='hidden']):not([type='button'])").eq(0).focus();
    }, // end fn

    /**
     * Get the current form row data for the current row
     * @method function
     * @return {[type]} [description]
     */
    getCurrentFormRowData: function () {
        if (jApp.aG().action === 'new') return;
        var url = jUtility.getCurrentRowDataUrl();

        jUtility.oCurrentForm().fn.getRowData(url, jUtility.callback.updateDOMFromRowData);
    }, //end fn

    /**
     * Get the action of the current form
     * @method function
     * @return {[type]} [description]
     */
    getCurrentFormAction: function () {
        var action = jApp.aG().action;

        if (action.indexOf('edit') === 0 || action.indexOf('delete') === 0) {
            return jApp.routing.get(jUtility.getActionModel(), jUtility.getCurrentRowId());
        }

        switch (action) {
            case 'withSelectedDelete' :
                return jApp.routing.get(jUtility.getActionModel());

            case 'withSelectedUpdate' :
                return jApp.routing.get('massUpdate', jUtility.getActionModel());

            case 'resetPassword' :
                return jApp.routing.get('resetPassword/' + jUtility.getCurrentRowId());

            default :
                return jApp.routing.get(jUtility.oCurrentForm().options.model); //jApp.opts().table;
        }
    }, // end fn

    /**
     * Build all grid forms
     * @method function
     * @return {[type]} [description]
     */
    buildForms: function () {
        jUtility.loadFormDefinitions();

        _.each(jApp.opts().formDefs, function (o, key) {
            jUtility.DOM.buildForm(o, key);
        });

    },

    /**
     * formFactory
     *
     * build a new form for the model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    formFactory: function (model) {
        var colparams,
            key = 'edit' + model + 'frm',
            htmlkey = 'editOtherFrm',
            tableFriendly = model,
            formDef = {
                model: model,
                pkey: 'id',
                tableFriendly: model,
                atts: {method: 'PATCH'}
            },
            oFrm;

        if (!jApp.colparams[model]) {
            console.warn('there are no colparams available for ' + model);
            return;
        }

        // build the form
        oFrm = jUtility.DOM.buildForm(formDef, key, htmlkey, tableFriendly);

        // set up the form bindings
        jUtility.bind();

        return oFrm;
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
    oCurrentForm: function () {
        var key, tmpForms, tmpIndex, action = jApp.aG().action, model;

        if (!jUtility.needsForm()) return {};

        jApp.log(' Getting current form for action: ' + action, true);

        switch (jApp.aG().action) {
            case 'new' :
            case 'New' :
                return jApp.aG().forms.oNewFrm

            case 'edit' :
            case 'Edit' :
                return jApp.aG().forms.oEditFrm
        }

        // the form is not a standard form, try to find it from the current action

        // get an array of the form objects
        tmpForms = _.compact(_.map(jApp.aG().forms, function (o, key) {
            if (key.indexOf('o') === 0) return key; else return
        }));
        jApp.log('-- these are the forms', true);
        jApp.log(tmpForms, true);

        // try to find the action in the forms
        tmpIndex = _.findIndex(tmpForms, function (str) {
            return str.toLowerCase().indexOf(action.toLowerCase()) !== -1
        });
        jApp.log('-- the index of the current form ' + tmpIndex, true)

        if (tmpIndex > -1) {
            jApp.log('Found current form', true);
            jApp.log(jApp.aG().forms[tmpForms[tmpIndex]], true);
            return jApp.aG().forms[tmpForms[tmpIndex]];
        }

        // we don't have a form built yet, see if we have a form definition for the current action and build the form
        return jUtility.formFactory(jUtility.getActionModel());

        // if ( jUtility.isOtherButtonChecked() ) {
        //   model = jUtility.getOtherButtonModel();
        //   jApp.log('building a new form for model ' + model )
        //   model = jApp.aG().temp.actionModel;
        //   return jUtility.formFactory( model );
        // } else {
        //   console.warn('could not find the actionModel to build the form');
        // }
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
    $currentForm: function () {
        try {
            if (jUtility.needsForm()) {
                return jUtility.oCurrentForm().$();
            }
            return $('#div_inspect').find('.target');

        } catch (e) {
            console.warn('No current form object found');
            return;
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
    $currentFormWrapper: function () {
        try {
            return jUtility.$currentForm().closest('.div-form-panel-wrapper');
        } catch (e) {
            console.warn('No current form wrapper found');
            return;
        }
    },

    /**  **  **  **  **  **  **  **  **  **
     *   setupFormContainer
     *
     *  When a rowMenu button is clicked,
     *  this function sets up the
     *  corresponding div
     **  **  **  **  **  **  **  **  **  **/
    setupFormContainer: function () {
        jUtility.DOM.overlay(2, 'on');

        if (jUtility.needsForm()) {
            jApp.aG().hideOverlayOnError = false;
            jUtility.resetCurrentForm();
            jUtility.maximizeCurrentForm();
            jUtility.setCurrentFormFocus();
            jUtility.formBootup();
            jUtility.getCurrentFormRowData();
        } else {
            jUtility.DOM.inspectSelected();
        }
    }, // end fn

    /**
     * Prepare form data
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    prepareFormData: function (data) {
        var fd = new FormData();

        _.each(data, function (value, key) {
            fd.append(key, value);
        });

        return fd;

    }, // end fn
}
