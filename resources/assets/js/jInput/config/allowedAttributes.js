/**
 * Allowed attributes by input type
 * @type {Object}
 */
module.exports =  {
  date : 				['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
  datetime : 			['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
  'datetime-local' :	['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
  month : 			['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
  time : 				['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],
  week : 				['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','readOnly','required','step','type','value'],

  url : 				['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],
  text : 				['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],
  tokens :			['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],
  search : 			['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],

  number : 			['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','placeholder','readOnly','required','step','type','value'],
  range : 			['autocomplete','autofocus','defaultValue','disabled','form','list','max','min','name','step','type','value'],

  password : 			['autocomplete','autofocus','defaultValue','disabled','form','maxLength','name','pattern','placeholder','readOnly','required','size','type','value'],

  button : 			['autofocus','defaultValue','disabled','form','name','type','value'],
  reset : 			['autofocus','defaultValue','disabled','form','name','type','value'],
  submit : 			['autofocus','defaultValue','disabled','form','name','type','value'],

  radio : 			['autofocus','checked','defaultChecked','defaultValue','disabled','form','name','required','type','value'],
  checkbox : 			['autofocus','checked','defaultChecked','defaultValue','disabled','form','indeterminate','name','required','type','value'],

  file : 				['accept','autofocus','defaultValue','disabled','files','form','multiple','name','required','type','value'],

  hidden : 			['defaultValue','form','name','type','value','readonly'],

  image : 			['alt','autofocus','defaultValue','disabled','form','height','name','src','type','value','width'],

  select : 			['disabled','form','multiple','name','size','type','value','_linkedElmID','_linkedElmFilterCol','_linkedElmLabels','_linkedElmOptions'],

  textarea : 			['autofocus','cols','defaultValue','disabled','form','maxLength','name','placeholder','readOnly','required','rows','type','value','wrap'],

  color : 			['autocomplete','autofocus','defaultValue','disabled','form','list','name','type','value'],

  email : 			['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','multiple','name','pattern','placeholder','readOnly','required','size','type','value'],
  tel : 				['autocomplete','autofocus','defaultValue','disabled','form','list','maxLength','pattern','placeholder','readOnly','required','size','type','value'],
}; // end allowable attributes
