/**
 * messaging.js
 *
 * methods dealing with messaging
 */

;module.exports = {
    /**
     * Messaging functions
     * @type {Object}
     */
    msg: {

        dialog: function(options) {
            return bootbox.dialog(options);
        },

        noty : function() {
            return new Noty({
                theme : 'relax',
                layout: 'bottomLeft',
                type: 'info',
                text : 'Default Text',
                dismissQueue: true,
                timeout: 3000,
                callbacks : {
                    onTemplate: function() {
                        this.barDom.innerHTML = '<div class="my-custom-template noty_body">' + this.options.text + '<div>';
                        // Important: .noty_body class is required for setText API method.
                    }
                }
            });
        },

        /**
         * Clear all messages
         * @method function
         * @return {[type]} [description]
         */
        clear: function () {
            try {
                Noty.closeAll();
            } catch(error) {
                console.error(error);
            }
        }, // end fn

        /**
         * Show a message
         * @method function
         * @param  {[type]} message [description]
         * @param  {[type]} type    [description]
         * @return {[type]}         [description]
         */
        show: function (message, type, timeout) {
            let n = jUtility.msg.noty();

            n.setText(message, true);
            n.setType(type || 'info', true);
            n.setTimeout(timeout || 3000, true);

            n.show();

            return n;
        },

        /**
         * Display a success message
         * @method function
         * @param  {[type]} message [description]
         * @return {[type]}         [description]
         */
        success: function (message) {
            jUtility.msg.show(message, 'success');
        }, // end fn

        /**
         * Display a error message
         * @method function
         * @param  {[type]} message [description]
         * @return {[type]}         [description]
         */
        error: function (message) {
            jUtility.msg.show(message, 'error', 10000);
        }, // end fn

        /**
         * Display a warning message
         * @method function
         * @param  {[type]} message [description]
         * @return {[type]}         [description]
         */
        warning: function (message) {
            jUtility.msg.show(message, 'warning');
        }, // end fn

    },
};
