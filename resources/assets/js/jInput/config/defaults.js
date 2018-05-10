/**
 * default jInput Options
 *
 * Set the default options for the
 *  instance here. Any values specified
 *  at runtime will overwrite these
 *  values.
 *
 * @type Object
 */

;module.exports = {
	// html attributes
	atts : {
		type : 'text',
		class : 'form-control',
		name : 'input',
		_enabled : true
	},

	// DOM presentation options
	parent : $('<div/>', { 'class' : 'form_element has-feedback'}),

	// wrap - wrap the label and input elements with something e.g. <div></div>
	wrap : false,

	// separator - separate the label and input elements
	separator : true,

	// external data for options, etc.
	extData : false,

	// TTL for external data (mins)
	ttl : 10,

	// cache options locally
	cache : true,

	// hide if no options
	hideIfNoOptions : false,

	// multiselect defaults
	bsmsDefaults : {									// bootstrap multiselect default options
		//buttonContainer : '<div class="btn-group" />',
		enableCaseInsensitiveFiltering: true,
		includeSelectAllOption: true,
		maxHeight: 185,
		numberDisplayed: 1,
		dropUp: true
	},

};
