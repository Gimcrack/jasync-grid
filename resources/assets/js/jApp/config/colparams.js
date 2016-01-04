/**
 * colparams.js
 *
 * Specify any default column parameters here
 */
;module.exports = {
  Group : [
    { // fieldset
      label : 'Group Details',
      helpText : 'Please fill out the following information about the group.',
      class : 'col-lg-4',
      fields : [
        {
          name : 'name',
          placeholder : 'e.g. Administrators',
          _label : 'Group Name',
          _enabled : true,
          required : true,
          'data-validType' : 'Anything',
        }, {
          name : 'description',
          type : 'textarea',
          _label : 'Description',
          _enabled : true
        }, {
          name : 'modules',
          type : 'select',
          _label : 'Assign roles/permissions to this group',
          _enabled : true,
          _labelssource : 'a|b|c|d',
          _optionssource : '1|2|3|4',
          multiple : true,
        }
      ]
    }, {
      class : 'col-lg-8',
      fields : [
        {
          name : 'users',
          type : 'array',
          _label : 'Add Users to this Group',
          _enabled : true,
          fields : [
            {
              name : 'users',
              type : 'select',
              _label : 'Select Users',
              _labelssource : 'a|b|c|d',
              _optionssource : '1|2|3|4',
              _enabled : true,
              multiple : true
            }, {
              name : 'comment[]',
              placeholder : 'Optional Comment',
              _enabled : true,
            }
          ]
        },
      ]
    }
  ]
}
