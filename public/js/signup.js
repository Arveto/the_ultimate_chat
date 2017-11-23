
'use strict'
function revealpass(fieldId) {
   var field = document.getElementById(fieldId);
   field.type = (field.type == "password") ? "text" : "password";
   field.focus();
   field.setSelectionRange(field.value.length, field.value.length);
}