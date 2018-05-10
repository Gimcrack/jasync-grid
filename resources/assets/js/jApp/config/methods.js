/**
 * methods.js
 *
 * jApp method definitions
 *
 */

;module.exports = function (self) {

    return {

        /**
         * Convenience function to access the active grid object
         * @method function
         * @return {[type]} [description]
         */
        aG: function () {
            return self.activeGrid
        }, // end fn

        /**
         * Add a view
         * @method function
         * @return {[type]} [description]
         */
        addView: function (name, viewDefinition, colparams) {
            var viewTarget = self.views,
                gridTarget = self.oG,
                tmp_name = name.split('.'),
                tmp_name_part,
                viewName;

            // drill down if applicable
            while (tmp_name.length > 1) {

                tmp_name_part = tmp_name.shift();
                jApp.log('name part ' + tmp_name_part);

                if (typeof viewTarget[tmp_name_part] === 'undefined') {
                    viewTarget[tmp_name_part] = {};
                }

                if (typeof gridTarget[tmp_name_part] === 'undefined') {
                    gridTarget[tmp_name_part] = {};
                }

                viewTarget = viewTarget[tmp_name_part];
                gridTarget = gridTarget[tmp_name_part];
            }

            // get the viewName
            viewName = tmp_name[0];

            // add the view function
            viewTarget[viewName] = function () {
                gridTarget[viewName] = new jGrid(viewDefinition);
            }

            // add the colparams
            self.colparams[viewDefinition.model] = colparams;

        }, // end fn

        /**
         * Prefix url with api route prefix
         * @method function
         * @param  {[type]} url [description]
         * @return {[type]}     [description]
         */
        prefixURL: function (url) {
            var parser,
                path = url;

            // handle well-formed urls
            if (url.indexOf('http:') === 0) {
                parser = document.createElement('a');
                parser.href = url;
                path = parser.pathname;
            }
            // remove the route prefix
            path = path.toString().replace(self.apiRoutePrefix, '');

            // add the route prefix
            path = self.apiRoutePrefix + '/' + path;

            // trim trailing and leading slashes and remove any double slashes
            path = path.split('/').filter(function (str) {
                if (!!str) return str;
            }).join('/');

            // add the location origin and return it
            return location.origin + '/' + path;
        }, // end fn

        /**
         * Get url relative to current url
         * @method function
         * @param  {[type]} url [description]
         * @return {[type]}     [description]
         */
        getRelativeUrl: function (url) {
            var parser,
                path = url;

            // handle well-formed urls
            if (url.indexOf('http:') === 0) {
                parser = document.createElement('a');
                parser.href = url;
                path = parser.pathname;
            }
            // remove the route prefix
            path = path.toString().replace(self.apiRoutePrefix, '');

            // trim trailing and leading slashes and remove any double slashes
            path = path.split('/').filter(function (str) {
                if (!!str) return str;
            }).join('/');

            // add the location origin and return it
            return location.origin + '/' + path;
        }, // end fn

        /**
         * Get the table from the corresponding model
         * @param  {[type]} model [description]
         * @return {[type]}       [description]
         */
        model2table: function (model) {

            var RuleExceptions = {
                Person: 'people'
            };

            return ( RuleExceptions[model] == null ) ?
                (model + 's').toLowerCase() :
                RuleExceptions[model];
        }, // end fn

        /**
         * Convenience function to access the $grid object
         * in the active grid
         * @method function
         * @return {[type]} [description]
         */
        tbl: function () {
            return self.activeGrid.DOM.$grid;
        }, // end fn


        /**
         * Convenience function to access the options
         * of the active grid
         * @method function
         * @return {[type]} [description]
         */
        opts: function () {
            return self.activeGrid.options;
        }, // end fn

        /**
         * Log a message
         * @method function
         * @param  {[type]} msg   [description]
         * @return {[type]}       [description]
         */
        log: function (...msg) {
            if (!!self.debug) {
                console.log(...msg);
            }
        }, // end fn

        /**
         * Log a warning message
         * @method function
         * @param  {[type]} msg   [description]
         * @param  {[type]} force [description]
         * @return {[type]}       [description]
         */
        warn: function (...msg) {
            if (!!self.debug) {
                console.warn(...msg);
            }
        }, // end fn


    }
};
